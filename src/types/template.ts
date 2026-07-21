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
  {
    id: "executive",
    name: "Executive",
    description: "Élégant et professionnel. Nom en majuscules, résumé en citation.",
  },
  {
    id: "creative",
    name: "Créatif",
    description: "Sidebar colorée avec photo, compétences et langues à gauche.",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Dense et optimisé pour tenir sur une page. Tout l'essentiel.",
  },
];
