import * as Notifications from "expo-notifications";
import { router, useRootNavigationState, type Href } from "expo-router";
import { useEffect, useRef } from "react";

export function useNotifications(): void {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const rootNavigationState = useRootNavigationState();
  const isNavigationReady = !!rootNavigationState?.key;

  const isNavigationReadyRef = useRef(isNavigationReady);
  useEffect(() => {
    isNavigationReadyRef.current = isNavigationReady;
  }, [isNavigationReady]);
  const handledResponseIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      isNavigationReady &&
      lastNotificationResponse?.notification &&
      lastNotificationResponse.notification.request.identifier !==
        handledResponseIdRef.current
    ) {
      handledResponseIdRef.current =
        lastNotificationResponse.notification.request.identifier;
      const screen = lastNotificationResponse.notification.request.content.data
        ?.screen as Href | undefined;

      if (screen) {
        router.navigate(screen);
      }
    }
  }, [lastNotificationResponse, isNavigationReady]);

  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        if (__DEV__) {
          console.log("Notification received:", notification);
        }
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (__DEV__) {
          console.log("User interacted with notification:", response);
        }

        const screen = response.notification.request.content.data?.screen as
          | Href
          | undefined;
        if (screen && isNavigationReadyRef.current) {
          router.navigate(screen);
        }
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);
}
