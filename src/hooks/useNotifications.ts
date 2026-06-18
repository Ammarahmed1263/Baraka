import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useState } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  // const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  useEffect(() => {
    // registerForPushNotificationsAsync().then((token) => {
    //   if (token) setExpoPushToken(token);
    // });

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
        setNotification(notification);
      },
    );

    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      const screen = response.notification.request.content.data?.screen;
      if (screen) router.push(screen as any);
    }

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User interacted with notification:", response);

        const screen = response.notification.request.content.data?.screen;
        if (screen) router.push(screen as any);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return {
    // expoPushToken,
    notification,
  };
}
