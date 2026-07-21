import type {
  CVData,
  EducationItem,
  ExperienceItem,
  LanguageItem,
  SkillCategory,
} from "../../../types/cv";

export function getVisibleSections(cv: CVData) {
  return cv.sections.filter((s) => s.visible && s.items.length > 0);
}

export function ContactLine({ cv }: { cv: CVData }) {
  const p = cv.profile;
  const items = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);
  if (items.length === 0) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        flexWrap: "wrap",
        fontSize: "9pt",
        color: "#666",
      }}
    >
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

export function ExperienceBlock({ items }: { items: ExperienceItem[] }) {
  return (
    <>
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <span style={{ fontWeight: 600 }}>{item.position || "Poste"}</span>
              {item.company && <span style={{ color: "#555" }}> — {item.company}</span>}
            </div>
            <span style={{ fontSize: "9pt", color: "#888", whiteSpace: "nowrap" }}>
              {item.startDate}
              {(item.endDate || item.current) && ` – ${item.current ? "Présent" : item.endDate}`}
            </span>
          </div>
          {item.description && (
            <p
              style={{
                marginTop: "4px",
                fontSize: "9.5pt",
                whiteSpace: "pre-line",
                lineHeight: 1.5,
              }}
            >
              {item.description}
            </p>
          )}
        </div>
      ))}
    </>
  );
}

export function EducationBlock({ items }: { items: EducationItem[] }) {
  return (
    <>
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <span style={{ fontWeight: 600 }}>{item.degree || "Diplôme"}</span>
              {item.field && <span> en {item.field}</span>}
              {item.institution && <span style={{ color: "#555" }}> — {item.institution}</span>}
            </div>
            <span style={{ fontSize: "9pt", color: "#888", whiteSpace: "nowrap" }}>
              {item.startDate}
              {item.endDate && ` – ${item.endDate}`}
            </span>
          </div>
          {item.description && (
            <p
              style={{
                marginTop: "4px",
                fontSize: "9.5pt",
                whiteSpace: "pre-line",
                lineHeight: 1.5,
              }}
            >
              {item.description}
            </p>
          )}
        </div>
      ))}
    </>
  );
}

export function SkillsBlock({ items }: { items: SkillCategory[] }) {
  return (
    <>
      {items.map((cat) => (
        <div key={cat.id} style={{ marginBottom: "4px", fontSize: "9.5pt" }}>
          {cat.category && <span style={{ fontWeight: 600 }}>{cat.category} : </span>}
          <span>{cat.items.join(", ")}</span>
        </div>
      ))}
    </>
  );
}

export function LanguagesBlock({ items }: { items: LanguageItem[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      {items.map((item) => (
        <span key={item.id} style={{ fontSize: "9.5pt" }}>
          <span style={{ fontWeight: 600 }}>{item.language}</span>
          {item.level && <span style={{ color: "#888" }}> — {item.level}</span>}
        </span>
      ))}
    </div>
  );
}
