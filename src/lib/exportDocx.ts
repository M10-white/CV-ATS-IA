import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";
import type {
  CertificationItem,
  CVData,
  EducationItem,
  ExperienceItem,
  LanguageItem,
  ProjectItem,
  SkillCategory,
  VolunteerItem,
} from "../types/cv";

const SECTION_TITLES: Record<string, string> = {
  experience: "Expérience professionnelle",
  education: "Formation",
  skills: "Compétences",
  languages: "Langues",
  projects: "Projets",
  certifications: "Certifications",
  volunteering: "Bénévolat",
};

function sectionHeading(title: string, accent: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    border: { bottom: { color: accent.replace("#", ""), size: 6, space: 4, style: "single" } },
    children: [new TextRun({ text: title, bold: true, size: 22, color: accent.replace("#", "") })],
  });
}

function dateLine(left: string, right: string): Paragraph {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    spacing: { after: 40 },
    children: [
      new TextRun({ text: left, bold: true, size: 20 }),
      new TextRun({ text: "\t" }),
      new TextRun({ text: right, size: 18, color: "888888" }),
    ],
  });
}

function bodyText(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 19 })],
  });
}

function buildExperience(items: ExperienceItem[]): Paragraph[] {
  return items.flatMap((item) => {
    const dateStr = [item.startDate, item.current ? "Présent" : item.endDate]
      .filter(Boolean)
      .join(" – ");
    const lines: Paragraph[] = [];
    const title = [item.position, item.company].filter(Boolean).join(" — ");
    lines.push(dateLine(title, dateStr));
    if (item.description) lines.push(bodyText(item.description));
    return lines;
  });
}

function buildEducation(items: EducationItem[]): Paragraph[] {
  return items.flatMap((item) => {
    const dateStr = [item.startDate, item.endDate].filter(Boolean).join(" – ");
    const title = [item.degree, item.field, item.institution].filter(Boolean).join(" — ");
    const lines: Paragraph[] = [dateLine(title, dateStr)];
    if (item.description) lines.push(bodyText(item.description));
    return lines;
  });
}

function buildSkills(items: SkillCategory[]): Paragraph[] {
  return items.map(
    (cat) =>
      new Paragraph({
        spacing: { after: 60 },
        children: [
          ...(cat.category
            ? [new TextRun({ text: `${cat.category} : `, bold: true, size: 19 })]
            : []),
          new TextRun({ text: cat.items.join(", "), size: 19 }),
        ],
      }),
  );
}

function buildLanguages(items: LanguageItem[]): Paragraph[] {
  return [
    new Paragraph({
      spacing: { after: 80 },
      children: items.flatMap((item, i) => [
        ...(i > 0 ? [new TextRun({ text: "  ·  ", size: 19, color: "CCCCCC" })] : []),
        new TextRun({ text: item.language, bold: true, size: 19 }),
        ...(item.level
          ? [new TextRun({ text: ` — ${item.level}`, size: 19, color: "888888" })]
          : []),
      ]),
    }),
  ];
}

function buildProjects(items: ProjectItem[]): Paragraph[] {
  return items.flatMap((item) => {
    const dateStr = [item.startDate, item.endDate].filter(Boolean).join(" – ");
    const title = [item.name, item.role].filter(Boolean).join(" — ");
    const lines: Paragraph[] = [dateLine(title, dateStr)];
    if (item.url) lines.push(bodyText(item.url));
    if (item.description) lines.push(bodyText(item.description));
    return lines;
  });
}

function buildCertifications(items: CertificationItem[]): Paragraph[] {
  return items.flatMap((item) => {
    const title = [item.name, item.issuer].filter(Boolean).join(" — ");
    const lines: Paragraph[] = [dateLine(title, item.date)];
    if (item.url) lines.push(bodyText(item.url));
    return lines;
  });
}

function buildVolunteering(items: VolunteerItem[]): Paragraph[] {
  return items.flatMap((item) => {
    const dateStr = [item.startDate, item.current ? "Présent" : item.endDate]
      .filter(Boolean)
      .join(" – ");
    const title = [item.role, item.organization].filter(Boolean).join(" — ");
    const lines: Paragraph[] = [dateLine(title, dateStr)];
    if (item.description) lines.push(bodyText(item.description));
    return lines;
  });
}

export async function exportToDocx(cv: CVData, filename: string) {
  const p = cv.profile;
  const accent = cv.customization.colors.accent;
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      alignment: "center",
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: `${p.firstName} ${p.lastName}`.trim() || "CV",
          bold: true,
          size: 36,
          color: accent.replace("#", ""),
        }),
      ],
    }),
  );

  if (p.jobTitle) {
    children.push(
      new Paragraph({
        alignment: "center",
        spacing: { after: 60 },
        children: [new TextRun({ text: p.jobTitle, size: 22, color: "555555" })],
      }),
    );
  }

  const contactItems = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);
  if (contactItems.length > 0) {
    children.push(
      new Paragraph({
        alignment: "center",
        spacing: { after: 200 },
        children: [new TextRun({ text: contactItems.join("  ·  "), size: 18, color: "666666" })],
      }),
    );
  }

  if (p.summary) {
    children.push(sectionHeading("Profil", accent));
    children.push(bodyText(p.summary));
  }

  const visibleSections = cv.sections.filter((s) => s.visible && s.items.length > 0);

  for (const section of visibleSections) {
    children.push(sectionHeading(SECTION_TITLES[section.type] ?? section.type, accent));

    switch (section.type) {
      case "experience":
        children.push(...buildExperience(section.items as ExperienceItem[]));
        break;
      case "education":
        children.push(...buildEducation(section.items as EducationItem[]));
        break;
      case "skills":
        children.push(...buildSkills(section.items as SkillCategory[]));
        break;
      case "languages":
        children.push(...buildLanguages(section.items as LanguageItem[]));
        break;
      case "projects":
        children.push(...buildProjects(section.items as ProjectItem[]));
        break;
      case "certifications":
        children.push(...buildCertifications(section.items as CertificationItem[]));
        break;
      case "volunteering":
        children.push(...buildVolunteering(section.items as VolunteerItem[]));
        break;
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}
