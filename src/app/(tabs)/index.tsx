import { evaluateStreakRisk } from "@/services/notifications";
import { getCategoryLabel } from "@components/Activities/CategorySection";
import DashboardStats from "@components/Home/DashboardStats";
import HadithCard from "@components/Home/HadithCard";
import NiyyahCard from "@components/NiyyahCard";
import StreakBadge from "@components/StreakBadge";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppButton } from "@components/UI/AppButton";
import { AppText } from "@components/UI/AppText";
import { ChipSelector } from "@components/UI/ChipSelector";
import { radius } from "@constants/radius";
import { spacing } from "@constants/spacing";
import { useTheme } from "@context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { useActivityStats } from "@hooks/useActivityStats";
import { useTodayLogs } from "@hooks/useTodayLogs";
import { useLanguage } from "@i18n";
import { useActivitiesStore, useLogsStore, useSettingsStore } from "@store";
import { type UserActivity } from "@types";
import { getTodayString } from "@utils/date";
import { Haptic } from "@utils/haptics";
import { parseReminderTime } from "@utils/parseReminderTime";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TodayScreen() {
  const { t } = useTranslation();
  const { colors: C, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const activities = useActivitiesStore((s) => s.activities);
  const updateActivity = useActivitiesStore((s) => s.updateActivity);

  const streak = useLogsStore((s) => s.streak);
  const markComplete = useLogsStore((s) => s.markComplete);
  const unmarkComplete = useLogsStore((s) => s.unmarkComplete);
  const notificationsEnabled = useSettingsStore(
    (s) => s.settings.notificationsEnabled,
  );

  const { isCompletedToday } = useTodayLogs();
  const { getTodayCompletionRate, getAjrMultiplier } = useActivityStats();

  const { language: lang } = useLanguage();

  const getActivityMinutes = (activity: UserActivity): number | null => {
    const time = activity.customTime ?? activity.defaultTime;
    if (!time) return null;
    const { hour, minute } = parseReminderTime(time);
    return hour * 60 + minute;
  };

  const enabledActivities = activities
    .filter((a) => a.enabled)
    .slice()
    .sort((a, b) => {
      const aMin = getActivityMinutes(a);
      const bMin = getActivityMinutes(b);
      if (aMin === null && bMin === null) return 0;
      if (aMin === null) return 1;
      if (bMin === null) return -1;
      return aMin - bMin;
    });

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
      await Haptic.selection();
      if (isCompletedToday(activity.id)) {
        unmarkComplete(activity.id);
        updateActivity(activity.id, { selectedNiyyahIds: [] });
      } else {
        markComplete(activity.id, activity.selectedNiyyahIds ?? []);
      }

      const today = getTodayString();
      const completedSomethingToday = useLogsStore
        .getState()
        .dailyLogs.some((l) => l.date === today);
      evaluateStreakRisk({
        notificationsEnabled,
        streakCount: useLogsStore.getState().streak,
        completedSomethingToday,
        t,
      });
    },
    [
      isCompletedToday,
      markComplete,
      unmarkComplete,
      updateActivity,
      notificationsEnabled,
      t,
    ],
  );

  const handleCardPress = useCallback((activity: UserActivity) => {
    router.push({ pathname: "/activity/[id]", params: { id: activity.id } });
  }, []);

  const topPadding = isWeb ? 67 : insets.top;
  const completedCount = enabledActivities.filter((a) =>
    isCompletedToday(a.id),
  ).length;

  // User-controlled category filter, reusing the same taxonomy already
  // established in Manage Activities — nothing is ever hidden by default
  // ("all" shows every category, chronologically sorted). Completed
  // activities still render as compact rows wherever they appear, but
  // they're never pulled out of the flow based on category.
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const availableCategories = [
    ...new Set(enabledActivities.map((a) => a.category)),
  ];
  const filteredActivities = enabledActivities.filter(
    (activity) =>
      categoryFilter === "all" || activity.category === categoryFilter,
  );

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: topPadding + spacing.lg,
            paddingBottom: isWeb ? 34 + 84 : 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroArea}>
          <View style={styles.header}>
            <View style={styles.greetingContainer}>
              <AppText
                weight='Medium'
                variant='subtitle'
                style={{ color: C.gold }}
              >
                {getDayGreeting()}
              </AppText>
            </View>
            <StreakBadge streak={streak} />
          </View>

          <AppText
            weight='Bold'
            variant='titleLarge'
            style={[styles.dayName, { color: C.text }]}
          >
            {getDayName()}
          </AppText>
        </View>

        <Animated.View entering={FadeInDown.duration(300)}>
          <HadithCard />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(300).delay(50)}>
          <DashboardStats
            completionRate={completionRate}
            completedCount={completedCount}
            totalActivities={enabledActivities.length}
            ajr={ajr}
          />
        </Animated.View>

        <View style={styles.sectionHeader}>
          <AppText weight='Bold' variant='title' style={{ color: C.gold }}>
            {t("dashboard.yourIntentions")}
          </AppText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            {enabledActivities.length > 0 && (
              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: C.gold + "15",
                    borderColor: C.gold + "30",
                  },
                ]}
              >
                <AppText
                  weight='Bold'
                  variant='footnote'
                  style={{ color: C.gold }}
                >
                  {completedCount}/{enabledActivities.length}
                </AppText>
              </View>
            )}
            <AnimatedPressable
              accessibilityLabel={t("dashboard.manageActivitiesButton")}
              onPress={() => router.push("/manage-activities" as any)}
              style={{ padding: spacing.xs }}
            >
              <Feather name='sliders' size={20} color={C.textSecondary} />
            </AnimatedPressable>
          </View>
        </View>
        {enabledActivities.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(300).delay(100)}>
            <View
              style={[
                styles.emptyState,
                {
                  backgroundColor: C.backgroundCard,
                  borderColor: C.border,
                },
              ]}
            >
              <View
                style={[
                  styles.emptyIconContainer,
                  { backgroundColor: C.tint + "10" },
                ]}
              >
                <Feather name='plus-circle' size={38} color={C.tint} />
              </View>
              <AppText
                weight='Medium'
                variant='title'
                style={{ color: C.text }}
              >
                {t("common.noActivities", "Ready to start?")}
              </AppText>
              <AppText
                weight='Regular'
                variant='bodyLarge'
                style={[styles.emptyText, { color: C.textSecondary }]}
              >
                {t("dashboard.emptyActivities")}
              </AppText>
              <AppButton
                variant='primary'
                label={t("dashboard.addActivities")}
                onPress={() => router.push("/manage-activities" as any)}
                style={{ marginTop: spacing.xl }}
              />
            </View>
          </Animated.View>
        ) : (
          <>
            {availableCategories.length > 1 && (
              <ChipSelector
                items={[
                  { label: t("dashboard.filterAllCategories"), value: "all" },
                  ...availableCategories.map((cat) => ({
                    label: getCategoryLabel(cat, t),
                    value: cat,
                  })),
                ]}
                selectedValue={categoryFilter}
                onSelect={setCategoryFilter}
                style={styles.filterChips}
                contentContainerStyle={styles.filterChipsContent}
              />
            )}

            {filteredActivities.map((activity, index) => {
              const done = isCompletedToday(activity.id);
              return (
                <Animated.View
                  key={activity.id}
                  entering={FadeInDown.delay(index * 50).duration(250)}
                  exiting={FadeOut.duration(150)}
                  layout={LinearTransition.duration(250)}
                >
                  <NiyyahCard
                    activity={activity}
                    completed={done}
                    compact={done}
                    onToggle={() => handleToggle(activity)}
                    onPress={() => handleCardPress(activity)}
                  />
                </Animated.View>
              );
            })}
          </>
        )}

        {ajr.acts > 0 && (
          <View
            style={[
              styles.ajrFooter,
              {
                borderColor: C.border,
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.03)",
              },
            ]}
          >
            <Feather name='info' size={13} color={C.textMuted} />
            <AppText
              weight='Regular'
              variant='caption'
              style={{ flex: 1, color: C.textMuted }}
            >
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
  scrollContent: { paddingHorizontal: spacing.xl },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  heroArea: {
    marginBottom: spacing.xxl,
    paddingTop: spacing.sm,
  },
  greetingContainer: { flex: 1 },
  dayName: { letterSpacing: -0.5 },
  filterChips: {
    marginBottom: spacing.md,
    marginHorizontal: -spacing.xl, // must match scrollContent's paddingHorizontal exactly, or the chip row's resting position won't line up with the rest of the screen's content
  },
  filterChipsContent: {
    paddingHorizontal: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  countBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  emptyState: {
    alignItems: "center",
    padding: spacing.huge,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.lg,
  },
  emptyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.8,
  },
  ajrFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xxl,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
});
