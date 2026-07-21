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
        fontSize: "10pt",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#1a1d23",
        marginBottom: "8px",
        paddingBottom: "4px",
        borderBottom: "2px solid #1a1d23",
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

export function ExecutiveTemplate({ cv }: { cv: CVData }) {
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
      <div
        style={{
          padding: "36px 40px 20px",
          borderBottom: `3px solid ${accent}`,
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {p.photo && <ProfilePhoto src={p.photo} size={85} />}
        <div style={{ flex: 1 }}>
          {(p.firstName || p.lastName) && (
            <h1 style={{ fontSize: "22pt", fontWeight: 300, letterSpacing: "0.04em" }}>
              {p.firstName} <span style={{ fontWeight: 700 }}>{p.lastName?.toUpperCase()}</span>
            </h1>
          )}
          {p.jobTitle && (
            <p style={{ fontSize: "11pt", color: accent, fontWeight: 500, marginTop: "2px" }}>
              {p.jobTitle}
            </p>
          )}
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              fontSize: "8.5pt",
              color: "#666",
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
            <p
              style={{
                whiteSpace: "pre-line",
                fontStyle: "italic",
                color: "#444",
                borderLeft: `3px solid ${accent}`,
                paddingLeft: "14px",
              }}
            >
              {p.summary}
            </p>
          </div>
        )}

        {sections.map((section) => (
          <div key={section.id} style={{ marginBottom: "18px" }}>
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
