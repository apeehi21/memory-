import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Gift, RotateCcw } from 'lucide-react';

interface Scene9Props {
  answer: 'YES' | 'NO';
  visitorName: string;
  onReplay: () => void;
}

export const Scene9Celebration: React.FC<Scene9Props> = ({
  answer,
  visitorName,
  onReplay,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (answer === 'YES') {
      // Fire celebration confetti cannon
      try {
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          colors: ['#f43f5e', '#fb7185', '#ec4899', '#fbbf24', '#ffffff', '#e11d48'],
        };

        const fire = (particleRatio: number, opts: confetti.Options) => {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        };

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      } catch (err) {
        console.warn('Confetti error', err);
      }
    }
  }, [answer]);

  const handleOpenBox = () => {
    if (isOpen) return;
    setIsOpen(true);
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fef08a'],
      });
    } catch {
      // fallback
    }
  };

  if (answer === 'NO') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg mx-auto text-center"
      >
        <div className="relative backdrop-blur-2xl bg-gradient-to-b from-white/15 to-white/5 border border-pink-400/30 rounded-3xl p-8 sm:p-12 shadow-[0_0_50px_rgba(244,63,94,0.25)] overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-pink-700 to-rose-700 text-white shadow-lg mb-6"
          >
            <Heart className="w-10 h-10 fill-current text-pink-200" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-100 to-rose-200 mb-4">
            Shukriya, {visitorName || 'mere dost'}...
          </h1>

          <p className="text-pink-100/90 text-base sm:text-lg leading-relaxed mb-8 font-light">
            Tumhari sachai mere liye bohot azeez hai. Dosti aur yeh pyari yaadein hamesha dil ke paas rahengi.
            Hamesha aise hi muskurati raho! ✨
          </p>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReplay}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium flex items-center justify-center gap-2 cursor-pointer border border-pink-300/40 shadow-lg shadow-rose-600/30"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Phir Se Dekhein (Replay)</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Answer is YES
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      className="w-full max-w-xl mx-auto text-center"
    >
      <div className="relative backdrop-blur-2xl bg-gradient-to-b from-white/15 to-white/5 border border-pink-400/30 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(244,63,94,0.35)] overflow-hidden">
        {/* Celebration Title */}
        <div className="mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 text-sm font-medium mb-3 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Yeh pal hamesha yaad rahega! 🎉</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-100 to-amber-200 mb-2">
            Yayyy! ❤️✨
          </h1>
          <p className="text-pink-200/80 text-sm">
            {visitorName ? `${visitorName}, tumhare ` : 'Tumhare '}liye ek khaas tohfa hai...
          </p>
        </div>

        {/* 3D Animated Gift Box Concept */}
        <div className="relative my-6 flex flex-col items-center justify-center">
          {!isOpen ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenBox}
              className="cursor-pointer group flex flex-col items-center"
            >
              {/* Gift Box Container */}
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
                {/* Glowing ambient ring */}
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/40 to-pink-500/40 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />

                {/* Box Base */}
                <div className="relative w-36 h-36 bg-gradient-to-br from-rose-600 via-red-600 to-rose-800 rounded-2xl shadow-2xl border border-pink-300/40 flex items-center justify-center overflow-hidden">
                  {/* Vertical Ribbon */}
                  <div className="absolute w-7 h-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 shadow-md" />
                  {/* Horizontal Ribbon */}
                  <div className="absolute h-7 w-full bg-gradient-to-b from-amber-300 via-yellow-200 to-amber-400 shadow-md" />
                  {/* Central Bow */}
                  <div className="absolute w-12 h-12 rounded-full bg-amber-300 border-2 border-yellow-100 shadow-lg flex items-center justify-center z-10">
                    <Sparkles className="w-6 h-6 text-amber-800" />
                  </div>
                </div>

                {/* Box Lid */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="absolute -top-1 w-40 h-10 bg-gradient-to-r from-rose-500 via-red-500 to-rose-700 rounded-xl shadow-xl border border-pink-200/50 flex items-center justify-center"
                >
                  <div className="w-7 h-full bg-amber-300" />
                </motion.div>
              </div>

              <motion.p
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mt-4 text-rose-200 text-sm font-medium flex items-center gap-1.5 bg-black/30 px-4 py-1.5 rounded-full border border-pink-500/30"
              >
                <Gift className="w-4 h-4 text-amber-300" />
                <span>Box par tap karke kholein! 🎁</span>
              </motion.p>
            </motion.div>
          ) : (
            /* Opened Gift Box & Exact Revealed Letter */
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full text-left"
            >
              {/* Open Box Lid floating away */}
              <div className="flex justify-center mb-3">
                <motion.div
                  initial={{ y: 0, rotate: 0 }}
                  animate={{ y: -30, rotate: -15, opacity: 0.4 }}
                  className="text-xs text-pink-300/80 flex items-center gap-1"
                >
                  <Gift className="w-4 h-4 text-amber-300" />
                  <span>Tohfa khul gaya hai! ✨</span>
                </motion.div>
              </div>

              {/* Exact Letter from Approved Specification */}
              <div className="relative bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 text-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.4)] border-2 border-amber-200/70 font-serif overflow-hidden">
                {/* Letter Header Stamp */}
                <div className="flex items-center justify-between border-b border-rose-200/60 pb-3 mb-5">
                  <span className="text-xs font-sans tracking-widest uppercase text-rose-800/80 font-bold">
                    A Letter From The Heart
                  </span>
                  <Heart className="w-5 h-5 text-rose-600 fill-current animate-pulse" />
                </div>

                {/* EXACT SPECIFICATION LETTER CONTENT */}
                <div className="space-y-4 text-base sm:text-lg leading-relaxed text-slate-800">
                  <p className="italic">
                    &ldquo;Some moments become beautiful memories, and some people make those moments unforgettable.&rdquo;
                  </p>
                  <p>
                    Thank you for being a part of this little journey. I hope this brings a smile to your face and gives you a memory worth keeping. ❤️
                  </p>
                  <div className="pt-2 text-right">
                    <p className="font-semibold text-rose-900">With warm wishes,</p>
                    <p className="font-bold text-rose-700">Always keep smiling! ✨</p>
                  </div>
                </div>

                {/* Subtle watermark */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-rose-400/10 rounded-full blur-xl pointer-events-none" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Button: Replay */}
        <div className="flex items-center justify-center mt-6 pt-4 border-t border-pink-500/20">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onReplay}
            className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-base shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer border border-pink-300/40"
          >
            <RotateCcw className="w-4 h-4 text-pink-200" />
            <span>Phir Se Dekhein (Replay) 🔁</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
