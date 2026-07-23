import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Confetti } from "../../components/Confetti";
import { useToast } from "../../components/Toast";
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

  const exportCV = useCVStore((s) => s.exportCV);

  const getFilename = () => {
    if (cv.meta.title) return cv.meta.title.replace(/\s+/g, "_");
    if (cv.profile.firstName || cv.profile.lastName)
      return `${cv.profile.firstName}_${cv.profile.lastName}_CV`.replace(/\s+/g, "_");
    return "CV";
  };

  const toast = useToast((s) => s.show);

  const handleExportJson = () => {
    const data = exportCV(cv.meta.id);
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${getFilename()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setConfetti(true);
    toast("JSON exporté !");
  };

  const handleExportTxt = () => {
    const lines: string[] = [];
    const name = `${cv.profile.firstName} ${cv.profile.lastName}`.trim();
    if (name) lines.push(name);
    if (cv.profile.jobTitle) lines.push(cv.profile.jobTitle);
    if (cv.profile.email) lines.push(cv.profile.email);
    if (cv.profile.phone) lines.push(cv.profile.phone);
    if (cv.profile.location) lines.push(cv.profile.location);
    if (cv.profile.summary) { lines.push(""); lines.push(cv.profile.summary); }
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${getFilename()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setConfetti(true);
    toast("TXT exporté !");
  };

  const handleExportHtml = () => {
    if (!previewRef.current) return;
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules).map((r) => r.cssText).join("\n");
        } catch { return ""; }
      })
      .join("\n");
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${getFilename()}</title>
<style>${styles}</style>
</head>
<body style="margin:0;display:flex;justify-content:center;padding:20px;background:#f5f5f5">
${previewRef.current.outerHTML}
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${getFilename()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setConfetti(true);
    toast("HTML exporté !");
  };

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

  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showExportMenu) return;
    const handler = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showExportMenu]);

  const exportBar = (
    <div className="flex items-center gap-2">
      <div className="relative" ref={exportMenuRef}>
        <button
          type="button"
          onClick={() => setShowExportMenu(!showExportMenu)}
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
          <span className="relative z-10 ml-1 text-white/70 text-xs">&#9662;</span>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              animation: "shimmer 2s infinite",
            }}
          />
        </button>
        {showExportMenu && (
          <div
            className="absolute top-full left-0 mt-1.5 min-w-[160px] rounded-xl border overflow-hidden z-50"
            style={{
              background: "var(--color-raised)",
              borderColor: "var(--color-border-light)",
              boxShadow: "0 8px 24px -4px rgba(0,0,0,0.2)",
              animation: "exportMenuIn 0.15s ease-out both",
            }}
          >
            <button
              type="button"
              onClick={() => { setShowExportMenu(false); handleExportPdf(); }}
              className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-border-light transition-colors flex items-center gap-2"
            >
              PDF
            </button>
            <div className="h-px" style={{ background: "var(--color-border-light)" }} />
            <button
              type="button"
              onClick={() => { setShowExportMenu(false); handleExportDocx(); }}
              className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-border-light transition-colors flex items-center gap-2"
            >
              Word (.docx)
            </button>
            <div className="h-px" style={{ background: "var(--color-border-light)" }} />
            <button
              type="button"
              onClick={() => { setShowExportMenu(false); handleExportHtml(); }}
              className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-border-light transition-colors flex items-center gap-2"
            >
              HTML
            </button>
            <div className="h-px" style={{ background: "var(--color-border-light)" }} />
            <button
              type="button"
              onClick={() => { setShowExportMenu(false); handleExportJson(); }}
              className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-border-light transition-colors flex items-center gap-2"
            >
              JSON
            </button>
            <div className="h-px" style={{ background: "var(--color-border-light)" }} />
            <button
              type="button"
              onClick={() => { setShowExportMenu(false); handleExportTxt(); }}
              className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-border-light transition-colors flex items-center gap-2"
            >
              Texte (.txt)
            </button>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => setFullscreen(!fullscreen)}
        className="text-ink-muted hover:text-ink text-sm w-8 h-8 flex items-center justify-center rounded-xl hover:bg-border-light transition-all duration-200 hover:scale-110"
        title="Plein écran"
      >
        {fullscreen ? "×" : "⤢"}
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
          @keyframes exportMenuIn {
            from { opacity: 0; transform: translateY(-4px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
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
