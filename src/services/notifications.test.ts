import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  registerForPushNotificationsAsync,
  scheduleDailyNotifications,
  cancelDailyNotifications,
  scheduleStreakRiskNotification,
  cancelStreakRiskNotification,
  evaluateStreakRisk,
  recheckAndRescheduleIfNeeded,
  getNotificationKind,
} from "./notifications";

jest.mock("@sentry/react-native", () => ({
  captureException: jest.fn(),
}));

jest.mock("expo-notifications", () => ({
  AndroidImportance: { MAX: 5 },
  SchedulableTriggerInputTypes: { DATE: "date" },
  setNotificationChannelAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(),
}));

const localize = (l: { en: string; ar: string }) => l.en;
const t = (key: string, options?: Record<string, unknown>) =>
  options?.count !== undefined ? `${key}:${options.count}` : key;

describe("registerForPushNotificationsAsync", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (Platform as { OS: string }).OS = "ios";
  });

  it("returns granted without prompting when already granted", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });

    const result = await registerForPushNotificationsAsync();

    expect(result).toBe("granted");
    expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
  });

  it("returns denied on iOS without re-prompting when already denied", async () => {
    (Platform as { OS: string }).OS = "ios";
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });

    const result = await registerForPushNotificationsAsync();

    expect(result).toBe("denied");
    expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
  });

  it("prompts when status is undetermined and returns the prompt result", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "undetermined",
    });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });

    const result = await registerForPushNotificationsAsync();

    expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    expect(result).toBe("granted");
  });

  it("sets up the Android notification channel on Android only", async () => {
    (Platform as { OS: string }).OS = "android";
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });

    await registerForPushNotificationsAsync();

    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
      "default",
      expect.any(Object),
    );
  });

  it("returns denied and does not throw if the OS call rejects", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (Notifications.getPermissionsAsync as jest.Mock).mockRejectedValue(
      new Error("boom"),
    );

    const result = await registerForPushNotificationsAsync();

    expect(result).toBe("denied");
    consoleSpy.mockRestore();
  });
});

describe("scheduleDailyNotifications", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (Notifications.getAllScheduledNotificationsAsync as jest.Mock).mockResolvedValue(
      [],
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("schedules exactly 30 notifications with sequential daily-reminder ids", async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 15, 6, 0));

    await scheduleDailyNotifications("08:00", localize);

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(30);
    const identifiers = (
      Notifications.scheduleNotificationAsync as jest.Mock
    ).mock.calls.map((call) => call[0].identifier);
    expect(identifiers).toEqual(
      Array.from({ length: 30 }, (_, i) => `daily-reminder-${i}`),
    );
  });

  it("cancels any existing daily reminders before scheduling new ones", async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 15, 6, 0));
    (Notifications.getAllScheduledNotificationsAsync as jest.Mock).mockResolvedValue(
      [{ identifier: "daily-reminder-3" }, { identifier: "streak-risk" }],
    );

    await scheduleDailyNotifications("08:00", localize);

    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      "daily-reminder-3",
    );
    expect(Notifications.cancelScheduledNotificationAsync).not.toHaveBeenCalledWith(
      "streak-risk",
    );
  });

  it("schedules the first reminder for today when the reminder time hasn't passed yet", async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 15, 6, 0));

    await scheduleDailyNotifications("08:00", localize);

    const firstTrigger = (Notifications.scheduleNotificationAsync as jest.Mock)
      .mock.calls[0][0].trigger.date as Date;
    expect(firstTrigger.getDate()).toBe(15);
    expect(firstTrigger.getHours()).toBe(8);
  });

  it("schedules the first reminder for tomorrow when today's reminder time has already passed", async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 15, 9, 0));

    await scheduleDailyNotifications("08:00", localize);

    const firstTrigger = (Notifications.scheduleNotificationAsync as jest.Mock)
      .mock.calls[0][0].trigger.date as Date;
    expect(firstTrigger.getDate()).toBe(16);
    expect(firstTrigger.getHours()).toBe(8);
  });

  it("localizes each notification's title and body via the given function", async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 15, 6, 0));

    await scheduleDailyNotifications("08:00", localize);

    const content = (Notifications.scheduleNotificationAsync as jest.Mock).mock
      .calls[0][0].content;
    expect(typeof content.title).toBe("string");
    expect(typeof content.body).toBe("string");
  });

  it("does not throw if the underlying schedule call rejects", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 15, 6, 0));
    (Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValue(
      new Error("boom"),
    );

    await expect(
      scheduleDailyNotifications("08:00", localize),
    ).resolves.not.toThrow();
    consoleSpy.mockRestore();
  });
});

describe("cancelDailyNotifications", () => {
  beforeEach(() => jest.resetAllMocks());

  it("only cancels notifications with the daily-reminder prefix", async () => {
    (Notifications.getAllScheduledNotificationsAsync as jest.Mock).mockResolvedValue(
      [
        { identifier: "daily-reminder-0" },
        { identifier: "daily-reminder-1" },
        { identifier: "streak-risk" },
      ],
    );

    await cancelDailyNotifications();

    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledTimes(
      2,
    );
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      "daily-reminder-0",
    );
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      "daily-reminder-1",
    );
  });
});

