import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { HADITH_OPENER } from "@/constants/data";
import { useApp, type UserActivity } from "@/context/AppContext";
import NiyyahCard from "@/components/NiyyahCard";
import StreakBadge from "@/components/StreakBadge";
import ProgressRing from "@/components/ProgressRing";

export default function TodayScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const {
    activities,
    streak,
    settings,
    isCompletedToday,
    markComplete,
    unmarkComplete,
    getTodayCompletionRate,
    getAjrMultiplier,
  } = useApp();

  const lang = settings.language;
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
        await unmarkComplete(activity.id);
      } else {
        await markComplete(activity.id, activity.selectedNiyyahIds ?? []);
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
            <Text style={[styles.greeting, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {getDayGreeting()}
            </Text>
            <Text style={[styles.dayName, { color: C.text, fontFamily: "Inter_700Bold" }]}>
              {getDayName()}
            </Text>
          </View>
          <StreakBadge streak={streak} />
        </View>

        {/* Hadith Card */}
        <LinearGradient
          colors={isDark ? ["#1A3326", "#0D2E1F"] : ["#2D7A4F", "#1A5C38"]}
          style={styles.hadithCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.hadithDecor}>
            <Text style={styles.hadithDecorText}>❝</Text>
          </View>
          <Text style={[styles.hadithText, { fontFamily: "Inter_500Medium" }]}>
            {lang === "ar" ? HADITH_OPENER.ar : HADITH_OPENER.en}
          </Text>
          <Text style={[styles.hadithRef, { fontFamily: "Inter_400Regular" }]}>
            {HADITH_OPENER.ref}
          </Text>
        </LinearGradient>

        {/* Progress + Ajr Row */}
        <View style={styles.statsRow}>
          {/* Progress Section */}
          <View style={[styles.progressSection, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
            <ProgressRing percentage={completionRate} size={60} color={C.tint} />
            <View style={styles.progressText}>
              <Text style={[styles.progressTitle, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                {t("dashboard.todayNiyyah")}
              </Text>
              <Text style={[styles.progressSubtitle, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                {t("dashboard.renewedCount", { completed: completedCount, total: enabledActivities.length })}
              </Text>
            </View>
          </View>

          {/* Ajr Multiplier */}
          {ajr.acts > 0 && (
            <View style={[styles.ajrSection, { backgroundColor: C.gold + "18", borderColor: C.gold + "44" }]}>
              <Text style={[styles.ajrMultiplierNum, { color: C.gold, fontFamily: "Inter_700Bold" }]}>
                ×{Math.round(ajr.total * 10) / 10}
              </Text>
              <Text style={[styles.ajrLabel, { color: C.gold, fontFamily: "Inter_500Medium" }]}>
                {t("dashboard.ajrMultiplier")}
              </Text>
              <Text style={[styles.ajrSub, { color: C.gold + "BB", fontFamily: "Inter_400Regular" }]}>
                {t("dashboard.ajrSub", { acts: ajr.acts, avg: ajr.avgNiyyahs })}
              </Text>
            </View>
          )}
        </View>

        {/* Activities */}
        <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
          {t("dashboard.yourIntentions")}
        </Text>

        {enabledActivities.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
            <Feather name="plus-circle" size={32} color={C.tintLight} />
            <Text style={[styles.emptyText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {t("dashboard.emptyActivities")}
            </Text>
            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: C.tint }]}
              onPress={() => router.push("/(tabs)/reminders")}
            >
              <Text style={[styles.emptyButtonText, { fontFamily: "Inter_600SemiBold" }]}>
                {t("dashboard.addActivities")}
              </Text>
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
              language={lang}
            />
          ))
        )}

        {/* Ajr explanation footer */}
        {ajr.acts > 0 && (
          <View style={[styles.ajrFooter, { borderColor: C.border }]}>
            <Feather name="info" size={13} color={C.textMuted} />
            <Text style={[styles.ajrFooterText, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
              {t("dashboard.ajrFooter")}
            </Text>
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
  greeting: { fontSize: 14, marginBottom: 2 },
  dayName: { fontSize: 20 },
  hadithCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    overflow: "hidden",
  },
  hadithDecor: { marginBottom: 8 },
  hadithDecorText: { fontSize: 28, color: "rgba(255,255,255,0.3)" },
  hadithText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.95)",
    lineHeight: 24,
    fontStyle: "italic",
    marginBottom: 10,
  },
  hadithRef: { fontSize: 12, color: "rgba(255,255,255,0.65)" },
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
