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
  EducationBlock,
  ExperienceBlock,
  getVisibleSections,
  ProfilePhoto,
  ProjectsBlock,
  VolunteerBlock,
} from "./shared";

function SectionTitle({ title, accent }: { title: string; accent: string }) {
  return (
    <h2
      style={{
        fontSize: "10pt",
        fontWeight: 700,
        color: accent,
        marginBottom: "8px",
      }}
    >
      {title}
    </h2>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <h3
        style={{
          fontSize: "8pt",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.7)",
          marginBottom: "6px",
        }}
      >
        {title}
      </h3>
      {children}
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

export function CreativeTemplate({ cv }: { cv: CVData }) {
  const p = cv.profile;
  const accent = cv.customization.colors.accent;
  const font = cv.customization.font;
  const sections = getVisibleSections(cv);

  const sidebarTypes = new Set(["skills", "languages", "certifications"]);
  const mainSections = sections.filter((s) => !sidebarTypes.has(s.type));
  const sidebarSections = sections.filter((s) => sidebarTypes.has(s.type));

  return (
    <div
      style={{
        width: "595px",
        minHeight: "842px",
        backgroundColor: "white",
        display: "flex",
        fontSize: `${cv.customization.fontSize}pt`,
        lineHeight: cv.customization.lineSpacing,
        fontFamily: `'${font}', system-ui, sans-serif`,
      }}
    >
      <div
        style={{
          width: "195px",
          backgroundColor: accent,
          color: "white",
          padding: "32px 20px",
          flexShrink: 0,
        }}
      >
        {p.photo && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <ProfilePhoto src={p.photo} size={100} />
          </div>
        )}

        <SidebarSection title="Contact">
          <div style={{ fontSize: "8.5pt", display: "flex", flexDirection: "column", gap: "4px" }}>
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.location && <span>{p.location}</span>}
            {p.linkedin && <span>{p.linkedin}</span>}
            {p.website && <span>{p.website}</span>}
          </div>
        </SidebarSection>

        {sidebarSections.map((section) => (
          <SidebarSection key={section.id} title={SECTION_TITLES[section.type] ?? section.type}>
            {section.type === "skills" &&
              (section.items as SkillCategory[]).map((cat) => (
                <div key={cat.id} style={{ marginBottom: "6px", fontSize: "8.5pt" }}>
                  {cat.category && (
                    <p style={{ fontWeight: 600, marginBottom: "2px" }}>{cat.category}</p>
                  )}
                  <p style={{ opacity: 0.85 }}>{cat.items.join(", ")}</p>
                </div>
              ))}
            {section.type === "languages" &&
              (section.items as LanguageItem[]).map((item) => (
                <div key={item.id} style={{ fontSize: "8.5pt", marginBottom: "3px" }}>
                  <span style={{ fontWeight: 600 }}>{item.language}</span>
                  {item.level && <span style={{ opacity: 0.7 }}> — {item.level}</span>}
                </div>
              ))}
            {section.type === "certifications" &&
              (section.items as CertificationItem[]).map((item) => (
                <div key={item.id} style={{ fontSize: "8.5pt", marginBottom: "4px" }}>
                  <p style={{ fontWeight: 600 }}>{item.name}</p>
                  {item.issuer && <p style={{ opacity: 0.7, fontSize: "8pt" }}>{item.issuer}</p>}
                </div>
              ))}
          </SidebarSection>
        ))}
      </div>

      <div style={{ flex: 1, padding: "32px 28px", color: "#1a1d23" }}>
        <div style={{ marginBottom: "20px" }}>
          {(p.firstName || p.lastName) && (
            <h1 style={{ fontSize: "20pt", fontWeight: 700, color: accent }}>
              {p.firstName} {p.lastName}
            </h1>
          )}
          {p.jobTitle && (
            <p style={{ fontSize: "11pt", color: "#555", marginTop: "2px" }}>{p.jobTitle}</p>
          )}
        </div>

        {p.summary && (
          <div style={{ marginBottom: "18px" }}>
            <SectionTitle title="Profil" accent={accent} />
            <p style={{ whiteSpace: "pre-line", color: "#444" }}>{p.summary}</p>
          </div>
        )}

        {mainSections.map((section) => (
          <div key={section.id} style={{ marginBottom: "18px" }}>
            <SectionTitle title={SECTION_TITLES[section.type] ?? section.type} accent={accent} />
            {section.type === "experience" && (
              <ExperienceBlock items={section.items as ExperienceItem[]} />
            )}
            {section.type === "education" && (
              <EducationBlock items={section.items as EducationItem[]} />
            )}
            {section.type === "projects" && (
              <ProjectsBlock items={section.items as ProjectItem[]} />
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
