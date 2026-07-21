import { useTranslation } from "react-i18next";
import { Button, Input, Textarea } from "../../components/ui";
import { useCVStore } from "../../stores/cvStore";
import type { ProjectItem } from "../../types/cv";

export function ProjectsEditor() {
  const { t } = useTranslation();
  const cv = useCVStore((s) => s.getCurrentCV());
  const addProject = useCVStore((s) => s.addProject);
  const updateProject = useCVStore((s) => s.updateProject);
  const removeProject = useCVStore((s) => s.removeProject);

  if (!cv) return null;
  const section = cv.sections.find((s) => s.type === "projects");
  if (!section) return null;
  const items = section.items as ProjectItem[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{t("editor.section.projects.title")}</h3>
        <Button variant="ghost" size="sm" onClick={addProject}>
          + {t("editor.section.projects.addItem")}
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-ink-muted py-4 text-center">
          {t("editor.section.projects.addItem")}
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
              onClick={() => removeProject(item.id)}
              className="text-xs text-danger hover:text-danger/80 transition-colors"
            >
              {t("actions.delete")}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              id={`name-${item.id}`}
              label={t("editor.section.projects.name")}
              value={item.name}
              onChange={(e) => updateProject(item.id, { name: e.target.value })}
            />
            <Input
              id={`role-${item.id}`}
              label={t("editor.section.projects.role")}
              value={item.role}
              onChange={(e) => updateProject(item.id, { role: e.target.value })}
            />
          </div>
          <Input
            id={`url-${item.id}`}
            label={t("editor.section.projects.url")}
            value={item.url}
            onChange={(e) => updateProject(item.id, { url: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id={`startDate-${item.id}`}
              label={t("editor.section.experience.startDate")}
              placeholder="MM/YYYY"
              value={item.startDate}
              onChange={(e) => updateProject(item.id, { startDate: e.target.value })}
            />
            <Input
              id={`endDate-${item.id}`}
              label={t("editor.section.experience.endDate")}
              placeholder="MM/YYYY"
              value={item.endDate}
              onChange={(e) => updateProject(item.id, { endDate: e.target.value })}
            />
          </div>
          <Textarea
            id={`desc-${item.id}`}
            label={t("editor.section.experience.description")}
            value={item.description}
            rows={3}
            onChange={(e) => updateProject(item.id, { description: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}
