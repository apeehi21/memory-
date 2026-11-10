import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Smile } from 'lucide-react';

interface Scene2Props {
  visitorName: string;
  onContinue: () => void;
}

export const Scene2Greeting: React.FC<Scene2Props> = ({ visitorName, onContinue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto text-center"
    >
      <div className="relative backdrop-blur-2xl bg-gradient-to-b from-white/15 to-white/5 border border-pink-400/30 rounded-3xl p-8 sm:p-12 shadow-[0_0_50px_rgba(244,63,94,0.25)] overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/40 mb-6"
        >
          <Smile className="w-10 h-10" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-100 to-pink-200 mb-4 tracking-wide">
          Kaisi ho{visitorName ? `, ${visitorName}` : ''}?
        </h1>
        <p className="text-pink-200/80 text-sm sm:text-base font-light mb-8">
          Umeed hai tumhara din bohot pyara guzar raha hoga... ✨
        </p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(244,63,94,0.6)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-xl tracking-wide shadow-xl shadow-rose-600/35 flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 border border-pink-300/40"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
          <span>Mast! ❤️</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
