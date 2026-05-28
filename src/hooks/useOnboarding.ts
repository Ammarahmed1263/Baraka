import { useSettingsStore } from "@store/settingsStore";

export function useOnboarding() {
  const complete = () => {
    useSettingsStore.getState().updateSettings({ onboardingComplete: true });
  };

  return { complete };
}
