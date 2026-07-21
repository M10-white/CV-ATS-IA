import { load, type Store } from "@tauri-apps/plugin-store";
import type { StateStorage } from "zustand/middleware";

let storeInstance: Store | null = null;
let storePromise: Promise<Store> | null = null;

async function getStore(): Promise<Store> {
  if (storeInstance) return storeInstance;
  if (!storePromise) {
    storePromise = load("cv-data.json", { autoSave: true }).then((store) => {
      storeInstance = store;
      return store;
    });
  }
  return storePromise;
}

function isTauri(): boolean {
  return "__TAURI_INTERNALS__" in window;
}

export const tauriStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (!isTauri()) {
      return localStorage.getItem(name);
    }
    const store = await getStore();
    const value = await store.get<string>(name);
    return value ?? null;
  },

  setItem: async (name: string, value: string): Promise<void> => {
    if (!isTauri()) {
      localStorage.setItem(name, value);
      return;
    }
    const store = await getStore();
    await store.set(name, value);
  },

  removeItem: async (name: string): Promise<void> => {
    if (!isTauri()) {
      localStorage.removeItem(name);
      return;
    }
    const store = await getStore();
    await store.delete(name);
  },
};
