import { AppButton } from "@components/UI/AppButton";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewToken
} from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@components/UI/AppText";
import { LanguagePicker } from "@components/onboarding/LanguagePicker";
import { OnboardingDots } from "@components/onboarding/OnboardingDots";
import { OnboardingSlide } from "@components/onboarding/OnboardingSlide";
import { useTheme } from "@context/ThemeContext";
import { ONBOARDING_SLIDES } from "@data/onboardingSlides";
import { useLocalize } from "@hooks/useLocalize";
import { spacing } from "@constants/spacing";

export default function OnboardingPager() {
  const { colors: C } = useTheme();
  const { t } = useTranslation();
  const localize = useLocalize();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef =
    useAnimatedRef<FlatList<(typeof ONBOARDING_SLIDES)[number]>>();
  const scrollX = useSharedValue(0);

  // const resetToFirstSlide = useCallback(() => {
  //   scrollX.value = 0;
  //   flatListRef.current?.scrollToIndex({ index: 0, animated: false });
  //   setCurrentIndex(0);
  // }, [scrollX]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0] && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

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
  }, [currentIndex, isLastSlide, goToActivityPicker]);

  const slideStyle = React.useMemo(() => [styles.slide, { width }], [width]);

  const renderSlide = useCallback(
    ({
      item,
      index,
    }: ListRenderItemInfo<(typeof ONBOARDING_SLIDES)[number]>) => (
      <View style={slideStyle}>
        <OnboardingSlide index={index} scrollX={scrollX} width={width}>
          <View style={styles.slideContent}>
            <View
              style={[styles.iconCircle, { backgroundColor: C.gold + "18" }]}
            >
              <Feather name={item.icon as any} size={48} color={C.gold} />
            </View>
            {index === 0 && (
              <View style={styles.languagePickerInline}>
                <LanguagePicker />
              </View>
            )}
            <AppText weight='Bold' variant='titleLarge' style={[styles.title, { color: C.text }]}>
              {localize(item.title)}
            </AppText>
            <AppText variant='bodyLarge' style={[styles.body, { color: C.textSecondary }]}>
              {localize(item.body)}
            </AppText>
          </View>
        </OnboardingSlide>
      </View>
    ),
    [scrollX, width, C, localize],
  );

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <Animated.FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={renderSlide}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View
        style={[styles.bottomSection, { paddingBottom: insets.bottom + spacing.xxl }]}
      >
        <OnboardingDots
          total={ONBOARDING_SLIDES.length}
          currentIndex={currentIndex}
        />

        <View
          style={[styles.buttonRow, currentIndex === 0 && styles.buttonRowEnd]}
        >
          {currentIndex > 0 && (
            <AppButton
              variant='ghost'
              label={t("onboarding.skip")}
              onPress={goToActivityPicker}
            />
          )}

          <AppButton
            variant='secondary'
            label={
              isLastSlide ? t("onboarding.getStarted") : t("onboarding.next")
            }
            onPress={goNext}
            style={{ paddingHorizontal: spacing.huge }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  languagePickerInline: {
    alignItems: "center",
    marginBottom: -spacing.sm,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
  },
  slideContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xxxl,
    gap: spacing.xxl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  title: {
    textAlign: "center",
    lineHeight: 38,
  },
  body: {
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: spacing.sm,
  },
  bottomSection: {
    paddingHorizontal: spacing.xxl,
    gap: spacing.xxxl - 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonRowEnd: {
    justifyContent: "flex-end",
  },
});
