import { useLocalSearchParams, router } from "expo-router";
import { EDUCATION_ENTRIES } from "@data/learnContent";
import EducationDetail from "@components/Learn/EducationDetail";
import { useSettingsStore } from "@store";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { AppText } from "@components/UI/AppText";

export default function LearnDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const settings = useSettingsStore((s) => s.settings);

  const entry = EDUCATION_ENTRIES.find((e) => e.id === id);

  if (!entry) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <AppText weight="Bold">{t("learn.noResults", "Entry not found")}</AppText>
      </View>
    );
  }

  return (
    <EducationDetail
      entry={entry}
      showBilingual={settings.showBilingual}
      mapCategoryLabel={(category) => t("category." + category)}
      onClose={() => router.back()}
    />
  );
}
