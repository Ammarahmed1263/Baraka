
import { Modal, Pressable, View, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { AppText } from "@components/UI/AppText";
import { ReminderTimePickerProps, getPickerDate } from "./ReminderTimePicker.types";

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
            <TouchableOpacity onPress={onClose}>
              <AppText weight="Medium" style={{ color: C.textMuted }}>
                {t("common.cancel")}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <AppText weight="Bold" style={{ color: C.tint }}>
                {t("onboarding.done")}
              </AppText>
            </TouchableOpacity>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
});
