import { create } from "zustand";
import type { CVData } from "../types/cv";

export interface HistoryEntry {
  timestamp: string;
  label: string;
  snapshot: CVData;
}

interface HistoryState {
  undoStack: CVData[];
  redoStack: CVData[];
  changelog: HistoryEntry[];

  pushUndo: (snapshot: CVData, label: string) => void;
  undo: () => CVData | null;
  redo: () => CVData | null;
  clearHistory: () => void;
  getChangelog: (cvId: string) => HistoryEntry[];
}

const MAX_UNDO = 50;
const MAX_CHANGELOG = 100;

export const useHistoryStore = create<HistoryState>((set, get) => ({
  undoStack: [],
  redoStack: [],
  changelog: [],

  pushUndo: (snapshot, label) => {
    set((state) => ({
      undoStack: [...state.undoStack.slice(-(MAX_UNDO - 1)), snapshot],
      redoStack: [],
      changelog: [
        ...state.changelog.slice(-(MAX_CHANGELOG - 1)),
        {
          timestamp: new Date().toISOString(),
          label,
          snapshot: JSON.parse(JSON.stringify(snapshot)),
        },
      ],
    }));
  },

  undo: () => {
    const { undoStack } = get();
    if (undoStack.length === 0) return null;
    const previous = undoStack[undoStack.length - 1];
    set((state) => ({
      undoStack: state.undoStack.slice(0, -1),
    }));
    return JSON.parse(JSON.stringify(previous));
  },

  redo: () => {
    const { redoStack } = get();
    if (redoStack.length === 0) return null;
    const next = redoStack[redoStack.length - 1];
    set((state) => ({
      redoStack: state.redoStack.slice(0, -1),
    }));
    return JSON.parse(JSON.stringify(next));
  },

  clearHistory: () => set({ undoStack: [], redoStack: [] }),

  getChangelog: (cvId) => {
    return get().changelog.filter((e) => e.snapshot.meta.id === cvId);
  },
}));
