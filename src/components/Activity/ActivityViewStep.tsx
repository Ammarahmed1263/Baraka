import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
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
import { NiyyahChecklist } from "./NiyyahChecklist";
import { type NiyyahOption, type UserActivity } from "@types";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

interface ActivityViewStepProps {
  activity: UserActivity;
  activityName: string;
  showBilingual: boolean;
  completed: boolean;
  allAdvanced: NiyyahOption[];
  localSelected: string[];
  toggleNiyyah: (id: string) => void;
  showEditNiyyah: boolean;
  setShowEditNiyyah: (show: boolean) => void;
  editedNiyyah: string;
  setEditedNiyyah: (text: string) => void;
  onSaveNiyyah: () => void;
  onAddCustomNiyyah: (text: string) => void;
  onSaveAndRenew: () => void;
  onUnmark: () => void;
  localize: (text: any) => string;
}

export const ActivityViewStep = React.memo(
  ({
    activity,
    activityName,
    showBilingual,
    completed,
    allAdvanced,
    localSelected,
    toggleNiyyah,
    showEditNiyyah,
    setShowEditNiyyah,
    editedNiyyah,
    setEditedNiyyah,
    onSaveNiyyah,
    onAddCustomNiyyah,
    onSaveAndRenew,
    onUnmark,
    localize,
  }: ActivityViewStepProps) => {
    const { t } = useTranslation();
    const { colors: C, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const isWeb = Platform.OS === "web";
    const topPadding = isWeb ? 67 : insets.top;

    return (
      <ScrollView
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
            <Feather name='x' size={20} color={C.text} />
          </AnimatedPressable>
          {completed && (
            <View
              style={[
                styles.completedBadge,
                { backgroundColor: C.tint + "22", borderColor: C.tint + "55" },
              ]}
            >
              <Feather name='check-circle' size={14} color={C.tint} />
              <AppText weight='Medium' variant='footnote' style={{ color: C.tint }}>
                {t("activity.completedToday")}
              </AppText>
            </View>
          )}
        </View>

        <LinearGradient
          colors={C.cardGradient}
          style={[
            styles.activityHeader,
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
          <AppText weight='Bold' variant='titleLarge' style={{ color: C.text }}>
            {activityName}
          </AppText>
          {showBilingual && (
            <AppText
              weight='Regular'
              variant='bodyLarge'
              style={[styles.activityNameAr, { color: C.textSecondary }]}
            >
              {activity.name.ar}
            </AppText>
          )}
        </LinearGradient>

        <View
          style={[
            styles.card,
            { backgroundColor: C.backgroundCard, borderColor: C.border },
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[styles.basicBadge, { backgroundColor: C.tint + "22" }]}
            >
              <AppText
                weight='Bold'
                variant='caption'
                style={[styles.basicBadgeText, { color: C.tint }]}
              >
                {t("activity.coreIntention")}
              </AppText>
            </View>
            <AnimatedPressable
              onPress={() => setShowEditNiyyah(!showEditNiyyah)}
            >
              <Feather name='edit-2' size={16} color={C.tintLight} />
            </AnimatedPressable>
          </View>

          {showEditNiyyah ? (
            <>
              <AppTextInput
                value={editedNiyyah}
                onChangeText={setEditedNiyyah}
                multiline
              />
              <View style={styles.editActions}>
                <AppButton
                  variant='ghost'
                  label={t("common.cancel")}
                  onPress={() => setShowEditNiyyah(false)}
                />
                <AppButton
                  variant='primary'
                  label={t("common.save")}
                  onPress={onSaveNiyyah}
                  disabled={!editedNiyyah.trim()}
                />
              </View>
            </>
          ) : (
            <>
              <AppText weight='Regular' variant='bodyLarge' style={[styles.niyyahText, { color: C.text }]}>
                {activity.customNiyyah ?? localize(activity.niyyahText)}
              </AppText>
              {showBilingual && !activity.customNiyyah && (
                <AppText
                  variant='bodyLarge'
                  style={[styles.arabicText, { color: C.textSecondary }]}
                >
                  {activity.niyyahText.ar}
                </AppText>
              )}
            </>
          )}
        </View>

        <NiyyahChecklist
          allAdvanced={allAdvanced}
          localSelected={localSelected}
          onToggleNiyyah={toggleNiyyah}
          onAddCustomNiyyah={onAddCustomNiyyah}
          showBilingual={showBilingual}
          localize={localize}
        />

        <View
          style={[
            styles.disclaimerBanner,
            { backgroundColor: C.backgroundSubtle, borderColor: C.border },
          ]}
        >
          <Feather
            name='heart'
            size={14}
            color={C.textMuted}
            style={styles.disclaimerIcon}
          />
          <AppText variant='footnote' style={[styles.disclaimerText, { color: C.textSecondary }]}>
            {t("activity.niyyahDisclaimer")}
          </AppText>
        </View>

        {localSelected.length > 0 && (
          <View
            style={[
              styles.ajrPreview,
              { backgroundColor: C.gold + "22", borderColor: C.gold + "55" },
            ]}
          >
            <Feather name='star' size={16} color={C.gold} />
            <AppText
              weight='Medium'
              variant='footnote'
              style={[styles.ajrText, { color: C.gold }]}
            >
              {t("activity.ajrPreview", { count: localSelected.length + 1 })}
            </AppText>
          </View>
        )}

        {activity.hadithRef && (
          <View
            style={[
              styles.sourceSection,
              { backgroundColor: C.successLight, borderColor: C.tint + "30" },
            ]}
          >
            <Feather name='book-open' size={14} color={C.tint} />
            <AppText weight='Medium' variant='caption' style={{ color: C.tint }}>
              {localize(activity.hadithRef)}
            </AppText>
          </View>
        )}

        {completed ? (
          <View style={styles.completedActions}>
            <View
              style={[
                styles.renewButton,
                {
                  backgroundColor: C.tint + "22",
                  borderColor: C.tint + "55",
                  borderWidth: 1,
                },
              ]}
            >
              <Feather name='check-circle' size={20} color={C.tint} />
              <AppText weight='Bold' variant='subtitle' style={{ color: C.tint }}>
                {t("activity.renewedButton")}
              </AppText>
            </View>
            <AppButton
              variant='outline'
              label={t("activity.unmark")}
              onPress={onUnmark}
              style={styles.unmarkButton}
            />
          </View>
        ) : (
          <AppButton
            variant='primary'
            icon='refresh-cw'
            label={t("activity.renewNiyyah", {
              count: localSelected.length + 1,
            })}
            onPress={onSaveAndRenew}
          />
        )}
      </ScrollView>
    );
  },
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
    width: 40,
    height: 40,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  activityHeader: {
    borderRadius: radius.lg,
    padding: spacing.xxl,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  activityNameAr: {
    textAlign: "right",
  },
  card: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  basicBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  basicBadgeText: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  niyyahText: { lineHeight: 24 },
  arabicText: {
    textAlign: "right",
    marginTop: spacing.xs,
    lineHeight: 26,
  },
  editActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
    justifyContent: "flex-end",
  },
  disclaimerBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  disclaimerIcon: { marginTop: spacing.xs },
  disclaimerText: { flex: 1, lineHeight: 18 },
  ajrPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  ajrText: { flex: 1 },
  sourceSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.xl,
    borderWidth: 1,
  },
  completedActions: { gap: spacing.sm },
  renewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
  },
  unmarkButton: { marginBottom: spacing.sm },
});
