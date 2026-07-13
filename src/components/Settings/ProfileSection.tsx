import React from "react";
import { View, StyleSheet, Switch } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { AppText } from "@components/UI/AppText";
import SettingRow from "./SettingRow";
import { ROLES, type RoleKey } from "@utils/roleHelpers";

interface ProfileSectionProps {
  profile: Record<RoleKey, boolean>;
  onToggle: (key: RoleKey) => void;
}

export const ProfileSection = React.memo(({ profile, onToggle }: ProfileSectionProps) => {
  const { t } = useTranslation();
  const { colors: C } = useTheme();

  return (
    <>
      <AppText weight="Bold" style={[styles.sectionLabel, { color: C.gold }]}>
        {t("settings.myProfile")}
      </AppText>
      <AppText
        weight="Regular"
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
        {ROLES.map((opt, idx) => (
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
              label={t(opt.labelKey)}
              desc={t(opt.descKey)}
              right={
                <Switch
                  value={profile[opt.key]}
                  onValueChange={() => onToggle(opt.key)}
                  trackColor={{ false: C.border, true: C.tint + "80" }}
                  thumbColor={profile[opt.key] ? C.tint : C.textMuted}
                  ios_backgroundColor={C.border}
                />
              }
            />
          </React.Fragment>
        ))}
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 24,
  },
  sectionSubLabel: {
    fontSize: 14,
    marginBottom: 12,
    marginLeft: 4,
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
});
