import React from "react";
import { View, StyleSheet, Switch } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { AppText } from "@components/UI/AppText";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppIcon as Feather } from "@components/UI/AppIcon";
import SettingRow from "./SettingRow";

interface PreferencesSectionProps {
  lang: string;
  themePreference: "light" | "auto" | "dark";
  notificationsActive: boolean;
  formattedReminderTime: string;
  onNotificationToggle: (v: boolean) => void;
  onTimePickerOpen: () => void;
  onLanguageOpen: () => void;
  onThemeChange: (mode: "light" | "auto" | "dark") => void;
}

export const PreferencesSection = React.memo(
  ({
    lang,
    themePreference,
    notificationsActive,
    formattedReminderTime,
    onNotificationToggle,
    onTimePickerOpen,
    onLanguageOpen,
    onThemeChange,
  }: PreferencesSectionProps) => {
    const { t } = useTranslation();
    const { colors: C, theme: currentMode } = useTheme();

    return (
      <>
        <AppText weight='Bold' style={[styles.sectionLabel, { color: C.gold }]}>
          {t("settings.preferences")}
        </AppText>
        <View
          style={[
            styles.settingsCard,
            { backgroundColor: C.backgroundCard, borderColor: C.border },
          ]}
        >
          <AnimatedPressable onPress={onLanguageOpen}>
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

          <View style={[styles.divider, { backgroundColor: C.borderLight }]} />

          <SettingRow
            icon='bell'
            iconColor='#8B5CF6'
            iconBg='#8B5CF620'
            label={t("settings.notifications")}
            desc={t("settings.notificationsDesc")}
            right={
              <Switch
                value={notificationsActive}
                onValueChange={onNotificationToggle}
                trackColor={{ false: C.border, true: C.tint + "80" }}
                thumbColor={notificationsActive ? C.tint : C.textMuted}
                ios_backgroundColor={C.border}
              />
            }
          />

          {notificationsActive && (
            <>
              <View
                style={[styles.divider, { backgroundColor: C.borderLight }]}
              />
              <SettingRow
                icon='clock'
                iconColor='#10B981'
                iconBg='#10B98120'
                label={t("settings.reminderTimeLabel")}
                desc={formattedReminderTime}
                right={
                  <AnimatedPressable
                    onPress={onTimePickerOpen}
                    style={[
                      styles.timePickerButton,
                      {
                        backgroundColor: C.border,
                      },
                    ]}
                  >
                    <AppText
                      weight='Medium'
                      style={{ color: C.textSecondary, fontSize: 14 }}
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
            desc={t(`settings.themeModes.${themePreference}`, {
              defaultValue: themePreference,
            })}
            right={
              <View style={styles.themeSelector}>
                {(["light", "auto", "dark"] as const).map((mode) => (
                  <AnimatedPressable
                    key={mode}
                    onPress={() => onThemeChange(mode)}
                    style={[
                      styles.themeOption,
                      {
                        backgroundColor:
                          themePreference === mode ? C.tint : C.border,
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
                      color={
                        themePreference === mode
                          ? C.textOnTint
                          : C.textSecondary
                      }
                    />
                  </AnimatedPressable>
                ))}
              </View>
            }
          />
        </View>
      </>
    );
  },
);

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 8,
  },
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  timePickerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  themeSelector: {
    flexDirection: "row",
    gap: 6,
    padding: 2,
    borderRadius: 12,
  },
  themeOption: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
