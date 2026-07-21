export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: "classic",
    name: "Classique",
    description: "Une colonne, sobre et ATS-optimal. Le choix le plus sûr.",
  },
  {
    id: "modern",
    name: "Moderne",
    description: "Accents de couleur et sections bien délimitées.",
  },
  {
    id: "minimal",
    name: "Minimaliste",
    description: "Épuré, focus contenu. Maximum de lisibilité.",
  },
];
