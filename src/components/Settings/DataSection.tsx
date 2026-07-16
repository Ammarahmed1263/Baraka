import React from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { AppText } from "@components/UI/AppText";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppIcon as Feather } from "@components/UI/AppIcon";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

interface DataSectionProps {
  onExport: () => void;
  onClear: () => void;
}

export const DataSection = React.memo(({ onExport, onClear }: DataSectionProps) => {
  const { t } = useTranslation();
  const { colors: C } = useTheme();

  return (
    <>
      <AppText weight="Bold" variant='bodyLarge' style={[styles.sectionLabel, { color: C.gold }]}>
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
                variant='bodyLarge'
                style={[styles.settingName, { color: C.text }]}
              >
                {t("settings.exportData")}
              </AppText>
              <AppText
                weight="Regular"
                variant='body'
                style={{ color: C.textMuted }}
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
                variant='bodyLarge'
                style={[styles.settingName, { color: C.error }]}
              >
                {t("settings.clearData")}
              </AppText>
              <AppText
                weight="Regular"
                variant='body'
                style={{ color: C.textMuted }}
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
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    marginTop: spacing.sm,
  },
  settingsCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xxl,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  settingName: {
    marginBottom: spacing.xs,
  },
  divider: {
    height: 1,
    marginVertical: spacing.xs,
  },
});
