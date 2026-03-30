import Colors from "@/constants/colors";
import { getNiyyahOptions, type NiyyahOption } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Step = "view" | "reflect";

export default function ActivityDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;

  const {
    activities,
    settings,
    isCompletedToday,
    getTodayLogForActivity,
    markComplete,
    unmarkComplete,
    addJournalEntry,
    updateActivity,
    getProfileTags,
  } = useApp();

  const lang = settings.language;
  const showBilingual = settings.showBilingual;
  const activity = activities.find((a) => a.id === id);
  const profileTags = getProfileTags();

  const predefinedNiyyahs = useMemo(
    () => (activity ? getNiyyahOptions(activity.id, profileTags) : []),
    [activity?.id, profileTags]
  );

  const basicNiyyah = predefinedNiyyahs.find((n) => n.level === "basic");
  const advancedNiyyahs = predefinedNiyyahs.filter((n) => n.level === "advanced");

  const activitySelectedIds: string[] = activity?.selectedNiyyahIds ?? [];

  const [step, setStep] = useState<Step>("view");
  const [localSelected, setLocalSelected] = useState<string[]>(activitySelectedIds);
  const [reflectionNote, setReflectionNote] = useState("");
  const [impactfulNiyyah, setImpactfulNiyyah] = useState("");
  const [showEditNiyyah, setShowEditNiyyah] = useState(false);
  const [editedNiyyah, setEditedNiyyah] = useState(
    activity?.customNiyyah || activity?.niyyahText || ""
  );
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customTextAr, setCustomTextAr] = useState("");

  if (!activity) {
    return (
      <View style={[styles.container, { backgroundColor: C.background }]}>
        <Text style={{ color: C.text, margin: 20 }}>{t("activity.notFound")}</Text>
      </View>
    );
  }

  const completed = isCompletedToday(activity.id);
  const todayLog = getTodayLogForActivity(activity.id);
  const activityColor = activity.color || C.tint;
  const customOptions: NiyyahOption[] = (activity.customNiyyahOptions || []).map(
    (o) => ({ ...o, activityId: activity.id, level: "advanced" as const })
  );
  const allAdvanced = [...advancedNiyyahs, ...customOptions];
  const totalSelected = localSelected.length + (localSelected.length === 0 ? 1 : 0);

  const toggleNiyyah = (nId: string) => {
    setLocalSelected((prev) =>
      prev.includes(nId) ? prev.filter((x) => x !== nId) : [...prev, nId]
    );
  };

  const handleSaveAndRenew = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const finalSelected =
      localSelected.length === 0 && basicNiyyah ? [basicNiyyah.id] : localSelected;
    await updateActivity(activity.id, { selectedNiyyahIds: finalSelected });
    await markComplete(activity.id, finalSelected);
    setStep("reflect");
  };

  const handleUnmark = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await unmarkComplete(activity.id);
  };

  const handleSaveReflection = async () => {
    if (reflectionNote.trim()) {
      await addJournalEntry({
        activityId: activity.id,
        activityName: lang === "ar" ? activity.nameAr : activity.name,
        date: new Date().toISOString().split("T")[0],
        note: reflectionNote.trim(),
        selectedNiyyahCount: localSelected.length || 1,
        impactfulNiyyah: impactfulNiyyah || undefined,
      });
    }
    router.back();
  };

  const handleSaveNiyyah = async () => {
    await updateActivity(activity.id, { customNiyyah: editedNiyyah });
    setShowEditNiyyah(false);
  };

  const handleAddCustomNiyyah = async () => {
    if (!customText.trim()) return;
    const newOption = {
      id: "custom_" + Date.now().toString() + Math.random().toString(36).substr(2, 5),
      text: customText.trim(),
      textAr: customTextAr.trim(),
    };
    const existing = activity.customNiyyahOptions || [];
    await updateActivity(activity.id, { customNiyyahOptions: [...existing, newOption] });
    setCustomText("");
    setCustomTextAr("");
    setShowAddCustom(false);
  };

  const getImpactPrompt = () => {
    const count = localSelected.length || 1;
    if (count === 1) return t("activity.reflectPromptSingle");
    return t("activity.reflectPromptMulti", { count });
  };

  const getImpactPromptAr = () => {
    const count = localSelected.length || 1;
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
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.backButton, { backgroundColor: C.backgroundSecondary }]}
            >
              <Feather name="x" size={20} color={C.text} />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={isDark ? ["#1A3326", "#0D2E1F"] : ["#2D7A4F", "#1A5C38"]}
            style={styles.reflectBanner}
          >
            <Feather name="check-circle" size={28} color="#C9A84C" />
            <Text style={[styles.reflectTitle, { fontFamily: "Inter_700Bold" }]}>
              {t("activity.renewed")}
            </Text>
            <Text style={[styles.reflectSub, { fontFamily: "Inter_400Regular" }]}>
              {lang === "ar" ? activity.nameAr : activity.name}
            </Text>
            {localSelected.length > 1 && (
              <View style={styles.multiplierBadge}>
                <Text style={[styles.multiplierText, { fontFamily: "Inter_700Bold" }]}>
                  {t("activity.multiplierBadge", { count: localSelected.length })}
                </Text>
              </View>
            )}
          </LinearGradient>

          {selectedTexts.length > 0 && (
            <View style={[styles.reflectNiyyahList, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
              <Text style={[styles.sectionLabel, { color: C.textSecondary, fontFamily: "Inter_500Medium" }]}>
                {t("activity.intentionsForAct")}
              </Text>
              {selectedTexts.map((n) => (
                <View key={n.id} style={styles.reflectNiyyahItem}>
                  <Feather name="check" size={14} color={C.tint} style={{ marginTop: 2 }} />
                  <Text style={[styles.reflectNiyyahText, { color: C.text, fontFamily: "Inter_400Regular" }]}>
                    {lang === "ar" && n.textAr ? n.textAr : n.text}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={[styles.reflectCard, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
            <Text style={[styles.reflectPromptLabel, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
              {t("activity.quickReflection")}{" "}
              <Text style={{ color: C.textMuted, fontFamily: "Inter_400Regular", fontSize: 13 }}>
                ({t("common.optional")})
              </Text>
            </Text>
            <Text style={[styles.reflectPromptHint, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {lang === "ar" ? getImpactPromptAr() : getImpactPrompt()}
            </Text>
            <TextInput
              value={reflectionNote}
              onChangeText={setReflectionNote}
              multiline
              placeholder={t("activity.reflectionPlaceholder")}
              placeholderTextColor={C.textMuted}
              style={[
                styles.noteInput,
                {
                  color: C.text,
                  backgroundColor: C.backgroundSecondary,
                  borderColor: C.border,
                  fontFamily: "Inter_400Regular",
                },
              ]}
            />

            {localSelected.length > 1 && (
              <>
                <Text style={[styles.impactLabel, { color: C.textSecondary, fontFamily: "Inter_500Medium" }]}>
                  {t("activity.impactQuestion")}
                </Text>
                {allAdvanced
                  .filter((n) => localSelected.includes(n.id))
                  .map((n) => (
                    <TouchableOpacity
                      key={n.id}
                      onPress={() => setImpactfulNiyyah(impactfulNiyyah === n.id ? "" : n.id)}
                      style={[
                        styles.impactOption,
                        {
                          backgroundColor:
                            impactfulNiyyah === n.id ? C.tint + "22" : C.backgroundSecondary,
                          borderColor: impactfulNiyyah === n.id ? C.tint : C.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.impactDot,
                          { backgroundColor: impactfulNiyyah === n.id ? C.tint : "transparent", borderColor: C.tint },
                        ]}
                      />
                      <Text style={[styles.impactOptionText, { color: C.text, fontFamily: "Inter_400Regular" }]}>
                        {lang === "ar" && n.textAr ? n.textAr : n.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </>
            )}
          </View>

          <View style={styles.reflectActions}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.skipBtn, { borderColor: C.border }]}
            >
              <Text style={[styles.skipBtnText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                {t("common.skip")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSaveReflection}
              style={[styles.saveBtn, { backgroundColor: C.tint }]}
            >
              <Feather name="book" size={16} color="#FFF" />
              <Text style={[styles.saveBtnText, { fontFamily: "Inter_600SemiBold" }]}>
                {t("activity.saveReflection")}
              </Text>
            </TouchableOpacity>
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
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: C.backgroundSecondary }]}
          >
            <Feather name="x" size={20} color={C.text} />
          </TouchableOpacity>
          {completed && (
            <View style={[styles.completedBadge, { backgroundColor: C.tint + "22", borderColor: C.tint + "55" }]}>
              <Feather name="check-circle" size={14} color={C.tint} />
              <Text style={[styles.completedBadgeText, { color: C.tint, fontFamily: "Inter_500Medium" }]}>
                {t("activity.completedToday")}
              </Text>
            </View>
          )}
        </View>

        {/* Activity Hero */}
        <LinearGradient
          colors={[activityColor + "DD", activityColor + "99"]}
          style={styles.activityHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.activityName, { fontFamily: "Inter_700Bold" }]}>
            {lang === "ar" ? activity.nameAr : activity.name}
          </Text>
          {showBilingual && (
            <Text style={[styles.activityNameAr, { fontFamily: "Inter_400Regular" }]}>
              {lang === "ar" ? activity.name : activity.nameAr}
            </Text>
          )}
          {!showBilingual && lang === "en" && activity.nameAr && (
            <Text style={[styles.activityNameAr, { fontFamily: "Inter_400Regular" }]}>
              {activity.nameAr}
            </Text>
          )}
        </LinearGradient>

        {/* Basic Niyyah (always shown) */}
        <View style={[styles.card, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.basicBadge, { backgroundColor: C.tint + "22" }]}>
              <Text style={[styles.basicBadgeText, { color: C.tint, fontFamily: "Inter_600SemiBold" }]}>
                {t("activity.coreIntention")}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowEditNiyyah(!showEditNiyyah)}>
              <Feather name="edit-2" size={16} color={C.tintLight} />
            </TouchableOpacity>
          </View>

          {showEditNiyyah ? (
            <>
              <TextInput
                value={editedNiyyah}
                onChangeText={setEditedNiyyah}
                multiline
                style={[
                  styles.editInput,
                  {
                    color: C.text,
                    borderColor: C.tint,
                    backgroundColor: C.backgroundSecondary,
                    fontFamily: "Inter_400Regular",
                  },
                ]}
                placeholderTextColor={C.textMuted}
              />
              <View style={styles.editActions}>
                <TouchableOpacity
                  onPress={() => setShowEditNiyyah(false)}
                  style={[styles.editBtn, { borderColor: C.border }]}
                >
                  <Text style={[styles.editBtnText, { color: C.textSecondary }]}>{t("common.cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveNiyyah}
                  style={[styles.editBtn, { backgroundColor: C.tint }]}
                >
                  <Text style={[styles.editBtnText, { color: "#FFF", fontFamily: "Inter_600SemiBold" }]}>
                    {t("common.save")}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.niyyahText, { color: C.text, fontFamily: "Inter_400Regular" }]}>
                {lang === "ar"
                  ? basicNiyyah?.textAr || activity.niyyahTextAr
                  : activity.customNiyyah || basicNiyyah?.text || activity.niyyahText}
              </Text>
              {(showBilingual || lang === "en") && activity.niyyahTextAr && (
                <Text style={[styles.arabicText, { color: C.textSecondary }]}>
                  {basicNiyyah?.textAr || activity.niyyahTextAr}
                </Text>
              )}
              {basicNiyyah?.source && (
                <View style={styles.sourceRow}>
                  <Feather name="book-open" size={12} color={C.tintLight} />
                  <Text style={[styles.sourceText, { color: C.tintLight, fontFamily: "Inter_400Regular" }]}>
                    {basicNiyyah.source}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Multi-Niyyah Checklist */}
        {allAdvanced.length > 0 && (
          <View style={[styles.card, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.sectionLabel, { color: C.textSecondary, fontFamily: "Inter_500Medium" }]}>
                {t("activity.multiplyIntentions")}
              </Text>
              <Text style={[styles.selectedCount, { color: C.tint, fontFamily: "Inter_600SemiBold" }]}>
                {localSelected.length > 0 ? t("activity.selectedCount", { count: localSelected.length }) : t("activity.selectAny")}
              </Text>
            </View>
            <Text style={[styles.multiHint, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
              {t("activity.multiHint")}
            </Text>

            {allAdvanced.map((option) => {
              const checked = localSelected.includes(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => toggleNiyyah(option.id)}
                  style={[
                    styles.niyyahOption,
                    {
                      backgroundColor: checked ? C.tint + "15" : C.backgroundSecondary,
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
                    {checked && <Feather name="check" size={12} color="#FFF" />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: checked ? C.text : C.textSecondary,
                          fontFamily: checked ? "Inter_500Medium" : "Inter_400Regular",
                        },
                      ]}
                    >
                      {lang === "ar" && option.textAr ? option.textAr : option.text}
                    </Text>
                    {showBilingual && option.textAr && (
                      <Text style={[styles.optionTextAr, { color: C.textMuted }]}>
                        {option.textAr}
                      </Text>
                    )}
                    {option.source && (
                      <Text style={[styles.optionSource, { color: C.tintLight }]}>
                        {option.source}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Add custom niyyah */}
            {!showAddCustom ? (
              <TouchableOpacity
                onPress={() => setShowAddCustom(true)}
                style={[styles.addCustomBtn, { borderColor: C.tint + "66" }]}
              >
                <Feather name="plus" size={14} color={C.tintLight} />
                <Text style={[styles.addCustomText, { color: C.tintLight, fontFamily: "Inter_500Medium" }]}>
                  {t("activity.addCustomIntention")}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.customInputCard, { backgroundColor: C.backgroundSecondary, borderColor: C.border }]}>
                <TextInput
                  value={customText}
                  onChangeText={setCustomText}
                  placeholder={t("activity.customEnPlaceholder")}
                  placeholderTextColor={C.textMuted}
                  style={[styles.customInput, { color: C.text, borderColor: C.border, fontFamily: "Inter_400Regular" }]}
                />
                <TextInput
                  value={customTextAr}
                  onChangeText={setCustomTextAr}
                  placeholder={t("activity.customArPlaceholder")}
                  placeholderTextColor={C.textMuted}
                  textAlign="right"
                  style={[styles.customInput, { color: C.text, borderColor: C.border, fontFamily: "Inter_400Regular" }]}
                />
                <View style={styles.editActions}>
                  <TouchableOpacity
                    onPress={() => setShowAddCustom(false)}
                    style={[styles.editBtn, { borderColor: C.border }]}
                  >
                    <Text style={[styles.editBtnText, { color: C.textSecondary }]}>{t("common.cancel")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleAddCustomNiyyah}
                    style={[styles.editBtn, { backgroundColor: C.tint }]}
                  >
                    <Text style={[styles.editBtnText, { color: "#FFF", fontFamily: "Inter_600SemiBold" }]}>
                      {t("common.add")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Ajr preview */}
        {localSelected.length > 0 && (
          <View style={[styles.ajrPreview, { backgroundColor: C.gold + "22", borderColor: C.gold + "55" }]}>
            <Feather name="star" size={16} color={C.gold} />
            <Text style={[styles.ajrText, { color: C.gold, fontFamily: "Inter_500Medium" }]}>
              {t("activity.ajrPreview", { count: localSelected.length + 1 })}
            </Text>
          </View>
        )}

        {/* Hadith source */}
        {activity.hadithRef && (
          <View style={[styles.sourceSection, { backgroundColor: C.successLight, borderColor: C.tint + "30" }]}>
            <Feather name="book-open" size={14} color={C.tint} />
            <Text style={[styles.sourceText, { color: C.tint, fontFamily: "Inter_500Medium" }]}>
              {activity.hadithRef}
            </Text>
          </View>
        )}

        {/* CTA */}
        {completed ? (
          <View style={{ gap: 10 }}>
            <View
              style={[styles.renewButton, { backgroundColor: C.tint + "22", borderColor: C.tint + "55", borderWidth: 1 }]}
            >
              <Feather name="check-circle" size={20} color={C.tint} />
              <Text style={[styles.renewText, { color: C.tint, fontFamily: "Inter_600SemiBold" }]}>
                {t("activity.renewedButton")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleUnmark}
              style={[styles.unmarkButton, { borderColor: C.border }]}
            >
              <Text style={[styles.unmarkText, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
                {t("activity.unmark")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleSaveAndRenew}
            activeOpacity={0.85}
            style={[styles.renewButton, { backgroundColor: C.tint }]}
          >
            <Feather name="refresh-cw" size={20} color="#FFF" />
            <Text style={[styles.renewText, { color: "#FFF", fontFamily: "Inter_600SemiBold" }]}>
              {localSelected.length > 0
                ? t("activity.renewIntentions", { count: localSelected.length + 1 })
                : t("activity.renewNiyyah")}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  completedBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  completedBadgeText: { fontSize: 13 },
  activityHeader: { borderRadius: 16, padding: 24, marginBottom: 16, gap: 6 },
  activityName: { fontSize: 24, color: "#FFF" },
  activityNameAr: { fontSize: 16, color: "rgba(255,255,255,0.8)", textAlign: "right" },
  card: { borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, gap: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  basicBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  basicBadgeText: { fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6 },
  niyyahText: { fontSize: 15, lineHeight: 24 },
  arabicText: { fontSize: 15, textAlign: "right", lineHeight: 26, fontStyle: "italic", marginTop: 4 },
  sourceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  sourceText: { fontSize: 12 },
  sectionLabel: { fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8 },
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
  optionText: { fontSize: 14, lineHeight: 20 },
  optionTextAr: { fontSize: 13, textAlign: "right", lineHeight: 20, marginTop: 2, fontStyle: "italic" },
  optionSource: { fontSize: 11, marginTop: 2 },
  addCustomBtn: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1, borderStyle: "dashed", marginTop: 6 },
  addCustomText: { fontSize: 14 },
  customInputCard: { borderRadius: 10, padding: 12, borderWidth: 1, gap: 8, marginTop: 6 },
  customInput: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 14 },
  editInput: { borderWidth: 1.5, borderRadius: 10, padding: 12, fontSize: 15, lineHeight: 22, minHeight: 90, textAlignVertical: "top" },
  editActions: { flexDirection: "row", gap: 8, marginTop: 4, justifyContent: "flex-end" },
  editBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  editBtnText: { fontSize: 14 },
  ajrPreview: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 12 },
  ajrText: { flex: 1, fontSize: 13, lineHeight: 18 },
  sourceSection: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10, marginBottom: 20, borderWidth: 1 },
  renewButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, padding: 18, borderRadius: 16, marginBottom: 10 },
  renewText: { fontSize: 17 },
  unmarkButton: { alignItems: "center", paddingVertical: 10, borderRadius: 10, borderWidth: 1, marginBottom: 10 },
  unmarkText: { fontSize: 13 },
  // Reflect step
  reflectBanner: { borderRadius: 16, padding: 24, alignItems: "center", gap: 8, marginBottom: 16 },
  reflectTitle: { fontSize: 22, color: "#FFF" },
  reflectSub: { fontSize: 15, color: "rgba(255,255,255,0.8)" },
  multiplierBadge: { backgroundColor: "#C9A84C33", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "#C9A84C88", marginTop: 4 },
  multiplierText: { color: "#C9A84C", fontSize: 14 },
  reflectNiyyahList: { borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, gap: 10 },
  reflectNiyyahItem: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  reflectNiyyahText: { flex: 1, fontSize: 14, lineHeight: 20 },
  reflectCard: { borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, gap: 12 },
  reflectPromptLabel: { fontSize: 16 },
  reflectPromptHint: { fontSize: 14, lineHeight: 20, marginTop: -4 },
  noteInput: { borderRadius: 10, borderWidth: 1, padding: 12, fontSize: 15, lineHeight: 22, minHeight: 100, textAlignVertical: "top" },
  impactLabel: { fontSize: 13, textTransform: "uppercase", letterSpacing: 0.6 },
  impactOption: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, borderRadius: 8, borderWidth: 1, marginTop: 6 },
  impactDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, flexShrink: 0 },
  impactOptionText: { flex: 1, fontSize: 13, lineHeight: 18 },
  reflectActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  skipBtn: { flex: 1, alignItems: "center", paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  skipBtnText: { fontSize: 15 },
  saveBtn: { flex: 2, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 12 },
  saveBtnText: { color: "#FFF", fontSize: 15 },
});
