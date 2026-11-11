import type { LengthBucket } from "@types";

/**
 * Buckets user-written text by length so analytics never sees the text itself.
 *
 *   short:  <= 60   terser than anything we ship
 *   medium: 61-140  in the range of the built-in text
 *   long:   > 140   longer than every built-in sub-intention
 */
export const SHORT_MAX = 60;
export const MEDIUM_MAX = 140;

export function getLengthBucket(text: string): LengthBucket {
  const length = [...text.trim()].length;
  if (length <= SHORT_MAX) return "short";
  if (length <= MEDIUM_MAX) return "medium";
  return "long";
}
