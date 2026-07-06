import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { AppText } from "./AppText";
import { AppButton } from "./AppButton";
import Colors from "@constants/colors";

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
        style={{ marginBottom: 24 }}
      />

      <AppText weight='Bold' style={dynamicStyles.title}>
        {title || t("error.title")}
      </AppText>

      <AppText style={dynamicStyles.subtitle}>
        {subtitle || t("error.message")}
      </AppText>

      {showDetails && error && (
        <View style={dynamicStyles.errorDetails}>
          <AppText weight='Medium' style={dynamicStyles.errorLabel}>
            {t("error.details")}:
          </AppText>
          <AppText style={dynamicStyles.errorMessage}>{error.message}</AppText>
          {error.stack && (
            <ScrollView style={dynamicStyles.errorStackContainer}>
              <AppText style={dynamicStyles.errorStack}>{error.stack}</AppText>
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
      padding: 28,
      backgroundColor: C.background,
    },
    title: {
      fontSize: 28,
      color: C.text,
      marginBottom: 12,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: C.textSecondary,
      marginBottom: 32,
      lineHeight: 24,
      textAlign: "center",
    },
    errorDetails: {
      width: "100%",
      backgroundColor: C.backgroundSubtle,
      borderRadius: 16,
      padding: 16,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: C.border,
    },
    errorLabel: {
      fontSize: 14,
      color: C.error,
      marginBottom: 8,
      textAlign: "left",
    },
    errorMessage: {
      fontSize: 13,
      color: C.text,
      marginBottom: 8,
      textAlign: "left",
    },
    errorStackContainer: {
      maxHeight: 180,
    },
    errorStack: {
      fontSize: 11,
      color: C.textMuted,
      fontFamily: "monospace",
      textAlign: "left",
    },
    buttonContainer: {
      width: "100%",
    },
  });
