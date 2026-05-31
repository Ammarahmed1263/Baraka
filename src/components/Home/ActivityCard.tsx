import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppText } from "@components/UI/AppText";
import { useTheme } from "@context/ThemeContext";
import { useLocalize } from "@hooks/useLocalize";
import { type UserActivity } from "@types";

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
        },
      ]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: (activity.color || C.tint) + "12" },
          ]}
        >
          <Feather
            name={(activity.icon as any) || "circle"}
            size={20}
            color={activity.color || C.tint}
          />
        </View>

        <View style={styles.info}>
          <AppText weight="Bold" style={[styles.name, { color: C.text }]}>
            {localize(activity.name)}
          </AppText>
          {showBilingual && (
            <AppText weight="Regular" style={[styles.nameAr, { color: C.textSecondary }]}>
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
          {completed && <Feather name="check" size={14} color="#FFF" />}
        </AnimatedPressable>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
  },
  nameAr: {
    fontSize: 15,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
