import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

interface Scene8Props {
  visitorName: string;
  onAnswer: (answer: 'YES' | 'NO') => void;
}

export const Scene8Proposal: React.FC<Scene8Props> = ({ visitorName, onAnswer }) => {
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [playfulMsg, setPlayfulMsg] = useState('');

  const playfulMessages = [
    'Ek baar aur soch lo na... 🥺',
    'Aise mat bolo na please... ❤️',
    'Dil toot jayega mera... 💔',
    'Pakka na? Sachchi? 🥺',
  ];

  const handleNoHover = () => {
    setNoHoverCount((prev) => prev + 1);
    setPlayfulMsg(playfulMessages[noHoverCount % playfulMessages.length]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-lg mx-auto text-center"
    >
      <div className="relative backdrop-blur-2xl bg-gradient-to-b from-white/15 to-white/5 border border-pink-400/30 rounded-3xl p-8 sm:p-12 shadow-[0_0_70px_rgba(244,63,94,0.35)] overflow-hidden">
        {/* Animated Heart Pulsing */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1, 1.15, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut',
          }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-rose-600 via-pink-600 to-red-500 text-white shadow-2xl shadow-rose-500/50 mb-6"
        >
          <Heart className="w-12 h-12 fill-current text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-100 to-pink-200 mb-4 tracking-wide leading-snug">
          Kya tum meri zindagi ka ek khaas hissa banna pasand karogi? ❤️
        </h1>

        <p className="text-pink-200/80 text-sm sm:text-base font-light mb-8">
          {visitorName ? `${visitorName}, yeh ` : 'Yeh '}sawal dil ki sabse gehri jagah se hai...
        </p>

        {playfulMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 py-2 px-4 rounded-xl bg-rose-950/70 border border-rose-500/30 text-rose-200 text-sm inline-block shadow-lg"
          >
            {playfulMsg}
          </motion.div>
        )}

        {/* Both choices: YES and NO (NO is strictly selectable!) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 0 35px rgba(244,63,94,0.7)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnswer('YES')}
            className="w-full sm:w-auto min-w-[160px] py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xl tracking-wide shadow-xl shadow-rose-600/40 flex items-center justify-center gap-2 cursor-pointer transition-all border border-pink-300/50"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>YES ❤️</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={handleNoHover}
            onClick={() => onAnswer('NO')}
            className="w-full sm:w-auto min-w-[130px] py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-pink-200/90 hover:text-white font-medium text-lg tracking-wide border border-pink-400/30 cursor-pointer transition-all"
          >
            NO
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
