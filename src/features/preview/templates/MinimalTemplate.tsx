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

function SectionTitle({ title }: { title: string }) {
  return (
    <h2
      style={{
        fontSize: "9pt",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#999",
        marginBottom: "8px",
        paddingBottom: "4px",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      {title}
    </h2>
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

export function MinimalTemplate({ cv }: { cv: CVData }) {
  const p = cv.profile;
  const font = cv.customization.font;
  const sections = getVisibleSections(cv);

  return (
    <div
      style={{
        width: "595px",
        minHeight: "842px",
        backgroundColor: "white",
        color: "#333",
        padding: "48px 48px",
        fontSize: `${cv.customization.fontSize}pt`,
        lineHeight: cv.customization.lineSpacing,
        fontFamily: `'${font}', system-ui, sans-serif`,
      }}
    >
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
        {p.photo && <ProfilePhoto src={p.photo} size={65} />}
        <div>
          {(p.firstName || p.lastName) && (
            <h1
              style={{
                fontSize: "16pt",
                fontWeight: 400,
                letterSpacing: "0.04em",
                color: "#1a1d23",
              }}
            >
              {p.firstName} <span style={{ fontWeight: 700 }}>{p.lastName}</span>
            </h1>
          )}
          {p.jobTitle && (
            <p style={{ fontSize: "10pt", color: "#777", marginTop: "2px" }}>{p.jobTitle}</p>
          )}
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              fontSize: "8.5pt",
              color: "#999",
            }}
          >
            {[p.email, p.phone, p.location, p.linkedin, p.website]
              .filter(Boolean)
              .map((item, i, arr) => (
                <span key={item}>
                  {item}
                  {i < arr.length - 1 && (
                    <span style={{ margin: "0 2px", color: "#ccc" }}> · </span>
                  )}
                </span>
              ))}
          </div>
        </div>
      </div>

      {p.summary && (
        <div style={{ marginBottom: "20px" }}>
          <SectionTitle title="Profil" />
          <p style={{ whiteSpace: "pre-line", color: "#555" }}>{p.summary}</p>
        </div>
      )}

      {sections.map((section) => (
        <div key={section.id} style={{ marginBottom: "20px" }}>
          <SectionTitle title={SECTION_TITLES[section.type] ?? section.type} />
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
