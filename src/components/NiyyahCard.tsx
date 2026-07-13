import { Feather } from "@expo/vector-icons";
import { Haptic } from "@utils/haptics";
import { StyleSheet, View } from "react-native";
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

export default function NiyyahCard({
  activity,
  completed,
  onToggle,
  onPress,
}: Props) {
  const { colors: C } = useTheme();
  const checkScale = useSharedValue(1);
  const localize = useLocalize();

  const handleCheckPress = async () => {
    checkScale.value = withSequence(
      withTiming(0.94, { duration: 80 }),
      withSpring(1, { damping: 15, stiffness: 300 }),
    );
    Haptic.selection();
    onToggle();
  };

  const selectedCount = (activity.selectedNiyyahIds ?? []).filter(
    (id) => !id.endsWith("_basic"),
  ).length;
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
              ? C.successLight
              : C.backgroundCard,
            borderColor: completed ? C.tint + "40" : C.border,
          },
        ]}
      >
        <View style={styles.content}>
          <View style={[styles.sidePill, { backgroundColor: C.tint }]} />

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
              numberOfLines={2}
            >
              {displayNiyyah}
            </AppText>
            {activity.hadithRef && (
              <AppText
                weight='Regular'
                style={[styles.hadithFootnote, { color: C.textMuted }]}
              >
                {localize(activity.hadithRef)}
              </AppText>
            )}
          </View>

          <View style={styles.checkWrapper}>
            <AnimatedPressable
              onPress={handleCheckPress}
              hitSlop={20}
              style={[
                styles.checkButton,
                {
                  backgroundColor: completed ? C.gold : "transparent",
                  borderColor: completed ? C.gold : C.border,
                  borderWidth: 1.5,
                },
              ]}
            >
              {completed && <Feather name='check' size={11} color={C.textOnTint} />}
            </AnimatedPressable>
            {!completed && (
              <View
                style={[
                  styles.checkDot,
                  { backgroundColor: C.tint, borderColor: C.backgroundCard },
                ]}
              />
            )}
          </View>
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
  hadithFootnote: {
    fontSize: 10,
    marginTop: 2,
    opacity: 0.8,
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
  niyyahPreview: { fontSize: 13, lineHeight: 18},
  checkButton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  checkWrapper: {
    position: "relative",
  },
  checkDot: {
    position: "absolute",
    bottom: -2.5,
    right: -2.5,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  sidePill: {
    position: "absolute",
    left: 0,
    top: 14,
    width: 3.5,
    height: 24,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
});
