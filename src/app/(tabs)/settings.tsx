import { useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollViewCompat } from "@components/KeyboardAwareScrollViewCompat";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "@context/ThemeContext";
import { AppText } from "@components/UI/AppText";
import UserStatsCard from "@components/Settings/UserStatsCard";
import { useSettings } from "@hooks/useSettings";
import { ProfileSection } from "@components/Settings/ProfileSection";
import { PreferencesSection } from "@components/Settings/PreferencesSection";
import { DataSection } from "@components/Settings/DataSection";
import { AboutSection } from "@components/Settings/AboutSection";
import { SettingsToast } from "@components/Settings/SettingsToast";
import { ReminderTimePicker } from "@components/Settings/ReminderTimePicker";
import { LanguageSheet } from "@components/Settings/LanguageSheet";
import { ClearDataSheet } from "@components/Settings/ClearDataSheet";
import { spacing } from "@constants/spacing";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { colors: C } = useTheme();
  const insets = useSafeAreaInsets();


  const langSheetRef = useRef<BottomSheetModal>(null);
  const clearDataSheetRef = useRef<BottomSheetModal>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const {
    settings,
    lang,
    updateSettings,
    notificationsActive,
    notificationsToggling,
    streakNotificationsActive,
    streakNotificationsToggling,
    formattedReminderTime,
    toastMessage,
    animatedToastStyle,
    handleProfileToggle,
    handleNotificationToggle,
    handleStreakNotificationToggle,
    handleTimeChange,
    handleLanguageSelect,
    handleExportData,
    handleClearData,
    handleAnalyticsToggle,
    totalCompleted,
    totalJournal,
    streak,
  } = useSettings();

  const handleLanguageSelectAndClose = async (nextLanguage: "en" | "ar") => {
    langSheetRef.current?.dismiss();
    await handleLanguageSelect(nextLanguage);
  };

  const handleTimeChangeAndClose = async (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    await handleTimeChange(event, selectedDate);
  };

  const confirmClearData = () => {
    handleClearData();
    clearDataSheetRef.current?.dismiss();
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <SettingsToast
        message={toastMessage}
        animatedStyle={animatedToastStyle}
      />

      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + spacing.lg,
            paddingBottom: 60 + insets.bottom + spacing.xxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AppText weight="Bold" variant='hero' style={[styles.title, { color: C.gold }]}>
          {t("settings.title")}
        </AppText>

        <UserStatsCard
          streak={streak}
          totalCompleted={totalCompleted}
          totalJournal={totalJournal}
        />

        <ProfileSection
          profile={settings.profile}
          onToggle={handleProfileToggle}
        />

        <PreferencesSection
          lang={lang}
          themePreference={settings.darkMode || "auto"}
          notificationsActive={notificationsActive}
          notificationsToggling={notificationsToggling}
          streakNotificationsActive={streakNotificationsActive}
          streakNotificationsToggling={streakNotificationsToggling}
          analyticsEnabled={settings.analyticsEnabled}
          formattedReminderTime={formattedReminderTime}
          onNotificationToggle={handleNotificationToggle}
          onStreakNotificationToggle={handleStreakNotificationToggle}
          onAnalyticsToggle={handleAnalyticsToggle}
          onTimePickerOpen={() => setShowTimePicker(true)}
          onLanguageOpen={() => langSheetRef.current?.present()}
          onThemeChange={(mode) => updateSettings({ darkMode: mode })}
        />

        <DataSection
          onExport={handleExportData}
          onClear={() => clearDataSheetRef.current?.present()}
        />

        <AboutSection />
      </KeyboardAwareScrollViewCompat>

      <ReminderTimePicker
        visible={showTimePicker}
        value={settings.reminderTime || "08:00"}
        onChange={handleTimeChangeAndClose}
        onClose={() => setShowTimePicker(false)}
      />

      <LanguageSheet
        ref={langSheetRef}
        currentLang={lang}
        onSelect={handleLanguageSelectAndClose}
      />

      <ClearDataSheet
        ref={clearDataSheetRef}
        onConfirm={confirmClearData}
        onCancel={() => clearDataSheetRef.current?.dismiss()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xl },
  title: { marginBottom: spacing.xl },
});
