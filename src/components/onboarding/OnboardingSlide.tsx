import { ONBOARDING_SLIDES } from "@/data/onboardingSlides";
import { I18nManager } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";

interface OnboardingSlideProps {
  children: React.ReactNode;
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}

export function OnboardingSlide({
  children,
  index,
  scrollX,
  width,
}: OnboardingSlideProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const isRTL = I18nManager.isRTL;
    const normalizedIndex = isRTL
      ? ONBOARDING_SLIDES.length - 1 - index
      : index;
    const position = scrollX.value / width - normalizedIndex;

    const opacity = interpolate(
      position,
      [-1, 0, 1],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      position,
      [-1, 0, 1],
      [32, 0, 32],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      position,
      [-1, 0, 1],
      [0.92, 1, 0.92],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
