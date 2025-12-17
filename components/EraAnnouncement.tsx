
import React, { useEffect, useState } from 'react';

interface EraAnnouncementProps {
  eraName: string;
  onComplete: () => void;
}

export const EraAnnouncement: React.FC<EraAnnouncementProps> = ({ eraName, onComplete }) => {
  const [stage, setStage] = useState<'intro' | 'hold' | 'out'>('intro');

  useEffect(() => {
    // Sequence
    // 0s: Mount
    // 0.5s: Text flies in
    // 3.5s: Fade out
    // 4.5s: Unmount

    const holdTimer = setTimeout(() => setStage('out'), 3500);
    const endTimer = setTimeout(onComplete, 4500);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <div className={`
      fixed inset-0 z-[100] flex flex-col items-center justify-center
      bg-black/90 backdrop-blur-sm
      transition-opacity duration-1000
      ${stage === 'out' ? 'opacity-0' : 'opacity-100'}
    `}>
        <div className="relative overflow-hidden">
            <h2 className="text-xl md:text-2xl text-cyan-500 font-mono tracking-[0.5em] mb-4 text-center uppercase animate-pulse">
                Era Unlocked
            </h2>
            <h1 className={`
                text-4xl md:text-7xl font-bold text-white tracking-widest text-center
                transition-all duration-1000 transform
                ${stage === 'intro' ? 'translate-y-0 opacity-100' : 'translate-y-0'}
                animate-bounce-in
            `}
            style={{ textShadow: '0 0 30px rgba(6,182,212,0.8)' }}
            >
                {eraName}
            </h1>
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-8 scale-x-0 animate-expand-width" />
        </div>
    </div>
  );
};
