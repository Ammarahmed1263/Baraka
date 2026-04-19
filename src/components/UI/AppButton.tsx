import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  View,
  useColorScheme,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@constants/colors";
import { AppText } from "./AppText";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";

interface AppButtonProps extends TouchableOpacityProps {
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
  const isDark = useColorScheme() === "dark";
  const C = isDark ? Colors.dark : Colors.light;

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
    <TouchableOpacity
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
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
