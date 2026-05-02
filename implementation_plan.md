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
- [ ] **Unlock Nudges**: Implement UI hints in settings when certain roles are disabled.

---

## Phase 3: Notifications & Reminders 🚧
**Goal**: Implement local push notifications to maintain consistency.
- [ ] **Scheduling Logic**: Setup `expo-notifications` for daily intention reminders.
- [ ] **Contextual Nudges**: Schedule notifications based on user-defined "reminder times" for specific acts.

---

## Phase 4: Journal UX Refinement 🚧
**Goal**: Elevate the journal from simple logging to a robust reflection tool.
- [ ] **Delete & Edit**: Implement swipe-to-delete and a dedicated edit mode for entries.
- [ ] **Search & Filter**: Enhance the search bar with keyword highlighting and multi-tag filtering.

---

## Phase 5: Settings & Profile Expansion 🚧
**Goal**: Personalize the app experience and secure user data.
- [ ] **Setup Wizard**: Create a simplified "Role Selection" UI within settings.
- [ ] **Data Management**: Add Export to CSV/PDF for user records.

---

## Phase 6: Global RTL Icon Fixes 🚧
**Goal**: Ensure a perfect experience for Arabic-speaking users.
- [ ] **Icon Mirroring**: Audit all directional icons (arrows, chevrons) and implement auto-flipping logic for RTL.
- [ ] **Arabic Typography Polish**: Fine-tune line heights and letter spacing for `Tajawal`.

---

## Phase 7: Dynamic Ajr Multiplier & Weekly Insights 🚧
**Goal**: Provide motivational feedback through data visualization.
- [ ] **Weekly Summary**: Create a dashboard view showing intention trends over the last 7 days.
- [ ] **Multiplier Logic**: Refine the "Ajr Multiplier" calculation based on intention depth and consistency.

---

## Phase 8: Onboarding Flow (MVP Target) 🏁
**Goal**: Introduce the concept of Baraka and Renewing Intentions to new users.
- [ ] **Walkthrough**: A 3-4 screen introductory flow explaining the spiritual benefits.
- [ ] **Initial Setup**: Guide the user through selecting their first 3 activities.

---

## Verification Plan

### Manual Verification
- Perform a full "Day in the Life" test: Onboarding -> Selecting Activity -> Renewing Niyyah -> Journaling -> Checking Settings.
- Verify Light/Dark mode transitions on all screens.
- Test RTL language toggle and ensure layout stability.

### Automated Testing
- `npm run typecheck` to ensure no regression in TypeScript interfaces.
