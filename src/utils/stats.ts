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

  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const diffDaysFor = (date: Date) =>
    Math.round((todayMidnight.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  const mostRecentDiff = diffDaysFor(uniqueDates[0]);

  if (mostRecentDiff > 1) return 0;

  let streak = 0;
  let expectedDiff = mostRecentDiff;
  for (const date of uniqueDates) {
    const diffDays = diffDaysFor(date);
    if (diffDays === expectedDiff) {
      streak++;
      expectedDiff++;
    } else {
      break;
    }
  }

  return streak;
}
