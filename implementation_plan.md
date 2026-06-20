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
- [x] **Contextual Permission Trigger**: Do NOT ask on launch or settings toggle. Ask when the user enables their first activity on the Reminders screen — at that moment the value is obvious. Show a contextual prompt: *"Want a daily reminder to renew your intentions?"*. If denied, surface a non-blocking nudge in Settings to enable later. Store permission state to avoid re-asking.
- [x] **Time Picker UI**: In Settings (Notifications section), show a time row when `notificationsEnabled` is ON. Tapping opens a native `DateTimePicker` (time mode only). On change, cancel and reschedule.
- [x] **Scheduling Logic**: Schedule a single repeating daily notification at `reminderTime`. Use a fixed notification ID (e.g. `"baraka_daily"`) so it can always be found and cancelled. Copy should be spiritually meaningful and bilingual (EN + AR), respecting the user's current language setting.
- [x] **Lifecycle Handling**: On app foreground (`AppState` listener), verify the scheduled notification still exists and re-schedule if missing. Cancel on `notificationsEnabled` toggled OFF.

**V2 — Do Not Scope Into v1:**
- Per-habit reminder toggle + individual time pickers (requires `UserActivity` schema changes + redesigning the Reminders screen).
- Prayer time auto-detection with location permission + offset UI (e.g. "15 min before Fajr"). Worth building right — use `adhan-js` (pure JS, no native) when the time comes.

---

## Phase 4: Journal UX Refinement 🚧
**Goal**: Elevate the journal from simple logging to a robust reflection tool.
- [ ] **CRUD Store Support**: Add `deleteJournalEntry` and `updateJournalEntry` (edit) actions to `journalStore.ts`.
- [ ] **Delete & Edit**: Implement swipe-to-delete (via Swipeable) and a dedicated edit mode for entries.
- [ ] **Search & Filter**: Enhance the search bar with keyword highlighting and multi-tag filtering.

---

## Phase 5: Settings & Profile Expansion 🚧
**Goal**: Personalize the app experience, replace native OS widgets with custom premium bottom sheets, and secure user data.

### Technical Approach & Deliverables
1. **Dependencies**: Install `expo-file-system` and `expo-sharing` via `npx expo install` to handle local file storage and native sharing sheets.
2. **Custom Bottom Sheet (`AppBottomSheet.tsx`)**:
   - Wrap standard React Native `Modal` to render on top of tab bars.
   - Use `react-native-reanimated` for smooth entrance (spring translation upwards, opacity fade-in of backdrop) and exit animations (triggered programmatically, calling `onClose` only after animations complete).
   - Follow Haptic guidelines: trigger light tap on option select.
3. **Language Selection Dropdown**:
   - Replace the Settings `Switch` for language with a pressable row displaying the current language.
   - On tap, slide up the bottom sheet with language options ("English" / "عربي") and clean, custom radio checkmarks.
4. **Data Export Modal**:
   - Replace the native `Share` alert with a bottom sheet offering two export formats:
     - **JSON Format**: Direct backup dump of settings, activities, daily logs, and journal entries.
     - **Excel Spreadsheet (.xlsx)**: Generated via SheetJS (`xlsx`). We will structure it as a clean multi-sheet workbook (Profile/Stats, Activities, Daily History, Journal Entries).
   - Use `expo-file-system` to write the generated file to a temporary document path, and trigger `expo-sharing` to open the native share sheet.

### Proposed Changes

#### [NEW] [AppBottomSheet.tsx](file:///d:/Projects/Baraka/src/components/UI/AppBottomSheet.tsx)
- Reusable Reanimated-driven bottom sheet containing a title, action list, and backdrop overlay.

#### [NEW] [exportManager.ts](file:///d:/Projects/Baraka/src/services/exportManager.ts)
- Service managing serialization, Excel sheet creation, writing to cache directory, and launching share dialogs.

#### [MODIFY] [settings.tsx](file:///d:/Projects/Baraka/src/app/(tabs)/settings.tsx)
- Integrate the custom bottom sheet for language switching (moving away from the Switch widget).
- Integrate the custom bottom sheet for data export selection (JSON vs Excel).
- Connect the selected format to `exportManager.ts`.

#### [MODIFY] [en.json](file:///d:/Projects/Baraka/src/i18n/locales/en.json) & [ar.json](file:///d:/Projects/Baraka/src/i18n/locales/ar.json)
- Add text strings for:
  - "Select Language" / "اختر اللغة"
  - "Select Export Format" / "اختر صيغة التصدير"
  - "JSON Backup" / "نسخة JSON الاحتياطية"
  - "JSON Backup Desc" / "بيانات التطبيق الخام، مناسبة للاستيراد والاسترجاع."
  - "Excel Document" / "مستند إكسل"
  - "Excel Document Desc" / "ملف جدول بيانات منظم، مناسب للقراءة والتحليل."

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

## Phase 9: Premium Feel Polish 🚧
**Goal**: Elevate the tactile and visual experience to world-class standards.
- [x] **Haptics Centralization**: Centralize and standardize all haptics across the app.
- [ ] **Modals for Better UX**: Replace standard system alerts with bottom sheets.
- [x] **Loading States**: Replace spinners with Skeleton loaders and implement smooth Splash Screen transitions.

---

## Phase 7: Sentry Observability 🚧

**Goal**: Move from "blind in production" to having complete visibility into crashes, errors, and app health without burning the free quota.

