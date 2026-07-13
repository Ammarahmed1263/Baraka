import i18n from "@i18n";
import * as Sentry from "@sentry/react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider } from "@/context/ThemeContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useNotifications } from "@/hooks/useNotifications";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { useSettingsStore } from "@store/settingsStore";
import { recheckAndRescheduleIfNeeded } from "@/services/notifications";
import { useLocalize } from "@hooks/useLocalize";
import { getAnonymousUserId } from "@/utils/device";
import { Platform } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

// const navigationIntegration = Sentry.reactNavigationIntegration({
//   enableTimeToInitialDisplay: !isRunningInExpoGo(),
// });

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: __DEV__ ? "development" : "production",

  sendDefaultPii: true,

  enableLogs: true,

  // Performance Monitoring
  // tracesSampleRate: __DEV__ ? 1.0 : 0.05, // Capture 100% of transactions (lower this in production)
  // integrations: [navigationIntegration],
  // enableNativeFramesTracking: !isRunningInExpoGo(),

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  spotlight: __DEV__,
});

function RootLayoutNav() {
  const onboardingComplete = useSettingsStore(
    (s) => s.settings.onboardingComplete,
  );

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={onboardingComplete}>
        <Stack.Screen name='(tabs)' />
        <Stack.Screen
          name='activity/[id]'
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name='learn/[id]'
          options={{ presentation: "card" }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!onboardingComplete}>
        <Stack.Screen name='onboarding' options={{ gestureEnabled: false }} />
      </Stack.Protected>
    </Stack>
  );
}

function App() {
  // const ref = useNavigationContainerRef();
  const [i18nReady, setI18nReady] = useState(false);
  const isLoading = useSettingsStore((s) => s.isLoading);
  const settings = useSettingsStore((s) => s.settings);
  const localize = useLocalize();
  useNotifications();

  // useEffect(() => {
  //   if (ref) {
  //     navigationIntegration.registerNavigationContainer(ref);
  //   }
  // }, [ref]);

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

  if (!i18nReady || isLoading) return null;

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
