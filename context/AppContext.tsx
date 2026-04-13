import AsyncStorage from "@react-native-async-storage/async-storage";
import { differenceInCalendarDays, format, parse, subDays } from "date-fns";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { DEFAULT_ACTIVITIES, type Activity } from "@/constants/data";

export type UserActivity = Activity & {
  enabled: boolean;
  customTime?: string;
  customNiyyah?: string;
  selectedNiyyahIds?: string[];
  customNiyyahOptions?: Array<{ id: string; text: string; textAr: string }>;
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
  activityName: string;
  activityNameAr?: string;
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

type AppContextType = {
  activities: UserActivity[];
  dailyLogs: DailyLog[];
  journalEntries: JournalEntry[];
  settings: AppSettings;
  streak: number;
  todayLogs: DailyLog[];
  toggleActivity: (activityId: string) => Promise<void>;
  markComplete: (activityId: string, selectedNiyyahIds: string[]) => Promise<string>;
  unmarkComplete: (activityId: string) => Promise<void>;
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "createdAt">) => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  addCustomActivity: (activity: Omit<UserActivity, "enabled">) => Promise<void>;
  updateActivity: (activityId: string, updates: Partial<UserActivity>) => Promise<void>;
  isCompletedToday: (activityId: string) => boolean;
  getStreakForActivity: (activityId: string) => number;
  getTodayCompletionRate: () => number;
  getAjrMultiplier: () => { acts: number; avgNiyyahs: number; total: number };
  getTodayLogForActivity: (activityId: string) => DailyLog | undefined;
  getProfileTags: () => string[];
  isLoading: boolean;
};

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  ACTIVITIES: "@niyyah_activities",
  DAILY_LOGS: "@niyyah_daily_logs",
  JOURNAL: "@niyyah_journal",
  SETTINGS: "@niyyah_settings",
  STREAK: "@niyyah_streak",
};

const DEFAULT_SETTINGS: AppSettings = {
  showBilingual: false,
  darkMode: "auto",
  notificationsEnabled: true,
  onboardingComplete: false,
  profile: {
    isHomemaker: false,
    isParent: false,
    isStudent: false,
    isProfessional: false,
  },
};

