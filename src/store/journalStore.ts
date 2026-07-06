import * as Sentry from "@sentry/react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { storageAdapter } from "@lib/storage";
import type { JournalEntry } from "@types";

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substring(2, 11);
}

type JournalStore = {
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;
  updateJournalEntry: (id: string, updates: Partial<Pick<JournalEntry, "note" | "activityId" | "activityName">>) => void;
  deleteJournalEntry: (id: string) => void;
};

export const useJournalStore = create<JournalStore>()(
  persist(
    (set, get) => ({
      journalEntries: [],

      addJournalEntry: (entry) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        Sentry.addBreadcrumb({
          category: "store",
          message: "Journal entry added",
          data: { activityId: entry.activityId },
          level: "info",
        });
        set({ journalEntries: [newEntry, ...get().journalEntries] });
      },

      updateJournalEntry: (id, updates) => {
        Sentry.addBreadcrumb({
          category: "store",
          message: "Journal entry updated",
          data: { entryId: id },
          level: "info",
        });
        set({
          journalEntries: get().journalEntries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        });
      },

      deleteJournalEntry: (id) => {
        Sentry.addBreadcrumb({
          category: "store",
          message: "Journal entry deleted",
          data: { entryId: id },
          level: "info",
        });
        set({
          journalEntries: get().journalEntries.filter((entry) => entry.id !== id),
        });
      },
    }),
    {
      name: "@niyyah_journal",
      storage: createJSONStorage(() => storageAdapter),
    }
  )
);

