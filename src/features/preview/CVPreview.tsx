import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui";
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

  const handleExport = async () => {
    if (!previewRef.current || exporting) return;
    setExporting(true);
    try {
      const filename =
        cv.profile.firstName || cv.profile.lastName
          ? `${cv.profile.firstName}_${cv.profile.lastName}_CV`.replace(/\s+/g, "_")
          : "CV";
      await exportToPdf(previewRef.current, filename);
    } finally {
      setExporting(false);
    }
  };

  handleExportRef.current = handleExport;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handleExport} disabled={exporting}>
          {exporting ? "Export en cours..." : t("nav.export")}
        </Button>
      </div>
      <div
        ref={previewRef}
        className="shadow-md"
        style={{ transform: "scale(0.75)", transformOrigin: "top center" }}
      >
        <Template cv={cv} />
      </div>
    </div>
  );
}
