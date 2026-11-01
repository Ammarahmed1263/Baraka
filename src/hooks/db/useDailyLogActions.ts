import { useCallback } from "react";
import { eq, and } from "drizzle-orm";
import { db } from "@/db/db";
import { dailyLogs, dailyLogNiyyahs } from "@/db/schema";
import { generateId } from "@utils/id";
import { getTodayString } from "@utils/date";
import { activityProps, track } from "@lib/analytics";

export function useDailyLogActions() {
  const markComplete = useCallback(
    async (activityId: string, niyyahIds: string[] = []) => {
      const id = generateId();
      await db.transaction(async (tx) => {
        await tx.insert(dailyLogs).values({
          id,
          activityId,
          date: getTodayString(),
          completedAt: new Date(),
        });
        if (niyyahIds.length > 0) {
          await tx
            .insert(dailyLogNiyyahs)
            .values(
              niyyahIds.map((niyyahId) => ({ dailyLogId: id, niyyahId })),
            );
        }
      });
      track("niyyah_renewed", {
        ...activityProps(activityId),
        niyyah_count: niyyahIds.length,
      });
      return id;
    },
    [],
  );

  const unmarkComplete = useCallback(async (activityId: string) => {
    const today = getTodayString();
    await db
      .delete(dailyLogs)
      .where(
        and(eq(dailyLogs.activityId, activityId), eq(dailyLogs.date, today)),
      );
  }, []);

  const setTodayNiyyahs = useCallback(
    async (activityId: string, niyyahIds: string[]) => {
      const today = getTodayString();
      const [log] = await db
        .select()
        .from(dailyLogs)
        .where(
          and(eq(dailyLogs.activityId, activityId), eq(dailyLogs.date, today)),
        );
      if (!log) return;

      await db.transaction(async (tx) => {
        await tx
          .delete(dailyLogNiyyahs)
          .where(eq(dailyLogNiyyahs.dailyLogId, log.id));
        if (niyyahIds.length > 0) {
          await tx
            .insert(dailyLogNiyyahs)
            .values(
              niyyahIds.map((niyyahId) => ({ dailyLogId: log.id, niyyahId })),
            );
        }
      });
    },
    [],
  );

  return { markComplete, unmarkComplete, setTodayNiyyahs };
}