### Phase 7a — Core Crash Reporting ✅ [COMPLETED]
- [x] Install `@sentry/react-native` and add `@sentry/react-native/expo` plugin to `app.json`.
- [x] Initialize Sentry in `src/app/_layout.tsx` with `Sentry.init({ dsn, enableLogs: true, spotlight: __DEV__ })` and wrap the root export with `Sentry.wrap(App)`.
- [x] Update `src/utils/errorLogger.ts` to call `Sentry.captureException()` in non-DEV builds, forwarding `componentStack` as extra context.
- [x] The existing `ErrorBoundary` automatically routes all React tree crashes to Sentry via `logError`.
- [x] Update `metro.config.js` to use `getSentryExpoConfig` for source map support.

### Phase 7b — Contextual Enrichment 🔲 [NEXT]
**Strategy**: Zero-cost metadata enrichment using breadcrumbs and tags — these consume **no quota** until an error event is actually sent.

#### Files to modify:

**[MODIFY] `src/app/_layout.tsx`**
- After store hydration completes (in the `i18nReady` / `isLoading` useEffect block), call:
  ```ts
  Sentry.setUser({ id: anonymousDeviceId }); // a UUID stored in MMKV/AsyncStorage
  ```
- This lets you correlate how many distinct users are hitting a bug.

**[MODIFY] `src/hooks/useNotifications.ts` (or the hydration useEffect in `_layout.tsx`)**
- After the store is hydrated and i18n is initialized, tag the language:
  ```ts
  Sentry.setTag('language', i18n.language); // 'en' or 'ar'
  Sentry.setContext('app_config', {
    onboardingComplete: settings.onboardingComplete,
    notificationsEnabled: settings.notificationsEnabled,
  });
  ```

**[MODIFY] `src/store/settingsStore.ts`**
- Inside the hydration safety timeout (the 2.5s fallback block), add:
  ```ts
  Sentry.captureMessage('Store hydration safety timeout fired', 'warning');
  ```
- This gives you a production warning if the store ever hangs without a full crash.

**[MODIFY] `src/app/(tabs)/_layout.tsx` (tab navigator)**
- Add a breadcrumb on each tab press so that if a crash happens, Sentry shows which screen the user was on:
  ```ts
  Sentry.addBreadcrumb({ category: 'navigation', message: 'Navigated to Journal', level: 'info' });
  ```

### Phase 7c — Performance Tracing 🔒 [HOLD — Post-MVP]
- Enable `tracesSampleRate: 0.05` (5%) and `navigationIntegration` only after launch when you have a specific slowness to investigate.
- The current commented-out tracing code in `_layout.tsx` is intentional — reactivate only when needed.

### Quota Budget Summary

| Feature | Consumption | Status |
|---|---|---|
| `captureException` (crashes) | 1 event/crash | ✅ Active |
| `captureMessage` (hydration warning) | Rare | 🔲 Phase 7b |
| `addBreadcrumb` | **Free** (no quota) | 🔲 Phase 7b |
| `setUser / setTag / setContext` | **Free** (no quota) | 🔲 Phase 7b |
| Performance tracing | 10k spans/month | 🔒 Hold |

---

## Verification Plan

### Manual Verification
- Perform a full "Day in the Life" test: Onboarding -> Selecting Activity -> Renewing Niyyah -> Journaling -> Checking Settings.
- Verify Light/Dark mode transitions on all screens.
- Test RTL language toggle and ensure layout stability.

### Automated Testing
- `npm run typecheck` to ensure no regression in TypeScript interfaces.

### TODO: Before Store MVP (High Priority)
- [ ] **Migrate from AsyncStorage to MMKV**: Switch Zustand persist middleware to MMKV (via `react-native-mmkv`). Also switch i18n detection from AsyncStorage to MMKV. No legacy data migration code is needed since there is no existing user base.
- [x] **Store Hydration Fallback**: Implement a safety timeout/catch block in the settings/store hydration process. If rehydration takes longer than 2.5 seconds or crashes, force `isLoading: false` to prevent the splash screen from hanging indefinitely.
- [x] **Integrate Sentry (Phase 1)**: Core crash reporting integrated — `ErrorBoundary` → `captureException`, `Sentry.wrap(App)`, and Metro source maps configured.
- [ ] **Integrate Sentry (Phase 2)**: Contextual enrichment — user tagging, language tags, hydration warning, and navigation breadcrumbs (see Phase 7b above).
- [ ] **Verify All App Data**: Audit hadiths, sources, and translations for absolute accuracy.
- [ ] **Report wrong/weak hadith**: In-app feedback mechanism.

---

## Post-MVP Polish (After Main Phases)
- [ ] **Bottom Sheet Journal UX**: Replace the inline journal Add/Edit form with `@gorhom/bottom-sheet`. It runs on the UI thread via Reanimated, supports gesture-based dismissal, and integrates cleanly with the existing animation and haptics stack. Apply the same treatment to any future action confirmations that would otherwise use system `Alert.alert`.
- [ ] **Additional Export Formats**: Add support for **CSV** and **PDF** exports.
- [ ] **Android Widgets**: Home screen widgets for daily niyyah.
- [ ] **Activity-specific reminders**: Custom push notifications per activity.
- [ ] **Weekly Insights Dashboard**: Create a dashboard view showing intention trends over the last 7 days.
- [ ] **Dynamic Ajr Multiplier**: Refine the "Ajr Multiplier" calculation based on intention depth and consistency.