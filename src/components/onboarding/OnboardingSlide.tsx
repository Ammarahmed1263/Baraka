import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface OnboardingSlideProps {
  children: React.ReactNode;
  isActive: boolean;
}

export function OnboardingSlide({ children, isActive }: OnboardingSlideProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    if (isActive) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });
    } else {
      // Reset instantly so re-entry re-animates
      opacity.value = 0;
      translateY.value = 16;
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>{children}</Animated.View>
  );
}
