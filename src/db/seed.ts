import { eq } from "drizzle-orm";
import * as Sentry from "@sentry/react-native";
import { storage } from "@lib/storage";
import { DEFAULT_ACTIVITY_IDS } from "@data/onboardingDefaults";
import { db } from "./db";
import {
  categories,
  activities,
  niyyahOptions,
  niyyahProfileTags,
  niyyahSources,
  learnContent,
  contentMeta,
  userActivityPrefs,
  customActivities,
  customNiyyahOptions,
  journalEntries,
  dailyLogs,
  dailyLogNiyyahs,
} from "./schema";
import {
  categoriesSeed,
  activitiesSeed,
  niyyahOptionsSeed,
  niyyahProfileTagsSeed,
  niyyahSourcesSeed,
  learnContentSeed,
  mapCategory,
  mapActivity,
  mapNiyyahOption,
  mapNiyyahProfileTag,
  mapNiyyahSource,
  mapLearnContentRow,
} from "./seedMappers";

// Bump when any src/db/seed/v1.0.0/*.json file changes.
export const CONTENT_VERSION = "1.0.0";

const VERSION_KEY = "version";
const MMKV_CLEARED_KEY = "mmkv_content_cleared";
const ACTIVITIES_MIGRATED_KEY = "activities_migrated_from_mmkv";
const JOURNAL_MIGRATED_KEY = "journal_migrated_from_mmkv";
const DAILY_LOGS_MIGRATED_KEY = "daily_logs_migrated_from_mmkv";

type LegacyUserActivity = {
  id: string;
  category?: string;
  name?: { en: string; ar: string };
  niyyahText?: { en: string; ar: string };
  enabled?: boolean;
  customTime?: string;
  customNiyyah?: string;
  customNiyyahOptions?: Array<{ id: string; text: { en: string; ar: string } }>;
};

// Shape matches the old (pre-SQLite) `JournalEntry` type in src/types/index.ts.
type LegacyJournalEntry = {
  id: string;
  activityId: string;
  activityName?: { en: string; ar: string };
  createdAt?: string;
  note?: string;
  selectedNiyyahCount?: number;
  impactfulNiyyah?: string;
};

// Shape matches the old (pre-SQLite) `DailyLog` type in src/types/index.ts.
type LegacyDailyLog = {
  id: string;
  activityId: string;
  date: string;
  completedAt?: string;
  selectedNiyyahIds?: string[];
};

const DEFAULT_ENABLED_IDS = new Set(DEFAULT_ACTIVITY_IDS);

// Legacy MMKV keys are archived under this suffix, never deleted outright,
// so a bad import can't destroy the only copy of pre-SQLite data.
const BACKUP_SUFFIX = "__backup";

/**
 * Result of a one-shot legacy MMKV -> SQLite import.
 * - "imported": rows were written.
 * - "absent": nothing to import (fresh install or validly empty store).
 * - "anomaly": data existed but yielded no rows, or parsing threw. Never mark
 *   migrated or run cleanup: the source blob is the only copy.
 */
type MigrationOutcome = "imported" | "absent" | "anomaly";

// Data existed but produced nothing: the failure that silently destroyed user
// data in the first SQLite release. Sent as a Sentry event because no error is
// thrown on this path, so breadcrumbs alone would never be reported.
function reportMigrationAnomaly(
  key: string,
  reason: string,
  extra: Record<string, unknown> = {},
) {
  Sentry.captureMessage(`Legacy migration anomaly: ${key}`, {
    level: "warning",
    tags: { feature: "db", phase: "legacyMigration" },
    extra: { key, reason, ...extra },
  });
}

// True only for an existing, empty array. A missing or non-array value is a
// shape mismatch (the original data-loss cause) and must still alarm.
function isValidlyEmpty(list: unknown): boolean {
  return Array.isArray(list) && list.length === 0;
}

async function getContentMetaValue(key: string): Promise<string | undefined> {
  const rows = await db
    .select()
    .from(contentMeta)
    .where(eq(contentMeta.key, key));
  return rows[0]?.value;
}

