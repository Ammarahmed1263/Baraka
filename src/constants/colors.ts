const emerald = "#2D7A4F";
const emeraldLight = "#3DA066";
const gold = "#C9A84C";
const goldLight = "#E8C96A";

export default {
  light: {
    // Text
    text: "#1A1A2E",
    textSecondary: "#4A5568",
    textMuted: "#9CA3AF",

    // Backgrounds
    background: "#F8FAF9",
    backgroundCard: "#FFFFFF",
    backgroundSubtle: "#EDF2EE",

    // Brand
    tint: emerald,                 // primary interactive
    tintLight: emeraldLight,       // hover/active states
    tintDark: "#1A5C38",
    gold: gold,                    // headers, milestones
    goldLight: "#FEF3C7",          // gold backgrounds/badges

    // UI semantic mappings
    border: "#E2E8E4",
    borderLight: "#F0F4F1",
    headerBg: "#FFFFFF",
    shadowColor: "#000000",
    error: "#DC2626",
    streak: "#F59E0B",
    successLight: "#D1FAE5",      // emerald + 10%
    tabIconDefault: "#9CA3AF",
  },
  dark: {
    text: "#F0F4F1",
    textSecondary: "#A8B5AD",
    textMuted: "#6B7A72",

    background: "#0D1F17",
    backgroundCard: "#1A3326",
    backgroundSubtle: "#142B1E",

    tint: emeraldLight,
    tintLight: "#5ACC8A",
    tintDark: emerald,
    gold: goldLight,
    goldLight: "#2D2000",

    border: "#243D30",
    borderLight: "#1A3326",
    headerBg: "#0D1F17",
    shadowColor: "#000000",
    error: "#d50c0c",
    streak: "#F59E0B",
    successLight: "#0D2E1F",
    tabIconDefault: "#6B7A72",
  },
};
