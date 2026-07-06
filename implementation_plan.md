# Baraka Project Revitalization: Master Implementation Plan

This document outlines the phased roadmap for upgrading the Baraka app's architecture and expanding its feature set to MVP readiness.

---

## Phase 1: Core Infrastructure Upgrade ✅ [COMPLETED]

### 1.5 - 1.10: Foundations & Standardization

- [x] Zustand store migration & directory restructuring.
- [x] **Reusable UI Library**: `AppButton`, `AppTextInput`, `AppText` standardized.
- [x] **Design System Refinement**: Emerald/Gold palette applied globally.
- [x] **Utility Decoupling**: Centralized logic in `utils/` (id, date, stats, roles).

---

## Phase 2: Role-Based Niyyah Filtering ✅ [COMPLETED]

**Goal**: Contextualize intentions based on the user's life roles.

- [x] **Role Indicators**: Add visual badges/icons to Niyyah options in the Activity detail view.
- [x] **Dynamic Filtering**: Ensure `getNiyyahOptions` properly filters based on the `settingsStore` profile.
- [ ] **Unlock Nudges**: Implement UI hints in settings when certain roles are disabled. Also add UI nudges on the Activity detail screen when there are role-specific intentions that are locked.

---

## Phase 3: Notifications & Reminders ✅ [COMPLETED]

**Goal**: Implement one reliable daily reminder for v1. Per-habit reminders and prayer time auto-detection are explicitly v2.

> **Already done**: `notificationsEnabled` global toggle in `AppSettings` acts as the global mute — no system settings redirect needed.

**V1 Scope — Single Daily Reminder:**

- [x] **Schema Update**: Add `reminderTime: string` (e.g. `"08:00"`) to `AppSettings` type and `settingsStore` defaults.
- [x] **Config Setup**: Add `expo-notifications` plugin to `app.json` (icon, accent color, Android channel config). Re-run `bunx expo prebuild --clean` to link native libraries.
- [x] **Contextual Permission Trigger**: Do NOT ask on launch or settings toggle. Ask when the user enables their first activity on the Reminders screen — at that moment the value is obvious. Show a contextual prompt: _"Want a daily reminder to renew your intentions?"_. If denied, surface a non-blocking nudge in Settings to enable later. Store permission state to avoid re-asking.
- [x] **Time Picker UI**: In Settings (Notifications section), show a time row when `notificationsEnabled` is ON. Tapping opens a native `DateTimePicker` (time mode only). On change, cancel and reschedule.
- [x] **Scheduling Logic**: Schedule a single repeating daily notification at `reminderTime`. Use a fixed notification ID (e.g. `"baraka_daily"`) so it can always be found and cancelled. Copy should be spiritually meaningful and bilingual (EN + AR), respecting the user's current language setting.
- [x] **Lifecycle Handling**: On app foreground (`AppState` listener), verify the scheduled notification still exists and re-schedule if missing. Cancel on `notificationsEnabled` toggled OFF.

**V2 — Do Not Scope Into v1:**

- Per-habit reminder toggle + individual time pickers (requires `UserActivity` schema changes + redesigning the Reminders screen).
- Prayer time auto-detection with location permission + offset UI (e.g. "15 min before Fajr"). Worth building right — use `adhan-js` (pure JS, no native) when the time comes.

---

## Phase 4: Journal UX Refinement ✅ [COMPLETED]

**Goal**: Elevate the journal from simple logging to a robust reflection tool.

- [x] **CRUD Store Support**: Add `deleteJournalEntry` and `updateJournalEntry` (edit) actions to `journalStore.ts`.
- [x] **Delete & Edit**: Implement 3-dot options menu with custom bottom sheet for editing and deleting entries.
- [x] **Search & Filter**: Implemented category chip filtering and search via `useFilteredJournal`.

---

## Phase 5: Settings & Profile Expansion ✅ [COMPLETED]

**Goal**: Personalize the app experience and replace native OS widgets with custom bottom sheets.

> **Decision**: Data export moved to **Post-MVP**. The existing native `Share` sheet is functional for closed testing.

### Proposed Changes

#### [ALREADY DONE] [AppBottomSheet.tsx](./src/components/UI/AppBottomSheet.tsx)

- Reusable Reanimated-driven bottom sheet. ✅

#### [MODIFY] [settings.tsx](<./src/app/(tabs)/settings.tsx>)

- Replace the `Switch` for language with a pressable row that slides up the bottom sheet with "English" / "عربي" radio options.

#### [MODIFY] [en.json](./src/i18n/locales/en.json) & [ar.json](./src/i18n/locales/ar.json)

- Add strings: "Select Language" / "اختر اللغة"

---

## Phase 5b: Niyyah Authenticity Disclaimer 🔴 [CRITICAL — Pre-MVP]

**Goal**: Ensure users understand that Niyyah is formed in the heart, not spoken aloud, to preserve the Islamic authenticity of the app.

> **The text**: _"النية مكانها في القلب وليست منطوقة"_
> **Translation**: \*"Intention resides in the heart — it is not spoken aloud."

