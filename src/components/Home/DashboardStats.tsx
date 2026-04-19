import { View, StyleSheet, useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";
import { AppText } from "@components/UI/AppText";
import ProgressRing from "@components/ProgressRing";
import Colors from "@constants/colors";

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;

  return (
    <View style={styles.statsRow}>
      {/* Progress Section */}
      <View
        style={[
          styles.progressSection,
          { backgroundColor: C.backgroundCard, borderColor: C.border },
        ]}
      >
        <ProgressRing percentage={completionRate} size={60} color={C.tint} />
        <View style={styles.progressText}>
          <AppText weight="Bold" style={[styles.progressTitle, { color: C.text }]}>
            {t("dashboard.todayNiyyah")}
          </AppText>
          <AppText
            weight="Regular"
            style={[styles.progressSubtitle, { color: C.textSecondary }]}
          >
            {t("dashboard.renewedCount", {
              completed: completedCount,
              total: totalActivities,
            })}
          </AppText>
        </View>
      </View>

      {/* Ajr Multiplier */}
      {ajr.acts > 0 && (
        <View
          style={[
            styles.ajrSection,
            { backgroundColor: C.gold + "18", borderColor: C.gold + "44" },
          ]}
        >
          <AppText weight="Bold" style={[styles.ajrMultiplierNum, { color: C.gold }]}>
            ×{Math.round(ajr.total * 10) / 10}
          </AppText>
          <AppText weight="Medium" style={[styles.ajrLabel, { color: C.gold }]}>
            {t("dashboard.ajrMultiplier")}
          </AppText>
          <AppText weight="Regular" style={[styles.ajrSub, { color: C.gold + "BB" }]}>
            {t("dashboard.ajrSub", { acts: ajr.acts, avg: ajr.avgNiyyahs })}
          </AppText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  progressSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  progressText: { flex: 1 },
  progressTitle: { fontSize: 15, marginBottom: 3 },
  progressSubtitle: { fontSize: 12, lineHeight: 16 },
  ajrSection: {
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 2,
  },
  ajrMultiplierNum: { fontSize: 22 },
  ajrLabel: { fontSize: 11, textAlign: "center" },
  ajrSub: { fontSize: 10, textAlign: "center" },
});


