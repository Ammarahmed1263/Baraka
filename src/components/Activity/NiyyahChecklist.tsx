import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "@components/UI/AppText";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppTextInput } from "@components/UI/AppTextInput";
import { AppButton } from "@components/UI/AppButton";
import { AppIcon as Feather } from "@components/UI/AppIcon";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { getRoleByTag } from "@utils/roleHelpers";
import { type NiyyahOption } from "@types";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

interface NiyyahChecklistProps {
  allAdvanced: NiyyahOption[];
  localSelected: string[];
  onToggleNiyyah: (id: string) => void;
  onAddCustomNiyyah: (text: string) => void;
  showBilingual: boolean;
  localize: (text: any) => string;
}

export const NiyyahChecklist = React.memo(
  ({
    allAdvanced,
    localSelected,
    onToggleNiyyah,
    onAddCustomNiyyah,
    showBilingual,
    localize,
  }: NiyyahChecklistProps) => {
    const { t } = useTranslation();
    const { colors: C } = useTheme();

    const [showAddCustom, setShowAddCustom] = useState(false);
    const [customText, setCustomText] = useState("");

    const handleAdd = () => {
      onAddCustomNiyyah(customText);
      setCustomText("");
      setShowAddCustom(false);
    };

    if (allAdvanced.length === 0) return null;

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: C.backgroundCard, borderColor: C.border },
        ]}
      >
        <View style={styles.cardHeader}>
          <AppText
            weight='Medium'
            variant='caption'
            style={[styles.sectionLabel, { color: C.gold }]}
          >
            {t("activity.multiplyIntentions")}
          </AppText>
          <AppText weight='Bold' variant='caption' style={{ color: C.tint }}>
            {t("activity.selectedCount", { count: localSelected.length })}
          </AppText>
        </View>
        <AppText
          weight='Regular'
          variant='footnote'
          style={[styles.multiHint, { color: C.textMuted }]}
        >
          {t("activity.multiHint")}
        </AppText>

        {allAdvanced.map((option) => {
          const checked = localSelected.includes(option.id);
          return (
            <AnimatedPressable
              key={option.id}
              onPress={() => onToggleNiyyah(option.id)}
              style={[
                styles.niyyahOption,
                {
                  backgroundColor: checked ? C.tint + "15" : C.backgroundSubtle,
                  borderColor: checked ? C.tint + "88" : C.border,
                },
              ]}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: checked ? C.tint : "transparent",
                    borderColor: checked ? C.tint : C.border,
                  },
                ]}
              >
                {checked && (
                  <Feather name='check' size={12} color={C.background} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <AppText
                  weight={checked ? "Medium" : "Regular"}
                  variant='body'
                  style={[styles.optionText, { color: checked ? C.text : C.textSecondary }]}
                >
                  {localize(option.text)}
                </AppText>
                {option.profileTags && option.profileTags.length > 0 && (
                  <View style={styles.roleBadgeRow}>
                    {option.profileTags.map((tag) => {
                      const role = getRoleByTag(tag);
                      const roleColor = role?.color || C.tint;
                      const roleIcon = (role?.icon || "star") as any;
                      return (
                        <View
                          key={tag}
                          style={[
                            styles.roleBadge,
                            { backgroundColor: roleColor + "20" },
                          ]}
                        >
                          <Feather
                            name={roleIcon}
                            size={10}
                            color={roleColor}
                          />
                          <AppText
                            weight='Medium'
                            variant='caption'
                            style={{ color: roleColor }}
                          >
                            {t(`settings.role.${tag}`)}
                          </AppText>
                        </View>
                      );
                    })}
                  </View>
                )}
                {showBilingual && (
                  <AppText
                    weight='Regular'
                    variant='footnote'
                    style={[styles.optionTextAr, { color: C.textMuted }]}
                  >
                    {option.text.ar}
                  </AppText>
                )}
              </View>
            </AnimatedPressable>
          );
        })}

        {!showAddCustom ? (
          <AnimatedPressable
            onPress={() => setShowAddCustom(true)}
            style={[styles.addCustomBtn, { borderColor: C.tint + "66" }]}
          >
            <Feather name='plus' size={14} color={C.tintLight} />
            <AppText weight='Medium' variant='body' style={{ color: C.tintLight }}>
              {t("activity.addCustomIntention")}
            </AppText>
          </AnimatedPressable>
        ) : (
          <View
            style={[
              styles.customInputCard,
              {
                backgroundColor: C.backgroundCard,
                borderColor: C.border,
              },
            ]}
          >
            <AppTextInput
              value={customText}
              onChangeText={setCustomText}
              placeholder={t("activity.customNiyyahPlaceholder")}
              multiline
            />
            <View style={styles.editActions}>
              <AppButton
                variant='ghost'
                label={t("common.cancel")}
                onPress={() => setShowAddCustom(false)}
              />
              <AppButton
                variant='primary'
                label={t("common.add")}
                onPress={handleAdd}
                disabled={!customText.trim()}
              />
            </View>
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  multiHint: { marginTop: -spacing.xs, lineHeight: 18 },
  niyyahOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  optionText: { lineHeight: 20 },
  roleBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    alignSelf: "flex-start",
  },
  optionTextAr: {
    textAlign: "right",
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  addCustomBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderStyle: "dashed",
    marginTop: spacing.sm,
  },
  customInputCard: {
    borderRadius: radius.sm,
    padding: spacing.md,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  editActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
    justifyContent: "flex-end",
  },
});
