import { useRef, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
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

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { colors: C } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const langSheetRef = useRef<BottomSheetModal>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const {
    settings,
    lang,
    updateSettings,
    notificationsActive,
    formattedReminderTime,
    toastMessage,
    animatedToastStyle,
    handleProfileToggle,
    handleNotificationToggle,
    handleTimeChange,
    handleLanguageSelect,
    handleExportData,
    handleClearData,
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

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <SettingsToast
        message={toastMessage}
        animatedStyle={animatedToastStyle}
        isWeb={isWeb}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: (isWeb ? 67 : insets.top) + 16,
            paddingBottom: isWeb ? 34 + 84 : 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppText weight="Bold" style={[styles.title, { color: C.gold }]}>
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
          notificationsActive={notificationsActive}
          formattedReminderTime={formattedReminderTime}
          onNotificationToggle={handleNotificationToggle}
          onTimePickerOpen={() => setShowTimePicker(true)}
          onLanguageOpen={() => langSheetRef.current?.present()}
          onThemeChange={(mode) => updateSettings({ darkMode: mode })}
        />

        <DataSection
          onExport={handleExportData}
          onClear={handleClearData}
        />

        <AboutSection />
      </ScrollView>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  title: { fontSize: 28, marginBottom: 20 },
});
