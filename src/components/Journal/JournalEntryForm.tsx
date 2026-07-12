import { useState, useEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AppTextInput } from "@components/UI/AppTextInput";
import { AppButton } from "@components/UI/AppButton";
import { AppText } from "@components/UI/AppText";
import { ChipSelector } from "@components/UI/ChipSelector";
import { useTheme } from "@context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { type JournalEntry } from "@types";
import { useLocalize } from "@hooks/useLocalize";

interface ActivityOption {
  id: string;
  name: { en: string; ar: string };
  enabled: boolean;
}

interface JournalEntryFormProps {
  entry?: JournalEntry;
  enabledActivities: ActivityOption[];
  onSave: (data: {
    activityId: string;
    activityName: { en: string; ar: string };
    note: string;
  }) => void;
  onCancel: () => void;
}

export function JournalEntryForm({
  entry,
  enabledActivities,
  onSave,
  onCancel,
}: JournalEntryFormProps) {
  const { t } = useTranslation();
  const { colors: C, isDark } = useTheme();
  const localize = useLocalize();

  const [note, setNote] = useState("");
  const [selectedActivityId, setSelectedActivityId] = useState("");

  useEffect(() => {
    if (entry) {
      setNote(entry.note);
      setSelectedActivityId(entry.activityId !== "general" ? entry.activityId : "");
    } else {
      setNote("");
      setSelectedActivityId("");
    }
  }, [entry]);

  const handleSave = () => {
    if (!note.trim()) {
      Alert.alert(
        t("journal.alert.emptyNoteTitle"),
        t("journal.alert.emptyNoteMessage")
      );
      return;
    }
    const selectedActivityObj = enabledActivities.find(
      (a) => a.id === selectedActivityId
    );
    const activityName = selectedActivityObj?.name ?? {
      en: t("journal.general", { lng: "en" }),
      ar: t("journal.general", { lng: "ar" }),
    };

    onSave({
      activityId: selectedActivityId || "general",
      activityName,
      note: note.trim(),
    });
  };

  const activityChips = enabledActivities.map((a) => ({
    label: localize(a.name),
    value: a.id,
  }));

  return (
    <View
      style={[
        styles.addForm,
        { backgroundColor: C.backgroundCard, borderColor: C.border },
      ]}
    >
      <LinearGradient
        colors={isDark ? [C.backgroundSubtle, C.background] : [C.border, C.successLight]}
        style={styles.formGradient}
      >
        <AppText weight='Bold' style={[styles.formTitle, { color: C.text }]}>
          {entry ? t("journal.editReflection") : t("journal.newReflection")}
        </AppText>
      </LinearGradient>

      {activityChips.length > 0 && (
        <ChipSelector
          items={activityChips}
          selectedValue={selectedActivityId}
          onSelect={(id) => setSelectedActivityId(selectedActivityId === id ? "" : id)}
          style={{ marginBottom: 0, marginTop: 12 }}
        />
      )}

      <AppTextInput
        value={note}
        onChangeText={setNote}
        placeholder={t("journal.notePlaceholder")}
        multiline
        style={{ marginHorizontal: 16, marginTop: 12 }}
      />
      <View style={styles.formActions}>
        <AppButton
          variant='ghost'
          label={t("common.cancel")}
          onPress={onCancel}
        />
        <AppButton
          variant='primary'
          label={t("common.save")}
          onPress={handleSave}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addForm: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    overflow: "hidden",
  },
  formGradient: { padding: 16 },
  formTitle: { fontSize: 17 },
  formActions: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: "flex-end",
  },
});
