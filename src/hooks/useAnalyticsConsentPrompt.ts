import { useCallback, useEffect, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSettingsStore } from "@store";
import { setAnalyticsEnabled } from "@lib/analytics";

export function useAnalyticsConsentPrompt(hasCompletedAny: boolean) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const onboardingComplete = useSettingsStore(
    (s) => s.settings.onboardingComplete,
  );
  const promptShown = useSettingsStore((s) => s.settings.analyticsPromptShown);
  const analyticsEnabled = useSettingsStore((s) => s.settings.analyticsEnabled);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  useEffect(() => {
    if (!onboardingComplete || promptShown || !hasCompletedAny) return;
    updateSettings({ analyticsPromptShown: true });
    if (!analyticsEnabled) sheetRef.current?.present();
  }, [
    onboardingComplete,
    promptShown,
    hasCompletedAny,
    analyticsEnabled,
    updateSettings,
  ]);

  const accept = useCallback(() => {
    updateSettings({ analyticsEnabled: true });
    setAnalyticsEnabled(true);
    sheetRef.current?.dismiss();
  }, [updateSettings]);

  const decline = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  return { sheetRef, accept, decline };
}
