import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CustomSection,
  CVData,
  CVProfile,
  CVSection,
  EducationItem,
  ExperienceItem,
  LanguageItem,
  SectionType,
  SkillCategory,
} from "../types/cv";
import { createEmptyCV } from "../types/cv";

interface CVState {
  cvList: CVData[];
  currentCVId: string | null;
  activeSectionId: string | null;

  getCurrentCV: () => CVData | undefined;

  createCV: () => string;
  duplicateCV: (id: string) => string | null;
  deleteCV: (id: string) => void;
  selectCV: (id: string | null) => void;
  setActiveSection: (sectionId: string | null) => void;

  updateProfile: (updates: Partial<CVProfile>) => void;
  updateCustomization: (updates: Partial<CVData["customization"]>) => void;

  addSection: (type: SectionType) => void;
  removeSection: (sectionId: string) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;

  addExperience: () => void;
  updateExperience: (itemId: string, updates: Partial<ExperienceItem>) => void;
  removeExperience: (itemId: string) => void;

  addEducation: () => void;
  updateEducation: (itemId: string, updates: Partial<EducationItem>) => void;
  removeEducation: (itemId: string) => void;

  addSkillCategory: () => void;
  updateSkillCategory: (itemId: string, updates: Partial<SkillCategory>) => void;
  removeSkillCategory: (itemId: string) => void;

  addLanguage: () => void;
  updateLanguage: (itemId: string, updates: Partial<LanguageItem>) => void;
  removeLanguage: (itemId: string) => void;

  updateCustomSection: (sectionId: string, updates: Partial<CustomSection>) => void;

  importCV: (data: CVData) => string;
  exportCV: (id: string) => CVData | null;
}

function updateCurrentCV(state: CVState, updater: (cv: CVData) => CVData): Partial<CVState> {
  if (!state.currentCVId) return {};
  return {
    cvList: state.cvList.map((cv) => {
      if (cv.meta.id !== state.currentCVId) return cv;
      const updated = updater(cv);
      updated.meta.modified = new Date().toISOString();
      return updated;
    }),
  };
}

function updateSection(
  cv: CVData,
  sectionType: string,
  updater: (s: CVSection) => CVSection,
): CVData {
  return {
    ...cv,
    sections: cv.sections.map((s) => (s.type === sectionType ? updater(s) : s)),
  };
}

