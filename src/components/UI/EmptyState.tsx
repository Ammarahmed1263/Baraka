import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import { AppText } from "./AppText";
import { AppButton } from "./AppButton";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@context/ThemeContext";
import { spacing } from "@constants/spacing";

interface EmptyStateProps {
  icon: keyof typeof Feather.glyphMap;
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  const { colors: C } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Feather name={icon} size={40} color={C.textMuted} />
      {title && (
        <AppText weight='Bold' variant='subtitle' style={styles.title}>
          {title}
        </AppText>
      )}
      <AppText weight='Regular' variant='body' style={[styles.message, { color: C.textSecondary }]}>
        {message}
      </AppText>
      {actionLabel && onAction && (
        <AppButton
          variant='primary'
          label={actionLabel}
          onPress={onAction}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacing.xxxl + spacing.lg,
    gap: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  message: {
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
  },
  button: {
    marginTop: spacing.sm,
  },
});
