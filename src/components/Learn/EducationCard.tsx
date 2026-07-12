import { AppText } from "@components/UI/AppText";
import { useTheme } from "@context/ThemeContext";
import { AppIcon as Feather } from "@components/UI/AppIcon";
import { useLocalize } from "@hooks/useLocalize";
import { type EducationEntry } from "@types";
import { Pressable, StyleSheet, View } from "react-native";

import { categoryColors as themeCategoryColors } from "@constants/colors";

import { useTranslation } from "react-i18next";

interface EducationCardProps {
  entry: EducationEntry;
  onPress: () => void;
}

export default function EducationCard({
  entry,
  onPress,
}: EducationCardProps) {
  const { colors: C } = useTheme();
  const localize = useLocalize();
  const { t } = useTranslation();

  const getCatColor = () => {
    switch (entry.category) {
      case "Foundations":
        return themeCategoryColors.Foundations;
      case "Work":
        return themeCategoryColors.Work;
      case "Health":
        return themeCategoryColors.Health;
      case "Worship":
        return themeCategoryColors.Worship;
      case "Relationships":
        return themeCategoryColors.Family;
      case "Learning":
        return themeCategoryColors.Knowledge;
      case "Daily Life":
      default:
        return C.tint;
    }
  };

  const catColor = getCatColor();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.eduCard,
        {
          backgroundColor: C.backgroundCard,
          borderColor: C.border,
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
      <View
        style={[styles.categoryBadge, { backgroundColor: catColor + "18" }]}
      >
        <AppText
          weight='Bold'
          style={[styles.categoryBadgeText, { color: catColor }]}
        >
          {t("category." + entry.category)}
        </AppText>
      </View>
      <AppText
        weight='Bold'
        style={[styles.eduTitle, { color: C.text }]}
        numberOfLines={2}
      >
        {localize(entry.title)}
      </AppText>
      <AppText
        weight='Regular'
        style={[styles.eduPreview, { color: C.textSecondary }]}
        numberOfLines={3}
      >
        {localize(entry.content)}
      </AppText>
      <View style={styles.eduFooter}>
        <View style={styles.sourceRow}>
          <Feather name='book-open' size={11} color={C.tint} />
          <AppText
            weight='Regular'
            style={[styles.sourceText, { color: C.tint }]}
          >
            {localize(entry.source)}
          </AppText>
        </View>
        <Feather name="chevron-right" size={16} color={C.textMuted} flipRTL />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  eduCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 10,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryBadgeText: { fontSize: 11 },
  eduTitle: { fontSize: 16, lineHeight: 22 },
  eduPreview: { fontSize: 13, lineHeight: 20 },
  eduFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  sourceRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  sourceText: { fontSize: 11 },
});
