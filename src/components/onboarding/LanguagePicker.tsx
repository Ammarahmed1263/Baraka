import {
  Pressable,
  View,
  StyleSheet,
  StyleProp,
  TextStyle,
} from "react-native";
import Animated, {
  cancelAnimation,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useCallback, useRef, useState } from "react";
import { useTheme } from "@context/ThemeContext";
import * as Sentry from "@sentry/react-native";
import { crossesDirection, useLanguage } from "@i18n";
import { AppText } from "@components/UI/AppText";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

// How long the picker stays locked after a direction switch if no reload happens.
const RELOAD_UNLOCK_DELAY_MS = 3000;

function LanguageOption({
  label,
  isActive,
  onPress,
  labelStyle,
  frozen,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
  labelStyle?: StyleProp<TextStyle>;
  frozen: boolean;
}) {
  const { colors: C } = useTheme();
  const scale = useSharedValue(1);
  const bg = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    if (frozen) {
      cancelAnimation(scale);
      cancelAnimation(bg);
      scale.value = 1;
      bg.value = isActive ? 1 : 0;
      return;
    }
    bg.value = withTiming(isActive ? 1 : 0, { duration: 220 });
  }, [isActive, frozen]);

  const animatedPill = useAnimatedStyle(() => ({
    backgroundColor: bg.value > 0.5 ? C.gold : "transparent",
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        if (!frozen) scale.value = withTiming(0.94, { duration: 100 });
      }}
      onPressOut={() => {
        if (!frozen) scale.value = withTiming(1, { duration: 150 });
      }}
    >
      <Animated.View style={[styles.pill, animatedPill]}>
        <AppText
          weight={isActive ? "Bold" : "Medium"}
          variant='body'
          style={[
            styles.pillLabel,
            labelStyle,
            { color: isActive ? C.textOnTint : C.textMuted },
          ]}
        >
          {label}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}

export function LanguagePicker({
  onLanguageChange,
}: {
  onLanguageChange?: () => void;
}) {
  const { colors: C } = useTheme();
  const { language, changeLanguage } = useLanguage();

  const [frozen, setFrozen] = useState(false);
  const lockedRef = useRef(false);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => () => clearTimeout(unlockTimer.current), []);

  const handleChange = useCallback(
    async (lang: "en" | "ar") => {
      if (lang === language || lockedRef.current) return;

      const unlock = () => {
        lockedRef.current = false;
        setFrozen(false);
      };

      lockedRef.current = true;
      const willReload = crossesDirection(lang);
      if (willReload) setFrozen(true);

      try {
        await changeLanguage(lang);
        onLanguageChange?.();
      } catch (error) {
        Sentry.captureException(error, {
          tags: { feature: "i18n" },
          extra: { phase: "changeLanguage", language: lang },
        });
        unlock();
        return;
      }

      if (willReload) {
        unlockTimer.current = setTimeout(unlock, RELOAD_UNLOCK_DELAY_MS);
      } else {
        unlock();
      }
    },
    [language, changeLanguage, onLanguageChange],
  );

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: C.backgroundCard, borderColor: C.border },
      ]}
    >
      <LanguageOption
        label='EN'
        isActive={language === "en"}
        frozen={frozen}
        onPress={() => handleChange("en")}
        labelStyle={{
          fontFamily:
            language === "en" ? "SourceSerif4-Bold" : "SourceSerif4-Medium",
        }}
      />
      <LanguageOption
        label='عربي'
        isActive={language === "ar"}
        frozen={frozen}
        onPress={() => handleChange("ar")}
        labelStyle={{
          fontFamily: language === "ar" ? "Tajawal-Medium" : "Tajawal-Regular",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  pillLabel: {
    letterSpacing: 0.3,
  },
});
