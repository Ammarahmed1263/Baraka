import { useEffect } from "react";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";
import { useSettingsStore } from "@store";
import type { NotificationPermissionStatus } from "@types";

/**
 * Keeps `settings.notificationsStatus` equal to the real OS permission.
 *
 * The stored copy is only written when the user flips the reminders toggle, so
 * it goes stale whenever the OS permission changes behind the app's back: the
 * user revokes it in system settings, or the app is reinstalled and the device
 * keeps or restores its data (settings say "granted", the OS says no). Reading
 * the OS value on start and on every return to the foreground makes the
 * Settings toggle and the reminder scheduling follow reality.
 */
export function useSyncNotificationPermission(appReady: boolean) {
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  useEffect(() => {
    if (!appReady) return;
    let cancelled = false;

    const sync = () => {
      Notifications.getPermissionsAsync()
        .then(({ status }) => {
          if (cancelled) return;
          const current = useSettingsStore.getState().settings
            .notificationsStatus;
          if (status !== current) {
            updateSettings({
              notificationsStatus: status as NotificationPermissionStatus,
            });
          }
        })
        .catch(() => {});
    };

    sync();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") sync();
    });
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, [appReady, updateSettings]);
}
