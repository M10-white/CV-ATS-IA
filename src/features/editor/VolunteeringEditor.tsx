import { useTranslation } from "react-i18next";
import { Button, Input, Textarea } from "../../components/ui";
import { useCVStore } from "../../stores/cvStore";
import type { VolunteerItem } from "../../types/cv";

export function VolunteeringEditor() {
  const { t } = useTranslation();
  const cv = useCVStore((s) => s.getCurrentCV());
  const addVolunteer = useCVStore((s) => s.addVolunteer);
  const updateVolunteer = useCVStore((s) => s.updateVolunteer);
  const removeVolunteer = useCVStore((s) => s.removeVolunteer);

  if (!cv) return null;
  const section = cv.sections.find((s) => s.type === "volunteering");
  if (!section) return null;
  const items = section.items as VolunteerItem[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{t("editor.section.volunteering.title")}</h3>
        <Button variant="ghost" size="sm" onClick={addVolunteer}>
          + {t("editor.section.volunteering.addItem")}
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-ink-muted py-4 text-center">
          {t("editor.section.volunteering.addItem")}
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
              onClick={() => removeVolunteer(item.id)}
              className="text-xs text-danger hover:text-danger/80 transition-colors"
            >
              {t("actions.delete")}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              id={`org-${item.id}`}
              label={t("editor.section.volunteering.organization")}
              value={item.organization}
              onChange={(e) => updateVolunteer(item.id, { organization: e.target.value })}
            />
            <Input
              id={`role-${item.id}`}
              label={t("editor.section.volunteering.role")}
              value={item.role}
              onChange={(e) => updateVolunteer(item.id, { role: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              id={`startDate-${item.id}`}
              label={t("editor.section.experience.startDate")}
              placeholder="MM/YYYY"
              value={item.startDate}
              onChange={(e) => updateVolunteer(item.id, { startDate: e.target.value })}
            />
            <div>
              <Input
                id={`endDate-${item.id}`}
                label={t("editor.section.experience.endDate")}
                placeholder="MM/YYYY"
                value={item.current ? "" : item.endDate}
                disabled={item.current}
                onChange={(e) => updateVolunteer(item.id, { endDate: e.target.value })}
              />
              <label className="flex items-center gap-2 mt-1.5 text-xs text-ink-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.current}
                  onChange={(e) =>
                    updateVolunteer(item.id, { current: e.target.checked, endDate: "" })
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
            onChange={(e) => updateVolunteer(item.id, { description: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}
