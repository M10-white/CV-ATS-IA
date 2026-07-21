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
  ContactLine,
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
    <h2
      style={{
        fontSize: "10pt",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: accent,
        borderBottom: `1.5px solid ${accent}`,
        paddingBottom: "3px",
        marginBottom: "8px",
      }}
    >
      {title}
    </h2>
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

export function ClassicTemplate({ cv }: { cv: CVData }) {
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
        padding: "40px",
        fontSize: `${cv.customization.fontSize}pt`,
        lineHeight: cv.customization.lineSpacing,
        fontFamily: `'${font}', system-ui, sans-serif`,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {p.photo && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
            <ProfilePhoto src={p.photo} size={80} />
          </div>
        )}
        {(p.firstName || p.lastName) && (
          <h1
            style={{ fontSize: "18pt", fontWeight: 700, letterSpacing: "-0.02em", color: accent }}
          >
            {p.firstName} {p.lastName}
          </h1>
        )}
        {p.jobTitle && (
          <p style={{ fontSize: "11pt", color: "#555", marginTop: "4px" }}>{p.jobTitle}</p>
        )}
        <div style={{ marginTop: "8px" }}>
          <ContactLine cv={cv} />
        </div>
      </div>

      {p.summary && (
        <div style={{ marginBottom: "16px" }}>
          <SectionTitle title="Profil" accent={accent} />
          <p style={{ whiteSpace: "pre-line" }}>{p.summary}</p>
        </div>
      )}

      {sections.map((section) => (
        <div key={section.id} style={{ marginBottom: "16px" }}>
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
