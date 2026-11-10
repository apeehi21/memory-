import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ParticleBackground } from './components/ParticleBackground';
import { MusicPlayer } from './components/MusicPlayer';
import { ThreeDotMenu } from './components/ThreeDotMenu';
import { Scene1NameEntry } from './components/scenes/Scene1NameEntry';
import { Scene2Greeting } from './components/scenes/Scene2Greeting';
import { Scene3Intro } from './components/scenes/Scene3Intro';
import { Scene4Snapchat } from './components/scenes/Scene4Snapchat';
import { Scene5Shayari } from './components/scenes/Scene5Shayari';
import { Scene6Memory } from './components/scenes/Scene6Memory';
import { Scene7PersonalMessage } from './components/scenes/Scene7PersonalMessage';
import { Scene8Proposal } from './components/scenes/Scene8Proposal';
import { Scene9Celebration } from './components/scenes/Scene9Celebration';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  getLocalSession,
  createVisitorRecord,
  updateVisitorRecord,
} from './lib/firestoreService';
import { SceneId } from './types';

export default function App() {
  const [visitorId, setVisitorId] = useState<string>('');
  const [visitorName, setVisitorName] = useState<string>('');
  const [currentScene, setCurrentScene] = useState<SceneId>(1);
  const [finalProposalAnswer, setFinalProposalAnswer] = useState<'YES' | 'NO' | null>(null);

  // View state: 'scene' | 'admin_login' | 'admin_dashboard'
  const [viewMode, setViewMode] = useState<'scene' | 'admin_login' | 'admin_dashboard'>('scene');

  // Admin authentication state
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUsername, setAdminUsername] = useState<string>('admin123');

  // Load existing session on boot
  useEffect(() => {
    const saved = getLocalSession();
    if (saved?.visitorId) {
      setVisitorId(saved.visitorId);
    } else {
      const newId = `vis_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
      setVisitorId(newId);
    }

    if (saved?.visitorName) {
      setVisitorName(saved.visitorName);
      // If visitor has already entered name previously, start from Scene 2
      if (saved.currentScene && saved.currentScene > 1) {
        setCurrentScene(saved.currentScene as SceneId);
      } else {
        setCurrentScene(2);
      }
    }

    if (saved?.finalAnswer) {
      setFinalProposalAnswer(saved.finalAnswer);
    }

    // Check existing admin session
    const storedToken = sessionStorage.getItem('dilse_admin_token');
    const storedUser = sessionStorage.getItem('dilse_admin_user');
    if (storedToken) {
      setAdminToken(storedToken);
      if (storedUser) setAdminUsername(storedUser);
    }
  }, []);

  // Scene 1: Name Submitted
  const handleNameSubmit = async (name: string) => {
    setVisitorName(name);
    setCurrentScene(2);
    await createVisitorRecord(visitorId, name);
    await updateVisitorRecord(visitorId, { currentScene: 2 });
  };

  // Scene 2 -> Scene 3
  const handleGreetingContinue = () => {
    setCurrentScene(3);
    updateVisitorRecord(visitorId, { currentScene: 3 });
  };

  // Scene 3 -> Scene 4
  const handleIntroContinue = () => {
    setCurrentScene(4);
    updateVisitorRecord(visitorId, { currentScene: 4 });
  };

  // Scene 4: Snapchat
  const handleSnapchatSubmit = (answer: string, snapId?: string) => {
    setCurrentScene(5);
    updateVisitorRecord(visitorId, {
      snapchatAnswer: answer,
      snapchatId: snapId,
      currentScene: 5,
    });
  };

  // Scene 5: Shayari
  const handleShayariContinue = () => {
    setCurrentScene(6);
    updateVisitorRecord(visitorId, { currentScene: 6 });
  };

  // Scene 6: Memory
  const handleMemorySubmit = (choice: string, followUp: string) => {
    setCurrentScene(7);
    updateVisitorRecord(visitorId, {
      memoryAnswer: choice,
      memoryFollowUp: followUp,
      currentScene: 7,
    });
  };

  // Scene 7: Personal Message
  const handlePersonalMessageSubmit = (message: string) => {
    setCurrentScene(8);
    updateVisitorRecord(visitorId, {
      personalMessage: message,
      currentScene: 8,
    });
  };

  // Scene 8: Final Proposal (YES or NO)
  const handleProposalAnswer = (answer: 'YES' | 'NO') => {
    setFinalProposalAnswer(answer);
    setCurrentScene(9);
    updateVisitorRecord(visitorId, {
      finalAnswer: answer,
      completionStatus: 'completed',
      currentScene: 9,
    });
  };

  // Replay Experience (starts from Scene 2, preserves name and session)
  const handleReplay = () => {
    setCurrentScene(2);
    setViewMode('scene');
    updateVisitorRecord(visitorId, { currentScene: 2 });
  };

  // Open Admin Login
  const handleOpenAdminLogin = () => {
    if (adminToken) {
      setViewMode('admin_dashboard');
    } else {
      setViewMode('admin_login');
    }
  };

  // Admin Login Successful
  const handleAdminLoginSuccess = (token: string, username: string) => {
    setAdminToken(token);
    setAdminUsername(username);
    setViewMode('admin_dashboard');
  };

  // Admin Logout
  const handleAdminLogout = () => {
    sessionStorage.removeItem('dilse_admin_token');
    sessionStorage.removeItem('dilse_admin_user');
    setAdminToken(null);
    setViewMode('scene');
  };

  // Back from Admin Login or Dashboard
  const handleBackFromAdmin = () => {
    setViewMode('scene');
  };

  // Three-dot menu visibility:
  // Hidden during earlier scenes (1-7), displayed AFTER visitor selects either YES or NO (Scene 8, 9, 10)
  const isProposalAnswered = finalProposalAnswer !== null || currentScene >= 9;
  const showThreeDot = isProposalAnswered && viewMode === 'scene';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a000b] via-[#2d0515] to-[#12000a] text-white selection:bg-rose-500 selection:text-white flex flex-col justify-between relative overflow-x-hidden font-sans">
      {/* Cinematic Glowing Particle & Floating Heart Canvas */}
      <ParticleBackground />

      {/* Top Ambient Music Toggle */}
      <MusicPlayer />

      {/* Top-Right Discreet Three-Dot Menu (shown after YES/NO) */}
      <ThreeDotMenu isVisible={showThreeDot} onOpenAdmin={handleOpenAdminLogin} />

      {/* Main Content Viewport */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 w-full relative">
        <AnimatePresence mode="wait">
          {viewMode === 'admin_login' && (
            <AdminLogin
              key="admin-login"
              onLoginSuccess={handleAdminLoginSuccess}
              onBack={handleBackFromAdmin}
            />
          )}

          {viewMode === 'admin_dashboard' && adminToken && (
            <AdminDashboard
              key="admin-dashboard"
              token={adminToken}
              adminUsername={adminUsername}
              onLogout={handleAdminLogout}
              onBackToSite={handleBackFromAdmin}
            />
          )}

          {viewMode === 'scene' && (
            <div key="scene-container" className="w-full">
              {currentScene === 1 && (
                <Scene1NameEntry onContinue={handleNameSubmit} />
              )}

              {currentScene === 2 && (
                <Scene2Greeting
                  visitorName={visitorName}
                  onContinue={handleGreetingContinue}
                />
              )}

              {currentScene === 3 && (
                <Scene3Intro
                  visitorName={visitorName}
                  onContinue={handleIntroContinue}
                />
              )}

              {currentScene === 4 && (
                <Scene4Snapchat onContinue={handleSnapchatSubmit} />
              )}

              {currentScene === 5 && (
                <Scene5Shayari onContinue={handleShayariContinue} />
              )}

              {currentScene === 6 && (
                <Scene6Memory onContinue={handleMemorySubmit} />
              )}

              {currentScene === 7 && (
                <Scene7PersonalMessage
                  visitorName={visitorName}
                  onContinue={handlePersonalMessageSubmit}
                />
              )}

              {currentScene === 8 && (
                <Scene8Proposal
                  visitorName={visitorName}
                  onAnswer={handleProposalAnswer}
                />
              )}

              {currentScene >= 9 && (
                <Scene9Celebration
                  answer={finalProposalAnswer || 'YES'}
                  visitorName={visitorName}
                  onReplay={handleReplay}
                />
              )}
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Subtle Romantic Footer */}
      <footer className="py-4 text-center text-xs text-pink-300/40 z-10 pointer-events-none">
        <span>Dil Se ❤️ • A Magical Interactive Journey</span>
      </footer>
    </div>
  );
}
