import { useCVStore } from "../../stores/cvStore";
import type { EducationItem, ExperienceItem, LanguageItem, SkillCategory } from "../../types/cv";

export function CVPreview() {
  const cv = useCVStore((s) => s.getCurrentCV());
  if (!cv) return null;

  const p = cv.profile;
  const hasName = p.firstName || p.lastName;
  const accentColor = cv.customization.colors.accent;

  return (
    <div
      className="w-[595px] min-h-[842px] bg-white text-[#1a1d23] shadow-sm mx-auto p-10 text-[10pt] leading-[1.5]"
      style={{ fontFamily: `${cv.customization.font}, system-ui, sans-serif` }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        {hasName && (
          <h1 className="text-xl font-bold tracking-tight" style={{ color: accentColor }}>
            {p.firstName} {p.lastName}
          </h1>
        )}
        {p.jobTitle && <p className="text-sm text-[#4a4f5c] mt-1">{p.jobTitle}</p>}
        <div className="flex items-center justify-center gap-3 mt-2 text-xs text-[#7c8294] flex-wrap">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </div>

      {p.summary && (
        <div className="mb-5">
          <SectionTitle title="Profil" color={accentColor} />
          <p className="text-[10pt] whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      {cv.sections
        .filter((s) => s.visible)
        .map((section) => {
          if (section.type === "experience" && section.items.length > 0) {
            return (
              <div key={section.id} className="mb-5">
                <SectionTitle title="Expérience professionnelle" color={accentColor} />
                {(section.items as ExperienceItem[]).map((item) => (
                  <div key={item.id} className="mb-3">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-semibold">{item.position || "Poste"}</span>
                        {item.company && <span className="text-[#4a4f5c]"> — {item.company}</span>}
                      </div>
                      <span className="text-xs text-[#7c8294]">
                        {item.startDate}
                        {(item.endDate || item.current) &&
                          ` – ${item.current ? "Présent" : item.endDate}`}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-[9.5pt] whitespace-pre-line">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            );
          }

          if (section.type === "education" && section.items.length > 0) {
            return (
              <div key={section.id} className="mb-5">
                <SectionTitle title="Formation" color={accentColor} />
                {(section.items as EducationItem[]).map((item) => (
                  <div key={item.id} className="mb-3">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-semibold">{item.degree || "Diplôme"}</span>
                        {item.field && <span> en {item.field}</span>}
                        {item.institution && (
                          <span className="text-[#4a4f5c]"> — {item.institution}</span>
                        )}
                      </div>
                      <span className="text-xs text-[#7c8294]">
                        {item.startDate}
                        {item.endDate && ` – ${item.endDate}`}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-[9.5pt] whitespace-pre-line">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            );
          }

          if (section.type === "skills" && section.items.length > 0) {
            return (
              <div key={section.id} className="mb-5">
                <SectionTitle title="Compétences" color={accentColor} />
                {(section.items as SkillCategory[]).map((cat) => (
                  <div key={cat.id} className="mb-1.5">
                    {cat.category && (
                      <span className="font-semibold text-[9.5pt]">{cat.category} : </span>
                    )}
                    <span className="text-[9.5pt]">{cat.items.join(", ")}</span>
                  </div>
                ))}
              </div>
            );
          }

          if (section.type === "languages" && section.items.length > 0) {
            return (
              <div key={section.id} className="mb-5">
                <SectionTitle title="Langues" color={accentColor} />
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {(section.items as LanguageItem[]).map((item) => (
                    <span key={item.id} className="text-[9.5pt]">
                      <span className="font-semibold">{item.language}</span>
                      {item.level && <span className="text-[#7c8294]"> — {item.level}</span>}
                    </span>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
    </div>
  );
}

function SectionTitle({ title, color }: { title: string; color: string }) {
  return (
    <div className="mb-2">
      <h2
        className="text-xs font-bold uppercase tracking-wider pb-1"
        style={{ color, borderBottom: `1.5px solid ${color}` }}
      >
        {title}
      </h2>
    </div>
  );
}
