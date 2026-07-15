import { memo, useCallback } from "react";
import { View, StyleSheet, Switch } from "react-native";
import { AppIcon } from "@components/UI/AppIcon";
import { useTranslation } from "react-i18next";
import { AppText } from "@components/UI/AppText";
import { useLocalize } from "@hooks/useLocalize";
import { type UserActivity } from "@types";
import { useTheme } from "@context/ThemeContext";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

const CATEGORY_ICONS: Record<string, any> = {
  worship: "star",
  daily: "sun",
  productivity: "briefcase",
  health: "activity",
  relationships: "heart",
  learning: "book-open",
};

function getCategoryIcon(cat: string) {
  return CATEGORY_ICONS[cat] || "circle";
}

function getCategoryLabel(cat: string, t: any) {
  const labels: Record<string, string> = {
    worship: t("reminders.category.worship"),
    daily: t("reminders.category.daily"),
    productivity: t("reminders.category.productivity"),
    health: t("reminders.category.health"),
    relationships: t("reminders.category.relationships"),
    learning: t("reminders.category.learning"),
  };
  return labels[cat] || cat;
}

interface ActivityRowProps {
  activity: UserActivity;
  onToggle: (activity: UserActivity) => void;
  localize: any;
  colors: any;
}

const ActivityRow = memo(
  ({ activity, onToggle, localize, colors: C }: ActivityRowProps) => {
    const handleToggle = useCallback(() => {
      onToggle(activity);
    }, [activity, onToggle]);

    return (
      <View style={styles.activityRow}>
        <View style={styles.activityInfo}>
          <AppText
            weight='Medium'
            variant='bodyLarge'
            style={{ color: C.text }}
          >
            {localize(activity.name)}
          </AppText>
        </View>
        <Switch
          value={activity.enabled}
          onValueChange={handleToggle}
          trackColor={{ false: C.border, true: C.tint + "80" }}
          thumbColor={activity.enabled ? C.tint : C.textMuted}
          ios_backgroundColor={C.border}
        />
      </View>
    );
  },
);

interface CategorySectionProps {
  category: string;
  categoryActivities: UserActivity[];
  onToggleActivity: (activity: UserActivity) => void;
}

export default memo(function CategorySection({
  category,
  categoryActivities,
  onToggleActivity,
}: CategorySectionProps) {
  const { t } = useTranslation();
  const { colors: C } = useTheme();
  const localize = useLocalize();

  if (categoryActivities.length === 0) return null;

  return (
    <View style={styles.categorySection}>
      <View style={styles.categoryHeader}>
        <AppIcon
          name={getCategoryIcon(category)}
          size={14}
          color={C.textSecondary}
        />
        <AppText
          weight='Bold'
          variant='caption'
          style={[styles.categoryLabel, { color: C.textSecondary }]}
        >
          {getCategoryLabel(category, t)}
        </AppText>
      </View>
      <View
        style={[
          styles.categoryCard,
          { backgroundColor: C.backgroundCard, borderColor: C.border },
        ]}
      >
        {categoryActivities.map((activity, index) => (
          <View key={activity.id}>
            <ActivityRow
              activity={activity}
              onToggle={onToggleActivity}
              localize={localize}
              colors={C}
            />
            {index < categoryActivities.length - 1 && (
              <View
                style={[styles.divider, { backgroundColor: C.borderLight }]}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  categorySection: { marginBottom: spacing.xl },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  categoryLabel: { textTransform: "uppercase", letterSpacing: 1 },
  categoryCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.md,
  },

  activityInfo: { flex: 1, gap: spacing.xs },
  divider: { height: 1, marginLeft: spacing.md },
});
