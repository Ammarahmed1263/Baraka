import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { AppText } from "@components/UI/AppText";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

type Props = { streak: number };

export default function StreakBadge({ streak }: Props) {
  const { t } = useTranslation();
  const { colors: C } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: C.goldLight, borderColor: C.gold, borderWidth: 1 }]}>
      <Feather name="zap" size={14} color={C.gold} />
      <AppText weight="Bold" variant='bodyLarge' style={{ color: C.gold }}>
        {streak}
      </AppText>
      <AppText weight="Regular" variant='caption' style={{ color: C.gold }}>
        {streak === 1 ? t("streak.day") : t("streak.days")}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.xl,
    gap: spacing.xs,
  },
});

