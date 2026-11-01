import { useCallback } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { journalEntries } from "@/db/schema";
import { generateId } from "@utils/id";
import { activityProps, track } from "@lib/analytics";

export function useJournalActions() {
  const addJournalEntry = useCallback(
    async (entry: {
      activityId: string;
      activityNameEn: string;
      activityNameAr: string;
      note: string;
      selectedNiyyahCount?: number;
      impactfulNiyyahId?: string;
    }) => {
      const id = generateId();
      await db.insert(journalEntries).values({
        id,
        activityId: entry.activityId,
        activityNameEn: entry.activityNameEn,
        activityNameAr: entry.activityNameAr,
        note: entry.note,
        selectedNiyyahCount: entry.selectedNiyyahCount ?? 0,
        impactfulNiyyahId: entry.impactfulNiyyahId ?? null,
        createdAt: new Date(),
      });
      track("journal_entry_saved", activityProps(entry.activityId));
      return id;
    },
    [],
  );

  const updateJournalEntry = useCallback(
    async (
      id: string,
      updates: Partial<{
        note: string;
        activityId: string;
        activityNameEn: string;
        activityNameAr: string;
      }>,
    ) => {
      await db
        .update(journalEntries)
        .set(updates)
        .where(eq(journalEntries.id, id));
    },
    [],
  );

  const deleteJournalEntry = useCallback(async (id: string) => {
    await db.delete(journalEntries).where(eq(journalEntries.id, id));
  }, []);

  return { addJournalEntry, updateJournalEntry, deleteJournalEntry };
}
