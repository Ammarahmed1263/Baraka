import React from "react";
import { View, StyleSheet } from "react-native";
import { AppBottomSheet } from "@components/UI/AppBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AppText } from "@components/UI/AppText";
import { AppButton } from "@components/UI/AppButton";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { spacing } from "@constants/spacing";

interface ClearDataSheetProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ClearDataSheet = React.forwardRef<BottomSheetModal, ClearDataSheetProps>(
  ({ onConfirm, onCancel }, ref) => {
    const { t } = useTranslation();
    const { colors: C } = useTheme();

    return (
      <AppBottomSheet
        ref={ref}
        snapPoints={["35%"]}
        enablePanDownToClose
      >
        <AppText weight="Bold" variant='title' style={[styles.sheetTitle, { color: C.error }]}>
          {t("settings.clearConfirmTitle")}
        </AppText>
        <AppText
          weight="Regular"
          variant='bodyLarge'
          style={[styles.sheetDesc, { color: C.textSecondary }]}
        >
          {t("settings.clearConfirmMessage")}
        </AppText>

        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <AppButton
              variant="outline"
              label={t("common.cancel")}
              onPress={onCancel}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <AppButton
              variant="destructive"
              label={t("settings.clear")}
              onPress={onConfirm}
            />
          </View>
        </View>
      </AppBottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  sheetTitle: {
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  sheetDesc: {
    textAlign: "center",
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  buttonWrapper: {
    flex: 1,
  },
});
