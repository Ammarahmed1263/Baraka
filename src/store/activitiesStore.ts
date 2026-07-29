import * as Sentry from "@sentry/react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { storageAdapter } from "@lib/storage";
import { DEFAULT_ACTIVITIES } from "@data/activities";
import { useLogsStore } from "./logsStore";
import type { UserActivity } from "@types";

type ActivitiesStore = {
  activities: UserActivity[];
  toggleActivity: (activityId: string) => void;
  addCustomActivity: (activity: Omit<UserActivity, "enabled">) => void;
  updateActivity: (activityId: string, updates: Partial<UserActivity>) => void;
  deleteCustomNiyyahOption: (activityId: string, optionId: string) => void;
  resetDailySelections: () => void;
};

const DEFAULT_ENABLED_IDS = ["fajr", "eating", "work", "maghrib", "isha"];

const DEFAULT_USER_ACTIVITIES: UserActivity[] = DEFAULT_ACTIVITIES.map((a) => ({
  ...a,
  enabled: DEFAULT_ENABLED_IDS.includes(a.id),
  selectedNiyyahIds: [],
}));

export const useActivitiesStore = create<ActivitiesStore>()(
  persist(
    (set, get) => ({
      activities: DEFAULT_USER_ACTIVITIES,

      toggleActivity: (activityId) => {
        const currentActivity = get().activities.find((a) => a.id === activityId);
        const isDisabling = currentActivity?.enabled === true;

        if (currentActivity) {
          Sentry.addBreadcrumb({
            category: "store",
            message: "Activity toggled",
            data: { activityId, enabled: !currentActivity.enabled },
            level: "info",
          });
        }

        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === activityId
              ? {
                  ...a,
                  enabled: !a.enabled,
                  ...(isDisabling ? { selectedNiyyahIds: [] } : {}),
                }
              : a
          ),
        }));

        if (isDisabling) {
          useLogsStore.getState().unmarkComplete(activityId);
        }
      },

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

      deleteCustomNiyyahOption: (activityId, optionId) =>
        set((state) => ({
          activities: state.activities.map((a) => {
            if (a.id !== activityId) return a;
            return {
              ...a,
              customNiyyahOptions: (a.customNiyyahOptions || []).filter(
                (o) => o.id !== optionId,
              ),
              // A deleted option can't stay selected either, on today's
              // pending choice or on a saved selection.
              selectedNiyyahIds: (a.selectedNiyyahIds || []).filter(
                (id) => id !== optionId,
              ),
            };
          }),
        })),

      // Temporary patch — same underlying flaw as the disable-reset patch
      // above: a day's pending niyyah selection lives as a durable property
      // on UserActivity instead of a dated record, so nothing ever clears it
      // when the calendar day rolls over (only markComplete/unmarkComplete's
      // *completion* state is date-derived via useTodayLogs). Called once a
      // day boundary is detected (see resetDailySelectionsIfNewDay in
      // useDayChange.ts) to clear every activity's pending selection so
      // yesterday's choices don't silently carry into today.
      resetDailySelections: () =>
        set((state) => ({
          activities: state.activities.map((a) =>
            (a.selectedNiyyahIds ?? []).length > 0
              ? { ...a, selectedNiyyahIds: [] }
              : a
          ),
        })),
    }),
    {
      name: "@niyyah_activities",
      storage: createJSONStorage(() => storageAdapter),
      // Reconciles a previously-saved activity list against the CURRENT
      // content (DEFAULT_ACTIVITIES) on every load, instead of trusting the
      // saved list verbatim. Without this, any content change — a renamed
      // id (breakfast -> eating), a newly added activity (cooking), a
      // reworded niyyah — never reaches devices that already have data
      // saved, because persisted state simply overwrites the new defaults.
      merge: (persistedState: any, currentState) => {
        const persistedActivities: UserActivity[] =
          persistedState?.activities ?? [];
        const builtinIds = new Set(DEFAULT_ACTIVITIES.map((a) => a.id));
        const persistedById = new Map(
          persistedActivities.map((a) => [a.id, a]),
        );

        // Built-in activities always come from the current content (name,
        // niyyah text, hadith ref, category, default time), but carry over
        // whatever the user actually did (enabled, custom time/niyyah,
        // selections, custom sub-options) if that id still exists.
        const reconciledBuiltins: UserActivity[] = DEFAULT_ACTIVITIES.map(
          (a) => {
            const prior = persistedById.get(a.id);
            return {
              ...a,
              enabled: prior?.enabled ?? DEFAULT_ENABLED_IDS.includes(a.id),
              customTime: prior?.customTime,
              customNiyyah: prior?.customNiyyah,
              selectedNiyyahIds: prior?.selectedNiyyahIds ?? [],
              customNiyyahOptions: prior?.customNiyyahOptions,
            };
          },
        );

        // Anything persisted whose id ISN'T one of the current built-ins is
        // either a genuine user-added custom activity, or a stale built-in
        // that was since renamed/removed from content (e.g. the old
        // "breakfast"/"lunch"/"dinner" ids). Real custom activities always
        // carry the "custom_" id prefix from generateCustomId() (see
        // AddActivityForm); anything else is dropped rather than silently
        // resurrected as a phantom activity.
        const customActivities = persistedActivities.filter(
          (a) => !builtinIds.has(a.id) && a.id.startsWith("custom_"),
        );

        return {
          ...currentState,
          activities: [...reconciledBuiltins, ...customActivities],
        };
      },
    }
  )
);

