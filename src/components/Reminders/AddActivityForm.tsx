import { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { AppButton } from "@components/UI/AppButton";
import { AppTextInput } from "@components/UI/AppTextInput";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Haptic } from "@utils/haptics";
import { AppText } from "@components/UI/AppText";
import { useActivitiesStore } from "@store";
import { useTheme } from "@context/ThemeContext";

const ICON_OPTIONS = [
  "sunrise",
  "coffee",
  "briefcase",
  "activity",
  "sun",
  "moon",
  "map-pin",
  "clock",
  "heart",
  "gift",
  "book-open",
  "music",
  "camera",
  "star",
  "home",
  "users",
  "droplet",
  "feather",
];

const COLOR_OPTIONS = [
  "#2D7A4F",
  "#C9A84C",
  "#3B82F6",
  "#EF4444",
  "#EC4899",
  "#8B5CF6",
  "#F97316",
  "#10B981",
  "#6366F1",
  "#059669",
  "#D97706",
  "#0891B2",
];

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
  const [selectedIcon, setSelectedIcon] = useState("star");
  const [selectedColor, setSelectedColor] = useState("#2D7A4F");

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
      icon: selectedIcon,
      category: "daily",
      niyyahText: {
        en: newNiyyah.trim() || defaultNiyyah,
        ar: newNiyyah.trim() || defaultNiyyah,
      },
      color: selectedColor,
    };

    await addCustomActivity(newActivity);

    await Haptic.success();
    setNewName("");
    setNewNiyyah("");
    setSelectedIcon("star");
    setSelectedColor("#2D7A4F");
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

      {/* Icon Picker */}
      <AppText
        weight='Medium'
        style={[styles.pickerLabel, { color: C.textSecondary }]}
      >
        {t("reminders.icon")}
      </AppText>
      <View style={styles.iconPicker}>
        {ICON_OPTIONS.map((icon) => (
          <AnimatedPressable
            key={icon}
            onPress={() => setSelectedIcon(icon)}
            style={[
              styles.iconOption,
              {
                backgroundColor:
                  selectedIcon === icon ? C.tint + "20" : C.backgroundSubtle,
                borderColor: selectedIcon === icon ? C.tint : "transparent",
              },
            ]}
          >
            <Feather
              name={icon as any}
              size={18}
              color={selectedIcon === icon ? C.tint : C.textSecondary}
            />
          </AnimatedPressable>
        ))}
      </View>

      {/* Color Picker */}
      <AppText
        weight='Medium'
        style={[styles.pickerLabel, { color: C.textSecondary }]}
      >
        {t("reminders.color")}
      </AppText>
      <View style={styles.colorPicker}>
        {COLOR_OPTIONS.map((color) => (
          <AnimatedPressable
            key={color}
            onPress={() => setSelectedColor(color)}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.colorOptionSelected,
            ]}
          >
            {selectedColor === color && (
              <Feather name='check' size={12} color='#FFF' />
            )}
          </AnimatedPressable>
        ))}
      </View>

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
  iconPicker: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  iconOption: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  colorPicker: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  colorOptionSelected: {
    transform: [{ scale: 1.2 }],
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
