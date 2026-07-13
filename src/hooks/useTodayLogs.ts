import { useMemo } from "react";
import { useLogsStore } from "@store/logsStore";
import { getTodayString } from "@utils/date";

export function useTodayLogs() {
  const dailyLogs = useLogsStore((s) => s.dailyLogs);
  const today = getTodayString();

  const todayLogs = useMemo(
    () => dailyLogs.filter((l) => l.date === today),
    [dailyLogs, today]
  );

  const isCompletedToday = (activityId: string) =>
    todayLogs.some((l) => l.activityId === activityId);

  const getTodayLogForActivity = (activityId: string) =>
    todayLogs.find((l) => l.activityId === activityId);

  return { todayLogs, isCompletedToday, getTodayLogForActivity };
}