describe("scheduleStreakRiskNotification", () => {
  beforeEach(() => jest.resetAllMocks());
  afterEach(() => jest.useRealTimers());

  it("arms for 9 PM today when daysAhead is 0 and 9 PM hasn't passed yet", async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 15, 18, 0));

    await scheduleStreakRiskNotification(3, t, 0);

    const call = (Notifications.scheduleNotificationAsync as jest.Mock).mock
      .calls[0][0];
    expect(call.identifier).toBe("streak-risk");
    const date = call.trigger.date as Date;
    expect(date.getDate()).toBe(15);
    expect(date.getHours()).toBe(21);
  });

  it("rolls over to tomorrow's 9 PM when daysAhead is 0 but 9 PM has already passed", async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 15, 22, 0));

    await scheduleStreakRiskNotification(3, t, 0);

    const date = (Notifications.scheduleNotificationAsync as jest.Mock).mock
      .calls[0][0].trigger.date as Date;
    expect(date.getDate()).toBe(16);
    expect(date.getHours()).toBe(21);
  });

  it("arms for tomorrow's 9 PM when daysAhead is 1, regardless of current time", async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 15, 6, 0));

    await scheduleStreakRiskNotification(3, t, 1);

    const date = (Notifications.scheduleNotificationAsync as jest.Mock).mock
      .calls[0][0].trigger.date as Date;
    expect(date.getDate()).toBe(16);
    expect(date.getHours()).toBe(21);
  });

  it("cancels any existing streak-risk notification before scheduling", async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 15, 6, 0));

    await scheduleStreakRiskNotification(3, t, 0);

    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      "streak-risk",
    );
  });

  it("includes the streak count in the localized body", async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 15, 6, 0));

    await scheduleStreakRiskNotification(5, t, 0);

    const content = (Notifications.scheduleNotificationAsync as jest.Mock).mock
      .calls[0][0].content;
    expect(content.body).toBe("notifications.streakRiskBody:5");
  });
});

describe("cancelStreakRiskNotification", () => {
  beforeEach(() => jest.resetAllMocks());

  it("does not throw when nothing is scheduled", async () => {
    (Notifications.cancelScheduledNotificationAsync as jest.Mock).mockRejectedValue(
      new Error("nothing scheduled"),
    );

    await expect(cancelStreakRiskNotification()).resolves.not.toThrow();
  });
});

describe("evaluateStreakRisk", () => {
  beforeEach(() => jest.resetAllMocks());

  it("cancels instead of scheduling when streak notifications are disabled", async () => {
    await evaluateStreakRisk({
      streakNotificationsEnabled: false,
      streakCount: 5,
      completedSomethingToday: false,
      t,
    });

    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      "streak-risk",
    );
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it("cancels instead of scheduling when the streak is below 1", async () => {
    await evaluateStreakRisk({
      streakNotificationsEnabled: true,
      streakCount: 0,
      completedSomethingToday: false,
      t,
    });

    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      "streak-risk",
    );
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it("arms for today (daysAhead 0) when enabled, streak >= 1, and nothing completed today", async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 15, 6, 0));

    await evaluateStreakRisk({
      streakNotificationsEnabled: true,
      streakCount: 2,
      completedSomethingToday: false,
      t,
    });

    const date = (Notifications.scheduleNotificationAsync as jest.Mock).mock
      .calls[0][0].trigger.date as Date;
    expect(date.getDate()).toBe(15);

    jest.useRealTimers();
  });

  it("arms for tomorrow (daysAhead 1) when enabled, streak >= 1, and today is already completed", async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 15, 6, 0));

    await evaluateStreakRisk({
      streakNotificationsEnabled: true,
      streakCount: 2,
      completedSomethingToday: true,
      t,
    });

    const date = (Notifications.scheduleNotificationAsync as jest.Mock).mock
      .calls[0][0].trigger.date as Date;
    expect(date.getDate()).toBe(16);

    jest.useRealTimers();
  });
});

describe("recheckAndRescheduleIfNeeded", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 15, 6, 0));
  });
  afterEach(() => jest.useRealTimers());

  it("cancels the daily batch and does not reschedule when notifications are disabled", async () => {
    (Notifications.getAllScheduledNotificationsAsync as jest.Mock).mockResolvedValue(
      [{ identifier: "daily-reminder-0" }],
    );

    await recheckAndRescheduleIfNeeded("08:00", localize, false);

    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      "daily-reminder-0",
    );
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it("tops the batch back up to 30 when fewer than 14 daily reminders remain", async () => {
    (Notifications.getAllScheduledNotificationsAsync as jest.Mock).mockResolvedValue(
      Array.from({ length: 10 }, (_, i) => ({
        identifier: `daily-reminder-${i}`,
      })),
    );

    await recheckAndRescheduleIfNeeded("08:00", localize, true);

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(30);
  });

  it("does not reschedule when 14 or more daily reminders remain", async () => {
    (Notifications.getAllScheduledNotificationsAsync as jest.Mock).mockResolvedValue(
      Array.from({ length: 20 }, (_, i) => ({
        identifier: `daily-reminder-${i}`,
      })),
    );

    await recheckAndRescheduleIfNeeded("08:00", localize, true);

    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});

describe("getNotificationKind", () => {
  it("maps daily reminder and streak risk identifiers", () => {
    expect(getNotificationKind("daily-reminder-3")).toBe("daily_reminder");
    expect(getNotificationKind("streak-risk")).toBe("streak_risk");
  });

  it("returns other for unknown identifiers", () => {
    expect(getNotificationKind("something-else")).toBe("other");
  });

  it("returns other instead of throwing when the identifier is missing", () => {
    expect(getNotificationKind(null)).toBe("other");
    expect(getNotificationKind(undefined)).toBe("other");
  });
});
