import { View, StyleSheet, Switch } from "react-native";
import { AppIcon } from "@components/UI/AppIcon";
import { useTranslation } from "react-i18next";
import { AppText } from "@components/UI/AppText";
import { useLocalize } from "@hooks/useLocalize";
import { type UserActivity } from "@types";
import { useTheme } from "@context/ThemeContext";

interface CategorySectionProps {
  category: string;
  categoryActivities: UserActivity[];
  onToggleActivity: (activity: UserActivity) => void;
}

export default function CategorySection({
  category,
  categoryActivities,
  onToggleActivity,
}: CategorySectionProps) {
  const { t } = useTranslation();
  const { colors: C } = useTheme();
  const localize = useLocalize();

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      worship: t("reminders.category.worship"),
      daily: t("reminders.category.daily"),
      productivity: t("reminders.category.productivity"),
      health: t("reminders.category.health"),
      relationships: t("reminders.category.relationships"),
      learning: t("reminders.category.learning"),
    };
    return labels[cat] || cat;
  };

  const getCategoryIcon = (cat: string): any => {
    const icons: Record<string, string> = {
      worship: "star",
      daily: "sun",
      productivity: "briefcase",
      health: "activity",
      relationships: "heart",
      learning: "book-open",
    };
    return icons[cat] || "circle";
  };

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
          style={[styles.categoryLabel, { color: C.textSecondary }]}
        >
          {getCategoryLabel(category)}
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
            <View style={styles.activityRow}>
              <View
                style={[
                  styles.activityIconWrapper,
                  { backgroundColor: (activity.color || C.tint) + "18" },
                ]}
              >
                <AppIcon
                  name={(activity.icon as any) || "circle"}
                  size={16}
                  color={activity.color || C.tint}
                />
              </View>
              <View style={styles.activityInfo}>
                <AppText
                  weight='Medium'
                  style={[styles.activityName, { color: C.text }]}
                >
                  {localize(activity.name)}
                </AppText>
                {activity.hadithRef && (
                  <AppText
                    weight='Regular'
                    style={[styles.activityRef, { color: C.textMuted }]}
                  >
                    {localize(activity.hadithRef)}
                  </AppText>
                )}
              </View>
              <Switch
                value={activity.enabled}
                onValueChange={() => onToggleActivity(activity)}
                trackColor={{ false: C.border, true: C.tint + "80" }}
                thumbColor={activity.enabled ? C.tint : C.textMuted}
                ios_backgroundColor={C.border}
              />
            </View>
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
}

const styles = StyleSheet.create({
  categorySection: { marginBottom: 20 },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
    paddingLeft: 4,
  },
  categoryLabel: { fontSize: 12, textTransform: "uppercase", letterSpacing: 1 },
  categoryCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  activityIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activityInfo: { flex: 1, gap: 2 },
  activityName: { fontSize: 15 },
  activityRef: { fontSize: 11 },
  divider: { height: 1, marginLeft: 62 },
});
