import React, { useState, useEffect, useRef } from 'react';
import { Card } from './components/Card';
import { ElementDefinition, GameElement, LogEntry } from './types';
import { combineElements } from './services/geminiService';
import { Trash2, RotateCcw, Atom, X, Box, Sparkles } from 'lucide-react';

// Initial Game State (Translated)
const INITIAL_ELEMENTS: ElementDefinition[] = [
  { id: 'spark', name: '火花', emoji: '✨', description: '虚空中残留的一丝微弱能量。', type: 'primordial', discoveredAt: Date.now() },
  { id: 'void', name: '虚空', emoji: '⚫', description: '无尽的虚无。', type: 'primordial', discoveredAt: Date.now() }
];

const App: React.FC = () => {
  // --- State ---
  const [library, setLibrary] = useState<ElementDefinition[]>(INITIAL_ELEMENTS);
  const [boardElements, setBoardElements] = useState<GameElement[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([{ id: 'init', text: "系统已初始化。准备合成。", timestamp: Date.now(), type: 'info' }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [draggedItem, setDraggedItem] = useState<{ source: 'library' | 'board', id: string, data: ElementDefinition } | null>(null);

  // --- Refs for Drag & Drop ---
  const boardRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    // Load Library
    const savedLib = localStorage.getItem('genesis_library');
    if (savedLib) {
      setLibrary(JSON.parse(savedLib));
    }

    // Load Board State
    const savedBoard = localStorage.getItem('genesis_board');
    if (savedBoard) {
      setBoardElements(JSON.parse(savedBoard));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('genesis_library', JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem('genesis_board', JSON.stringify(boardElements));
  }, [boardElements]);

  // --- Helpers ---
  const addLog = (text: string, type: 'info' | 'success' | 'failure' = 'info') => {
    setLogs(prev => [{ id: Math.random().toString(), text, timestamp: Date.now(), type }, ...prev].slice(0, 50));
  };

  const spawnElement = (elementDef: ElementDefinition, x: number, y: number) => {
    const newElement: GameElement = {
      ...elementDef,
      id: Math.random().toString(36).substr(2, 9),
      elementId: elementDef.id,
      x,
      y
    };
    setBoardElements(prev => [...prev, newElement]);
  };

  const checkCombination = async (targetId: string, droppedData: ElementDefinition) => {
    const targetElement = boardElements.find(e => e.id === targetId);
    if (!targetElement) return;

    // Prevent combining with self if it's the exact same instance
    if (draggedItem?.source === 'board' && draggedItem.id === targetId) return;

    setIsProcessing(true);
    addLog(`正在尝试合成: ${droppedData.name} + ${targetElement.name}...`, 'info');
    
    // Call the stripped-down service
    const result = await combineElements(droppedData, targetElement);

    if (result.success && result.element) {
      addLog(result.flavorText || `合成完成: 创造了 ${result.element.name}`, 'success');
      
      const newDef: ElementDefinition = {
        ...result.element,
        id: result.element.id,
        discoveredAt: Date.now()
      };

      // Add to library if new
      setLibrary(prev => {
        if (prev.some(e => e.name === newDef.name)) return prev; // Check by name to avoid dupes with generated IDs
        return [...prev, newDef];
      });

      // Spawn the result slightly offset from the target so it's visible
      spawnElement(newDef, targetElement.x, targetElement.y + 120);

    } else {
      addLog(result.flavorText || "合成失败。", 'failure');
    }

    setIsProcessing(false);
    setDraggedItem(null);
  };

  // --- Drag & Drop Handlers ---

  const handleDragStart = (e: React.DragEvent, source: 'library' | 'board', data: ElementDefinition, instanceId?: string) => {
    setDraggedItem({ source, id: instanceId || data.id, data });
    e.dataTransfer.effectAllowed = 'copyMove';
    e.dataTransfer.setData('application/json', JSON.stringify({ source, data, instanceId }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnBoard = (e: React.DragEvent) => {
    e.preventDefault();
    const json = e.dataTransfer.getData('application/json');
    if (!json) return;
    
    const { source, data, instanceId } = JSON.parse(json);
    
    // Calculate drop position relative to board
    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 48; // Center approx
      const y = e.clientY - rect.top - 64; 

      if (source === 'library') {
        spawnElement(data, x, y);
      } else if (source === 'board') {
        // Just moving an existing element
        setBoardElements(prev => prev.map(el => {
            if (el.id === instanceId) {
                return { ...el, x, y };
            }
            return el;
        }));
      }
    }
    setDraggedItem(null);
  };

  const handleDropOnCard = (e: React.DragEvent, targetInstanceId: string) => {
    e.stopPropagation(); // Stop bubbling to board
    e.preventDefault();
    
    const json = e.dataTransfer.getData('application/json');
    if (!json) return;
    const { data } = JSON.parse(json); // The dragged card data

    checkCombination(targetInstanceId, data);
  };

  const clearBoard = () => {
    setBoardElements([]);
    addLog("画布已清空。", 'info');
  };

  const resetProgress = () => {
    if (confirm("重置宇宙回到初始状态？所有进度将丢失。")) {
      setLibrary(INITIAL_ELEMENTS);
      setBoardElements([]);
      setLogs([{ id: 'reset', text: "宇宙已重置。", timestamp: Date.now(), type: 'info' }]);
      localStorage.removeItem('genesis_library');
      localStorage.removeItem('genesis_board');
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans flex flex-col relative selection:bg-cyan-500/30">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-80" />
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      {/* --- Main Area --- */}
      <div className="flex-1 flex flex-col relative z-10 h-full w-full">
        
        {/* Top Bar */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/5 bg-black/10 backdrop-blur-sm z-30 pointer-events-auto">
          <div className="flex items-center gap-2">
            <Atom className="w-6 h-6 text-cyan-400 animate-pulse" />
            <h1 className="font-bold text-lg tracking-wider text-cyan-100 hidden md:block">创世协议</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 font-mono">LITE</span>
          </div>
          
          <div className="flex justify-end gap-2 items-center">
            <button 
                onClick={clearBoard}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800/50 border border-slate-700 hover:bg-red-900/20 hover:border-red-500/50 text-xs transition-colors"
                title="清空画布"
            >
                <Trash2 size={14} /> <span className="hidden sm:inline">清空</span>
            </button>
            <button 
                onClick={resetProgress}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800/50 border border-slate-700 hover:bg-amber-900/20 hover:border-amber-500/50 text-xs transition-colors"
                title="重置进度"
            >
                <RotateCcw size={14} /> <span className="hidden sm:inline">重置</span>
            </button>
            <button
               onClick={() => setLibraryOpen(!libraryOpen)}
               className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs transition-colors md:hidden
                  ${libraryOpen ? 'bg-cyan-900/50 border-cyan-500' : 'bg-slate-800/50 border-slate-700'}
               `}
            >
                {libraryOpen ? <X size={14}/> : <Box size={14}/>}
            </button>
          </div>
        </div>

        {/* Game Board */}
        <div 
            ref={boardRef}
            onDrop={handleDropOnBoard}
            onDragOver={handleDragOver}
            className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/50 to-transparent"
        >
             {/* Center Hint if empty */}
             {boardElements.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 pointer-events-none">
                    <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm tracking-widest uppercase opacity-50">从下方拖拽物质开始创造</p>
                    <p className="text-xs opacity-30 mt-2 font-mono">标准物理法则生效中</p>
                </div>
             )}

            {/* Elements */}
            {boardElements.map(el => (
                <div
                    key={el.id}
                    className="absolute z-20"
                    style={{ left: el.x, top: el.y }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'board', el, el.id)}
                    onDrop={(e) => handleDropOnCard(e, el.id)}
                    onDragOver={handleDragOver}
                >
                    <Card data={el} />
                </div>
            ))}

            {/* Loading Overlay */}
            {isProcessing && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-black/60 rounded-full backdrop-blur border border-cyan-500/30">
                    <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-cyan-400 font-mono text-xs animate-pulse">正在合成...</p>
                </div>
            )}
        </div>

        {/* Bottom Library Dock */}
        <div className={`
            absolute bottom-0 left-0 right-0 z-40
            transition-transform duration-300 ease-in-out
            ${libraryOpen ? 'translate-y-0' : 'translate-y-full'}
        `}>
             {/* Handle to pull up if hidden (optional, but using button mainly) */}
             
            <div className="bg-slate-900/90 backdrop-blur-xl border-t border-slate-700 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                 <div className="flex justify-between items-center px-4 py-2 border-b border-white/5">
                    <span className="text-xs text-slate-400 font-mono uppercase">物质库 ({library.length})</span>
                    <button onClick={() => setLibraryOpen(false)} className="md:hidden opacity-50"><X size={16}/></button>
                 </div>
                 
                 <div className="h-48 overflow-x-auto overflow-y-hidden custom-scrollbar p-4">
                    <div className="flex gap-4 min-w-max items-center h-full">
                        {library.map(item => (
                        <div 
                            key={item.id} 
                            draggable 
                            onDragStart={(e) => handleDragStart(e, 'library', item)}
                            className="cursor-grab active:cursor-grabbing hover:-translate-y-2 transition-transform"
                        >
                            <Card data={item} className="scale-90" />
                        </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>

        {/* Log Console (Floating) */}
        <div className="absolute bottom-52 left-4 w-64 md:w-96 max-h-32 pointer-events-none z-30">
             <div className="flex flex-col-reverse gap-1 mask-image-gradient">
                {logs.slice(0, 4).map((log) => (
                    <div key={log.id} className={`px-2 py-1 rounded bg-black/60 backdrop-blur-sm border-l-2 text-xs font-mono shadow-lg transition-all animate-in fade-in slide-in-from-left-2 ${
                        log.type === 'success' ? 'border-emerald-500 text-emerald-100' : 
                        log.type === 'failure' ? 'border-red-500 text-red-100' : 'border-slate-500 text-slate-300'
                    }`}>
                        {log.text}
                    </div>
                ))}
             </div>
        </div>

      </div>
    </div>
  );
};

export default App;