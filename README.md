# Niyyah Renew

A privacy-first, offline-capable, ad-free mobile app for Muslims to set and renew daily intentions (niyyah) for routine activities — elevating them into acts of worship.

> "Actions are only by intentions, and every person will have only what they intended."
> — Prophet Muhammad ﷺ (Bukhari & Muslim)

---

## Features

### Core (v1.0)
- **Daily Niyyah Checklist** — Tap to renew intentions for each activity
- **Streak Tracker** — Maintains a consecutive-day streak to build consistency
- **Educational Library** — 15 entries covering the fiqh and spirituality of niyyah
- **Reflection Journal** — Log thoughts after renewing intentions; filterable by activity
- **Customisable Reminders** — Toggle pre-set activities and add custom ones with icons/colours
- **Bilingual (English/Arabic)** — Full UI and content in both languages

### Enhanced (v1.1) — Multi-Niyyah System
- **Multi-layered Niyyah Suggestions** — Every activity shows:
  - 1 core (basic) intention always visible
  - 3–5 advanced intentions selectable as a checklist
  - A "+" button to add completely custom intentions (with Arabic support)
- **80+ Pre-filled Niyyah Templates** across all activity types (eating, work, sleep, prayer, exercise, cooking, cleaning, charity, family, commute, reading)
- **Profile Roles** — Enable Homemaker / Parent / Student / Professional to unlock contextually relevant niyyah options (e.g., cooking-for-family niyyahs for Homemakers, child-modelling niyyahs for Parents)
- **Ajr Multiplier** — Live calculation on the dashboard: `Acts completed × avg intentions per act = ×N multiplier`
- **Rich Reflection Prompts** — After renewing, the journal prompt mentions how many intentions were renewed and asks which one felt most impactful
- **Bilingual Toggle** — "Show Both Languages" setting to display Arabic & English side-by-side in niyyah options
- **Gold ×N badge** on activity cards showing how many intentions are set per activity

---

## Screens

| Screen | Description |
|--------|-------------|
| **Today** | Daily checklist with hadith card, progress ring, ajr multiplier, activity cards |
| **Activity Detail** | Core intention + multi-niyyah checklist + custom add + renew CTA |
| **Reflection** | Post-renewal journal prompt with impactful niyyah selector |
| **Reminders** | Enable/disable activities by category, add custom activities |
| **Learn** | Searchable education library with 15 Islamic knowledge cards |
| **Journal** | Timeline of reflections, filterable by activity with search |
| **Settings** | Profile roles, language, bilingual mode, notifications, data export |

---

## How to Add Custom Niyyahs

1. Open any activity (tap its card on the Today tab)
2. Scroll to the **"Multiply Your Intentions"** section
3. Tap **"+ Add custom intention"**
4. Enter your intention in English and/or Arabic
5. Tap **Add** — it's saved permanently to that activity

---

## How to Use Profile Roles

1. Go to **Settings → My Profile**
2. Toggle on any roles that apply to you (Homemaker, Parent, Student, Professional)
3. Return to any activity — you'll see additional tailored niyyah options unlocked

---

## Running the App

```bash
# Install dependencies
pnpm install

# Start the Expo dev server
pnpm --filter @workspace/niyyah-renew run dev

# Scan the QR code with Expo Go (iOS/Android) or press 'w' for web
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo / React Native |
| Navigation | Expo Router (file-based) |
| State | React Context + AsyncStorage |
| UI | Custom components, expo-linear-gradient, react-native-svg |
| Haptics | expo-haptics |
| Fonts | Inter (400, 500, 600, 700) via @expo-google-fonts |
| Icons | @expo/vector-icons (Feather) |

---

## Privacy

- **100% offline** — no network requests, no analytics, no tracking
- **No account required** — works instantly, data stays on device
- **Data export** — export all logs and journal entries as JSON via Settings

---

## Ajr Multiplier Formula

```
Ajr Multiplier = (number of acts completed today) × (average niyyahs per act)
```

Example: 5 acts completed, with an average of 3.8 intentions per act = ×19 potential multiplier.

This is shown as a visual motivator only. As the app notes: *"Allah knows the true reward."*

---

## Assumptions & Limitations

- Niyyah options with `profileTag` only appear when the matching profile role is enabled in Settings
- Custom niyyahs added per-activity are stored in AsyncStorage alongside the activity data
- The ajr multiplier counts the basic (core) niyyah as 1 even if no advanced options are selected
- Arabic text is right-aligned throughout; full RTL layout switching is not yet implemented (text content is bilingual, but layout direction remains LTR)
- Notifications are configured via expo-notifications but require a native build (Expo Go) to fully test on-device

---

## New Dependencies (v1.1)

No new npm packages were added. All enhancements use the existing stack.
