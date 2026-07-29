import { useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { storage } from "@lib/storage";
import { useActivitiesStore } from "@store";
import { getTodayString } from "@utils/date";

const LAST_ACTIVE_DATE_KEY = "@niyyah_last_active_date";

function checkAndResetIfNewDay() {
  const today = getTodayString();
  const lastActiveDate = storage.getString(LAST_ACTIVE_DATE_KEY);

  if (lastActiveDate && lastActiveDate !== today) {
    useActivitiesStore.getState().resetDailySelections();
  }

  storage.set(LAST_ACTIVE_DATE_KEY, today);
}

export function useDayChange() {
  useEffect(() => {
    checkAndResetIfNewDay();

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        checkAndResetIfNewDay();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, []);
}
