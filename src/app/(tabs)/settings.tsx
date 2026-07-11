import {
  cancelDailyNotifications,
  registerForPushNotificationsAsync,
  scheduleDailyNotifications,
} from "@/services/notifications";
import { AppBottomSheet } from "@components/UI/AppBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import SettingRow from "@components/Settings/SettingRow";
import UserStatsCard from "@components/Settings/UserStatsCard";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppIcon as Feather } from "@components/UI/AppIcon";
import { AppText } from "@components/UI/AppText";
import { useTheme } from "@context/ThemeContext";
import { useLocalize } from "@hooks/useLocalize";
import { useLanguage } from "@i18n";
import { storage } from "@lib/storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  useActivitiesStore,
  useJournalStore,
  useLogsStore,
  useSettingsStore,
} from "@store";
import { Haptic } from "@utils/haptics";
import { parseReminderTime } from "@utils/parseReminderTime";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ProfileKey = "isHomemaker" | "isParent" | "isStudent" | "isProfessional";

const PROFILE_OPTIONS: Array<{ key: ProfileKey; icon: string; color: string }> =
  [
    {
      key: "isHomemaker",
      icon: "home",
      color: "#EC4899",
    },
    {
      key: "isParent",
      icon: "users",
      color: "#F97316",
    },
    {
      key: "isStudent",
      icon: "book",
      color: "#8B5CF6",
    },
    {
      key: "isProfessional",
      icon: "briefcase",
      color: "#3B82F6",
    },
  ];

const ROLE_TRANSLATION_KEYS: Record<
  ProfileKey,
  { label: string; desc: string }
