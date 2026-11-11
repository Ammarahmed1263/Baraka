# Baraka Architecture

This document covers the reasoning behind Baraka's technical decisions and the real engineering problems found and fixed along the way. For setup instructions and a feature overview, see [README.md](./README.md).

---

## Data layer: SQLite (expo-sqlite) + Drizzle ORM, not Realm or WatermelonDB

The app migrated from Zustand+MMKV arrays to a relational SQLite schema with Drizzle. Settings alone stayed on MMKV/Zustand. Everything else (activities, niyyah options, daily logs, journal entries, custom content) needed real relational integrity, which the old static-array model didn't have. Orphaned niyyah options pointing at activities that no longer existed were a real bug found under the old model.

| | expo-sqlite + Drizzle | WatermelonDB | Realm |
|---|---|---|---|
| Maintenance | Built into the Expo SDK, actively maintained | Actively maintained, independent | **Deprecated by MongoDB (2024).** Atlas Device Sync and official support ended; community fork only |
| Data model | Real SQL, explicit foreign keys | Relational under the hood (SQLite/IndexedDB), accessed via an object-oriented ORM layer | NoSQL-style object database |
| Type safety | Full TypeScript inference from schema | Typed, more boilerplate (decorators/model classes) | Typed, different mental model from SQL |
| Built-in sync | None, added incrementally if and when needed | Built-in sync *protocol* (still requires hosting your own backend) | Was Realm's headline feature, and the exact part MongoDB deprecated |
| Fit here | Small, genuinely relational dataset, single-device, no sync requirement | Overkill for sync/lazy-loading machinery on a few thousand rows at most | Wrong shape even before deprecation |

`PRAGMA foreign_keys = ON` is set on every connection. Two deliberate exceptions: `daily_logs.activity_id`, `journal_entries.activity_id`, and `custom_niyyah_options.activity_id` carry no foreign key, because an activity id can come from either `activities` (built-in) or `custom_activities` (user-created). That's a polymorphic reference, not an oversight. History is treated as immutable: a daily log's niyyah references aren't cascade-linked to content tables, so re-seeding or removing a niyyah option can never retroactively corrupt a user's past logs. The same principle governs custom activity deletion: it cascades to that activity's own `custom_niyyah_options` (and their `daily_log_niyyahs` rows), since those are just definitions, but deliberately leaves `daily_logs`/`journal_entries` untouched, since those are the record of what the user actually did and must survive the definition being deleted, not shrink someone's real streak just because they cleaned up a stale activity.

Core tables: `categories`, `activities`, `niyyah_options`, `niyyah_profile_tags`, `niyyah_sources`, `learn_content`, `content_meta`, `user_activity_prefs`, `custom_activities`, `custom_niyyah_options`, `daily_logs`, `daily_log_niyyahs`, `journal_entries`.

Content tables (`activities`, `niyyah_options`, `learn_content`, etc.) are wiped and re-seeded on content-version bumps. User tables are never touched by seeding. `niyyah_sources` exists ahead of use: the schema already supports layering Qur'an/athar/scholar citations alongside a hadith reference, for a planned multi-source evidencing feature.

**Why not sync from the start, given cross-device sync might matter eventually?** WatermelonDB's "built-in sync" is a client-side protocol, not a hosted service. It still requires building and running your own sync backend, which is the actual hard part regardless of local DB choice. The current architecture doesn't block adding sync later (a changes/outbox table, timestamp-based diffing, syncing through a future API). It just means sync is a deliberate v2+ addition on top of a working local-first app, not something built speculatively before it's needed.

---

## Reactive queries, and a real gotcha found the hard way

Screens read via Drizzle's `useLiveQuery`, which re-renders on writes to the query's table. What's not obvious: **it only subscribes to the query's `FROM` table, not anything `leftJoin`-ed in.** A screen joining `activities` with `user_activity_prefs` never re-rendered when a preference toggled, because the write landed on the joined table. Fixed by splitting into two live queries and merging in JS. That's now the standing pattern for any screen that needs to join user-mutable data onto content data.

---

## Async local reads still need a loading state, just not a network-shaped one

