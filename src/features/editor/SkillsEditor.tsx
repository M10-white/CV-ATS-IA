import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "../../components/ui";
import { useCVStore } from "../../stores/cvStore";
import type { SkillCategory } from "../../types/cv";

export function SkillsEditor() {
  const { t } = useTranslation();
  const cv = useCVStore((s) => s.getCurrentCV());
  const addSkillCategory = useCVStore((s) => s.addSkillCategory);
  const updateSkillCategory = useCVStore((s) => s.updateSkillCategory);
  const removeSkillCategory = useCVStore((s) => s.removeSkillCategory);

  const handleSkillsChange = useCallback(
    (itemId: string, value: string) => {
      const skills = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      updateSkillCategory(itemId, { items: skills });
    },
    [updateSkillCategory],
  );

  if (!cv) return null;
  const section = cv.sections.find((s) => s.type === "skills");
  if (!section) return null;
  const items = section.items as SkillCategory[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{t("editor.section.skills.title")}</h3>
        <Button variant="ghost" size="sm" onClick={addSkillCategory}>
          + {t("editor.section.skills.addCategory")}
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-ink-muted py-4 text-center">
          {t("editor.section.skills.addCategory")}
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
              onClick={() => removeSkillCategory(item.id)}
              className="text-xs text-danger hover:text-danger/80 transition-colors"
            >
              {t("actions.delete")}
            </button>
          </div>
          <Input
            id={`cat-${item.id}`}
            label={t("editor.section.skills.category")}
            placeholder="Langages, Frameworks, Outils..."
            value={item.category}
            onChange={(e) => updateSkillCategory(item.id, { category: e.target.value })}
          />
          <Input
            id={`skills-${item.id}`}
            label={t("editor.section.skills.items")}
            placeholder="React, TypeScript, Node.js..."
            value={item.items.join(", ")}
            onChange={(e) => handleSkillsChange(item.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
