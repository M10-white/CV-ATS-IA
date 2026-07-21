import { useCVStore } from "../../stores/cvStore";
import { EducationEditor } from "./EducationEditor";
import { ExperienceEditor } from "./ExperienceEditor";
import { LanguagesEditor } from "./LanguagesEditor";
import { ProfileEditor } from "./ProfileEditor";
import { SkillsEditor } from "./SkillsEditor";

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

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-sm text-ink-muted">Section non supportée.</p>
    </div>
  );
}
