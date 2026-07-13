import { DailyLog } from "@types";

/**
 * Computes the current consecutive streak based on a list of logs.
 */
export function computeStreak(logs: DailyLog[]): number {
  if (logs.length === 0) return 0;

  const uniqueDates = Array.from(new Set(logs.map((l) => l.date)))
    .map((d) => {
      const [year, month, day] = d.split("-").map(Number);
      return new Date(year, month - 1, day);
    })
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  for (const date of uniqueDates) {
    const diffTime = todayMidnight.getTime() - date.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
