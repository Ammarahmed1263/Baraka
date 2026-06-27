import { StyleSheet, View } from "react-native";
import { AppText } from "./AppText";
import { AppButton } from "./AppButton";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@context/ThemeContext";

interface EmptyStateProps {
  icon: keyof typeof Feather.glyphMap;
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: any;
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
        <AppText weight='Bold' style={[styles.title, { color: C.text }]}>
          {title}
        </AppText>
      )}
      <AppText weight='Regular' style={[styles.message, { color: C.textSecondary }]}>
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
    paddingVertical: 48,
    gap: 12,
  },
  title: {
    fontSize: 18,
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
  },
  button: {
    marginTop: 8,
  },
});
