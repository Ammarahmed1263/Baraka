import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { AppText } from "@components/UI/AppText";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@constants/colors";
import { type JournalEntry } from "@types";
import { useActivitiesStore, useJournalStore } from "@store";
import { useLanguage } from "@i18n";
import { useLocalize } from "@hooks/useLocalize";
import JournalCard from "@components/Journal/JournalCard";

export default function JournalScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
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
      const date = new Date(entry.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
    });
    return groups;
  }, [filtered, lang]);

  const handleSave = async () => {
    if (!note.trim()) {
      Alert.alert(t("journal.alert.emptyNoteTitle"), t("journal.alert.emptyNoteMessage"));
      return;
    }
    const selectedActivityObj = enabledActivities.find((a) => a.id === selectedActivityId);
    const activityName = selectedActivityObj?.name ?? { en: t("journal.general", { lng: "en" }), ar: t("journal.general", { lng: "ar" }) };
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
            <AppText weight="Bold" style={[styles.title, { color: C.text }]}>
              {t("journal.title")}
            </AppText>
            <AppText weight="Regular" style={[styles.subtitle, { color: C.textSecondary }]}>
              {t(journalEntries.length === 1 ? "journal.subtitle.one" : "journal.subtitle.other", { count: journalEntries.length })}
            </AppText>
          </View>
          <TouchableOpacity
            onPress={() => setShowAdd(!showAdd)}
            style={[styles.addButton, { backgroundColor: C.tint }]}
          >
            <Feather name={showAdd ? "x" : "edit-3"} size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Add Entry Form */}
        {showAdd && (
          <View style={[styles.addForm, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
            <LinearGradient
              colors={isDark ? ["#1A3326", "#0D2E1F"] : ["#EDF7F0", "#F0FAF4"]}
              style={styles.formGradient}
            >
              <AppText weight="Bold" style={[styles.formTitle, { color: C.text }]}>
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
                <TouchableOpacity
                  key={activity.id}
                  onPress={() =>
                    setSelectedActivityId(
                      selectedActivityId === activity.id ? "" : activity.id
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
                    weight="Medium"
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
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder={t("journal.notePlaceholder")}
              placeholderTextColor={C.textMuted}
              multiline
              style={[
                styles.noteInput,
                {
                  color: C.text,
                  borderColor: C.border,
                  backgroundColor: C.backgroundSubtle,
                },
              ]}
            />
            <View style={styles.formActions}>
              <TouchableOpacity
                onPress={() => { setShowAdd(false); setNote(""); }}
                style={[styles.cancelBtn, { borderColor: C.border }]}
              >
                <AppText weight="Regular" style={[styles.cancelBtnText, { color: C.textSecondary }]}>
                  {t("common.cancel")}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.saveBtn, { backgroundColor: C.tint }]}
              >
                <AppText weight="Bold" style={styles.saveBtnText}>
                  {t("common.save")}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Search */}
        {journalEntries.length > 0 && (
          <View style={[styles.searchBar, { backgroundColor: C.backgroundSubtle, borderColor: C.border }]}>
            <Feather name="search" size={16} color={C.textMuted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t("journal.searchPlaceholder")}
              placeholderTextColor={C.textMuted}
              style={[styles.searchInput, { color: C.text }]}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Feather name="x" size={16} color={C.textMuted} />
              </TouchableOpacity>
            )}
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
            {([
              { label: t("journal.general"), value: "__all__" },
              ...Array.from(new Set(journalEntries.map((e) => e.activityId))).map((activityId) => {
                const firstEntry = journalEntries.find((e) => e.activityId === activityId);
                const label = firstEntry
                  ? localize(firstEntry.activityName)
                  : t("journal.general");
                return {
                  label,
                  value: activityId,
                };
              }),
            ] as Array<{ label: string; value: string }>).map((item) => (
              <TouchableOpacity
                key={item.value}
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
                  weight="Medium"
                  style={[
                    styles.filterText,
                    {
                      color:
                        filterActivity === item.value ? "#FFF" : C.textSecondary,
                    },
                  ]}
                >
                  {item.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Empty State */}
        {journalEntries.length === 0 && !showAdd && (
          <View style={styles.emptyState}>
            <Feather name="edit-3" size={40} color={C.textMuted} />
            <AppText weight="Bold" style={[styles.emptyTitle, { color: C.text }]}>
              {t("journal.empty.title")}
            </AppText>
            <AppText weight="Regular" style={[styles.emptyText, { color: C.textSecondary }]}>
              {t("journal.empty.message")}
            </AppText>
            <TouchableOpacity
              onPress={() => setShowAdd(true)}
              style={[styles.emptyBtn, { backgroundColor: C.tint }]}
            >
              <AppText weight="Bold" style={styles.emptyBtnText}>
                {t("journal.empty.button")}
              </AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* Journal Entries */}
        {Object.entries(groupedLocalized).map(([date, entries]) => (
          <View key={date} style={styles.dateGroup}>
            <AppText
              weight="Bold"
              style={[styles.dateGroupLabel, { color: C.textSecondary }]}
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
            <Feather name="search" size={32} color={C.textMuted} />
            <AppText weight="Regular" style={[styles.emptyText, { color: C.textSecondary }]}>
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
  noteInput: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: "top",
    margin: 16,
    marginTop: 0,
    fontFamily: "Tajawal-Regular"
  },
  formActions: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: "flex-end",
  },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1 },
  cancelBtnText: { fontSize: 14 },
  saveBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  saveBtnText: { fontSize: 14, color: "#FFF" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: "Tajawal-Regular" },
  filterScroll: { marginBottom: 16 },
  filterContent: { gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: { fontSize: 13 },
  emptyState: { alignItems: "center", paddingVertical: 48, gap: 12 },
  emptyTitle: { fontSize: 18 },
  emptyText: { fontSize: 15, textAlign: "center", lineHeight: 22, maxWidth: 300 },
  emptyBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  emptyBtnText: { fontSize: 15, color: "#FFF" },
  dateGroup: { marginBottom: 24 },
  dateGroupLabel: { fontSize: 13, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.6 },
});


