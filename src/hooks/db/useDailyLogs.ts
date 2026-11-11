import { useMemo } from "react";
import { db } from "@/db/db";
import { dailyLogs, dailyLogNiyyahs } from "@/db/schema";
import { computeStreak, computeStreakBreak } from "@utils/stats";
import { getTodayString } from "@utils/date";
import { useToday } from "@hooks/useToday";
import { useSafeLiveQuery } from "./useSafeLiveQuery";

export function useDailyLogs() {
  const logsQuery = useMemo(() => db.select().from(dailyLogs), []);
  const { data: allLogs, isLoading: logsLoading } = useSafeLiveQuery(
    logsQuery,
    [],
    "daily_logs",
  );

  const niyyahsQuery = useMemo(() => db.select().from(dailyLogNiyyahs), []);
  const { data: allNiyyahs, isLoading: niyyahsLoading } = useSafeLiveQuery(
    niyyahsQuery,
    [],
    "daily_log_niyyahs",
  );

  const logs = allLogs ?? [];
  const niyyahRows = allNiyyahs ?? [];
  const today = useToday();

  const isLoading = logsLoading || niyyahsLoading;

  const todayLogs = useMemo(
    () => logs.filter((l) => l.date === today),
    [logs, today],
  );

  const isCompletedToday = (activityId: string) =>
    todayLogs.some((l) => l.activityId === activityId);

  const getTodayLogForActivity = (activityId: string) =>
    todayLogs.find((l) => l.activityId === activityId);

  const getTodayNiyyahIds = (activityId: string): string[] => {
    const log = todayLogs.find((l) => l.activityId === activityId);
    if (!log) return [];
    return niyyahRows
      .filter((n) => n.dailyLogId === log.id)
      .map((n) => n.niyyahId);
  };

  const streak = useMemo(() => computeStreak(logs, today), [logs, today]);

  const getTodayAjrMultiplier = (enabledActivityIds: Set<string>) => {
    const eligibleLogs = todayLogs.filter((log) =>
      enabledActivityIds.has(log.activityId),
    );
    const acts = eligibleLogs.length;
    if (acts === 0) return { acts: 0, avgNiyyahs: 0, total: 0 };

    const totalNiyyahs = eligibleLogs.reduce((sum, log) => {
      const count = niyyahRows.filter((n) => n.dailyLogId === log.id).length;
      return sum + count + 1; // +1 for the core intention itself
    }, 0);

    const avgNiyyahs = Math.round((totalNiyyahs / acts) * 10) / 10;
    return { acts, avgNiyyahs, total: acts * avgNiyyahs };
  };

  return {
    logs,
    todayLogs,
    isCompletedToday,
    getTodayLogForActivity,
    getTodayNiyyahIds,
    streak,
    getTodayAjrMultiplier,
    isLoading,
  };
}

/** Reads fresh from the DB (not a live query) so it is safe to call from a foreground handler. */
export async function getStreakBreakState() {
  const logs = await db.select({ date: dailyLogs.date }).from(dailyLogs);
  return computeStreakBreak(logs, getTodayString());
}

export async function getFreshDailyLogState() {
  const logs = await db.select().from(dailyLogs);
  const today = getTodayString();
  return {
    streak: computeStreak(logs, today),
    completedSomethingToday: logs.some((l) => l.date === today),
  };
}
