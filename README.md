# Baraka (بركة)

An offline-first, bilingual (English/Arabic) mobile app that helps Muslims set and renew a conscious intention (niyyah) before daily activities — prayer, eating, work, sleep — turning routine moments into acts of worship. Every intention is backed by a verified, canonical hadith reference; nothing is included on a weak or fabricated source.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)]()
[![Expo](https://img.shields.io/badge/Expo_SDK_54-1B1F23?style=flat&logo=expo&logoColor=white)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)]()
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat&logo=drizzle&logoColor=black)]()
[![Sentry](https://img.shields.io/badge/Sentry-362D59?style=flat&logo=sentry&logoColor=white)]()

Shipped to Google Play (closed testing).

---

## Overview

Many daily routines can feel mundane, but in Islamic tradition they become acts of worship through a sincere, conscious intention. Baraka gives that intention structure: role-based niyyah suggestions (parent, student, professional, homemaker), a daily renewal flow, reflection journaling, and a streak/reward system — entirely offline, fully bilingual with real RTL support, and content-audited against canonical sources rather than generic self-help copy.

It's also a live case study in migrating a shipped, published app's entire data layer without losing a single user's history — see [ARCHITECTURE.md's Notable Engineering Problems](./ARCHITECTURE.md#notable-engineering-problems) for what that actually involved.

---

## Features

- **Role-based niyyah suggestions.** Intention options tailored to parent, student, professional, and homemaker roles, so the same activity surfaces different, relevant niyyah text per role.
- **17 daily activities** spanning prayer, eating, work, exercise, sleep, and more, each backed by a verified, canonical hadith reference.
- **Daily renewal flow.** A deliberate "set your intention" step before each activity, with a disclaimer that niyyah lives in the heart, not the tongue.
- **Streak tracking with an ajr (reward) multiplier**, strict by design. Missing a day resets the streak.
- **Optional 9 PM streak-risk reminder.** If nothing's been completed by then, you're notified before the day is lost. It stays armed a day ahead so it still fires even if you don't reopen the app.
- **A single daily reminder** at a time you choose, with a contextual permission flow, instead of per-activity notification spam.
- **Reflection journaling** with search and filtering across past entries.
- **Custom activities and custom niyyah options** to extend the built-in set with your own.
- **Fully offline.** No network dependency for core functionality.
- **Bilingual EN/AR with real RTL support**, enforced as the default experience rather than bolted on.

---

## Screenshots / Demo

<!-- Add EN/AR screenshot pairs here — side-by-side LTR/RTL is worth more than a paragraph of description -->

---

## Architecture Highlights

Full reasoning and the complete bug writeups live in **[ARCHITECTURE.md](./ARCHITECTURE.md)**. Short version:

- **SQLite (expo-sqlite) + Drizzle ORM**, not Realm (deprecated by MongoDB in 2024) or WatermelonDB (built for sync/scale this app doesn't need) — chosen for real relational integrity (explicit foreign keys) over the static-array model it replaced.
- **A real `useLiveQuery` gotcha**: it only subscribes to a query's `FROM` table, not anything `leftJoin`-ed in — found when activity toggles silently stopped updating the UI.
- **Async local reads still need a loading state**: `useLiveQuery` seeds `[]` before resolving, so "loading" and "genuinely empty" look identical without an explicit signal — solved with `updatedAt`-gated skeleton loaders instead of spinners or blank screens.
- **Arabic is the enforced default**, regardless of device locale, with full RTL layout — including a real bug where a manual RTL animation compensation clamped the first onboarding screen to invisible.
- **A legacy-data migration bug found by self-audit**, not a bug report: journal entries and daily logs had no backfill path from the old storage, meaning upgrading users would have silently lost their history.
- **Sentry tuned for a free-tier quota** — breadcrumbs/tags/context are free and used liberally; exception/message capture reserved for real events.
- **Opt-in product analytics behind a single wrapper** — PostHog is off by default, can only be reached through one file whose `track()` accepts primitives only (so private journal/niyyah text cannot be sent by construction), and is built to never duplicate Sentry's crash reporting.
- **Every niyyah traces to a canonical, verified hadith reference** — no weak or fabricated sources, even if it means cutting a feature.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native, Expo SDK 54, Expo Router v4, TypeScript |
| Data (content + user data) | expo-sqlite + Drizzle ORM, reactive via `useLiveQuery` |
| Data (settings only) | Zustand + MMKV |
| Animation | React Native Reanimated 4, RN Gesture Handler |
| Localization | i18next / react-i18next, full RTL support |
| Observability | Sentry (breadcrumbs, tags, context, quota-aware error capture) |
| Analytics | PostHog (opt-in, Product Analytics only, anonymous id, no content ever sent) |
| Updates | EAS Update (JS-only OTA) with fingerprint runtime versions |
| Notifications | expo-notifications |
| UI | Custom design-token system (spacing/radius/typography), `AnimatedPressable`, `@gorhom/bottom-sheet`, Feather icons |
| Testing | Jest, targeted at migrations, streak computation, notifications, date/id utilities |
| Tooling | Bun |

---

## Data Model

Core tables: `categories`, `activities`, `niyyah_options`, `niyyah_profile_tags`, `niyyah_sources`, `learn_content`, `content_meta`, `user_activity_prefs`, `custom_activities`, `custom_niyyah_options`, `daily_logs`, `daily_log_niyyahs`, `journal_entries`.

Content tables (`activities`, `niyyah_options`, `learn_content`, etc.) are wiped and re-seeded on content-version bumps; user tables are never touched by seeding. `niyyah_sources` exists ahead of use — the schema already supports layering Qur'an/athar/scholar citations alongside a hadith reference, for a planned multi-source evidencing feature.

---

## Getting Started

### Prerequisites
- Node.js 18+ and Bun
- Android Studio (emulator) or a physical device for `expo-dev-client` — this app uses native modules (SQLite, notifications) that need a custom dev client, not plain Expo Go

### Local Setup

```bash
git clone https://github.com/Ammarahmed1263/Baraka.git
cd Baraka
bun install
bunx expo run:android   # or: bunx expo run:ios
```

### Useful scripts

```bash
npm run typecheck   # tsc --noEmit
npm test            # jest
npm run db:generate # drizzle-kit generate, after any schema.ts change
bunx expo prebuild --clean   # after any native config change

# Inspect the live on-device SQLite DB: run `bunx expo start`, then press
# shift+m in that terminal and choose "expo-drizzle-studio-plugin" from the
# dev tools menu — opens Drizzle Studio in a browser, connected to the
# running app's real database. (`drizzle-kit studio` does not work here —
# it expects a local DB file/connection, not an app-sandboxed Expo SQLite DB.)
```

---

## Project Structure

```text
src/
  app/                Expo Router screens
    (tabs)/            index, journal, learn, settings
    activity/[id].tsx  Activity detail (top-level route, modal presentation)
    learn/[id].tsx
    onboarding/
  components/          UI/ Activity/ Home/ Journal/ Learn/ Settings/ onboarding/
  store/               settingsStore (the only remaining Zustand store)
  db/                  db.ts, schema.ts, seed.ts, seedMappers.ts, migrations.ts
  data/                notifications.ts, onboardingDefaults.ts, onboardingSlides.ts
  hooks/               screen-level hooks (useActivityDetail, useFilteredJournal, ...)
  hooks/db/            SQLite data-access hooks (useActivities, useDailyLogs, useJournal, ...)
  constants/ lib/ context/ services/ i18n/ types/ utils/
```

---

## Roadmap

What's already built is covered above in [Overview](#overview) and [Architecture Highlights](#architecture-highlights) — including the two production incidents (boot-race and legacy-migration data loss) that were root-caused and fixed post-launch, see [ARCHITECTURE.md](./ARCHITECTURE.md#notable-engineering-problems). What's ahead:

- [ ] Per-activity reminders and prayer-time auto-detection (v2)
- [ ] Multi-source niyyah evidencing (Qur'an/athar/scholar citations alongside hadith — data model already in place)
- [ ] More content — additional verified activities and learn/niyyah entries
- [ ] Native Android widgets
- [ ] In-app feedback channel
- [ ] Basic user insights (streak trends, completion history)
- [ ] CSV/PDF export
- [ ] ESLint + Prettier + pre-commit enforcement
- [ ] OTA updates via EAS Update, so JS-only fixes don't wait on a full store review (config committed; goes live with the next store build)
- [ ] Retention work: contextual notification ask and Android battery-optimization prompt, measured with the opt-in analytics above

Open gaps tracked deliberately rather than hidden: see [ARCHITECTURE.md's Open Gaps](./ARCHITECTURE.md#open-gaps).

---

## Contributing

Contributions are welcome via pull request — `main` is protected, so forking and opening a PR is the only way in, and everything is reviewed before merge. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the workflow.

---

## License

MIT
