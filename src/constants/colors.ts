// ------------------------------------------------------------
// GOLD (Reward / Ajr / Divine Opportunity)
// ------------------------------------------------------------

const gold50 = "#FCFAF5";
const gold100 = "#F7E8BA";
const gold300 = "#E8C45A";

const gold400 = "#D4AF37"; // Sacred reward gold
const gold500 = "#E5B83B"; // Main UI gold
const gold600 = "#E8A605"; // Hero titles / active states

const gold700 = "#B58104";
const gold900 = "#3B2900";

// ------------------------------------------------------------
// GREEN (Intentions / Action / Growth)
// ------------------------------------------------------------

const green50 = "#F4F8F5";
const green100 = "#D7EADF";
const green200 = "#B5D8C4";
const green300 = "#89C0A4";

const green400 = "#1C8A60";
const green500 = "#146F4D";
const green600 = "#0F5A3D";

const green700 = "#13271F";
const green800 = "#0E1D17";
const green900 = "#08110D";

// ------------------------------------------------------------
// WISDOM (Learning / Reflection / Hadith)
// ------------------------------------------------------------

const wisdom50 = "#EEF5F4";
const wisdom100 = "#D4E7E4";
const wisdom300 = "#8CB6AF";

const wisdom500 = "#4D7770";
const wisdom700 = "#34554F";

// ------------------------------------------------------------
// NEUTRALS
// ------------------------------------------------------------

const neutral50 = "#F5F6F7";
const neutral100 = "#E8EAEC";

const neutral400 = "#9AA0A6";
const neutral700 = "#5F6670";

const neutral900 = "#1B1C1D";

// ------------------------------------------------------------
// CATEGORY COLORS
// Muted heritage-inspired palette
// ------------------------------------------------------------

export const categoryColors = {
  Foundations: gold400,
  Knowledge: wisdom500,
  Work: "#4F6F9A",
  Family: "#A56A4B",
  Health: "#6D8A52",
  Worship: green500,
};

// ============================================================
// THEME
// ============================================================

export default {
  light: {
    // --------------------------------------------------------
    // TEXT
    // --------------------------------------------------------

    text: neutral900,
    textSecondary: neutral700,
    textMuted: neutral400,

    textOnTint: "#FFFFFF",

    // --------------------------------------------------------
    // BACKGROUNDS
    // --------------------------------------------------------

    background: gold50,
    backgroundCard: "#FFFFFF",
    backgroundSubtle: green50,

    // --------------------------------------------------------
    // BRAND (Green always = Action)
    // --------------------------------------------------------

    tint: green500,
    tintLight: green400,
    tintDark: green600,

    // --------------------------------------------------------
    // GOLD (Reward)
    // --------------------------------------------------------

    gold: gold600,
    goldLight: gold100,
    reward: gold400,

    // --------------------------------------------------------
    // WISDOM
    // --------------------------------------------------------

    wisdom: wisdom500,
    wisdomLight: wisdom100,
    wisdomSubtle: wisdom50,

    // --------------------------------------------------------
    // STRUCTURE
    // --------------------------------------------------------

    border: green100,
    borderLight: green50,

    headerBg: gold50,

    shadowColor: "#000000",

    // --------------------------------------------------------
    // SEMANTIC
    // --------------------------------------------------------

    error: "#DC2626",

    streak: gold400,
    successLight: green50,

    // --------------------------------------------------------
    // TABS / ICONS
    // --------------------------------------------------------

    tabIconDefault: neutral400,

    // --------------------------------------------------------
    // ACCENTS
    // --------------------------------------------------------

    accent: green500,
    accentGold: gold600,
    accentWisdom: wisdom500,

    accentLight: green100,
    accentSubtle: green50,
  },

  dark: {
    // --------------------------------------------------------
    // TEXT
    // --------------------------------------------------------

    text: neutral50,

    // Cleaner than green-tinted text
    textSecondary: "#C6CFCA",
    textMuted: "#88938D",

    // Gold button text
    textOnTint: neutral900,

    // --------------------------------------------------------
    // BACKGROUNDS
    // Emerald sanctuary feeling
    // --------------------------------------------------------

    background: "#0D1511",
    backgroundCard: "#112019",
    backgroundSubtle: "#173126",

    // --------------------------------------------------------
    // BRAND
    // Green still means action
    // --------------------------------------------------------

    tint: green400,
    tintLight: green300,
    tintDark: green500,

    // --------------------------------------------------------
    // GOLD
    // --------------------------------------------------------

    gold: gold400,
    goldLight: gold900,
    reward: gold400,

    // --------------------------------------------------------
    // WISDOM
    // --------------------------------------------------------

    wisdom: wisdom300,
    wisdomLight: wisdom700,
    wisdomSubtle: wisdom700,

    // --------------------------------------------------------
    // STRUCTURE
    // --------------------------------------------------------

    border: "#1D3429",
    borderLight: green800,

    headerBg: "#0D1511",

    shadowColor: "#000000",

    // --------------------------------------------------------
    // SEMANTIC
    // --------------------------------------------------------

    error: "#E05252",

    streak: gold400,
    successLight: green700,

    // --------------------------------------------------------
    // TABS / ICONS
    // --------------------------------------------------------

    tabIconDefault: "#7D8D85",

    // --------------------------------------------------------
    // ACCENTS
    // --------------------------------------------------------

    accent: green400,
    accentGold: gold400,
    accentWisdom: wisdom500,

    accentLight: green500,
    accentSubtle: "#173126",
  },
};
