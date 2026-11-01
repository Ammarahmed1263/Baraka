import React from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { AppBottomSheet } from "@components/UI/AppBottomSheet";
import { AppText } from "@components/UI/AppText";
import { AppButton } from "@components/UI/AppButton";
import { useTheme } from "@context/ThemeContext";
import { spacing } from "@constants/spacing";

interface AnalyticsConsentSheetProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const AnalyticsConsentSheet = React.forwardRef<
  BottomSheetModal,
  AnalyticsConsentSheetProps
>(({ onAccept, onDecline }, ref) => {
  const { t } = useTranslation();
  const { colors: C } = useTheme();

  return (
    <AppBottomSheet ref={ref} snapPoints={["55%"]} enablePanDownToClose>
      <AppText
        weight="Bold"
        variant="title"
        style={[styles.title, { color: C.gold }]}
      >
        {t("analyticsPrompt.title")}
      </AppText>
      <AppText
        weight="Regular"
        variant="bodyLarge"
        style={[styles.message, { color: C.textSecondary }]}
      >
        {t("analyticsPrompt.message")}
      </AppText>

      <View style={styles.buttonColumn}>
        <AppButton
          variant="primary"
          label={t("analyticsPrompt.accept")}
          onPress={onAccept}
        />
        <AppButton
          variant="outline"
          label={t("analyticsPrompt.decline")}
          onPress={onDecline}
        />
      </View>
    </AppBottomSheet>
  );
});

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.md,
    lineHeight: 22,
  },
  buttonColumn: {
    gap: spacing.md,
  },
});
