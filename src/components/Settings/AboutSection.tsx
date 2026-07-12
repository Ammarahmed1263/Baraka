import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { AppText } from "@components/UI/AppText";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppIcon as Feather } from "@components/UI/AppIcon";

export const AboutSection = React.memo(() => {
  const { t } = useTranslation();
  const { colors: C } = useTheme();

  return (
    <>
      <AppText weight="Bold" style={[styles.sectionLabel, { color: C.gold }]}>
        {t("settings.about")}
      </AppText>
      <View
        style={[
          styles.settingsCard,
          { backgroundColor: C.backgroundCard, borderColor: C.border },
        ]}
      >
        <View style={styles.aboutCard}>
          <AppText
            weight="Bold"
            style={[styles.aboutTitle, { color: C.text }]}
          >
            {t("settings.aboutTitle")}
          </AppText>
          <AppText
            weight="Regular"
            style={[styles.aboutDesc, { color: C.textSecondary }]}
          >
            {t("settings.aboutDesc")}
          </AppText>
          <AppText
            weight="Regular"
            style={[styles.aboutQuote, { color: C.gold }]}
          >
            {t("settings.quote")}
          </AppText>
          <AppText
            weight="Regular"
            style={[styles.aboutRef, { color: C.textMuted }]}
          >
            {t("settings.quoteRef")}
          </AppText>
          <AppText
            weight="Regular"
            style={[styles.version, { color: C.textMuted }]}
          >
            {t("settings.version")}
          </AppText>
        </View>
      </View>

      {/* Privacy Note */}
      <View
        style={[
          styles.privacyNote,
          { backgroundColor: C.successLight, borderColor: C.tint + "30" },
        ]}
      >
        <Feather name="shield" size={16} color={C.tint} />
        <View style={{ flex: 1 }}>
          <AppText
            weight="Regular"
            style={[styles.privacyText, { color: C.tint }]}
          >
            {t("settings.privacy")}
          </AppText>
          <AnimatedPressable
            onPress={() =>
              Linking.openURL(
                "https://pr-checklist.notion.site/Privacy-Policy-for-Baraka-39a68938c5b98013985cd36103ad3102"
              )
            }
            hitSlop={20}
          >
            <AppText
              weight="Medium"
              style={{
                color: C.gold,
                textDecorationLine: "underline",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              {t("settings.privacyPolicy")}
            </AppText>
          </AnimatedPressable>
        </View>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 8,
  },
  settingsCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  aboutCard: {
    paddingVertical: 8,
    gap: 8,
  },
  aboutTitle: {
    fontSize: 16,
  },
  aboutDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  aboutQuote: {
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
  aboutRef: {
    fontSize: 12,
    textAlign: "center",
    marginTop: -2,
  },
  version: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 16,
  },
  privacyNote: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 24,
  },
  privacyText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
