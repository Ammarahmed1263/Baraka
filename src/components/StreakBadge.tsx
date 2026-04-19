import { Feather } from "@expo/vector-icons";
import { StyleSheet, View, useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";
import Colors from "@constants/colors";
import { AppText } from "@components/UI/AppText";

type Props = { streak: number };

export default function StreakBadge({ streak }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: C.goldLight }]}>
      <Feather name="zap" size={14} color={C.streak} />
      <AppText weight="Bold" style={[styles.text, { color: C.streak }]}>
        {streak}
      </AppText>
      <AppText weight="Regular" style={[styles.label, { color: C.streak }]}>
        {streak === 1 ? t("streak.day") : t("streak.days")}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  text: { fontSize: 16 },
  label: { fontSize: 12 },
});

