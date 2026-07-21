import { useTranslation } from "react-i18next";
import { HomeScreen } from "./components/HomeScreen";
import { KeyboardShortcuts } from "./components/KeyboardShortcuts";
import { MotivationalBackground } from "./components/MotivationalBackground";
import { UpdateChecker } from "./components/UpdateChecker";
import { ThemeToggle } from "./components/ui";
import { SectionEditor } from "./features/editor/SectionEditor";
import { SectionNav } from "./features/editor/SectionNav";
import { CVPreview } from "./features/preview/CVPreview";
import { useCVStore } from "./stores/cvStore";

export function App() {
  const currentCVId = useCVStore((s) => s.currentCVId);
  const cv = useCVStore((s) => s.getCurrentCV());
  const createCV = useCVStore((s) => s.createCV);
  const selectCV = useCVStore((s) => s.selectCV);

  if (!currentCVId || !cv) {
    return (
      <div className="relative">
        <MotivationalBackground />
        <UpdateChecker />
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <HomeScreen onNewCV={createCV} />
      </div>
    );
  }

  return (
    <>
      <KeyboardShortcuts />
      <EditorLayout cv={cv} onBack={() => selectCV(null)} />
    </>
  );
}

function EditorLayout({
  cv,
  onBack,
}: {
  cv: { meta: { template: string }; profile: { firstName: string; lastName: string } };
  onBack: () => void;
}) {
  const { t } = useTranslation();

  const displayName =
    cv.profile.firstName || cv.profile.lastName
      ? `${cv.profile.firstName} ${cv.profile.lastName}`.trim()
      : t("home.newCv");

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-4 h-13 border-b border-border bg-surface/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-ink-muted hover:text-ink transition-colors px-2.5 py-1.5 rounded-lg hover:bg-border-light"
          >
            &larr; Accueil
          </button>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2.5">
            <h1 className="text-sm font-semibold text-ink truncate">{displayName}</h1>
            <span className="text-[11px] text-accent bg-accent/10 px-2 py-0.5 rounded-full font-medium">
              {cv.meta.template}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-52 border-r border-border bg-surface/50 p-3 overflow-y-auto shrink-0">
          <SectionNav />
        </aside>

        <div className="flex-1 overflow-auto bg-paper p-6 flex justify-center">
          <CVPreview />
        </div>

        <aside className="w-80 border-l border-border bg-surface/50 p-4 overflow-y-auto shrink-0">
          <SectionEditor />
        </aside>
      </main>
    </div>
  );
}
