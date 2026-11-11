import { NotificationPermissionStatus } from ".";

/**
 * Single catalog of every analytics event. `track()` only accepts names and
 * property shapes declared here, so a typo or an extra property fails
 * typecheck. Values must be primitives (ids, booleans, counts, enums). Never
 * add a field that could carry user-written text. The plan lives in
 * docs/analytics.md; do not add an event here that is not in it.
 */
type AnalyticsProps = Record<string, string | number | boolean>;

type PrimitivePropsOnly<T extends Record<string, AnalyticsProps>> = T;

/** How long a user-written intention is. Thresholds: docs/analytics.md. */
export type LengthBucket = "short" | "medium" | "long";

export type NotificationKind = "daily_reminder" | "streak_risk" | "other";

/** `widget` is reserved for when a home-screen widget ships; nothing sets it yet. */
export type EventSource = "app" | "notification" | "widget";

export type AnalyticsEventMap = PrimitivePropsOnly<{
  analytics_opted_in: {
    source: "sheet" | "settings";
  };
  niyyah_renewed: {
    activity_id: string;
    custom: boolean;
    niyyah_count: number;
    streak_length: number;
    source: EventSource;
  };
  intention_written: {
    activity_id: string;
    custom: boolean;
    length_bucket: LengthBucket;
  };
  custom_activity_created: Record<string, never>;
  sub_intention_created: {
    parent_custom: boolean;
  };
  journal_entry_saved: {
    activity_id: string;
    custom: boolean;
  };
  streak_broken: {
    previous_length: number;
  };
  notification_opened: {
    notification_kind: NotificationKind;
  };
}>;

/** Registered on every event via `register()` while the user is opted in. */
export type AnalyticsSuperProperties = {
  app_language: "ar" | "en";
  reminders_enabled: boolean;
  notification_permission: NotificationPermissionStatus;
};
