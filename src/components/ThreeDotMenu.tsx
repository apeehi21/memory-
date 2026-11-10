import React from 'react';
import { MoreVertical, Shield } from 'lucide-react';

interface ThreeDotMenuProps {
  isVisible: boolean;
  onOpenAdmin: () => void;
}

export const ThreeDotMenu: React.FC<ThreeDotMenuProps> = ({ isVisible, onOpenAdmin }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={onOpenAdmin}
        title="Admin Access"
        aria-label="Admin Access"
        className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-pink-300 hover:text-white border border-pink-500/30 shadow-lg transition-all duration-300 cursor-pointer group flex items-center justify-center hover:scale-105 active:scale-95"
      >
        <MoreVertical className="w-5 h-5 text-pink-300 group-hover:text-pink-100 transition-colors" />
      </button>
    </div>
  );
};
