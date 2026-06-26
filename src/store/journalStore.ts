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
        set({ journalEntries: [newEntry, ...get().journalEntries] });
      },

      updateJournalEntry: (id, updates) => {
        set({
          journalEntries: get().journalEntries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        });
      },

      deleteJournalEntry: (id) => {
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

