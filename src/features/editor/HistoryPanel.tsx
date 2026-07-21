import { Button } from "../../components/ui";
import { useCVStore } from "../../stores/cvStore";
import { useHistoryStore } from "../../stores/historyStore";

export function HistoryPanel() {
  const cv = useCVStore((s) => s.getCurrentCV());
  const undo = useCVStore((s) => s.undo);
  const redo = useCVStore((s) => s.redo);
  const undoStack = useHistoryStore((s) => s.undoStack);
  const redoStack = useHistoryStore((s) => s.redoStack);
  const changelog = useHistoryStore((s) => s.changelog);

  if (!cv) return null;

  const cvChanges = changelog.filter((e) => e.snapshot.meta.id === cv.meta.id);
  const recentChanges = cvChanges.slice(-20).reverse();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">Historique</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={undo} disabled={undoStack.length === 0}>
            Annuler
          </Button>
          <Button variant="ghost" size="sm" onClick={redo} disabled={redoStack.length === 0}>
            Rétablir
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-accent/5 border border-accent/10">
        <div className="text-xs text-ink-muted">
          <span className="font-medium text-ink">{undoStack.length}</span> annulation
          {undoStack.length !== 1 ? "s" : ""} disponible{undoStack.length !== 1 ? "s" : ""}
        </div>
        <span className="text-border">·</span>
        <div className="text-xs text-ink-muted">Ctrl+Z / Ctrl+Y</div>
      </div>

      {recentChanges.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-ink-muted">Aucune modification enregistrée.</p>
          <p className="text-xs text-ink-muted mt-1">
            L'historique se remplit au fur et à mesure que tu édites ton CV.
          </p>
        </div>
      )}

      {recentChanges.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
            Modifications récentes
          </p>
          {recentChanges.map((entry, i) => {
            const date = new Date(entry.timestamp);
            const time = date.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            return (
              <div
                key={`${entry.timestamp}-${i}`}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent/40 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ink truncate">{entry.label}</p>
                </div>
                <span className="text-[10px] text-ink-muted font-mono shrink-0">{time}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
