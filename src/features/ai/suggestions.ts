import type { CVData } from "../../types/cv";
import type { AIProvider } from "./provider";

export interface Suggestion {
  id: string;
  type: "summary" | "experience" | "skills" | "general";
  original: string;
  suggested: string;
  reason: string;
}

const ACTION_VERBS = [
  "Développé",
  "Conçu",
  "Mis en place",
  "Optimisé",
  "Dirigé",
  "Implémenté",
  "Automatisé",
  "Coordonné",
  "Réduit",
  "Augmenté",
  "Amélioré",
  "Géré",
  "Lancé",
  "Formé",
  "Analysé",
  "Restructuré",
];

export function getManualSuggestions(cv: CVData): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const p = cv.profile;

  if (p.summary && p.summary.length < 50) {
    suggestions.push({
      id: crypto.randomUUID(),
      type: "summary",
      original: p.summary,
      suggested: "",
      reason:
        "Votre résumé est trop court. Un bon résumé fait 3-4 phrases et met en avant vos compétences clés, années d'expérience et domaine d'expertise.",
    });
  }

  if (p.summary && /\b(je|j'ai|mon|ma|mes)\b/i.test(p.summary)) {
    suggestions.push({
      id: crypto.randomUUID(),
      type: "summary",
      original: p.summary,
      suggested: "",
      reason:
        "Évitez les pronoms personnels (je, mon, ma) dans le résumé. Utilisez un style impersonnel : « Développeur expérimenté avec 5 ans… » plutôt que « Je suis développeur… ».",
    });
  }

  const expSection = cv.sections.find((s) => s.type === "experience");
  if (expSection) {
    for (const item of expSection.items) {
      const exp = item as { id: string; description: string; position: string };
      if (!exp.description) continue;

      const lines = exp.description.split("\n").filter((l) => l.trim());
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !ACTION_VERBS.some((v) => trimmed.startsWith(v))) {
          const verb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
          suggestions.push({
            id: crypto.randomUUID(),
            type: "experience",
            original: trimmed,
            suggested: `${verb} ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`,
            reason: `Commencez par un verbe d'action fort. Exemples : ${ACTION_VERBS.slice(0, 5).join(", ")}…`,
          });
          break;
        }
      }

      if (!/\d/.test(exp.description)) {
        suggestions.push({
          id: crypto.randomUUID(),
          type: "experience",
          original: exp.description.split("\n")[0] ?? "",
          suggested: "",
          reason:
            "Ajoutez des chiffres pour quantifier vos réalisations : « Réduit le temps de chargement de 40% » plutôt que « Amélioré les performances ».",
        });
      }
    }
  }

  const skillsSection = cv.sections.find((s) => s.type === "skills");
  if (skillsSection && skillsSection.items.length === 0) {
    suggestions.push({
      id: crypto.randomUUID(),
      type: "skills",
      original: "",
      suggested: "",
      reason:
        "La section compétences est vide. Ajoutez vos compétences techniques et transversales, catégorisées (ex : Langages, Frameworks, Outils).",
    });
  }

  if (!p.linkedin) {
    suggestions.push({
      id: crypto.randomUUID(),
      type: "general",
      original: "",
      suggested: "",
      reason: "Ajoutez votre profil LinkedIn. Les recruteurs vérifient souvent le profil en ligne.",
    });
  }

  return suggestions;
}

export async function getAISuggestions(cv: CVData, provider: AIProvider): Promise<Suggestion[]> {
  const cvSummary = buildCVContext(cv);

  const response = await provider.generate([
    {
      role: "system",
      content: `Tu es un expert en rédaction de CV optimisés pour les ATS (Applicant Tracking Systems).
Tu analyses un CV et proposes des améliorations concrètes en français.
Réponds UNIQUEMENT en JSON, un tableau d'objets avec les champs : type, original, suggested, reason.
Types possibles : "summary", "experience", "skills", "general".
Maximum 5 suggestions, les plus impactantes en premier.`,
    },
    {
      role: "user",
      content: `Analyse ce CV et propose des améliorations :\n\n${cvSummary}`,
    },
  ]);

  try {
    const cleaned = response
      .replace(/```json?\n?/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .slice(0, 5)
      .map((s: { type?: string; original?: string; suggested?: string; reason?: string }) => ({
        id: crypto.randomUUID(),
        type: (s.type as Suggestion["type"]) ?? "general",
        original: s.original ?? "",
        suggested: s.suggested ?? "",
        reason: s.reason ?? "",
      }));
  } catch {
    return [];
  }
}

function buildCVContext(cv: CVData): string {
  const lines: string[] = [];
  const p = cv.profile;

  lines.push(`Nom: ${p.firstName} ${p.lastName}`);
  if (p.jobTitle) lines.push(`Titre: ${p.jobTitle}`);
  if (p.summary) lines.push(`Résumé: ${p.summary}`);

  for (const section of cv.sections) {
    if (!section.visible || section.items.length === 0) continue;

    if (section.type === "experience") {
      lines.push("\n--- Expérience ---");
      for (const item of section.items) {
        const exp = item as { position: string; company: string; description: string };
        lines.push(`${exp.position} chez ${exp.company}`);
        if (exp.description) lines.push(exp.description);
      }
    }
    if (section.type === "education") {
      lines.push("\n--- Formation ---");
      for (const item of section.items) {
        const edu = item as { degree: string; field: string; institution: string };
        lines.push(`${edu.degree} ${edu.field}, ${edu.institution}`);
      }
    }
    if (section.type === "skills") {
      lines.push("\n--- Compétences ---");
      for (const item of section.items) {
        const skill = item as { category: string; items: string[] };
        lines.push(`${skill.category}: ${skill.items.join(", ")}`);
      }
    }
  }

  return lines.join("\n");
}
