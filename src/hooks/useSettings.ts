import { useMemo, useCallback, useState } from "react";
import { Alert, Linking, Share } from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@i18n";
import { clearAppData } from "@i18n";
import { useLocalize } from "@hooks/useLocalize";
import { storage } from "@lib/storage";
import { Haptic } from "@utils/haptics";
import { parseReminderTime } from "@utils/parseReminderTime";
import {
  cancelDailyNotifications,
  registerForPushNotificationsAsync,
  scheduleDailyNotifications,
  cancelStreakRiskNotification,
  evaluateStreakRisk,
} from "@/services/notifications";
import { getTodayString } from "@utils/date";
import { useSettingsStore } from "@store";
import { useEnabledActivities } from "@hooks/db/useActivities";
import { useDailyLogs } from "@hooks/db/useDailyLogs";
import { useJournalEntries } from "@hooks/db/useJournal";
import { clearUserData } from "@hooks/db/clearUserData";
import { setAnalyticsEnabled } from "@lib/analytics";
import { useToast } from "./useToast";
import { type RoleKey } from "@utils/roleHelpers";

const ROLE_UNLOCK_MESSAGES: Record<RoleKey, string> = {
  isHomemaker: "settings.roleToast.homemaker",
  isParent: "settings.roleToast.parent",
  isStudent: "settings.roleToast.student",
  isProfessional: "settings.roleToast.professional",
};

