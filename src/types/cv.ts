export interface CVMeta {
  id: string;
  version: string;
  template: string;
  profile: string;
  created: string;
  modified: string;
  language: string;
}

export interface CVProfile {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  linkedin: string;
  website: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface LanguageItem {
  id: string;
  language: string;
  level: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export type SectionType =
  | "profile"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "custom";

export type SectionItem =
  | ExperienceItem
  | EducationItem
  | SkillCategory
  | LanguageItem
  | CustomSection;

export interface CVSection {
  id: string;
  type: SectionType;
  visible: boolean;
  items: SectionItem[];
}

export interface CVCustomization {
  colors: {
    accent: string;
  };
  font: string;
  fontSize: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  lineSpacing: number;
}

export interface CVData {
  meta: CVMeta;
  profile: CVProfile;
  sections: CVSection[];
  customization: CVCustomization;
}

export function createEmptyCV(id: string, profileId: string): CVData {
  const now = new Date().toISOString();
  return {
    meta: {
      id,
      version: "1.0",
      template: "classic",
      profile: profileId,
      created: now,
      modified: now,
      language: "fr",
    },
    profile: {
      firstName: "",
      lastName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      linkedin: "",
      website: "",
    },
    sections: [
      { id: "experience", type: "experience", visible: true, items: [] },
      { id: "education", type: "education", visible: true, items: [] },
      { id: "skills", type: "skills", visible: true, items: [] },
      { id: "languages", type: "languages", visible: true, items: [] },
    ],
    customization: {
      colors: { accent: "#2d7d9a" },
      font: "Inter",
      fontSize: 10,
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      lineSpacing: 1.15,
    },
  };
}
