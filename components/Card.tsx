import React from 'react';
import { ElementDefinition, ElementType } from '../types';

interface CardProps {
  data: Omit<ElementDefinition, 'discoveredAt'>;
  isDragging?: boolean;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const typeColors: Record<ElementType, string> = {
  primordial: 'border-gray-500 bg-gray-900/80 text-gray-100 shadow-gray-500/20',
  matter: 'border-amber-700 bg-amber-950/80 text-amber-100 shadow-amber-700/20',
  energy: 'border-cyan-500 bg-cyan-950/80 text-cyan-100 shadow-cyan-500/20',
  life: 'border-emerald-500 bg-emerald-950/80 text-emerald-100 shadow-emerald-500/20',
  technology: 'border-blue-500 bg-blue-950/80 text-blue-100 shadow-blue-500/20',
  abstract: 'border-purple-500 bg-purple-950/80 text-purple-100 shadow-purple-500/20',
  cosmic: 'border-fuchsia-500 bg-fuchsia-950/80 text-fuchsia-100 shadow-fuchsia-500/20',
};

export const Card: React.FC<CardProps> = ({ data, isDragging, className = '', onClick, style }) => {
  const colorClass = typeColors[data.type] || typeColors['primordial'];

  return (
    <div
      onClick={onClick}
      style={style}
      className={`
        relative flex flex-col items-center justify-center 
        w-24 h-32 md:w-32 md:h-40 
        rounded-xl border-2 backdrop-blur-md 
        transition-all duration-200 select-none cursor-grab active:cursor-grabbing
        shadow-[0_0_15px_rgba(0,0,0,0.5)]
        ${colorClass}
        ${isDragging ? 'opacity-50 scale-105 z-50' : 'hover:-translate-y-1 hover:shadow-lg'}
        ${className}
      `}
    >
      <div className="text-4xl md:text-5xl mb-2 drop-shadow-md filter">{data.emoji}</div>
      <div className="text-xs md:text-sm font-bold text-center px-1 leading-tight w-full truncate">
        {data.name}
      </div>
      <div className="text-[0.6rem] text-center px-2 mt-1 opacity-70 line-clamp-2 w-full">
        {data.type}
      </div>
      
      {/* Scanline effect overlay */}
      <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-20" />
    </div>
  );
};
