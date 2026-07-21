import { Input } from "../../components/ui";
import { useCVStore } from "../../stores/cvStore";
import { TEMPLATES } from "../../types/template";

const FONTS = ["Inter", "Source Sans 3", "Lato", "Roboto", "Open Sans", "Merriweather", "Georgia"];

export function CustomizationPanel() {
  const cv = useCVStore((s) => s.getCurrentCV());
  const updateCustomization = useCVStore((s) => s.updateCustomization);

  if (!cv) return null;

  const setTemplate = (templateId: string) => {
    useCVStore.setState((state) => ({
      cvList: state.cvList.map((c) =>
        c.meta.id === state.currentCVId ? { ...c, meta: { ...c.meta, template: templateId } } : c,
      ),
    }));
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
          Template
        </p>
        <div className="flex flex-col gap-2">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => setTemplate(tmpl.id)}
              className={`text-left px-3 py-2.5 rounded-md border transition-colors ${
                cv.meta.template === tmpl.id
                  ? "border-accent bg-accent-dim"
                  : "border-border-light hover:border-border"
              }`}
            >
              <p className="text-sm font-medium text-ink">{tmpl.name}</p>
              <p className="text-xs text-ink-muted mt-0.5">{tmpl.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
          Couleur d'accent
        </p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={cv.customization.colors.accent}
            onChange={(e) => updateCustomization({ colors: { accent: e.target.value } })}
            className="w-8 h-8 rounded cursor-pointer border border-border"
          />
          <span className="text-sm text-ink-secondary font-mono">
            {cv.customization.colors.accent}
          </span>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">Police</p>
        <div className="flex flex-wrap gap-1.5">
          {FONTS.map((font) => (
            <button
              key={font}
              type="button"
              onClick={() => updateCustomization({ font })}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                cv.customization.font === font
                  ? "bg-accent text-white"
                  : "bg-surface text-ink-secondary hover:bg-border-light"
              }`}
              style={{ fontFamily: `'${font}', system-ui, sans-serif` }}
            >
              {font}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Input
          id="fontSize"
          label="Taille du texte (pt)"
          type="number"
          min={8}
          max={14}
          step={0.5}
          value={cv.customization.fontSize}
          onChange={(e) => updateCustomization({ fontSize: Number(e.target.value) })}
        />
      </div>

      <div>
        <Input
          id="lineSpacing"
          label="Interligne"
          type="number"
          min={1}
          max={2}
          step={0.05}
          value={cv.customization.lineSpacing}
          onChange={(e) => updateCustomization({ lineSpacing: Number(e.target.value) })}
        />
      </div>
    </div>
  );
}
