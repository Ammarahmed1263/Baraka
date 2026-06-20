import { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { AppButton } from "@components/UI/AppButton";
import { AppTextInput } from "@components/UI/AppTextInput";
import { useTranslation } from "react-i18next";
import { Haptic } from "@utils/haptics";
import { AppText } from "@components/UI/AppText";
import { useActivitiesStore } from "@store";
import { useTheme } from "@context/ThemeContext";





import { generateCustomId } from "@utils/id";

interface AddActivityFormProps {
  onClose: () => void;
}

export default function AddActivityForm({ onClose }: AddActivityFormProps) {
  const { t } = useTranslation();
  const addCustomActivity = useActivitiesStore((s) => s.addCustomActivity);
  const { colors: C } = useTheme();

  const [newName, setNewName] = useState("");
  const [newNiyyah, setNewNiyyah] = useState("");

  const handleAddActivity = async () => {
    if (!newName.trim()) {
      Alert.alert(
        t("reminders.alert.nameRequiredTitle"),
        t("reminders.alert.nameRequiredMessage"),
      );
      return;
    }
    const defaultNiyyah = t("reminders.defaultIntention", {
      activity: newName.trim(),
    });
    const newActivity = {
      id: generateCustomId(),
      name: { en: newName.trim(), ar: newName.trim() },
      category: "daily",
      niyyahText: {
        en: newNiyyah.trim() || defaultNiyyah,
        ar: newNiyyah.trim() || defaultNiyyah,
      },
    };

    addCustomActivity(newActivity);

    Haptic.success();
    setNewName("");
    setNewNiyyah("");
    onClose();
  };

  return (
    <View
      style={[
        styles.addForm,
        { backgroundColor: C.backgroundCard, borderColor: C.border },
      ]}
    >
      <AppText weight='Bold' style={[styles.formTitle, { color: C.text }]}>
        {t("reminders.newActivity")}
      </AppText>
      <AppTextInput
        value={newName}
        onChangeText={setNewName}
        placeholder={t("reminders.activityNamePlaceholder")}
      />
      <AppTextInput
        value={newNiyyah}
        onChangeText={setNewNiyyah}
        placeholder={t("reminders.intentionPlaceholder")}
        multiline
      />





      <AppButton
        label={t("reminders.addActivity")}
        onPress={handleAddActivity}
        variant="primary"
        style={{ marginTop: 4 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addForm: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    gap: 12,
  },
  formTitle: { fontSize: 17, marginBottom: 4 },
  pickerLabel: { fontSize: 13 },


});
