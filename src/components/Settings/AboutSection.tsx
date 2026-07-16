import React, { useCallback } from "react";
import { View, StyleSheet, Linking, Alert, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { AppText } from "@components/UI/AppText";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppIcon as Feather } from "@components/UI/AppIcon";
import SettingRow from "./SettingRow";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

export const AboutSection = React.memo(() => {
  const { t } = useTranslation();
  const { colors: C } = useTheme();

  const handleEmailPress = useCallback(async () => {
    const email = process.env.EXPO_PUBLIC_SUPPORT_EMAIL!;
    const subject = encodeURIComponent("Baraka App Support");
    const body = encodeURIComponent(`

---
Please describe your issue or feedback above.

Device Info:
OS: ${Platform.OS} ${Platform.Version}
`);
    try {
      await Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
      console.log("email sent");
    } catch (error) {
      console.log("url failed: ", error);
      Alert.alert(
        t("error.title"),
        `${t("error.noEmailClient", "No email app found. Reach us at:")}\n\n${email}`,
      );
    }
  }, [t]);

  const handlePrivacyPress = useCallback(async () => {
    try {
      await Linking.openURL(process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL!);
    } catch (error) {
      console.log("url failed: ", error);
    }
  }, []);

  return (
    <>
      <AppText weight='Bold' variant='bodyLarge' style={[styles.sectionLabel, { color: C.gold }]}>
        {t("settings.about")}
      </AppText>
      <View
        style={[
          styles.settingsCard,
          { backgroundColor: C.backgroundCard, borderColor: C.border },
        ]}
      >
        <View style={styles.aboutCard}>
          <AppText weight='Bold' variant='bodyLarge' style={{ color: C.text }}>
            {t("settings.aboutTitle")}
          </AppText>
          <AppText
            weight='Regular'
            variant='body'
            style={[styles.aboutDesc, { color: C.textSecondary }]}
          >
            {t("settings.aboutDesc")}
          </AppText>
          <AppText
            weight='Regular'
            variant='bodyLarge'
            style={[styles.aboutQuote, { color: C.gold }]}
          >
            {t("settings.quote")}
          </AppText>
          <AppText
            weight='Regular'
            variant='caption'
            style={[styles.aboutRef, { color: C.textMuted }]}
          >
            {t("settings.quoteRef")}
          </AppText>
        </View>
      </View>

      <AppText weight='Bold' style={[styles.sectionLabel, { color: C.gold }]}>
        {t("settings.support")}
      </AppText>
      <View
        style={[
          styles.linksContainer,
          { backgroundColor: C.backgroundCard, borderColor: C.border },
        ]}
      >
        {/* 
        <SettingRow
          icon='help-circle'
          iconColor='#3B82F6'
          iconBg='#3B82F620'
          label={t("settings.faq")}
          desc={t("settings.faqDesc")}
          right={
            <Feather
              name='chevron-right'
              size={18}
              color={C.textMuted}
              flipRTL
            />
          }
        />
        <View style={[styles.divider, { backgroundColor: C.border }]} />
        */}
        <SettingRow
          icon='mail'
          iconColor='#10B981'
          iconBg='#10B98120'
          label={t("settings.contactSupport")}
          desc={process.env.EXPO_PUBLIC_SUPPORT_EMAIL!}
          right={
            <AnimatedPressable
              onPress={handleEmailPress}
              style={[
                styles.actionButton,
                { backgroundColor: C.backgroundSubtle },
              ]}
            >
              <AppText
                weight='Medium'
                variant='body'
                style={{ color: C.textSecondary }}
              >
                {t("settings.emailUs")}
              </AppText>
            </AnimatedPressable>
          }
        />
      </View>

      <View style={styles.footerInfo}>
        <AppText
          weight='Regular'
          variant='body'
          style={[styles.versionText, { color: C.textMuted }]}
        >
          {t("settings.version")}
        </AppText>
        <AppText
          weight='Regular'
          variant='caption'
          style={{ color: C.textMuted }}
        >
          {t("settings.madeWithLove")}
        </AppText>
      </View>

      <View
        style={[
          styles.privacyNote,
          { backgroundColor: C.successLight, borderColor: C.tint + "30" },
        ]}
      >
        <Feather name='shield' size={16} color={C.tint} />
        <View style={{ flex: 1 }}>
          <AppText
            weight='Regular'
            variant='body'
            style={{ color: C.tint }}
          >
            {t("settings.privacy")}
          </AppText>
          <AnimatedPressable onPress={handlePrivacyPress} hitSlop={20}>
            <AppText
              weight='Medium'
              variant='body'
              style={[
                styles.privacyLink,
                { color: C.gold, textDecorationLine: "underline" },
              ]}
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
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    marginTop: spacing.sm,
  },
  settingsCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xxl,
  },
  linksContainer: {
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  footerInfo: {
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  versionText: {
    marginBottom: spacing.xs,
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  aboutCard: {
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  aboutDesc: {
    lineHeight: 20,
  },
  aboutQuote: {
    fontStyle: "italic",
    textAlign: "center",
    marginTop: spacing.md,
    lineHeight: 22,
  },
  aboutRef: {
    textAlign: "center",
    marginTop: -2,
  },
  privacyNote: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  privacyLink: {
    marginTop: spacing.xs,
  },
});
