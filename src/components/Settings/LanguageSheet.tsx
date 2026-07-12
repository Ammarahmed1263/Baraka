import React from "react";
import { View, StyleSheet } from "react-native";
import { AppBottomSheet } from "@components/UI/AppBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AppText } from "@components/UI/AppText";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppIcon as Feather } from "@components/UI/AppIcon";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";

interface LanguageSheetProps {
  currentLang: string;
  onSelect: (lang: "en" | "ar") => void;
}

export const LanguageSheet = React.forwardRef<BottomSheetModal, LanguageSheetProps>(
  ({ currentLang, onSelect }, ref) => {
    const { t } = useTranslation();
    const { colors: C } = useTheme();

    return (
      <AppBottomSheet
        ref={ref}
        snapPoints={["35%"]}
        enablePanDownToClose
      >
        <AppText weight="Bold" style={[styles.sheetTitle, { color: C.text }]}>
          {t("settings.selectLanguage", "Select Language")}
        </AppText>
        <AppText
          weight="Regular"
          style={[styles.sheetDesc, { color: C.textMuted }]}
        >
          {t(
            "settings.selectLanguageDesc",
            "Choose your preferred language for the app interface."
          )}
        </AppText>

        <View style={styles.sheetOptions}>
          <AnimatedPressable
            style={[
              styles.langOption,
              {
                backgroundColor:
                  currentLang === "en" ? C.tint + "15" : C.border + "50",
              },
              currentLang === "en" && { borderColor: C.tint, borderWidth: 1 },
            ]}
            onPress={() => onSelect("en")}
          >
            <AppText
              weight="Medium"
              style={{ color: currentLang === "en" ? C.tint : C.text }}
            >
              English
            </AppText>
            {currentLang === "en" && <Feather name="check" size={20} color={C.tint} />}
          </AnimatedPressable>

          <AnimatedPressable
            style={[
              styles.langOption,
              {
                backgroundColor:
                  currentLang === "ar" ? C.tint + "15" : C.border + "50",
              },
              currentLang === "ar" && { borderColor: C.tint, borderWidth: 1 },
            ]}
            onPress={() => onSelect("ar")}
          >
            <AppText
              weight="Medium"
              style={{
                color: currentLang === "ar" ? C.tint : C.text,
                fontFamily: "Tajawal",
              }}
            >
              عربي
            </AppText>
            {currentLang === "ar" && <Feather name="check" size={20} color={C.tint} />}
          </AnimatedPressable>
        </View>
      </AppBottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  sheetTitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  sheetDesc: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sheetOptions: {
    gap: 12,
  },
  langOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
});
