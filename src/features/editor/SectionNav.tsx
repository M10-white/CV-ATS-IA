import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCVStore } from "../../stores/cvStore";
import type { SectionType } from "../../types/cv";

const SECTION_LABELS: Record<string, string> = {
  profile: "editor.section.profile.title",
  experience: "editor.section.experience.title",
  education: "editor.section.education.title",
  skills: "editor.section.skills.title",
  languages: "editor.section.languages.title",
  projects: "editor.section.projects.title",
  certifications: "editor.section.certifications.title",
  volunteering: "editor.section.volunteering.title",
  custom: "editor.section.custom.title",
};

const ADDABLE_SECTIONS: { type: SectionType; label: string }[] = [
  { type: "projects", label: "Projets" },
  { type: "certifications", label: "Certifications" },
  { type: "volunteering", label: "Bénévolat" },
];

function SortableItem({
  id,
  type,
  isActive,
  visible,
  onSelect,
  onToggle,
}: {
  id: string;
  type: SectionType;
  isActive: boolean;
  visible: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : visible ? 1 : 0.4,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors mb-1 group ${
        isActive
          ? "bg-accent-dim text-accent-text font-medium"
          : "text-ink-secondary hover:bg-border-light"
      }`}
    >
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab text-ink-muted hover:text-ink-secondary text-xs"
        title="Réordonner"
      >
        ⠿
      </span>
      <button type="button" onClick={onSelect} className="flex-1 text-left truncate">
        {t(SECTION_LABELS[type] ?? type)}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="opacity-0 group-hover:opacity-100 text-xs text-ink-muted hover:text-ink transition-opacity"
        title={visible ? "Masquer" : "Afficher"}
      >
        {visible ? "◉" : "○"}
      </button>
    </div>
  );
}

export function SectionNav() {
  const { t } = useTranslation();
  const cv = useCVStore((s) => s.getCurrentCV());
  const activeSectionId = useCVStore((s) => s.activeSectionId);
  const setActiveSection = useCVStore((s) => s.setActiveSection);
  const toggleSectionVisibility = useCVStore((s) => s.toggleSectionVisibility);
  const reorderSections = useCVStore((s) => s.reorderSections);
  const addNewSection = useCVStore((s) => s.addNewSection);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  if (!cv) return null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = cv.sections.findIndex((s) => s.id === active.id);
    const newIndex = cv.sections.findIndex((s) => s.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderSections(oldIndex, newIndex);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <button
        type="button"
        onClick={() => setActiveSection("profile")}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-1 transition-colors ${
          activeSectionId === "profile"
            ? "bg-accent-dim text-accent-text font-medium"
            : "text-ink-secondary hover:bg-border-light"
        }`}
      >
        {t("editor.section.profile.title")}
      </button>

      <div className="my-2 border-t border-border-light" />

      <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2 px-3">
        {t("editor.sections")}
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={cv.sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {cv.sections.map((section) => (
            <SortableItem
              key={section.id}
              id={section.id}
              type={section.type}
              isActive={activeSectionId === section.id}
              visible={section.visible}
              onSelect={() => setActiveSection(section.id)}
              onToggle={() => toggleSectionVisibility(section.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {(() => {
        const existing = cv.sections.map((s) => s.type);
        const available = ADDABLE_SECTIONS.filter((s) => !existing.includes(s.type));
        if (available.length === 0) return null;
        return (
          <div className="relative mt-2 px-3">
            <button
              type="button"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="text-xs text-accent hover:text-accent/80 transition-colors"
            >
              + Ajouter une section
            </button>
            {showAddMenu && (
              <div className="absolute left-3 top-6 z-10 bg-raised border border-border-light rounded-md shadow-md py-1 min-w-[160px]">
                {available.map((s) => (
                  <button
                    key={s.type}
                    type="button"
                    onClick={() => {
                      addNewSection(s.type);
                      setShowAddMenu(false);
                    }}
                    className="block w-full text-left px-3 py-1.5 text-sm text-ink-secondary hover:bg-border-light transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      <div className="mt-auto pt-3 border-t border-border-light flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setActiveSection("history")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm w-full transition-colors ${
            activeSectionId === "history"
              ? "bg-accent-dim text-accent-text font-medium"
              : "text-ink-secondary hover:bg-border-light"
          }`}
        >
          Historique
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("ai-suggestions")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm w-full transition-colors ${
            activeSectionId === "ai-suggestions"
              ? "bg-accent-dim text-accent-text font-medium"
              : "text-ink-secondary hover:bg-border-light"
          }`}
        >
          Suggestions IA
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("customization")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm w-full transition-colors ${
            activeSectionId === "customization"
              ? "bg-accent-dim text-accent-text font-medium"
              : "text-ink-secondary hover:bg-border-light"
          }`}
        >
          Personnalisation
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("ats")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm w-full transition-colors ${
            activeSectionId === "ats"
              ? "bg-accent-dim text-accent-text font-medium"
              : "text-ink-secondary hover:bg-border-light"
          }`}
        >
          Analyse ATS
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("job-match")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm w-full transition-colors ${
            activeSectionId === "job-match"
              ? "bg-accent-dim text-accent-text font-medium"
              : "text-ink-secondary hover:bg-border-light"
          }`}
        >
          Offre d'emploi
        </button>
      </div>
    </div>
  );
}
