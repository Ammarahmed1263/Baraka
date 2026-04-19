import { useActivitiesStore } from "@store/activitiesStore";
import { useTodayLogs } from "./useTodayLogs";

export function useActivityStats() {
  const activities = useActivitiesStore((s) => s.activities);
  const { todayLogs, isCompletedToday } = useTodayLogs();

  const getTodayCompletionRate = () => {
    const enabled = activities.filter((a) => a.enabled);
    if (enabled.length === 0) return 0;
    const completed = enabled.filter((a) => isCompletedToday(a.id)).length;
    return Math.round((completed / enabled.length) * 100);
  };

  const getAjrMultiplier = () => {
    const acts = todayLogs.length;
    if (acts === 0) return { acts: 0, avgNiyyahs: 0, total: 0 };
    const totalNiyyahs = todayLogs.reduce(
      (sum, l) => sum + Math.max(1, (l.selectedNiyyahIds ?? []).length),
      0
    );
    const avgNiyyahs = Math.round((totalNiyyahs / acts) * 10) / 10;
    return { acts, avgNiyyahs, total: acts * avgNiyyahs };
  };

  return { getTodayCompletionRate, getAjrMultiplier };
}

