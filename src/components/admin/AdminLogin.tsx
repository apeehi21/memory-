import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Eye, EyeOff, ArrowLeft, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string, username: string) => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Username aur password dono bharna zaroori hai.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          sessionStorage.setItem('dilse_admin_token', data.token);
          sessionStorage.setItem('dilse_admin_user', data.username);
          onLoginSuccess(data.token, data.username);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Backend route unreachable (e.g. static hosting on Vercel)
    }

    // Direct credentials verification fallback for static deployment
    if (username.trim() === 'admin123' && password === 'himesh143') {
      const token = 'admin_session_' + Date.now().toString(36);
      sessionStorage.setItem('dilse_admin_token', token);
      sessionStorage.setItem('dilse_admin_user', 'admin123');
      onLoginSuccess(token, 'admin123');
    } else {
      setError('Galat username ya password! Kripya dobara check karein.');
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto px-4 py-8"
    >
      <div className="relative backdrop-blur-2xl bg-gradient-to-b from-slate-900/90 to-black/95 border border-pink-500/30 rounded-3xl p-8 sm:p-10 shadow-[0_0_60px_rgba(244,63,94,0.3)] overflow-hidden">
        {/* Working Back Button */}
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-2 mb-6 text-sm text-pink-300 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Wapas Site Par Chalein</span>
        </button>

        {/* Lock Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30 mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-100 to-rose-200">
            Admin Portal
          </h2>
          <p className="text-pink-300/70 text-xs mt-1">
            Dedicated secure access to view visitor submissions
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-center gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-pink-200/80 mb-1.5 ml-1">
              Admin Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-400/60">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username dalein..."
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-pink-500/30 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30 text-white placeholder-pink-300/30 text-sm outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-pink-200/80 mb-1.5 ml-1">
              Admin Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-400/60">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password dalein..."
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-pink-500/30 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30 text-white placeholder-pink-300/30 text-sm outline-none transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-pink-300/60 hover:text-pink-100 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white font-medium text-sm sm:text-base shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all border border-pink-400/30"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking credentials...</span>
              </>
            ) : (
              <span>Login to Dashboard</span>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};
