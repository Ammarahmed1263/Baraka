import { differenceInCalendarDays, parse } from "date-fns";
import { DailyLog } from "@types";
import { DATE_FORMATS } from "./date";

/**
 * Computes the current consecutive streak based on a list of logs.
 */
export function computeStreak(logs: DailyLog[]): number {
  if (logs.length === 0) return 0;

  const uniqueDates = Array.from(new Set(logs.map((l) => l.date)))
    .map((d) => parse(d, DATE_FORMATS.YMD, new Date()))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  const today = new Date();

  for (const date of uniqueDates) {
    // If the gap between today and the log date matches the current streak count,
    // it means the streak is unbroken up to this point.
    if (differenceInCalendarDays(today, date) === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
