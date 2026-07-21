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
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
      <div style={{ width: "4px", height: "18px", backgroundColor: accent, borderRadius: "2px" }} />
      <h2 style={{ fontSize: "11pt", fontWeight: 700, color: "#1a1d23" }}>{title}</h2>
    </div>
  );
}

const SECTION_TITLES: Record<string, string> = {
  experience: "Expérience professionnelle",
  education: "Formation",
  skills: "Compétences",
  languages: "Langues",
  projects: "Projets",
  certifications: "Certifications",
  volunteering: "Bénévolat",
};

export function ModernTemplate({ cv }: { cv: CVData }) {
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
        fontSize: `${cv.customization.fontSize}pt`,
        lineHeight: cv.customization.lineSpacing,
        fontFamily: `'${font}', system-ui, sans-serif`,
      }}
    >
      {/* Header with accent background */}
      <div
        style={{
          backgroundColor: accent,
          color: "white",
          padding: "30px 40px 24px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {p.photo && <ProfilePhoto src={p.photo} size={75} />}
        <div>
          {(p.firstName || p.lastName) && (
            <h1 style={{ fontSize: "20pt", fontWeight: 700, letterSpacing: "-0.02em" }}>
              {p.firstName} {p.lastName}
            </h1>
          )}
          {p.jobTitle && (
            <p style={{ fontSize: "11pt", opacity: 0.9, marginTop: "4px" }}>{p.jobTitle}</p>
          )}
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              fontSize: "9pt",
              opacity: 0.85,
            }}
          >
            {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 40px 40px" }}>
        {p.summary && (
          <div style={{ marginBottom: "20px" }}>
            <SectionTitle title="Profil" accent={accent} />
            <p style={{ whiteSpace: "pre-line" }}>{p.summary}</p>
          </div>
        )}

        {sections.map((section) => (
          <div key={section.id} style={{ marginBottom: "20px" }}>
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
            {section.type === "projects" && (
              <ProjectsBlock items={section.items as ProjectItem[]} />
            )}
            {section.type === "certifications" && (
              <CertificationsBlock items={section.items as CertificationItem[]} />
            )}
            {section.type === "volunteering" && (
              <VolunteerBlock items={section.items as VolunteerItem[]} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
