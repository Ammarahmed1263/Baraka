import { Feather } from "@expo/vector-icons";
import { Haptic } from "@utils/haptics";
import {
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { AnimatedPressable } from "./UI/AnimatedPressable";
import type { UserActivity } from "@types";
import { useLocalize } from "@hooks/useLocalize";
import { AppText } from "@components/UI/AppText";
import { useTheme } from "@context/ThemeContext";

type Props = {
  activity: UserActivity;
  completed: boolean;
  onToggle: () => void;
  onPress: () => void;
};

const ICON_MAP: Record<string, string> = {
  sunrise: "sunrise",
  coffee: "coffee",
  briefcase: "briefcase",
  activity: "activity",
  sun: "sun",
  moon: "moon",
  "map-pin": "map-pin",
  clock: "clock",
  heart: "heart",
  sunset: "sunset",
  gift: "gift",
  "book-open": "book-open",
  zap: "zap",
  wind: "wind",
};

export default function NiyyahCard({
  activity,
  completed,
  onToggle,
  onPress,
}: Props) {
  const { colors: C, isDark } = useTheme();
  const checkScale = useSharedValue(1);
  const localize = useLocalize();

  const handleCheckPress = async () => {
    checkScale.value = withSequence(
      withTiming(0.94, { duration: 80 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    await Haptic.selection();
    onToggle();
  };

  const iconName = (ICON_MAP[activity.icon] || "circle") as any;
  const activityColor = activity.color || C.tint;
  const selectedCount = (activity.selectedNiyyahIds ?? []).length;
  const displayName = localize(activity.name);
  const displayNiyyah = activity.customNiyyah ?? localize(activity.niyyahText);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, { marginBottom: 10 }]}>
      <AnimatedPressable
        onPress={onPress}
        style={[
          styles.card,
          {
            backgroundColor: completed
              ? isDark
                ? C.successLight
                : "#F0FDF4"
              : C.backgroundCard,
            borderColor: completed ? C.tint + "40" : C.border,
          },
        ]}
      >
        {/* Color accent bar */}
        {/* <View style={[styles.accentBar, { backgroundColor: activityColor }]} /> */}

        <View style={styles.content}>
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: activityColor + "18" },
            ]}
          >
            <Feather name={iconName} size={18} color={activityColor} />
          </View>

          {/* Text */}
          <View style={styles.textContainer}>
            <View style={styles.nameRow}>
              <AppText
                weight='Bold'
                style={[
                  styles.activityName,
                  { color: completed ? C.tint : C.text },
                ]}
                numberOfLines={1}
              >
                {displayName}
              </AppText>
              {selectedCount > 0 && (
                <View
                  style={[
                    styles.countBadge,
                    {
                      backgroundColor: C.gold + "33",
                      borderColor: C.gold + "66",
                    },
                  ]}
                >
                  <AppText
                    weight='Bold'
                    style={[styles.countText, { color: C.gold }]}
                  >
                    ×{selectedCount + 1}
                  </AppText>
                </View>
              )}
            </View>
            <AppText
              weight='Regular'
              style={[styles.niyyahPreview, { color: C.textSecondary }]}
              numberOfLines={1}
            >
              {displayNiyyah}
            </AppText>
          </View>

          {/* Check Button */}
          <AnimatedPressable
            onPress={handleCheckPress}
            style={[
              styles.checkButton,
              {
                backgroundColor: completed ? C.tint : "transparent",
                borderColor: completed ? C.tint : C.border,
                borderWidth: 2,
              },
            ]}
          >
            {completed && <Feather name='check' size={14} color='#FFF' />}
          </AnimatedPressable>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
  },
  accentBar: { width: 4 },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: { flex: 1, gap: 3 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  activityName: { fontSize: 15, flexShrink: 1 },
  countBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  countText: { fontSize: 11 },
  niyyahPreview: { fontSize: 12, lineHeight: 16 },
  checkButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
