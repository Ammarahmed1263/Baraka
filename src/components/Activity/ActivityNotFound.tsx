import { View, StyleSheet } from "react-native";
import { AppText } from "@components/UI/AppText";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";

export function ActivityNotFound() {
  const { t } = useTranslation();
  const { colors: C } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <AppText style={{ color: C.text, margin: 20 }}>
        {t("activity.notFound")}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
