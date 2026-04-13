import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Colors from "@/constants/colors";
import type { UserActivity } from "@/context/AppContext";
import { AppText } from "./UI/AppText";

type Props = {
  activity: UserActivity;
  completed: boolean;
  onToggle: () => void;
  onPress: () => void;
  language?: "en" | "ar";
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

export default function NiyyahCard({ activity, completed, onToggle, onPress, language = "en" }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleCheckPress = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  const iconName = (ICON_MAP[activity.icon] || "circle") as any;
  const activityColor = activity.color || C.tint;
  const selectedCount = (activity.selectedNiyyahIds ?? []).length;
  const displayName = language === "ar" ? activity.nameAr || activity.name : activity.name;
  const displayNiyyah = language === "ar"
    ? activity.niyyahTextAr || activity.customNiyyah || activity.niyyahText
    : (activity.customNiyyah || activity.niyyahText);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 10 }}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: completed
              ? isDark ? C.successLight : "#F0FDF4"
              : C.backgroundCard,
            borderColor: completed ? C.tint + "40" : C.border,
            opacity: pressed ? 0.95 : 1,
          },
        ]}
      >
        {/* Color accent bar */}
        <View style={[styles.accentBar, { backgroundColor: activityColor }]} />

        <View style={styles.content}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: activityColor + "18" }]}>
            <Feather name={iconName} size={18} color={activityColor} />
          </View>

          {/* Text */}
          <View style={styles.textContainer}>
            <View style={styles.nameRow}>
              <AppText
                weight="Bold"
                style={[
                  styles.activityName,
                  { color: completed ? C.tint : C.text },
                ]}
                numberOfLines={1}
              >
                {displayName}
              </AppText>
              {selectedCount > 0 && (
                <View style={[styles.countBadge, { backgroundColor: C.gold + "33", borderColor: C.gold + "66" }]}>
                  <AppText weight="Bold" style={[styles.countText, { color: C.gold }]}>
                    ×{selectedCount + 1}
                  </AppText>
                </View>
              )}
            </View>
            <AppText
              weight="Regular"
              style={[styles.niyyahPreview, { color: C.textSecondary }]}
              numberOfLines={1}
            >
              {displayNiyyah}
            </AppText>
          </View>

          {/* Check Button */}
          <TouchableOpacity
            onPress={handleCheckPress}
            activeOpacity={0.8}
            style={[
              styles.checkButton,
              {
                backgroundColor: completed ? C.tint : "transparent",
                borderColor: completed ? C.tint : C.border,
                borderWidth: 2,
              },
            ]}
          >
            {completed && <Feather name="check" size={14} color="#FFF" />}
          </TouchableOpacity>
        </View>
      </Pressable>
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
