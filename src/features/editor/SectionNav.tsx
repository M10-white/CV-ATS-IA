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
import { useTranslation } from "react-i18next";
import { useCVStore } from "../../stores/cvStore";
import type { SectionType } from "../../types/cv";

const SECTION_LABELS: Record<string, string> = {
  profile: "editor.section.profile.title",
  experience: "editor.section.experience.title",
  education: "editor.section.education.title",
  skills: "editor.section.skills.title",
  languages: "editor.section.languages.title",
  custom: "editor.section.custom.title",
};

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
    </div>
  );
}
