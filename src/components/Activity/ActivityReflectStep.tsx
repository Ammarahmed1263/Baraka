import React from "react";
import { View, StyleSheet, Platform } from "react-native";
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
import { KeyboardAwareScrollViewCompat } from "@components/KeyboardAwareScrollViewCompat";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

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
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding + spacing.sm, paddingBottom: isWeb ? 34 + 40 : 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AnimatedPressable
            onPress={() => router.back()}
            style={[
              styles.backButton,
              { backgroundColor: C.backgroundSubtle, borderColor: C.border },
            ]}
          >
            <Feather name="chevron-down" size={24} color={C.text} />
          </AnimatedPressable>
        </View>

        <LinearGradient
          colors={C.cardGradient}
          style={[styles.reflectBanner, {
            shadowColor: isDark ? "transparent" : C.shadowColor,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDark ? 0 : 0.08,
            shadowRadius: 4,
            elevation: isDark ? 0 : 2,
          }]}
        >
          <Feather name="check-circle" size={28} color={isDark ? C.gold : C.tint} />
          <AppText weight="Bold" variant="title" style={{ color: C.text }}>
            {t("activity.renewed")}
          </AppText>
          <AppText weight="Regular" variant="bodyLarge" style={{ color: C.textSecondary }}>
            {activityName}
          </AppText>
          {cleanSelectedCount > 0 && (
            <View style={[styles.multiplierBadge, { backgroundColor: C.gold + "33", borderColor: C.gold + "88" }]}>
              <AppText weight="Bold" variant="body" style={{ color: C.gold }}>
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
              variant="caption"
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
                  style={styles.reflectNiyyahCheck}
                />
                <AppText weight="Regular" variant="body" style={[styles.reflectNiyyahText, { color: C.text }]}>
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
          <AppText weight="Bold" variant="bodyLarge" style={{ color: C.text }}>
            {t("activity.quickReflection")}{" "}
            <AppText weight="Regular" variant="footnote" style={{ color: C.textMuted }}>
              ({t("common.optional")})
            </AppText>
          </AppText>
          <AppText
            weight="Regular"
            variant="body"
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
                variant="footnote"
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
                    <AppText weight="Regular" variant="footnote" style={[styles.impactOptionText, { color: C.text }]}>
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
      </KeyboardAwareScrollViewCompat>
    );
  }
);

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: spacing.xl },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  reflectBanner: {
    borderRadius: radius.lg,
    padding: spacing.xxl,
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  multiplierBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    borderWidth: 1,
    marginTop: spacing.xs,
  },
  reflectNiyyahList: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  reflectNiyyahItem: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
  },
  reflectNiyyahCheck: { marginTop: spacing.xs },
  reflectNiyyahText: { flex: 1, lineHeight: 20 },
  reflectCard: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    gap: spacing.md,
  },
  reflectPromptHint: { marginTop: -spacing.xs, lineHeight: 20 },
  impactLabel: { textTransform: "uppercase", letterSpacing: 0.6 },
  impactOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  impactDot: {
    width: 16,
    height: 16,
    borderRadius: radius.sm,
    borderWidth: 2,
    flexShrink: 0,
  },
  impactOptionText: { flex: 1, lineHeight: 18 },
  reflectActions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs },
  sectionLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});
