import { useTranslation } from "react-i18next";
import { useToast } from "../../components/Toast";
import { Button, Input, Textarea } from "../../components/ui";
import { useCVStore } from "../../stores/cvStore";
import type { EducationItem } from "../../types/cv";

export function EducationEditor() {
  const { t } = useTranslation();
  const cv = useCVStore((s) => s.getCurrentCV());
  const addEducation = useCVStore((s) => s.addEducation);
  const updateEducation = useCVStore((s) => s.updateEducation);
  const removeEducation = useCVStore((s) => s.removeEducation);
  const toast = useToast((s) => s.show);

  const duplicateEducation = (item: EducationItem) => {
    addEducation();
    const updated = useCVStore.getState().getCurrentCV();
    if (!updated) return;
    const sec = updated.sections.find((s) => s.type === "education");
    const newItem = sec?.items[sec.items.length - 1] as EducationItem | undefined;
    if (newItem) {
      updateEducation(newItem.id, {
        institution: item.institution,
        degree: item.degree,
        field: item.field,
        startDate: item.startDate,
        endDate: item.endDate,
        description: item.description,
      });
      toast(t("actions.duplicate") + " !");
    }
  };

  if (!cv) return null;
  const section = cv.sections.find((s) => s.type === "education");
  if (!section) return null;
  const items = section.items as EducationItem[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{t("editor.section.education.title")}</h3>
        <Button variant="ghost" size="sm" onClick={addEducation}>
          + {t("editor.section.education.addItem")}
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-ink-muted py-4 text-center">
          {t("editor.section.education.addItem")}
        </p>
      )}

      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-md border border-border-light bg-raised p-4 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-muted">#{index + 1}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => duplicateEducation(item)}
                className="text-xs text-ink-muted hover:text-ink transition-colors"
              >
                {t("actions.duplicate")}
              </button>
              <button
                type="button"
                onClick={() => removeEducation(item.id)}
                className="text-xs text-danger hover:text-danger/80 transition-colors"
              >
                {t("actions.delete")}
              </button>
            </div>
          </div>
          <Input
            id={`institution-${item.id}`}
            label={t("editor.section.education.institution")}
            value={item.institution}
            onChange={(e) => updateEducation(item.id, { institution: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id={`degree-${item.id}`}
              label={t("editor.section.education.degree")}
              value={item.degree}
              onChange={(e) => updateEducation(item.id, { degree: e.target.value })}
            />
            <Input
              id={`field-${item.id}`}
              label={t("editor.section.education.field")}
              value={item.field}
              onChange={(e) => updateEducation(item.id, { field: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              id={`eduStart-${item.id}`}
              label={t("editor.section.education.startDate")}
              placeholder="MM/YYYY"
              value={item.startDate}
              onChange={(e) => updateEducation(item.id, { startDate: e.target.value })}
            />
            <Input
              id={`eduEnd-${item.id}`}
              label={t("editor.section.education.endDate")}
              placeholder="MM/YYYY"
              value={item.endDate}
              onChange={(e) => updateEducation(item.id, { endDate: e.target.value })}
            />
          </div>
          <Textarea
            id={`eduDesc-${item.id}`}
            label={t("editor.section.education.description")}
            value={item.description}
            rows={2}
            onChange={(e) => updateEducation(item.id, { description: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}
