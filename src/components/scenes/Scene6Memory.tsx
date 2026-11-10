import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Check, ArrowRight, HeartHandshake } from 'lucide-react';

interface Scene6Props {
  onContinue: (memoryChoice: string, followUpAnswer: string) => void;
}

export const Scene6Memory: React.FC<Scene6Props> = ({ onContinue }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [followUpText, setFollowUpText] = useState('');
  const [error, setError] = useState('');

  const options = [
    {
      id: 1,
      text: 'Haan, bilkul yaad hai ❤️',
      followUpQuestion: 'Achha, toh hamara sabse yaadgaar moment kaunsa tha?',
      placeholder: 'Woh sabse pyaari yaad yahan likho...',
    },
    {
      id: 2,
      text: 'Nahi, yaad nahi hai.',
      followUpQuestion: 'Koi baat nahi, kya tumhe koi chhoti si baat yaad hai?',
      placeholder: 'Chhoti si baat bhi chalegi, batao...',
    },
    {
      id: 3,
      text: 'Thoda-thoda yaad hai. 😊',
      followUpQuestion: 'Achha, phir tumhe sabse pehle kya yaad aata hai?',
      placeholder: 'Jo sabse pehle dil mein aaya, wahi bata do...',
    },
  ];

  const handleSelect = (idx: number) => {
    setSelectedOption(idx);
    setError('');
  };

  const handleProceed = () => {
    if (selectedOption === null) return;
    const choice = options[selectedOption];
    onContinue(choice.text, followUpText.trim());
  };

  const currentOption = selectedOption !== null ? options[selectedOption] : null;

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
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-lg shadow-rose-500/30 mb-4"
          >
            <Clock className="w-8 h-8" />
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-100 to-rose-200 mb-2 leading-snug">
            Jo waqt humne saath spend kiya tha, kya tumhe yaad hai? ❤️
          </h2>
          <p className="text-pink-200/70 text-sm">
            Dil ki yaadon ke panno ko thoda palat kar dekho...
          </p>
        </div>

        {/* 3 Memory Choices */}
        <div className="space-y-3 mb-6">
          {options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <motion.button
                key={opt.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600/30 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                    : 'bg-black/30 border-pink-500/20 text-pink-100/90 hover:bg-black/40 hover:border-pink-400/40'
                }`}
              >
                <span className="font-medium text-sm sm:text-base">{opt.text}</span>
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-rose-400 bg-rose-500 text-white'
                      : 'border-pink-400/40 bg-transparent'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Dynamic Follow-Up Question & Text Response */}
        <AnimatePresence>
          {currentOption && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-3 border-t border-pink-500/20"
            >
              <p className="text-rose-200 text-sm sm:text-base font-semibold text-center leading-relaxed">
                {currentOption.followUpQuestion}
              </p>

              <div>
                <textarea
                  rows={3}
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                  placeholder={currentOption.placeholder}
                  maxLength={1000}
                  className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-pink-400/40 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/20 text-white placeholder-pink-300/40 outline-none transition-all shadow-inner text-sm sm:text-base resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleProceed}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-base shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all border border-pink-300/30"
              >
                <span>Aage Badhein ❤️</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
