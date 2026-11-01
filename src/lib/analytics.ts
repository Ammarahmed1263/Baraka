import PostHog from "posthog-react-native";
import { createMMKV } from "react-native-mmkv";
import { getAnonymousUserId } from "@/utils/device";

const posthogStorage = createMMKV({ id: "posthog" });

let client: PostHog | null = null;

function createClient(): PostHog | null {
  const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
  const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;
  if (!apiKey) return null;

  return new PostHog(apiKey, {
    host,
    disabled: __DEV__ && process.env.EXPO_PUBLIC_POSTHOG_DEBUG !== "true",
    defaultOptIn: false,
    customStorage: {
      getItem: (key: string) => posthogStorage.getString(key) ?? null,
      setItem: (key: string, value: string) => posthogStorage.set(key, value),
    },
    enableSessionReplay: false,
    errorTracking: { autocapture: false },
  });
}

export function initAnalytics(enabled: boolean) {
  if (!client) {
    client = createClient();
    if (!client) return;
    client.identify(getAnonymousUserId());
  }
  setAnalyticsEnabled(enabled);
}

export function setAnalyticsEnabled(enabled: boolean) {
  if (!client) return;
  if (enabled) {
    client.optIn();
  } else {
    client.optOut();
  }
}

export function activityProps(activityId: string) {
  const custom = activityId.startsWith("custom_");
  return { activity_id: custom ? "custom" : activityId, custom };
}

export function track(
  event: string,
  properties?: Record<string, string | number | boolean>,
) {
  client?.capture(event, properties);
}
