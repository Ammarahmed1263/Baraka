import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_ACTIVITIES } from "@data/activities";
import type { UserActivity } from "@types";

type ActivitiesStore = {
  activities: UserActivity[];
  toggleActivity: (activityId: string) => void;
  addCustomActivity: (activity: Omit<UserActivity, "enabled">) => void;
  updateActivity: (activityId: string, updates: Partial<UserActivity>) => void;
};

const DEFAULT_USER_ACTIVITIES: UserActivity[] = DEFAULT_ACTIVITIES.map((a) => ({
  ...a,
  enabled: ["fajr", "breakfast", "work", "maghrib", "isha"].includes(a.id),
  selectedNiyyahIds: [],
}));

export const useActivitiesStore = create<ActivitiesStore>()(
  persist(
    (set) => ({
      activities: DEFAULT_USER_ACTIVITIES,

      toggleActivity: (activityId) =>
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === activityId ? { ...a, enabled: !a.enabled } : a
          ),
        })),

      addCustomActivity: (activity) =>
        set((state) => ({
          activities: [
            ...state.activities,
            { ...activity, enabled: true, selectedNiyyahIds: [] },
          ],
        })),

      updateActivity: (activityId, updates) =>
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === activityId ? { ...a, ...updates } : a
          ),
        })),
    }),
    {
      name: "@niyyah_activities",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

