import { Feather } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { AppText } from "@components/UI/AppText";
import { useTheme } from "@context/ThemeContext";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

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
        shadowColor: C.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0 : 0.1,
        shadowRadius: 10,
        elevation: isDark ? 0 : 4,
      }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <AppText weight="Bold" variant='body' style={[styles.statsTitle, { color: C.gold }]}>
        {t("settings.yourJourney")}
      </AppText>

      <View style={styles.statsRow}>
        {/* Streak */}
        <View style={styles.statItem}>
          <View style={[styles.iconBox, { backgroundColor: C.backgroundSubtle }]}>
            <Feather name="zap" size={24} color={C.gold} />
          </View>
          <AppText weight="Bold" variant='titleLarge' style={[styles.statValue, { color: C.gold }]}>
            {streak}
          </AppText>
          <AppText weight="Regular" variant='caption' style={[styles.statLabel, { color: C.textSecondary }]}>
            {t("settings.stats.streak_label")}
          </AppText>
        </View>

        {/* Total Completed */}
        <View style={styles.statItem}>
          <View style={[styles.iconBox, { backgroundColor: C.backgroundSubtle }]}>
            <Feather name="check-circle" size={24} color={C.gold} />
          </View>
          <AppText weight="Bold" variant='titleLarge' style={[styles.statValue, { color: C.gold }]}>
            {totalCompleted}
          </AppText>
          <AppText weight="Regular" variant='caption' style={[styles.statLabel, { color: C.textSecondary }]}>
            {t("settings.stats.renewed_label")}
          </AppText>
        </View>

        {/* Journal Entries */}
        <View style={styles.statItem}>
          <View style={[styles.iconBox, { backgroundColor: C.backgroundSubtle }]}>
            <Feather name="book-open" size={24} color={C.gold} />
          </View>
          <AppText weight="Bold" variant='titleLarge' style={[styles.statValue, { color: C.gold }]}>
            {totalJournal}
          </AppText>
          <AppText weight="Regular" variant='caption' style={[styles.statLabel, { color: C.textSecondary }]}>
            {t("settings.stats.journal_label")}
          </AppText>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    gap: spacing.xl,
    overflow: "hidden",
  },
  statsTitle: {
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
    gap: spacing.xs,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  statValue: {
    lineHeight: 28,
  },
  statLabel: {
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
