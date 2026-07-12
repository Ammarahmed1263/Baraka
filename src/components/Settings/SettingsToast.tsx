
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { AppIcon as Feather } from "@components/UI/AppIcon";
import { AppText } from "@components/UI/AppText";
import { useTheme } from "@context/ThemeContext";

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
      <AppText weight="Medium" style={[styles.toastText, { color: C.text }]}>
        {message}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    zIndex: 999,
  },
  toastText: {
    fontSize: 14,
    flex: 1,
  },
});
