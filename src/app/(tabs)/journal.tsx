import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";
import { AppTextInput } from "@components/UI/AppTextInput";
import { AppButton } from "@components/UI/AppButton";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { useTheme } from "@context/ThemeContext";
import { AppText } from "@components/UI/AppText";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { type JournalEntry } from "@types";
import { useActivitiesStore, useJournalStore } from "@store";
import { useLanguage } from "@i18n";
import { useLocalize } from "@hooks/useLocalize";
import JournalCard from "@components/Journal/JournalCard";

export default function JournalScreen() {
  const { t } = useTranslation();
  const { colors: C, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const journalEntries = useJournalStore((s) => s.journalEntries);
  const addJournalEntry = useJournalStore((s) => s.addJournalEntry);
  const activities = useActivitiesStore((s) => s.activities);
  const { language: lang } = useLanguage();
  const localize = useLocalize();

  const [showAdd, setShowAdd] = useState(false);
  const [note, setNote] = useState("");
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [filterActivity, setFilterActivity] = useState("__all__");
  const [search, setSearch] = useState("");

  const enabledActivities = activities.filter((a) => a.enabled);

  const filtered = useMemo(() => {
    return journalEntries.filter((e) => {
      const matchActivity =
        filterActivity === "__all__" || e.activityId === filterActivity;
      const matchSearch =
        !search || e.note.toLowerCase().includes(search.toLowerCase());
      return matchActivity && matchSearch;
    });
  }, [journalEntries, filterActivity, search]);

  const groupedLocalized = useMemo(() => {
    const groups: Record<string, JournalEntry[]> = {};
    filtered.forEach((entry) => {
      const date = new Date(entry.createdAt).toLocaleDateString(
        lang === "ar" ? "ar-SA" : "en-US",
        {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        },
      );
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
    });
    return groups;
  }, [filtered, lang]);

  const handleSave = async () => {
    if (!note.trim()) {
      Alert.alert(
        t("journal.alert.emptyNoteTitle"),
        t("journal.alert.emptyNoteMessage"),
      );
      return;
    }
    const selectedActivityObj = enabledActivities.find(
      (a) => a.id === selectedActivityId,
    );
    const activityName = selectedActivityObj?.name ?? {
      en: t("journal.general", { lng: "en" }),
      ar: t("journal.general", { lng: "ar" }),
    };
    await addJournalEntry({
      activityId: selectedActivityId || "general",
      activityName,
      date: new Date().toISOString().split("T")[0],
      note: note.trim(),
    });
    setNote("");
    setSelectedActivityId("");
    setShowAdd(false);
  };

  const topPadding = isWeb ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding + 16, paddingBottom: isWeb ? 34 + 84 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <AppText weight='Bold' style={[styles.title, { color: C.gold }]}>
              {t("journal.title")}
            </AppText>
            <AppText
              weight='Regular'
              style={[styles.subtitle, { color: C.textSecondary }]}
            >
              {t(
                journalEntries.length === 1
                  ? "journal.subtitle.one"
                  : "journal.subtitle.other",
                { count: journalEntries.length },
              )}
            </AppText>
          </View>
          <AnimatedPressable
            onPress={() => setShowAdd(!showAdd)}
            style={[styles.addButton, { backgroundColor: C.tint }]}
          >
            <Feather
              name={showAdd ? "x" : "edit-3"}
              size={20}
              color={C.background}
            />
          </AnimatedPressable>
        </View>

        {/* Add Entry Form */}
        {showAdd && (
          <View
            style={[
              styles.addForm,
              { backgroundColor: C.backgroundCard, borderColor: C.border },
            ]}
          >
            <LinearGradient
              colors={isDark ? ["#1A3326", "#0D2E1F"] : ["#EDF7F0", "#F0FAF4"]}
              style={styles.formGradient}
            >
              <AppText
                weight='Bold'
                style={[styles.formTitle, { color: C.text }]}
              >
                {t("journal.newReflection")}
              </AppText>
            </LinearGradient>

            {/* Activity Selector */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.activityScroll}
            >
              {enabledActivities.map((activity) => (
                <AnimatedPressable
                  key={activity.id}
                  onPress={() =>
                    setSelectedActivityId(
                      selectedActivityId === activity.id ? "" : activity.id,
                    )
                  }
                  style={[
                    styles.activityChipSelector,
                    {
                      backgroundColor:
                        selectedActivityId === activity.id
                          ? C.tint
                          : C.backgroundSubtle,
                      borderColor:
                        selectedActivityId === activity.id ? C.tint : C.border,
                    },
                  ]}
                >
                  <AppText
                    weight='Medium'
                    style={[
                      styles.activityChipSelectorText,
                      {
                        color:
                          selectedActivityId === activity.id
                            ? "#FFF"
                            : C.textSecondary,
                      },
                    ]}
                  >
                    {localize(activity.name)}
                  </AppText>
                </AnimatedPressable>
              ))}
            </ScrollView>

            <AppTextInput
              value={note}
              onChangeText={setNote}
              placeholder={t("journal.notePlaceholder")}
              multiline
              style={{ marginHorizontal: 16, marginTop: 0 }}
            />
            <View style={styles.formActions}>
              <AppButton
                variant='ghost'
                label={t("common.cancel")}
                onPress={() => {
                  setShowAdd(false);
                  setNote("");
                }}
              />
              <AppButton
                variant='primary'
                label={t("common.save")}
                onPress={handleSave}
              />
            </View>
          </View>
        )}

        {journalEntries.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <AppTextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t("journal.searchPlaceholder")}
              leftIcon='search'
              rightIcon={
                search.length > 0 ? (
                  <AnimatedPressable onPress={() => setSearch("")}>
                    <Feather name='x' size={16} color={C.textMuted} />
                  </AnimatedPressable>
                ) : undefined
              }
            />
          </View>
        )}

        {/* Filter by Activity */}
        {journalEntries.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContent}
          >
            {(
              [
                { label: t("journal.general"), value: "__all__" },
                ...Array.from(
                  new Set(journalEntries.map((e) => e.activityId)),
                ).map((activityId) => {
                  const firstEntry = journalEntries.find(
                    (e) => e.activityId === activityId,
                  );
                  const label = firstEntry
                    ? localize(firstEntry.activityName)
                    : t("journal.general");
                  return {
                    label,
                    value: activityId,
                  };
                }),
              ] as Array<{ label: string; value: string }>
            ).map((item) => (
              <AnimatedPressable
                key={item.value}
                scaleDownTo={0.94}
                onPress={() => setFilterActivity(item.value)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      filterActivity === item.value
                        ? C.tint
                        : C.backgroundSubtle,
                    borderColor:
                      filterActivity === item.value ? C.tint : C.border,
                  },
                ]}
              >
                <AppText
                  weight='Medium'
                  numberOfLines={1}
                  style={[
                    styles.filterText,
                    {
                      color:
                        filterActivity === item.value
                          ? "#FFF"
                          : C.textSecondary,
                    },
                  ]}
                >
                  {item.label}
                </AppText>
              </AnimatedPressable>
            ))}
          </ScrollView>
        )}

        {/* Empty State */}
        {journalEntries.length === 0 && !showAdd && (
          <View style={styles.emptyState}>
            <Feather name='edit-3' size={40} color={C.textMuted} />
            <AppText
              weight='Bold'
              style={[styles.emptyTitle, { color: C.text }]}
            >
              {t("journal.empty.title")}
            </AppText>
            <AppText
              weight='Regular'
              style={[styles.emptyText, { color: C.textSecondary }]}
            >
              {t("journal.empty.message")}
            </AppText>
            <AppButton
              variant='primary'
              label={t("journal.empty.button")}
              onPress={() => setShowAdd(true)}
              style={{ marginTop: 8 }}
            />
          </View>
        )}

        {/* Journal Entries */}
        {Object.entries(groupedLocalized).map(([date, entries]) => (
          <View key={date} style={styles.dateGroup}>
            <AppText
              weight='Bold'
              style={[styles.dateGroupLabel, { color: C.gold }]}
            >
              {date}
            </AppText>
            {entries.map((entry) => (
              <JournalCard key={entry.id} entry={entry} />
            ))}
          </View>
        ))}

        {filtered.length === 0 && journalEntries.length > 0 && (
          <View style={styles.emptyState}>
            <Feather name='search' size={32} color={C.textMuted} />
            <AppText
              weight='Regular'
              style={[styles.emptyText, { color: C.textSecondary }]}
            >
              {t("journal.noFilterResults")}
            </AppText>
          </View>
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
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: { fontSize: 28, marginBottom: 4 },
  subtitle: { fontSize: 14 },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  addForm: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    overflow: "hidden",
  },
  formGradient: { padding: 16 },
  formTitle: { fontSize: 17 },
  activityScroll: { gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  activityChipSelector: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  activityChipSelectorText: { fontSize: 13 },
  formActions: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelBtnText: { fontSize: 14 },
  saveBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  saveBtnText: { fontSize: 14, color: "#FFF" },
  filterScroll: { marginBottom: 16 },
  filterContent: { gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  filterText: { fontSize: 13 },
  emptyState: { alignItems: "center", paddingVertical: 48, gap: 12 },
  emptyTitle: { fontSize: 18 },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
  },
  emptyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  emptyBtnText: { fontSize: 15, color: "#FFF" },
  dateGroup: { marginBottom: 24 },
  dateGroupLabel: {
    fontSize: 13,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});
