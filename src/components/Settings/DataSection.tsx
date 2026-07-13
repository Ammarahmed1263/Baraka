import React from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { AppText } from "@components/UI/AppText";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppIcon as Feather } from "@components/UI/AppIcon";

interface DataSectionProps {
  onExport: () => void;
  onClear: () => void;
}

export const DataSection = React.memo(({ onExport, onClear }: DataSectionProps) => {
  const { t } = useTranslation();
  const { colors: C } = useTheme();

  return (
    <>
      <AppText weight="Bold" style={[styles.sectionLabel, { color: C.gold }]}>
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
          onPress={onExport}
          activeOpacity={0.7}
        >
          <View style={styles.settingLeft}>
            <View
              style={[styles.settingIcon, { backgroundColor: C.tint + "18" }]}
            >
              <Feather name="share" size={16} color={C.tint} />
            </View>
            <View>
              <AppText
                weight="Medium"
                style={[styles.settingName, { color: C.text }]}
              >
                {t("settings.exportData")}
              </AppText>
              <AppText
                weight="Regular"
                style={[styles.settingDesc, { color: C.textMuted }]}
              >
                {t("settings.exportDataDesc")}
              </AppText>
            </View>
          </View>
          <Feather
            name="chevron-right"
            size={18}
            color={C.textMuted}
            flipRTL
          />
        </AnimatedPressable>

        <View style={[styles.divider, { backgroundColor: C.borderLight }]} />

        <AnimatedPressable
          style={styles.settingRow}
          onPress={onClear}
          activeOpacity={0.7}
        >
          <View style={styles.settingLeft}>
            <View
              style={[styles.settingIcon, { backgroundColor: C.error + "20" }]}
            >
              <Feather name="trash-2" size={16} color={C.error} />
            </View>
            <View>
              <AppText
                weight="Medium"
                style={[styles.settingName, { color: C.error }]}
              >
                {t("settings.clearData")}
              </AppText>
              <AppText
                weight="Regular"
                style={[styles.settingDesc, { color: C.textMuted }]}
              >
                {t("settings.clearDataDesc")}
              </AppText>
            </View>
          </View>
          <Feather
            name="chevron-right"
            size={18}
            color={C.textMuted}
            flipRTL
          />
        </AnimatedPressable>
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
    marginTop: 8,
  },
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  settingName: {
    fontSize: 16,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
});
