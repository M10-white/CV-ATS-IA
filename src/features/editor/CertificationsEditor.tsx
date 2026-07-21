import { useTranslation } from "react-i18next";
import { Button, Input } from "../../components/ui";
import { useCVStore } from "../../stores/cvStore";
import type { CertificationItem } from "../../types/cv";

export function CertificationsEditor() {
  const { t } = useTranslation();
  const cv = useCVStore((s) => s.getCurrentCV());
  const addCertification = useCVStore((s) => s.addCertification);
  const updateCertification = useCVStore((s) => s.updateCertification);
  const removeCertification = useCVStore((s) => s.removeCertification);

  if (!cv) return null;
  const section = cv.sections.find((s) => s.type === "certifications");
  if (!section) return null;
  const items = section.items as CertificationItem[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">
          {t("editor.section.certifications.title")}
        </h3>
        <Button variant="ghost" size="sm" onClick={addCertification}>
          + {t("editor.section.certifications.addItem")}
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-ink-muted py-4 text-center">
          {t("editor.section.certifications.addItem")}
        </p>
      )}

      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-md border border-border-light bg-raised p-4 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-muted">#{index + 1}</span>
            <button
              type="button"
              onClick={() => removeCertification(item.id)}
              className="text-xs text-danger hover:text-danger/80 transition-colors"
            >
              {t("actions.delete")}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              id={`name-${item.id}`}
              label={t("editor.section.certifications.name")}
              value={item.name}
              onChange={(e) => updateCertification(item.id, { name: e.target.value })}
            />
            <Input
              id={`issuer-${item.id}`}
              label={t("editor.section.certifications.issuer")}
              value={item.issuer}
              onChange={(e) => updateCertification(item.id, { issuer: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              id={`date-${item.id}`}
              label={t("editor.section.certifications.date")}
              placeholder="MM/YYYY"
              value={item.date}
              onChange={(e) => updateCertification(item.id, { date: e.target.value })}
            />
            <Input
              id={`url-${item.id}`}
              label={t("editor.section.certifications.url")}
              value={item.url}
              onChange={(e) => updateCertification(item.id, { url: e.target.value })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
