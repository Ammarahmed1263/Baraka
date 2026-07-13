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
import { NiyyahChecklist } from "./NiyyahChecklist";
import { type NiyyahOption, type UserActivity } from "@types";

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
  onAddCustomNiyyah: (text: string, textAr: string) => void;
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
          { paddingTop: topPadding + 8, paddingBottom: isWeb ? 34 + 40 : 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AnimatedPressable
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: C.backgroundSubtle }]}
          >
            <Feather name="x" size={20} color={C.text} />
          </AnimatedPressable>
          {completed && (
            <View
              style={[
                styles.completedBadge,
                { backgroundColor: C.tint + "22", borderColor: C.tint + "55" },
              ]}
            >
              <Feather name="check-circle" size={14} color={C.tint} />
              <AppText
                weight="Medium"
                style={[styles.completedBadgeText, { color: C.tint }]}
              >
                {t("activity.completedToday")}
              </AppText>
            </View>
          )}
        </View>

        <LinearGradient
          colors={C.cardGradient}
          style={[styles.activityHeader, {
            shadowColor: isDark ? "transparent" : "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDark ? 0 : 0.08,
            shadowRadius: 4,
            elevation: isDark ? 0 : 2,
          }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <AppText weight="Bold" style={[styles.activityName, { color: isDark ? "#FFF" : C.text }]}>
            {activityName}
          </AppText>
          {showBilingual && (
            <AppText weight="Regular" style={[styles.activityNameAr, { color: isDark ? "rgba(255,255,255,0.8)" : C.textSecondary }]}>
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
                weight="Bold"
                style={[styles.basicBadgeText, { color: C.tint }]}
              >
                {t("activity.coreIntention")}
              </AppText>
            </View>
            <AnimatedPressable
              onPress={() => setShowEditNiyyah(!showEditNiyyah)}
            >
              <Feather name="edit-2" size={16} color={C.tintLight} />
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
                  variant="ghost"
                  label={t("common.cancel")}
                  onPress={() => setShowEditNiyyah(false)}
                />
                <AppButton
                  variant="primary"
                  label={t("common.save")}
                  onPress={onSaveNiyyah}
                />
              </View>
            </>
          ) : (
            <>
              <AppText
                weight="Regular"
                style={[styles.niyyahText, { color: C.text }]}
              >
                {activity.customNiyyah ?? localize(activity.niyyahText)}
              </AppText>
              {showBilingual && !activity.customNiyyah && (
                <AppText
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
            name="heart"
            size={14}
            color={C.textMuted}
            style={{ marginTop: 2 }}
          />
          <AppText
            style={[styles.disclaimerText, { color: C.textSecondary }]}
          >
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
            <Feather name="star" size={16} color={C.gold} />
            <AppText
              weight="Medium"
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
            <Feather name="book-open" size={14} color={C.tint} />
            <AppText
              weight="Medium"
              style={[styles.sourceText, { color: C.tint }]}
            >
              {localize(activity.hadithRef)}
            </AppText>
          </View>
        )}

        {completed ? (
          <View style={{ gap: 10 }}>
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
              <Feather name="check-circle" size={20} color={C.tint} />
              <AppText
                weight="Bold"
                style={[styles.renewText, { color: C.tint }]}
              >
                {t("activity.renewedButton")}
              </AppText>
            </View>
            <AppButton
              variant="outline"
              label={t("activity.unmark")}
              onPress={onUnmark}
              style={{ marginBottom: 10 }}
            />
          </View>
        ) : (
          <AppButton
            variant="primary"
            icon="refresh-cw"
            label={t("activity.renewNiyyah", { count: localSelected.length + 1 })}
            onPress={onSaveAndRenew}
          />
        )}
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
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  completedBadgeText: { fontSize: 13 },
  activityHeader: { borderRadius: 16, padding: 24, marginBottom: 16, gap: 6 },
  activityName: { fontSize: 24, color: "#FFF" },
  activityNameAr: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "right",
  },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  basicBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  basicBadgeText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  niyyahText: { fontSize: 15, lineHeight: 24 },
  arabicText: {
    fontSize: 15,
    textAlign: "right",
    lineHeight: 26,
    marginTop: 4,
  },
  editActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    justifyContent: "flex-end",
  },
  disclaimerBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  disclaimerText: { flex: 1, fontSize: 13, lineHeight: 18 },
  ajrPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  ajrText: { flex: 1, fontSize: 13, lineHeight: 18 },
  sourceSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  sourceText: { fontSize: 12 },
  renewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 18,
    borderRadius: 16,
    marginBottom: 10,
  },
  renewText: { fontSize: 17 },
});
