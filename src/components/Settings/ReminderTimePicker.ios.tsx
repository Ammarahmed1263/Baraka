
import { Modal, Pressable, View, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { AppText } from "@components/UI/AppText";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { ReminderTimePickerProps, getPickerDate } from "./ReminderTimePicker.types";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

export function ReminderTimePicker({ visible, value, onChange, onClose }: ReminderTimePickerProps) {
  const { colors: C } = useTheme();
  const { t } = useTranslation();

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={[styles.modalSheet, { backgroundColor: C.backgroundCard }]}>
          <View style={styles.modalHeader}>
            <AnimatedPressable onPress={onClose}>
              <AppText weight="Medium" variant='bodyLarge' style={{ color: C.textMuted }}>
                {t("common.cancel")}
              </AppText>
            </AnimatedPressable>
            <AnimatedPressable onPress={onClose}>
              <AppText weight="Bold" variant='bodyLarge' style={{ color: C.tint }}>
                {t("onboarding.done")}
              </AppText>
            </AnimatedPressable>
          </View>
          <DateTimePicker
            value={getPickerDate(value)}
            mode="time"
            display="spinner"
            is24Hour={false}
            onChange={onChange}
            textColor={C.text}
          />
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.huge,
    paddingHorizontal: spacing.xl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
});
