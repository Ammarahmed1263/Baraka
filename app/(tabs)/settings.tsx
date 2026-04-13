import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { AppText } from "@/components/UI/AppText";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { APP_STORAGE_KEYS } from "@/src/lib/constants";
import { useLanguage } from "@/src/i18n";

type ProfileKey = "isHomemaker" | "isParent" | "isStudent" | "isProfessional";

const PROFILE_OPTIONS: Array<{ key: ProfileKey; icon: string; color: string }> = [
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

const ROLE_TRANSLATION_KEYS: Record<ProfileKey, { label: string; desc: string }> = {
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const { settings, updateSettings, activities, dailyLogs, journalEntries, streak } = useApp();
  const { language: lang, changeLanguage } = useLanguage();

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2200),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
    toastTimer.current = setTimeout(() => setToastMessage(""), 2800);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const handleLanguageToggle = async () => {
    const nextLanguage = lang === "en" ? "ar" : "en";
    await changeLanguage(nextLanguage);
  };

  const handleBilingualToggle = () => {
    updateSettings({ showBilingual: !settings.showBilingual });
  };

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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const msg = ROLE_UNLOCK_MESSAGES[key];
      showToast(lang === "ar" ? msg.ar : msg.en);
    }
  };

  const handleExportData = async () => {
    const data = {
      exportedAt: new Date().toISOString(),
      profile: settings.profile,
      activities: activities.filter((a) => a.enabled).map((a) => ({
        name: a.name,
        nameAr: a.nameAr,
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
      Alert.alert(t("settings.exportFallbackTitle"), t("settings.exportFallbackMessage"));
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
          onPress: async () => {
            const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
            await AsyncStorage.multiRemove([...APP_STORAGE_KEYS]);
            Alert.alert(
              t("settings.clearedTitle"),
              t("settings.clearedMessage")
            );
          },
        },
      ]
    );
  };

  const topPadding = isWeb ? 67 : insets.top;
  const totalCompleted = dailyLogs.length;
  const totalJournal = journalEntries.length;

  const SettingRow = ({
    icon,
    iconColor = C.tint,
    iconBg = C.tint + "18",
    label,
    desc,
    right,
  }: {
    icon: string;
    iconColor?: string;
    iconBg?: string;
    label: string;
    desc?: string;
    right: React.ReactNode;
  }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
          <Feather name={icon as any} size={16} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="Medium" style={[styles.settingName, { color: C.text }]}>
            {label}
          </AppText>
          {desc && (
            <AppText weight="Regular" style={[styles.settingDesc, { color: C.textMuted }]}>
              {desc}
            </AppText>
          )}
        </View>
      </View>
      {right}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Toast notification */}
      {toastMessage !== "" && (
        <Animated.View
          style={[
            styles.toast,
            {
              backgroundColor: isDark ? "#1A3326" : "#2D7A4F",
              opacity: toastOpacity,
              bottom: isWeb ? 34 + 84 : 100,
            },
          ]}
          pointerEvents="none"
        >
          <Feather name="unlock" size={16} color="#C9A84C" />
          <AppText weight="Medium" style={styles.toastText}>
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
        <AppText weight="Bold" style={[styles.title, { color: C.text }]}>
          {t("settings.title")}
        </AppText>

        {/* Stats Card */}
        <LinearGradient
          colors={isDark ? ["#1A3326", "#0D2E1F"] : ["#2D7A4F", "#1A5C38"]}
          style={styles.statsCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <AppText weight="Bold" style={styles.statsTitle}>
            {t("settings.yourJourney")}
          </AppText>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <AppText weight="Bold" style={styles.statValue}>{streak}</AppText>
              <AppText weight="Regular" style={styles.statLabel}>
                {t("settings.dayStreak")}
              </AppText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <AppText weight="Bold" style={styles.statValue}>{totalCompleted}</AppText>
              <AppText weight="Regular" style={styles.statLabel}>
                {t("settings.totalRenewed")}
              </AppText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <AppText weight="Bold" style={styles.statValue}>{totalJournal}</AppText>
              <AppText weight="Regular" style={styles.statLabel}>
                {t("settings.reflections")}
              </AppText>
            </View>
          </View>
        </LinearGradient>

        {/* ── My Profile ──────────────────────────────────────── */}
        <AppText weight="Bold" style={[styles.sectionLabel, { color: C.textSecondary }]}>
          {t("settings.myProfile")}
        </AppText>
        <AppText weight="Regular" style={[styles.sectionSubLabel, { color: C.textMuted }]}>
          {t("settings.profileHint")}
        </AppText>
        <View style={[styles.settingsCard, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
          {PROFILE_OPTIONS.map((opt, idx) => (
            <React.Fragment key={opt.key}>
              {idx > 0 && <View style={[styles.divider, { backgroundColor: C.borderLight }]} />}
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
                    thumbColor={settings.profile[opt.key] ? C.tint : C.textMuted}
                    ios_backgroundColor={C.border}
                  />
                }
              />
            </React.Fragment>
          ))}
        </View>

        {/* ── Preferences ─────────────────────────────────────── */}
        <AppText weight="Bold" style={[styles.sectionLabel, { color: C.textSecondary }]}>
          {t("settings.preferences")}
        </AppText>
        <View style={[styles.settingsCard, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
          <SettingRow
            icon="globe"
            label={t("settings.language")}
            desc={lang === "en" ? t("settings.english") : t("settings.arabic")}
            right={
              <Switch
                value={lang === "ar"}
                onValueChange={handleLanguageToggle}
                trackColor={{ false: C.border, true: C.tint + "80" }}
                thumbColor={lang === "ar" ? C.tint : C.textMuted}
                ios_backgroundColor={C.border}
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: C.borderLight }]} />
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
          />
          <View style={[styles.divider, { backgroundColor: C.borderLight }]} />
          <SettingRow
            icon="bell"
            iconColor="#8B5CF6"
            iconBg="#8B5CF620"
            label={t("settings.notifications")}
            desc={t("settings.notificationsDesc")}
            right={
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(v) => updateSettings({ notificationsEnabled: v })}
                trackColor={{ false: C.border, true: C.tint + "80" }}
                thumbColor={settings.notificationsEnabled ? C.tint : C.textMuted}
                ios_backgroundColor={C.border}
              />
            }
          />
        </View>

        {/* ── Data ────────────────────────────────────────────── */}
        <AppText weight="Bold" style={[styles.sectionLabel, { color: C.textSecondary }]}>
          {t("settings.data")}
        </AppText>
        <View style={[styles.settingsCard, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
          <TouchableOpacity style={styles.settingRow} onPress={handleExportData} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: C.tint + "18" }]}>
                <Feather name="share" size={16} color={C.tint} />
              </View>
              <View>
                <AppText weight="Medium" style={[styles.settingName, { color: C.text }]}>
                  {t("settings.exportData")}
                </AppText>
                <AppText weight="Regular" style={[styles.settingDesc, { color: C.textMuted }]}>
                  {t("settings.exportDataDesc")}
                </AppText>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color={C.textMuted} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: C.borderLight }]} />
          <TouchableOpacity style={styles.settingRow} onPress={handleClearData} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: "#EF444420" }]}>
                <Feather name="trash-2" size={16} color="#EF4444" />
              </View>
              <View>
                <AppText weight="Medium" style={[styles.settingName, { color: "#EF4444" }]}>
                  {t("settings.clearData")}
                </AppText>
                <AppText weight="Regular" style={[styles.settingDesc, { color: C.textMuted }]}>
                  {t("settings.clearDataDesc")}
                </AppText>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color={C.textMuted} />
          </TouchableOpacity>
        </View>

        {/* ── About ───────────────────────────────────────────── */}
        <AppText weight="Bold" style={[styles.sectionLabel, { color: C.textSecondary }]}>
          {t("settings.about")}
        </AppText>
        <View style={[styles.settingsCard, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
          <View style={styles.aboutCard}>
            <AppText weight="Bold" style={[styles.aboutTitle, { color: C.text }]}>
              {t("settings.aboutTitle")}
            </AppText>
            <AppText weight="Regular" style={[styles.aboutDesc, { color: C.textSecondary }]}>
              {t("settings.aboutDesc")}
            </AppText>
            <AppText weight="Regular" style={[styles.aboutQuote, { color: C.tint }]}>
              {t("settings.quote")}
            </AppText>
            <AppText weight="Regular" style={[styles.aboutRef, { color: C.textMuted }]}>
              {t("settings.quoteRef")}
            </AppText>
            <AppText weight="Regular" style={[styles.version, { color: C.textMuted }]}>
              {t("settings.version")}
            </AppText>
          </View>
        </View>

        {/* Privacy Note */}
        <View style={[styles.privacyNote, { backgroundColor: C.successLight, borderColor: C.tint + "30" }]}>
          <Feather name="shield" size={16} color={C.tint} />
          <AppText weight="Regular" style={[styles.privacyText, { color: C.tint }]}>
            {t("settings.privacy")}
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  title: { fontSize: 28, marginBottom: 20 },
  statsCard: { borderRadius: 16, padding: 20, marginBottom: 24, gap: 16 },
  statsTitle: { fontSize: 16, color: "rgba(255,255,255,0.85)" },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center", gap: 4 },
  statValue: { fontSize: 28, color: "#FFF" },
  statLabel: { fontSize: 12, color: "rgba(255,255,255,0.7)", textAlign: "center" },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },
  sectionLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
    marginLeft: 4,
  },
  sectionSubLabel: { fontSize: 13, lineHeight: 18, marginBottom: 10, marginLeft: 4 },
  settingsCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden", marginBottom: 24 },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  settingName: { fontSize: 15 },
  settingDesc: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginLeft: 64 },
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
  toastText: { color: "#FFF", fontSize: 14, flex: 1 },
});
