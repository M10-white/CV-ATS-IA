import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Confetti } from "../../components/Confetti";
import { useToast } from "../../components/Toast";
import { Button } from "../../components/ui";
import { exportToDocx } from "../../lib/exportDocx";
import { exportToPdf } from "../../lib/exportPdf";
import { useCVStore } from "../../stores/cvStore";
import type { CVData } from "../../types/cv";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { CompactTemplate } from "./templates/CompactTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";

const TEMPLATE_MAP: Record<string, React.ComponentType<{ cv: CVData }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
  compact: CompactTemplate,
};

export function CVPreview() {
  const { t } = useTranslation();
  const cv = useCVStore((s) => s.getCurrentCV());
  const previewRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const handleExportRef = useRef<(() => void) | undefined>(undefined);

  const stopConfetti = useCallback(() => setConfetti(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        handleExportRef.current?.();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!cv) return null;

  const Template = TEMPLATE_MAP[cv.meta.template] ?? ClassicTemplate;

  const getFilename = () =>
    cv.profile.firstName || cv.profile.lastName
      ? `${cv.profile.firstName}_${cv.profile.lastName}_CV`.replace(/\s+/g, "_")
      : "CV";

  const toast = useToast((s) => s.show);

  const handleExportPdf = async () => {
    if (!previewRef.current || exporting) return;
    setExporting(true);
    try {
      await exportToPdf(previewRef.current, getFilename());
      setConfetti(true);
      toast("PDF exporté !");
    } finally {
      setExporting(false);
    }
  };

  const handleExportDocx = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      await exportToDocx(cv, getFilename());
      setConfetti(true);
      toast("Word exporté !");
    } finally {
      setExporting(false);
    }
  };

  handleExportRef.current = handleExportPdf;

  const exportBar = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleExportPdf}
        disabled={exporting}
        className="group relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-medium text-white cursor-pointer disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--color-accent), color-mix(in oklch, var(--color-accent), #6366f1 20%))",
          boxShadow: "0 4px 14px -4px color-mix(in srgb, var(--color-accent), transparent 50%)",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px) scale(1.03)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)"; }}
      >
        <span className="relative z-10">{exporting ? "..." : t("nav.export")}</span>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            animation: "shimmer 2s infinite",
          }}
        />
      </button>
      <Button size="sm" variant="secondary" onClick={handleExportDocx} disabled={exporting}>
        {exporting ? "..." : "Word (.docx)"}
      </Button>
      <button
        type="button"
        onClick={() => setFullscreen(!fullscreen)}
        className="text-ink-muted hover:text-ink text-sm w-8 h-8 flex items-center justify-center rounded-xl hover:bg-border-light transition-all duration-200 hover:scale-110"
        title="Plein écran"
      >
        {fullscreen ? "✕" : "⛶"}
      </button>
    </div>
  );

  if (fullscreen) {
    return (
      <>
        <Confetti active={confetti} onDone={stopConfetti} />
        <div className="fixed inset-0 z-40 bg-black/80 flex flex-col items-center overflow-auto">
          <div
            className="sticky top-0 z-10 flex items-center gap-3 py-3 px-4 w-full justify-center"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            {exportBar}
          </div>
          <div
            ref={previewRef}
            className="my-6"
            data-preview
            style={{
              boxShadow: "0 25px 60px -12px rgba(0,0,0,0.5)",
              animation: "previewReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}
          >
            <Template cv={cv} />
          </div>
        </div>
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes previewReveal {
            from { opacity: 0; transform: scale(0.9) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Confetti active={confetti} onDone={stopConfetti} />
      <div className="flex flex-col items-center gap-4">
        {exportBar}
        <div
          className="relative"
          style={{
            transform: "scale(0.75)",
            transformOrigin: "top center",
          }}
        >
          <div
            className="absolute -inset-1 rounded-lg opacity-30"
            style={{
              background: "linear-gradient(135deg, var(--color-accent), color-mix(in oklch, var(--color-accent), #6366f1), var(--color-accent))",
              backgroundSize: "200% 200%",
              animation: "glowShift 6s ease-in-out infinite",
              filter: "blur(8px)",
            }}
          />
          <div
            ref={previewRef}
            className="relative"
            data-preview
            style={{
              boxShadow: "0 8px 30px -8px rgba(0,0,0,0.15)",
              borderRadius: "4px",
            }}
          >
            <Template cv={cv} />
          </div>
        </div>
      </div>
    </>
  );
}
