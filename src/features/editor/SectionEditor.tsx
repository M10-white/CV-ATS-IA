import { useEffect, useRef, useState } from "react";
import { useCVStore } from "../../stores/cvStore";
import { AISuggestionsPanel } from "../ai/AISuggestionsPanel";
import { ATSPanel } from "../ats/ATSPanel";
import { JobMatchPanel } from "../ats/JobMatchPanel";
import { CertificationsEditor } from "./CertificationsEditor";
import { CustomizationPanel } from "./CustomizationPanel";
import { EducationEditor } from "./EducationEditor";
import { ExperienceEditor } from "./ExperienceEditor";
import { HistoryPanel } from "./HistoryPanel";
import { LanguagesEditor } from "./LanguagesEditor";
import { ProfileEditor } from "./ProfileEditor";
import { ProjectsEditor } from "./ProjectsEditor";
import { SkillsEditor } from "./SkillsEditor";
import { VolunteeringEditor } from "./VolunteeringEditor";

function getPanel(id: string | null) {
  if (!id) return null;
  if (id === "profile") return <ProfileEditor />;
  if (id === "experience") return <ExperienceEditor />;
  if (id === "education") return <EducationEditor />;
  if (id === "skills") return <SkillsEditor />;
  if (id === "languages") return <LanguagesEditor />;
  if (id === "projects") return <ProjectsEditor />;
  if (id === "certifications") return <CertificationsEditor />;
  if (id === "volunteering") return <VolunteeringEditor />;
  if (id === "ai-suggestions") return <AISuggestionsPanel />;
  if (id === "history") return <HistoryPanel />;
  if (id === "customization") return <CustomizationPanel />;
  if (id === "ats") return <ATSPanel />;
  if (id === "job-match") return <JobMatchPanel />;
  return null;
}

export function SectionEditor() {
  const activeSectionId = useCVStore((s) => s.activeSectionId);
  const [displayedId, setDisplayedId] = useState(activeSectionId);
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSectionId === displayedId) return;
    setAnimating(true);
    const t = setTimeout(() => {
      setDisplayedId(activeSectionId);
      setAnimating(false);
    }, 150);
    return () => clearTimeout(t);
  }, [activeSectionId, displayedId]);

  const panel = getPanel(displayedId);

  if (!panel) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--color-accent-dim)" }}
        >
          <span className="text-lg text-accent">✦</span>
        </div>
        <p className="text-sm text-ink-muted">Sélectionnez une section</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        opacity: animating ? 0 : 1,
        transform: animating ? "translateY(8px)" : "translateY(0)",
        transition: "all 0.15s ease-out",
      }}
    >
      {panel}
    </div>
  );
}
