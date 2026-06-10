import { Feather } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { AppText } from "@components/UI/AppText";
import ProgressRing from "@components/ProgressRing";
import { useTheme } from "@context/ThemeContext";

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
            backgroundColor: isDark ? "#0D2E1F" : "#F0FDF4",
            borderColor: isDark ? C.gold + "33" : C.tint + "22",
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
            style={[styles.statValue, { color: isDark ? C.gold : C.text }]}
          >
            {Math.round(completionRate)}%
          </AppText>
          <AppText
            weight='Medium'
            style={[styles.statLabel, { color: C.textSecondary }]}
          >
            {t("dashboard.todayProgress")}
          </AppText>
          <AppText
            weight='Regular'
            style={[styles.statDetail, { color: isDark ? C.gold + "AA" : C.tint }]}
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
            backgroundColor: isDark ? "#2D2610" : "#FFFBEB",
            borderColor: C.gold + "33",
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
          <AppText weight='Bold' style={[styles.statValue, { color: C.gold }]}>
            ×{Math.round(ajr.total * 10) / 10}
          </AppText>
          <AppText
            weight='Medium'
            style={[styles.statLabel, { color: C.textSecondary }]}
          >
            {t("dashboard.ajrMultiplier")}
          </AppText>
          <AppText
            weight='Regular'
            style={[styles.statDetail, { color: isDark ? C.gold + "AA" : C.gold }]}
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
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    // elevation: 2,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statInfo: {
    flex: 1,
    justifyContent: "center",
  },
  statValue: {
    fontSize: 18,
    lineHeight: 22,
    marginBottom: 1,
  },
  statLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statDetail: {
    fontSize: 10,
    fontWeight: "500",
  },
});
