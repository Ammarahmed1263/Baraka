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
      {selected && (
        <View style={[styles.checkBadge, { backgroundColor: C.gold }]}>
          <Feather name="check" size={12} color="#FFFFFF" />
        </View>
      )}

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
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 13,
    textAlign: "center",
  },
});