SQLite reads are asynchronous even though they're fast. Looking at the hook's actual source, `useLiveQuery` seeds `data` to `[]` and resolves in an effect, so the first render is empty regardless of query speed. That means naive code can't tell "still loading" from "genuinely empty." This was a real bug: Activity Detail could briefly render "not found" before its query had actually run.

The fix uses `updatedAt` (undefined until the query's first resolve) as the sole reliable signal, since `data` alone is ambiguous. Skeleton loaders shaped to match real content, not spinners, not blank screens, render during that window. A full skeleton treatment would be overkill for a sub-100ms local read, but silently asserting a false negative isn't acceptable either. This also connects to the app's general interaction standard of eliminating `null` layouts rather than reintroducing them for a narrow case.

---

## Bilingual by default, RTL enforced, not detected

Arabic is the enforced default for every fresh install, regardless of device locale. That's a deliberate product decision, not a fallback. RTL layout is driven through `I18nManager.allowRTL`/`forceRTL` in lockstep with language, with explicit app reloads on runtime language changes, since `forceRTL` doesn't retroactively re-layout an already-rendered tree. Content is fetched as a single localized column at the SQL level (`nameEn`/`nameAr` resolved at query time) rather than fetching both and picking client-side. That means less data moved and simpler mapping, with the accepted tradeoff that search only matches the current UI language.

---

## Observability tuned for a free-tier quota, not just "add Sentry"

Breadcrumbs, tags, and context (language, platform, an anonymous UUID, app config) are free and used liberally. `captureException`/`captureMessage`, the quota-consuming calls, are reserved for actual crashes and one genuine warning condition (a store-hydration timeout). No PII is sent (`sendDefaultPii: false`). The user identifier is a generated, anonymous UUID, never anything real.

---

## Product analytics: opt-in PostHog behind a single wrapper

Sentry answers "is it broken"; it can't answer "do people come back". Baraka uses PostHog (Product Analytics only, US cloud) for retention and a small set of usage events. It is built around the fact that this app holds private reflection text.

- **Opt-in, off by default.** A "Share Usage Data" toggle in Settings plus a one-time consent sheet on Home after the user's first completed activity. Asking at the end of onboarding was built and reverted: it was friction at first impression for little gain, and the cost is that nothing can be captured before consent, so an `onboarding_completed` event was dropped.
- **One door.** `src/lib/analytics.ts` is the only file that imports `posthog-react-native`. It exposes `initAnalytics`, `setAnalyticsEnabled`, `track` and `activityProps`. `track()` is typed against `AnalyticsEventMap` (`src/types/analytics.ts`), the single catalog of every event and its exact properties, so a misspelled event or an extra property such as a note fails typecheck and a call site cannot pass free text by construction, and `activityProps()` collapses custom activity ids to `"custom"` so user-named activities never leave the device.
- **Standalone client, not `PostHogProvider`.** Touch and screen autocapture are provider features, so they cannot run here at all. The docs allow passing this instance to a provider later through its `client` prop.
- **Dedicated MMKV instance (`id: "posthog"`).** Kept apart from the `"baraka-store"` instance that `seed.ts` reads for the legacy migration, so SDK state can never interact with the most fragile storage in the app. "Clear Data" does not wipe it unless that is wired in deliberately.
- **Identity.** No `identify()` call: the app has no accounts, so PostHog keeps its own random anonymous id (separate from the one Sentry gets).
- **Dev safety.** `disabled` is `__DEV__ && EXPO_PUBLIC_POSTHOG_DEBUG !== "true"`, so development never pollutes the production project. Setting the debug variable in `.env.local` is the deliberate escape hatch for testing.
- **Events:** the full list, properties, privacy rules and the question each answers are in `docs/analytics.md`, which is the source of truth. Summary: `analytics_opted_in`, `niyyah_renewed`, `intention_written`, `custom_activity_created`, `sub_intention_created`, `journal_entry_saved`, `streak_broken`, `notification_opened`, a manual `$screen` carrying the route pattern, and the SDK's lifecycle events. Three super properties (`app_language`, `reminders_enabled`, `notification_permission`) ride on every event. Retention is read from "Application Opened" in a Retention insight.
- **Consent is the SDK's.** `defaultOptIn: false` plus persisted `optIn()` / `optOut()`; the SDK drops every event (custom, `$screen`, lifecycle) while opted out. Session wiring (screen tracking, super properties, streak-break check) is in `src/hooks/useAnalyticsTracking.ts`; once-only guards (`claimOnce`) and the notification session source live in `src/lib/analytics.ts`.
- **Project settings:** discard client IP data on; session replay, console log capture, canvas capture and exception autocapture off.

Because the SDK ships native modules (`posthog-react-native`, `expo-device`, `expo-application`), this had to go out as a store release, not an OTA update.

---

## Content integrity as an engineering constraint, not just a content rule

Every niyyah option must trace to a canonical hadith source (Bukhari, Muslim, Tirmidhi, Abu Dawud, Ibn Majah, Nasai) with a specific number, verified against sunnah.com. No weak or fabricated hadith, ever, even if it means cutting a whole activity rather than lowering the bar. Niyyah itself is treated as heart-based, not spoken (per Ibn Taymiyyah, *Majmu' al-Fatawa*). That shows up as an explicit disclaimer in onboarding and on the activity screen, not just as a data constraint.

---

## Smaller, deliberate product and tooling calls

- **Expo (managed + dev client) over bare React Native CLI.** The ecosystem matured enough that bare CLI's main advantage, full native control, stopped being worth losing Expo's tooling. `expo-dev-client` still allows custom native modules.
- **A single daily reminder for v1**, not per-activity notifications. Per-activity reminders were judged likely to feel overwhelming rather than helpful, so they were deferred to v2 alongside prayer-time auto-detection.
- **Streak logic is strict by design.** Missing a day resets the streak, no grace period, matching the app's premise that consistency is the point.
- **Onboarding caps additional activity selection at 5.** The 5 daily prayers are pre-selected as the baseline, and the cap nudges new users toward a handful of activities that are genuinely theirs rather than enabling everything at once.
- **Bun** as the package manager, chosen for install and CI speed over npm, yarn, or pnpm.

---

## Notable Engineering Problems

Real bugs found and fixed during the SQLite migration and afterward.

| Problem | Root cause | Fix |
|---|---|---|
| **3 of 4 real test devices lost all local data (custom activities, journal, daily logs) updating from the first SQLite build to the next** | The one-shot MMKV to SQLite import treated "raw MMKV key missing, empty, or malformed" as equivalent to "nothing to import." It marked itself done and permanently deleted the source key with zero error surfaced. Root-caused via exhaustive elimination (ruled out uninstall/reinstall, signing mismatch, MMKV instance changes) to a likely narrow timing window where `seedIfNeeded()` could run before MMKV had actually finished hydrating, since it originally gated only on migration success, not on settings-store loading | The old "clear stale data" step now archives each key to `<key>__backup` instead of deleting it, so it never destroys the only copy. Each migration function now returns an explicit outcome (imported, absent, or anomaly). An "anomaly" fires a real `Sentry.captureMessage()`, doesn't mark itself done so a fixed build retries, and blocks the archive step from running at all until every migration succeeds. `seedIfNeeded()` now also waits on settings-store hydration, not just migration success. A new regression suite covers every outcome branch, verified meaningful by deliberately breaking the safety gate and confirming the right tests failed. Already-affected testers' data could not be recovered. The exact trigger was never proven live, and that's documented rather than hidden (see Open Gaps) |
| Home screen got stuck on its loading skeleton forever for some users after an in-place update | The root navigator rendered before migrations and seeding had finished, and the data hooks never retried a failed initial query except on a write to the table that failed, so a slow or failed first read just hung. A related bug in the same area: content re-seeding deleted and reinserted the `activities` table on every content-version bump, which would have violated a foreign key from `user_activity_prefs` on any existing install and silently blocked all future content updates | Extracted a `RootNavigator` that gates rendering on migrations and seed completion, added an `ErrorFallbackUI` recovery screen and a 10-second boot watchdog reporting to Sentry, and introduced `useSafeLiveQuery` (retries up to 3 times, then resolves to a non-loading empty state and reports to Sentry) across every live-query call site. `activities` is now upserted on re-seed instead of deleted and reinserted |
| Existing users lost their activity selections on upgrade | The legacy-data backfill only filled missing rows. On a fresh SQLite DB every row is missing, so everyone got plain defaults instead of their real selections | One-shot, flag-guarded `migrateLegacyActivitiesIfNeeded()`, run once before the old storage is cleared |
| The same bug existed for journal entries and daily logs, undetected | The activities migration got a fix, but journal and logs never got the equivalent. Found by auditing the seeding code, not by a bug report | Added `migrateLegacyJournalIfNeeded()` and `migrateLegacyDailyLogsIfNeeded()`, same one-shot pattern, verified against the real legacy storage shape rather than guessed |
| Built-in activity toggles silently didn't update the UI | `useLiveQuery` only subscribes to its `FROM` table, and the write landed on a `leftJoin`-ed table | Split into two live queries, merged in JS |
| First onboarding slide rendered fully blank once Arabic/RTL was enforced by default | A manual RTL index-reversal in the parallax animation double-compensated for FlatList's own automatic RTL mirroring, putting the visible slide's computed position outside the interpolation's domain, which clamped its opacity to 0 | Removed the manual reversal. FlatList already handles RTL mirroring, so the animation math doesn't need to know about `I18nManager.isRTL` at all |
| Day rollover showed yesterday's completions as today's | Deleting code whose stated purpose was obsolete also silently removed its undocumented side effect, the app's only `AppState` listener | Rebuilt as `useToday()`, resyncing on both app resume and midnight |
| "Clear Data" left most user data intact | It only ever wiped the old key-value storage, never touched SQLite | Added a real `clearUserData()` covering every user table |
| New `AppSwitch` toggle animated in the wrong direction in Arabic (thumb exited the track on the wrong side) | `transform`/`translateX` is never auto-mirrored by RN's RTL layout flip — only flexbox layout is | Flip travel distance explicitly via `I18nManager.isRTL` |
| New rename/delete bottom sheet's text input was completely covered by the keyboard, and nothing happened when it opened | Two compounding bugs: (1) the input used plain RN `TextInput`, but `@gorhom/bottom-sheet`'s keyboard-follow logic only activates for a `TextInput` that registers itself via their own `BottomSheetTextInput` on focus; (2) `android_keyboardInputMode="adjustResize"` was tried as a fix but actually *disables* the library's JS keyboard-follow logic on Android (confirmed by reading `BottomSheet.tsx`'s source) — the opposite of what the name suggests | `AppTextInput` gained a `bottomSheet` prop that swaps in `BottomSheetTextInput`; `android_keyboardInputMode` left at its default (`adjustPan`), with `keyboardBehavior="interactive"` + `keyboardBlurBehavior="restore"` doing the actual work |
| A user with analytics off could still have had events queued at startup | `posthog-react-native` defaults to `defaultOptIn: true`, so the client tracks from the moment it is constructed, and calling `optOut()` afterwards happens too late for events captured in between | Set `defaultOptIn: false` so nothing is captured until `optIn()` is called. Found by reading the installed type definitions, not from a bug report |
| PostHog would have duplicated Sentry's crash reporting | The SDK autocaptures every uncaught JS exception as a `$exception` event by default | Set `errorTracking: { autocapture: false }` and left the product off in the PostHog project as well |

---

## Open Gaps

Tracked deliberately rather than smoothed over:

- **The exact trigger for the data-loss incident above was never proven live.** No device forensics were captured during an actual affected boot, so the timing-window theory is the strongest available explanation, not a confirmed root cause. The already-affected testers' data is unrecoverable.
- **The boot-race fix's seed and foreign-key change is inert until the next content-version bump.** The upsert path hasn't been exercised by a real re-seed yet.
- **No test coverage for `_layout.tsx`'s boot sequence or `useNotifications`'s cold-start navigation.** This became more pressing after the boot-race bug above, since that whole class of bug lives exactly there.

---

## Custom Design System

A bespoke component library (`AppButton`, `AppText`, `AnimatedPressable`) over a UI kit like NativeBase or Tamagui. The design language (dark-primary emerald and gold palette, bilingual RTL-aware typography, centralized spacing, radius, and typography tokens) needed full control over micro-animations and RTL behavior that a general-purpose kit would have fought against.
