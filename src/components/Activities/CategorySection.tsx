import { memo, useCallback, useState, useEffect } from "react";
import { View, StyleSheet, Switch } from "react-native";
import { AppIcon } from "@components/UI/AppIcon";
import { useTranslation } from "react-i18next";
import { AppText } from "@components/UI/AppText";
import { useLocalize } from "@hooks/useLocalize";
import { type UserActivity } from "@types";
import { useTheme } from "@context/ThemeContext";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

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
    worship: t("manageActivities.category.worship"),
    daily: t("manageActivities.category.daily"),
    productivity: t("manageActivities.category.productivity"),
    health: t("manageActivities.category.health"),
    relationships: t("manageActivities.category.relationships"),
    learning: t("manageActivities.category.learning"),
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
  isRecentlyToggled?: boolean;
}

export default memo(function CategorySection({
  category,
  categoryActivities,
  onToggleActivity,
  isRecentlyToggled,
}: CategorySectionProps) {
  const { t } = useTranslation();
  const { colors: C } = useTheme();
  const localize = useLocalize();

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isRecentlyToggled) {
      setIsExpanded(true);
    }
  }, [isRecentlyToggled]);

  if (categoryActivities.length === 0) return null;

  const enabledCount = categoryActivities.filter((a) => a.enabled).length;
  const totalCount = categoryActivities.length;

  const rotation = useDerivedValue(() => {
    return withTiming(isExpanded ? 180 : 0, { duration: 250 });
  });

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View style={styles.categorySection} layout={LinearTransition.duration(250)}>
      <AnimatedPressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.categoryHeader}
      >
        <View style={styles.headerLeft}>
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
            {getCategoryLabel(category, t)} · {enabledCount}/{totalCount}
          </AppText>
        </View>
        <Animated.View style={chevronStyle}>
          <Feather
            name="chevron-down"
            size={16}
            color={C.textSecondary}
          />
        </Animated.View>
      </AnimatedPressable>

      {isExpanded && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
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
        </Animated.View>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  categorySection: { marginBottom: spacing.xl },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
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
