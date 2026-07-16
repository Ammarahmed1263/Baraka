import type { LocalizedString } from "./i18n";

export type { LocalizedString };

export type Activity = {
  id: string;
  name: LocalizedString;
  category: string;
  niyyahText: LocalizedString;
  hadithRef?: LocalizedString;
  defaultTime?: string;
};

export type NiyyahOption = {
  id: string;
  activityId: string;
  level: "basic" | "advanced";
  text: LocalizedString;
  source?: LocalizedString;
  profileTags?: ("homemaker" | "student" | "professional" | "parent")[];
};

export type EducationEntry = {
  id: string;
  title: LocalizedString;
  category: string;
  content: LocalizedString;
  source: LocalizedString;
  keywords: string[];
};

export type UserActivity = Activity & {
  enabled: boolean;
  customTime?: string;
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

export type AppThemeMode = "auto" | "light" | "dark";
export type NotificationPermissionStatus = "undetermined" | "granted" | "denied";

export type AppSettings = {
  showBilingual: boolean;
  darkMode: AppThemeMode;
  notificationsStatus: NotificationPermissionStatus;
  notificationsEnabled: boolean;
  reminderTime: string;
  onboardingComplete: boolean;
  profile: UserProfile;
};

export interface Time {
  hour: number;
  minute: number;
}
