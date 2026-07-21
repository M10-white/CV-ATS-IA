import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { tauriStorage } from "../lib/tauriStorage";

interface SettingsState {
  language: string;
  defaultFont: string;
  defaultTemplate: string;
  aiProvider: string;
  aiApiKey: string;
  aiBaseUrl: string;
  aiModel: string;

  setLanguage: (language: string) => void;
  setDefaultFont: (font: string) => void;
  setDefaultTemplate: (template: string) => void;
  setAIConfig: (config: {
    provider?: string;
    apiKey?: string;
    baseUrl?: string;
    model?: string;
  }) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: "fr",
      defaultFont: "Inter",
      defaultTemplate: "classic",
      aiProvider: "none",
      aiApiKey: "",
      aiBaseUrl: "",
      aiModel: "",

      setLanguage: (language) => set({ language }),
      setDefaultFont: (defaultFont) => set({ defaultFont }),
      setDefaultTemplate: (defaultTemplate) => set({ defaultTemplate }),
      setAIConfig: (config) =>
        set((state) => ({
          aiProvider: config.provider ?? state.aiProvider,
          aiApiKey: config.apiKey ?? state.aiApiKey,
          aiBaseUrl: config.baseUrl ?? state.aiBaseUrl,
          aiModel: config.model ?? state.aiModel,
        })),
    }),
    { name: "cv-architect-settings", storage: createJSONStorage(() => tauriStorage) },
  ),
);
