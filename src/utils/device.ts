import { storage } from "@/lib/storage";
import { DevSettings } from "react-native";
import * as Updates from "expo-updates";

export function getAnonymousUserId(): string {
  const existing = storage.getString("@niyyah_anonymous_user_id");

  if (existing) return existing;

  const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
  storage.set("@niyyah_anonymous_user_id", id);
  return id;
}

let isReloading = false;

export const reloadApp = async () => {
  if (isReloading) return;
  isReloading = true;

  try {
    if (__DEV__) {
      DevSettings.reload();
    } else {
      await Updates.reloadAsync();
    }
  } catch {}
};
