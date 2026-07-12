import React from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import { AppText } from "@components/UI/AppText";
import { AppTextInput } from "@components/UI/AppTextInput";
import { AppButton } from "@components/UI/AppButton";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppIcon as Feather } from "@components/UI/AppIcon";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { type NiyyahOption } from "@types";

interface ActivityReflectStepProps {
  activityName: string;
  allAdvanced: NiyyahOption[];
  localSelected: string[];
  reflectionNote: string;
  setReflectionNote: (note: string) => void;
  impactfulNiyyah: string;
  setImpactfulNiyyah: (id: string) => void;
  onSaveReflection: () => void;
  cleanSelectedCount: number;
  ajrCount: number;
  localize: (text: any) => string;
  lang: string;
}

export const ActivityReflectStep = React.memo(
  ({
    activityName,
    allAdvanced,
    localSelected,
    reflectionNote,
    setReflectionNote,
    impactfulNiyyah,
    setImpactfulNiyyah,
    onSaveReflection,
    cleanSelectedCount,
    ajrCount,
    localize,
    lang,
  }: ActivityReflectStepProps) => {
    const { t } = useTranslation();
    const { colors: C, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const isWeb = Platform.OS === "web";
    const topPadding = isWeb ? 67 : insets.top;

    const selectedTexts = allAdvanced
      .filter((n) => localSelected.includes(n.id))
      .slice(0, 4);

    return (
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding + 8, paddingBottom: isWeb ? 34 + 40 : 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AnimatedPressable
            onPress={() => router.back()}
            style={[
              styles.backButton,
              { backgroundColor: C.backgroundSubtle },
            ]}
          >
            <Feather name="x" size={20} color={C.text} />
          </AnimatedPressable>
        </View>

        <LinearGradient
          colors={
            isDark
              ? [C.backgroundSubtle, C.background]
              : [C.tint, C.tintDark]
          }
          style={styles.reflectBanner}
        >
          <Feather name="check-circle" size={28} color={C.gold} />
          <AppText weight="Bold" style={styles.reflectTitle}>
            {t("activity.renewed")}
          </AppText>
          <AppText weight="Regular" style={styles.reflectSub}>
            {activityName}
          </AppText>
          {cleanSelectedCount > 0 && (
            <View style={styles.multiplierBadge}>
              <AppText weight="Bold" style={styles.multiplierText}>
                {t("activity.multiplierBadge", { count: ajrCount })}
              </AppText>
            </View>
          )}
        </LinearGradient>

        {selectedTexts.length > 0 && (
          <View
            style={[
              styles.reflectNiyyahList,
              { backgroundColor: C.backgroundCard, borderColor: C.border },
            ]}
          >
            <AppText
              weight="Medium"
              style={[styles.sectionLabel, { color: C.textSecondary }]}
            >
              {t("activity.intentionsForAct")}
            </AppText>
            {selectedTexts.map((n) => (
              <View key={n.id} style={styles.reflectNiyyahItem}>
                <Feather
                  name="check"
                  size={14}
                  color={C.tint}
                  style={{ marginTop: 2 }}
                />
                <AppText
                  weight="Regular"
                  style={[styles.reflectNiyyahText, { color: C.text }]}
                >
                  {localize(n.text)}
                </AppText>
              </View>
            ))}
          </View>
        )}

        <View
          style={[
            styles.reflectCard,
            { backgroundColor: C.backgroundCard, borderColor: C.border },
          ]}
        >
          <AppText
            weight="Bold"
            style={[styles.reflectPromptLabel, { color: C.text }]}
          >
            {t("activity.quickReflection")}{" "}
            <AppText weight="Regular" style={{ color: C.textMuted, fontSize: 13 }}>
              ({t("common.optional")})
            </AppText>
          </AppText>
          <AppText
            weight="Regular"
            style={[styles.reflectPromptHint, { color: C.textSecondary }]}
          >
            {t("activity.reflectPrompt", { count: ajrCount })}
          </AppText>
          <AppTextInput
            value={reflectionNote}
            onChangeText={setReflectionNote}
            multiline
            placeholder={t("activity.reflectionPlaceholder")}
          />

          {cleanSelectedCount > 0 && (
            <>
              <AppText
                weight="Medium"
                style={[styles.impactLabel, { color: C.textSecondary }]}
              >
                {t("activity.impactQuestion")}
              </AppText>
              {allAdvanced
                .filter((n) => localSelected.includes(n.id))
                .map((n) => (
                  <AnimatedPressable
                    key={n.id}
                    onPress={() =>
                      setImpactfulNiyyah(impactfulNiyyah === n.id ? "" : n.id)
                    }
                    style={[
                      styles.impactOption,
                      {
                        backgroundColor:
                          impactfulNiyyah === n.id
                            ? C.tint + "22"
                            : C.backgroundSubtle,
                        borderColor:
                          impactfulNiyyah === n.id ? C.tint : C.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.impactDot,
                        {
                          backgroundColor:
                            impactfulNiyyah === n.id ? C.tint : "transparent",
                          borderColor: C.tint,
                        },
                      ]}
                    />
                    <AppText
                      weight="Regular"
                      style={[styles.impactOptionText, { color: C.text }]}
                    >
                      {localize(n.text)}
                    </AppText>
                  </AnimatedPressable>
                ))}
            </>
          )}
        </View>

        <View style={styles.reflectActions}>
          <AppButton
            variant="outline"
            label={t("common.skip")}
            onPress={() => router.back()}
            style={{ flex: 1 }}
          />
          <AppButton
            variant="primary"
            label={t("activity.saveReflection")}
            icon="book"
            onPress={onSaveReflection}
            style={{ flex: 2 }}
          />
        </View>
      </ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  reflectBanner: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  reflectTitle: { fontSize: 22, color: "#FFF" },
  reflectSub: { fontSize: 15, color: "rgba(255,255,255,0.8)" },
  multiplierBadge: {
    backgroundColor: "#C9A84C33",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C9A84C88",
    marginTop: 4,
  },
  multiplierText: { color: "#C9A84C", fontSize: 14 },
  reflectNiyyahList: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    gap: 10,
  },
  reflectNiyyahItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  reflectNiyyahText: { flex: 1, fontSize: 14, lineHeight: 20 },
  reflectCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    gap: 12,
  },
  reflectPromptLabel: { fontSize: 16 },
  reflectPromptHint: { fontSize: 14, lineHeight: 20, marginTop: -4 },
  impactLabel: { fontSize: 13, textTransform: "uppercase", letterSpacing: 0.6 },
  impactOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 6,
  },
  impactDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    flexShrink: 0,
  },
  impactOptionText: { flex: 1, fontSize: 13, lineHeight: 18 },
  reflectActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  sectionLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});