### Why This is Critical

The entire premise of the app is to help users renew their intentions. If a user reads Niyyah text in the app and thinks they must _say_ it out loud, it introduces a bid'ah (innovation) and directly contradicts the scholarly consensus. This disclaimer is not optional — it protects the app's authenticity and the user's practice.

### Placement Recommendation

There are **two mandatory placements** and one optional one:

#### 1. 🟥 Primary — Onboarding Slide (Mandatory)

Add a dedicated slide **between the current Slide 2 ("Renew Your Niyyah") and the activity picker**, OR modify Slide 2's body text to include it prominently.

**Why here**: This is the highest-attention moment. The user is being introduced to the concept of Niyyah for the first time. They need to know _before_ they ever see a Niyyah text that it is not meant to be recited.

**Recommended approach**: Add a short, visually distinct callout block at the bottom of Slide 2 (the "Renew Your Niyyah" slide), styled with a gold border and a `قلب` (heart) icon:

```
💛 النية مكانها في القلب وليست منطوقة
   Intention is formed in the heart — not recited aloud.
```

**Files to modify**:

- [`onboardingSlides.ts`](./src/data/onboardingSlides.ts) — add disclaimer field to Slide 2
- [`OnboardingSlide.tsx`](./src/components/onboarding/OnboardingSlide.tsx) — render a styled disclaimer block if the field is present

#### 2. 🟥 Secondary — Activity Detail Screen (Mandatory)

A subtle, persistent subtitle or footnote **on the Niyyah selection/renewal screen** (`src/app/activity/[id].tsx`), rendered just above or below the list of Niyyah options.

**Why here**: This is the moment of use — right before the user taps a Niyyah. The reminder is contextual and reinforces the correct understanding at the precise moment it matters.

**Files to modify**:

- [`activity/[id].tsx`](./src/app/activity/%5Bid%5D.tsx)
- `en.json` / `ar.json` — add i18n keys

#### 3. 🟡 Optional — Settings "About" Section

A one-liner in the existing About card in Settings. Lower priority since it's not in the user's active flow.

### i18n Keys to Add

```json
"niyyahDisclaimer": "Intention is formed in the heart — it is not spoken aloud.",
"niyyahDisclaimerAr": "النية مكانها في القلب وليست منطوقة"
```

---

## Phase 6: Global RTL & Typography Polish ✅ [COMPLETED]

**Goal**: Ensure a perfect experience for Arabic-speaking users.

- [x] **Icon Mirroring**: Audit all directional icons (arrows, chevrons) and implement auto-flipping logic for RTL using `<AppIcon>`.
- [x] **Arabic Typography Polish**: Fine-tune line heights and letter spacing for `Tajawal` inside `<AppText>`.

---

## Phase 8: Onboarding Flow ✅ [COMPLETED]

**Goal**: Introduce the concept of Baraka and Renewing Intentions to new users.

- [x] **Walkthrough**: A 3-4 screen introductory flow explaining the spiritual benefits.
- [x] **Initial Setup**: Guide the user through selecting their first 3 activities.

---

## Phase 9: Premium Feel Polish ✅ [COMPLETED]

**Goal**: Elevate the tactile and visual experience to world-class standards.

- [x] **Haptics Centralization**: Centralize and standardize all haptics across the app.
- [x] **Modals for Better UX**: Replaced swipe/alerts with custom bottom sheets for options, edit, and delete actions.
- [x] **Loading States**: Replace spinners with Skeleton loaders and implement smooth Splash Screen transitions.

---

## Phase 7: Sentry Observability ✅ [COMPLETED]

**Goal**: Move from "blind in production" to having complete visibility into crashes, errors, and app health without burning the free quota.

### Phase 7a — Core Crash Reporting ✅ [COMPLETED]

- [x] Install `@sentry/react-native` and add `@sentry/react-native/expo` plugin to `app.json`.
- [x] Initialize Sentry in `src/app/_layout.tsx` with `Sentry.init({ dsn, enableLogs: true, spotlight: __DEV__ })` and wrap the root export with `Sentry.wrap(App)`.
- [x] Update `src/utils/errorLogger.ts` to call `Sentry.captureException()` in non-DEV builds, forwarding `componentStack` as extra context.
- [x] The existing `ErrorBoundary` automatically routes all React tree crashes to Sentry via `logError`.
- [x] Update `metro.config.js` to use `getSentryExpoConfig` for source map support.

### Phase 7b — Contextual Enrichment ✅ [COMPLETED]

**Strategy**: Zero-cost metadata enrichment — breadcrumbs, tags, and context consume **no quota** until an actual error event is sent.

---

#### Goal 1: User Identification — `Sentry.setUser()`

**[NEW] `src/utils/device.ts`**

- [x] Generate a UUID once and persist it to MMKV as an anonymous, non-PII user identifier:

**[MODIFY] `src/app/_layout.tsx`**

- [x] After store hydration completes, identify the user to Sentry:

---

#### Goal 2: Tags — `Sentry.setTag()`

