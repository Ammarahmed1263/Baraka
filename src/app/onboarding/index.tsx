import { useRef, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useTheme } from "@context/ThemeContext";
import { useLocalize } from "@hooks/useLocalize";
import { AppText } from "@components/UI/AppText";
import { OnboardingSlide } from "@components/onboarding/OnboardingSlide";
import { OnboardingDots } from "@components/onboarding/OnboardingDots";
import { LanguagePicker } from "@components/onboarding/LanguagePicker";
import { ONBOARDING_SLIDES } from "@data/onboardingSlides";

export default function OnboardingPager() {
  const { colors: C } = useTheme();
  const { t } = useTranslation();
  const localize = useLocalize();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  const goToActivityPicker = useCallback(() => {
    router.push("/onboarding/activity-picker");
  }, []);

  const goNext = useCallback(() => {
    if (isLastSlide) {
      goToActivityPicker();
      return;
    }
    const nextIndex = currentIndex + 1;
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    setCurrentIndex(nextIndex);
  }, [currentIndex, isLastSlide, goToActivityPicker]);

  const renderSlide = useCallback(
    ({
      item,
      index,
    }: {
      item: (typeof ONBOARDING_SLIDES)[number];
      index: number;
    }) => (
      <View style={[styles.slide, { width }]}>
        <OnboardingSlide isActive={index === currentIndex}>
          <View style={styles.slideContent}>
            <View
              style={[styles.iconCircle, { backgroundColor: C.gold + "18" }]}
            >
              <Feather name={item.icon as any} size={48} color={C.gold} />
            </View>
            <AppText weight='Bold' style={[styles.title, { color: C.text }]}>
              {localize(item.title)}
            </AppText>
            <AppText style={[styles.body, { color: C.textSecondary }]}>
              {localize(item.body)}
            </AppText>
          </View>
        </OnboardingSlide>
      </View>
    ),
    [currentIndex, width, C, localize],
  );

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {currentIndex === 0 && (
        <View
          style={[
            styles.languageRow,
            { top: insets.top + 12 },
          ]}
        >
          <LanguagePicker />
        </View>
      )}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={renderSlide}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Bottom controls */}
      <View
        style={[styles.bottomSection, { paddingBottom: insets.bottom + 24 }]}
      >
        <OnboardingDots
          total={ONBOARDING_SLIDES.length + 1}
          currentIndex={currentIndex}
        />

        <View
          style={[styles.buttonRow, currentIndex === 0 && styles.buttonRowEnd]}
        >
          {currentIndex > 0 && (
            <Pressable onPress={goToActivityPicker} hitSlop={12}>
              <AppText style={[styles.skipText, { color: C.textMuted }]}>
                {t("onboarding.skip")}
              </AppText>
            </Pressable>
          )}

          <Pressable
            onPress={goNext}
            style={[styles.nextButton, { backgroundColor: C.gold }]}
          >
            <AppText weight='Bold' style={styles.nextText}>
              {isLastSlide ? t("onboarding.getStarted") : t("onboarding.next")}
            </AppText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  languageRow: {
    position: "absolute",
    start: 20,
    zIndex: 10,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
  },
  slideContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    lineHeight: 38,
  },
  body: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 8,
  },
  bottomSection: {
    paddingHorizontal: 24,
    gap: 28,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonRowEnd: {
    justifyContent: "flex-end",
  },
  skipText: {
    fontSize: 15,
  },
  nextButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  nextText: {
    fontSize: 15,
    color: "#FFFFFF",
  },
});
