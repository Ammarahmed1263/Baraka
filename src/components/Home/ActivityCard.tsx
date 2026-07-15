import { AppIcon as Feather } from "@components/UI/AppIcon";
import { StyleSheet, View } from "react-native";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppText } from "@components/UI/AppText";
import { useTheme } from "@context/ThemeContext";
import { useLocalize } from "@hooks/useLocalize";
import { type UserActivity } from "@types";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

interface ActivityCardProps {
  activity: UserActivity;
  completed: boolean;
  onToggle: () => void;
  onPress: () => void;
  showBilingual?: boolean;
}

export default function ActivityCard({
  activity,
  completed,
  onToggle,
  onPress,
  showBilingual,
}: ActivityCardProps) {
  const { colors: C } = useTheme();
  const localize = useLocalize();

  return (
    <AnimatedPressable
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.card,
        {
          backgroundColor: C.backgroundCard,
          borderColor: completed ? C.tint + "44" : C.border,
          shadowColor: C.shadowColor,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.info}>
          <AppText weight='Bold' variant='bodyLarge' style={{ color: C.text }}>
            {localize(activity.name)}
          </AppText>
          {showBilingual && (
            <AppText
              weight='Regular'
              variant='body'
              style={{ color: C.textSecondary }}
            >
              {activity.name.ar}
            </AppText>
          )}
        </View>

        <AnimatedPressable
          onPress={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          style={[
            styles.checkbox,
            {
              backgroundColor: completed ? C.tint : "transparent",
              borderColor: completed ? C.tint : C.textMuted,
            },
          ]}
        >
          {completed && <Feather name='check' size={14} color={C.background} />}
        </AnimatedPressable>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },

  info: {
    flex: 1,
    gap: spacing.xs,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
