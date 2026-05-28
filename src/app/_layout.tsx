import i18n from "@i18n";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@components/ErrorBoundary";
import { ThemeProvider } from "@/context/ThemeContext";
import { useSettingsStore } from "@store/settingsStore";

SplashScreen.preventAutoHideAsync();

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

export default function RootLayout() {
  const [i18nReady, setI18nReady] = useState(false);
  const isLoading = useSettingsStore((s) => s.isLoading);

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
