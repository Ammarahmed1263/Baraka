import { format } from "date-fns";

export const DATE_FORMATS = {
  YMD: "yyyy-MM-dd",
  DISPLAY: "PPP",
  TIME: "HH:mm",
};

/**
 * Returns today's date in YYYY-MM-DD format.
 */
export function getTodayString(): string {
  return format(new Date(), DATE_FORMATS.YMD);
}

/**
 * Standardizes any Date object to the app's YYYY-MM-DD format.
 */
export function toYMD(date: Date): string {
  return format(date, DATE_FORMATS.YMD);
}
