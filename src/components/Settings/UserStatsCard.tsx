import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { AppText } from "@components/UI/AppText";
import { useTheme } from "@context/ThemeContext";

interface UserStatsCardProps {
  streak: number;
  totalCompleted: number;
  totalJournal: number;
}

export default function UserStatsCard({
  streak,
  totalCompleted,
  totalJournal,
}: UserStatsCardProps) {
  const { t } = useTranslation();
  const { colors: C, isDark } = useTheme();

  return (
    <LinearGradient
      colors={isDark ? ["#1A3326", "#0D2E1F"] : ["#2D7A4F", "#1A5C38"]}
      style={styles.statsCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Gold accent line */}
      <View style={[styles.accentLine, { backgroundColor: C.gold + "55" }]} />

      <AppText weight="Bold" style={[styles.statsTitle, { color: C.gold }]}>
        {t("settings.yourJourney")}
      </AppText>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <AppText weight="Bold" style={[styles.statValue, { color: C.gold }]}>
            {streak}
          </AppText>
          <AppText weight="Regular" style={styles.statLabel}>
            {t("settings.dayStreak")}
          </AppText>
        </View>
        <View style={[styles.statDivider, { backgroundColor: C.gold + "33" }]} />
        <View style={styles.statItem}>
          <AppText weight="Bold" style={[styles.statValue, { color: C.gold }]}>
            {totalCompleted}
          </AppText>
          <AppText weight="Regular" style={styles.statLabel}>
            {t("settings.totalRenewed")}
          </AppText>
        </View>
        <View style={[styles.statDivider, { backgroundColor: C.gold + "33" }]} />
        <View style={styles.statItem}>
          <AppText weight="Bold" style={[styles.statValue, { color: C.gold }]}>
            {totalJournal}
          </AppText>
          <AppText weight="Regular" style={styles.statLabel}>
            {t("settings.reflections")}
          </AppText>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 16,
    overflow: "hidden",
  },
  accentLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
  },
  statsTitle: { fontSize: 16 },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center", gap: 4 },
  statValue: { fontSize: 28 },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  statDivider: { width: 1 },
});
