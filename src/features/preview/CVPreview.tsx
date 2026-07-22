import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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

  const handleExportRef = useRef<(() => void) | undefined>(undefined);

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
      toast("Word exporté !");
    } finally {
      setExporting(false);
    }
  };

  handleExportRef.current = handleExportPdf;

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-40 bg-black/80 flex flex-col items-center overflow-auto">
        <div className="sticky top-0 z-10 flex items-center gap-3 py-3 px-4 bg-black/60 backdrop-blur-sm w-full justify-center">
          <Button size="sm" onClick={handleExportPdf} disabled={exporting}>
            {exporting ? "..." : t("nav.export")}
          </Button>
          <Button size="sm" variant="secondary" onClick={handleExportDocx} disabled={exporting}>
            {exporting ? "..." : "Word (.docx)"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setFullscreen(false)} className="text-white">
            ✕
          </Button>
        </div>
        <div ref={previewRef} className="shadow-2xl my-6" data-preview>
          <Template cv={cv} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handleExportPdf} disabled={exporting}>
          {exporting ? "..." : t("nav.export")}
        </Button>
        <Button size="sm" variant="secondary" onClick={handleExportDocx} disabled={exporting}>
          {exporting ? "..." : "Word (.docx)"}
        </Button>
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          className="text-ink-muted hover:text-ink text-sm px-2 py-1 rounded-md hover:bg-border-light transition-colors"
          title="Plein écran"
        >
          ⛶
        </button>
      </div>
      <div
        ref={previewRef}
        className="shadow-md"
        data-preview
        style={{ transform: "scale(0.75)", transformOrigin: "top center" }}
      >
        <Template cv={cv} />
      </div>
    </div>
  );
}
