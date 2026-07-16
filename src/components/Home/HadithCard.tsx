import { View, StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "@components/UI/AppText";
import { HADITH_OPENER } from "@data/uiConstants";
import { useSettingsStore } from "@store";
import { useLanguage } from "@i18n";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";
import { typography } from "@constants/typography";

export default function HadithCard() {
  const { colors: C, isDark } = useTheme();
  const { language: lang } = useLanguage();
  const showBilingual = useSettingsStore((s) => s.settings.showBilingual);

  return (
    <LinearGradient
      colors={C.cardGradient}
      style={[
        styles.hadithCard,
        {
          shadowColor: isDark ? "transparent" : C.shadowColor,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0 : 0.08,
          shadowRadius: 4,
          elevation: isDark ? 0 : 2,
        },
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.hadithDecor}>
        <AppText style={[styles.hadithDecorText, { color: C.gold }]}>❝</AppText>
      </View>

      {showBilingual ? (
        <View style={styles.bilingualContainer}>
          <AppText
            weight='Bold'
            style={[styles.arabicText, { color: C.text }]}
          >
            {HADITH_OPENER.text.ar}
          </AppText>
          <AppText
            weight='Medium'
            style={[styles.englishText, { color: C.textSecondary }]}
          >
            {HADITH_OPENER.text.en}
          </AppText>
        </View>
      ) : (
        <AppText weight='Bold' variant='bodyLarge' style={[styles.hadithText, { color: C.text }]}>
          {lang === "ar" ? HADITH_OPENER.text.ar : HADITH_OPENER.text.en}
        </AppText>
      )}

      <View style={[styles.refAccent, { backgroundColor: C.gold }]} />

      <AppText weight='Regular' variant='caption' style={{ color: C.gold, letterSpacing: 0.2 }}>
        {showBilingual
          ? `${HADITH_OPENER.ref.ar} | ${HADITH_OPENER.ref.en}`
          : lang === "ar"
            ? HADITH_OPENER.ref.ar
            : HADITH_OPENER.ref.en}
      </AppText>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hadithCard: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  hadithDecor: { marginBottom: spacing.sm },
  hadithDecorText: { fontSize: 40, opacity: 0.3, marginBottom: -10 },
  hadithText: {
    lineHeight: 26,
    marginBottom: spacing.lg,
  },
  bilingualContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  arabicText: {
    fontSize: typography.subtitle.ar.fontSize,
    lineHeight: 30,
  },
  englishText: {
    fontSize: typography.body.en.fontSize,
    lineHeight: 22,
  },
  refAccent: {
    width: 24,
    height: 1.5,
    borderRadius: 1.5,
    marginBottom: spacing.md,
  },
});
