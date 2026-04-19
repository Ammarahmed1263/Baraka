import type { LocalizedString } from "./i18n";

export type { LocalizedString };

export type Activity = {
  id: string;
  /** Bilingual display name */
  name: LocalizedString;
  icon: string;
  /** Category key used for grouping (e.g. "worship", "daily") */
  category: string;
  /** Default niyyah text shown before user selects specific options */
  niyyahText: LocalizedString;
  hadithRef?: string;
  defaultTime?: string;
  color: string;
};

export type NiyyahOption = {
  id: string;
  activityId: string;
  level: "basic" | "advanced";
  text: LocalizedString;
  source?: string;
  profileTag?: "homemaker" | "student" | "professional" | "parent";
};

export type EducationEntry = {
  id: string;
  title: LocalizedString;
  /** Category key used for filtering (e.g. "Foundations", "Work") */
  category: string;
  content: LocalizedString;
  source: string;
  keywords: string[];
};

export type UserActivity = Activity & {
  enabled: boolean;
  customTime?: string;
  /** User-edited override for the default niyyah. Plain string (user language). */
  customNiyyah?: string;
  selectedNiyyahIds?: string[];
  customNiyyahOptions?: Array<{ id: string; text: LocalizedString }>;
};

export type DailyLog = {
  id: string;
  activityId: string;
  date: string;
  completedAt: string;
  selectedNiyyahIds: string[];
  note?: string;
};

export type JournalEntry = {
  id: string;
  activityId: string;
  /** Snapshot of the activity name at the time of logging */
  activityName: LocalizedString;
  date: string;
  createdAt: string;
  note: string;
  selectedNiyyahCount?: number;
  impactfulNiyyah?: string;
};

export type UserProfile = {
  isHomemaker: boolean;
  isParent: boolean;
  isStudent: boolean;
  isProfessional: boolean;
};

export type AppSettings = {
  showBilingual: boolean;
  darkMode: "auto" | "light" | "dark";
  notificationsEnabled: boolean;
  onboardingComplete: boolean;
  profile: UserProfile;
};



