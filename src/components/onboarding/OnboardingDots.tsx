import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@context/ThemeContext";

interface OnboardingDotsProps {
  total: number;
  currentIndex: number;
}

function Dot({ active }: { active: boolean }) {
  const { colors: C } = useTheme();
  const scale = useSharedValue(active ? 1.3 : 1);

  useEffect(() => {
    scale.value = withTiming(active ? 1.3 : 1, { duration: 300 });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: active ? C.gold : C.textMuted,
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export function OnboardingDots({ total, currentIndex }: OnboardingDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }, (_, i) => (
        <Dot key={i} active={i === currentIndex} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
