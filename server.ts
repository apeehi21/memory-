import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Load Firebase configuration
const firebaseConfigPath = path.resolve(__dirname, 'firebase-applet-config.json');
let firebaseConfig: Record<string, string> = {};
if (fs.existsSync(firebaseConfigPath)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf-8'));
  } catch (e) {
    console.error('Error reading firebase-applet-config.json', e);
  }
}

// Dedicated Administrator Credentials (SECURE SERVER-SIDE ONLY - NEVER SENT TO CLIENT)
const ADMIN_SECRET_PATH = path.resolve(__dirname, 'server-admin-secret.json');
interface AdminSecretConfig {
  username: string;
  passwordHash: string;
  salt: string;
  sessionSecret: string;
  plainUsername: string; // for report output
  plainPassword: string; // for report output
  firebaseUid?: string;
}

let adminSecret: AdminSecretConfig;

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

if (fs.existsSync(ADMIN_SECRET_PATH)) {
  adminSecret = JSON.parse(fs.readFileSync(ADMIN_SECRET_PATH, 'utf-8'));
} else {
  // Generate unique administrator username and strong random password
  const uniqueUsername = 'admin_dilse';
  const randomSuffix = crypto.randomBytes(4).toString('hex');
  const generatedPassword = `DilSe#${randomSuffix}!2026`;
  const salt = crypto.randomBytes(16).toString('hex');
  const sessionSecret = crypto.randomBytes(32).toString('hex');

  adminSecret = {
    username: uniqueUsername,
    passwordHash: hashPassword(generatedPassword, salt),
    salt,
    sessionSecret,
    plainUsername: uniqueUsername,
    plainPassword: generatedPassword,
  };

  fs.writeFileSync(ADMIN_SECRET_PATH, JSON.stringify(adminSecret, null, 2), 'utf-8');
  console.log('✅ Generated dedicated administrator credentials securely.');
}

// Bootstrap Firebase Authentication for Admin
async function bootstrapFirebaseAdmin(): Promise<void> {
  const apiKey = firebaseConfig.apiKey;
  const projectId = firebaseConfig.projectId;
  const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';
  if (!apiKey || !projectId) return;

  const internalEmail = `${adminSecret.username}@internal.dilse.app`;
  const password = adminSecret.plainPassword;

  try {
    // 1. Try to sign up the internal admin user
    const signUpRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: internalEmail,
          password: password,
          returnSecureToken: true,
        }),
      }
    );
    const signUpData = await signUpRes.json();
    let idToken = signUpData.idToken;
    let localId = signUpData.localId;

    if (!idToken && signUpData.error?.message === 'EMAIL_EXISTS') {
      // User exists, sign in
      const signInRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: internalEmail,
            password: password,
            returnSecureToken: true,
          }),
        }
      );
      const signInData = await signInRes.json();
      idToken = signInData.idToken;
      localId = signInData.localId;
    }

    if (localId && idToken) {
      adminSecret.firebaseUid = localId;
      fs.writeFileSync(ADMIN_SECRET_PATH, JSON.stringify(adminSecret, null, 2), 'utf-8');

      // Create /admins/{localId} document in Firestore for ABAC rule matching
      const docUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/admins/${localId}`;
      await fetch(docUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          fields: {
            uid: { stringValue: localId },
            username: { stringValue: adminSecret.username },
            role: { stringValue: 'admin' },
            createdAt: { timestampValue: new Date().toISOString() },
          },
        }),
      });
      console.log('✅ Firebase Admin Auth & Firestore role bootstrapped successfully. UID:', localId);
    }
  } catch (err) {
    console.warn('Note on Firebase Auth Admin bootstrap:', err);
  }
}

bootstrapFirebaseAdmin();

// In-memory active tokens
const activeSessions = new Map<string, { username: string; expiresAt: number }>();

function createSessionToken(username: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeSessions.set(token, { username, expiresAt });
  return token;
}

function verifySession(token?: string): boolean {
  if (!token) return false;
  const session = activeSessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

// ---------------- API ROUTES ----------------

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response): void => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  const trimmedUser = String(username).trim();
  const inputHash = hashPassword(String(password), adminSecret.salt);

  if (trimmedUser === adminSecret.username && inputHash === adminSecret.passwordHash) {
    const token = createSessionToken(trimmedUser);
    res.json({
      success: true,
      token,
      username: adminSecret.username,
    });
    return;
  }

  res.status(401).json({ error: 'Galat username ya password! Kripya dobara check karein.' });
});

// Admin Verify Session
app.get('/api/admin/verify', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (verifySession(token)) {
    res.json({ valid: true, username: adminSecret.username });
  } else {
    res.status(401).json({ valid: false });
  }
});

// Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  if (token) {
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';

const firebaseApp = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Dual-write sync endpoint for visitor responses
app.post('/api/visitor/sync', async (req: Request, res: Response): Promise<void> => {
  const { visitorId, data } = req.body;
  if (!visitorId || !data) {
    res.status(400).json({ error: 'visitorId and data are required' });
    return;
  }

  try {
    const docRef = doc(firestoreDb, 'visitors', visitorId);
    const payload = {
      ...data,
      visitorId,
      updatedAt: new Date().toISOString(),
    };
    if (!data.createdAt) {
      payload.createdAt = new Date().toISOString();
    }
    await setDoc(docRef, payload, { merge: true });
    res.json({ success: true });
  } catch (err) {
    console.error('Error syncing visitor on server:', err);
    res.status(500).json({ error: 'Failed to sync visitor' });
  }
});

// Get all visitors (Protected for Admin Dashboard)
app.get('/api/admin/visitors', async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!verifySession(token)) {
    res.status(401).json({ error: 'Unauthorized access to admin data' });
    return;
  }

  try {
    const snap = await getDocs(collection(firestoreDb, 'visitors'));
    const formatted: any[] = [];

    snap.forEach((d) => {
      const data = d.data();
      const formatTimestamp = (val: any) => {
        if (!val) return undefined;
        if (typeof val.toDate === 'function') {
          return val.toDate().toISOString();
        }
        if (val.seconds) {
          return new Date(val.seconds * 1000).toISOString();
        }
        return val;
      };

      formatted.push({
        visitorId: data.visitorId || d.id,
        visitorName: data.visitorName || 'Unknown',
        snapchatAnswer: data.snapchatAnswer,
        snapchatId: data.snapchatId,
        memoryAnswer: data.memoryAnswer,
        memoryFollowUp: data.memoryFollowUp,
        personalMessage: data.personalMessage,
        finalAnswer: data.finalAnswer,
        completionStatus: data.completionStatus || 'in_progress',
        currentScene: data.currentScene || 1,
        createdAt: formatTimestamp(data.createdAt),
        updatedAt: formatTimestamp(data.updatedAt),
      });
    });

    // Sort descending by updatedAt / createdAt
    formatted.sort((a: any, b: any) => {
      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    res.json({ visitors: formatted });
  } catch (error) {
    console.error('Error in /api/admin/visitors:', error);
    res.status(500).json({ error: 'Failed to retrieve visitors' });
  }
});

// Delete visitor (Protected for Admin Dashboard)
app.delete('/api/admin/visitor/:id', async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!verifySession(token)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const visitorId = req.params.id;
  try {
    await deleteDoc(doc(firestoreDb, 'visitors', visitorId));
    res.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// ---------------- DEV & PROD SETUP ----------------

async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Dil Se server listening on port ${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
