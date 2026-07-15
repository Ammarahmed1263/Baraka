import { View, StyleSheet } from "react-native";
import { AppText } from "@components/UI/AppText";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { spacing } from "@constants/spacing";

export function ActivityNotFound() {
  const { t } = useTranslation();
  const { colors: C } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <AppText variant='body' style={{ color: C.text, margin: spacing.xl }}>
        {t("activity.notFound")}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
