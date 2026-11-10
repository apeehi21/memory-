import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Stars, ArrowRight } from 'lucide-react';

interface Scene5Props {
  onContinue: () => void;
}

export const Scene5Shayari: React.FC<Scene5Props> = ({ onContinue }) => {
  const lines = [
    'Roses are red,',
    'Violets are blue,',
    'In the sky, there are many stars,',
    'But none are like you. ❤️',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-lg mx-auto text-center"
    >
      <div className="relative backdrop-blur-2xl bg-gradient-to-b from-white/15 to-white/5 border border-pink-400/30 rounded-3xl p-8 sm:p-12 shadow-[0_0_60px_rgba(244,63,94,0.3)] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 left-6 text-pink-400/40 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute top-6 right-6 text-rose-400/40 animate-bounce" style={{ animationDuration: '3s' }}>
          <Stars className="w-6 h-6" />
        </div>

        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-lg shadow-rose-500/40 mb-6"
        >
          <Heart className="w-8 h-8 fill-current text-white animate-pulse" />
        </motion.div>

        {/* Exact Shayari animated line by line */}
        <div className="space-y-4 my-8 font-serif">
          {lines.map((line, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 * idx + 0.2, duration: 0.7, ease: 'easeOut' }}
              className={`text-xl sm:text-2xl font-medium tracking-wide ${
                idx === 3
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-rose-300 font-bold drop-shadow-[0_2px_10px_rgba(244,63,94,0.5)]'
                  : 'text-pink-100/90'
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(244,63,94,0.6)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="mt-4 py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-lg tracking-wide shadow-xl shadow-rose-600/35 inline-flex items-center gap-2 cursor-pointer transition-all duration-300 border border-pink-300/40"
        >
          <span>Kitna pyara hai... ❤️</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};
