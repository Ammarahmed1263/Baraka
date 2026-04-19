import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useCallback } from "react";
  import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@constants/colors";
import { type UserActivity } from "@types";
import { useActivitiesStore, useLogsStore } from "@store";
import { useTodayLogs } from "@hooks/useTodayLogs";
import { useActivityStats } from "@hooks/useActivityStats";
import { useLanguage } from "@i18n";
import NiyyahCard from "@components/NiyyahCard";
import StreakBadge from "@components/StreakBadge";
import { AppText } from "@components/UI/AppText";
import HadithCard from "@components/Home/HadithCard";
import DashboardStats from "@components/Home/DashboardStats";

export default function TodayScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const activities = useActivitiesStore((s) => s.activities);
  const streak = useLogsStore((s) => s.streak);
  const markComplete = useLogsStore((s) => s.markComplete);
  const unmarkComplete = useLogsStore((s) => s.unmarkComplete);
  
  const { isCompletedToday } = useTodayLogs();
  const { getTodayCompletionRate, getAjrMultiplier } = useActivityStats();

  const { language: lang } = useLanguage();
  const enabledActivities = activities.filter((a) => a.enabled);
  const completionRate = getTodayCompletionRate();
  const ajr = getAjrMultiplier();

  const getDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard.greeting.morning");
    if (hour < 17) return t("dashboard.greeting.afternoon");
    return t("dashboard.greeting.evening");
  };

  const getDayName = () => {
    return new Date().toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const handleToggle = useCallback(
    async (activity: UserActivity) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (isCompletedToday(activity.id)) {
        unmarkComplete(activity.id);
      } else {
        markComplete(activity.id, activity.selectedNiyyahIds ?? []);
      }
    },
    [isCompletedToday, markComplete, unmarkComplete]
  );

  const handleCardPress = useCallback((activity: UserActivity) => {
    router.push({ pathname: "/activity/[id]", params: { id: activity.id } });
  }, []);

  const topPadding = isWeb ? 67 : insets.top;
  const completedCount = enabledActivities.filter((a) => isCompletedToday(a.id)).length;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding + 16, paddingBottom: isWeb ? 34 + 84 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <AppText weight="Medium" style={[styles.greeting, { color: C.textSecondary }]}>
              {getDayGreeting()}
            </AppText>
          </View>
          <StreakBadge streak={streak} />
        </View>

        <AppText weight="Bold" style={[styles.dayName, { color: C.text, marginBottom: 16 }]}>
          {getDayName()}
        </AppText>

        {/* Hadith Card */}
        <HadithCard lang={lang} />

        {/* Progress + Ajr Row */}
        <DashboardStats
          completionRate={completionRate}
          completedCount={completedCount}
          totalActivities={enabledActivities.length}
          ajr={ajr}
        />

        {/* Activities */}
        <AppText weight="Bold" style={[styles.sectionTitle, { color: C.text }]}>
          {t("dashboard.yourIntentions")}
        </AppText>

        {enabledActivities.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
            <Feather name="plus-circle" size={32} color={C.tintLight} />
            <AppText weight="Regular" style={[styles.emptyText, { color: C.textSecondary }]}>
              {t("dashboard.emptyActivities")}
            </AppText>
            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: C.tint }]}
              onPress={() => router.push("/(tabs)/reminders")}
            >
              <AppText weight="Bold" style={styles.emptyButtonText}>
                {t("dashboard.addActivities")}
              </AppText>
            </TouchableOpacity>
          </View>
        ) : (
          enabledActivities.map((activity) => (
            <NiyyahCard
              key={activity.id}
              activity={activity}
              completed={isCompletedToday(activity.id)}
              onToggle={() => handleToggle(activity)}
              onPress={() => handleCardPress(activity)}
            />
          ))
        )}

        {/* Ajr explanation footer */}
        {ajr.acts > 0 && (
          <View style={[styles.ajrFooter, { borderColor: C.border }]}>
            <Feather name="info" size={13} color={C.textMuted} />
            <AppText weight="Regular" style={[styles.ajrFooterText, { color: C.textMuted }]}>
              {t("dashboard.ajrFooter")}
            </AppText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: { fontSize: 24, marginBottom: 2 },
  dayName: { fontSize: 20 },
  sectionTitle: { fontSize: 18, marginBottom: 12 },
  emptyState: {
    alignItems: "center",
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  emptyText: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  emptyButtonText: { color: "#FFF", fontSize: 15 },
  ajrFooter: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  ajrFooterText: { flex: 1, fontSize: 12, lineHeight: 16 },
});


