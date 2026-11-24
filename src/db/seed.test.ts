import { storage } from "@lib/storage";
import * as Sentry from "@sentry/react-native";
import {
  contentMeta,
  activities,
  userActivityPrefs,
  journalEntries,
  dailyLogs,
  dailyLogNiyyahs,
  categories,
} from "./schema";
import { seedIfNeeded } from "./seed";

// The one place `eq()` is used in seed.ts is `.where(eq(contentMeta.key, key))`
// inside getContentMetaValue(). Real drizzle-orm builds a SQL AST here that our
// fake db can't evaluate, so replace it with a plain marker object the fake
// db's `.where()` can read directly. This is the only reason drizzle-orm is
// mocked - schema.ts uses the separate `drizzle-orm/sqlite-core` subpath and
// is unaffected.
jest.mock("drizzle-orm", () => ({
  eq: (_column: unknown, value: unknown) => ({ __eqValue: value }),
}));

// A minimal in-memory stand-in for the real expo-sqlite/drizzle `db`. Tables
// are keyed by the real schema table object's identity (imported for real
// below), so this stays correct even if column names change. Only
// `content_meta` gets real upsert-by-key semantics, since that's the only
// table these tests assert on; every other table just accumulates rows so
// `seedContent()`'s bulk inserts don't crash.
jest.mock("./db", () => {
  const { contentMeta } = require("./schema");
  const tables = new Map<unknown, Record<string, unknown>[]>();

  const rowsFor = (table: unknown) => {
    if (!tables.has(table)) tables.set(table, []);
    return tables.get(table)!;
  };

  const makeApi = (): Record<string, unknown> => ({
    select: (_cols?: unknown) => ({
      from: (table: unknown) => {
        const rows = rowsFor(table);
        const resolveAll = () => Promise.resolve(rows.map((r) => ({ ...r })));
        return {
          where: (cond: { __eqValue?: unknown }) => {
            if (table === contentMeta && cond && "__eqValue" in cond) {
              return Promise.resolve(
                rows
                  .filter((r) => r.key === cond.__eqValue)
                  .map((r) => ({ ...r })),
              );
            }
            return resolveAll();
          },
          then: (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) =>
            resolveAll().then(resolve, reject),
        };
      },
    }),
    insert: (table: unknown) => ({
      values: (v: Record<string, unknown> | Record<string, unknown>[]) => {
        const arr = Array.isArray(v) ? v : [v];
        const commitPlain = () => {
          rowsFor(table).push(...arr.map((r) => ({ ...r })));
        };
        const chain = {
          onConflictDoUpdate: ({ set }: { target: unknown; set?: Record<string, unknown> }) => {
            const rows = rowsFor(table);
            for (const row of arr) {
              if (table === contentMeta) {
                const existing = rows.find((r) => r.key === row.key);
                if (existing) Object.assign(existing, set ?? row);
                else rows.push({ ...row });
              } else {
                rows.push({ ...row });
              }
            }
            return Promise.resolve();
          },
          onConflictDoNothing: () => {
            commitPlain();
            return Promise.resolve();
          },
          then: (resolve: (v: unknown) => unknown) => {
            commitPlain();
            return Promise.resolve().then(resolve);
          },
        };
        return chain;
      },
    }),
    delete: (table: unknown) => {
      rowsFor(table).length = 0;
      return Promise.resolve();
    },
    transaction: (cb: (tx: unknown) => unknown) => cb(makeApi()),
  });

  return { db: makeApi(), __tables: tables };
});

jest.mock("@lib/storage", () => {
  const state = new Map<string, string>();
  return {
    storage: {
      getString: jest.fn((key: string) => state.get(key)),
      set: jest.fn((key: string, value: string) => {
        state.set(key, String(value));
      }),
      delete: jest.fn((key: string) => {
        state.delete(key);
      }),
      clearAll: jest.fn(() => state.clear()),
      __state: state,
    },
  };
});

