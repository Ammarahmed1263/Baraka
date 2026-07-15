import { memo } from "react";
import { AppText } from "@components/UI/AppText";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { useTheme } from "@context/ThemeContext";
import { AppIcon as Feather } from "@components/UI/AppIcon";
import { useLocalize } from "@hooks/useLocalize";
import { type EducationEntry } from "@types";
import { StyleSheet, View } from "react-native";

import { categoryColors as themeCategoryColors } from "@constants/colors";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

import { useTranslation } from "react-i18next";

interface EducationCardProps {
  entry: EducationEntry;
  onPress: () => void;
}

const categoryColorMap: Record<string, string> = {
  Foundations: themeCategoryColors.Foundations,
  Work: themeCategoryColors.Work,
  Health: themeCategoryColors.Health,
  Worship: themeCategoryColors.Worship,
  Relationships: themeCategoryColors.Family,
  Learning: themeCategoryColors.Knowledge,
};

export default memo(function EducationCard({
  entry,
  onPress,
}: EducationCardProps) {
  const { colors: C } = useTheme();
  const localize = useLocalize();
  const { t } = useTranslation();

  const catColor = categoryColorMap[entry.category] || C.tint;

  return (
    <AnimatedPressable
      onPress={onPress}
      activeOpacity={0.94}
      style={[
        styles.eduCard,
        { backgroundColor: C.backgroundCard, borderColor: C.border },
      ]}
    >
      <View
        style={[styles.categoryBadge, { backgroundColor: catColor + "18" }]}
      >
        <AppText weight='Bold' variant='caption' style={{ color: catColor }}>
          {t("category." + entry.category)}
        </AppText>
      </View>
      <AppText
        weight='Bold'
        variant='bodyLarge'
        style={[styles.eduTitle, { color: C.text }]}
        numberOfLines={2}
      >
        {localize(entry.title)}
      </AppText>
      <AppText
        weight='Regular'
        variant='footnote'
        style={[styles.eduPreview, { color: C.textSecondary }]}
        numberOfLines={3}
      >
        {localize(entry.content)}
      </AppText>
      <View style={styles.eduFooter}>
        <View style={styles.sourceRow}>
          <Feather name='book-open' size={11} color={C.tint} />
          <AppText weight='Regular' variant='caption' style={{ color: C.tint }}>
            {localize(entry.source)}
          </AppText>
        </View>
        <Feather name="chevron-right" size={16} color={C.textMuted} flipRTL />
      </View>
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  eduCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.xl,
  },
  eduTitle: { lineHeight: 22 },
  eduPreview: { lineHeight: 20 },
  eduFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  sourceRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
});
