import DashboardStats from "@components/Home/DashboardStats";
import HadithCard from "@components/Home/HadithCard";
import NiyyahCard from "@components/NiyyahCard";
import StreakBadge from "@components/StreakBadge";
import { AppButton } from "@components/UI/AppButton";
import { AppText } from "@components/UI/AppText";
import { useTheme } from "@context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { useActivityStats } from "@hooks/useActivityStats";
import { useTodayLogs } from "@hooks/useTodayLogs";
import { useLanguage } from "@i18n";
import { useActivitiesStore, useLogsStore } from "@store";
import { type UserActivity } from "@types";
import { Haptic } from "@utils/haptics";
import { router } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TodayScreen() {
  const { t } = useTranslation();
  const { colors: C } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const activities = useActivitiesStore((s) => s.activities);
  // const [loading, setLoading] = useState(false);

  // TODO: re-enable when data source changes to API/Realm
  // useEffect(() => {
  //   const timer = setTimeout(() => setLoading(false), 800);
  //   return () => clearTimeout(timer);
  // }, []);

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
      await Haptic.selection();
      if (isCompletedToday(activity.id)) {
        unmarkComplete(activity.id);
      } else {
        markComplete(activity.id, activity.selectedNiyyahIds ?? []);
      }
    },
    [isCompletedToday, markComplete, unmarkComplete],
  );

  const handleCardPress = useCallback((activity: UserActivity) => {
    router.push({ pathname: "/activity/[id]", params: { id: activity.id } });
  }, []);

  const topPadding = isWeb ? 67 : insets.top;
  const completedCount = enabledActivities.filter((a) =>
    isCompletedToday(a.id),
  ).length;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding + 16, paddingBottom: isWeb ? 34 + 84 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero Area */}
        <View style={styles.heroArea}>
          <View style={styles.header}>
            <View style={styles.greetingContainer}>
              <AppText
                weight='Medium'
                style={[styles.greeting, { color: C.gold }]}
              >
                {getDayGreeting()}
              </AppText>
            </View>
            <StreakBadge streak={streak} />
          </View>

          <AppText weight='Bold' style={[styles.dayName, { color: C.text }]}>
            {getDayName()}
          </AppText>
        </View>

        {/* {loading ? (
          <>
            <Skeleton
              height={140}
              borderRadius={16}
              style={{ marginBottom: 16 }}
            />

            <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
              <Skeleton height={80} borderRadius={20} style={{ flex: 1 }} />
              <Skeleton height={80} borderRadius={20} style={{ flex: 1 }} />
            </View>

            <View style={styles.sectionHeader}>
              <AppText
                weight='Bold'
                style={[styles.sectionTitle, { color: C.gold }]}
              >
                {t("dashboard.yourIntentions")}
              </AppText>
            </View>

            <View style={{ gap: 12 }}>
              <Skeleton height={90} borderRadius={24} />
              <Skeleton height={90} borderRadius={24} />
              <Skeleton height={90} borderRadius={24} />
            </View>
          </>
        ) : ( */}
        <>
          <Animated.View entering={FadeInDown.duration(300)}>
            {/* Hadith Card */}
            <HadithCard />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(300).delay(50)}>
            {/* Progress + Ajr Row */}
            <DashboardStats
              completionRate={completionRate}
              completedCount={completedCount}
              totalActivities={enabledActivities.length}
              ajr={ajr}
            />
          </Animated.View>

          {/* Activities Section Header */}
          <View style={styles.sectionHeader}>
            <AppText
              weight='Bold'
              style={[styles.sectionTitle, { color: C.gold }]}
            >
              {t("dashboard.yourIntentions")}
            </AppText>
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
                  style={[styles.countBadgeText, { color: C.gold }]}
                >
                  {completedCount}/{enabledActivities.length}
                </AppText>
              </View>
            )}
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
                  style={[styles.emptyTitle, { color: C.text }]}
                >
                  {t("common.noActivities", "Ready to start?")}
                </AppText>
                <AppText
                  weight='Regular'
                  style={[styles.emptyText, { color: C.textSecondary }]}
                >
                  {t("dashboard.emptyActivities")}
                </AppText>
                <AppButton
                  variant='primary'
                  label={t("dashboard.addActivities")}
                  onPress={() => router.push("/(tabs)/reminders")}
                  style={{ marginTop: 20 }}
                />
              </View>
            </Animated.View>
          ) : (
            enabledActivities.map((activity, index) => (
              <Animated.View
                key={activity.id}
                entering={FadeInDown.delay(index * 50).duration(250)}
              >
                <NiyyahCard
                  activity={activity}
                  completed={isCompletedToday(activity.id)}
                  onToggle={() => handleToggle(activity)}
                  onPress={() => handleCardPress(activity)}
                />
              </Animated.View>
            ))
          )}
        </>
        {/* )} */}

        {/* Ajr explanation footer */}
        {ajr.acts > 0 && (
          <View style={[styles.ajrFooter, { borderColor: C.border }]}>
            <Feather name='info' size={13} color={C.textMuted} />
            <AppText
              weight='Regular'
              style={[styles.ajrFooterText, { color: C.textMuted }]}
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
  scrollContent: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heroArea: {
    marginBottom: 24,
    paddingTop: 8,
  },
  greetingContainer: { flex: 1 },
  greeting: { fontSize: 18 },
  dayName: { fontSize: 24, letterSpacing: -0.5 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20 },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  countBadgeText: { fontSize: 13 },
  emptyState: {
    alignItems: "center",
    padding: 40,
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
  },
  emptyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: { fontSize: 20 },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.8,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 8,
  },
  emptyButtonText: { color: "#FFF", fontSize: 16 },
  ajrFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  ajrFooterText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
