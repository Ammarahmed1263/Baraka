/**
 * Turns expo-router segments into a route pattern for analytics, dropping group
 * segments like "(tabs)". Segments hold the pattern ("[id]"), never the resolved
 * value, so ["activity", "[id]"] becomes "/activity/[id]".
 */
export function getRoutePattern(segments: readonly string[]): string {
  return "/" + segments.filter((s) => !s.startsWith("(")).join("/");
}
