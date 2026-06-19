import i18n from "@i18n";
import * as Sentry from '@sentry/react-native';
import { Stack, useNavigationContainerRef } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { isRunningInExpoGo } from "expo";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider } from "@/context/ThemeContext";
import { useNotifications } from "@/hooks/useNotifications";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { useSettingsStore } from "@store/settingsStore";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

// const navigationIntegration = Sentry.reactNavigationIntegration({
//   enableTimeToInitialDisplay: !isRunningInExpoGo(),
// });

Sentry.init({
  dsn: 'https://d67ecd69ea0ee09d4040e12083eb2c56@o4511592993390593.ingest.de.sentry.io/4511593155395664',

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
    }
  }, [i18nReady, isLoading]);

  if (!i18nReady || isLoading) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <I18nextProvider i18n={i18n}>
              <RootLayoutNav />
            </I18nextProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);