import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="group relative flex">
      {children}
      <div className="absolute bottom-full left-1/2 mb-2 hidden w-max -translate-x-1/2 flex-col items-center group-hover:flex z-[100]">
        <span className="relative z-10 rounded-md bg-black/90 px-2 py-1 text-xs text-white shadow-lg whitespace-pre-wrap max-w-[200px] text-center border border-white/10">
          {text}
        </span>
        <div className="h-2 w-2 -translate-y-1/2 rotate-45 bg-black/90"></div>
      </div>
    </div>
  );
};
