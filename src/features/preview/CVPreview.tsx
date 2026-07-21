import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui";
import { useCVStore } from "../../stores/cvStore";
import type { CVData } from "../../types/cv";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";

const TEMPLATE_MAP: Record<string, React.ComponentType<{ cv: CVData }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
};

export function CVPreview() {
  const { t } = useTranslation();
  const cv = useCVStore((s) => s.getCurrentCV());
  const previewRef = useRef<HTMLDivElement>(null);

  if (!cv) return null;

  const Template = TEMPLATE_MAP[cv.meta.template] ?? ClassicTemplate;

  const handleExport = () => {
    if (!previewRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const content = previewRef.current.innerHTML;
    const font = cv.customization.font;

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
<title>${cv.profile.firstName} ${cv.profile.lastName} - CV</title>
<style>
  @page { margin: 0; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: '${font}', system-ui, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style>
</head>
<body>${content}</body>
</html>`);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handleExport}>
          {t("nav.export")}
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
