import i18n from "@i18n";
import * as Sentry from "@sentry/react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";

import { ThemeProvider } from "@/context/ThemeContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useNotifications } from "@/hooks/useNotifications";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { useSettingsStore } from "@store/settingsStore";
import { useLogsStore } from "@store/logsStore";
import { getTodayString } from "@utils/date";
import {
  recheckAndRescheduleIfNeeded,
  evaluateStreakRisk,
} from "@/services/notifications";
import { useLocalize } from "@hooks/useLocalize";
import { useTranslation } from "react-i18next";
import { getAnonymousUserId } from "@/utils/device";
import { Platform } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: __DEV__ ? "development" : "production",

  sendDefaultPii: false,

  enableLogs: true,

  replaysSessionSampleRate: __DEV__ ? 1.0 : 0.0,
  replaysOnErrorSampleRate: __DEV__ ? 1.0 : 0.1,
  integrations: [Sentry.mobileReplayIntegration()],

  spotlight: __DEV__,
});

function RootLayoutNav() {
  const onboardingComplete = useSettingsStore(
    (s) => s.settings.onboardingComplete,
  );

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={onboardingComplete}>
        <Stack.Screen name='(tabs)' options={{ animation: "none" }} />
        <Stack.Screen
          name='activity/[id]'
          options={{ presentation: "modal" }}
        />
        <Stack.Screen name='learn/[id]' options={{ presentation: "card" }} />
      </Stack.Protected>

      <Stack.Protected guard={!onboardingComplete}>
        <Stack.Screen name='onboarding' options={{ gestureEnabled: false }} />
      </Stack.Protected>
    </Stack>
  );
}

function App() {
  const [i18nReady, setI18nReady] = useState(false);
  const isLoading = useSettingsStore((s) => s.isLoading);
  const settings = useSettingsStore((s) => s.settings);
  const localize = useLocalize();
  const { t } = useTranslation();
  useNotifications();

  useEffect(() => {
    if (i18n.isInitialized) {
      setI18nReady(true);
      return;
    }

    const onInit = () => setI18nReady(true);
    i18n.on("initialized", onInit);
    return () => i18n.off("initialized", onInit);
  }, []);

  useEffect(() => {
    if (i18nReady && !isLoading) {
      SplashScreen.hideAsync();
      recheckAndRescheduleIfNeeded(
        settings.reminderTime || "08:00",
        localize,
        settings.notificationsEnabled,
      );

      const logsState = useLogsStore.getState();
      logsState.recomputeStreak();
      const freshStreak = useLogsStore.getState().streak;
      const today = getTodayString();
      const completedSomethingToday = useLogsStore
        .getState()
        .dailyLogs.some((l) => l.date === today);

      evaluateStreakRisk({
        notificationsEnabled: settings.notificationsEnabled,
        streakCount: freshStreak,
        completedSomethingToday,
        t,
      });
    }
  }, [
    i18nReady,
    isLoading,
    settings.reminderTime,
    settings.notificationsEnabled,
    localize,
    t,
  ]);

  useEffect(() => {
    if (i18nReady && !isLoading) {
      Sentry.setUser({
        id: getAnonymousUserId(),
      });

      Sentry.setTag("language", i18n.language);
      Sentry.setTag("platform", Platform.OS);

      Sentry.setContext("app_config", {
        onboardingComplete: settings.onboardingComplete,
        notificationsEnabled: settings.notificationsEnabled,
        notificationsStatus: settings.notificationsStatus,
        reminderTime: settings.reminderTime,
      });
    }
  }, [i18nReady, isLoading]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider>
            <BottomSheetModalProvider>
              <ErrorBoundary>
                <I18nextProvider i18n={i18n}>
                  <RootLayoutNav />
                </I18nextProvider>
              </ErrorBoundary>
            </BottomSheetModalProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
