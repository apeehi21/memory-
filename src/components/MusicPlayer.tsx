import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  const notes = [
    261.63, // C4
    329.63, // E4
    392.0,  // G4
    493.88, // B4
    523.25, // C5
    587.33, // D5
    659.25, // E5
  ];

  const playChime = (freq: number) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Warm soft envelope
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.9);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.suspend();
      setIsPlaying(false);
    } else {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Play dreamy romantic chord pattern
      let noteIndex = 0;
      const sequence = [0, 2, 4, 3, 1, 4, 5, 2, 0, 3, 4, 6];
      playChime(notes[sequence[0]]);

      intervalRef.current = window.setInterval(() => {
        noteIndex = (noteIndex + 1) % sequence.length;
        playChime(notes[sequence[noteIndex]]);
      }, 750);

      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <button
      onClick={toggleMusic}
      title={isPlaying ? 'Mute ambient melody' : 'Play soft ambient melody'}
      className="fixed top-4 left-4 z-40 p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-pink-300 hover:text-pink-100 border border-pink-500/20 shadow-lg transition-all duration-300 flex items-center gap-2 group cursor-pointer"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4 animate-pulse text-pink-400" />
          <span className="text-xs font-medium tracking-wide pr-1 hidden sm:inline text-pink-200">
            Music on
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-pink-300/70" />
          <span className="text-xs font-medium tracking-wide pr-1 hidden sm:inline text-pink-300/70">
            Music off
          </span>
        </>
      )}
    </button>
  );
};
