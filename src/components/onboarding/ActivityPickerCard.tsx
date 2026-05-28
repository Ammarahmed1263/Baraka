import { Pressable, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@context/ThemeContext";
import { useLocalize } from "@hooks/useLocalize";
import { AppText } from "@components/UI/AppText";
import type { Activity } from "@types";

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
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: selected ? C.backgroundSubtle : C.backgroundCard,
          borderColor: selected ? C.gold : C.border,
        },
      ]}
    >
      <View style={styles.iconRow}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: activity.color + "20" },
          ]}
        >
          <Feather
            name={activity.icon as any}
            size={22}
            color={activity.color}
          />
        </View>

        {selected && (
          <View style={[styles.checkBadge, { backgroundColor: C.gold }]}>
            <Feather name="check" size={12} color="#FFFFFF" />
          </View>
        )}
      </View>

      <AppText
        weight="Medium"
        numberOfLines={2}
        style={[styles.name, { color: C.text }]}
      >
        {localize(activity.name)}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    margin: 6,
    alignItems: "center",
    gap: 12,
  },
  iconRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBadge: {
    position: "absolute",
    top: -4,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 13,
    textAlign: "center",
  },
});
