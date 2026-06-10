import * as ExpoHaptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * A centralized haptics dictionary to ensure consistent tactile feedback across the app.
 * By wrapping expo-haptics, we can easily add a global "disable haptics" setting later if needed.
 */
export const Haptic = {
  /**
   * Use for small, non-destructive interactions (e.g., toggling a switch, tapping a small icon).
   */
  lightTap: async () => {
    if (Platform.OS === "web") return;
    await ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light);
  },

  /**
   * Use for selecting items, navigating tabs, or changing filter states.
   */
  selection: async () => {
    if (Platform.OS === "web") return;
    await ExpoHaptics.selectionAsync();
  },

  /**
   * Use for successfully completing a meaningful action (e.g., saving a journal, completing an activity).
   */
  success: async () => {
    if (Platform.OS === "web") return;
    await ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success);
  },

  /**
   * Use for destructive actions or important alerts.
   */
  warning: async () => {
    if (Platform.OS === "web") return;
    await ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning);
  },

  /**
   * Use for errors or failed actions.
   */
  error: async () => {
    if (Platform.OS === "web") return;
    await ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error);
  },
};
