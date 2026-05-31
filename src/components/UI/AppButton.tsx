import {
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { AnimatedPressable, AnimatedPressableProps } from "./AnimatedPressable";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "@context/ThemeContext";
import { AppText } from "./AppText";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";

interface AppButtonProps extends AnimatedPressableProps {
  label: string;
  variant?: ButtonVariant;
  icon?: keyof typeof Feather.glyphMap;
  loading?: boolean;
  haptic?: Haptics.ImpactFeedbackStyle | Haptics.NotificationFeedbackType;
}

export function AppButton({
  label,
  variant = "primary",
  icon,
  loading = false,
  haptic,
  style,
  disabled,
  ...props
}: AppButtonProps) {
  const { colors: C } = useTheme();

  const handlePress = (e: any) => {
    if (haptic) {
      if (typeof haptic === "string" && haptic in Haptics.ImpactFeedbackStyle) {
        Haptics.impactAsync(haptic as Haptics.ImpactFeedbackStyle);
      } else if (typeof haptic === "string") {
        Haptics.notificationAsync(haptic as Haptics.NotificationFeedbackType);
      }
    }
    if (props.onPress) props.onPress(e);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          container: { backgroundColor: C.tint },
          text: { color: "#FFFFFF" },
          icon: "#FFFFFF",
        };
      case "secondary":
        return {
          container: { backgroundColor: C.backgroundSubtle },
          text: { color: C.text },
          icon: C.text,
        };
      case "outline":
        return {
          container: { backgroundColor: "transparent", borderWidth: 1, borderColor: C.border },
          text: { color: C.textSecondary },
          icon: C.textSecondary,
        };
      case "ghost":
        return {
          container: { backgroundColor: "transparent" },
          text: { color: C.textSecondary },
          icon: C.textSecondary,
        };
      case "destructive":
        return {
          container: { backgroundColor: C.error + "20", borderWidth: 1, borderColor: C.error },
          text: { color: C.error },
          icon: C.error,
        };
      default:
        return { container: {}, text: {}, icon: C.text };
    }
  };

  const v = getVariantStyles();

  return (
    <AnimatedPressable
      activeOpacity={0.7}
      disabled={disabled || loading}
      onPress={handlePress}
      style={[
        styles.container,
        v.container,
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={v.icon} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <Feather name={icon} size={18} color={v.icon} style={styles.icon} />}
          <AppText weight="Bold" style={[styles.label, v.text]}>
            {label}
          </AppText>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  disabled: {
    opacity: 0.5,
  },
});