async function seedContent() {
  await db.transaction(async (tx) => {
    for (const row of categoriesSeed) {
      const mapped = mapCategory(row);
      await tx
        .insert(categories)
        .values(mapped)
        .onConflictDoUpdate({
          target: categories.id,
          set: {
            labelEn: mapped.labelEn,
            labelAr: mapped.labelAr,
            icon: mapped.icon,
            sortOrder: mapped.sortOrder,
          },
        });
    }

    await tx.delete(niyyahSources);
    await tx.delete(niyyahProfileTags);
    await tx.delete(niyyahOptions);
    await tx.delete(learnContent);

    for (const row of activitiesSeed) {
      const mapped = mapActivity(row);
      await tx
        .insert(activities)
        .values(mapped)
        .onConflictDoUpdate({
          target: activities.id,
          set: {
            nameEn: mapped.nameEn,
            nameAr: mapped.nameAr,
            category: mapped.category,
            niyyahTextEn: mapped.niyyahTextEn,
            niyyahTextAr: mapped.niyyahTextAr,
            hadithRefEn: mapped.hadithRefEn,
            hadithRefAr: mapped.hadithRefAr,
            defaultTime: mapped.defaultTime,
            sortOrder: mapped.sortOrder,
          },
        });
    }

    await tx
      .insert(niyyahOptions)
      .values(niyyahOptionsSeed.map(mapNiyyahOption));

    if (niyyahProfileTagsSeed.length > 0) {
      await tx
        .insert(niyyahProfileTags)
        .values(niyyahProfileTagsSeed.map(mapNiyyahProfileTag));
    }

    if (niyyahSourcesSeed.length > 0) {
      await tx
        .insert(niyyahSources)
        .values(niyyahSourcesSeed.map(mapNiyyahSource));
    }

    if (learnContentSeed.length > 0) {
      await tx
        .insert(learnContent)
        .values(learnContentSeed.map(mapLearnContentRow));
    }

    const existingPrefs = await tx
      .select({ activityId: userActivityPrefs.activityId })
      .from(userActivityPrefs);
    const existingIds = new Set(existingPrefs.map((p) => p.activityId));

    const missingPrefRows = activitiesSeed
      .filter((a) => !existingIds.has(a.id))
      .map((a) => ({
        activityId: a.id,
        isEnabled: DEFAULT_ENABLED_IDS.has(a.id),
      }));

    if (missingPrefRows.length > 0) {
      await tx.insert(userActivityPrefs).values(missingPrefRows);
    }

    await tx
      .insert(contentMeta)
      .values({ key: VERSION_KEY, value: CONTENT_VERSION })
      .onConflictDoUpdate({
        target: contentMeta.key,
        set: { value: CONTENT_VERSION },
      });
  });
}

// One-time activities import (mmkv -> sqlite). Runs after seedContent() and
// before archiveStaleMmkvContentIfNeeded().
async function migrateLegacyActivitiesIfNeeded(): Promise<MigrationOutcome> {
  const markMigrated = () =>
    db
      .insert(contentMeta)
      .values({ key: ACTIVITIES_MIGRATED_KEY, value: "1" })
      .onConflictDoUpdate({
        target: contentMeta.key,
        set: { value: "1" },
      });

  const migrated = await getContentMetaValue(ACTIVITIES_MIGRATED_KEY);
  const raw = storage.getString("@niyyah_activities");

  // Builds before 2026-08-21 could set this flag without importing anything.
  // Trust the flag only if the source key is gone; if it's still there, the
  // earlier run never archived it, so retry the import.
  if (migrated === "1") {
    if (raw === undefined) return "absent";
    reportMigrationAnomaly(
      "@niyyah_activities",
      "flag marked migrated but source key is still present - retrying import",
    );
  }

  if (raw === undefined) {
    await markMigrated();
    return "absent";
  }

  let legacyActivities: LegacyUserActivity[] = [];
  let parsedStateKeys: string[] = [];
  try {
    const parsed = JSON.parse(raw);
    parsedStateKeys = parsed?.state ? Object.keys(parsed.state) : [];
    legacyActivities = Array.isArray(parsed?.state?.activities)
      ? parsed.state.activities
      : [];
  } catch (err) {
    Sentry.captureException(err, {
      tags: { feature: "db", phase: "legacyMigration" },
      extra: { key: "@niyyah_activities" },
    });
    return "anomaly";
  }

  if (legacyActivities.length === 0) {
    reportMigrationAnomaly(
      "@niyyah_activities",
      "parsed but extracted 0 activities",
      {
        parsedStateKeys,
        rawLength: raw.length,
      },
    );
    return "anomaly";
  }

  const knownActivityIds = new Set(
    (await db.select({ id: activities.id }).from(activities)).map((a) => a.id),
  );

  await db.transaction(async (tx) => {
    for (const a of legacyActivities) {
      const isCustom = a.id.startsWith("custom_");

      if (isCustom) {
        await tx
          .insert(customActivities)
          .values({
            id: a.id,
            nameEn: a.name?.en ?? "",
            nameAr: a.name?.ar ?? "",
            category: a.category || "daily",
            niyyahTextEn: a.niyyahText?.en ?? "",
            niyyahTextAr: a.niyyahText?.ar ?? "",
            isEnabled: a.enabled ?? true,
            createdAt: new Date(),
          })
          .onConflictDoNothing();
      } else if (knownActivityIds.has(a.id)) {
        await tx
          .insert(userActivityPrefs)
          .values({
            activityId: a.id,
            isEnabled: a.enabled ?? false,
            customTime: a.customTime ?? null,
            customNiyyahText: a.customNiyyah ?? null,
          })
          .onConflictDoUpdate({
            target: userActivityPrefs.activityId,
            set: {
              isEnabled: a.enabled ?? false,
              customTime: a.customTime ?? null,
              customNiyyahText: a.customNiyyah ?? null,
            },
          });
      }

      for (const opt of a.customNiyyahOptions ?? []) {
        await tx
          .insert(customNiyyahOptions)
          .values({
            id: opt.id,
            activityId: a.id,
            textEn: opt.text?.en ?? "",
            textAr: opt.text?.ar ?? "",
            createdAt: new Date(),
          })
          .onConflictDoNothing();
      }
    }
  });

  await markMigrated();
  return "imported";
}

