import { Pressable, View, StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useLanguage } from "@i18n";
import { AppText } from "@components/UI/AppText";

export function LanguagePicker() {
  const { colors: C } = useTheme();
  const { language, changeLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => changeLanguage("en")} hitSlop={8}>
        <AppText
          weight={language === "en" ? "Bold" : "Regular"}
          style={[
            styles.label,
            { color: language === "en" ? C.gold : C.textMuted },
          ]}
        >
          EN
        </AppText>
      </Pressable>

      <AppText style={[styles.separator, { color: C.textMuted }]}>|</AppText>

      <Pressable onPress={() => changeLanguage("ar")} hitSlop={8}>
        <AppText
          weight={language === "ar" ? "Bold" : "Regular"}
          style={[
            styles.label,
            { color: language === "ar" ? C.gold : C.textMuted },
          ]}
        >
          عربي
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 14,
  },
  separator: {
    fontSize: 14,
  },
});
