import { useState, useRef, useEffect, useCallback } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";

export function useToast() {
  const [toastMessage, setToastMessage] = useState("");
  const toastOpacity = useSharedValue(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(2200, withTiming(0, { duration: 300 }))
    );
    toastTimer.current = setTimeout(() => {
      setToastMessage("");
    }, 2800);
  }, [toastOpacity]);

  const animatedToastStyle = useAnimatedStyle(() => ({
    opacity: toastOpacity.value,
  }));

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  return {
    toastMessage,
    showToast,
    animatedToastStyle,
  };
}
