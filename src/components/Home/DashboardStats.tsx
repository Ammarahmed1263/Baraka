import { Feather } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { AppText } from "@components/UI/AppText";
import ProgressRing from "@components/ProgressRing";
import { useTheme } from "@context/ThemeContext";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

interface DashboardStatsProps {
  completionRate: number;
  completedCount: number;
  totalActivities: number;
  ajr: {
    acts: number;
    total: number;
    avgNiyyahs: number;
  };
}

export default function DashboardStats({
  completionRate,
  completedCount,
  totalActivities,
  ajr,
}: DashboardStatsProps) {
  const { t } = useTranslation();
  const { colors: C, isDark } = useTheme();

  return (
    <View style={styles.statsRow}>
      {/* Today's Progress Box */}
      <View
        style={[
          styles.statCard,
          {
            backgroundColor: C.successLight,
            borderColor: C.border,
          },
        ]}
      >
        <ProgressRing
          percentage={completionRate}
          size={44}
          color={C.gold}
          strokeWidth={4}
        />
        <View style={styles.statInfo}>
          <AppText
            weight='Bold'
            variant='title'
            style={[styles.statValue, { color: isDark ? C.gold : C.text }]}
          >
            {Math.round(completionRate)}%
          </AppText>
          <AppText
            weight='Medium'
            variant='caption'
            style={[styles.statLabel, { color: C.textSecondary }]}
          >
            {t("dashboard.todayProgress")}
          </AppText>
          <AppText
            weight='Regular'
            variant='caption'
            style={{ color: isDark ? C.gold + "AA" : C.tint }}
          >
            {completedCount}/{totalActivities} {t("dashboard.done")}
          </AppText>
        </View>
      </View>

      {/* Ajr Multiplier Box */}
      <View
        style={[
          styles.statCard,
          {
            backgroundColor: C.goldLight,
            borderColor: C.gold,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: isDark ? C.gold + "22" : C.gold + "33" },
          ]}
        >
          <Feather name='zap' size={18} color={C.gold} />
        </View>
        <View style={styles.statInfo}>
          <AppText weight='Bold' variant='title' style={[styles.statValue, { color: C.gold }]}>
            ×{Math.round(ajr.total * 10) / 10}
          </AppText>
          <AppText
            weight='Medium'
            variant='caption'
            style={[styles.statLabel, { color: C.textSecondary }]}
          >
            {t("dashboard.ajrMultiplier")}
          </AppText>
          <AppText
            weight='Regular'
            variant='caption'
            style={{ color: isDark ? C.gold + "AA" : C.gold }}
          >
            +{ajr.acts} {t("dashboard.multiplierActs")}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  statInfo: {
    flex: 1,
    justifyContent: "center",
  },
  statValue: {
    lineHeight: 24,
    marginBottom: 1,
  },
  statLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
});
