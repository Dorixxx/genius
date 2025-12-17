
import React, { useState, useMemo } from 'react';
import { ElementDefinition } from '../types';
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { ERAS } from '../services/staticRecipes';

interface SidebarProps {
  library: ElementDefinition[];
  onDragStart: (e: React.DragEvent, source: 'library' | 'board', data: ElementDefinition) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ library, onDragStart, isOpen, setIsOpen }) => {
  const [openEras, setOpenEras] = useState<Record<string, boolean>>({ [ERAS.GENESIS]: true });
  const [searchQuery, setSearchQuery] = useState('');

  // Define the canonical order of Eras
  const eraOrder = [
    ERAS.GENESIS,
    ERAS.NATURE,
    ERAS.LIFE,
    ERAS.PRIMITIVE,
    ERAS.PRE_IND,
    ERAS.INDUSTRIAL,
    ERAS.ELECTRIC,
    ERAS.INFO,
    ERAS.FUTURE,
    ERAS.SINGULARITY
  ];

  const toggleEra = (era: string) => {
    setOpenEras(prev => ({ ...prev, [era]: !prev[era] }));
  };

  const groupedLibrary = useMemo(() => {
    const groups: Record<string, ElementDefinition[]> = {};
    
    // Initialize all eras to ensure they appear in order even if empty (optional, but good for structure)
    eraOrder.forEach(era => { groups[era] = []; });
    // Catch-all for undefined eras
    groups['Unknown'] = [];

    library.forEach(el => {
      // Filter by search
      if (searchQuery && !el.name.toLowerCase().includes(searchQuery.toLowerCase())) return;

      const era = el.era || ERAS.GENESIS;
      if (!groups[era]) groups[era] = [];
      groups[era].push(el);
    });
    
    return groups;
  }, [library, searchQuery]);

  return (
    <div 
      className={`
        fixed right-0 top-14 bottom-0 z-40
        flex flex-col
        bg-slate-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64 translate-x-0' : 'w-64 translate-x-full'}
      `}
    >
        {/* Toggle Handle (Visible when closed logic handles in parent, but we can add a close btn here) */}
        
        {/* Header / Search */}
        <div className="p-3 border-b border-white/5 flex flex-col gap-2">
            <div className="flex justify-between items-center text-slate-400">
                 <span className="text-xs font-mono font-bold uppercase tracking-wider">物质档案</span>
                 <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">
                     <X size={16} />
                 </button>
            </div>
            <div className="relative">
                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="搜索..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded px-2 py-1 pl-7 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
            </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {eraOrder.map(era => {
                const items = groupedLibrary[era];
                if (!items || (items.length === 0 && searchQuery)) return null; // Hide empty eras during search
                if (items.length === 0 && !searchQuery) return null; // Hide empty eras generally (optional: show locked state?)

                const isOpen = openEras[era];

                return (
                    <div key={era} className="rounded overflow-hidden bg-slate-800/20 border border-white/5">
                        <button 
                            onClick={() => toggleEra(era)}
                            className="w-full flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold text-slate-300"
                        >
                            {isOpen ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                            {era}
                            <span className="ml-auto text-[10px] text-slate-600 font-mono bg-slate-900/50 px-1.5 rounded">{items.length}</span>
                        </button>

                        {isOpen && (
                            <div className="p-1 grid grid-cols-1 gap-1">
                                {items.map(item => (
                                    <div
                                        key={item.id}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, 'library', item)}
                                        className="
                                            group flex items-center gap-3 px-3 py-2 rounded 
                                            cursor-grab active:cursor-grabbing
                                            hover:bg-cyan-900/20 hover:border-cyan-500/30 border border-transparent
                                            transition-all
                                        "
                                    >
                                        <span className="text-xl filter drop-shadow-sm group-hover:scale-110 transition-transform">{item.emoji}</span>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-xs text-slate-300 font-medium truncate group-hover:text-cyan-200">{item.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
        
        {/* Footer Stats */}
        <div className="p-2 border-t border-white/5 text-[10px] text-center text-slate-600 font-mono">
             Total Discovered: {library.length}
        </div>
    </div>
  );
};
