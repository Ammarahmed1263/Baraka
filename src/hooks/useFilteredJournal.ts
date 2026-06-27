import { useMemo, useState } from "react";
import { useActivitiesStore, useJournalStore } from "@store";
import { useLanguage } from "@i18n";
import { type JournalEntry } from "@types";

export function useFilteredJournal() {
  const journalEntries = useJournalStore((s) => s.journalEntries);
  const activities = useActivitiesStore((s) => s.activities);
  const { language: lang } = useLanguage();

  const [filterActivity, setFilterActivity] = useState("__all__");
  const [search, setSearch] = useState("");

  const enabledActivities = useMemo(
    () => activities.filter((a) => a.enabled),
    [activities]
  );

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
        }
      );
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
    });
    return groups;
  }, [filtered, lang]);

  return {
    journalEntries,
    enabledActivities,
    filtered,
    groupedLocalized,
    filterActivity,
    setFilterActivity,
    search,
    setSearch,
  };
}
