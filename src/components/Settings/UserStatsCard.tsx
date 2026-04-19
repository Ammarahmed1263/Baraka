import { View, StyleSheet, useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { AppText } from "@components/UI/AppText";

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
  const isDark = useColorScheme() === "dark";

  return (
    <LinearGradient
      colors={isDark ? ["#1A3326", "#0D2E1F"] : ["#2D7A4F", "#1A5C38"]}
      style={styles.statsCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <AppText weight="Bold" style={styles.statsTitle}>
        {t("settings.yourJourney")}
      </AppText>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <AppText weight="Bold" style={styles.statValue}>
            {streak}
          </AppText>
          <AppText weight="Regular" style={styles.statLabel}>
            {t("settings.dayStreak")}
          </AppText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <AppText weight="Bold" style={styles.statValue}>
            {totalCompleted}
          </AppText>
          <AppText weight="Regular" style={styles.statLabel}>
            {t("settings.totalRenewed")}
          </AppText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <AppText weight="Bold" style={styles.statValue}>
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
  statsCard: { borderRadius: 16, padding: 20, marginBottom: 24, gap: 16 },
  statsTitle: { fontSize: 16, color: "rgba(255,255,255,0.85)" },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center", gap: 4 },
  statValue: { fontSize: 28, color: "#FFF" },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },
});

