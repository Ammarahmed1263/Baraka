# Baraka Project Revitalization: Master Implementation Plan

This document outlines the phased roadmap for upgrading the Baraka app's architecture and expanding its feature set.

---

## Phase 1: Core Infrastructure Upgrade ✅

### 1.5 - 1.7: State & Layout [COMPLETED]
- [x] Zustand store migration.
- [x] `src/` directory restructuring.
- [x] Granular import aliases (@components, @store, etc.).

### 1.8: Reusable UI Library [NEXT] 🚧
**Goal**: Standardize UI elements to ensure visual consistency and reduce code duplication.
- **[NEW] [AppButton](file:///d:/Projects/Baraka/src/components/UI/AppButton.tsx)**:
  - Support `variants` (primary, outline, ghost).
  - Integration with `Haptics`.
  - Loading and Disabled states.
- **[NEW] [AppTextInput](file:///d:/Projects/Baraka/src/components/UI/AppTextInput.tsx)**:
  - Themed styles for both light/dark modes.
  - Multi-line and focus state handling.

### 1.9: Design System Refinement 🎨
**Goal**: Apply the new premium color palette and standardized theme tokens.
- **[MODIFY] [colors.ts](file:///d:/Projects/Baraka/src/constants/colors.ts)**:
  - Update to Emerald/Gold palette.
  - Rename `backgroundSecondary` to `backgroundSubtle`.
- **Global Style Update**: Refactor components to use the new `backgroundSubtle` token.

### 1.10: Utility Decoupling ⚙️
**Goal**: Move business logic out of components/stores into a dedicated utility layer.
- **[NEW] [id.ts](file:///d:/Projects/Baraka/src/utils/id.ts)**: Centralize `generateId`.
- **[NEW] [date.ts](file:///d:/Projects/Baraka/src/utils/date.ts)**: Move formatting logic and `getTodayString`.
- **[NEW] [stats.ts](file:///d:/Projects/Baraka/src/utils/stats.ts)**: Move `computeStreak` and other calculation logic.

---

## Phase 2: Role-Based Niyyah Filtering 🚧

**Goal**: Contextualize intentions based on the user's life roles.
- **Role Badges**: Visual indicators (pill-shaped with icons).
- **Unlock Hints**: Nudges for specialized role intentions.

---

## Phases 3 - 8: Feature Roadmap
- **Phase 3**: Push Notifications & Reminders.
- **Phase 4**: Journal Delete & UX.
- **Phase 5**: Settings & Profile Enhancements.
- **Phase 6**: Global RTL Icon Fixes.
- **Phase 7**: Dynamic Ajr Multiplier & Weekly Summary.
- **Phase 8**: Onboarding Flow.

---

## Verification Plan

### Manual Verification
- Verify `AppButton` and `AppTextInput` render correctly in both light/dark modes.
- Confirm the new color palette is applied globally without breaking existing UI.

### Automated Testing
- `npm run typecheck` after each step.
