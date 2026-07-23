import type { ATSAlert, ATSDiagnostic } from "../../types/ats";
import type { CVData, EducationItem, ExperienceItem, SkillCategory } from "../../types/cv";

const RECOMMENDED_ORDER: string[] = ["experience", "education", "skills", "languages"];

const DATE_PATTERN =
  /^(\d{2}\/\d{4}|\d{4}|(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4})$/i;

const ACTION_VERBS_FR = [
  "développé",
  "géré",
  "dirigé",
  "créé",
  "mis en place",
  "optimisé",
  "conçu",
  "implémenté",
  "coordonné",
  "analysé",
  "réalisé",
  "piloté",
  "amélioré",
  "supervisé",
  "formé",
  "négocié",
  "livré",
  "déployé",
  "automatisé",
  "réduit",
];

const PRONOUN_PATTERN = /\b(je|j'|mon|ma|mes|nous|notre|nos)\b/i;
const NUMBER_PATTERN = /\d+\s*(%|€|\$|k|M|million|personnes|projets|clients|utilisateurs)/i;

export function analyzeCV(cv: CVData): ATSDiagnostic {
  const alerts: ATSAlert[] = [];

  analyzeReadability(cv, alerts);
  analyzeStructure(cv, alerts);
  analyzeExtraction(cv, alerts);
  analyzeContent(cv, alerts);

  const scores = computeScores(alerts);
  const parserView = buildParserView(cv);

  return { scores, alerts, parserView };
}

function analyzeReadability(cv: CVData, alerts: ATSAlert[]) {
  if (cv.customization.fontSize < 9) {
    alerts.push({
      severity: "warning",
      category: "readability",
      message: "Taille de police trop petite (< 9pt)",
      recommendation:
        "Augmentez la taille à au moins 9pt pour garantir la lisibilité par les parseurs.",
    });
  }
  if (cv.customization.fontSize > 13) {
    alerts.push({
      severity: "suggestion",
      category: "readability",
      message: "Taille de police élevée (> 13pt)",
      recommendation: "Une taille entre 10-12pt est optimale pour les ATS.",
    });
  }
  if (cv.customization.lineSpacing < 1.0) {
    alerts.push({
      severity: "warning",
      category: "readability",
      message: "Interligne trop serré",
      recommendation: "Un interligne de 1.15-1.5 améliore la lisibilité.",
    });
  }
}

function analyzeStructure(cv: CVData, alerts: ATSAlert[]) {
  const visibleSections = cv.sections.filter((s) => s.visible);
  const sectionTypes = visibleSections.map((s) => s.type);

  if (!sectionTypes.includes("experience")) {
    alerts.push({
      severity: "critical",
      category: "structure",
      message: "Section Expérience absente ou masquée",
      recommendation:
        "Les ATS cherchent systématiquement une section Expérience. Rendez-la visible.",
      section: "experience",
    });
  }

  if (!sectionTypes.includes("education")) {
    alerts.push({
      severity: "warning",
      category: "structure",
      message: "Section Formation absente ou masquée",
      recommendation: "Ajoutez une section Formation, même si votre expérience est longue.",
      section: "education",
    });
  }

  if (!sectionTypes.includes("skills")) {
    alerts.push({
      severity: "warning",
      category: "structure",
      message: "Section Compétences absente",
      recommendation:
        "Les compétences techniques sont souvent utilisées pour le scoring par mots-clés.",
      section: "skills",
    });
  }

  if (!cv.profile.summary) {
    alerts.push({
      severity: "suggestion",
      category: "structure",
      message: "Pas de résumé / profil",
      recommendation: "Un résumé professionnel aide les ATS à catégoriser votre candidature.",
      section: "profile",
      field: "summary",
    });
  }

  const visibleTypes: string[] = visibleSections.map((s) => s.type);
  const actualOrder = RECOMMENDED_ORDER.filter((t) => visibleTypes.includes(t));
  const currentOrder = visibleTypes.filter((t) => RECOMMENDED_ORDER.includes(t));
  if (actualOrder.join(",") !== currentOrder.join(",")) {
    alerts.push({
      severity: "suggestion",
      category: "structure",
      message: "Ordre des sections non standard",
      recommendation: "L'ordre recommandé : Expérience → Formation → Compétences → Langues.",
    });
  }
}

function analyzeExtraction(cv: CVData, alerts: ATSAlert[]) {
  const p = cv.profile;

  if (!p.email) {
    alerts.push({
      severity: "critical",
      category: "extraction",
      message: "Pas d'email de contact",
      recommendation: "L'email est le champ le plus important pour les ATS.",
      section: "profile",
      field: "email",
    });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
    alerts.push({
      severity: "warning",
      category: "extraction",
      message: "Format d'email potentiellement invalide",
      recommendation: "Vérifiez le format de votre adresse email.",
      section: "profile",
      field: "email",
    });
  }

  if (!p.phone) {
    alerts.push({
      severity: "warning",
      category: "extraction",
      message: "Pas de numéro de téléphone",
      recommendation: "Ajoutez un numéro de téléphone dans un format standard.",
      section: "profile",
      field: "phone",
    });
  }

  if (!p.firstName || !p.lastName) {
    alerts.push({
      severity: "critical",
      category: "extraction",
      message: "Nom incomplet",
      recommendation: "Le prénom et le nom sont essentiels pour l'identification.",
      section: "profile",
      field: !p.firstName ? "firstName" : "lastName",
    });
  }

  const expSection = cv.sections.find((s) => s.type === "experience" && s.visible);
  if (expSection) {
    for (const item of expSection.items as ExperienceItem[]) {
      if (item.startDate && !DATE_PATTERN.test(item.startDate.trim())) {
        alerts.push({
          severity: "warning",
          category: "extraction",
          message: `Date non standard : "${item.startDate}"`,
          recommendation: "Utilisez le format MM/YYYY ou 'Mois YYYY'.",
          section: "experience",
          field: "startDate",
        });
      }
      if (item.endDate && !item.current && !DATE_PATTERN.test(item.endDate.trim())) {
        alerts.push({
          severity: "warning",
          category: "extraction",
          message: `Date de fin non standard : "${item.endDate}"`,
          recommendation: "Utilisez le format MM/YYYY ou 'Mois YYYY'.",
          section: "experience",
          field: "endDate",
        });
      }
      if (!item.position) {
        alerts.push({
          severity: "warning",
          category: "extraction",
          message: "Expérience sans intitulé de poste",
          recommendation: "Chaque expérience doit avoir un intitulé clair.",
          section: "experience",
          field: "position",
        });
      }
    }
  }

  const skillsSection = cv.sections.find((s) => s.type === "skills" && s.visible);
  if (skillsSection) {
    for (const cat of skillsSection.items as SkillCategory[]) {
      if (cat.items.length === 0) {
        alerts.push({
          severity: "suggestion",
          category: "extraction",
          message: `Catégorie de compétences vide : "${cat.category || "Sans nom"}"`,
          recommendation: "Ajoutez des compétences ou supprimez la catégorie.",
          section: "skills",
        });
      }
    }
  }
}

function analyzeContent(cv: CVData, alerts: ATSAlert[]) {
  const expSection = cv.sections.find((s) => s.type === "experience" && s.visible);
  if (!expSection) return;

  let totalDescriptions = 0;
  let descriptionsWithNumbers = 0;
  let descriptionsWithActionVerbs = 0;
  let descriptionsWithPronouns = 0;

  for (const item of expSection.items as ExperienceItem[]) {
    if (!item.description) {
      alerts.push({
        severity: "suggestion",
        category: "content",
        message: `L'expérience "${item.position || item.company || "?"}" n'a pas de description`,
        recommendation: "Ajoutez des bullet points décrivant vos réalisations.",
        section: "experience",
      });
      continue;
    }

    totalDescriptions++;
    if (NUMBER_PATTERN.test(item.description)) descriptionsWithNumbers++;
    if (ACTION_VERBS_FR.some((v) => item.description.toLowerCase().includes(v)))
      descriptionsWithActionVerbs++;
    if (PRONOUN_PATTERN.test(item.description)) descriptionsWithPronouns++;

    if (item.description.length < 30) {
      alerts.push({
        severity: "suggestion",
        category: "content",
        message: `Description trop courte pour "${item.position || "?"}"`,
        recommendation:
          "Détaillez vos responsabilités et réalisations (50-200 caractères par point).",
        section: "experience",
      });
    }
  }

  if (totalDescriptions > 0) {
    if (descriptionsWithNumbers === 0) {
      alerts.push({
        severity: "suggestion",
        category: "content",
        message: "Aucune description ne contient de résultat chiffré",
        recommendation:
          "Ajoutez des métriques : « Augmenté les ventes de 25% » plutôt que « Responsable des ventes ».",
      });
    }

    if (descriptionsWithActionVerbs === 0) {
      alerts.push({
        severity: "suggestion",
        category: "content",
        message: "Pas de verbes d'action détectés",
        recommendation:
          "Commencez vos descriptions par des verbes d'action : Développé, Géré, Optimisé...",
      });
    }

    if (descriptionsWithPronouns > 0) {
      alerts.push({
        severity: "suggestion",
        category: "content",
        message: "Pronoms personnels détectés dans les descriptions",
        recommendation: "Évitez « Je/Mon/Nous », préférez un style impersonnel.",
      });
    }
  }
}

function computeScores(alerts: ATSAlert[]) {
  const weights = { readability: 25, structure: 30, extraction: 25, content: 20 };
  const penalties: Record<string, number> = { critical: 25, warning: 10, suggestion: 3 };

  const scores = { readability: 100, structure: 100, extraction: 100, content: 100, overall: 0 };

  for (const alert of alerts) {
    const penalty = penalties[alert.severity];
    scores[alert.category] = Math.max(0, scores[alert.category] - penalty);
  }

  scores.overall = Math.round(
    (scores.readability * weights.readability +
      scores.structure * weights.structure +
      scores.extraction * weights.extraction +
      scores.content * weights.content) /
      100,
  );

  return scores;
}

function buildParserView(cv: CVData): string {
  const lines: string[] = [];
  const p = cv.profile;

  if (p.firstName || p.lastName) lines.push(`${p.firstName} ${p.lastName}`.trim());
  if (p.jobTitle) lines.push(p.jobTitle);
  const contact = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);
  if (contact.length > 0) lines.push(contact.join(" | "));
  lines.push("");

  if (p.summary) {
    lines.push("--- PROFIL ---");
    lines.push(p.summary);
    lines.push("");
  }

  for (const section of cv.sections) {
    if (!section.visible || section.items.length === 0) continue;

    const title = section.type.toUpperCase();
    lines.push(`--- ${title} ---`);

    if (section.type === "experience") {
      for (const item of section.items as ExperienceItem[]) {
        const date = item.startDate
          ? `${item.startDate} – ${item.current ? "Présent" : item.endDate || ""}`
          : "";
        lines.push(`${item.position || ""} | ${item.company || ""} | ${date}`);
        if (item.description) lines.push(item.description);
        lines.push("");
      }
    } else if (section.type === "education") {
      for (const item of section.items as EducationItem[]) {
        const date = item.startDate ? `${item.startDate} – ${item.endDate || ""}` : "";
        lines.push(
          `${item.degree || ""} ${item.field || ""} | ${item.institution || ""} | ${date}`,
        );
        if (item.description) lines.push(item.description);
        lines.push("");
      }
    } else if (section.type === "skills") {
      for (const cat of section.items as SkillCategory[]) {
        lines.push(`${cat.category || "Compétences"}: ${cat.items.join(", ")}`);
      }
      lines.push("");
    } else if (section.type === "languages") {
      for (const item of section.items as { language: string; level: string }[]) {
        lines.push(`${item.language}${item.level ? ` (${item.level})` : ""}`);
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}
