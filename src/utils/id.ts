/**
 * Generates a unique ID string.
 * Uses a combination of timestamp and a random string.
 */
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

/**
 * Generates a custom activity ID with a prefix.
 */
export function generateCustomId(prefix: string = "custom"): string {
  return `${prefix}_${Date.now().toString()}_${Math.random().toString(36).substring(2, 7)}`;
}
