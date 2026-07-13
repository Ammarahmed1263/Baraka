import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { storageAdapter } from "@lib/storage";
import type { DailyLog } from "@types";

import { generateId } from "@utils/id";
import { getTodayString, toYMD } from "@utils/date";
import { computeStreak } from "@utils/stats";

type LogsStore = {
  dailyLogs: DailyLog[];
  streak: number;
  markComplete: (activityId: string, niyyahIds?: string[]) => string;
  unmarkComplete: (activityId: string) => void;
  getStreakForActivity: (activityId: string) => number;
};

export const useLogsStore = create<LogsStore>()(
  persist(
    (set, get) => ({
      dailyLogs: [],
      streak: 0,

      markComplete: (activityId, selectedNiyyahIds = []) => {
        const logId = generateId();
        const newLog: DailyLog = {
          id: logId,
          activityId,
          date: getTodayString(),
          completedAt: new Date().toISOString(),
          selectedNiyyahIds,
        };
        const updated = [...get().dailyLogs, newLog];
        set({ dailyLogs: updated, streak: computeStreak(updated) });
        return logId;
      },

      unmarkComplete: (activityId) => {
        const updated = get().dailyLogs.filter(
          (l) => !(l.activityId === activityId && l.date === getTodayString())
        );
        set({ dailyLogs: updated, streak: computeStreak(updated) });
      },

      getStreakForActivity: (activityId) => {
        const { dailyLogs } = get();
        let count = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = toYMD(date);
          if (dailyLogs.some((l) => l.activityId === activityId && l.date === dateStr)) count++;
          else if (i > 0) break;
        }
        return count;
      },
    }),
    {
      name: "@niyyah_daily_logs",
      storage: createJSONStorage(() => storageAdapter),
    }
  )
);

