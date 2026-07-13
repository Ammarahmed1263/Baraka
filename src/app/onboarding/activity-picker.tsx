import { useState, useCallback } from "react";
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

const MAX_SELECTION = 5;

export default function ActivityPickerScreen() {
  const { colors: C } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { complete } = useOnboarding();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_SELECTION) {
        return prev;
      }
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
    applyAndFinish(selectedIds.length === 0 ? DEFAULT_ACTIVITY_IDS : selectedIds);
  }, [selectedIds, applyAndFinish]);

  const renderCard = useCallback(
    ({ item }: { item: Activity }) => (
      <ActivityPickerCard
        activity={item}
        selected={selectedIds.includes(item.id)}
        onPress={() => toggleSelection(item.id)}
      />
    ),
    [selectedIds, toggleSelection],
  );

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <AppText weight='Bold' style={[styles.title, { color: C.text }]}>
          {t("onboarding.pickTitle")}
        </AppText>
        <AppText style={[styles.subtitle, { color: C.textSecondary }]}>
          {t("onboarding.pickSubtext", { count: selectedIds.length, max: MAX_SELECTION })}
        </AppText>
      </View>

      {/* Activity grid */}
      <FlatList
        data={DEFAULT_ACTIVITIES}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <View style={{ paddingBottom: 16 }}>
          <OnboardingDots total={ONBOARDING_SLIDES.length + 1} currentIndex={ONBOARDING_SLIDES.length} />
        </View>

        <AppButton
          variant="primary"
          label={selectedIds.length === 0 ? t("onboarding.continueWithDefaults") : t("onboarding.done")}
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
    paddingHorizontal: 24,
    paddingBottom: 8,
    gap: 6,
  },
  title: {
    fontSize: 24,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  grid: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 14,
    alignItems: "center",
  },
  confirm: {
    width: "100%",
    height: 52,
  }
});