jest.mock("@sentry/react-native", () => ({
  captureException: jest.fn(),
  captureMessage: jest.fn(),
}));

const tables = (jest.requireMock("./db") as { __tables: Map<unknown, Record<string, unknown>[]> })
  .__tables;
const mmkvState = (storage as unknown as { __state: Map<string, string> }).__state;

function contentMetaValue(key: string): string | undefined {
  const rows = tables.get(contentMeta) ?? [];
  return rows.find((r) => r.key === key)?.value as string | undefined;
}

beforeEach(() => {
  tables.clear();
  mmkvState.clear();
  jest.clearAllMocks();
});

describe("seedIfNeeded - legacy MMKV migration", () => {
  it("fresh install: all three keys absent -> marks migrated, no anomaly, cleanup runs", async () => {
    await seedIfNeeded();

    expect(contentMetaValue("activities_migrated_from_mmkv")).toBe("1");
    expect(contentMetaValue("journal_migrated_from_mmkv")).toBe("1");
    expect(contentMetaValue("daily_logs_migrated_from_mmkv")).toBe("1");
    expect(contentMetaValue("mmkv_content_cleared")).toBe("1");
    expect(Sentry.captureMessage).not.toHaveBeenCalled();
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it("anomaly (empty array): reports a real Sentry event, does not mark migrated, skips cleanup entirely, preserves the source key", async () => {
    storage.set("@niyyah_activities", JSON.stringify({ state: { activities: [] } }));

    await seedIfNeeded();

    expect(contentMetaValue("activities_migrated_from_mmkv")).toBeUndefined();
    expect(contentMetaValue("mmkv_content_cleared")).toBeUndefined();
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      expect.stringContaining("Legacy migration anomaly: @niyyah_activities"),
      expect.objectContaining({ level: "warning" }),
    );
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      "Legacy MMKV cleanup skipped: import anomaly",
      expect.any(Object),
    );
    // The all-or-nothing gate: nothing gets deleted, even keys that were
    // never touched (journal/daily-logs were legitimately absent).
    expect(storage.delete).not.toHaveBeenCalled();
    expect(mmkvState.get("@niyyah_activities")).toBe(
      JSON.stringify({ state: { activities: [] } }),
    );
  });

  it("validly empty daily logs and journal: no anomaly, marked migrated, archived (the Sentry REACT-NATIVE-12 case)", async () => {
    const rawLogs = JSON.stringify({ state: { dailyLogs: [], streak: 0 }, version: 0 });
    const rawJournal = JSON.stringify({ state: { journalEntries: [] }, version: 0 });
    storage.set("@niyyah_daily_logs", rawLogs);
    storage.set("@niyyah_journal", rawJournal);

    await seedIfNeeded();

    expect(Sentry.captureMessage).not.toHaveBeenCalled();
    expect(contentMetaValue("daily_logs_migrated_from_mmkv")).toBe("1");
    expect(contentMetaValue("journal_migrated_from_mmkv")).toBe("1");
    expect(contentMetaValue("mmkv_content_cleared")).toBe("1");
    expect(mmkvState.has("@niyyah_daily_logs")).toBe(false);
    expect(mmkvState.get("@niyyah_daily_logs__backup")).toBe(rawLogs);
    expect(mmkvState.get("@niyyah_journal__backup")).toBe(rawJournal);
  });

  it("anomaly (daily logs wrong shape: dailyLogs missing or not an array): still reports and keeps the source", async () => {
    const raw = JSON.stringify({ state: { dailyLogs: { oops: true }, streak: 0 } });
    storage.set("@niyyah_daily_logs", raw);

    await seedIfNeeded();

    expect(contentMetaValue("daily_logs_migrated_from_mmkv")).toBeUndefined();
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      expect.stringContaining("Legacy migration anomaly: @niyyah_daily_logs"),
      expect.objectContaining({ level: "warning" }),
    );
    expect(storage.delete).not.toHaveBeenCalled();
    expect(mmkvState.get("@niyyah_daily_logs")).toBe(raw);
  });

  it("anomaly (malformed JSON): reports captureException, does not mark migrated, skips cleanup", async () => {
    storage.set("@niyyah_activities", "not valid json{");

    await seedIfNeeded();

    expect(contentMetaValue("activities_migrated_from_mmkv")).toBeUndefined();
    expect(Sentry.captureException).toHaveBeenCalled();
    expect(contentMetaValue("mmkv_content_cleared")).toBeUndefined();
    expect(storage.delete).not.toHaveBeenCalled();
    expect(mmkvState.get("@niyyah_activities")).toBe("not valid json{");
  });

  it("happy path: real data imports, then originals are archived (not deleted outright)", async () => {
    const rawActivities = JSON.stringify({
      state: { activities: [{ id: "fajr", enabled: true }] },
    });
    const rawJournal = JSON.stringify({
      state: { journalEntries: [{ id: "j1", activityId: "fajr" }] },
    });
    const rawLogs = JSON.stringify({
      state: { dailyLogs: [{ id: "l1", activityId: "fajr", date: "2026-08-21" }] },
    });
    storage.set("@niyyah_activities", rawActivities);
    storage.set("@niyyah_journal", rawJournal);
    storage.set("@niyyah_daily_logs", rawLogs);

    await seedIfNeeded();

    expect(contentMetaValue("activities_migrated_from_mmkv")).toBe("1");
    expect(contentMetaValue("journal_migrated_from_mmkv")).toBe("1");
    expect(contentMetaValue("daily_logs_migrated_from_mmkv")).toBe("1");
    expect(contentMetaValue("mmkv_content_cleared")).toBe("1");
    expect(Sentry.captureMessage).not.toHaveBeenCalled();
    expect(Sentry.captureException).not.toHaveBeenCalled();

    // Originals gone, but archived under the backup suffix with the exact
    // original bytes - this is the actual fix, so assert it directly.
    expect(mmkvState.has("@niyyah_activities")).toBe(false);
    expect(mmkvState.get("@niyyah_activities__backup")).toBe(rawActivities);
    expect(mmkvState.has("@niyyah_journal")).toBe(false);
    expect(mmkvState.get("@niyyah_journal__backup")).toBe(rawJournal);
    expect(mmkvState.has("@niyyah_daily_logs")).toBe(false);
    expect(mmkvState.get("@niyyah_daily_logs__backup")).toBe(rawLogs);

    // Verify SQLite output data
    expect(tables.get(userActivityPrefs)).toContainEqual(
      expect.objectContaining({ activityId: "fajr", isEnabled: true })
    );
    expect(tables.get(journalEntries)).toContainEqual(
      expect.objectContaining({ id: "j1", activityId: "fajr" })
    );
    expect(tables.get(dailyLogs)).toContainEqual(
      expect.objectContaining({ id: "l1", activityId: "fajr", date: "2026-08-21" })
    );
  });

  it("partial anomaly: a failure in one import blocks cleanup for the ones that succeeded too", async () => {
    storage.set(
      "@niyyah_activities",
      JSON.stringify({ state: { activities: [{ id: "fajr", enabled: true }] } }),
    );
    // journal present but the wrong shape (no journalEntries array) -> anomaly.
    // daily logs absent -> fine.
    storage.set("@niyyah_journal", JSON.stringify({ state: { somethingElse: [] } }));

    await seedIfNeeded();

    expect(contentMetaValue("activities_migrated_from_mmkv")).toBe("1");
    expect(contentMetaValue("journal_migrated_from_mmkv")).toBeUndefined();
    expect(contentMetaValue("daily_logs_migrated_from_mmkv")).toBe("1");
    // Cleanup did NOT run at all, even for the activities key that imported
    // successfully - the archive/delete step is all-or-nothing.
    expect(contentMetaValue("mmkv_content_cleared")).toBeUndefined();
    expect(storage.delete).not.toHaveBeenCalled();
    expect(mmkvState.has("@niyyah_activities")).toBe(true);
    expect(mmkvState.has("@niyyah_journal")).toBe(true);
  });

  it("does not re-run a migration that is genuinely done (flag set, source key gone)", async () => {
    await seedIfNeeded();
    jest.clearAllMocks();

    await seedIfNeeded();

    // Both keys are already gone at this point (archived on the first call),
    // so there is nothing to react to on a second run.
    expect(Sentry.captureMessage).not.toHaveBeenCalled();
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it("stale flag recovery: flag says migrated but the source key is still present (the actual incident) -> retries and imports for real", async () => {
    // Simulates a pre-2026-08-21 build that marked the flag done without ever
    // importing anything, then crashed before archiving the source key - the
    // exact scenario this fix exists for.
    tables.set(contentMeta, [
      { key: "activities_migrated_from_mmkv", value: "1" },
    ]);
    const rawActivities = JSON.stringify({
      state: { activities: [{ id: "fajr", enabled: true }] },
    });
    storage.set("@niyyah_activities", rawActivities);

    await seedIfNeeded();

    // Flags a stale-flag anomaly for visibility, but does not treat it as a
    // hard failure - it retries the import, which succeeds, and the key is
    // archived like a normal successful run.
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      expect.stringContaining("Legacy migration anomaly: @niyyah_activities"),
      expect.objectContaining({
        extra: expect.objectContaining({
          reason: expect.stringContaining("source key is still present"),
        }),
      }),
    );
    expect(contentMetaValue("mmkv_content_cleared")).toBe("1");
    expect(mmkvState.has("@niyyah_activities")).toBe(false);
    expect(mmkvState.get("@niyyah_activities__backup")).toBe(rawActivities);
  });

  it("stale flag with truly nothing left to import (flag set, key genuinely absent) -> absent, no anomaly, no retry", async () => {
    tables.set(contentMeta, [
      { key: "activities_migrated_from_mmkv", value: "1" },
    ]);

    await seedIfNeeded();

    expect(Sentry.captureMessage).not.toHaveBeenCalled();
    expect(Sentry.captureException).not.toHaveBeenCalled();
    expect(contentMetaValue("mmkv_content_cleared")).toBe("1");
  });

  it("dailyLogNiyyahs retry: prevents duplicate niyyahs if a legacy log migration is retried", async () => {
    const rawLogs = JSON.stringify({
      state: { dailyLogs: [{ id: "l2", activityId: "fajr", date: "2026-08-22", selectedNiyyahIds: ["n1", "n2"] }] },
    });
    storage.set("@niyyah_daily_logs", rawLogs);
    
    // First run
    await seedIfNeeded();
    
    const niyyahs = tables.get(dailyLogNiyyahs) ?? [];
    expect(niyyahs.filter((r) => r.dailyLogId === "l2")).toHaveLength(2);

    // Simulate stale flag scenario for daily logs so it retries
    tables.set(contentMeta, [
      { key: "daily_logs_migrated_from_mmkv", value: "1" },
    ]);
    storage.set("@niyyah_daily_logs", rawLogs); // Put the source key back

    await seedIfNeeded(); // Retry

    // The count should still be 2, not 4
    const niyyahsAfter = tables.get(dailyLogNiyyahs) ?? [];
    expect(niyyahsAfter.filter((r) => r.dailyLogId === "l2")).toHaveLength(2);
  });
});

describe("seedContent - fresh install", () => {
  it("populates default activities and categories on fresh install", async () => {
    await seedIfNeeded(); // Triggers seedContent internally

    const cats = tables.get(categories) ?? [];
    const acts = tables.get(activities) ?? [];

    expect(cats.length).toBeGreaterThan(0);
    expect(acts.length).toBeGreaterThan(0);
  });
});
