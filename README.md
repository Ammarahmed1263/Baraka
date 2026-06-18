# Baraka

A privacy-first, offline-capable mobile app for Muslims to set and renew daily intentions (niyyah) for routine activities, elevating them into acts of worship.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)]()
[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=flat&logo=expo&logoColor=white)]()
[![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=flat&logo=react&logoColor=white)]()

---

## Overview

Many daily routines—like commuting, working, or eating—can feel mundane, but in Islamic tradition, they can be transformed into acts of worship simply by attaching a conscious, positive intention (Niyyah). Baraka solves the problem of spiritual disconnect in modern busy lives by offering a structured, interactive way to set, track, and reflect on these intentions every day.

By leveraging role-based filtering, users are presented with tailored niyyah suggestions (e.g., specific intentions for parents, students, or professionals). Technically, Baraka is an offline-first mobile application built with React Native and Expo. It leverages Zustand for high-performance state management and features a fully custom, premium Emerald/Gold design system built with React Native Reanimated and Expo Glass Effect, ensuring a fast, tactile, and visually stunning user experience.

---

## Screenshots / Demo

<!-- Add screenshots or GIFs here (e.g., from /assets/images or a /screenshots folder) -->

---

## Features

- **Role-Based Niyyah Filtering:** Dynamically adapts suggested intentions based on user roles (Parent, Student, Professional, Homemaker) using a reactive Zustand store.
- **Ajr Multiplier Dashboard:** Motivates users with a live calculation of potential spiritual reward (completed acts × average intentions per act), built with highly optimized reactive state selectors.
- **Bilingual Interface (English/Arabic):** Full UI and content localization via `i18next` and `expo-localization`, supporting dynamic language toggling on the fly.
- **Daily Intention Reminders:** Configurable daily push notifications with a customizable reminder time, bilingual rotating messages, contextual permission flow, and tap-to-open deep linking.
- **Reflection Journaling:** Allows users to log post-activity reflections with activity-based filtering and multi-tag search capabilities.
- **Offline-First & Privacy Focused:** Operates entirely on-device without any backend servers, storing all user preferences and history locally via `AsyncStorage`.
- **Premium Tactile UX:** Uses `expo-haptics` and `react-native-reanimated` to provide micro-animations and centralized haptic feedback for a highly polished feel.
- **Data Portability:** Allows users to export their entire intention and journaling history to an `.xlsx` format for personal safekeeping.

---

## Tech Stack

| Layer | Technology | Why it was chosen |
|---|---|---|
| **Framework** | React Native & Expo Router | Rapid cross-platform development with file-based routing and seamless native module integration. |
| **State Management** | Zustand | Minimal boilerplate, hook-based API, and high performance without the heavy overhead of Redux. |
| **Local Storage** | AsyncStorage (Migrating to MMKV) | Simple key-value storage for an offline-first architecture; MMKV migration planned for synchronous reads. |
| **Localization** | i18next & react-i18next | Industry standard for handling bilingual content (English/Arabic) with robust pluralization and interpolation. |
| **UI & Animations** | Reanimated & Expo Glass Effect | Fluid, 60fps animations on the UI thread and native blur effects to achieve a premium aesthetic. |
| **Data Export** | xlsx | Allows robust generation of Excel files purely on the client side for user data portability. |

---

## Architecture & Key Decisions

> **Decision:** Offline-first architecture with local storage only  
> **Alternatives:** Firebase, Supabase, custom Node.js backend  
> **Reason:** Prioritizes user privacy for sensitive journaling data. Eliminates cloud infrastructure costs and ensures the app works perfectly in low-connectivity areas.

> **Decision:** Zustand for Global State Management  
> **Alternatives:** Redux Toolkit, React Context API  
> **Reason:** React Context triggered too many unnecessary re-renders for the highly dynamic "Ajr Multiplier" and role-based filtering. Zustand provided granular, selector-based reactivity with a significantly smaller learning curve and less boilerplate than Redux.

> **Decision:** Expo Router (File-based routing)  
> **Alternatives:** React Navigation (Declarative)  
> **Reason:** Deep linking support out-of-the-box and a Next.js-like file structure that makes the `app/` directory incredibly intuitive to navigate for new engineers joining the project.

> **Decision:** Custom Design System over UI Libraries  
> **Alternatives:** NativeBase, React Native Paper, Tamagui  
> **Reason:** The product required a very specific, premium "Emerald/Gold" aesthetic with heavy use of glassmorphism and custom haptics. A bespoke library of atomic components (`AppButton`, `AppText`) ensured 100% control over micro-animations and RTL compliance without bloating the bundle.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Bun (or npm/yarn/pnpm)
- Expo Go app on your physical device (or iOS Simulator / Android Emulator)

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ammarahmed1263/Baraka.git
   cd Baraka
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Run the Expo development server:**
   ```bash
   bun start
   ```

4. **View the app:**
   Scan the QR code in your terminal using the Expo Go app on your phone, or press `i` for iOS / `a` for Android.

---

## Project Structure

```text
Baraka/
├── app/               # Expo Router file-based routing and screen definitions
├── assets/            # Static assets (fonts, icons, splash screens)
├── components/        # Reusable, atomic UI components (AppButton, AppText, etc.)
├── constants/         # Global configuration, themes, and design tokens
├── context/           # React Context providers (legacy or specific scopes)
├── data/              # Static seed data (pre-filled niyyah templates, hadiths)
├── hooks/             # Custom React hooks for shared logic
├── i18n/              # Localization configuration and translation files
├── lib/               # Third-party library initializations (e.g., export logic)
├── store/             # Zustand state management slices
├── types/             # TypeScript interfaces and global type definitions
└── utils/             # Pure helper functions (date formatting, ID generation)
```

---

## API Reference

*N/A — Baraka is a 100% offline-first application. All data operations occur directly against local device storage without external API dependencies.*

---

## Roadmap / In Progress

- [x] **Core Infrastructure:** Zustand store migration & directory restructuring.
- [x] **Role-Based Filtering:** Dynamic niyyah options based on user profile settings.
- [x] **Onboarding Flow:** Introductory walkthrough explaining spiritual benefits.
- [x] **Notifications:** Daily bilingual reminders with customizable time, permission flow, and deep-link tap-to-open via `expo-notifications`.
- [ ] **Journal Refinement:** Add swipe-to-delete, multi-tag filtering, and keyword search.
- [ ] **Data Export:** Handle complete export to `.xlsx`, `.csv`, `.pdf`, `.json` for user records.
- [ ] **RTL Optimization:** Icon mirroring and Arabic typography polish.
- [ ] **UX Polish:** Implement bottom sheet modals and Skeleton loaders.
- [ ] **Performance:** Migrate from AsyncStorage to MMKV for synchronous storage.
- [ ] **Observability:** Integrate Sentry for crash reporting in production.

---

## Contributing

We welcome contributions from the community! Whether it's adding new Arabic translations, refining animations, or improving local performance, please feel free to open an issue or submit a Pull Request. Make sure to run `npm run typecheck` to verify TypeScript interfaces before submitting.

---

## License

This project is licensed under the MIT License.