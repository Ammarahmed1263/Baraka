import { Pressable, View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useTheme } from "@context/ThemeContext";
import { useLanguage } from "@i18n";
import { AppText } from "@components/UI/AppText";

function LanguageOption({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const { colors: C } = useTheme();
  const scale = useSharedValue(1);
  const bg = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    bg.value = withTiming(isActive ? 1 : 0, { duration: 220 });
  }, [isActive]);

  const animatedPill = useAnimatedStyle(() => ({
    backgroundColor:
      bg.value > 0.5 ? C.gold : "transparent",
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.94, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
    >
      <Animated.View style={[styles.pill, animatedPill]}>
        <AppText
          weight={isActive ? "Bold" : "Medium"}
          style={[
            styles.pillLabel,
            { color: isActive ? C.textOnTint : C.textMuted },
          ]}
        >
          {label}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}

export function LanguagePicker() {
  const { colors: C } = useTheme();
  const { language, changeLanguage } = useLanguage();

  return (
    <View style={[styles.track, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
      <LanguageOption
        label="EN"
        isActive={language === "en"}
        onPress={() => changeLanguage("en")}
      />
      <LanguageOption
        label="عربي"
        isActive={language === "ar"}
        onPress={() => changeLanguage("ar")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillLabel: {
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
