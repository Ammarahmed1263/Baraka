
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { AppIcon as Feather } from "@components/UI/AppIcon";
import { AppText } from "@components/UI/AppText";
import { useTheme } from "@context/ThemeContext";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

interface SettingsToastProps {
  message: string;
  animatedStyle: any;
  isWeb: boolean;
}

export function SettingsToast({ message, animatedStyle, isWeb }: SettingsToastProps) {
  const { colors: C } = useTheme();

  if (message === "") return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: C.backgroundCard,
          borderColor: C.border,
          borderWidth: 1,
          bottom: isWeb ? 34 + 84 : 100,
        },
        animatedStyle,
      ]}
      pointerEvents="none"
    >
      <Feather name="unlock" size={16} color="#C9A84C" />
      <AppText weight="Medium" variant='body' style={styles.toastText}>
        {message}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: spacing.xl,
    right: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.md,
    zIndex: 999,
  },
  toastText: {
    flex: 1,
  },
});