> = {
  isHomemaker: {
    label: "settings.role.homemaker",
    desc: "settings.roleDesc.homemaker",
  },
  isParent: {
    label: "settings.role.parent",
    desc: "settings.roleDesc.parent",
  },
  isStudent: {
    label: "settings.role.student",
    desc: "settings.roleDesc.student",
  },
  isProfessional: {
    label: "settings.role.professional",
    desc: "settings.roleDesc.professional",
  },
};

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { colors: C, theme: currentMode } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const activities = useActivitiesStore((s) => s.activities);
  const dailyLogs = useLogsStore((s) => s.dailyLogs);
  const streak = useLogsStore((s) => s.streak);
  const journalEntries = useJournalStore((s) => s.journalEntries);
  const { language: lang, changeLanguage } = useLanguage();
  const localize = useLocalize();

  // Language sheet ref
  const langSheetRef = useRef<BottomSheetModal>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const toastOpacity = useSharedValue(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(2200, withTiming(0, { duration: 300 })),
    );
    toastTimer.current = setTimeout(() => setToastMessage(""), 2800);
  };

  const animatedToastStyle = useAnimatedStyle(() => ({
    opacity: toastOpacity.value,
  }));

  // Time picker state
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatReminderTime = (timeStr: string): string => {
    const { hour, minute } = parseReminderTime(timeStr);
    const ampm =
      hour >= 12 ? (lang === "ar" ? "م" : "PM") : lang === "ar" ? "ص" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = String(minute).padStart(2, "0");
    return `${displayHour}:${displayMinute} ${ampm}`;
  };

  const getPickerDate = (timeStr: string): Date => {
    const { hour, minute } = parseReminderTime(timeStr);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }

    if (selectedDate && event.type !== "dismissed") {
      const hours = String(selectedDate.getHours()).padStart(2, "0");
      const minutes = String(selectedDate.getMinutes()).padStart(2, "0");
      const timeStr = `${hours}:${minutes}`;

      updateSettings({ reminderTime: timeStr });

      if (
        settings.notificationsEnabled &&
        settings.notificationsStatus === "granted"
      ) {
        await scheduleDailyNotifications(timeStr, localize);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const handleLanguageSelect = async (nextLanguage: "en" | "ar") => {
    if (lang === nextLanguage) {
      langSheetRef.current?.dismiss();
      return;
    }

    langSheetRef.current?.dismiss();

    if (
      settings.notificationsEnabled &&
      settings.notificationsStatus === "granted"
    ) {
      await cancelDailyNotifications();
    }

    await changeLanguage(nextLanguage);
  };

  // const handleBilingualToggle = () => {
  //   updateSettings({ showBilingual: !settings.showBilingual });
  // };

  const ROLE_UNLOCK_MESSAGES: Record<ProfileKey, { en: string; ar: string }> = {
    isHomemaker: {
      en: t("settings.roleToast.homemaker", { lng: "en" }),
      ar: t("settings.roleToast.homemaker", { lng: "ar" }),
    },
    isParent: {
      en: t("settings.roleToast.parent", { lng: "en" }),
      ar: t("settings.roleToast.parent", { lng: "ar" }),
    },
    isStudent: {
      en: t("settings.roleToast.student", { lng: "en" }),
      ar: t("settings.roleToast.student", { lng: "ar" }),
    },
    isProfessional: {
      en: t("settings.roleToast.professional", { lng: "en" }),
      ar: t("settings.roleToast.professional", { lng: "ar" }),
    },
  };

  const handleProfileToggle = (key: ProfileKey) => {
    const newValue = !settings.profile[key];
    updateSettings({ profile: { ...settings.profile, [key]: newValue } });
    if (newValue) {
      Haptic.success();
      const msg = ROLE_UNLOCK_MESSAGES[key];
      showToast(lang === "ar" ? msg.ar : msg.en);
    }
  };

  const handleExportData = async () => {
    const data = {
      exportedAt: new Date().toISOString(),
      profile: settings.profile,
      activities: activities
        .filter((a) => a.enabled)
        .map((a) => ({
          name: a.name,
          enabled: a.enabled,
          customNiyyah: a.customNiyyah,
          selectedNiyyahIds: a.selectedNiyyahIds,
        })),
      dailyLogs: dailyLogs.slice(-30),
      journalEntries: journalEntries.slice(-50),
      streak,
    };
    const json = JSON.stringify(data, null, 2);
    try {
      await Share.share({ title: t("settings.exportTitle"), message: json });
    } catch {
      Alert.alert(
        t("settings.exportFallbackTitle"),
        t("settings.exportFallbackMessage"),
      );
    }
  };

  const handleClearData = () => {
    Alert.alert(
      t("settings.clearConfirmTitle"),
      t("settings.clearConfirmMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("settings.clear"),
          style: "destructive",
          onPress: () => {
            storage.clearAll();
            Alert.alert(
              t("settings.clearedTitle"),
              t("settings.clearedMessage"),
            );
          },
        },
      ],
    );
  };

  const handleNotificationToggle = async (v: boolean) => {
    if (v) {
      const status = await registerForPushNotificationsAsync();
      updateSettings({
        notificationsStatus: status,
        notificationsEnabled: status === "granted",
      });

      if (status === "granted") {
        Haptic.success();
        await scheduleDailyNotifications(
          settings.reminderTime || "08:00",
          localize,
        );
      } else {
        Alert.alert(
          t("settings.notifPermissionTitle"),
          t("settings.notifPermissionMessage"),
          [
            { text: t("common.cancel"), style: "cancel" },
            {
              text: t("settings.openSettings"),
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }
    } else {
      updateSettings({ notificationsEnabled: false });
      await cancelDailyNotifications();
    }
  };

  const topPadding = isWeb ? 67 : insets.top;
  const totalCompleted = dailyLogs.length;
  const totalJournal = journalEntries.length;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Toast notification */}
      {toastMessage !== "" && (
        <Animated.View
          style={[
            styles.toast,
            {
              backgroundColor: C.backgroundCard,
              borderColor: C.border,
              borderWidth: 1,
              bottom: isWeb ? 34 + 84 : 100,
            },
            animatedToastStyle,
          ]}
          pointerEvents='none'
        >
          <Feather name='unlock' size={16} color='#C9A84C' />
          <AppText
            weight='Medium'
            style={[styles.toastText, { color: C.text }]}
          >
            {toastMessage}
          </AppText>
        </Animated.View>
      )}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding + 16, paddingBottom: isWeb ? 34 + 84 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppText weight='Bold' style={[styles.title, { color: C.gold }]}>
          {t("settings.title")}
        </AppText>

        {/* Stats Card */}
        <UserStatsCard
          streak={streak}
          totalCompleted={totalCompleted}
          totalJournal={totalJournal}
        />

        {/* ── My Profile ──────────────────────────────────────── */}
        <AppText weight='Bold' style={[styles.sectionLabel, { color: C.gold }]}>
          {t("settings.myProfile")}
        </AppText>
        <AppText
          weight='Regular'
          style={[styles.sectionSubLabel, { color: C.textMuted }]}
        >
          {t("settings.profileHint")}
        </AppText>
        <View
          style={[
            styles.settingsCard,
            { backgroundColor: C.backgroundCard, borderColor: C.border },
          ]}
        >
          {PROFILE_OPTIONS.map((opt, idx) => (
            <React.Fragment key={opt.key}>
              {idx > 0 && (
                <View
                  style={[styles.divider, { backgroundColor: C.borderLight }]}
                />
              )}
              <SettingRow
                icon={opt.icon}
                iconColor={opt.color}
                iconBg={opt.color + "18"}
                label={t(ROLE_TRANSLATION_KEYS[opt.key].label)}
                desc={t(ROLE_TRANSLATION_KEYS[opt.key].desc)}
                right={
                  <Switch
                    value={settings.profile[opt.key]}
                    onValueChange={() => handleProfileToggle(opt.key)}
                    trackColor={{ false: C.border, true: C.tint + "80" }}
                    thumbColor={
                      settings.profile[opt.key] ? C.tint : C.textMuted
                    }
                    ios_backgroundColor={C.border}
                  />
                }
              />
            </React.Fragment>
          ))}
        </View>

        {/* ── Preferences ─────────────────────────────────────── */}
        <AppText weight='Bold' style={[styles.sectionLabel, { color: C.gold }]}>
          {t("settings.preferences")}
        </AppText>
        <View
          style={[
            styles.settingsCard,
            { backgroundColor: C.backgroundCard, borderColor: C.border },
          ]}
        >
          <AnimatedPressable onPress={() => langSheetRef.current?.present()}>
            <SettingRow
              icon='globe'
              label={t("settings.language")}
              desc={
                lang === "en" ? t("settings.english") : t("settings.arabic")
              }
              right={
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <AppText
                    weight='Medium'
                    style={{ color: C.textSecondary, marginRight: 4 }}
                  >
                    {lang === "en" ? "English" : "عربي"}
                  </AppText>
                  <Feather
                    name='chevron-right'
                    size={18}
                    color={C.textMuted}
                    flipRTL
                  />
                </View>
              }
            />
          </AnimatedPressable>
          {/* <View style={[styles.divider, { backgroundColor: C.borderLight }]} />
          <SettingRow
            icon="layers"
            iconColor={C.gold}
            iconBg={C.gold + "18"}
            label={t("settings.showBothLanguages")}
            desc={t("settings.showBothLanguagesDesc")}
            right={
              <Switch
                value={settings.showBilingual}
                onValueChange={handleBilingualToggle}
                trackColor={{ false: C.border, true: C.tint + "80" }}
                thumbColor={settings.showBilingual ? C.tint : C.textMuted}
                ios_backgroundColor={C.border}
              />
            }
          /> */}
          <View style={[styles.divider, { backgroundColor: C.borderLight }]} />
          <SettingRow
            icon='bell'
            iconColor='#8B5CF6'
            iconBg='#8B5CF620'
            label={t("settings.notifications")}
            desc={t("settings.notificationsDesc")}
            right={
              <Switch
                value={
                  settings.notificationsEnabled &&
                  settings.notificationsStatus === "granted"
                }
                onValueChange={handleNotificationToggle}
                trackColor={{ false: C.border, true: C.tint + "80" }}
                thumbColor={
                  settings.notificationsEnabled &&
                  settings.notificationsStatus === "granted"
                    ? C.tint
                    : C.textMuted
                }
                ios_backgroundColor={C.border}
              />
            }
          />
          {settings.notificationsEnabled &&
            settings.notificationsStatus === "granted" && (
              <>
                <View
                  style={[styles.divider, { backgroundColor: C.borderLight }]}
                />
                <SettingRow
                  icon='clock'
                  iconColor='#10B981'
                  iconBg='#10B98120'
                  label={t("settings.reminderTimeLabel")}
                  desc={formatReminderTime(settings.reminderTime || "08:00")}
                  right={
                    <AnimatedPressable
                      onPress={() => setShowTimePicker(true)}
                      style={[
                        styles.timePickerButton,
                        {
                          backgroundColor: C.border,
                        },
                      ]}
                    >
                      <AppText
                        weight='Medium'
                        style={{ color: C.textSecondary, fontSize: 13 }}
                      >
                        {t("settings.change")}
                      </AppText>
                    </AnimatedPressable>
                  }
                />
              </>
            )}
          <View style={[styles.divider, { backgroundColor: C.borderLight }]} />
          <SettingRow
            icon={currentMode === "dark" ? "moon" : "sun"}
            iconColor={C.gold}
            iconBg={C.gold + "18"}
            label={t("settings.theme")}
            desc={t(`settings.themeModes.${currentMode}`, {
              defaultValue: currentMode,
            })}
            right={
              <View style={styles.themeSelector}>
                {(["light", "auto", "dark"] as const).map((mode) => (
                  <AnimatedPressable
                    key={mode}
                    onPress={() => updateSettings({ darkMode: mode })}
                    style={[
                      styles.themeOption,
                      {
                        backgroundColor:
                          currentMode === mode ? C.tint : C.border,
                      },
                    ]}
                  >
                    <Feather
                      name={
                        mode === "auto"
                          ? "smartphone"
                          : mode === "dark"
                            ? "moon"
                            : "sun"
                      }
                      size={14}
                      color={currentMode === mode ? "#FFF" : C.textSecondary}
                    />
                  </AnimatedPressable>
                ))}
              </View>
            }
          />
        </View>

        {/* ── Data ────────────────────────────────────────────── */}
        <AppText weight='Bold' style={[styles.sectionLabel, { color: C.gold }]}>
          {t("settings.data")}
        </AppText>
        <View
          style={[
            styles.settingsCard,
            { backgroundColor: C.backgroundCard, borderColor: C.border },
          ]}
        >
          <AnimatedPressable
            style={styles.settingRow}
            onPress={handleExportData}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View
                style={[styles.settingIcon, { backgroundColor: C.tint + "18" }]}
              >
                <Feather name='share' size={16} color={C.tint} />
              </View>
              <View>
                <AppText
                  weight='Medium'
                  style={[styles.settingName, { color: C.text }]}
                >
                  {t("settings.exportData")}
                </AppText>
                <AppText
                  weight='Regular'
                  style={[styles.settingDesc, { color: C.textMuted }]}
                >
                  {t("settings.exportDataDesc")}
                </AppText>
              </View>
            </View>
            <Feather
              name='chevron-right'
              size={18}
              color={C.textMuted}
              flipRTL
            />
          </AnimatedPressable>
          <View style={[styles.divider, { backgroundColor: C.borderLight }]} />
          <AnimatedPressable
            style={styles.settingRow}
            onPress={handleClearData}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View
                style={[styles.settingIcon, { backgroundColor: "#EF444420" }]}
              >
                <Feather name='trash-2' size={16} color='#EF4444' />
              </View>
              <View>
                <AppText
                  weight='Medium'
                  style={[styles.settingName, { color: "#EF4444" }]}
                >
                  {t("settings.clearData")}
                </AppText>
                <AppText
                  weight='Regular'
                  style={[styles.settingDesc, { color: C.textMuted }]}
                >
                  {t("settings.clearDataDesc")}
                </AppText>
              </View>
            </View>
            <Feather
              name='chevron-right'
              size={18}
              color={C.textMuted}
              flipRTL
            />
          </AnimatedPressable>
        </View>

        {/* ── About ───────────────────────────────────────────── */}
        <AppText weight='Bold' style={[styles.sectionLabel, { color: C.gold }]}>
          {t("settings.about")}
        </AppText>
        <View
          style={[
            styles.settingsCard,
            { backgroundColor: C.backgroundCard, borderColor: C.border },
          ]}
        >
          <View style={styles.aboutCard}>
            <AppText
              weight='Bold'
              style={[styles.aboutTitle, { color: C.text }]}
            >
              {t("settings.aboutTitle")}
            </AppText>
            <AppText
              weight='Regular'
              style={[styles.aboutDesc, { color: C.textSecondary }]}
            >
              {t("settings.aboutDesc")}
            </AppText>
            <AppText
              weight='Regular'
              style={[styles.aboutQuote, { color: C.gold }]}
            >
              {t("settings.quote")}
            </AppText>
            <AppText
              weight='Regular'
              style={[styles.aboutRef, { color: C.textMuted }]}
            >
              {t("settings.quoteRef")}
            </AppText>
            <AppText
              weight='Regular'
              style={[styles.version, { color: C.textMuted }]}
            >
              {t("settings.version")}
            </AppText>
          </View>
        </View>

        {/* Privacy Note */}
        <View
          style={[
            styles.privacyNote,
            { backgroundColor: C.successLight, borderColor: C.tint + "30" },
          ]}
        >
          <Feather name='shield' size={16} color={C.tint} />
          <View style={{ flex: 1 }}>
            <AppText
              weight='Regular'
              style={[styles.privacyText, { color: C.tint }]}
            >
              {t("settings.privacy")}
            </AppText>
            <AnimatedPressable
              onPress={() =>
                Linking.openURL(
                  "https://pr-checklist.notion.site/Privacy-Policy-for-Baraka-39a68938c5b98013985cd36103ad3102",
                )
              }
              hitSlop={20}
              // style={{ marginTop: 8 }}
            >
              <AppText
                weight='Medium'
                style={{
                  color: C.gold,
                  textDecorationLine: "underline",
                  fontSize: 13,
                }}
              >
                {t("settings.privacyPolicy")}
              </AppText>
            </AnimatedPressable>
          </View>
        </View>
      </ScrollView>

      {Platform.OS === "ios" && showTimePicker && (
        <Modal
          transparent={true}
          animationType='slide'
          visible={showTimePicker}
          onRequestClose={() => setShowTimePicker(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowTimePicker(false)}
          >
            <View
              style={[styles.modalSheet, { backgroundColor: C.backgroundCard }]}
            >
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <AppText weight='Medium' style={{ color: C.textMuted }}>
                    {t("common.cancel")}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <AppText weight='Bold' style={{ color: C.tint }}>
                    {t("onboarding.done")}
                  </AppText>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={getPickerDate(settings.reminderTime || "08:00")}
                mode='time'
                display='spinner'
                is24Hour={false}
                onChange={handleTimeChange}
                textColor={C.text}
              />
            </View>
          </Pressable>
        </Modal>
      )}

      {Platform.OS === "android" && showTimePicker && (
        <DateTimePicker
          value={getPickerDate(settings.reminderTime || "08:00")}
          mode='time'
          is24Hour={false}
          onChange={handleTimeChange}
        />
      )}

      <AppBottomSheet
        ref={langSheetRef}
        snapPoints={["35%"]}
        enablePanDownToClose
      >
        <AppText weight='Bold' style={[styles.sheetTitle, { color: C.text }]}>
          {t("settings.selectLanguage", "Select Language")}
        </AppText>
        <AppText
          weight='Regular'
          style={[styles.sheetDesc, { color: C.textMuted }]}
        >
          {t(
            "settings.selectLanguageDesc",
            "Choose your preferred language for the app interface.",
          )}
        </AppText>

        <View style={styles.sheetOptions}>
          <AnimatedPressable
            style={[
              styles.langOption,
              {
                backgroundColor:
                  lang === "en" ? C.tint + "15" : C.border + "50",
              },
              lang === "en" && { borderColor: C.tint, borderWidth: 1 },
            ]}
            onPress={() => handleLanguageSelect("en")}
          >
            <AppText
              weight='Medium'
              style={{ color: lang === "en" ? C.tint : C.text }}
            >
              English
            </AppText>
            {lang === "en" && <Feather name='check' size={20} color={C.tint} />}
          </AnimatedPressable>

          <AnimatedPressable
            style={[
              styles.langOption,
              {
                backgroundColor:
                  lang === "ar" ? C.tint + "15" : C.border + "50",
              },
              lang === "ar" && { borderColor: C.tint, borderWidth: 1 },
            ]}
            onPress={() => handleLanguageSelect("ar")}
          >
            <AppText
              weight='Medium'
              style={{
                color: lang === "ar" ? C.tint : C.text,
                fontFamily: "Tajawal",
              }}
            >
              عربي
            </AppText>
            {lang === "ar" && <Feather name='check' size={20} color={C.tint} />}
          </AnimatedPressable>
        </View>
      </AppBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  title: { fontSize: 28, marginBottom: 20 },
  sectionLabel: {
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionSubLabel: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
    marginLeft: 4,
  },
  settingsCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingName: { fontSize: 15 },
  settingDesc: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginLeft: 64 },
  themeSelector: {
    flexDirection: "row",
    backgroundColor: "#00000008",
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  themeOption: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  timePickerButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    height: "auto",
    width: "auto",
  },
  aboutCard: { padding: 18, gap: 8 },
  aboutTitle: { fontSize: 18 },
  aboutDesc: { fontSize: 14, lineHeight: 22 },
  aboutQuote: { fontSize: 15, marginTop: 4 },
  aboutRef: { fontSize: 12 },
  version: { fontSize: 12, marginTop: 8 },
  privacyNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  privacyText: { flex: 1, fontSize: 13, lineHeight: 20 },
  toast: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastText: { fontSize: 14, flex: 1 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 20, marginBottom: 8 },
  sheetDesc: { fontSize: 14, marginBottom: 24, lineHeight: 20 },
  sheetOptions: { gap: 12, marginBottom: 28 },
  langOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
});
