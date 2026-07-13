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

interface NiyyahChecklistProps {
  allAdvanced: NiyyahOption[];
  localSelected: string[];
  onToggleNiyyah: (id: string) => void;
  onAddCustomNiyyah: (text: string, textAr: string) => void;
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
    const [customTextAr, setCustomTextAr] = useState("");

    const handleAdd = () => {
      onAddCustomNiyyah(customText, customTextAr);
      setCustomText("");
      setCustomTextAr("");
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
            style={[styles.sectionLabel, { color: C.gold }]}
          >
            {t("activity.multiplyIntentions")}
          </AppText>
          <AppText
            weight='Bold'
            style={[styles.selectedCount, { color: C.tint }]}
          >
            {t("activity.selectedCount", { count: localSelected.length })}
          </AppText>
        </View>
        <AppText
          weight='Regular'
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
                <View style={styles.optionHeader}>
                  <AppText
                    weight={checked ? "Medium" : "Regular"}
                    style={[
                      styles.optionText,
                      { color: checked ? C.text : C.textSecondary },
                    ]}
                  >
                    {localize(option.text)}
                  </AppText>
                  {option.profileTags &&
                    option.profileTags.map((tag) => {
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
                            style={[styles.roleBadgeText, { color: roleColor }]}
                          >
                            {t(`settings.profile.${tag}`)}
                          </AppText>
                        </View>
                      );
                    })}
                </View>
                {showBilingual && (
                  <AppText
                    weight='Regular'
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
            <AppText
              weight='Medium'
              style={[styles.addCustomText, { color: C.tintLight }]}
            >
              {t("activity.addCustomIntention")}
            </AppText>
          </AnimatedPressable>
        ) : (
          <View
            style={[
              styles.customInputCard,
              {
                backgroundColor: C.backgroundSubtle,
                borderColor: C.border,
              },
            ]}
          >
            <AppTextInput
              value={customText}
              onChangeText={setCustomText}
              placeholder={t("activity.customEnPlaceholder")}
            />
            <AppTextInput
              value={customTextAr}
              onChangeText={setCustomTextAr}
              placeholder={t("activity.customArPlaceholder")}
              textAlign='right'
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
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  selectedCount: { fontSize: 12 },
  multiHint: { fontSize: 13, lineHeight: 18, marginTop: -4 },
  niyyahOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  optionText: { fontSize: 14, lineHeight: 20, flex: 1 },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  roleBadgeText: { fontSize: 10 },
  optionTextAr: {
    fontSize: 13,
    textAlign: "right",
    lineHeight: 20,
    marginTop: 2,
  },
  addCustomBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    marginTop: 6,
  },
  addCustomText: { fontSize: 14 },
  customInputCard: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    gap: 8,
    marginTop: 6,
  },
  editActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    justifyContent: "flex-end",
  },
});
