import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { tauriStorage } from "../lib/tauriStorage";
import type {
  CertificationItem,
  CustomSection,
  CVData,
  CVProfile,
  CVSection,
  EducationItem,
  ExperienceItem,
  LanguageItem,
  ProjectItem,
  SectionType,
  SkillCategory,
  VolunteerItem,
} from "../types/cv";
import { createEmptyCV } from "../types/cv";
import { useHistoryStore } from "./historyStore";

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

  addProject: () => void;
  updateProject: (itemId: string, updates: Partial<ProjectItem>) => void;
  removeProject: (itemId: string) => void;

  addCertification: () => void;
  updateCertification: (itemId: string, updates: Partial<CertificationItem>) => void;
  removeCertification: (itemId: string) => void;

  addVolunteer: () => void;
  updateVolunteer: (itemId: string, updates: Partial<VolunteerItem>) => void;
  removeVolunteer: (itemId: string) => void;

  addNewSection: (type: SectionType) => void;

  undo: () => void;
  redo: () => void;

  importCV: (data: CVData) => string;
  exportCV: (id: string) => CVData | null;
}

let lastSnapshotTime = 0;

function updateCurrentCV(state: CVState, updater: (cv: CVData) => CVData): Partial<CVState> {
  if (!state.currentCVId) return {};
  const now = Date.now();
  return {
    cvList: state.cvList.map((cv) => {
      if (cv.meta.id !== state.currentCVId) return cv;
      if (now - lastSnapshotTime > 1000) {
        useHistoryStore.getState().pushUndo(JSON.parse(JSON.stringify(cv)), "Modification");
        lastSnapshotTime = now;
      }
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

      addProject: () => {
        const item: ProjectItem = {
          id: crypto.randomUUID(),
          name: "",
          role: "",
          url: "",
          startDate: "",
          endDate: "",
          description: "",
        };
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "projects", (s) => ({
              ...s,
              items: [...s.items, item],
            })),
          ),
        );
      },

      updateProject: (itemId, updates) => {
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "projects", (s) => ({
              ...s,
              items: (s.items as ProjectItem[]).map((i) =>
                i.id === itemId ? { ...i, ...updates } : i,
              ),
            })),
          ),
        );
      },

      removeProject: (itemId) => {
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "projects", (s) => ({
              ...s,
              items: (s.items as ProjectItem[]).filter((i) => i.id !== itemId),
            })),
          ),
        );
      },

      addCertification: () => {
        const item: CertificationItem = {
          id: crypto.randomUUID(),
          name: "",
          issuer: "",
          date: "",
          url: "",
        };
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "certifications", (s) => ({
              ...s,
              items: [...s.items, item],
            })),
          ),
        );
      },

      updateCertification: (itemId, updates) => {
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "certifications", (s) => ({
              ...s,
              items: (s.items as CertificationItem[]).map((i) =>
                i.id === itemId ? { ...i, ...updates } : i,
              ),
            })),
          ),
        );
      },

      removeCertification: (itemId) => {
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "certifications", (s) => ({
              ...s,
              items: (s.items as CertificationItem[]).filter((i) => i.id !== itemId),
            })),
          ),
        );
      },

      addVolunteer: () => {
        const item: VolunteerItem = {
          id: crypto.randomUUID(),
          organization: "",
          role: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        };
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "volunteering", (s) => ({
              ...s,
              items: [...s.items, item],
            })),
          ),
        );
      },

      updateVolunteer: (itemId, updates) => {
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "volunteering", (s) => ({
              ...s,
              items: (s.items as VolunteerItem[]).map((i) =>
                i.id === itemId ? { ...i, ...updates } : i,
              ),
            })),
          ),
        );
      },

      removeVolunteer: (itemId) => {
        set((state) =>
          updateCurrentCV(state, (cv) =>
            updateSection(cv, "volunteering", (s) => ({
              ...s,
              items: (s.items as VolunteerItem[]).filter((i) => i.id !== itemId),
            })),
          ),
        );
      },

      addNewSection: (type) => {
        const cv = get().getCurrentCV();
        if (!cv) return;
        if (cv.sections.some((s) => s.type === type)) return;
        const id = type;
        const section: CVSection = { id, type, visible: true, items: [] };
        set((state) =>
          updateCurrentCV(state, (c) => ({
            ...c,
            sections: [...c.sections, section],
          })),
        );
        set({ activeSectionId: id });
      },

      undo: () => {
        const snapshot = useHistoryStore.getState().undo();
        if (!snapshot) return;
        const currentCv = get().getCurrentCV();
        if (currentCv) {
          useHistoryStore.setState((s) => ({
            redoStack: [...s.redoStack, JSON.parse(JSON.stringify(currentCv))],
          }));
        }
        set((state) => ({
          cvList: state.cvList.map((cv) => (cv.meta.id === snapshot.meta.id ? snapshot : cv)),
        }));
      },

      redo: () => {
        const snapshot = useHistoryStore.getState().redo();
        if (!snapshot) return;
        const currentCv = get().getCurrentCV();
        if (currentCv) {
          useHistoryStore.getState().pushUndo(JSON.parse(JSON.stringify(currentCv)), "Redo");
        }
        set((state) => ({
          cvList: state.cvList.map((cv) => (cv.meta.id === snapshot.meta.id ? snapshot : cv)),
        }));
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
    {
      name: "cv-architect-storage",
      storage: createJSONStorage(() => tauriStorage),
      partialize: (state) => ({ cvList: state.cvList }),
    },
  ),
);
