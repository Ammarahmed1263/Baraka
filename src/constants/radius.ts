export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export type RadiusKey = keyof typeof radius;

export default radius;
