
export type ElementType = 'primordial' | 'matter' | 'energy' | 'life' | 'technology' | 'abstract' | 'cosmic';

export interface GameElement {
  id: string; // Unique instance ID for the board
  elementId: string; // ID of the type of element (e.g., "fire")
  name: string;
  emoji: string;
  description: string;
  type: ElementType;
  era?: string; // The time period this element belongs to
  x: number;
  y: number;
  discoveredAt: number;
}

export interface ElementDefinition {
  id: string; // "fire"
  name: string;
  emoji: string;
  description: string;
  type: ElementType;
  era?: string; // The time period this element belongs to
  discoveredAt: number; // Timestamp
}

export interface CombinationResult {
  success: boolean;
  element?: Omit<ElementDefinition, 'discoveredAt'>;
  flavorText?: string;
}

export interface LogEntry {
  id: string;
  text: string;
  timestamp: number;
  type: 'info' | 'success' | 'failure';
}
