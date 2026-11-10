import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { VisitorData } from '../types';

const SESSION_STORAGE_KEY = 'dilse_visitor_session';

export function getLocalSession(): Partial<VisitorData> | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveLocalSession(data: Partial<VisitorData>): void {
  try {
    const existing = getLocalSession() || {};
    const merged = { ...existing, ...data };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(merged));
  } catch (err) {
    console.error('Failed to save session to localStorage', err);
  }
}

async function syncWithServer(visitorId: string, data: Record<string, unknown>): Promise<void> {
  try {
    await fetch('/api/visitor/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId, data }),
    });
  } catch (err) {
    // Background sync error
  }
}

export async function createVisitorRecord(visitorId: string, visitorName: string): Promise<void> {
  saveLocalSession({
    visitorId,
    visitorName: visitorName.trim(),
    completionStatus: 'in_progress',
    currentScene: 1,
  });

  // Dual write: Server sync + Client Firestore SDK
  syncWithServer(visitorId, {
    visitorId,
    visitorName: visitorName.trim(),
    completionStatus: 'in_progress',
    currentScene: 1,
  });

  try {
    const docRef = doc(db, 'visitors', visitorId);
    await setDoc(
      docRef,
      {
        visitorId,
        visitorName: visitorName.trim(),
        completionStatus: 'in_progress',
        currentScene: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Firestore client setDoc notice:', error);
  }
}

export async function updateVisitorRecord(visitorId: string, partial: Partial<VisitorData>): Promise<void> {
  // Save locally immediately
  saveLocalSession(partial);

  // Sanitize fields so no unexpected or undefined fields are sent
  const payload: Record<string, unknown> = {};

  if (partial.visitorName !== undefined) payload.visitorName = partial.visitorName;
  if (partial.snapchatAnswer !== undefined) payload.snapchatAnswer = partial.snapchatAnswer;
  if (partial.snapchatId !== undefined) {
    payload.snapchatId = partial.snapchatId.trim();
  }
  if (partial.memoryAnswer !== undefined) payload.memoryAnswer = partial.memoryAnswer;
  if (partial.memoryFollowUp !== undefined) {
    payload.memoryFollowUp = partial.memoryFollowUp.trim();
  }
  if (partial.personalMessage !== undefined) {
    payload.personalMessage = partial.personalMessage.trim();
  }
  if (partial.finalAnswer !== undefined) payload.finalAnswer = partial.finalAnswer;
  if (partial.completionStatus !== undefined) payload.completionStatus = partial.completionStatus;
  if (partial.currentScene !== undefined) payload.currentScene = partial.currentScene;

  // Dual write: Server sync immediately
  syncWithServer(visitorId, payload);

  try {
    const docRef = doc(db, 'visitors', visitorId);
    await setDoc(
      docRef,
      {
        ...payload,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Firestore client updateDoc notice:', error);
  }
}

export async function fetchVisitorRecord(visitorId: string): Promise<VisitorData | null> {
  try {
    const docRef = doc(db, 'visitors', visitorId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as VisitorData;
    }
    return null;
  } catch (error) {
    return null;
  }
}
