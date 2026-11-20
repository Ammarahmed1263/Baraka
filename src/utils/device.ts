import { storage } from "@/lib/storage";
import { Appearance, DevSettings } from "react-native";
import * as Updates from "expo-updates";
import { useSettingsStore } from "@store/settingsStore";
import Colors from "@constants/colors";
import * as Sentry from "@sentry/react-native";

export function getAnonymousUserId(): string {
  const existing = storage.getString("@niyyah_anonymous_user_id");

  if (existing) return existing;

  const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
  storage.set("@niyyah_anonymous_user_id", id);
  return id;
}

let isReloading = false;

function getReloadScreenOptions(): Updates.ReloadScreenOptions {
  const preference = useSettingsStore.getState().settings.darkMode;
  const scheme = preference === "auto" ? Appearance.getColorScheme() : preference;
  const colors = scheme === "dark" ? Colors.dark : Colors.light;

  return {
    backgroundColor: colors.background,
    spinner: { enabled: false },
    fade: true,
  };
}

// Resolves false if the reload could not start, so callers can carry on.
export const reloadApp = async (): Promise<boolean> => {
  if (isReloading) return true;
  isReloading = true;

  try {
    if (__DEV__) {
      DevSettings.reload();
    } else {
      await Updates.reloadAsync({ reloadScreenOptions: getReloadScreenOptions() });
    }
    return true;
  } catch (error) {
    isReloading = false;
    Sentry.captureException(error, { tags: { feature: "reload" } });
    return false;
  }
};
