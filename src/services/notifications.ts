import { DAILY_NOTIFICATIONS } from "@/data/notifications";
import {
  LocalizedString,
  NotificationKind,
  NotificationPermissionStatus,
} from "@/types";
import { parseReminderTime } from "@/utils/parseReminderTime";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Sentry from "@sentry/react-native";

function handleRegistrationError(errorMessage: string) {
  // alert(errorMessage);
  console.log(errorMessage);
  // throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync(): Promise<NotificationPermissionStatus> {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 400, 200, 400], // [delay, vibrate, pause, vibrate, pause, ..]
        lightColor: "#D4AF37",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    if (existingStatus === "granted") return "granted";
    if (existingStatus === "denied" && Platform.OS === "ios") return "denied";

    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      handleRegistrationError("Permission not granted for push notifications.");
    }

    //  TODO: uncomment to enable Expo server (remote) push notifications
    // if (status === "granted") {
    //   const projectId =
    //     Constants?.expoConfig?.extra?.eas?.projectId ??
    //     Constants?.easConfig?.projectId;
    //   if (!projectId) {
    //     handleRegistrationError("Project ID not found");
    //     return status as NotificationPermissionStatus;
    //   }
    //   try {
    //     const pushTokenString = (
    //       await Notifications.getExpoPushTokenAsync({ projectId })
    //     ).data;
    //     console.log("Expo push token:", pushTokenString);
    //     // TODO: send pushTokenString to your backend here
    //   } catch (e: unknown) {
    //     handleRegistrationError(`Failed to get push token: ${e}`);
    //   }
    // }

    return status as NotificationPermissionStatus;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { feature: "notifications" },
      extra: { phase: "registerForPushNotificationsAsync" },
    });
    console.error("Failed to register for push notifications:", error);
    return "denied";
  }
}

const NOTIFICATION_IDENTIFIER_PREFIX = "daily-reminder";
const MAX_SCHEDULED = 30;
const RESCHEDULE_THRESHOLD = 14;

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildMessageSequence(count: number) {
  const sequence: Array<(typeof DAILY_NOTIFICATIONS)[0]> = [];
  while (sequence.length < count) {
    sequence.push(...shuffleArray(DAILY_NOTIFICATIONS));
  }
  return sequence.slice(0, count);
}

export async function scheduleDailyNotifications(
  time: string,
  localize: (key: LocalizedString) => string,
) {
  try {
    await cancelDailyNotifications();

    const { hour, minute } = parseReminderTime(time);
    const messages = buildMessageSequence(MAX_SCHEDULED);

    const now = new Date();

    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      hour,
      minute,
    );

    const todayTrigger = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
    );

    const baseDate = todayTrigger > now ? todayTrigger : startDate;
    const promises = [];
    for (let i = 0; i < MAX_SCHEDULED; i++) {
      const triggerDate = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + i,
        hour,
        minute,
      );

      const msg = messages[i];

      promises.push(
        Notifications.scheduleNotificationAsync({
          identifier: `${NOTIFICATION_IDENTIFIER_PREFIX}-${i}`,
          content: {
            title: localize(msg.title),
            body: localize(msg.body),
            sound: true,
            data: { screen: "/(tabs)" },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
          },
        }),
      );
    }

    await Promise.all(promises);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { feature: "notifications" },
      extra: { phase: "scheduleDailyNotifications", reminderTime: time },
    });
    console.error("Failed to schedule daily notifications:", error);
  }
}

export async function cancelDailyNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const ours = scheduled.filter((n) =>
    n.identifier.startsWith(NOTIFICATION_IDENTIFIER_PREFIX),
  );
  await Promise.all(
    ours.map((n) =>
      Notifications.cancelScheduledNotificationAsync(n.identifier),
    ),
  );
}

const STREAK_RISK_IDENTIFIER = "streak-risk";
const STREAK_RISK_HOUR = 21; // 9 PM local device time — separate concern from the user's chosen daily reminderTime

/** Maps a scheduled notification identifier to the kind we report to analytics. */
export function getNotificationKind(identifier: string): NotificationKind {
  if (identifier.startsWith(NOTIFICATION_IDENTIFIER_PREFIX)) return "daily_reminder";
  if (identifier === STREAK_RISK_IDENTIFIER) return "streak_risk";
  return "other";
}

export async function scheduleStreakRiskNotification(
  streakCount: number,
  t: (key: string, options?: Record<string, unknown>) => string,
  daysAhead: number = 0,
) {
  try {
    await cancelStreakRiskNotification();

    const now = new Date();
    let triggerDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysAhead,
      STREAK_RISK_HOUR,
      0,
    );

    if (daysAhead === 0 && triggerDate <= now) {
      triggerDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        STREAK_RISK_HOUR,
        0,
      );
    }

    await Notifications.scheduleNotificationAsync({
      identifier: STREAK_RISK_IDENTIFIER,
      content: {
        title: t("notifications.streakRiskTitle"),
        body: t("notifications.streakRiskBody", { count: streakCount }),
        sound: true,
        data: { screen: "/(tabs)" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { feature: "notifications" },
      extra: { phase: "scheduleStreakRiskNotification", streakCount },
    });
    console.error("Failed to schedule streak-risk notification:", error);
  }
}

export async function cancelStreakRiskNotification() {
  try {
    await Notifications.cancelScheduledNotificationAsync(
      STREAK_RISK_IDENTIFIER,
    );
  } catch {
    // no-op — nothing was scheduled, which is a valid state, not an error
  }
}

/**
 * Central decision point for whether a streak-risk notification should exist
 * right now. Call this after anything that could change the answer: app
 * boot, marking/unmarking an activity complete, or toggling notifications.
 *
 * Keeps the reminder armed one day ahead: completing something today clears
 * today's risk but guarantees tomorrow's, so we re-arm for tomorrow rather
 * than cancelling outright. Without this the notification would only ever be
 * (re)scheduled while the app is open, so a user who completes an activity and
 * then never reopens the app would silently lose their streak reminder.
 */

interface EvaluateStreakRiskParams {
  streakNotificationsEnabled: boolean;
  streakCount: number;
  completedSomethingToday: boolean;
  t: (key: string, options?: Record<string, unknown>) => string;
}

export async function evaluateStreakRisk({
  streakNotificationsEnabled,
  streakCount,
  completedSomethingToday,
  t,
}: EvaluateStreakRiskParams) {
  if (!streakNotificationsEnabled || streakCount < 1) {
    await cancelStreakRiskNotification();
    return;
  }

  await scheduleStreakRiskNotification(
    streakCount,
    t,
    completedSomethingToday ? 1 : 0,
  );
}

export async function recheckAndRescheduleIfNeeded(
  time: string,
  localize: (key: LocalizedString) => string,
  notificationsEnabled: boolean,
) {
  if (!notificationsEnabled) {
    await cancelDailyNotifications();
    return;
  }

  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const ours = scheduled.filter((n) =>
      n.identifier.startsWith(NOTIFICATION_IDENTIFIER_PREFIX),
    );

    if (ours.length < RESCHEDULE_THRESHOLD) {
      await scheduleDailyNotifications(time, localize);
    }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { feature: "notifications" },
      extra: { phase: "recheckAndRescheduleIfNeeded" },
    });
    console.error("Failed to recheck notifications:", error);
  }
}
