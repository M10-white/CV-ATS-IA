import { useEffect } from "react";
import { useCVStore } from "../stores/cvStore";

export function KeyboardShortcuts() {
  const undo = useCVStore((s) => s.undo);
  const redo = useCVStore((s) => s.redo);
  const currentCVId = useCVStore((s) => s.currentCVId);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!currentCVId) return;
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentCVId, undo, redo]);

  return null;
}