function getTodayString() {
  return format(new Date(), "yyyy-MM-dd");
}

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const streakRef = useRef(streak);
  streakRef.current = streak;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [activitiesRaw, logsRaw, journalRaw, settingsRaw, streakRaw] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES),
          AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS),
          AsyncStorage.getItem(STORAGE_KEYS.JOURNAL),
          AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
          AsyncStorage.getItem(STORAGE_KEYS.STREAK),
        ]);

      if (activitiesRaw) {
        setActivities(JSON.parse(activitiesRaw));
      } else {
        const defaults: UserActivity[] = DEFAULT_ACTIVITIES.map((a) => ({
          ...a,
          enabled: ["fajr", "breakfast", "work", "maghrib", "isha"].includes(a.id),
          selectedNiyyahIds: [],
        }));
        setActivities(defaults);
        await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(defaults));
      }

      if (logsRaw) setDailyLogs(JSON.parse(logsRaw));
      if (journalRaw) setJournalEntries(JSON.parse(journalRaw));
      if (settingsRaw) {
        const parsed = JSON.parse(settingsRaw);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed, profile: { ...DEFAULT_SETTINGS.profile, ...(parsed.profile || {}) } });
      }
      if (streakRaw) setStreak(parseInt(streakRaw, 10));
    } catch (e) {
      console.error("Failed to load data", e);
    } finally {
      setIsLoading(false);
    }
  };

  const todayLogs = dailyLogs.filter((l) => l.date === getTodayString());

  const isCompletedToday = useCallback(
    (activityId: string) => todayLogs.some((l) => l.activityId === activityId),
    [todayLogs]
  );

  const getTodayLogForActivity = useCallback(
    (activityId: string) => todayLogs.find((l) => l.activityId === activityId),
    [todayLogs]
  );

  const markComplete = useCallback(
    async (activityId: string, selectedNiyyahIds: string[] = []): Promise<string> => {
      const logId = generateId();
      const newLog: DailyLog = {
        id: logId,
        activityId,
        date: getTodayString(),
        completedAt: new Date().toISOString(),
        selectedNiyyahIds,
      };
      const updated = [...dailyLogs, newLog];
      setDailyLogs(updated);
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(updated));
      await updateStreak(updated);
      return logId;
    },
    [dailyLogs]
  );

  const unmarkComplete = useCallback(
    async (activityId: string) => {
      const updated = dailyLogs.filter(
        (l) => !(l.activityId === activityId && l.date === getTodayString())
      );
      setDailyLogs(updated);
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(updated));
    },
    [dailyLogs]
  );

  const updateStreak = async (logs: DailyLog[]) => {
    const today = new Date();
    const uniqueDates = Array.from(new Set(logs.map((l) => l.date)))
      .map((dateString) => parse(dateString, "yyyy-MM-dd", new Date()))
      .sort((a, b) => b.getTime() - a.getTime());

    let newStreak = 0;

    for (const logDate of uniqueDates) {
      const dayDiff = differenceInCalendarDays(today, logDate);

      if (dayDiff === newStreak) {
        newStreak += 1;
        continue;
      }

      if (dayDiff > newStreak) {
        break;
      }
    }

    setStreak(newStreak);
    await AsyncStorage.setItem(STORAGE_KEYS.STREAK, newStreak.toString());
  };

  const toggleActivity = useCallback(
    async (activityId: string) => {
      const updated = activities.map((a) =>
        a.id === activityId ? { ...a, enabled: !a.enabled } : a
      );
      setActivities(updated);
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updated));
    },
    [activities]
  );

  const addJournalEntry = useCallback(
    async (entry: Omit<JournalEntry, "id" | "createdAt">) => {
      const newEntry: JournalEntry = {
        ...entry,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      const updated = [newEntry, ...journalEntries];
      setJournalEntries(updated);
      await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(updated));
    },
    [journalEntries]
  );

  const updateSettings = useCallback(
    async (updates: Partial<AppSettings>) => {
      const updated = {
        ...settings,
        ...updates,
        profile: { ...settings.profile, ...(updates.profile || {}) },
      };
      setSettings(updated);
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    },
    [settings]
  );

  const addCustomActivity = useCallback(
    async (activity: Omit<UserActivity, "enabled">) => {
      const newActivity: UserActivity = { ...activity, enabled: true, selectedNiyyahIds: [] };
      const updated = [...activities, newActivity];
      setActivities(updated);
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updated));
    },
    [activities]
  );

  const updateActivity = useCallback(
    async (activityId: string, updates: Partial<UserActivity>) => {
      const updated = activities.map((a) =>
        a.id === activityId ? { ...a, ...updates } : a
      );
      setActivities(updated);
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updated));
    },
    [activities]
  );

  const getStreakForActivity = useCallback(
    (activityId: string) => {
      let count = 0;
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const dateStr = format(subDays(today, i), "yyyy-MM-dd");
        if (dailyLogs.some((l) => l.activityId === activityId && l.date === dateStr)) count++;
        else if (i > 0) break;
      }
      return count;
    },
    [dailyLogs]
  );

  const getTodayCompletionRate = useCallback(() => {
    const enabled = activities.filter((a) => a.enabled);
    if (enabled.length === 0) return 0;
    const completed = enabled.filter((a) => isCompletedToday(a.id)).length;
    return Math.round((completed / enabled.length) * 100);
  }, [activities, isCompletedToday]);

  const getAjrMultiplier = useCallback(() => {
    const completedLogs = todayLogs;
    const acts = completedLogs.length;
    if (acts === 0) return { acts: 0, avgNiyyahs: 0, total: 0 };
    const totalNiyyahs = completedLogs.reduce(
      (sum, l) => sum + Math.max(1, (l.selectedNiyyahIds || []).length),
      0
    );
    const avgNiyyahs = Math.round((totalNiyyahs / acts) * 10) / 10;
    return { acts, avgNiyyahs, total: acts * avgNiyyahs };
  }, [todayLogs]);

  const getProfileTags = useCallback(() => {
    const tags: string[] = [];
    if (settings.profile.isHomemaker) tags.push("homemaker");
    if (settings.profile.isParent) tags.push("parent");
    if (settings.profile.isStudent) tags.push("student");
    if (settings.profile.isProfessional) tags.push("professional");
    return tags;
  }, [settings.profile]);

  return (
    <AppContext.Provider
      value={{
        activities,
        dailyLogs,
        journalEntries,
        settings,
        streak,
        todayLogs,
        toggleActivity,
        markComplete,
        unmarkComplete,
        addJournalEntry,
        updateSettings,
        addCustomActivity,
        updateActivity,
        isCompletedToday,
        getStreakForActivity,
        getTodayCompletionRate,
        getAjrMultiplier,
        getTodayLogForActivity,
        getProfileTags,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
