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
- [~~ ] ~~**Unlock Nudges**: Implement UI hints in settings when certain roles are disabled. Also add UI nudges on the Activity detail screen when there are role-specific intentions that are locked.~~ (Cancelled to keep UI clean and calm)

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

## Phase 5b: Niyyah Authenticity Disclaimer ✅ [COMPLETED]

**Goal**: Ensure users understand that Niyyah is formed in the heart, not spoken aloud, to preserve the Islamic authenticity of the app.

> **The text**: _"النية مكانها في القلب وليست منطوقة"_
> **Translation**: \*"Intention resides in the heart — it is not spoken aloud."

### Why This is Critical

The entire premise of the app is to help users renew their intentions. If a user reads Niyyah text in the app and thinks they must _say_ it out loud, it introduces a bid'ah (innovation) and directly contradicts the scholarly consensus. This disclaimer is not optional — it protects the app's authenticity and the user's practice.

### Implementation

There are **two mandatory placements** that have been successfully integrated:

- [x] **1. Primary — Onboarding Slide**
      Added directly into the body text of Slide 2 ("Renew Your Niyyah") in [`onboardingSlides.ts`](./src/data/onboardingSlides.ts). This ensures users learn this concept immediately during their first experience with the app, reinforced by a quote from Ibn Taymiyyah.

- [x] **2. Secondary — Activity Detail Screen**
      Added as a subtle, persistent subtitle translated via `i18n` on the Niyyah selection screen (`src/app/activity/[id].tsx`). This serves as a contextual reminder right at the moment of use.

### i18n Keys Added