// One-time journal import (mmkv -> sqlite). Same ordering as the activities import.
async function migrateLegacyJournalIfNeeded(): Promise<MigrationOutcome> {
  const markMigrated = () =>
    db
      .insert(contentMeta)
      .values({ key: JOURNAL_MIGRATED_KEY, value: "1" })
      .onConflictDoUpdate({
        target: contentMeta.key,
        set: { value: "1" },
      });

  const migrated = await getContentMetaValue(JOURNAL_MIGRATED_KEY);
  const raw = storage.getString("@niyyah_journal");

  // Stale-flag retry: see migrateLegacyActivitiesIfNeeded.
  if (migrated === "1") {
    if (raw === undefined) return "absent";
    reportMigrationAnomaly(
      "@niyyah_journal",
      "flag marked migrated but source key is still present - retrying import",
    );
  }

  if (raw === undefined) {
    await markMigrated();
    return "absent";
  }

  let legacyEntries: LegacyJournalEntry[] = [];
  let parsedStateKeys: string[] = [];
  let validlyEmpty = false;
  try {
    const parsed = JSON.parse(raw);
    parsedStateKeys = parsed?.state ? Object.keys(parsed.state) : [];
    legacyEntries = Array.isArray(parsed?.state?.journalEntries)
      ? parsed.state.journalEntries
      : [];
    validlyEmpty = isValidlyEmpty(parsed?.state?.journalEntries);
  } catch (err) {
    Sentry.captureException(err, {
      tags: { feature: "db", phase: "legacyMigration" },
      extra: { key: "@niyyah_journal" },
    });
    return "anomaly";
  }

  if (validlyEmpty) {
    await markMigrated();
    return "absent";
  }

  if (legacyEntries.length === 0) {
    reportMigrationAnomaly(
      "@niyyah_journal",
      "parsed but extracted 0 entries",
      {
        parsedStateKeys,
        rawLength: raw.length,
      },
    );
    return "anomaly";
  }

  await db.transaction(async (tx) => {
    for (const e of legacyEntries) {
      const createdAt = e.createdAt ? new Date(e.createdAt) : new Date();
      await tx
        .insert(journalEntries)
        .values({
          id: e.id,
          activityId: e.activityId,
          activityNameEn: e.activityName?.en ?? "",
          activityNameAr: e.activityName?.ar ?? "",
          note: e.note ?? "",
          selectedNiyyahCount: e.selectedNiyyahCount ?? 0,
          impactfulNiyyahId: e.impactfulNiyyah ?? null,
          createdAt: Number.isNaN(createdAt.getTime()) ? new Date() : createdAt,
        })
        .onConflictDoNothing();
    }
  });

  await markMigrated();
  return "imported";
}