export function useSettings() {
  const { t } = useTranslation();
  const { language: lang, changeLanguage } = useLanguage();
  const localize = useLocalize();


  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const { activities: enabledActivities } = useEnabledActivities();
  const { logs: dailyLogs, streak } = useDailyLogs();
  const { entries: journalEntries } = useJournalEntries();


  const { toastMessage, showToast, animatedToastStyle } = useToast();


  const [pendingNotifications, setPendingNotifications] = useState<
    boolean | null
  >(null);
  const [pendingStreakNotifications, setPendingStreakNotifications] =
    useState<boolean | null>(null);

  const notificationsActive = useMemo(
    () =>
      pendingNotifications ??
      (settings.notificationsEnabled &&
        settings.notificationsStatus === "granted"),
    [
      pendingNotifications,
      settings.notificationsEnabled,
      settings.notificationsStatus,
    ],
  );

  const streakNotificationsActive = useMemo(
    () =>
      pendingStreakNotifications ??
      (settings.streakNotificationsEnabled &&
        settings.notificationsStatus === "granted"),
    [
      pendingStreakNotifications,
      settings.streakNotificationsEnabled,
      settings.notificationsStatus,
    ],
  );


  const formattedReminderTime = useMemo(() => {
    const timeStr = settings.reminderTime || "08:00";
    const { hour, minute } = parseReminderTime(timeStr);
    const ampm =
      hour >= 12 ? (lang === "ar" ? "م" : "PM") : lang === "ar" ? "ص" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = String(minute).padStart(2, "0");
    return `${displayHour}:${displayMinute} ${ampm}`;
  }, [settings.reminderTime, lang]);


  const handleProfileToggle = useCallback(
    (key: RoleKey) => {
      const newValue = !settings.profile[key];
      updateSettings({ profile: { ...settings.profile, [key]: newValue } });
      if (newValue) {
        Haptic.success();
        showToast(t(ROLE_UNLOCK_MESSAGES[key]));
      }
    },
    [settings.profile, updateSettings, showToast, t],
  );

  const handleNotificationToggle = useCallback(
    async (v: boolean) => {
      if (pendingNotifications !== null) return; // already mid-toggle

      setPendingNotifications(v);
      try {
        if (v) {
          const status = await registerForPushNotificationsAsync();
          updateSettings({
            notificationsStatus: status,
            notificationsEnabled: status === "granted",
          });

          if (status === "granted") {
            Haptic.success();
            await scheduleDailyNotifications(
              settings.reminderTime || "08:00",
              localize,
            );
            if (settings.streakNotificationsEnabled) {
              const completedSomethingToday = dailyLogs.some(
                (l) => l.date === getTodayString(),
              );
              await evaluateStreakRisk({
                streakNotificationsEnabled: true,
                streakCount: streak,
                completedSomethingToday,
                t,
              });
            }
          } else {
            Alert.alert(
              t("settings.notifPermissionTitle"),
              t("settings.notifPermissionMessage"),
              [
                { text: t("common.cancel"), style: "cancel" },
                {
                  text: t("settings.openSettings"),
                  onPress: () => Linking.openSettings(),
                },
              ],
            );
          }
        } else {
          updateSettings({ notificationsEnabled: false });
          await cancelDailyNotifications();
        }
      } finally {
        setPendingNotifications(null);
      }
    },
    [
      pendingNotifications,
      settings.reminderTime,
      settings.streakNotificationsEnabled,
      updateSettings,
      localize,
      t,
      dailyLogs,
      streak,
    ],
  );

  const handleStreakNotificationToggle = useCallback(
    async (v: boolean) => {
      if (pendingStreakNotifications !== null) return; // already mid-toggle

      setPendingStreakNotifications(v);
      try {
        if (v) {
          const status = await registerForPushNotificationsAsync();
          updateSettings({
            notificationsStatus: status,
            streakNotificationsEnabled: status === "granted",
          });

          if (status === "granted") {
            Haptic.success();
            const completedSomethingToday = dailyLogs.some(
              (l) => l.date === getTodayString(),
            );
            await evaluateStreakRisk({
              streakNotificationsEnabled: true,
              streakCount: streak,
              completedSomethingToday,
              t,
            });
          } else {
            Alert.alert(
              t("settings.notifPermissionTitle"),
              t("settings.streakNotifPermissionMessage"),
              [
                { text: t("common.cancel"), style: "cancel" },
                {
                  text: t("settings.openSettings"),
                  onPress: () => Linking.openSettings(),
                },
              ],
            );
          }
        } else {
          updateSettings({ streakNotificationsEnabled: false });
          await cancelStreakRiskNotification();
        }
      } finally {
        setPendingStreakNotifications(null);
      }
    },
    [pendingStreakNotifications, updateSettings, t, dailyLogs, streak],
  );

  const handleTimeChange = useCallback(
    async (event: any, selectedDate?: Date) => {
      if (selectedDate && event.type !== "dismissed") {
        const hours = String(selectedDate.getHours()).padStart(2, "0");
        const minutes = String(selectedDate.getMinutes()).padStart(2, "0");
        const timeStr = `${hours}:${minutes}`;

        updateSettings({ reminderTime: timeStr });

        if (notificationsActive) {
          await scheduleDailyNotifications(timeStr, localize);
        }
      }
    },
    [notificationsActive, updateSettings, localize],
  );

  const handleLanguageSelect = useCallback(
    async (nextLanguage: "en" | "ar") => {
      try {
        if (lang === nextLanguage) return;

        if (notificationsActive) {
          await cancelDailyNotifications();
        }
        if (streakNotificationsActive) {
          await cancelStreakRiskNotification();
        }

        await changeLanguage(nextLanguage);
      } catch (error) {
        console.error("Failed to change language:", error);
      }
    },
    [lang, notificationsActive, streakNotificationsActive, changeLanguage],
  );

  const handleExportData = useCallback(async () => {
    const data = {
      exportedAt: new Date().toISOString(),
      profile: settings.profile,
      activities: enabledActivities.map((a) => ({
        name: a.name,
        customNiyyahText: a.customNiyyahText,
      })),
      dailyLogs: dailyLogs.slice(-30),
      journalEntries: journalEntries.slice(-50),
      streak,
    };
    const json = JSON.stringify(data, null, 2);
    try {
      await Share.share({ title: t("settings.exportTitle"), message: json });
    } catch {
      Alert.alert(
        t("settings.exportFallbackTitle"),
        t("settings.exportFallbackMessage"),
      );
    }
  }, [settings.profile, enabledActivities, dailyLogs, journalEntries, streak, t]);

  const handleClearData = useCallback(async () => {
    await clearUserData();
    await clearAppData(() => storage.clearAll());
  }, []);

  const handleAnalyticsToggle = useCallback(
    (v: boolean) => {
      updateSettings({ analyticsEnabled: v });
      setAnalyticsEnabled(v);
    },
    [updateSettings],
  );

  return {
    settings,
    lang,
    updateSettings,
    notificationsActive,
    notificationsToggling: pendingNotifications !== null,
    streakNotificationsActive,
    streakNotificationsToggling: pendingStreakNotifications !== null,
    formattedReminderTime,
    toastMessage,
    animatedToastStyle,
    handleProfileToggle,
    handleNotificationToggle,
    handleStreakNotificationToggle,
    handleTimeChange,
    handleLanguageSelect,
    handleExportData,
    handleClearData,
    handleAnalyticsToggle,
    totalCompleted: dailyLogs.length,
    totalJournal: journalEntries.length,
    streak,
  };
}
