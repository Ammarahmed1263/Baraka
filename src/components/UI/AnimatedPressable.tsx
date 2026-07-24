import React from "react";
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressableComponent = Animated.createAnimatedComponent(Pressable);

export interface AnimatedPressableProps extends PressableProps {
  scaleDownTo?: number;
  activeOpacity?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function AnimatedPressable({
  scaleDownTo = 0.96,
  activeOpacity = 0.9,
  style,
  onPressIn,
  onPressOut,
  children,
  disabled,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const disabledOpacity = React.useMemo(
    () => {
      const flattened = StyleSheet.flatten(style);
      return (flattened?.opacity as number | undefined) ?? 0.5;
    },
    [style]
  );

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
      opacity: disabled ? disabledOpacity : opacity.value,
    }),
    [disabled, disabledOpacity],
  );

  const handlePressIn = (e: any) => {
    scale.value = withSpring(scaleDownTo, { damping: 15, stiffness: 300 });
    if (activeOpacity < 1) {
      opacity.value = withSpring(activeOpacity, {
        damping: 15,
        stiffness: 300,
      });
    }
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    if (activeOpacity < 1) {
      opacity.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
    if (onPressOut) onPressOut(e);
  };

  return (
    <AnimatedPressableComponent
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
      {...props}
    >
      {children}
    </AnimatedPressableComponent>
  );
}
