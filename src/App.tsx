import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AboutModal } from "./components/AboutModal";
import { ToastContainer } from "./components/Toast";
import { HomeScreen } from "./components/HomeScreen";
import { KeyboardShortcuts } from "./components/KeyboardShortcuts";
import { SplashScreen } from "./components/SplashScreen";
import { UpdateChecker } from "./components/UpdateChecker";
import { ThemeToggle } from "./components/ui";
import { SectionEditor } from "./features/editor/SectionEditor";
import { SectionNav } from "./features/editor/SectionNav";
import { CVPreview } from "./features/preview/CVPreview";
import { useCVStore } from "./stores/cvStore";
import { useSettingsStore } from "./stores/settingsStore";

export function App() {
  const { i18n } = useTranslation();
  const storedLang = useSettingsStore((s) => s.language);
  const currentCVId = useCVStore((s) => s.currentCVId);
  const cv = useCVStore((s) => s.getCurrentCV());
  const createCV = useCVStore((s) => s.createCV);
  const selectCV = useCVStore((s) => s.selectCV);
  const [splashDone, setSplashDone] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    if (i18n.language !== storedLang) {
      i18n.changeLanguage(storedLang);
    }
  }, [i18n, storedLang]);

  useEffect(() => {
    if (currentCVId && cv) {
      setTransitioning(true);
      const t = setTimeout(() => {
        setShowEditor(true);
        setTransitioning(false);
      }, 400);
      return () => clearTimeout(t);
    }
    if (!currentCVId) {
      setTransitioning(true);
      const t = setTimeout(() => {
        setShowEditor(false);
        setTransitioning(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [currentCVId, cv]);

  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  if (!splashDone) {
    return <SplashScreen onDone={handleSplashDone} />;
  }

  if (showEditor && cv) {
    return (
      <div
        style={{
          animation: "pageSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <KeyboardShortcuts />
        <ToastContainer />
        <EditorLayout cv={cv} onBack={() => selectCV(null)} />
        <style>{`
          @keyframes pageSlideIn {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="relative"
      style={{
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? "scale(0.97)" : "scale(1)",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <UpdateChecker />
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>
      <ToastContainer />
      <HomeScreen onNewCV={createCV} />
    </div>
  );
}

function LanguageSelector() {
  const { i18n } = useTranslation();
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const current = i18n.resolvedLanguage ?? i18n.language;
  const toggle = () => {
    const next = current === "fr" ? "en" : "fr";
    setLanguage(next);
    i18n.changeLanguage(next);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      className="text-xs font-medium text-ink-muted hover:text-ink px-2.5 py-1.5 rounded-lg transition-all duration-200 uppercase tracking-wide hover:bg-border-light"
      style={{ backdropFilter: "blur(8px)" }}
    >
      {current === "fr" ? "EN" : "FR"}
    </button>
  );
}

function EditorLayout({
  cv,
  onBack,
}: {
  cv: { meta: { title?: string; template: string }; profile: { firstName: string; lastName: string; jobTitle?: string; email?: string; phone?: string; summary?: string }; sections?: { type: string; items?: unknown[] }[] };
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const [showAbout, setShowAbout] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const updateMeta = useCVStore((s) => s.updateMeta);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const displayName = cv.meta.title
    ? cv.meta.title
    : cv.profile.firstName || cv.profile.lastName
      ? `${cv.profile.firstName} ${cv.profile.lastName}`.trim()
      : t("home.newCv");

  const startEditing = () => {
    setTitleDraft(cv.meta.title || "");
    setEditingTitle(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const commitTitle = () => {
    updateMeta({ title: titleDraft.trim() });
    setEditingTitle(false);
  };


  return (
    <div className="flex flex-col h-screen">
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}

      {/* Premium header */}
      <header
        className="flex items-center justify-between px-5 h-14 border-b shrink-0"
        style={{
          borderColor: "var(--color-border)",
          background: "color-mix(in srgb, var(--color-surface), transparent 20%)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="group flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-all px-2.5 py-1.5 rounded-lg hover:bg-border-light"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-0.5">&larr;</span>
            {t("home.title")}
          </button>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: "var(--color-success)",
                boxShadow: "0 0 8px var(--color-success)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            {editingTitle ? (
              <input
                ref={titleInputRef}
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={(e) => { if (e.key === "Enter") commitTitle(); if (e.key === "Escape") setEditingTitle(false); }}
                className="text-sm font-semibold text-ink bg-transparent border-b-2 border-accent outline-none px-1 py-0.5 max-w-[200px]"
                placeholder={t("home.newCv")}
              />
            ) : (
              <h1
                className="text-sm font-semibold text-ink truncate cursor-pointer hover:text-accent transition-colors"
                onClick={startEditing}
                title={t("actions.rename") || "Renommer"}
              >
                {displayName}
              </h1>
            )}
            <span
              className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
              style={{
                background: "linear-gradient(135deg, var(--color-accent-dim), color-mix(in srgb, var(--color-accent), transparent 85%))",
                color: "var(--color-accent-text)",
              }}
            >
              {cv.meta.template}
            </span>

          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowAbout(true)}
            className="text-xs text-ink-muted hover:text-ink w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:bg-border-light"
            title="À propos"
          >
            ?
          </button>
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Side nav with subtle gradient */}
        <aside
          className="w-52 border-r p-3 overflow-y-auto shrink-0"
          style={{
            borderColor: "var(--color-border)",
            background: "color-mix(in srgb, var(--color-surface), transparent 50%)",
          }}
        >
          <SectionNav />
        </aside>

        {/* Preview pane */}
        <div
          className="flex-1 overflow-auto p-6 flex justify-center"
          style={{
            background: "var(--color-paper)",
            backgroundImage: "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--color-accent), transparent 96%), transparent 60%)",
          }}
        >
          <CVPreview />
        </div>

        {/* Editor pane */}
        <aside
          className="w-80 border-l p-4 overflow-y-auto shrink-0"
          style={{
            borderColor: "var(--color-border)",
            background: "color-mix(in srgb, var(--color-surface), transparent 50%)",
          }}
        >
          <SectionEditor />
        </aside>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
