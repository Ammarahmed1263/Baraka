import { Feather } from "@expo/vector-icons";
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
      colors={C.cardGradient}
      style={[styles.statsCard, {
        shadowColor: isDark ? "transparent" : "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0 : 0.08,
        shadowRadius: 4,
        elevation: isDark ? 0 : 2,
      }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <AppText weight="Bold" style={[styles.statsTitle, { color: C.gold }]}>
        {t("settings.yourJourney")}
      </AppText>

      <View style={styles.statsRow}>
        {/* Streak */}
        <View style={styles.statItem}>
          <View style={[styles.iconBox, { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : C.backgroundSubtle }]}>
            <Feather name="zap" size={24} color={C.gold} />
          </View>
          <AppText weight="Bold" style={[styles.statValue, { color: C.gold }]}>
            {streak}
          </AppText>
          <AppText weight="Regular" style={[styles.statLabel, { color: isDark ? "rgba(255,255,255,0.6)" : C.textSecondary }]}>
            {t("settings.stats.streak_label")}
          </AppText>
        </View>

        {/* Total Completed */}
        <View style={styles.statItem}>
          <View style={[styles.iconBox, { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : C.backgroundSubtle }]}>
            <Feather name="check-circle" size={24} color={C.gold} />
          </View>
          <AppText weight="Bold" style={[styles.statValue, { color: C.gold }]}>
            {totalCompleted}
          </AppText>
          <AppText weight="Regular" style={[styles.statLabel, { color: isDark ? "rgba(255,255,255,0.6)" : C.textSecondary }]}>
            {t("settings.stats.renewed_label")}
          </AppText>
        </View>

        {/* Journal Entries */}
        <View style={styles.statItem}>
          <View style={[styles.iconBox, { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : C.backgroundSubtle }]}>
            <Feather name="book-open" size={24} color={C.gold} />
          </View>
          <AppText weight="Bold" style={[styles.statValue, { color: C.gold }]}>
            {totalJournal}
          </AppText>
          <AppText weight="Regular" style={[styles.statLabel, { color: isDark ? "rgba(255,255,255,0.6)" : C.textSecondary }]}>
            {t("settings.stats.journal_label")}
          </AppText>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    gap: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  statsTitle: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.9,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    lineHeight: 28,
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
