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

export function SectionEditor() {
  const activeSectionId = useCVStore((s) => s.activeSectionId);

  if (!activeSectionId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-ink-muted">Sélectionnez une section pour l'éditer.</p>
      </div>
    );
  }

  if (activeSectionId === "profile") return <ProfileEditor />;
  if (activeSectionId === "experience") return <ExperienceEditor />;
  if (activeSectionId === "education") return <EducationEditor />;
  if (activeSectionId === "skills") return <SkillsEditor />;
  if (activeSectionId === "languages") return <LanguagesEditor />;
  if (activeSectionId === "projects") return <ProjectsEditor />;
  if (activeSectionId === "certifications") return <CertificationsEditor />;
  if (activeSectionId === "volunteering") return <VolunteeringEditor />;
  if (activeSectionId === "ai-suggestions") return <AISuggestionsPanel />;
  if (activeSectionId === "history") return <HistoryPanel />;
  if (activeSectionId === "customization") return <CustomizationPanel />;
  if (activeSectionId === "ats") return <ATSPanel />;
  if (activeSectionId === "job-match") return <JobMatchPanel />;

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-sm text-ink-muted">Section non supportée.</p>
    </div>
  );
}
