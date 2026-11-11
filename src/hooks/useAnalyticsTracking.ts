import { useEffect, useState } from "react";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";
import { useSegments } from "expo-router";
import { useLanguage } from "@i18n";
import { useSettingsStore } from "@store";
import { getStreakBreakState } from "@hooks/db/useDailyLogs";
import {
  claimOnce,
  setSuperProperties,
  track,
  trackScreen,
} from "@lib/analytics";
import { getRoutePattern } from "@utils/routePattern";
import type { NotificationPermissionStatus } from "@types";

/** Root session orchestrator: mounts screen, super properties, and streak tracking. */
export function useAnalyticsTracking(appReady: boolean) {
  const analyticsEnabled = useSettingsStore((s) => s.settings.analyticsEnabled);
  useScreenTracking(appReady, analyticsEnabled);
  useSuperProperties(appReady);
  useStreakBrokenTracking(appReady, analyticsEnabled);
}

/** Tracks screen views using normalized route patterns (stripping group segments like "(tabs)"). */
function useScreenTracking(appReady: boolean, analyticsEnabled: boolean) {
  const segments = useSegments();
  const pattern = getRoutePattern(segments);

  // Tracks immediately when analytics becomes enabled mid-session.
  useEffect(() => {
    if (!appReady || !analyticsEnabled) return;
    trackScreen(pattern);
  }, [appReady, analyticsEnabled, pattern]);
}

/** Syncs super properties (language, reminders, real OS permissions) on startup and foregrounding. */
function useSuperProperties(appReady: boolean) {
  const { language } = useLanguage();
  const notificationsEnabled = useSettingsStore(
    (s) => s.settings.notificationsEnabled,
  );
  const storedStatus = useSettingsStore((s) => s.settings.notificationsStatus);
  const [permission, setPermission] =
    useState<NotificationPermissionStatus>(storedStatus);

  useEffect(() => {
    if (!appReady) return;
    let cancelled = false;
    const refresh = () => {
      Notifications.getPermissionsAsync()
        .then(({ status }) => {
          if (!cancelled) setPermission(status as NotificationPermissionStatus);
        })
        .catch(() => {});
    };
    refresh();
    // Re-checks OS permissions if reminders toggle changes.
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, [appReady, storedStatus]);

  const remindersEnabled = notificationsEnabled && permission === "granted";

  useEffect(() => {
    if (!appReady) return;
    setSuperProperties({
      app_language: language,
      reminders_enabled: remindersEnabled,
      notification_permission: permission,
    });
  }, [appReady, language, remindersEnabled, permission]);
}

/** Detects and tracks broken streaks on startup and foregrounding; deduplicated via claimOnce. */
function useStreakBrokenTracking(appReady: boolean, analyticsEnabled: boolean) {
  useEffect(() => {
    if (!appReady || !analyticsEnabled) return;

    const check = () => {
      getStreakBreakState()
        .then((streakBreak) => {
          if (!streakBreak) return;
          if (!claimOnce("streak_break", streakBreak.lastLogDate)) return;
          track("streak_broken", {
            previous_length: streakBreak.previousLength,
          });
        })
        .catch(() => {});
    };

    check();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") check();
    });
    return () => sub.remove();
  }, [appReady, analyticsEnabled]);
}