export const useCVStore = create<CVState>()(
  persist(
    (set, get) => ({
      cvList: [],
      currentCVId: null,
      activeSectionId: null,

      getCurrentCV: () => {
        const { cvList, currentCVId } = get();
        return cvList.find((cv) => cv.meta.id === currentCVId);
      },

      createCV: () => {
        const id = crypto.randomUUID();
        const cv = createEmptyCV(id, "default");
        set((state) => ({
          cvList: [...state.cvList, cv],
          currentCVId: id,
          activeSectionId: null,
        }));
        return id;
      },

      duplicateCV: (id) => {
        const source = get().cvList.find((cv) => cv.meta.id === id);
        if (!source) return null;
        const newId = crypto.randomUUID();
        const now = new Date().toISOString();
        const copy: CVData = JSON.parse(JSON.stringify(source));
        copy.meta.id = newId;
        copy.meta.created = now;
        copy.meta.modified = now;
        set((state) => ({ cvList: [...state.cvList, copy] }));
        return newId;
      },

      deleteCV: (id) => {
        set((state) => ({
          cvList: state.cvList.filter((cv) => cv.meta.id !== id),
          currentCVId: state.currentCVId === id ? null : state.currentCVId,
        }));
      },

      selectCV: (id) => set({ currentCVId: id, activeSectionId: null }),

      setActiveSection: (sectionId) => set({ activeSectionId: sectionId }),

      updateProfile: (updates) => {
        set((state) =>
          updateCurrentCV(state, (cv) => ({
            ...cv,
            profile: { ...cv.profile, ...updates },
          })),
        );
      },

      updateCustomization: (updates) => {
        set((state) =>
          updateCurrentCV(state, (cv) => ({
            ...cv,
            customization: { ...cv.customization, ...updates },
          })),
        );
      },

      addSection: (type) => {
        const id = `${type}-${crypto.randomUUID().slice(0, 8)}`;
        const section: CVSection = { id, type, visible: true, items: [] };
        set((state) =>
          updateCurrentCV(state, (cv) => ({
            ...cv,
            sections: [...cv.sections, section],
          })),
        );
      },

      removeSection: (sectionId) => {
        set((state) =>
          updateCurrentCV(state, (cv) => ({
            ...cv,
            sections: cv.sections.filter((s) => s.id !== sectionId),
          })),
        );
      },

      toggleSectionVisibility: (sectionId) => {
        set((state) =>
          updateCurrentCV(state, (cv) => ({
            ...cv,
            sections: cv.sections.map((s) =>
              s.id === sectionId ? { ...s, visible: !s.visible } : s,
            ),
          })),
        );
      },

      reorderSections: (fromIndex, toIndex) => {
        set((state) =>
          updateCurrentCV(state, (cv) => {
            const sections = [...cv.sections];
            const [moved] = sections.splice(fromIndex, 1);
            sections.splice(toIndex, 0, moved);
            return { ...cv, sections };
          }),
        );
      },

      addExperience: () => {
        const item: ExperienceItem = {
          id: crypto.randomUUID(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        };
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "experience", (s) => ({
              ...s,
              items: [...s.items, item],
            })),
          ),
        );
      },

      updateExperience: (itemId, updates) => {
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "experience", (s) => ({
              ...s,
              items: (s.items as ExperienceItem[]).map((i) =>
                i.id === itemId ? { ...i, ...updates } : i,
              ),
            })),
          ),
        );
      },

      removeExperience: (itemId) => {
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "experience", (s) => ({
              ...s,
              items: (s.items as ExperienceItem[]).filter((i) => i.id !== itemId),
            })),
          ),
        );
      },

      addEducation: () => {
        const item: EducationItem = {
          id: crypto.randomUUID(),
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          description: "",
        };
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "education", (s) => ({
              ...s,
              items: [...s.items, item],
            })),
          ),
        );
      },

      updateEducation: (itemId, updates) => {
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "education", (s) => ({
              ...s,
              items: (s.items as EducationItem[]).map((i) =>
                i.id === itemId ? { ...i, ...updates } : i,
              ),
            })),
          ),
        );
      },

      removeEducation: (itemId) => {
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "education", (s) => ({
              ...s,
              items: (s.items as EducationItem[]).filter((i) => i.id !== itemId),
            })),
          ),
        );
      },

      addSkillCategory: () => {
        const item: SkillCategory = {
          id: crypto.randomUUID(),
          category: "",
          items: [],
        };
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "skills", (s) => ({
              ...s,
              items: [...s.items, item],
            })),
          ),
        );
      },

      updateSkillCategory: (itemId, updates) => {
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "skills", (s) => ({
              ...s,
              items: (s.items as SkillCategory[]).map((i) =>
                i.id === itemId ? { ...i, ...updates } : i,
              ),
            })),
          ),
        );
      },

      removeSkillCategory: (itemId) => {
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "skills", (s) => ({
              ...s,
              items: (s.items as SkillCategory[]).filter((i) => i.id !== itemId),
            })),
          ),
        );
      },

      addLanguage: () => {
        const item: LanguageItem = {
          id: crypto.randomUUID(),
          language: "",
          level: "",
        };
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "languages", (s) => ({
              ...s,
              items: [...s.items, item],
            })),
          ),
        );
      },

      updateLanguage: (itemId, updates) => {
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "languages", (s) => ({
              ...s,
              items: (s.items as LanguageItem[]).map((i) =>
                i.id === itemId ? { ...i, ...updates } : i,
              ),
            })),
          ),
        );
      },

      removeLanguage: (itemId) => {
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "languages", (s) => ({
              ...s,
              items: (s.items as LanguageItem[]).filter((i) => i.id !== itemId),
            })),
          ),
        );
      },

      updateCustomSection: (sectionId, updates) => {
        set((state) =>
          updateCurrentCV(state, (cv) => ({
            ...cv,
            sections: cv.sections.map((s) =>
              s.id === sectionId
                ? {
                    ...s,
                    items: [
                      s.items[0]
                        ? { ...s.items[0], ...updates }
                        : { id: sectionId, title: "", content: "", ...updates },
                    ],
                  }
                : s,
            ),
          })),
        );
      },

      importCV: (data) => {
        const newId = crypto.randomUUID();
        const now = new Date().toISOString();
        const imported: CVData = JSON.parse(JSON.stringify(data));
        imported.meta.id = newId;
        imported.meta.created = now;
        imported.meta.modified = now;
        set((state) => ({
          cvList: [...state.cvList, imported],
          currentCVId: newId,
          activeSectionId: null,
        }));
        return newId;
      },

      exportCV: (id) => {
        const cv = get().cvList.find((c) => c.meta.id === id);
        return cv ? JSON.parse(JSON.stringify(cv)) : null;
      },
    }),
    { name: "cv-architect-storage", partialize: (state) => ({ cvList: state.cvList }) },
  ),
);
