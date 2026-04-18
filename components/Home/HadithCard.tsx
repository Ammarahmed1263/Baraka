import { View, StyleSheet, useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "@/components/UI/AppText";
import { HADITH_OPENER } from "@/constants/data";

interface HadithCardProps {
  lang: "en" | "ar";
}

export default function HadithCard({ lang }: HadithCardProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <LinearGradient
      colors={isDark ? ["#1A3326", "#0D2E1F"] : ["#2D7A4F", "#1A5C38"]}
      style={styles.hadithCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.hadithDecor}>
        <AppText style={styles.hadithDecorText}>❝</AppText>
      </View>
      <AppText weight="Bold" style={styles.hadithText}>
        {lang === "ar" ? HADITH_OPENER.ar : HADITH_OPENER.en}
      </AppText>
      <AppText weight="Regular" style={styles.hadithRef}>
        {HADITH_OPENER.ref}
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
  hadithDecorText: { fontSize: 28, color: "rgba(255,255,255,0.3)" },
  hadithText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.95)",
    marginBottom: 10,
  },
  hadithRef: { fontSize: 12, color: "rgba(255,255,255,0.65)" },
});
