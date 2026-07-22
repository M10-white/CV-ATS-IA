import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AboutModal } from "./components/AboutModal";
import { ToastContainer } from "./components/Toast";
import { HomeScreen } from "./components/HomeScreen";
import { KeyboardShortcuts } from "./components/KeyboardShortcuts";
import { MotivationalBackground } from "./components/MotivationalBackground";
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
      <MotivationalBackground />
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

function CompletionRing({ percent }: { percent: number }) {
  const r = 11;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const color = percent >= 80 ? "var(--color-success)" : percent >= 50 ? "var(--color-warning)" : "var(--color-accent)";

  return (
    <div className="relative flex items-center justify-center" title={`${percent}% complet`}>
      <svg width={28} height={28} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={14} cy={14} r={r} fill="none" stroke="var(--color-border-light)" strokeWidth={2.5} />
        <circle
          cx={14} cy={14} r={r} fill="none"
          stroke={color} strokeWidth={2.5} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>
      <span className="absolute text-[8px] font-bold tabular-nums" style={{ color }}>
        {percent}
      </span>
    </div>
  );
}

function EditorLayout({
  cv,
  onBack,
}: {
  cv: { meta: { template: string }; profile: { firstName: string; lastName: string; jobTitle?: string; email?: string; phone?: string; summary?: string }; sections?: { type: string; items?: unknown[] }[] };
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const [showAbout, setShowAbout] = useState(false);

  const displayName =
    cv.profile.firstName || cv.profile.lastName
      ? `${cv.profile.firstName} ${cv.profile.lastName}`.trim()
      : t("home.newCv");

  const completion = useMemo(() => {
    let filled = 0;
    let total = 0;
    const check = (v: unknown) => { total++; if (v && String(v).trim()) filled++; };
    check(cv.profile.firstName);
    check(cv.profile.lastName);
    check(cv.profile.jobTitle);
    check(cv.profile.email);
    check(cv.profile.phone);
    check(cv.profile.summary);
    if (cv.sections) {
      for (const s of cv.sections) {
        total++;
        if (s.items && Array.isArray(s.items) && s.items.length > 0) filled++;
      }
    }
    return total > 0 ? Math.round((filled / total) * 100) : 0;
  }, [cv]);

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
            <h1 className="text-sm font-semibold text-ink truncate">{displayName}</h1>
            <span
              className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
              style={{
                background: "linear-gradient(135deg, var(--color-accent-dim), color-mix(in srgb, var(--color-accent), transparent 85%))",
                color: "var(--color-accent-text)",
              }}
            >
              {cv.meta.template}
            </span>
            <CompletionRing percent={completion} />
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
