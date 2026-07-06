import { DAILY_NOTIFICATIONS } from "@/data/notifications";
import { LocalizedString, NotificationPermissionStatus } from "@/types";
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
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 400, 200, 400], // [delay, vibrate, pause, vibrate, pause, ..]
      lightColor: "#D4AF37",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

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
  const sequence: Array<typeof DAILY_NOTIFICATIONS[0]> = [];
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
      minute
    );

    const todayTrigger = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute
    );

    const baseDate = todayTrigger > now ? todayTrigger : startDate;
    for (let i = 0; i < MAX_SCHEDULED; i++) {
      const triggerDate = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() + i,
        hour,
        minute
      );

      const msg = messages[i];

      await Notifications.scheduleNotificationAsync({
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
      });
    }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { feature: 'notifications' },
      extra: { phase: 'scheduleDailyNotifications', reminderTime: time },
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

export async function recheckAndRescheduleIfNeeded(
  time: string,
  localize: (key: LocalizedString) => string,
  notificationsEnabled: boolean,
) {
  if (!notificationsEnabled) return;

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
      tags: { feature: 'notifications' },
      extra: { phase: 'recheckAndRescheduleIfNeeded' },
    });
    console.error("Failed to recheck notifications:", error);
  }
}
