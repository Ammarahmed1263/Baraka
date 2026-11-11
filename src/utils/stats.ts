/**
 * Computes streak from logs. `today` is passed explicitly to enforce dependency tracking in memoized callers.
 */
export function computeStreak(
  logs: { date: string }[],
  today: string,
): number {
  if (!today || !logs || logs.length === 0) return 0;

  const validDates = logs
    .map((l) => l?.date)
    .filter((d): d is string => typeof d === "string" && d.includes("-"));

  if (validDates.length === 0) return 0;

  const uniqueDates = Array.from(new Set(validDates))
    .map((d) => {
      const [year, month, day] = d.split("-").map(Number);
      return new Date(year, month - 1, day);
    })
    .sort((a, b) => b.getTime() - a.getTime());

  const [ty, tm, td] = today.split("-").map(Number);
  if (isNaN(ty) || isNaN(tm) || isNaN(td)) return 0;

  const todayMidnight = new Date(ty, tm - 1, td);

  const diffDaysFor = (date: Date) =>
    Math.round(
      (todayMidnight.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

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

export type StreakBreak = {
  lastLogDate: string;
  previousLength: number;
};

/** Detects a broken streak when computeStreak drops to 0; returns last log date and lost streak length. */
export function computeStreakBreak(
  logs: { date: string }[],
  today: string,
): StreakBreak | null {
  if (!today || !logs || logs.length === 0) return null;
  if (computeStreak(logs, today) > 0) return null;

  const lastLogDate = logs
    .map((l) => l?.date)
    .filter((d): d is string => typeof d === "string" && d.includes("-"))
    .sort()
    .pop();
  if (!lastLogDate) return null;

  const previousLength = computeStreak(logs, lastLogDate);
  if (previousLength < 1) return null;

  return { lastLogDate, previousLength };
}
