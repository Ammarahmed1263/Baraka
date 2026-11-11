import { useCallback } from "react";
import { eq, sql, inArray } from "drizzle-orm";
import { db } from "@/db/db";
import {
  activities,
  userActivityPrefs,
  customActivities,
  customNiyyahOptions,
  dailyLogNiyyahs,
} from "@/db/schema";
import { generateCustomId } from "@utils/id";
import { getLengthBucket } from "@utils/lengthBucket";
import { activityProps, track } from "@lib/analytics";

export function useActivityActions() {
  const toggleActivity = useCallback(
    async (activityId: string, isCustom: boolean) => {
      if (isCustom) {
        await db
          .update(customActivities)
          .set({ isEnabled: sql`NOT ${customActivities.isEnabled}` })
          .where(eq(customActivities.id, activityId));
        return;
      }

      await db
        .insert(userActivityPrefs)
        .values({ activityId, isEnabled: true })
        .onConflictDoUpdate({
          target: userActivityPrefs.activityId,
          set: { isEnabled: sql`NOT ${userActivityPrefs.isEnabled}` },
        });
    },
    [],
  );

  const setEnabledActivities = useCallback(async (enabledIds: string[]) => {
    const allIds = (
      await db.select({ id: activities.id }).from(activities)
    ).map((a) => a.id);
    const enabledSet = new Set(enabledIds);

    await db.transaction(async (tx) => {
      for (const activityId of allIds) {
        await tx
          .insert(userActivityPrefs)
          .values({ activityId, isEnabled: enabledSet.has(activityId) })
          .onConflictDoUpdate({
            target: userActivityPrefs.activityId,
            set: { isEnabled: enabledSet.has(activityId) },
          });
      }
    });
  }, []);

  const updateActivityPrefs = useCallback(
    async (
      activityId: string,
      updates: Partial<{
        customTime: string | null;
        customNiyyahText: string | null;
      }>,
    ) => {
      await db
        .update(userActivityPrefs)
        .set(updates)
        .where(eq(userActivityPrefs.activityId, activityId));
      if (updates.customNiyyahText?.trim()) {
        track("intention_written", {
          ...activityProps(activityId),
          length_bucket: getLengthBucket(updates.customNiyyahText),
        });
      }
    },
    [],
  );

  const addCustomActivity = useCallback(
    async (
      data: {
        nameEn: string;
        nameAr: string;
        category: string;
        niyyahTextEn: string;
        niyyahTextAr: string;
      },
      // True when the user typed their own intention rather than accepting the generated default.
      options: { userWroteIntention?: boolean } = {},
    ) => {
      const id = generateCustomId();
      await db.insert(customActivities).values({
        id,
        ...data,
        isEnabled: true,
        createdAt: new Date(),
      });
      track("custom_activity_created", {});
      if (options.userWroteIntention) {
        track("intention_written", {
          ...activityProps(id),
          length_bucket: getLengthBucket(data.niyyahTextEn),
        });
      }
      return id;
    },
    [],
  );

  const updateCustomActivityNiyyahText = useCallback(
    async (activityId: string, text: string) => {
      await db
        .update(customActivities)
        .set({ niyyahTextEn: text, niyyahTextAr: text })
        .where(eq(customActivities.id, activityId));
      if (text.trim()) {
        track("intention_written", {
          ...activityProps(activityId),
          length_bucket: getLengthBucket(text),
        });
      }
    },
    [],
  );

  const updateCustomActivityName = useCallback(
    async (activityId: string, name: string) => {
      await db
        .update(customActivities)
        .set({ nameEn: name, nameAr: name })
        .where(eq(customActivities.id, activityId));
    },
    [],
  );

  const deleteCustomActivity = useCallback(async (activityId: string) => {
    await db.transaction(async (tx) => {
      const optionIds = (
        await tx
          .select({ id: customNiyyahOptions.id })
          .from(customNiyyahOptions)
          .where(eq(customNiyyahOptions.activityId, activityId))
      ).map((r) => r.id);

      if (optionIds.length > 0) {
        await tx
          .delete(dailyLogNiyyahs)
          .where(inArray(dailyLogNiyyahs.niyyahId, optionIds));
        await tx
          .delete(customNiyyahOptions)
          .where(eq(customNiyyahOptions.activityId, activityId));
      }

      await tx
        .delete(customActivities)
        .where(eq(customActivities.id, activityId));
    });
  }, []);

  const addCustomNiyyahOption = useCallback(
    async (activityId: string, textEn: string, textAr: string) => {
      const id = generateCustomId();
      await db.insert(customNiyyahOptions).values({
        id,
        activityId,
        textEn,
        textAr,
        createdAt: new Date(),
      });
      track("sub_intention_created", {
        parent_custom: activityProps(activityId).custom,
      });
      return id;
    },
    [],
  );

  const deleteCustomNiyyahOption = useCallback(async (optionId: string) => {
    await db.transaction(async (tx) => {
      await tx
        .delete(dailyLogNiyyahs)
        .where(eq(dailyLogNiyyahs.niyyahId, optionId));
      await tx
        .delete(customNiyyahOptions)
        .where(eq(customNiyyahOptions.id, optionId));
    });
  }, []);

  return {
    toggleActivity,
    setEnabledActivities,
    updateActivityPrefs,
    addCustomActivity,
    updateCustomActivityNiyyahText,
    updateCustomActivityName,
    deleteCustomActivity,
    addCustomNiyyahOption,
    deleteCustomNiyyahOption,
  };
}
