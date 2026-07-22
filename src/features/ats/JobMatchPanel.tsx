import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCVStore } from "../../stores/cvStore";

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "le",
    "la",
    "les",
    "de",
    "du",
    "des",
    "un",
    "une",
    "et",
    "ou",
    "en",
    "à",
    "au",
    "aux",
    "par",
    "pour",
    "avec",
    "dans",
    "sur",
    "sous",
    "ce",
    "ces",
    "qui",
    "que",
    "dont",
    "où",
    "son",
    "sa",
    "ses",
    "nous",
    "vous",
    "ils",
    "est",
    "sont",
    "être",
    "avoir",
    "faire",
    "plus",
    "très",
    "bien",
    "tout",
    "tous",
    "toute",
    "pas",
    "ne",
    "se",
    "si",
    "mais",
    "the",
    "a",
    "an",
    "and",
    "or",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "will",
    "shall",
    "can",
    "may",
    "would",
    "this",
    "that",
    "these",
    "those",
    "it",
    "its",
    "you",
    "your",
    "we",
    "our",
    "they",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-zàâäéèêëïîôùûüÿçœæ0-9+#.\-/\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  const freq = new Map<string, number>();
  for (const w of words) {
    freq.set(w, (freq.get(w) || 0) + 1);
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word]) => word);
}

function getCVText(cv: ReturnType<typeof useCVStore.getState>["cvList"][0]): string {
  const parts: string[] = [];
  const p = cv.profile;
  if (p.jobTitle) parts.push(p.jobTitle);
  if (p.summary) parts.push(p.summary);

  for (const section of cv.sections) {
    if (!section.visible) continue;
    for (const item of section.items) {
      if ("description" in item && item.description) parts.push(item.description);
      if ("position" in item && item.position) parts.push(item.position);
      if ("company" in item && item.company) parts.push(item.company);
      if ("degree" in item && item.degree) parts.push(item.degree);
      if ("field" in item && item.field) parts.push(item.field);
      if ("institution" in item && item.institution) parts.push(item.institution);
      if ("category" in item && item.category) parts.push(item.category);
      if ("items" in item && Array.isArray(item.items)) parts.push(item.items.join(" "));
      if ("language" in item && item.language) parts.push(item.language);
    }
  }

  return parts.join(" ");
}

export function JobMatchPanel() {
  const { t } = useTranslation();
  const cv = useCVStore((s) => s.getCurrentCV());
  const [jobText, setJobText] = useState("");
  const [highlighted, setHighlighted] = useState(false);

  const analysis = useMemo(() => {
    if (!cv || !jobText.trim()) return null;

    const jobKeywords = extractKeywords(jobText);
    const cvText = getCVText(cv).toLowerCase();

    const matched: string[] = [];
    const missing: string[] = [];

    for (const kw of jobKeywords) {
      if (cvText.includes(kw)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    }

    const score =
      jobKeywords.length > 0 ? Math.round((matched.length / jobKeywords.length) * 100) : 0;
    return { jobKeywords, matched, missing, score };
  }, [cv, jobText]);

  const toggleHighlight = useCallback(() => {
    if (!analysis) return;
    const previewEl = document.querySelector("[data-preview]");
    if (!previewEl) return;

    if (highlighted) {
      previewEl.querySelectorAll("mark[data-job-match]").forEach((m) => {
        const parent = m.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(m.textContent ?? ""), m);
          parent.normalize();
        }
      });
      setHighlighted(false);
      return;
    }

    const regex = new RegExp(`\\b(${analysis.matched.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi");
    const walker = document.createTreeWalker(previewEl, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      if (node.textContent && regex.test(node.textContent)) {
        textNodes.push(node);
        regex.lastIndex = 0;
      }
    }

    for (const textNode of textNodes) {
      const text = textNode.textContent ?? "";
      const frag = document.createDocumentFragment();
      let lastIndex = 0;
      regex.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }
        const mark = document.createElement("mark");
        mark.setAttribute("data-job-match", "");
        mark.style.backgroundColor = "rgba(34, 197, 94, 0.3)";
        mark.style.borderRadius = "2px";
        mark.style.padding = "0 1px";
        mark.textContent = match[0];
        frag.appendChild(mark);
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      textNode.parentNode?.replaceChild(frag, textNode);
    }

    setHighlighted(true);
  }, [analysis, highlighted]);

  if (!cv) return null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
          {t("editor.section.experience.title") ? "Offre d'emploi" : "Job offer"}
        </p>
        <textarea
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          placeholder="Collez le texte de l'offre d'emploi ici..."
          className="w-full h-32 px-3 py-2 rounded-md border border-border bg-surface text-ink text-sm resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      {analysis && (
        <>
          <div className="text-center">
            <p className="text-xs text-ink-muted mb-1">Correspondance mots-clés</p>
            <span
              className={`text-2xl font-bold ${
                analysis.score >= 70
                  ? "text-green-600"
                  : analysis.score >= 40
                    ? "text-amber-600"
                    : "text-red-600"
              }`}
            >
              {analysis.score}%
            </span>
            <p className="text-xs text-ink-muted mt-1">
              {analysis.matched.length}/{analysis.jobKeywords.length} mots-clés trouvés
            </p>
          </div>

          {analysis.matched.length > 0 && (
            <button
              type="button"
              onClick={toggleHighlight}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                highlighted
                  ? "bg-green-100 border-green-300 text-green-700"
                  : "bg-surface border-border text-ink-secondary hover:border-accent"
              }`}
            >
              {highlighted ? "Retirer le surlignage" : "Surligner dans le CV"}
            </button>
          )}

          {analysis.matched.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-700 mb-1">Présents dans votre CV</p>
              <div className="flex flex-wrap gap-1">
                {analysis.matched.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-xs"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.missing.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-600 mb-1">Absents de votre CV</p>
              <div className="flex flex-wrap gap-1">
                {analysis.missing.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded text-xs"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
