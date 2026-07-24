import { useState, useCallback, useMemo } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { AppButton } from "@components/UI/AppButton";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useTheme } from "@context/ThemeContext";
import { AppText } from "@components/UI/AppText";
import { ActivityPickerCard } from "@components/onboarding/ActivityPickerCard";
import { useOnboarding } from "@hooks/useOnboarding";
import { useActivitiesStore } from "@store/activitiesStore";
import { DEFAULT_ACTIVITIES } from "@data/activities";
import { DEFAULT_ACTIVITY_IDS } from "@data/onboardingDefaults";
import { OnboardingDots } from "@components/onboarding/OnboardingDots";
import { ONBOARDING_SLIDES } from "@data/onboardingSlides";
import type { Activity } from "@types";
import { spacing } from "@constants/spacing";

const PRAYER_IDS = DEFAULT_ACTIVITY_IDS;
const MAX_OTHER_SELECTION = 5;

export default function ActivityPickerScreen() {
  const { colors: C } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { complete } = useOnboarding();

  const { prayerActivities, otherActivities } = useMemo(() => {
    const prayers: Activity[] = [];
    const others: Activity[] = [];
    DEFAULT_ACTIVITIES.forEach((a) => {
      (PRAYER_IDS.includes(a.id) ? prayers : others).push(a);
    });
    return { prayerActivities: prayers, otherActivities: others };
  }, []);

  const [selectedPrayerIds, setSelectedPrayerIds] =
    useState<string[]>(PRAYER_IDS);
  const [selectedOtherIds, setSelectedOtherIds] = useState<string[]>([]);

  const togglePrayer = useCallback((id: string) => {
    setSelectedPrayerIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const toggleOther = useCallback((id: string) => {
    setSelectedOtherIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_OTHER_SELECTION) return prev;
      return [...prev, id];
    });
  }, []);

  const applyAndFinish = useCallback(
    (ids: string[]) => {
      useActivitiesStore.setState((state) => ({
        activities: state.activities.map((a) => ({
          ...a,
          enabled: ids.includes(a.id),
        })),
      }));
      complete();
      router.replace("/(tabs)");
    },
    [complete],
  );

  const handleDone = useCallback(() => {
    applyAndFinish([...selectedPrayerIds, ...selectedOtherIds]);
  }, [selectedPrayerIds, selectedOtherIds, applyAndFinish]);

  const otherAtMax = selectedOtherIds.length >= MAX_OTHER_SELECTION;

  const renderOtherCard = useCallback(
    ({ item }: { item: Activity }) => {
      const isSelected = selectedOtherIds.includes(item.id);
      return (
        <ActivityPickerCard
          activity={item}
          selected={isSelected}
          onPress={() => toggleOther(item.id)}
          disabled={otherAtMax && !isSelected}
        />
      );
    },
    [selectedOtherIds, toggleOther, otherAtMax],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.prayerSection}>
        <AppText
          weight='Bold'
          variant='body'
          style={[styles.sectionLabel, { color: C.textSecondary }]}
        >
          {t("onboarding.pickPrayersLabel")}
        </AppText>
        <View style={styles.prayerGrid}>
          {prayerActivities.map((activity) => (
            <View key={activity.id} style={styles.prayerCardWrapper}>
              <ActivityPickerCard
                activity={activity}
                selected={selectedPrayerIds.includes(activity.id)}
                onPress={() => togglePrayer(activity.id)}
              />
            </View>
          ))}
        </View>

        <AppText
          weight='Bold'
          variant='body'
          style={[
            styles.sectionLabel,
            styles.othersLabel,
            { color: C.textSecondary },
          ]}
        >
          {t("onboarding.pickOthersLabel")}
        </AppText>
      </View>
    ),
    [prayerActivities, selectedPrayerIds, togglePrayer, C.textSecondary, t],
  );

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <AppText weight='Bold' variant='titleLarge' style={{ color: C.text }}>
          {t("onboarding.pickTitle")}
        </AppText>
        <AppText variant='body' style={{ color: C.textSecondary }}>
          {t("onboarding.pickSubtext", {
            count: selectedOtherIds.length,
            max: MAX_OTHER_SELECTION,
          })}
        </AppText>
      </View>

      <FlatList
        data={otherActivities}
        renderItem={renderOtherCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.xxl }]}
      >
        <View style={{ paddingBottom: spacing.lg }}>
          <OnboardingDots
            total={ONBOARDING_SLIDES.length + 1}
            currentIndex={ONBOARDING_SLIDES.length}
          />
        </View>

        <AppButton
          variant='primary'
          label={t("onboarding.done")}
          onPress={handleDone}
          style={[styles.confirm, { backgroundColor: C.gold }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  grid: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  prayerSection: {
    paddingHorizontal: spacing.xs,
  },
  sectionLabel: {
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  othersLabel: {
    marginTop: spacing.md,
  },
  prayerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  prayerCardWrapper: {
    width: "50%",
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    gap: spacing.md,
    alignItems: "center",
  },
  confirm: {
    width: "100%",
    height: 52,
  },
});
