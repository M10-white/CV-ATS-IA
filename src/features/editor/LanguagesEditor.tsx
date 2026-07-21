import { useTranslation } from "react-i18next";
import { Button, Input } from "../../components/ui";
import { useCVStore } from "../../stores/cvStore";
import type { LanguageItem } from "../../types/cv";

export function LanguagesEditor() {
  const { t } = useTranslation();
  const cv = useCVStore((s) => s.getCurrentCV());
  const addLanguage = useCVStore((s) => s.addLanguage);
  const updateLanguage = useCVStore((s) => s.updateLanguage);
  const removeLanguage = useCVStore((s) => s.removeLanguage);

  if (!cv) return null;
  const section = cv.sections.find((s) => s.type === "languages");
  if (!section) return null;
  const items = section.items as LanguageItem[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{t("editor.section.languages.title")}</h3>
        <Button variant="ghost" size="sm" onClick={addLanguage}>
          + {t("editor.section.languages.addItem")}
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-ink-muted py-4 text-center">
          {t("editor.section.languages.addItem")}
        </p>
      )}

      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-md border border-border-light bg-raised p-3 flex items-end gap-3"
        >
          <span className="text-xs font-medium text-ink-muted pb-2">#{index + 1}</span>
          <div className="flex-1">
            <Input
              id={`lang-${item.id}`}
              label={t("editor.section.languages.language")}
              value={item.language}
              onChange={(e) => updateLanguage(item.id, { language: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <Input
              id={`level-${item.id}`}
              label={t("editor.section.languages.level")}
              placeholder="Natif, C2, B2..."
              value={item.level}
              onChange={(e) => updateLanguage(item.id, { level: e.target.value })}
            />
          </div>
          <button
            type="button"
            onClick={() => removeLanguage(item.id)}
            className="text-xs text-danger hover:text-danger/80 transition-colors pb-2"
          >
            {t("actions.delete")}
          </button>
        </div>
      ))}
    </div>
  );
}
