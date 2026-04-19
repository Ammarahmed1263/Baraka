import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppSettings } from "@types";

const DEFAULT_SETTINGS: AppSettings = {
  showBilingual: false,
  darkMode: "auto",
  notificationsEnabled: true,
  onboardingComplete: false,
  profile: {
    isHomemaker: false,
    isParent: false,
    isStudent: false,
    isProfessional: false,
  },
};

type SettingsStore = {
  settings: AppSettings;
  isLoading: boolean;
  updateSettings: (updates: Partial<AppSettings>) => void;
  getProfileTags: () => string[];
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      isLoading: true,

      updateSettings: (updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...updates,
            profile: { ...state.settings.profile, ...(updates.profile ?? {}) },
          },
        })),

      getProfileTags: () => {
        const { profile } = get().settings;
        return (Object.keys(profile) as (keyof typeof profile)[])
          .filter((key) => profile[key])
          .map((key) => key.replace("is", "").toLowerCase());
      },
    }),
    {
      name: "@niyyah_settings",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.updateSettings({}); // trigger merge with defaults
        if (state) state.isLoading = false;
      },
    }
  )
);

