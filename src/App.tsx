import { useCallback, useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { ThemeToggle } from "./components/ui";
import type { CVData } from "./types/cv";
import { createEmptyCV } from "./types/cv";

export function App() {
  const [currentCV, setCurrentCV] = useState<CVData | null>(null);

  const handleNewCV = useCallback(() => {
    const id = crypto.randomUUID();
    const cv = createEmptyCV(id, "default");
    setCurrentCV(cv);
  }, []);

  if (!currentCV) {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <HomeScreen onNewCV={handleNewCV} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentCV(null)}
            className="text-sm text-ink-secondary hover:text-ink transition-colors"
          >
            &larr;
          </button>
          <h1 className="text-sm font-semibold text-ink">
            {currentCV.profile.firstName || currentCV.profile.lastName
              ? `${currentCV.profile.firstName} ${currentCV.profile.lastName}`.trim()
              : "Nouveau CV"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-52 border-r border-border bg-surface p-4 overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
            Sections
          </p>
          {currentCV.sections.map((section) => (
            <div
              key={section.id}
              className="px-3 py-2 rounded-md text-sm text-ink-secondary hover:bg-border-light cursor-pointer transition-colors mb-1"
            >
              {section.type}
            </div>
          ))}
        </aside>

        <div className="flex-1 flex items-center justify-center bg-paper">
          <div className="w-[595px] h-[842px] bg-white border border-border shadow-sm rounded-sm flex items-center justify-center">
            <p className="text-ink-muted text-sm">Aperçu PDF</p>
          </div>
        </div>

        <aside className="w-80 border-l border-border bg-surface p-4 overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
            Éditeur
          </p>
          <p className="text-sm text-ink-secondary">Sélectionnez une section pour l'éditer.</p>
        </aside>
      </main>
    </div>
  );
}
