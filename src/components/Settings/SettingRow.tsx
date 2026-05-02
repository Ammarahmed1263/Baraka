import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "@components/UI/AppText";
import { useTheme } from "@context/ThemeContext";

interface SettingRowProps {
  icon: keyof typeof Feather.glyphMap | string;
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
            style={[styles.settingName, { color: C.text }]}
          >
            {label}
          </AppText>
          {desc && (
            <AppText
              weight='Regular'
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
});
