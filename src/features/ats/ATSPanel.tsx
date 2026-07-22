import { useEffect, useMemo, useState } from "react";
import { useCVStore } from "../../stores/cvStore";
import type { AlertCategory, AlertSeverity, ATSAlert } from "../../types/ats";
import { analyzeCV } from "./engine";

const SEVERITY_COLORS: Record<AlertSeverity, { bg: string; text: string; border: string }> = {
  critical: { bg: "var(--color-danger-dim)", text: "var(--color-danger)", border: "color-mix(in srgb, var(--color-danger), transparent 70%)" },
  warning: { bg: "var(--color-warning-dim)", text: "var(--color-warning)", border: "color-mix(in srgb, var(--color-warning), transparent 70%)" },
  suggestion: { bg: "color-mix(in srgb, #38bdf8, transparent 90%)", text: "#0284c7", border: "color-mix(in srgb, #38bdf8, transparent 70%)" },
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

function AnimatedScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let frame: number;
    let start: number;
    const duration = 1200;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const color = animatedScore >= 80 ? "var(--color-success)" : animatedScore >= 60 ? "var(--color-warning)" : "var(--color-danger)";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border-light)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s",
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-black tabular-nums" style={{ color }}>
          {animatedScore}
        </span>
        <span className="text-[10px] text-ink-muted font-medium">/ 100</span>
      </div>
    </div>
  );
}

function MiniScore({ score, label, delay }: { score: number; label: string; delay: number }) {
  const color = score >= 80 ? "var(--color-success)" : score >= 60 ? "var(--color-warning)" : "var(--color-danger)";
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-ink-secondary font-medium">{label}</span>
        <span className="text-[11px] font-bold tabular-nums" style={{ color }}>{score}</span>
      </div>
      <div className="h-1.5 rounded-full bg-border-light overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: color,
            transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

function AlertItem({ alert, index }: { alert: ATSAlert; index: number }) {
  const colors = SEVERITY_COLORS[alert.severity];
  return (
    <div
      className="px-3 py-2.5 rounded-xl border text-xs"
      style={{
        background: colors.bg,
        borderColor: colors.border,
        color: colors.text,
        animation: `alertSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s both`,
      }}
    >
      <div className="flex items-center gap-2 mb-0.5">
        <span className="font-bold">{SEVERITY_LABELS[alert.severity]}</span>
        <span style={{ opacity: 0.5 }}>· {CATEGORY_LABELS[alert.category]}</span>
      </div>
      <p className="font-medium">{alert.message}</p>
      <p style={{ opacity: 0.7 }} className="mt-0.5">{alert.recommendation}</p>
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
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted">
          Score ATS
        </p>
        <AnimatedScoreRing score={scores.overall} />
      </div>

      <div className="flex flex-col gap-2.5 px-1">
        <MiniScore score={scores.readability} label="Lisibilité" delay={200} />
        <MiniScore score={scores.structure} label="Structure" delay={400} />
        <MiniScore score={scores.extraction} label="Extraction" delay={600} />
        <MiniScore score={scores.content} label="Contenu" delay={800} />
      </div>

      {alerts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {criticalCount > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--color-danger-dim)", color: "var(--color-danger)" }}>
                {criticalCount} critique{criticalCount > 1 ? "s" : ""}
              </span>
            )}
            {warningCount > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--color-warning-dim)", color: "var(--color-warning)" }}>
                {warningCount} avertissement{warningCount > 1 ? "s" : ""}
              </span>
            )}
            {suggestionCount > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, #38bdf8, transparent 90%)", color: "#0284c7" }}>
                {suggestionCount} suggestion{suggestionCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {alerts.map((alert, i) => (
              <AlertItem
                key={`${alert.category}-${alert.severity}-${alert.message.slice(0, 40)}`}
                alert={alert}
                index={i}
              />
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div
          className="text-center py-6 rounded-2xl"
          style={{
            background: "var(--color-success-dim)",
            animation: "alertSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <span className="text-2xl block mb-2">🎉</span>
          <p className="text-sm font-semibold" style={{ color: "var(--color-success)" }}>
            Excellent ! Aucun problème détecté.
          </p>
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={() => setShowParserView(!showParserView)}
          className="text-xs text-accent hover:text-accent/80 transition-colors"
        >
          {showParserView ? "Masquer" : "Afficher"} la vue parseur
        </button>
        {showParserView && (
          <pre
            className="mt-2 p-3 border rounded-xl text-[10px] whitespace-pre-wrap font-mono max-h-60 overflow-y-auto"
            style={{
              background: "var(--color-paper)",
              borderColor: "var(--color-border-light)",
              color: "var(--color-ink-secondary)",
              animation: "alertSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}
          >
            {diagnostic.parserView}
          </pre>
        )}
      </div>

      <style>{`
        @keyframes alertSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
