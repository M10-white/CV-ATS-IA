import { create } from "zustand";

interface SettingsState {
  language: string;
  defaultFont: string;
  defaultTemplate: string;
  aiProvider: string;
  aiBaseUrl: string;
  aiModel: string;

  setLanguage: (language: string) => void;
  setDefaultFont: (font: string) => void;
  setDefaultTemplate: (template: string) => void;
  setAIConfig: (provider: string, baseUrl: string, model: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  language: "fr",
  defaultFont: "Inter",
  defaultTemplate: "classic",
  aiProvider: "none",
  aiBaseUrl: "",
  aiModel: "",

  setLanguage: (language) => set({ language }),
  setDefaultFont: (defaultFont) => set({ defaultFont }),
  setDefaultTemplate: (defaultTemplate) => set({ defaultTemplate }),
  setAIConfig: (aiProvider, aiBaseUrl, aiModel) => set({ aiProvider, aiBaseUrl, aiModel }),
}));
