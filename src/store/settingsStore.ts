import * as Sentry from "@sentry/react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { storageAdapter } from "@lib/storage";
import type { AppSettings } from "@types";

const DEFAULT_SETTINGS: AppSettings = {
  showBilingual: false,
  darkMode: "auto",
  notificationsStatus: "undetermined",
  notificationsEnabled: true,
  reminderTime: "08:00",
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
  setLoading: () => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  getProfileTags: () => string[];
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      isLoading: true,

      setLoading: () => set({ isLoading: false }),
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
      storage: createJSONStorage(() => storageAdapter),
      merge: (persistedState: any, currentState) => {
        if (!persistedState) return currentState;
        const mergedSettings = {
          ...currentState.settings,
          ...(persistedState.settings ?? {}),
          profile: {
            ...currentState.settings.profile,
            ...(persistedState.settings?.profile ?? {}),
          },
        };
        return {
          ...currentState,
          ...persistedState,
          settings: mergedSettings,
        };
      },
      onRehydrateStorage: (state) => {
        const timeoutId = setTimeout(() => {
          try {
            const current = useSettingsStore.getState();
            if (current && current.isLoading) {
              console.warn(
                "Settings store hydration timed out. Forcing isLoading to false.",
              );

              Sentry.captureMessage(
                "Store hydration safety timeout fired",
                "warning",
              );

              current.setLoading();
            }
          } catch (e) {
            console.error("Error in settings store hydration timeout:", e);

            Sentry.captureException(e, {
              tags: { feature: "store_hydration" },
              extra: { phase: "timeout_callback" },
            });

            if (state) {
              state.setLoading();
            }
          }
        }, 2500);

        return (stateAfter, error) => {
          clearTimeout(timeoutId);
          if (error) {
            console.error("Error during settings store hydration:", error);

            Sentry.captureException(error, {
              tags: { feature: "store_hydration" },
              extra: { phase: "onRehydrateStorage_callback" },
            });
          }
          if (stateAfter) {
            stateAfter.updateSettings({});
            stateAfter.setLoading();
          } else if (state) {
            state.setLoading();
          }
        };
      },
    },
  ),
);
