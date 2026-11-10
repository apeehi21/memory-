import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

interface Scene1Props {
  onContinue: (name: string) => void;
}

export const Scene1NameEntry: React.FC<Scene1Props> = ({ onContinue }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Pehle apna pyara sa naam toh batao! ❤️');
      return;
    }
    if (trimmed.length > 50) {
      setError('Naam thoda chhota likhein please! ❤️');
      return;
    }
    setError('');
    onContinue(trimmed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative backdrop-blur-2xl bg-gradient-to-b from-white/15 to-white/5 border border-pink-400/30 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(244,63,94,0.25)] text-center overflow-hidden">
        {/* Soft decorative glow */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-rose-500/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-pink-500/30 rounded-full blur-2xl pointer-events-none" />

        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-lg shadow-rose-500/40 mb-6"
        >
          <Heart className="w-10 h-10 fill-current text-white animate-pulse" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-100 to-pink-300 mb-3 tracking-wide drop-shadow-sm">
          Apna naam batao ❤️
        </h1>
        <p className="text-pink-200/80 text-sm sm:text-base font-light mb-8">
          Ek chhota sa safar, bas tumhare liye banaya gaya hai...
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Yahan apna naam likho..."
              autoFocus
              maxLength={50}
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-pink-400/40 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/20 text-white text-center text-lg placeholder-pink-300/40 outline-none transition-all duration-300 shadow-inner"
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-300 text-xs sm:text-sm mt-2 font-medium"
              >
                {error}
              </motion.p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-lg tracking-wide shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 group cursor-pointer transition-all duration-300 border border-pink-300/30"
          >
            <span>Aage Badhein</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};
