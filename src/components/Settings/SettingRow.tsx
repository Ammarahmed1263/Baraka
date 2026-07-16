import React from "react";
import { View, StyleSheet } from "react-native";
import { AppIcon as Feather, FeatherIconName } from "@components/UI/AppIcon";
import { AppText } from "@components/UI/AppText";
import { useTheme } from "@context/ThemeContext";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

interface SettingRowProps {
  icon: FeatherIconName | string;
  iconColor?: string;
  iconBg?: string;
  label: string;
  desc?: string;
  right: React.ReactNode;
}

export default function SettingRow({
  icon,
  iconColor,
  iconBg,
  label,
  desc,
  right,
}: SettingRowProps) {
  const { colors: C } = useTheme();

  const color = iconColor || C.tint;
  const bg = iconBg || C.tint + "18";

  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: bg }]}>
          <Feather name={icon as any} size={16} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText
            weight='Medium'
            variant='bodyLarge'
            style={{ color: C.text }}
          >
            {label}
          </AppText>
          {desc && (
            <AppText
              weight='Regular'
              variant='body'
              style={[styles.settingDesc, { color: C.textMuted }]}
            >
              {desc}
            </AppText>
          )}
        </View>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  settingDesc: { marginTop: spacing.xs },
});
