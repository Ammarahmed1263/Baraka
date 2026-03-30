import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/colors";

type Props = { streak: number };

export default function StreakBadge({ streak }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: C.streakLight }]}>
      <Feather name="zap" size={14} color={C.streak} />
      <Text style={[styles.text, { color: C.streak, fontFamily: "Inter_700Bold" }]}>
        {streak}
      </Text>
      <Text style={[styles.label, { color: C.streak, fontFamily: "Inter_400Regular" }]}>
        {streak === 1 ? t("streak.day") : t("streak.days")}
      </Text>
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
