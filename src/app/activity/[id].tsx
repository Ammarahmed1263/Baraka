import { type NiyyahOption } from "@types";
import { getNiyyahOptions } from "@data/niyyahTemplates";
import { useLocalize } from "@hooks/useLocalize";
import {
  useActivitiesStore,
  useLogsStore,
  useJournalStore,
  useSettingsStore,
} from "@store";
import { useTodayLogs } from "@hooks/useTodayLogs";
import { useLanguage } from "@i18n";
import { AppIcon as Feather } from "@components/UI/AppIcon";
import { getTodayString } from "@utils/date";
import { Haptic } from "@utils/haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, View, Text } from "react-native";
import { AppTextInput } from "@components/UI/AppTextInput";
import { AppButton } from "@components/UI/AppButton";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { useTheme } from "@context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "@components/UI/AppText";

type Step = "view" | "reflect";

const ROLE_META = {
  homemaker: { icon: "home", color: "#EC4899", label: "Homemaker" },
  parent: { icon: "users", color: "#F97316", label: "Parent" },
  student: { icon: "book", color: "#8B5CF6", label: "Student" },
  professional: { icon: "briefcase", color: "#3B82F6", label: "Professional" },
};

export default function ActivityDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors: C, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;

  const activities = useActivitiesStore((s) => s.activities);
  const updateActivity = useActivitiesStore((s) => s.updateActivity);
  const settings = useSettingsStore((s) => s.settings);
  const getProfileTags = useSettingsStore((s) => s.getProfileTags);
  const markComplete = useLogsStore((s) => s.markComplete);
  const unmarkComplete = useLogsStore((s) => s.unmarkComplete);
  const addJournalEntry = useJournalStore((s) => s.addJournalEntry);
  const { isCompletedToday } = useTodayLogs();

  const lang = useLanguage().language;
  const localize = useLocalize();
  const showBilingual = settings.showBilingual;
  const activity = activities.find((a) => a.id === id);
  const profileTags = getProfileTags();

  const predefinedNiyyahs = useMemo(
    () => (activity ? getNiyyahOptions(activity.id, profileTags) : []),
    [activity?.id, profileTags],
  );

  const basicNiyyah = predefinedNiyyahs.find((n) => n.level === "basic");
  const advancedNiyyahs = predefinedNiyyahs.filter(
    (n) => n.level === "advanced",
  );

  const activitySelectedIds = useMemo(() => {
    const ids = activity?.selectedNiyyahIds ?? [];
    return ids.filter((id) => !id.endsWith("_basic"));
  }, [activity?.selectedNiyyahIds]);

  const [step, setStep] = useState<Step>("view");
  const [localSelected, setLocalSelected] =
    useState<string[]>(activitySelectedIds);
  const [reflectionNote, setReflectionNote] = useState("");
  const [impactfulNiyyah, setImpactfulNiyyah] = useState("");
  const [showEditNiyyah, setShowEditNiyyah] = useState(false);
  const [editedNiyyah, setEditedNiyyah] = useState(
    activity?.customNiyyah ?? "",
  );
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customTextAr, setCustomTextAr] = useState("");

  if (!activity) {
    return (
      <View style={[styles.container, { backgroundColor: C.background }]}>
        <Text style={{ color: C.text, margin: 20 }}>
          {t("activity.notFound")}
        </Text>
      </View>
    );
  }

  const completed = isCompletedToday(activity.id);
  const activityName = localize(activity.name);
  const customOptions: NiyyahOption[] = (
    activity.customNiyyahOptions || []
  ).map((o) => ({ ...o, activityId: activity.id, level: "advanced" as const }));
  const allAdvanced = [...advancedNiyyahs, ...customOptions];

  const toggleNiyyah = (nId: string) => {
    setLocalSelected((prev) =>
      prev.includes(nId) ? prev.filter((x) => x !== nId) : [...prev, nId],
    );
  };

  const handleSaveAndRenew = async () => {
    Haptic.success();
    const finalSelected = localSelected.filter((id) => !id.endsWith("_basic"));
    updateActivity(activity.id, { selectedNiyyahIds: finalSelected });
    markComplete(activity.id, finalSelected);
    setStep("reflect");
  };

  const handleUnmark = async () => {
    Haptic.lightTap();
    unmarkComplete(activity.id);
  };

  const handleSaveReflection = async () => {
    if (reflectionNote.trim()) {
      addJournalEntry({
        activityId: activity.id,
        activityName: activity.name,
        date: getTodayString(),
        note: reflectionNote.trim(),
        selectedNiyyahCount: localSelected.filter((id) => !id.endsWith("_basic")).length + 1,
        impactfulNiyyah: impactfulNiyyah || undefined,
      });
    }
    router.back();
  };

  const handleSaveNiyyah = async () => {
    updateActivity(activity.id, { customNiyyah: editedNiyyah });
    setShowEditNiyyah(false);
  };

  const handleAddCustomNiyyah = async () => {
    if (!customText.trim()) return;
    const newOption = {
      id:
        "custom_" +
        Date.now().toString() +
        Math.random().toString(36).substr(2, 5),
      text: {
        en: customText.trim(),
        ar: customTextAr.trim() || customText.trim(),
      },
    };
    const existing = activity.customNiyyahOptions || [];
    updateActivity(activity.id, {
      customNiyyahOptions: [...existing, newOption],
    });
    setCustomText("");
    setCustomTextAr("");
    setShowAddCustom(false);
  };

  const getImpactPrompt = () => {
    const cleanSelected = localSelected.filter((id) => !id.endsWith("_basic"));
    const count = cleanSelected.length + 1;
    if (count === 1) return t("activity.reflectPromptSingle");
    return t("activity.reflectPromptMulti", { count });
  };

  const getImpactPromptAr = () => {
    const cleanSelected = localSelected.filter((id) => !id.endsWith("_basic"));
    const count = cleanSelected.length + 1;
    if (count === 1) return t("activity.reflectPromptSingle", { lng: "ar" });
    return t("activity.reflectPromptMulti", { lng: "ar", count });
  };

  // ─── Reflect step ────────────────────────────────────────────────────────
  if (step === "reflect") {
    const selectedTexts = allAdvanced
      .filter((n) => localSelected.includes(n.id))
      .slice(0, 4);

    return (
      <View style={[styles.container, { backgroundColor: C.background }]}>
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
              <Feather name='x' size={20} color={C.text} />
            </AnimatedPressable>
          </View>

          <LinearGradient
            colors={isDark ? ["#1A3326", "#0D2E1F"] : ["#2D7A4F", "#1A5C38"]}
            style={styles.reflectBanner}
          >
            <Feather name='check-circle' size={28} color='#C9A84C' />
            <AppText weight='Bold' style={styles.reflectTitle}>
              {t("activity.renewed")}
            </AppText>
            <AppText weight='Regular' style={styles.reflectSub}>
              {activityName}
            </AppText>
            {localSelected.filter((id) => !id.endsWith("_basic")).length > 0 && (
              <View style={styles.multiplierBadge}>
                <AppText weight='Bold' style={styles.multiplierText}>
                  {t("activity.multiplierBadge", {
                    count: localSelected.filter((id) => !id.endsWith("_basic")).length + 1,
                  })}
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
                weight='Medium'
                style={[styles.sectionLabel, { color: C.textSecondary }]}
              >
                {t("activity.intentionsForAct")}
              </AppText>
              {selectedTexts.map((n) => (
                <View key={n.id} style={styles.reflectNiyyahItem}>
                  <Feather
                    name='check'
                    size={14}
                    color={C.tint}
                    style={{ marginTop: 2 }}
                  />
                  <AppText
                    weight='Regular'
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
              weight='Bold'
              style={[styles.reflectPromptLabel, { color: C.text }]}
            >
              {t("activity.quickReflection")}{" "}
              <AppText
                weight='Regular'
                style={{ color: C.textMuted, fontSize: 13 }}
              >
                ({t("common.optional")})
              </AppText>
            </AppText>
            <AppText
              weight='Regular'
              style={[styles.reflectPromptHint, { color: C.textSecondary }]}
            >
              {lang === "ar" ? getImpactPromptAr() : getImpactPrompt()}
            </AppText>
            <AppTextInput
              value={reflectionNote}
              onChangeText={setReflectionNote}
              multiline
              placeholder={t("activity.reflectionPlaceholder")}
            />

            {localSelected.filter((id) => !id.endsWith("_basic")).length > 0 && (
              <>
                <AppText
                  weight='Medium'
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
                        weight='Regular'
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
              variant='outline'
              label={t("common.skip")}
              onPress={() => router.back()}
              style={{ flex: 1 }}
            />
            <AppButton
              variant='primary'
              label={t("activity.saveReflection")}
              icon='book'
              onPress={handleSaveReflection}
              style={{ flex: 2 }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  // ─── Main view ────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding + 8, paddingBottom: isWeb ? 34 + 40 : 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <AnimatedPressable
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: C.backgroundSubtle }]}
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
              <AppText
                weight='Medium'
                style={[styles.completedBadgeText, { color: C.tint }]}
              >
                {t("activity.completedToday")}
              </AppText>
            </View>
          )}
        </View>

        {/* Activity Hero */}
        <LinearGradient
          colors={[C.tint, C.tintDark]}
          style={styles.activityHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <AppText weight='Bold' style={styles.activityName}>
            {activityName}
          </AppText>
          {showBilingual && (
            <AppText weight='Regular' style={styles.activityNameAr}>
              {activity.name.ar}
            </AppText>
          )}
        </LinearGradient>

        {/* Basic Niyyah (always shown) */}
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
                  onPress={handleSaveNiyyah}
                />
              </View>
            </>
          ) : (
            <>
              <AppText
                weight='Regular'
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
              {basicNiyyah?.source && (
                <View style={styles.sourceRow}>
                  <Feather name='book-open' size={12} color={C.tintLight} />
                  <AppText
                    weight='Regular'
                    style={[styles.sourceText, { color: C.tintLight }]}
                  >
                    {localize(basicNiyyah.source)}
                  </AppText>
                </View>
              )}
            </>
          )}
        </View>

        {/* Multi-Niyyah Checklist */}
        {allAdvanced.length > 0 && (
          <View
            style={[
              styles.card,
              { backgroundColor: C.backgroundCard, borderColor: C.border },
            ]}
          >
            <View style={styles.cardHeader}>
              <AppText
                weight='Medium'
                style={[styles.sectionLabel, { color: C.gold }]}
              >
                {t("activity.multiplyIntentions")}
              </AppText>
              <AppText
                weight='Bold'
                style={[styles.selectedCount, { color: C.tint }]}
              >
                {localSelected.length > 0
                  ? t("activity.selectedCount", { count: localSelected.length })
                  : t("activity.selectAny")}
              </AppText>
            </View>
            <AppText
              weight='Regular'
              style={[styles.multiHint, { color: C.textMuted }]}
            >
              {t("activity.multiHint")}
            </AppText>

            {allAdvanced.map((option) => {
              const checked = localSelected.includes(option.id);
              return (
                <AnimatedPressable
                  key={option.id}
                  onPress={() => toggleNiyyah(option.id)}
                  style={[
                    styles.niyyahOption,
                    {
                      backgroundColor: checked
                        ? C.tint + "15"
                        : C.backgroundSubtle,
                      borderColor: checked ? C.tint + "88" : C.border,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: checked ? C.tint : "transparent",
                        borderColor: checked ? C.tint : C.border,
                      },
                    ]}
                  >
                    {checked && (
                      <Feather name='check' size={12} color={C.background} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.optionHeader}>
                      <AppText
                        weight={checked ? "Medium" : "Regular"}
                        style={[
                          styles.optionText,
                          {
                            color: checked ? C.text : C.textSecondary,
                          },
                        ]}
                      >
                        {localize(option.text)}
                      </AppText>
                      {option.profileTag && (
                        <View
                          style={[
                            styles.roleBadge,
                            {
                              backgroundColor:
                                ROLE_META[option.profileTag].color + "20",
                            },
                          ]}
                        >
                          <Feather
                            name={ROLE_META[option.profileTag].icon as any}
                            size={10}
                            color={ROLE_META[option.profileTag].color}
                          />
                          <AppText
                            style={[
                              styles.roleBadgeText,
                              { color: ROLE_META[option.profileTag].color },
                            ]}
                          >
                            {t(`settings.profile.${option.profileTag}`)}
                          </AppText>
                        </View>
                      )}
                    </View>
                    {showBilingual && (
                      <AppText
                        weight='Regular'
                        style={[styles.optionTextAr, { color: C.textMuted }]}
                      >
                        {option.text.ar}
                      </AppText>
                    )}
                    {option.source && (
                      <AppText
                        weight='Regular'
                        style={[styles.optionSource, { color: C.tintLight }]}
                      >
                        {localize(option.source)}
                      </AppText>
                    )}
                  </View>
                </AnimatedPressable>
              );
            })}

            {/* Add custom niyyah */}
            {!showAddCustom ? (
              <AnimatedPressable
                onPress={() => setShowAddCustom(true)}
                style={[styles.addCustomBtn, { borderColor: C.tint + "66" }]}
              >
                <Feather name='plus' size={14} color={C.tintLight} />
                <AppText
                  weight='Medium'
                  style={[styles.addCustomText, { color: C.tintLight }]}
                >
                  {t("activity.addCustomIntention")}
                </AppText>
              </AnimatedPressable>
            ) : (
              <View
                style={[
                  styles.customInputCard,
                  {
                    backgroundColor: C.backgroundSubtle,
                    borderColor: C.border,
                  },
                ]}
              >
                <AppTextInput
                  value={customText}
                  onChangeText={setCustomText}
                  placeholder={t("activity.customEnPlaceholder")}
                />
                <AppTextInput
                  value={customTextAr}
                  onChangeText={setCustomTextAr}
                  placeholder={t("activity.customArPlaceholder")}
                  textAlign='right'
                />
                <View style={styles.editActions}>
                  <AppButton
                    variant='ghost'
                    label={t("common.cancel")}
                    onPress={() => setShowAddCustom(false)}
                  />
                  <AppButton
                    variant='primary'
                    label={t("common.add")}
                    onPress={handleAddCustomNiyyah}
                  />
                </View>
              </View>
            )}
          </View>
        )}

        {/* Ajr preview */}
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
              style={[styles.ajrText, { color: C.gold }]}
            >
              {t("activity.ajrPreview", { count: localSelected.length + 1 })}
            </AppText>
          </View>
        )}

        {/* Hadith source */}
        {activity.hadithRef && (
          <View
            style={[
              styles.sourceSection,
              { backgroundColor: C.successLight, borderColor: C.tint + "30" },
            ]}
          >
            <Feather name='book-open' size={14} color={C.tint} />
            <AppText
              weight='Medium'
              style={[styles.sourceText, { color: C.tint }]}
            >
              {localize(activity.hadithRef)}
            </AppText>
          </View>
        )}

        {/* CTA */}
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
              <Feather name='check-circle' size={20} color={C.tint} />
              <AppText
                weight='Bold'
                style={[styles.renewText, { color: C.tint }]}
              >
                {t("activity.renewedButton")}
              </AppText>
            </View>
            <AppButton
              variant='outline'
              label={t("activity.unmark")}
              onPress={handleUnmark}
              style={{ marginBottom: 10 }}
            />
          </View>
        ) : (
          <AppButton
            variant='primary'
            icon='refresh-cw'
            label={
              localSelected.length > 0
                ? t("activity.renewIntentions", {
                    count: localSelected.length + 1,
                  })
                : t("activity.renewNiyyah")
            }
            onPress={handleSaveAndRenew}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  sourceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  sourceText: { fontSize: 12 },
  sectionLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  selectedCount: { fontSize: 12 },
  multiHint: { fontSize: 13, lineHeight: 18, marginTop: -4 },
  niyyahOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  optionText: { fontSize: 14, lineHeight: 20, flex: 1 },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  roleBadgeText: { fontSize: 10, fontWeight: "600" },
  optionTextAr: {
    fontSize: 13,
    textAlign: "right",
    lineHeight: 20,
    marginTop: 2,
  },
  optionSource: { fontSize: 11, marginTop: 2 },
  addCustomBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    marginTop: 6,
  },
  addCustomText: { fontSize: 14 },
  customInputCard: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    gap: 8,
    marginTop: 6,
  },
  editActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    justifyContent: "flex-end",
  },
  editBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  editBtnText: { fontSize: 14 },
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
  unmarkButton: {
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  unmarkText: { fontSize: 13 },
  // Reflect step
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
  skipBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  skipBtnText: { fontSize: 15 },
  saveBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveBtnText: { color: "#FFF", fontSize: 15 },
});
