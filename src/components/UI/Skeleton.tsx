import { useEffect } from "react";
import { StyleSheet, View, ViewStyle, DimensionValue } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const { colors: C, isDark } = useTheme();
  const layoutWidth = useSharedValue(0);
  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    shimmerProgress.value = withRepeat(
      withTiming(1, { duration: 800 }),
      -1,
      false,
    );
  }, [shimmerProgress]);

  const animatedGradientStyle = useAnimatedStyle(() => {
    const w = layoutWidth.value;
    if (w === 0) return { transform: [{ translateX: 0 }] };
    const translateX = -w + shimmerProgress.value * (w * 2);
    return {
      transform: [{ translateX }],
    };
  });

  const baseColor = isDark ? C.backgroundSubtle : C.borderLight;
  const highlightColor = isDark ? C.backgroundCard : C.backgroundCard;

  return (
    <View
      onLayout={(e) => {
        layoutWidth.value = e.nativeEvent.layout.width;
      }}
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
        },
        style,
      ]}
    >
      <Animated.View
        style={[StyleSheet.absoluteFillObject, animatedGradientStyle]}
      >
        <LinearGradient
          colors={[baseColor, highlightColor, baseColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
});
