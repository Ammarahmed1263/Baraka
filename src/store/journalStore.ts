import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { JournalEntry } from "@types";

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

type JournalStore = {
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;
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
    }),
    {
      name: "@niyyah_journal",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

