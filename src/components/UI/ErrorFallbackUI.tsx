import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { AppText } from "./AppText";
import { AppButton } from "./AppButton";
import Colors from "@constants/colors";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

interface ErrorFallbackUIProps {
  error: Error | null;
  onReset: () => void;
  title?: string;
  subtitle?: string;
  showDetailsInProd?: boolean;
}

export function ErrorFallbackUI({
  error,
  onReset,
  title,
  subtitle,
  showDetailsInProd,
}: ErrorFallbackUIProps) {
  const { colors: C } = useTheme();
  const { t } = useTranslation();
  const showDetails = __DEV__ || showDetailsInProd === true;

  const dynamicStyles = useMemo(() => createStyles(C), [C]);

  return (
    <View style={dynamicStyles.container}>
      <Feather
        name='alert-triangle'
        size={80}
        color={C.error}
        style={{ marginBottom: spacing.xxl }}
      />

      <AppText weight='Bold' variant='titleLarge' style={dynamicStyles.title}>
        {title || t("error.title")}
      </AppText>

      <AppText variant='bodyLarge' style={dynamicStyles.subtitle}>
        {subtitle || t("error.message")}
      </AppText>

      {showDetails && error && (
        <View style={dynamicStyles.errorDetails}>
          <AppText weight='Medium' variant='body' style={dynamicStyles.errorLabel}>
            {t("error.details")}:
          </AppText>
          <AppText variant='body' style={dynamicStyles.errorMessage}>{error.message}</AppText>
          {error.stack && (
            <ScrollView style={dynamicStyles.errorStackContainer}>
              <AppText variant='caption' style={dynamicStyles.errorStack}>{error.stack}</AppText>
            </ScrollView>
          )}
        </View>
      )}

      <View style={dynamicStyles.buttonContainer}>
        <AppButton
          label={t("error.tryAgain")}
          variant='primary'
          icon='refresh-cw'
          onPress={onReset}
          accessibilityLabel={t("error.tryAgain")}
        />
      </View>
    </View>
  );
}

const createStyles = (C: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.xxl,
      backgroundColor: C.background,
    },
    title: {
      color: C.text,
      marginBottom: spacing.md,
      textAlign: "center",
    },
    subtitle: {
      color: C.textSecondary,
      marginBottom: spacing.xxxl,
      lineHeight: 24,
      textAlign: "center",
    },
    errorDetails: {
      width: "100%",
      backgroundColor: C.backgroundSubtle,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.xxxl,
      borderWidth: 1,
      borderColor: C.border,
    },
    errorLabel: {
      color: C.error,
      marginBottom: spacing.sm,
      textAlign: "left",
    },
    errorMessage: {
      color: C.text,
      marginBottom: spacing.sm,
      textAlign: "left",
    },
    errorStackContainer: {
      maxHeight: 180,
    },
    errorStack: {
      color: C.textMuted,
      fontFamily: "monospace",
      textAlign: "left",
    },
    buttonContainer: {
      width: "100%",
    },
  });