```json
"activity.niyyahDisclaimer": "Read it with your eyes, and feel it with your heart. The intention resides in the heart, not the tongue."
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

| Feature                              | Consumption         | Status    |
| ------------------------------------ | ------------------- | --------- |
| `captureException` (crashes)         | 1 event/crash       | ✅ Active |
| `captureMessage` (hydration warning) | Rare                | ✅ Active |
| `addBreadcrumb`                      | **Free** (no quota) | ✅ Active |
| `setUser / setTag / setContext`      | **Free** (no quota) | ✅ Active |
| Performance tracing                  | 10k spans/month     | 🔒 Hold   |

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

## Phase 11: Personalizing Activities & Niyyah Templates (First-Person Perspective) ⏳ [IN PLANNING]

**Goal**: Transform all default activity descriptions and niyyah templates from imperative commands ("Say Bismillah...", "Work honestly today...") to a personal first-person perspective ("I say Bismillah...", "I work honestly today..."). This reinforces Niyyah as a personal, internal act of the heart.

### User Review Required

We need the user to review the proposed wording shifts to ensure they meet the desired spiritual tone and style. Here are some examples:

| Activity | Old (Command / Advisory) | Proposed New (First-Person) |
| --- | --- | --- |
| **Fajr Prayer (EN)** | "Pray Fajr now. It's one of the two prayers hardest on hypocrites, so its reward is the greatest." | "I pray Fajr now, seeking to make it the prayer that protects me from hypocrisy and brings me the greatest reward." |
| **Fajr Prayer (AR)** | "صلِّ الفجر الآن. من أثقل صلاتين على القلب المنافقين، فأجرها الأعظم." | "أصلي الفجر الآن، مستحضراً أجرها العظيم وحفظ الله لي ووقايتي من النفاق." |
| **Breakfast (EN)** | "Say Bismillah and eat with your right hand. This is exactly what the Prophet ﷺ taught." | "I say Bismillah and eat with my right hand, following the exact guidance of the Prophet ﷺ." |
| **Breakfast (AR)** | "قل بسم الله وكل بيمينك. هذا ما علّمه النبي ﷺ بالضبط." | "أقول بسم الله وآكل بيميني، متبعاً لهدي النبي ﷺ." |
| **Work (EN)** | "Work honestly today. No food is better than what you earn with your own hands." | "I work honestly today, knowing that no food is better than what I earn with my own hands." |
| **Work (AR)** | "اعمل بأمانة اليوم. لا طعام خيرٌ مما تكسبه يداك." | "أعمل بأمانة اليوم، موقناً أنه ما أكل أحد طعاماً خيراً من أن يأكل من عمل يده." |

### Open Questions

> [!IMPORTANT]
> 1. Should we also keep the hadith references/educational notes in the first person? (We recommend keeping Hadith explanations informative/factual, while rewriting only the niyyah intentions themselves.)
> 2. Are there specific phrasing guidelines the user wants to enforce for the Arabic translations (e.g., using "أنوي..." vs "أفعل..." directly)?

### Proposed Changes

#### [MODIFY] [activities.ts](file:///d:/Projects/Baraka/src/data/activities.ts)
- Update `niyyahText` for all 17 default activities to the first person in both English and Arabic.

#### [MODIFY] [niyyahTemplates.ts](file:///d:/Projects/Baraka/src/data/niyyahTemplates.ts)
- Update the `text` property of all 70+ default templates and sub-options to the first person in both English and Arabic.

---

## Verification Plan

### Automated Tests
- Run `npm run typecheck` to confirm TypeScript safety.
- Run `npm run lint` if configured.

### Manual Verification
- Build and run the app to check readability in the Activity detail screen.
- Verify that selected intentions display beautifully in the journal entry drafts and completed logs.

---

## Phase 12: Linting, Formatting & Pre-commit Enforcement (Post-MVP) ⏳ [PLANNED]

**Goal**: Catch formatting drift, cross-platform line-ending noise, and basic code errors before they reach a commit — this session surfaced both problems firsthand (84 files flagged as changed across a sandbox checkout, of which only 35 were real edits; three files also picked up trailing null-byte corruption that a pre-commit file check would have caught).

### Scope

- **ESLint**: adopt `eslint-config-expo` as the base preset for this Expo/RN project; catches unused vars, invalid hooks usage, unsafe `any`, and JSX accessibility issues.
- **Prettier**: formatting only (quotes, indentation, line length); configure `endOfLine: "lf"` explicitly to prevent the CRLF/LF drift seen in this repo across Windows/sandbox environments. Use `eslint-config-prettier` so ESLint and Prettier rules don't conflict.
- **Husky + lint-staged**: run ESLint and Prettier only against staged files at commit time via a Husky pre-commit hook, so an invalid or unformatted file cannot be committed in the first place.

### Rollout Plan

1. Run Prettier once across the entire existing codebase as a single dedicated formatting commit, so the one-time reformatting noise doesn't pollute future diffs or get mixed into feature commits.
2. Add ESLint config and fix or explicitly suppress any existing violations.
3. Add Husky + lint-staged, enforcing lint/format checks on new commits only (not a blocking retroactive fix of the whole repo).

### Resources

- Expo's ESLint setup guide: docs.expo.dev (search "ESLint")
- Prettier install/options docs: prettier.io/docs/install (pay attention to `endOfLine`, given this repo's mixed-environment history)
- Husky "Get started" guide: typicode.github.io/husky (use the current `npx husky init` flow, not older `husky add` tutorials)
- lint-staged README (GitHub): config format for mapping file globs to lint/format commands

---

## Phase 13: Retire the "Reminders" Tab → "Manage Activities" Under Settings ✅ [COMPLETED]

**Goal**: Fix a naming/icon mismatch (bottom-tab label "Reminders" + bell icon, but the screen is actually an activity on/off toggle list) and reduce the tab bar from 5 to 4 tabs, while keeping the feature just as discoverable via a shortcut from Home. App is in closed testing, so this navigation change is acceptable now.

> **Executor note**: this phase is written to be unambiguous for a model with no prior context on this codebase. Follow file paths and instructions literally. Do not invent additional UI, copy, or behavior beyond what's specified. If something described here doesn't match what you find in the file, stop and flag the discrepancy rather than guessing.

### Non-negotiable constraints (apply to every step below)

1. **No raw style literals.** Use `spacing.*` / `radius.*` from `src/constants/spacing.ts` / `src/constants/radius.ts` for all padding/margin/gap/borderRadius. Use `AppText` with a `variant` prop (never a raw `fontSize`) for all text. Reference `src/constants/typography.ts` for available variants.
2. **No raw `Pressable`/`TouchableOpacity`.** Use the existing `AnimatedPressable` component (`src/components/UI/AnimatedPressable.tsx`) for every new tappable element.
3. **Bilingual everywhere.** Every new user-facing string needs both an `en` and matching `ar` entry in `src/i18n/locales/en.json` and `src/i18n/locales/ar.json`. Do not leave an English-only string anywhere.
4. **No em dashes** in any UI copy (English or Arabic), per project writing convention.
5. **Don't touch niyyah/hadith content.** This phase is purely navigational/structural. Do not modify `src/data/activities.ts`, `src/data/niyyahTemplates.ts`, or any hadith-referencing text.
6. **Before deleting or renaming any existing file, show the diff and wait for explicit confirmation** — do not delete `src/app/(tabs)/reminders.tsx` or any i18n keys silently.
7. **Follow the codebase's existing top-level-route convention** for non-tab screens: `src/app/activity/[id].tsx` and `src/app/learn/[id].tsx` already exist as routes outside the `(tabs)` group, reachable via `router.push(...)` from anywhere regardless of which tab is active. The new "Manage Activities" screen must follow this same convention — do **not** nest it inside `src/app/(tabs)/settings.tsx` or restructure `settings.tsx` into a folder.

### Proposed Changes

#### [x] Step 1 — Remove the tab
- **File**: `src/app/(tabs)/_layout.tsx`
- Deleted the entire `<Tabs.Screen name="reminders" ... />` block (lines 68–79). Leave the other four `Tabs.Screen` entries (`index`, `learn`, `journal`, `settings`) untouched and in their existing order.

#### [x] Step 2 — Create the new top-level route
- **New file**: `src/app/manage-activities.tsx`
- Moved the existing logic from `src/app/(tabs)/reminders.tsx` here almost as-is (same `categoryGroups` memo, `handleToggle`, `AddActivityForm`, `CategorySection` usage). Add a header back button with a "chevron-left" Feather icon at the top of the `ScrollView`, calling `router.back()`. Header title changes from `t("reminders.title")` to `t("manageActivities.title")`. Deleted `src/app/(tabs)/reminders.tsx` after confirmation.

#### [x] Step 3 — Rename component folder and files
- Renamed `src/components/Reminders/` to `src/components/Activities/`.
- `CategorySection.tsx`: made each category section collapsible/expandable using Reanimated's layout transitions (`layout={LinearTransition}`) and fade animations (`entering={FadeIn}`, `exiting={FadeOut}`). Shows a live count next to the category label, e.g. `"Worship · 2/4"`, computed from `categoryActivities.filter(a => a.enabled).length` vs `categoryActivities.length`. Added rotation transition to the chevron indicator using `useDerivedValue` and `useAnimatedStyle`.
- `AddActivityForm.tsx`: updated import path references.
- Updated the two import sites (`src/app/manage-activities.tsx`) to import from `@components/Activities/CategorySection` and `@components/Activities/AddActivityForm`.

#### [x] Step 4 — Rename i18n keys
- In both `src/i18n/locales/en.json` and `src/i18n/locales/ar.json`, renamed every `reminders.*` key to `manageActivities.*`.
- Removed `"tabs.reminders"` entirely from both files.
- Added two new keys: `settings.manageActivities` and `dashboard.manageActivitiesButton`.
- Updated every `t("reminders.*")` call site to `t("manageActivities.*")`.

#### [x] Step 5 — Add entry point in Settings
- **File**: `src/components/Settings/PreferencesSection.tsx`
- Added one new row using the existing row pattern. Label: `t("settings.manageActivities")`. Icon: Feather `"list"`. `onPress`: `router.push("/manage-activities")`.

#### [x] Step 6 — Add entry point on Home
- **File**: `src/app/(tabs)/index.tsx`
- Located the "Activities Section Header" block and added a new `AnimatedPressable` icon button (Feather `"sliders"`, `accessibilityLabel={t("dashboard.manageActivitiesButton")}`) positioned after the count badge in the same row. `onPress`: `router.push("/manage-activities")`.

### Verification Plan

- [x] Run `npm run typecheck` — confirm no broken imports after the `Reminders/` → `Activities/` rename.
- [x] Confirm the tab bar shows exactly 4 tabs (Today, Learn, Journal, Settings) with no gap or layout shift where "Reminders" used to be.
- [x] Manually verify: tapping the new icon on Home's "Your Intentions" header navigates to Manage Activities; tapping the new row in Settings does the same; the back button on Manage Activities returns correctly.
- [x] Confirm every string on the Manage Activities screen renders correctly in both English and Arabic (RTL layout, no leftover `reminders.*` key showing as a raw key string, which would indicate a missed rename).
- [x] Confirm collapsible category sections expand/collapse correctly and the "X/Y" count per category updates immediately when a switch is toggled.

---

## Phase 14: Competitive Category Breadth Expansion (Post-MVP) ⏳ [PLANNED]

**Goal**: Close the content-breadth gap identified against competitor sites Nawaya (nawaya.life) and Neyat (neyat.vercel.app), both Arabic-only static niyyah libraries with no app, no personalization, and no daily-habit loop. Their only real edge is category/option breadth (Nawaya) and inline hadith-phrase highlighting (Neyat's UI). Baraka's core differentiators (daily renewal loop, journal, streaks, personalization, bilingual offline app) are not at risk and are out of scope here — this phase only closes the content gap.

> **Executor note**: this is content-research-heavy, not code-heavy. Do not rush hadith sourcing to hit a time estimate — every new niyyah must independently satisfy the non-negotiable theological constraints below before it ships.

### Non-negotiable constraints (apply to every step below)

1. **No weak or fabricated hadith, ever.** Every new niyyah must trace to a canonical source (Bukhari, Muslim, Tirmidhi, Abu Dawud, Ibn Majah, Nasai) with a specific number, verified against sunnah.com. If a strong, direct hadith cannot be found for a proposed category or option, drop that specific option — do not lower the sourcing bar to hit a target count.
2. **First-person voice**, matching the Phase 11 convention already established in `activities.ts` / `niyyahTemplates.ts` — direct first-person verb + reason clause, not an "I intend to..." wrapper (except where the niyyah is literally about setting travel/journey intention).
3. **Bilingual (EN/AR) required** for every new activity and niyyah option — no Arabic-only or English-only entries, unlike the competitor sites.
4. **No em dashes** in any new copy.
5. **Niyyah is heart-based, not spoken** — do not introduce any UI or copy implying niyyah must be verbalized.
6. **New activities follow the existing data-only architecture** — adding an activity is a `src/data/activities.ts` + `src/data/niyyahTemplates.ts` entry, matching the shape of existing entries exactly (see `Activity` and `NiyyahOption` types in `src/types/index.ts`). No new screens, navigation, or components are needed for new categories — the existing Activity/Niyyah selection UI already handles arbitrary activities.

### Step 1 — Prioritize and research new categories

Candidate categories identified as present on Nawaya but missing from Baraka's 17 activities: wudu (ablution), dhikr/dua (remembrance, separate from existing prayer-linked niyyah), hajj/umrah, marriage, clothing/dressing, patience during trials (ابتلاء/مصائب). For each candidate:
- Confirm it's meaningfully distinct from existing activities (e.g. don't duplicate `siwak` or prayer-linked niyyah already covering wudu-adjacent acts).
- Research 3–5 candidate hadith per category via sunnah.com, following the exact verification approach used earlier this session for Commute/Sleep (search primary source, confirm exact Arabic wording, do not paraphrase the hadith itself).
- Flag any category where a strong hadith can't be found within a reasonable search — skip it rather than force a weak source.

### Step 2 — Draft niyyah text (EN + AR) per new category

For each verified hadith, write one niyyah entry following the exact pattern used in `activities.ts`/`niyyahTemplates.ts`: first-person action verb + "knowing/mindful that / following what" reason clause in English; "موقناً أن / اتباعاً لما / طالباً" equivalent in Arabic. Aim for 3–5 niyyah options per new category to match competitive depth (Nawaya shows ~10 per category, but quality/verification bar takes priority over matching that count exactly).

### Step 3 — Add data entries

Add each new category as a new `Activity` entry in `src/data/activities.ts` (with a verified primary hadith in `hadithRef`) and its niyyah options as `NiyyahOption` entries in `src/data/niyyahTemplates.ts`, matching existing field shapes exactly. Add corresponding category icon/label if a new `category` grouping is introduced (see `CATEGORY_ICONS` in `src/components/Activities/CategorySection.tsx` — add new Feather icon mappings and `reminders.category.*`/`manageActivities.category.*` i18n keys as needed per Phase 13's key naming, EN + AR).

### Step 4 — Cheap UI polish borrowed from Neyat (independent of Steps 1–3, can be done first or in parallel)

**File**: `src/components/NiyyahCard.tsx` (and any other component rendering `hadithRef`/hadith quote text)
Neyat visually bolds the specific actionable phrase within a longer hadith quote, improving scannability. Add a lightweight bold/highlight treatment to the most relevant clause within existing hadith quotes displayed in the app — implement via marking the key phrase in the source data (e.g. a `highlightPhrase` optional field) and rendering it with `weight="Bold"` inline within the existing `AppText` hadith quote, rather than introducing new dependencies or a markup parser. Keep this scoped to a small pilot set of existing niyyah entries first (e.g. the Fajr, Sleep, Commute activities already verified this session) before deciding whether to roll out further.

### Step 5 — Do not adopt Neyat's multi-source citation model in this phase

Explicitly out of scope: adding Quran ayat / athar / scholar-quote layers alongside each hadith (Neyat's deeper differentiator). This requires a data model change and a much larger content research effort (est. 40–60+ hours) with uncertain payoff relative to Baraka's actual differentiation. Revisit as a separate future phase only if category-breadth expansion proves insufficient competitively.

### Verification Plan

- Confirm every new hadith reference resolves correctly on sunnah.com with the exact number cited.
- Run `npm run typecheck` after data additions — confirm no type errors in `activities.ts`/`niyyahTemplates.ts`.
- Manually verify new activities appear correctly in Manage Activities (Phase 13) toggle list, in both languages, with correct category grouping/icon.
- Manually verify the bolded hadith-phrase pilot renders correctly in both English and Arabic, including RTL, without breaking existing `NiyyahCard` layout/line-height.

### Estimated Effort

- Step 1–3 (category breadth, ~6 candidate categories): roughly 15–25 hours of research + data entry, spread over multiple sessions — not a single sprint.
- Step 4 (bolded-phrase UI polish, pilot scope): roughly 1–2 hours.
- Step 5 (multi-source citations): explicitly deferred, not estimated here.

---

## Phase 15: Multi-Source Niyyah Evidencing (Post-MVP, Deferred from Phase 14) ⏳ [PLANNED]

**Goal**: Close Neyat's (neyat.vercel.app) deeper differentiator — each of their niyyah entries is backed by multiple layered sources (Quran ayah, hadith, athar/salaf sayings, and scholar commentary), not just a single hadith reference like Baraka currently shows. This phase was explicitly deferred out of Phase 14 due to cost; only start it once Phase 14's cheaper category-breadth work is done and you've confirmed this depth is worth the investment (e.g. via user feedback, review comparisons, or a deliberate product decision to position Baraka as the more scholarly-rigorous option).

> **Executor note**: this phase is the most research-intensive in the roadmap. Do not attempt to batch-add secondary sources to all 70+ existing niyyah templates at once — do it incrementally, activity by activity, and only add a secondary source where one is genuinely authentic and relevant. It is fully acceptable, and expected, for many niyyah entries to remain hadith-only if no legitimate Quran/athar/scholar source exists for that specific point.

### Non-negotiable constraints (apply to every step below)

1. **Same sourcing rigor as hadith**: any added Quran ayah, athar (companion/salaf saying), or scholar quote must be independently verifiable — cite the exact surah:ayah for Quran, and the specific book/collection for athar and scholar quotes (e.g. "عمدة القاري للعيني", "كتاب الحث على التجارة للخلال" — matching the sourcing precision seen on Neyat).
2. **Never invent or paraphrase a primary quote.** Quran ayat, hadith, athar, and scholar quotes must all be quoted verbatim in Arabic. Only the app's own surrounding explanatory text (if any) may paraphrase.
3. **Distinguish source types clearly in the data model and UI** — a user must be able to tell at a glance whether they're reading Quran, hadith, athar, or a scholar's commentary; these carry different authoritative weight and must never be visually conflated.
4. **Bilingual requirement still applies** to any new surrounding UI labels/copy (e.g. "Qur'an" / "القرآن الكريم", "Companion saying" / "أثر", "Scholar's commentary" / "قول عالم") — the primary Arabic source text itself is not translated/rewritten, only labeled.
5. **No em dashes** in any new copy.
6. **This phase does not touch the core niyyah text itself** (the first-person action + reason clause established in Phase 11) — it only adds supporting evidence layers underneath the existing niyyah, structurally additive, not a rewrite.

### Step 1 — Extend the data model

**File**: `src/types/index.ts`
Extend `NiyyahOption` (and/or `Activity`, wherever `hadithRef` currently lives) with an optional `sources` array, additive alongside the existing single `hadithRef` field (do not remove `hadithRef` — keep it as the guaranteed-present primary source for backward compatibility with all existing entries):
```
sources?: Array<{
  type: "quran" | "hadith" | "athar" | "scholar";
  text: LocalizedString;       // verbatim quote, Arabic authoritative + English translation
  reference: LocalizedString;  // e.g. "سورة البقرة ٢٦٧" / "Surah Al-Baqarah 267"
}>
```

### Step 2 — Redesign `NiyyahCard` to render layered sources

**File**: `src/components/NiyyahCard.tsx`
When `sources` is present, render each entry as its own labeled block below the existing hadith footnote (not replacing it), using `spacing`/`radius` tokens and `AppText` variants per the project's design-token rules — no raw style literals. Each source block needs a small type label (Qur'an / Hadith / Athar / Scholar, bilingual) so users can distinguish authority level at a glance. Keep the existing single-hadith rendering path fully intact for any niyyah that has no `sources` array — this must be a strictly additive UI change, not a replacement of the current display for entries that don't have extra sources.

### Step 3 — Prioritize which existing niyyah get secondary sources

Do not attempt all 70+ at once. Start with the activities already given extra research rigor this session (Commute, Sleep, Fajr) as the pilot batch, since their primary hadith are already verified and well-understood. Expand outward by category, prioritizing categories added in Phase 14 (they're being researched fresh anyway, so layering in a Quran ayah or athar at data-entry time is cheaper than retrofitting later).

### Step 4 — Research and add secondary sources per niyyah

For each niyyah in the current batch, search for a genuinely relevant: (a) Quran ayah if the niyyah's underlying concept has direct Quranic grounding, (b) athar from a companion or early scholar, (c) commentary from a classical or contemporary scholar explaining the hadith's implication — following the same sunnah.day/verified-source discipline used for hadith. Skip any category where sources (b) or (c) can't be found with confidence; a hadith-only niyyah is not a failure state.

### Verification Plan

- Confirm every new Quran/athar/scholar citation resolves to a real, checkable source (surah:ayah for Quran; named book/collection for athar and scholar quotes).
- Run `npm run typecheck` after the `NiyyahOption`/`Activity` type extension — confirm no breakage across existing call sites that read `hadithRef`.
- Manually verify `NiyyahCard` renders correctly for: (a) a niyyah with only `hadithRef` (existing/unchanged behavior), (b) a niyyah with `hadithRef` + `sources` (new layered display), in both English and Arabic, RTL, without breaking the vertical-centering/line-height fixes established earlier in this project.
- Manually verify visual distinction between source types is clear and consistent (spacing, label, no ambiguity about which type of source is being read).

### Estimated Effort

- Step 1 (data model extension): 2–4 hours dev.
- Step 2 (`NiyyahCard` UI redesign for layered sources): 4–6 hours dev.
- Step 3–4 (research + content, pilot batch of ~5–10 niyyah entries): 15–20 hours.
- Full rollout beyond the pilot batch (remaining niyyah, partial coverage expected): 40–60+ additional hours, to be scheduled incrementally rather than as one block — treat as an ongoing content initiative, not a single sprint.

---

## Post-MVP Polish (After Main Phases)

- [ ] **Unit Testing for Core Architecture**: Add unit testing for critical global logic, specifically focusing on complex hooks and layout boot sequences that rely heavily on native module integrations (Sentry, Expo Router, Expo Notifications).
  - **Testing Strategy for `useNotifications`**: Use `@testing-library/react-native` (`renderHook`). Mock `expo-notifications` (`useLastNotificationResponse`, listener adders) and `expo-router` (`useRootNavigationState`, `router.navigate`). Verify:
    1. Cold Start Navigation triggers correct `router.navigate`.
    2. Mounting Guard correctly blocks navigation if the router isn't ready.
    3. Cold Start De-duplication prevents navigating to the same notification ID twice.
    4. Foreground/Background Tap manually triggers navigation via mocked listeners.
  - **Testing Strategy for `_layout.tsx`**: Use `@testing-library/react-native` (`render`). Mock `expo-splash-screen` (`hideAsync`), `@sentry/react-native` methods, and the `settingsStore`. Verify:
    1. Boot Sequence Blocking (splash screen waits while `isLoading` is true).
    2. Boot Sequence Success (splash screen hides once loaded).
    3. Sentry Context Sync correctly applies mocked user/settings context.
    4. Effect Isolation (unrelated settings changes do not cause layout/Sentry re-renders).
- [ ] **Bottom Sheet Journal UX**: Replace the inline journal Add/Edit form with `@gorhom/bottom-sheet`. It runs on the UI thread via Reanimated, supports gesture-based dismissal, and integrates cleanly with the existing animation and haptics stack. Apply the same treatment to any future action confirmations that would otherwise use system `Alert.alert`.
- [ ] **Additional Export Formats**: Add support for **CSV** and **PDF** exports.
- [ ] **Android Widgets**: Home screen widgets for daily niyyah.
- [ ] **Activity-specific reminders**: Custom push notifications per activity.
- [ ] **Weekly Insights Dashboard**: Create a dashboard view showing intention trends over the last 7 days.
- [ ] **Dynamic Ajr Multiplier**: Refine the "Ajr Multiplier" calculation based on intention depth and consistency.
- [ ] **Report wrong/weak hadith**: In-app feedback mechanism.
