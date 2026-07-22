import { useTranslation } from "react-i18next";
import { useToast } from "../../components/Toast";
import { Button, Input, Textarea } from "../../components/ui";
import { useCVStore } from "../../stores/cvStore";
import type { ExperienceItem } from "../../types/cv";

export function ExperienceEditor() {
  const { t } = useTranslation();
  const cv = useCVStore((s) => s.getCurrentCV());
  const addExperience = useCVStore((s) => s.addExperience);
  const updateExperience = useCVStore((s) => s.updateExperience);
  const removeExperience = useCVStore((s) => s.removeExperience);
  const toast = useToast((s) => s.show);

  const duplicateExperience = (item: ExperienceItem) => {
    addExperience();
    const updated = useCVStore.getState().getCurrentCV();
    if (!updated) return;
    const section = updated.sections.find((s) => s.type === "experience");
    const newItem = section?.items[section.items.length - 1] as ExperienceItem | undefined;
    if (newItem) {
      updateExperience(newItem.id, {
        company: item.company,
        position: item.position,
        startDate: item.startDate,
        endDate: item.endDate,
        current: item.current,
        description: item.description,
      });
      toast(t("actions.duplicate") + " !");
    }
  };

  if (!cv) return null;
  const section = cv.sections.find((s) => s.type === "experience");
  if (!section) return null;
  const items = section.items as ExperienceItem[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{t("editor.section.experience.title")}</h3>
        <Button variant="ghost" size="sm" onClick={addExperience}>
          + {t("editor.section.experience.addItem")}
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-ink-muted py-4 text-center">
          {t("editor.section.experience.addItem")}
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
                onClick={() => duplicateExperience(item)}
                className="text-xs text-ink-muted hover:text-ink transition-colors"
              >
                {t("actions.duplicate")}
              </button>
              <button
                type="button"
                onClick={() => removeExperience(item.id)}
                className="text-xs text-danger hover:text-danger/80 transition-colors"
              >
                {t("actions.delete")}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              id={`company-${item.id}`}
              label={t("editor.section.experience.company")}
              value={item.company}
              onChange={(e) => updateExperience(item.id, { company: e.target.value })}
            />
            <Input
              id={`position-${item.id}`}
              label={t("editor.section.experience.position")}
              value={item.position}
              onChange={(e) => updateExperience(item.id, { position: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              id={`startDate-${item.id}`}
              label={t("editor.section.experience.startDate")}
              placeholder="MM/YYYY"
              value={item.startDate}
              onChange={(e) => updateExperience(item.id, { startDate: e.target.value })}
            />
            <div>
              <Input
                id={`endDate-${item.id}`}
                label={t("editor.section.experience.endDate")}
                placeholder="MM/YYYY"
                value={item.current ? "" : item.endDate}
                disabled={item.current}
                onChange={(e) => updateExperience(item.id, { endDate: e.target.value })}
              />
              <label className="flex items-center gap-2 mt-1.5 text-xs text-ink-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.current}
                  onChange={(e) =>
                    updateExperience(item.id, { current: e.target.checked, endDate: "" })
                  }
                  className="rounded border-border accent-accent"
                />
                {t("editor.section.experience.current")}
              </label>
            </div>
          </div>
          <Textarea
            id={`desc-${item.id}`}
            label={t("editor.section.experience.description")}
            value={item.description}
            rows={3}
            onChange={(e) => updateExperience(item.id, { description: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}