// One-time daily logs import (mmkv -> sqlite). Same ordering as the activities import.
async function migrateLegacyDailyLogsIfNeeded(): Promise<MigrationOutcome> {
  const markMigrated = () =>
    db
      .insert(contentMeta)
      .values({ key: DAILY_LOGS_MIGRATED_KEY, value: "1" })
      .onConflictDoUpdate({
        target: contentMeta.key,
        set: { value: "1" },
      });

  const migrated = await getContentMetaValue(DAILY_LOGS_MIGRATED_KEY);
  const raw = storage.getString("@niyyah_daily_logs");

  // Stale-flag retry: see migrateLegacyActivitiesIfNeeded.
  if (migrated === "1") {
    if (raw === undefined) return "absent";
    reportMigrationAnomaly(
      "@niyyah_daily_logs",
      "flag marked migrated but source key is still present - retrying import",
    );
  }

  if (raw === undefined) {
    await markMigrated();
    return "absent";
  }

  let legacyLogs: LegacyDailyLog[] = [];
  let parsedStateKeys: string[] = [];
  let validlyEmpty = false;
  try {
    const parsed = JSON.parse(raw);
    parsedStateKeys = parsed?.state ? Object.keys(parsed.state) : [];
    legacyLogs = Array.isArray(parsed?.state?.dailyLogs)
      ? parsed.state.dailyLogs
      : [];
    validlyEmpty = isValidlyEmpty(parsed?.state?.dailyLogs);
  } catch (err) {
    Sentry.captureException(err, {
      tags: { feature: "db", phase: "legacyMigration" },
      extra: { key: "@niyyah_daily_logs" },
    });
    return "anomaly";
  }

  if (validlyEmpty) {
    await markMigrated();
    return "absent";
  }

  if (legacyLogs.length === 0) {
    reportMigrationAnomaly(
      "@niyyah_daily_logs",
      "parsed but extracted 0 logs",
      {
        parsedStateKeys,
        rawLength: raw.length,
      },
    );
    return "anomaly";
  }

  await db.transaction(async (tx) => {
    for (const log of legacyLogs) {
      const completedAt = log.completedAt
        ? new Date(log.completedAt)
        : new Date();
      await tx
        .insert(dailyLogs)
        .values({
          id: log.id,
          activityId: log.activityId,
          date: log.date,
          completedAt: Number.isNaN(completedAt.getTime())
            ? new Date()
            : completedAt,
        })
        .onConflictDoNothing();

      for (const niyyahId of log.selectedNiyyahIds ?? []) {
        // No unique constraint on (dailyLogId, niyyahId) and a stale-flag retry
        // can re-run this loop, so skip existing rows to avoid inflated counts.
        const existing = await tx
          .select({ niyyahId: dailyLogNiyyahs.niyyahId })
          .from(dailyLogNiyyahs)
          .where(eq(dailyLogNiyyahs.dailyLogId, log.id));
        if (existing.some((r) => r.niyyahId === niyyahId)) continue;

        await tx
          .insert(dailyLogNiyyahs)
          .values({ dailyLogId: log.id, niyyahId });
      }
    }
  });

  await markMigrated();
  return "imported";
}

// One-time MMKV cleanup. Copies each legacy blob to `<key>__backup` before
// removing the original. Runs only when every import is "imported" or "absent";
// a single "anomaly" skips it and keeps the originals for a later retry.
async function archiveStaleMmkvContentIfNeeded(outcomes: MigrationOutcome[]) {
  if (outcomes.includes("anomaly")) {
    Sentry.captureMessage("Legacy MMKV cleanup skipped: import anomaly", {
      level: "warning",
      tags: { feature: "db", phase: "legacyMigration" },
      extra: { outcomes },
    });
    return;
  }

  const cleared = await getContentMetaValue(MMKV_CLEARED_KEY);
  if (cleared === "1") return;

  for (const key of [
    "@niyyah_activities",
    "@niyyah_journal",
    "@niyyah_daily_logs",
  ]) {
    const raw = storage.getString(key);
    if (raw) storage.set(`${key}${BACKUP_SUFFIX}`, raw);
    storage.delete(key);
  }

  await db
    .insert(contentMeta)
    .values({ key: MMKV_CLEARED_KEY, value: "1" })
    .onConflictDoUpdate({
      target: contentMeta.key,
      set: { value: "1" },
    });
}

// Call once on launch after migrations succeed (see _layout.tsx).
export async function seedIfNeeded() {
  const currentVersion = await getContentMetaValue(VERSION_KEY);

  if (currentVersion !== CONTENT_VERSION) {
    await seedContent();
  }

  // Run all three even after an anomaly; the imports are independent.
  const outcomes: MigrationOutcome[] = [
    await migrateLegacyActivitiesIfNeeded(),
    await migrateLegacyJournalIfNeeded(),
    await migrateLegacyDailyLogsIfNeeded(),
  ];

  await archiveStaleMmkvContentIfNeeded(outcomes);
}
