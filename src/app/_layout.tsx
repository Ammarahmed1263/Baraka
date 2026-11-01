import i18n, { needsRTLReload } from "@i18n";
import * as Sentry from "@sentry/react-native";

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
import { ErrorFallbackUI } from "@components/UI/ErrorFallbackUI";
import { useSettingsStore } from "@store/settingsStore";
import { getFreshDailyLogState } from "@hooks/db/useDailyLogs";
import {
  recheckAndRescheduleIfNeeded,
  evaluateStreakRisk,
} from "@/services/notifications";
import { useLocalize } from "@hooks/useLocalize";
import { useTranslation } from "react-i18next";
import { getAnonymousUserId, reloadApp } from "@/utils/device";
import { Platform } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { db, expoDb } from "@/db/db";
import { migrations } from "@/db/migrations";
import { seedIfNeeded } from "@/db/seed";
import { RootNavigator } from "@/navigation/RootNavigator";
import { initAnalytics } from "@lib/analytics";

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

  // console.* forwarding - must stay dev-only. In production this would ship
  // every unguarded console.log (journal/reflection text passes through some
  // of them) to Sentry as log events.
  enableLogs: __DEV__,

  replaysSessionSampleRate: __DEV__ ? 1.0 : 0.0,
  replaysOnErrorSampleRate: __DEV__ ? 1.0 : 0.1,
  // Explicit masking rather than relying on SDK defaults - this app stores
  // private journal/reflection text, and session replay must never capture it.
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllText: true,
      maskAllImages: true,
      maskAllVectors: true,
    }),
  ],

  spotlight: __DEV__,
});

function App() {
  useDrizzleStudio(__DEV__ ? expoDb : null);
  const [i18nReady, setI18nReady] = useState(false);
  const isLoading = useSettingsStore((s) => s.isLoading);
  const { success: migrationsSuccess, error: migrationsError } = useMigrations(
    db,
    migrations,
  );
  const [seedDone, setSeedDone] = useState(false);
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
    if (i18nReady && needsRTLReload) {
      reloadApp();
    }
  }, [i18nReady]);

  useEffect(() => {
    if (!migrationsSuccess || isLoading) return;

    let cancelled = false;
    seedIfNeeded()
      .catch(async (err) => {
        Sentry.captureException(err, {
          tags: { feature: "db" },
          extra: { phase: "seedIfNeeded" },
        });
        await Sentry.flush();
      })
      .finally(() => {
        if (!cancelled) setSeedDone(true);
      });

    return () => {
      cancelled = true;
    };
  }, [migrationsSuccess, isLoading]);

  // Wait for i18n, settings, migrations, and seeding to finish.
  // This prevents screens from firing queries before the DB tables exist.
  const appReady = i18nReady && !isLoading && migrationsSuccess && seedDone;

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
      recheckAndRescheduleIfNeeded(
        settings.reminderTime || "08:00",
        localize,
        settings.notificationsEnabled,
      );

      getFreshDailyLogState()
        .then(({ streak, completedSomethingToday }) =>
          evaluateStreakRisk({
            streakNotificationsEnabled: settings.streakNotificationsEnabled,
            streakCount: streak,
            completedSomethingToday,
            t,
          }),
        )
        .catch((error) =>
          Sentry.captureException(error, {
            tags: { feature: "notifications" },
            extra: { phase: "bootStreakRiskEvaluation" },
          }),
        );
    }
  }, [
    appReady,
    settings.reminderTime,
    settings.notificationsEnabled,
    settings.streakNotificationsEnabled,
    localize,
    t,
  ]);

  useEffect(() => {
    if (appReady) {
      Sentry.setUser({
        id: getAnonymousUserId(),
      });

      Sentry.setTag("language", i18n.language);
      Sentry.setTag("platform", Platform.OS);

      Sentry.setContext("app_config", {
        onboardingComplete: settings.onboardingComplete,
        notificationsEnabled: settings.notificationsEnabled,
        streakNotificationsEnabled: settings.streakNotificationsEnabled,
        notificationsStatus: settings.notificationsStatus,
        reminderTime: settings.reminderTime,
      });
    }
  }, [appReady]);

  useEffect(() => {
    if (appReady) {
      initAnalytics(settings.analyticsEnabled);
    }
  }, [appReady, settings.analyticsEnabled]);

  useEffect(() => {
    if (!migrationsError) return;
    Sentry.captureException(migrationsError, {
      tags: { feature: "db" },
      extra: { phase: "bootMigrations" },
    });
    // DB is unusable. Drop the splash screen immediately to show the error UI.
    SplashScreen.hideAsync();
  }, [migrationsError]);

  // Boot watchdog: If stuck on splash for 10s, report the exact loading flags to Sentry.
  useEffect(() => {
    if (appReady) return;
    const timeoutId = setTimeout(() => {
      if (appReady) return;
      Sentry.captureMessage("App boot watchdog timed out", {
        level: "warning",
        tags: { feature: "boot" },
        extra: { i18nReady, isLoading, migrationsSuccess, seedDone },
      });
    }, 10000);
    return () => clearTimeout(timeoutId);
  }, [appReady, i18nReady, isLoading, migrationsSuccess, seedDone]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider>
            <BottomSheetModalProvider>
              <ErrorBoundary>
                <I18nextProvider i18n={i18n}>
                  {migrationsError ? (
                    <ErrorFallbackUI
                      error={migrationsError}
                      onReset={reloadApp}
                      title={t("error.title")}
                      subtitle={t("error.message")}
                    />
                  ) : appReady ? (
                    <RootNavigator />
                  ) : null}
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
