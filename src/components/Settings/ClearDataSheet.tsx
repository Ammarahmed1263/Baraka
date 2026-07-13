import React from "react";
import { View, StyleSheet } from "react-native";
import { AppBottomSheet } from "@components/UI/AppBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AppText } from "@components/UI/AppText";
import { AppButton } from "@components/UI/AppButton";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";

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
        <AppText weight="Bold" style={[styles.sheetTitle, { color: C.error }]}>
          {t("settings.clearConfirmTitle")}
        </AppText>
        <AppText
          weight="Regular"
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
    fontSize: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  sheetDesc: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
  },
  buttonWrapper: {
    flex: 1,
  },
});
