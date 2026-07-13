/**
 * Standardizes any Date object to the app's YYYY-MM-DD format.
 */
export function toYMD(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Returns today's date in YYYY-MM-DD format.
 */
export function getTodayString(): string {
  return toYMD(new Date());
}
