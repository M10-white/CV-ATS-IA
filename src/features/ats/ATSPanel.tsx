import { useMemo, useState } from "react";
import { useCVStore } from "../../stores/cvStore";
import type { AlertCategory, AlertSeverity, ATSAlert } from "../../types/ats";
import { analyzeCV } from "./engine";

const SEVERITY_COLORS: Record<AlertSeverity, string> = {
  critical: "text-red-600 bg-red-50 border-red-200",
  warning: "text-amber-700 bg-amber-50 border-amber-200",
  suggestion: "text-sky-700 bg-sky-50 border-sky-200",
};

const SEVERITY_LABELS: Record<AlertSeverity, string> = {
  critical: "Critique",
  warning: "Attention",
  suggestion: "Suggestion",
};

const CATEGORY_LABELS: Record<AlertCategory, string> = {
  readability: "Lisibilité",
  structure: "Structure",
  extraction: "Extraction",
  content: "Contenu",
};

function ScoreRing({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-red-600";
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-lg font-bold ${color}`}>{score}</span>
      <span className="text-[10px] text-ink-muted uppercase tracking-wider">{label}</span>
    </div>
  );
}

function AlertItem({ alert }: { alert: ATSAlert }) {
  return (
    <div className={`px-3 py-2 rounded-md border text-xs ${SEVERITY_COLORS[alert.severity]}`}>
      <div className="flex items-center gap-2 mb-0.5">
        <span className="font-semibold">{SEVERITY_LABELS[alert.severity]}</span>
        <span className="opacity-60">· {CATEGORY_LABELS[alert.category]}</span>
      </div>
      <p className="font-medium">{alert.message}</p>
      <p className="opacity-80 mt-0.5">{alert.recommendation}</p>
    </div>
  );
}

export function ATSPanel() {
  const cv = useCVStore((s) => s.getCurrentCV());
  const [showParserView, setShowParserView] = useState(false);

  const diagnostic = useMemo(() => (cv ? analyzeCV(cv) : null), [cv]);

  if (!cv || !diagnostic) return null;

  const { scores, alerts } = diagnostic;

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;
  const suggestionCount = alerts.filter((a) => a.severity === "suggestion").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
          Score ATS global
        </p>
        <span
          className={`text-3xl font-bold ${
            scores.overall >= 80
              ? "text-green-600"
              : scores.overall >= 60
                ? "text-amber-600"
                : "text-red-600"
          }`}
        >
          {scores.overall}
        </span>
        <span className="text-ink-muted text-sm">/100</span>
      </div>

      <div className="flex justify-around py-2 border-y border-border-light">
        <ScoreRing score={scores.readability} label="Lisibilité" />
        <ScoreRing score={scores.structure} label="Structure" />
        <ScoreRing score={scores.extraction} label="Extraction" />
        <ScoreRing score={scores.content} label="Contenu" />
      </div>

      {alerts.length > 0 && (
        <div>
          <p className="text-xs text-ink-muted mb-2">
            {criticalCount > 0 && (
              <span className="text-red-600 font-semibold">
                {criticalCount} critique{criticalCount > 1 ? "s" : ""}
              </span>
            )}
            {criticalCount > 0 && warningCount > 0 && " · "}
            {warningCount > 0 && (
              <span className="text-amber-600 font-semibold">
                {warningCount} avertissement{warningCount > 1 ? "s" : ""}
              </span>
            )}
            {(criticalCount > 0 || warningCount > 0) && suggestionCount > 0 && " · "}
            {suggestionCount > 0 && (
              <span className="text-sky-600">
                {suggestionCount} suggestion{suggestionCount > 1 ? "s" : ""}
              </span>
            )}
          </p>
          <div className="flex flex-col gap-2">
            {alerts.map((alert) => (
              <AlertItem
                key={`${alert.category}-${alert.severity}-${alert.message.slice(0, 40)}`}
                alert={alert}
              />
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <p className="text-sm text-green-600 text-center py-4">
          Excellent ! Aucun problème détecté.
        </p>
      )}

      <div>
        <button
          type="button"
          onClick={() => setShowParserView(!showParserView)}
          className="text-xs text-accent hover:underline"
        >
          {showParserView ? "Masquer" : "Afficher"} la vue parseur
        </button>
        {showParserView && (
          <pre className="mt-2 p-3 bg-paper border border-border-light rounded text-[10px] text-ink-secondary whitespace-pre-wrap font-mono max-h-60 overflow-y-auto">
            {diagnostic.parserView}
          </pre>
        )}
      </div>
    </div>
  );
}
