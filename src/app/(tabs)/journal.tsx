import JournalCard from "@components/Journal/JournalCard";
import { JournalEntryForm } from "@components/Journal/JournalEntryForm";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppBottomSheet } from "@components/UI/AppBottomSheet";
import { AppButton } from "@components/UI/AppButton";
import { AppText } from "@components/UI/AppText";
import { AppTextInput } from "@components/UI/AppTextInput";
import { ChipSelector } from "@components/UI/ChipSelector";
import { EmptyState } from "@components/UI/EmptyState";
import { useTheme } from "@context/ThemeContext";
import { Feather } from "@expo/vector-icons";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFilteredJournal } from "@hooks/useFilteredJournal";
import { useLocalize } from "@hooks/useLocalize";
import { useJournalStore } from "@store";
import { type JournalEntry } from "@types";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function JournalScreen() {
  const localize = useLocalize();
  const { t } = useTranslation();
  const { colors: C } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;

  const {
    journalEntries,
    enabledActivities,
    filtered,
    groupedLocalized,
    filterActivity,
    setFilterActivity,
    search,
    setSearch,
  } = useFilteredJournal();

  const addJournalEntry = useJournalStore((s) => s.addJournalEntry);
  const updateJournalEntry = useJournalStore((s) => s.updateJournalEntry);
  const deleteJournalEntry = useJournalStore((s) => s.deleteJournalEntry);

  const [showAdd, setShowAdd] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | undefined>(
    undefined,
  );
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>(
    undefined,
  );
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleSave = (data: {
    activityId: string;
    activityName: { en: string; ar: string };
    note: string;
  }) => {
    if (editingEntry) {
      updateJournalEntry(editingEntry.id, {
        activityId: data.activityId,
        activityName: data.activityName,
        note: data.note,
      });
      setEditingEntry(undefined);
    } else {
      addJournalEntry({
        activityId: data.activityId,
        activityName: data.activityName,
        date: new Date().toISOString().split("T")[0],
        note: data.note,
      });
    }
    setShowAdd(false);
  };

  const handleOptions = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    bottomSheetRef.current?.present();
  };

  const confirmDelete = () => {
    if (selectedEntry) {
      deleteJournalEntry(selectedEntry.id);
      setSelectedEntry(undefined);
      bottomSheetRef.current?.dismiss();
    }
  };

  const filterOptions = [
    { label: t("journal.general"), value: "__all__" },
    ...Array.from(new Set(journalEntries.map((e) => e.activityId))).map(
      (activityId) => {
        const firstEntry = journalEntries.find((e) => e.activityId === activityId);
        return {
          label: firstEntry ? localize(firstEntry.activityName) || t("journal.general") : t("journal.general"),
          value: activityId,
        };
      },
    ),
  ];

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding + 16, paddingBottom: isWeb ? 34 + 84 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
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
            onPress={() => {
              if (showAdd) {
                setShowAdd(false);
                setEditingEntry(undefined);
              } else {
                setShowAdd(true);
              }
            }}
            style={[styles.addButton, { backgroundColor: C.tint }]}
          >
            <Feather
              name={showAdd ? "x" : "edit-3"}
              size={20}
              color={C.background}
            />
          </AnimatedPressable>
        </View>

        {showAdd && (
          <JournalEntryForm
            entry={editingEntry}
            enabledActivities={enabledActivities}
            onSave={handleSave}
            onCancel={() => {
              setShowAdd(false);
              setEditingEntry(undefined);
            }}
          />
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

        {journalEntries.length > 0 && (
          <ChipSelector
            items={filterOptions}
            selectedValue={filterActivity}
            onSelect={setFilterActivity}
          />
        )}

        {journalEntries.length === 0 && !showAdd && (
          <EmptyState
            icon='edit-3'
            title={t("journal.empty.title")}
            message={t("journal.empty.message")}
            actionLabel={t("journal.empty.button")}
            onAction={() => setShowAdd(true)}
          />
        )}

            {Object.entries(groupedLocalized).map(
              ([date, entries], outerIndex) => (
                <View key={date} style={styles.dateGroup}>
                  <AppText
                    weight='Bold'
                    style={[styles.dateGroupLabel, { color: C.gold }]}
                  >
                    {date}
                  </AppText>
                  <View style={{ gap: 10 }}>
                    {entries.map((entry, innerIndex) => (
                      <Animated.View
                        key={entry.id}
                        entering={FadeInDown.delay(
                          (outerIndex * 2 + innerIndex) * 50,
                        ).duration(250)}
                      >
                        <JournalCard
                          entry={entry}
                          onOptions={handleOptions}
                        />
                      </Animated.View>
                    ))}
                  </View>
                </View>
              ),
            )}

            {filtered.length === 0 && journalEntries.length > 0 && (
              <EmptyState
                icon='search'
                message={t("journal.noFilterResults")}
              />
            )}
      </ScrollView>

      <AppBottomSheet
        ref={bottomSheetRef}
        snapPoints={["30%"]}
        onClose={() => {
          setSelectedEntry(undefined);
        }}
      >
        <View style={[styles.sheetContent, { paddingBottom: 32 }]}>
          <AppButton
            variant='outline'
            label={t("journal.edit", "Edit reflection")}
            icon='edit-3'
            onPress={() => {
              bottomSheetRef.current?.dismiss();
              setEditingEntry(selectedEntry);
              setShowAdd(true);
            }}
            style={{ width: "100%", marginBottom: 12 }}
          />
          <AppButton
            variant='destructive'
            label={t("journal.delete.confirm")}
            icon='trash-2'
            onPress={confirmDelete}
            style={{ width: "100%" }}
          />
        </View>
      </AppBottomSheet>
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
  dateGroup: { marginBottom: 24 },
  dateGroupLabel: {
    fontSize: 13,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  sheetContent: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sheetIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  sheetMessage: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
  },
  sheetActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
});
