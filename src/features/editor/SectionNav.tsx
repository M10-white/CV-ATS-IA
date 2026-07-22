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

const SECTION_ICONS: Record<string, string> = {
  profile: "👤",
  experience: "💼",
  education: "🎓",
  skills: "⚡",
  languages: "🌍",
  projects: "🚀",
  certifications: "🏅",
  volunteering: "💜",
  custom: "✏️",
};

const TOOL_ICONS: Record<string, string> = {
  history: "⏱",
  "ai-suggestions": "✨",
  customization: "🎨",
  ats: "📊",
  "job-match": "🎯",
};

const TOOL_LABELS: Record<string, string> = {
  history: "Historique",
  "ai-suggestions": "Suggestions IA",
  customization: "Personnalisation",
  ats: "Analyse ATS",
  "job-match": "Offre d'emploi",
};

const ADDABLE_SECTIONS: { type: SectionType; label: string }[] = [
  { type: "projects", label: "Projets" },
  { type: "certifications", label: "Certifications" },
  { type: "volunteering", label: "Bénévolat" },
];

function NavButton({
  icon,
  label,
  isActive,
  onClick,
  dimmed,
  trailing,
}: {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  dimmed?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <div
      className="group relative flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 mb-0.5 cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      style={{
        background: isActive
          ? "linear-gradient(135deg, var(--color-accent-dim), color-mix(in srgb, var(--color-accent), transparent 88%))"
          : "transparent",
        color: isActive ? "var(--color-accent-text)" : dimmed ? "var(--color-ink-muted)" : "var(--color-ink-secondary)",
        fontWeight: isActive ? 600 : 400,
        transform: isActive ? "translateX(2px)" : "translateX(0)",
      }}
    >
      {isActive && (
        <div
          className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
          style={{
            background: "var(--color-accent)",
            animation: "navIndicator 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        />
      )}
      <span
        className="text-sm transition-transform duration-200"
        style={{
          transform: isActive ? "scale(1.15)" : "scale(1)",
          filter: dimmed && !isActive ? "grayscale(1)" : "none",
        }}
      >
        {icon}
      </span>
      <span className="flex-1 text-left truncate">{label}</span>
      {trailing}
    </div>
  );
}

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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center group">
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab text-ink-muted hover:text-ink-secondary text-[10px] px-1 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Réordonner"
      >
        ⠿
      </span>
      <div className="flex-1">
        <NavButton
          icon={SECTION_ICONS[type] ?? "📄"}
          label={t(SECTION_LABELS[type] ?? type)}
          isActive={isActive}
          onClick={onSelect}
          dimmed={!visible}
          trailing={
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggle(); }}
              className="opacity-0 group-hover:opacity-100 text-[10px] text-ink-muted hover:text-ink transition-all w-5 h-5 flex items-center justify-center rounded-md hover:bg-surface"
              title={visible ? "Masquer" : "Afficher"}
            >
              {visible ? "◉" : "○"}
            </button>
          }
        />
      </div>
    </div>
  );
}

export function SectionNav() {
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

  const toolItems = ["history", "ai-suggestions", "customization", "ats", "job-match"];

  return (
    <div className="flex flex-col h-full">
      <NavButton
        icon={SECTION_ICONS.profile}
        label="Identité"
        isActive={activeSectionId === "profile"}
        onClick={() => setActiveSection("profile")}
      />

      <div className="my-2 mx-3">
        <div className="h-px bg-gradient-to-r from-border to-transparent" />
      </div>

      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-muted mb-1.5 px-3">
        Sections
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
          <div className="relative mt-1 px-3">
            <button
              type="button"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors py-1"
            >
              <span className="w-4 h-4 rounded-md bg-accent/10 flex items-center justify-center text-[10px]">+</span>
              Ajouter
            </button>
            {showAddMenu && (
              <div
                className="absolute left-3 top-8 z-10 border rounded-xl py-1.5 min-w-[160px]"
                style={{
                  background: "var(--color-raised)",
                  borderColor: "var(--color-border-light)",
                  boxShadow: "0 8px 30px -8px rgba(0,0,0,0.15)",
                  animation: "menuPop 0.2s cubic-bezier(0.16, 1, 0.3, 1) both",
                }}
              >
                {available.map((s) => (
                  <button
                    key={s.type}
                    type="button"
                    onClick={() => {
                      addNewSection(s.type);
                      setShowAddMenu(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm transition-colors"
                    style={{ color: "var(--color-ink-secondary)" }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "var(--color-border-light)"; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; }}
                  >
                    <span className="text-sm">{SECTION_ICONS[s.type] ?? "📄"}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      <div className="mt-auto pt-2">
        <div className="mx-3 mb-2">
          <div className="h-px bg-gradient-to-r from-border to-transparent" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-muted mb-1.5 px-3">
          Outils
        </p>
        {toolItems.map((key) => (
          <NavButton
            key={key}
            icon={TOOL_ICONS[key]}
            label={TOOL_LABELS[key]}
            isActive={activeSectionId === key}
            onClick={() => setActiveSection(key)}
          />
        ))}
      </div>

      <style>{`
        @keyframes navIndicator {
          from { transform: scaleY(0); opacity: 0; }
          to { transform: scaleY(1); opacity: 1; }
        }
        @keyframes menuPop {
          from { opacity: 0; transform: translateY(-4px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
