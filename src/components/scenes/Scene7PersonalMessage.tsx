import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquareHeart, Send, Heart } from 'lucide-react';

interface Scene7Props {
  visitorName: string;
  onContinue: (message: string) => void;
}

export const Scene7PersonalMessage: React.FC<Scene7Props> = ({ visitorName, onContinue }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue(message.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="relative backdrop-blur-2xl bg-gradient-to-b from-white/15 to-white/5 border border-pink-400/30 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(244,63,94,0.25)] overflow-hidden">
        <div className="text-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-lg shadow-rose-500/40 mb-4"
          >
            <MessageSquareHeart className="w-8 h-8" />
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-100 to-rose-200 mb-2">
            Achha, ab tum bhi kuch bolo... ❤️
          </h2>
          <p className="text-pink-200/80 text-sm font-light">
            {visitorName ? `${visitorName}, jo ` : 'Jo '}bhi dil mein ho, bejhijhak keh do...
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Yahan apna pyara sa message likho..."
              maxLength={2000}
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-pink-400/40 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/20 text-white placeholder-pink-300/40 outline-none transition-all shadow-inner text-base resize-none"
            />
            <div className="text-right text-xs text-pink-300/50 mt-1">
              {message.length} / 2000
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-lg shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all border border-pink-300/30"
          >
            <span>Dil Se Bhejo ❤️</span>
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};
