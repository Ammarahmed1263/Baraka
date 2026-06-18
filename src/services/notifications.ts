import { DAILY_NOTIFICATIONS } from "@/data/notifications";
import { LocalizedString, NotificationPermissionStatus } from "@/types";
import { parseReminderTime } from "@/utils/parseReminderTime";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

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
      vibrationPattern: [0, 250, 250, 250], // [delay, vibrate, pause, vibrate, pause, ..]
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

export async function scheduleDailyNotification(
  time: string,
  localize: (key: LocalizedString) => string,
) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const randomMessage =
    DAILY_NOTIFICATIONS[Math.floor(Math.random() * DAILY_NOTIFICATIONS.length)];

  await Notifications.scheduleNotificationAsync({
    identifier: "daily-reminder",
    content: {
      title: localize(randomMessage.title),
      body: localize(randomMessage.body),
      sound: true,
      data: { screen: "/(tabs)" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      ...parseReminderTime(time),
    },
  });
}

export async function cancelDailyNotification() {
  await Notifications.cancelScheduledNotificationAsync("daily-reminder");
}
