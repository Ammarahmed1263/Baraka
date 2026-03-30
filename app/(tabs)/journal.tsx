import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { NIYYAH_OPTIONS } from "@/constants/data";
import { useApp, type JournalEntry } from "@/context/AppContext";

function JournalCard({ entry, lang }: { entry: JournalEntry; lang: "en" | "ar" }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;

  const formattedDate = new Date(entry.createdAt).toLocaleDateString(
    lang === "ar" ? "ar-SA" : "en-US",
    { weekday: "short", month: "short", day: "numeric" }
  );
  const formattedTime = new Date(entry.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const impactfulOption = entry.impactfulNiyyah
    ? NIYYAH_OPTIONS.find((n) => n.id === entry.impactfulNiyyah)
    : null;

  return (
    <View style={[styles.journalCard, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardChips}>
          <View style={[styles.activityChip, { backgroundColor: C.tint + "18" }]}>
            <Text style={[styles.activityChipText, { color: C.tint, fontFamily: "Inter_600SemiBold" }]}>
              {entry.activityName}
            </Text>
          </View>
          {(entry.selectedNiyyahCount ?? 0) > 1 && (
            <View style={[styles.countChip, { backgroundColor: C.gold + "22", borderColor: C.gold + "55" }]}>
              <Feather name="star" size={10} color={C.gold} />
              <Text style={[styles.countChipText, { color: C.gold, fontFamily: "Inter_600SemiBold" }]}>
                ×{entry.selectedNiyyahCount}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.dateInfo}>
          <Text style={[styles.dateText, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
            {formattedDate}
          </Text>
          <Text style={[styles.timeText, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
            {formattedTime}
          </Text>
        </View>
      </View>
      <Text style={[styles.noteText, { color: C.text, fontFamily: "Inter_400Regular" }]}>
        {entry.note}
      </Text>
      {impactfulOption && (
        <View style={[styles.impactRow, { backgroundColor: C.gold + "11", borderColor: C.gold + "33" }]}>
          <Feather name="heart" size={12} color={C.gold} />
          <Text style={[styles.impactText, { color: C.gold, fontFamily: "Inter_400Regular" }]}>
            {lang === "ar" && impactfulOption.textAr
              ? impactfulOption.textAr
              : impactfulOption.text}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function JournalScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const { journalEntries, activities, settings, addJournalEntry } = useApp();
  const lang = settings.language;

  const [showAdd, setShowAdd] = useState(false);
  const [note, setNote] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [filterActivity, setFilterActivity] = useState("__all__");
  const [search, setSearch] = useState("");

  const enabledActivities = activities.filter((a) => a.enabled);

  const filtered = useMemo(() => {
    return journalEntries.filter((e) => {
      const matchActivity =
        filterActivity === "__all__" || e.activityName === filterActivity;
      const matchSearch =
        !search || e.note.toLowerCase().includes(search.toLowerCase());
      return matchActivity && matchSearch;
    });
  }, [journalEntries, filterActivity, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, JournalEntry[]> = {};
    filtered.forEach((entry) => {
      const date = new Date(entry.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
    });
    return groups;
  }, [filtered]);

  const handleSave = async () => {
    if (!note.trim()) {
      Alert.alert(t("journal.alert.emptyNoteTitle"), t("journal.alert.emptyNoteMessage"));
      return;
    }
    const activityName =
      selectedActivity ||
      (enabledActivities[0]?.name || t("journal.general"));
    await addJournalEntry({
      activityId: selectedActivity || "general",
      activityName,
      date: new Date().toISOString().split("T")[0],
      note: note.trim(),
    });
    setNote("");
    setSelectedActivity("");
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
            <Text style={[styles.title, { color: C.text, fontFamily: "Inter_700Bold" }]}>
              {t("journal.title")}
            </Text>
            <Text style={[styles.subtitle, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {t(journalEntries.length === 1 ? "journal.subtitle.one" : "journal.subtitle.other", { count: journalEntries.length })}
            </Text>
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
              <Text style={[styles.formTitle, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                {t("journal.newReflection")}
              </Text>
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
                    setSelectedActivity(
                      selectedActivity === activity.name ? "" : activity.name
                    )
                  }
                  style={[
                    styles.activityChipSelector,
                    {
                      backgroundColor:
                        selectedActivity === activity.name
                          ? C.tint
                          : C.backgroundSecondary,
                      borderColor:
                        selectedActivity === activity.name ? C.tint : C.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.activityChipSelectorText,
                      {
                        color:
                          selectedActivity === activity.name
                            ? "#FFF"
                            : C.textSecondary,
                        fontFamily: "Inter_500Medium",
                      },
                    ]}
                  >
                    {activity.name}
                  </Text>
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
                  backgroundColor: C.backgroundSecondary,
                  fontFamily: "Inter_400Regular",
                },
              ]}
            />
            <View style={styles.formActions}>
              <TouchableOpacity
                onPress={() => { setShowAdd(false); setNote(""); }}
                style={[styles.cancelBtn, { borderColor: C.border }]}
              >
                <Text style={[styles.cancelBtnText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.saveBtn, { backgroundColor: C.tint }]}
              >
                <Text style={[styles.saveBtnText, { fontFamily: "Inter_600SemiBold" }]}>
                  {t("common.save")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Search */}
        {journalEntries.length > 0 && (
          <View style={[styles.searchBar, { backgroundColor: C.backgroundSecondary, borderColor: C.border }]}>
            <Feather name="search" size={16} color={C.textMuted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t("journal.searchPlaceholder")}
              placeholderTextColor={C.textMuted}
              style={[styles.searchInput, { color: C.text, fontFamily: "Inter_400Regular" }]}
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
              ...Array.from(new Set(journalEntries.map((e) => e.activityName))).map((name) => ({
                label: name,
                value: name,
              })),
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
                        : C.backgroundSecondary,
                    borderColor:
                      filterActivity === item.value ? C.tint : C.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        filterActivity === item.value ? "#FFF" : C.textSecondary,
                      fontFamily: "Inter_500Medium",
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Empty State */}
        {journalEntries.length === 0 && !showAdd && (
          <View style={styles.emptyState}>
            <Feather name="edit-3" size={40} color={C.textMuted} />
            <Text style={[styles.emptyTitle, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
              {t("journal.empty.title")}
            </Text>
            <Text style={[styles.emptyText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {t("journal.empty.message")}
            </Text>
            <TouchableOpacity
              onPress={() => setShowAdd(true)}
              style={[styles.emptyBtn, { backgroundColor: C.tint }]}
            >
              <Text style={[styles.emptyBtnText, { fontFamily: "Inter_600SemiBold" }]}>
                {t("journal.empty.button")}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Journal Entries */}
        {Object.entries(grouped).map(([date, entries]) => (
          <View key={date} style={styles.dateGroup}>
            <Text
              style={[styles.dateGroupLabel, { color: C.textSecondary, fontFamily: "Inter_600SemiBold" }]}
            >
              {date}
            </Text>
            {entries.map((entry) => (
              <JournalCard key={entry.id} entry={entry} lang={lang} />
            ))}
          </View>
        ))}

        {filtered.length === 0 && journalEntries.length > 0 && (
          <View style={styles.emptyState}>
            <Feather name="search" size={32} color={C.textMuted} />
            <Text style={[styles.emptyText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {t("journal.noFilterResults")}
            </Text>
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
  searchInput: { flex: 1, fontSize: 15 },
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
  journalCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardChips: { flexDirection: "row", gap: 6, alignItems: "center", flexWrap: "wrap", flex: 1 },
  activityChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activityChipText: { fontSize: 12 },
  countChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  countChipText: { fontSize: 11 },
  dateInfo: { alignItems: "flex-end", gap: 2, marginLeft: 8 },
  dateText: { fontSize: 12 },
  timeText: { fontSize: 11 },
  noteText: { fontSize: 15, lineHeight: 24 },
  impactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 2,
  },
  impactText: { flex: 1, fontSize: 12, lineHeight: 18, fontStyle: "italic" },
});
