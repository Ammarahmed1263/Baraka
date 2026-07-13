import { View, StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "@components/UI/AppText";
import { HADITH_OPENER } from "@data/uiConstants";
import { useSettingsStore } from "@store";
import { useLanguage } from "@i18n";

export default function HadithCard() {
  const { colors: C, isDark } = useTheme();
  const { language: lang } = useLanguage();
  const showBilingual = useSettingsStore((s) => s.settings.showBilingual);

  return (
    <LinearGradient
      colors={C.cardGradient}
      style={[styles.hadithCard, {
        shadowColor: isDark ? "transparent" : "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0 : 0.08,
        shadowRadius: 4,
        elevation: isDark ? 0 : 2,
      }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.hadithDecor}>
        <AppText style={[styles.hadithDecorText, { color: C.gold }]}>❝</AppText>
      </View>

      {showBilingual ? (
        <View style={styles.bilingualContainer}>
          <AppText weight="Bold" style={[styles.hadithText, styles.arabicText, { color: isDark ? "rgba(255,255,255,0.95)" : C.text }]}>
            {HADITH_OPENER.text.ar}
          </AppText>
          <AppText weight="Medium" style={[styles.hadithText, styles.englishText, { color: isDark ? "rgba(255,255,255,0.85)" : C.textSecondary }]}>
            {HADITH_OPENER.text.en}
          </AppText>
        </View>
      ) : (
        <AppText weight="Bold" style={[styles.hadithText, { color: isDark ? "rgba(255,255,255,0.95)" : C.text }]}>
          {lang === "ar" ? HADITH_OPENER.text.ar : HADITH_OPENER.text.en}
        </AppText>
      )}

      <View style={[styles.refAccent, { backgroundColor: C.gold }]} />
      
      <AppText weight="Regular" style={[styles.hadithRef, { color: C.gold }]}>
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    overflow: "hidden",
  },
  hadithDecor: { marginBottom: 8 },
  hadithDecorText: { fontSize: 40, opacity: 0.3, marginBottom: -10 },
  hadithText: {
    fontSize: 17,
    lineHeight: 26,
    color: "rgba(255,255,255,0.95)",
    marginBottom: 16,
  },
  bilingualContainer: {
    gap: 12,
    marginBottom: 16,
  },
  arabicText: {
    fontSize: 19,
    lineHeight: 30,
    marginBottom: 0,
  },
  englishText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.85,
    marginBottom: 0,
  },
  refAccent: {
    width: 30,
    height: 3,
    marginBottom: 8,
    borderRadius: 1.5,
  },
  hadithRef: { fontSize: 13, letterSpacing: 0.2 },
});

