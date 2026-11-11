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
import { useActivityActions } from "@hooks/db/useActivityActions";
import { useTheme } from "@context/ThemeContext";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

interface AddActivityFormProps {
  onClose: () => void;
}

export default function AddActivityForm({ onClose }: AddActivityFormProps) {
  const { t } = useTranslation();
  const { addCustomActivity } = useActivityActions();
  const { colors: C } = useTheme();

  const [newName, setNewName] = useState("");
  const [newNiyyah, setNewNiyyah] = useState("");

  const handleAddActivity = async () => {
    if (!newName.trim()) {
      Alert.alert(
        t("manageActivities.alert.nameRequiredTitle"),
        t("manageActivities.alert.nameRequiredMessage"),
      );
      return;
    }
    const defaultNiyyah = t("manageActivities.defaultIntention", {
      activity: newName.trim(),
    });
    const niyyahText = newNiyyah.trim() || defaultNiyyah;

    await addCustomActivity(
      {
        nameEn: newName.trim(),
        nameAr: newName.trim(),
        category: "daily",
        niyyahTextEn: niyyahText,
        niyyahTextAr: niyyahText,
      },
      { userWroteIntention: newNiyyah.trim().length > 0 },
    );

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
      <AppText weight='Bold' variant='subtitle' style={styles.formTitle}>
        {t("manageActivities.newActivity")}
      </AppText>
      <AppTextInput
        value={newName}
        onChangeText={setNewName}
        placeholder={t("manageActivities.activityNamePlaceholder")}
      />
      <AppTextInput
        value={newNiyyah}
        onChangeText={setNewNiyyah}
        placeholder={t("manageActivities.intentionPlaceholder")}
        multiline
      />

      <AppButton
        label={t("manageActivities.addActivity")}
        onPress={handleAddActivity}
        variant="primary"
        style={{ marginTop: spacing.xs }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addForm: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    gap: spacing.md,
  },
  formTitle: { marginBottom: spacing.xs },
});
