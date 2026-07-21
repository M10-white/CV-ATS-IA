import { useTranslation } from "react-i18next";
import { HomeScreen } from "./components/HomeScreen";
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
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <HomeScreen onNewCV={createCV} />
      </div>
    );
  }

  return <EditorLayout cv={cv} onBack={() => selectCV(null)} />;
}

function EditorLayout({
  cv,
  onBack,
}: {
  cv: { profile: { firstName: string; lastName: string } };
  onBack: () => void;
}) {
  const { t } = useTranslation();

  const displayName =
    cv.profile.firstName || cv.profile.lastName
      ? `${cv.profile.firstName} ${cv.profile.lastName}`.trim()
      : t("home.newCv");

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-4 h-12 border-b border-border bg-surface shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-ink-secondary hover:text-ink transition-colors px-1"
          >
            &larr;
          </button>
          <h1 className="text-sm font-semibold text-ink truncate">{displayName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-52 border-r border-border bg-surface p-3 overflow-y-auto shrink-0">
          <SectionNav />
        </aside>

        <div className="flex-1 overflow-auto bg-paper p-6 flex justify-center">
          <CVPreview />
        </div>

        <aside className="w-80 border-l border-border bg-surface p-4 overflow-y-auto shrink-0">
          <SectionEditor />
        </aside>
      </main>
    </div>
  );
}
