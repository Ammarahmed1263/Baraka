import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@components/UI/AppText";
import { type EducationEntry } from "@types";
import { useLocalize } from "@hooks/useLocalize";
import { useTheme } from "@context/ThemeContext";

interface EducationCardProps {
  entry: EducationEntry;
  mapCategoryLabel: (category: string) => string;
  onPress: () => void;
}

export default function EducationCard({
  entry,
  mapCategoryLabel,
  onPress,
}: EducationCardProps) {
  const { colors: C } = useTheme();
  const localize = useLocalize();

  const categoryColors: Record<string, string> = {
    Foundations: "#C9A84C",
    Work: "#3B82F6",
    Health: "#EF4444",
    "Daily Life": "#2D7A4F",
    Worship: "#8B5CF6",
    Relationships: "#EC4899",
    Learning: "#059669",
  };
  const catColor = categoryColors[entry.category] || C.tint;

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
          {mapCategoryLabel(entry.category)}
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
            {entry.source}
          </AppText>
        </View>
        <Feather name='chevron-right' size={16} color={C.textMuted} />
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
