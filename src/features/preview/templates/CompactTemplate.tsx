import type {
  CertificationItem,
  CVData,
  EducationItem,
  ExperienceItem,
  LanguageItem,
  ProjectItem,
  SkillCategory,
  VolunteerItem,
} from "../../../types/cv";
import {
  CertificationsBlock,
  EducationBlock,
  ExperienceBlock,
  getVisibleSections,
  LanguagesBlock,
  ProfilePhoto,
  ProjectsBlock,
  SkillsBlock,
  VolunteerBlock,
} from "./shared";

function SectionTitle({ title, accent }: { title: string; accent: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "6px",
      }}
    >
      <h2
        style={{
          fontSize: "9pt",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: accent,
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </h2>
      <div style={{ flex: 1, height: "1px", backgroundColor: accent, opacity: 0.3 }} />
    </div>
  );
}

const SECTION_TITLES: Record<string, string> = {
  experience: "Expérience",
  education: "Formation",
  skills: "Compétences",
  languages: "Langues",
  projects: "Projets",
  certifications: "Certifications",
  volunteering: "Bénévolat",
};

export function CompactTemplate({ cv }: { cv: CVData }) {
  const p = cv.profile;
  const accent = cv.customization.colors.accent;
  const font = cv.customization.font;
  const sections = getVisibleSections(cv);

  return (
    <div
      style={{
        width: "595px",
        minHeight: "842px",
        backgroundColor: "white",
        color: "#1a1d23",
        padding: "28px 32px",
        fontSize: `${Math.max(cv.customization.fontSize - 0.5, 8.5)}pt`,
        lineHeight: cv.customization.lineSpacing,
        fontFamily: `'${font}', system-ui, sans-serif`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "14px",
          paddingBottom: "10px",
          borderBottom: `2px solid ${accent}`,
        }}
      >
        {p.photo && <ProfilePhoto src={p.photo} size={55} />}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              {(p.firstName || p.lastName) && (
                <h1 style={{ fontSize: "16pt", fontWeight: 700, color: accent }}>
                  {p.firstName} {p.lastName}
                </h1>
              )}
              {p.jobTitle && (
                <p style={{ fontSize: "9.5pt", color: "#555", marginTop: "1px" }}>{p.jobTitle}</p>
              )}
            </div>
          </div>
          <div
            style={{
              marginTop: "4px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              fontSize: "8pt",
              color: "#888",
            }}
          >
            {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {p.summary && (
        <div style={{ marginBottom: "10px" }}>
          <p style={{ whiteSpace: "pre-line", color: "#444", fontSize: "9pt" }}>{p.summary}</p>
        </div>
      )}

      {sections.map((section) => (
        <div key={section.id} style={{ marginBottom: "12px" }}>
          <SectionTitle title={SECTION_TITLES[section.type] ?? section.type} accent={accent} />
          {section.type === "experience" && (
            <ExperienceBlock items={section.items as ExperienceItem[]} />
          )}
          {section.type === "education" && (
            <EducationBlock items={section.items as EducationItem[]} />
          )}
          {section.type === "skills" && <SkillsBlock items={section.items as SkillCategory[]} />}
          {section.type === "languages" && (
            <LanguagesBlock items={section.items as LanguageItem[]} />
          )}
          {section.type === "projects" && <ProjectsBlock items={section.items as ProjectItem[]} />}
          {section.type === "certifications" && (
            <CertificationsBlock items={section.items as CertificationItem[]} />
          )}
          {section.type === "volunteering" && (
            <VolunteerBlock items={section.items as VolunteerItem[]} />
          )}
        </div>
      ))}
    </div>
  );
}
