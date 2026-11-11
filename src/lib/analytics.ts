import PostHog from "posthog-react-native";
import { AppState } from "react-native";
import { createMMKV } from "react-native-mmkv";
import { isCustomId } from "@utils/id";
import type {
  AnalyticsEventMap,
  AnalyticsSuperProperties,
  EventSource,
} from "@types";

const posthogStorage = createMMKV({ id: "posthog" });

let client: PostHog | null = null;
let consent = false;
let superProps: AnalyticsSuperProperties | null = null;

const SUPER_PROPERTY_KEYS: (keyof AnalyticsSuperProperties)[] = [
  "app_language",
  "reminders_enabled",
  "notification_permission",
];

function createClient(): PostHog | null {
  const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
  const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;
  if (!apiKey) return null;

  return new PostHog(apiKey, {
    host,
    disabled: __DEV__ && process.env.EXPO_PUBLIC_POSTHOG_DEBUG !== "true",
    defaultOptIn: false,
    captureAppLifecycleEvents: true,
    customStorage: {
      getItem: (key: string) => posthogStorage.getString(key) ?? null,
      setItem: (key: string, value: string) => posthogStorage.set(key, value),
    },
    enableSessionReplay: false,
    errorTracking: { autocapture: false },
    disableRemoteConfig: true,
    disableRemoteFeatureFlags: true,
    preloadFeatureFlags: false,
  });
}

/** Lazy singleton: initializes client on first use. */
function getClient(): PostHog | null {
  if (!client) client = createClient();
  return client;
}

/** Runs an async SDK call in the background without blocking the UI or throwing errors. */
function fireAndForget(promise: Promise<unknown> | undefined) {
  void promise?.catch(() => {});
}

/** Syncs tracking state with user consent and registers/clears super properties. */
function applyConsent(enabled: boolean) {
  const c = getClient();
  if (!c) return;
  consent = enabled;
  if (enabled) {
    fireAndForget(c.optIn());
    if (superProps) fireAndForget(c.register(superProps));
  } else {
    fireAndForget(c.optOut());
    // PostHog saves super properties to disk. Clear each key explicitly so nothing remains saved on disk.
    for (const key of SUPER_PROPERTY_KEYS) {
      fireAndForget(c.unregister(key));
    }
  }
}

/** Boot entry point: syncs client with persisted consent setting. */
export function initAnalytics(enabled: boolean) {
  applyConsent(enabled);
}

/** Enables tracking and records the opt-in event. */
export async function optInAnalytics(source: "sheet" | "settings") {
  const c = getClient();
  if (!c) return;
  try {
    await c.optIn();
  } catch {
    return;
  }
  consent = true;
  if (superProps) fireAndForget(c.register(superProps));
  track("analytics_opted_in", { source });
}

/** Flushes pending consented events and disables all future tracking. */
export async function optOutAnalytics() {
  const c = getClient();
  if (c) await c.flush().catch(() => {});
  applyConsent(false);
}

/** Wipes analytics state, opts out, and assigns a fresh anonymous ID. */
export async function resetAnalytics() {
  await optOutAnalytics();
  const c = getClient();
  if (!c) return;
  consent = false;
  superProps = null;
  c.reset();
  fireAndForget(c.optOut());
}

/** Masks custom activity IDs to protect user privacy. */
export function activityProps(activityId: string) {
  const custom = isCustomId(activityId);
  return { activity_id: custom ? "custom" : activityId, custom };
}

/** Dispatches a type-safe event to PostHog. */
export function track<E extends keyof AnalyticsEventMap>(
  event: E,
  properties: AnalyticsEventMap[E],
) {
  getClient()?.capture(event, properties);
}

/** Tracks screen views using route patterns (e.g. "/activity/[id]"). */
export function trackScreen(routePattern: string) {
  fireAndForget(getClient()?.screen(routePattern));
}

/** Registers global properties attached to every event when opted in. */
export function setSuperProperties(props: AnalyticsSuperProperties) {
  superProps = props;
  if (consent) fireAndForget(getClient()?.register(props));
}

// --- Session source attribution ---------------------------------------------

let sessionSource: EventSource = "app";

/** Marks session source as notification until app is backgrounded. */
export function markNotificationSession() {
  sessionSource = "notification";
}

export function getSessionSource(): EventSource {
  return sessionSource;
}

AppState.addEventListener("change", (state) => {
  if (state === "background") sessionSource = "app";
});

// --- Once-only guards -------------------------------------------------------

/** Deduplicates one-time events (e.g. notifications, streak breaks) across app restarts. */
export function claimOnce(
  slot: "streak_break" | "notification_open",
  key: string,
): boolean {
  const storageKey = `baraka_claimed:${slot}`;
  if (posthogStorage.getString(storageKey) === key) return false;
  posthogStorage.set(storageKey, key);
  return true;
}
