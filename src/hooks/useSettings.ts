import { useMemo, useCallback } from "react";
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
} from "@/services/notifications";
import {
  useActivitiesStore,
  useJournalStore,
  useLogsStore,
  useSettingsStore,
} from "@store";
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

  // Stores
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const activities = useActivitiesStore((s) => s.activities);
  const dailyLogs = useLogsStore((s) => s.dailyLogs);
  const streak = useLogsStore((s) => s.streak);
  const journalEntries = useJournalStore((s) => s.journalEntries);

  // Derived toast
  const { toastMessage, showToast, animatedToastStyle } = useToast();

  // Derived notification state
  const notificationsActive = useMemo(
    () =>
      settings.notificationsEnabled &&
      settings.notificationsStatus === "granted",
    [settings.notificationsEnabled, settings.notificationsStatus],
  );

  // Formatting reminder time
  const formattedReminderTime = useMemo(() => {
    const timeStr = settings.reminderTime || "08:00";
    const { hour, minute } = parseReminderTime(timeStr);
    const ampm =
      hour >= 12 ? (lang === "ar" ? "م" : "PM") : lang === "ar" ? "ص" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = String(minute).padStart(2, "0");
    return `${displayHour}:${displayMinute} ${ampm}`;
  }, [settings.reminderTime, lang]);

  // Handlers
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
    },
    [settings.reminderTime, updateSettings, localize, t],
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

        await changeLanguage(nextLanguage);
      } catch (error) {
        console.error("Failed to change language:", error);
      }
    },
    [lang, notificationsActive, changeLanguage],
  );

  const handleExportData = useCallback(async () => {
    const data = {
      exportedAt: new Date().toISOString(),
      profile: settings.profile,
      activities: activities
        .filter((a) => a.enabled)
        .map((a) => ({
          name: a.name,
          enabled: a.enabled,
          customNiyyah: a.customNiyyah,
          selectedNiyyahIds: a.selectedNiyyahIds,
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
  }, [settings.profile, activities, dailyLogs, journalEntries, streak, t]);

  const handleClearData = useCallback(async () => {
    await clearAppData(() => storage.clearAll());
  }, []);

  return {
    settings,
    lang,
    updateSettings,
    notificationsActive,
    formattedReminderTime,
    toastMessage,
    animatedToastStyle,
    handleProfileToggle,
    handleNotificationToggle,
    handleTimeChange,
    handleLanguageSelect,
    handleExportData,
    handleClearData,
    totalCompleted: dailyLogs.length,
    totalJournal: journalEntries.length,
    streak,
  };
}
