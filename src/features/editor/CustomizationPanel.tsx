import { Input } from "../../components/ui";
import { useCVStore } from "../../stores/cvStore";
import { TEMPLATES } from "../../types/template";

const FONTS = ["Inter", "Source Sans 3", "Lato", "Roboto", "Open Sans", "Merriweather", "Georgia"];

const PRESET_COLORS = [
  "#be5985",
  "#9d174d",
  "#2d7d9a",
  "#1a5276",
  "#148f77",
  "#1e8449",
  "#7d3c98",
  "#c0392b",
  "#d35400",
  "#2c3e50",
];

const TEMPLATE_THUMBS: Record<string, { layout: string; color: string }> = {
  classic: { layout: "center", color: "#2d7d9a" },
  modern: { layout: "header", color: "#1a5276" },
  minimal: { layout: "clean", color: "#999" },
  executive: { layout: "border", color: "#1a1d23" },
  creative: { layout: "sidebar", color: "#7d3c98" },
  compact: { layout: "dense", color: "#d35400" },
};

function TemplateThumbnail({ id, active }: { id: string; active: boolean }) {
  const thumb = TEMPLATE_THUMBS[id] ?? { layout: "center", color: "#999" };
  const c = active ? "var(--color-accent)" : thumb.color;

  return (
    <svg viewBox="0 0 60 80" className="w-full h-full" style={{ display: "block" }}>
      <rect width="60" height="80" fill="white" rx="2" />
      {thumb.layout === "center" && (
        <>
          <rect x="18" y="6" width="24" height="3" rx="1" fill={c} />
          <rect x="22" y="11" width="16" height="1.5" rx="0.5" fill="#ccc" />
          <rect x="8" y="18" width="44" height="1.5" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="24" width="30" height="1" rx="0.5" fill={c} opacity="0.5" />
          <rect x="8" y="27" width="44" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="29.5" width="40" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="32" width="35" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="38" width="25" height="1" rx="0.5" fill={c} opacity="0.5" />
          <rect x="8" y="41" width="44" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="43.5" width="38" height="1" rx="0.5" fill="#e0e0e0" />
        </>
      )}
      {thumb.layout === "header" && (
        <>
          <rect x="0" y="0" width="60" height="18" fill={c} rx="2" />
          <rect x="8" y="5" width="30" height="3" rx="1" fill="white" />
          <rect x="8" y="10" width="20" height="1.5" rx="0.5" fill="white" opacity="0.6" />
          <rect x="8" y="24" width="44" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="27" width="40" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="30" width="35" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="36" width="44" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="39" width="38" height="1" rx="0.5" fill="#e0e0e0" />
        </>
      )}
      {thumb.layout === "clean" && (
        <>
          <rect x="8" y="8" width="28" height="2.5" rx="1" fill="#333" />
          <rect x="8" y="12" width="18" height="1.5" rx="0.5" fill="#aaa" />
          <rect x="8" y="20" width="44" height="0.5" fill="#e0e0e0" />
          <rect x="8" y="24" width="44" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="27" width="40" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="33" width="44" height="0.5" fill="#e0e0e0" />
          <rect x="8" y="37" width="44" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="40" width="35" height="1" rx="0.5" fill="#e0e0e0" />
        </>
      )}
      {thumb.layout === "border" && (
        <>
          <rect x="8" y="8" width="24" height="2.5" rx="1" fill="#333" />
          <rect x="8" y="12" width="18" height="1.5" rx="0.5" fill={c} />
          <rect x="8" y="16" width="44" height="1.5" fill={c} opacity="0.3" />
          <rect x="8" y="22" width="44" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="25" width="40" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="31" width="30" height="1.5" rx="0.5" fill="#333" />
          <rect x="8" y="34" width="44" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="37" width="38" height="1" rx="0.5" fill="#e0e0e0" />
        </>
      )}
      {thumb.layout === "sidebar" && (
        <>
          <rect x="0" y="0" width="20" height="80" fill={c} rx="2" />
          <circle cx="10" cy="12" r="5" fill="white" opacity="0.3" />
          <rect x="4" y="22" width="12" height="1" rx="0.5" fill="white" opacity="0.5" />
          <rect x="4" y="25" width="10" height="1" rx="0.5" fill="white" opacity="0.3" />
          <rect x="24" y="8" width="28" height="3" rx="1" fill={c} />
          <rect x="24" y="13" width="18" height="1.5" rx="0.5" fill="#ccc" />
          <rect x="24" y="20" width="30" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="24" y="23" width="28" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="24" y="29" width="30" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="24" y="32" width="25" height="1" rx="0.5" fill="#e0e0e0" />
        </>
      )}
      {thumb.layout === "dense" && (
        <>
          <rect x="8" y="5" width="20" height="2.5" rx="1" fill={c} />
          <rect x="8" y="9" width="15" height="1" rx="0.5" fill="#aaa" />
          <rect x="8" y="12" width="44" height="1" fill={c} opacity="0.2" />
          <rect x="8" y="16" width="44" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="18.5" width="40" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="21" width="35" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="25" width="44" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="27.5" width="38" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="30" width="42" height="1" rx="0.5" fill="#e0e0e0" />
          <rect x="8" y="32.5" width="30" height="1" rx="0.5" fill="#e0e0e0" />
        </>
      )}
    </svg>
  );
}

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
        <div className="grid grid-cols-3 gap-2 mb-2">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => setTemplate(tmpl.id)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                cv.meta.template === tmpl.id
                  ? "border-accent bg-accent/5 shadow-sm"
                  : "border-border-light hover:border-border"
              }`}
            >
              <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border border-border-light bg-white">
                <TemplateThumbnail id={tmpl.id} active={cv.meta.template === tmpl.id} />
              </div>
              <p className="text-[11px] font-medium text-ink leading-tight">{tmpl.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
          Couleur d'accent
        </p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => updateCustomization({ colors: { accent: color } })}
              className={`w-7 h-7 rounded-lg border-2 transition-transform ${
                cv.customization.colors.accent === color
                  ? "border-ink scale-110"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
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
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
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
