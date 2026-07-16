import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@context/ThemeContext";
import { useLocalize } from "@hooks/useLocalize";
import { AppText } from "@components/UI/AppText";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import type { Activity } from "@types";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

interface ActivityPickerCardProps {
  activity: Activity;
  selected: boolean;
  onPress: () => void;
}

export function ActivityPickerCard({
  activity,
  selected,
  onPress,
}: ActivityPickerCardProps) {
  const { colors: C } = useTheme();
  const localize = useLocalize();

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: selected ? C.backgroundSubtle : C.backgroundCard,
          borderColor: selected ? C.gold : C.border,
        },
      ]}
    >
      {selected && (
        <View style={[styles.checkBadge, { backgroundColor: C.gold }]}>
          <Feather name='check' size={12} color={C.textOnTint} />
        </View>
      )}

      <AppText
        weight='Medium'
        variant='body'
        numberOfLines={2}
        style={[styles.name, { color: C.text }]}
      >
        {localize(activity.name)}
      </AppText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: spacing.lg,
    margin: spacing.xs + 2,
    alignItems: "center",
    gap: spacing.md,
  },
  checkBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    textAlign: "center",
  },
});
