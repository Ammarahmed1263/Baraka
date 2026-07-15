import { useMemo } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { AnimatedPressable, AnimatedPressableProps } from "./AnimatedPressable";
import { Feather } from "@expo/vector-icons";
import { Haptic } from "@utils/haptics";
import { useTheme } from "@context/ThemeContext";
import { AppText } from "./AppText";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

interface AppButtonProps extends AnimatedPressableProps {
  label: string;
  variant?: ButtonVariant;
  icon?: keyof typeof Feather.glyphMap;
  loading?: boolean;
  haptic?: "light" | "selection" | "success" | "warning" | "error";
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
      switch (haptic) {
        case "light":
          Haptic.lightTap();
          break;
        case "selection":
          Haptic.selection();
          break;
        case "success":
          Haptic.success();
          break;
        case "warning":
          Haptic.warning();
          break;
        case "error":
          Haptic.error();
          break;
        default:
          Haptic.lightTap();
          break;
      }
    }
    if (props.onPress) props.onPress(e);
  };

  const v = useMemo(() => {
    switch (variant) {
      case "primary":
        return {
          container: { backgroundColor: C.tint },
          text: { color: C.background },
          icon: C.background,
        };
      case "secondary":
        return {
          container: { backgroundColor: C.gold },
          text: { color: C.textOnTint },
          icon: C.textOnTint,
        };
      case "outline":
        return {
          container: {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: C.border,
          },
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
          container: {
            backgroundColor: C.error + "20",
            borderWidth: 1,
            borderColor: C.error,
          },
          text: { color: C.error },
          icon: C.error,
        };
      default:
        return { container: {}, text: {}, icon: C.text };
    }
  }, [variant, C]);

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
        <ActivityIndicator color={v.icon} size='small' />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Feather name={icon} size={18} color={v.icon} style={styles.icon} />
          )}
          <AppText weight='Bold' variant='bodyLarge' style={v.text}>
            {label}
          </AppText>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});
