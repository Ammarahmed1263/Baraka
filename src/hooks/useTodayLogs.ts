import { useMemo } from "react";
import { format } from "date-fns";
import { useLogsStore } from "@store/logsStore";

export function useTodayLogs() {
  const dailyLogs = useLogsStore((s) => s.dailyLogs);
  const today = format(new Date(), "yyyy-MM-dd");

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