**[MODIFY] `src/app/_layout.tsx`** (in hydration `useEffect`)

- [x] Tag language and platform

---

#### Goal 3: Context — `Sentry.setContext()`

**[MODIFY] `src/app/_layout.tsx`** (in hydration `useEffect`)

- [x] Add `app_config` context

---

#### Goal 4: Breadcrumbs — `Sentry.addBreadcrumb()`

**[MODIFY] `src/app/(tabs)/_layout.tsx`** (tab navigator, on tab press)

- [x] Add tab navigation breadcrumbs
      **[MODIFY] Key store actions** (e.g., `journalStore.ts`, `logsStore.ts`)
- [x] Add breadcrumbs to critical store actions

---

#### Goal 5: Async Error Capture — `Sentry.captureException()`

**[MODIFY] Critical async handlers** (journal save, notification scheduling, file export)

- [x] Wrap critical logic in try/catch and report errors via `Sentry.captureException`

---

#### Goal 6: Store Hydration Warning — `Sentry.captureMessage()`

**[MODIFY] `src/store/settingsStore.ts`** (inside hydration safety timeout)

- [x] Capture hydration safety timeout warnings

---

### Quota Budget Summary

| Feature                              | Consumption         | Status      |
| ------------------------------------ | ------------------- | ----------- |
| `captureException` (crashes)         | 1 event/crash       | ✅ Active   |
| `captureMessage` (hydration warning) | Rare                | ✅ Active   |
| `addBreadcrumb`                      | **Free** (no quota) | ✅ Active   |
| `setUser / setTag / setContext`      | **Free** (no quota) | ✅ Active   |
| Performance tracing                  | 10k spans/month     | 🔒 Hold     |

---

## Phase 10: Local Release Builds & Distribution ✅ [COMPLETED]
**Goal**: Package the app into an installable APK for internal testing.
- [x] **Sentry Local Build Bypassing**: Enabled `SENTRY_DISABLE_AUTO_UPLOAD=true` to skip sourcemap uploads during local builds, bypassing Sentry credentials requirements.
- [x] **Watchman Conflict Resolution**: Terminated hung `watchman.exe` processes on Windows to let the Metro bundler fall back to the reliable Node file crawler.
- [x] **Release APK Compilation**: Successfully compiled the release APK using Gradle assembly (`.\android\gradlew.bat -p android assembleRelease`). The output is located at [android/app/build/outputs/apk/release/app-release.apk](file:///d:/Projects/Baraka/android/app/build/outputs/apk/release/app-release.apk).

---

## Verification Plan

### Manual Verification

- Perform a full "Day in the Life" test: Onboarding -> Selecting Activity -> Renewing Niyyah -> Journaling -> Checking Settings.
- Verify Light/Dark mode transitions on all screens.
- Test RTL language toggle and ensure layout stability.

### Automated Testing

- `npm run typecheck` to ensure no regression in TypeScript interfaces.

### TODO: Before Store MVP (High Priority)

- [x] **Migrate from AsyncStorage to MMKV**: Switch Zustand persist middleware to MMKV (via `react-native-mmkv`). Also switch i18n detection from AsyncStorage to MMKV. No legacy data migration code is needed since there is no existing user base.
- [x] **Store Hydration Fallback**: Implement a safety timeout/catch block in the settings/store hydration process. If rehydration takes longer than 2.5 seconds or crashes, force `isLoading: false` to prevent the splash screen from hanging indefinitely.
- [x] **Integrate Sentry (Phase 1)**: Core crash reporting integrated — `ErrorBoundary` → `captureException`, `Sentry.wrap(App)`, and Metro source maps configured.
- [x] **Integrate Sentry (Phase 2)**: Contextual enrichment — user tagging, language tags, hydration warning, and navigation breadcrumbs (see Phase 7b above).
- [x] **Niyyah Authenticity Disclaimer**: Add "النية مكانها في القلب وليست منطوقة" to the Onboarding "Renew Your Niyyah" slide AND on the Activity Niyyah selection screen. See Phase 5b for full spec.
- [ ] **Verify All App Data**: Audit hadiths, sources, and translations for absolute accuracy.

---

## Post-MVP Polish (After Main Phases)

- [ ] **Bottom Sheet Journal UX**: Replace the inline journal Add/Edit form with `@gorhom/bottom-sheet`. It runs on the UI thread via Reanimated, supports gesture-based dismissal, and integrates cleanly with the existing animation and haptics stack. Apply the same treatment to any future action confirmations that would otherwise use system `Alert.alert`.
- [ ] **Additional Export Formats**: Add support for **CSV** and **PDF** exports.
- [ ] **Android Widgets**: Home screen widgets for daily niyyah.
- [ ] **Activity-specific reminders**: Custom push notifications per activity.
- [ ] **Weekly Insights Dashboard**: Create a dashboard view showing intention trends over the last 7 days.
- [ ] **Dynamic Ajr Multiplier**: Refine the "Ajr Multiplier" calculation based on intention depth and consistency.
- [ ] **Report wrong/weak hadith**: In-app feedback mechanism.
