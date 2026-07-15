import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AppText } from "@components/UI/AppText";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { NIYYAH_OPTIONS } from "@data/niyyahTemplates";
import { useLocalize } from "@hooks/useLocalize";
import { type JournalEntry } from "@types";
import { useTheme } from "@context/ThemeContext";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

interface JournalCardProps {
  entry: JournalEntry;
  onOptions?: (entry: JournalEntry) => void;
}

export default function JournalCard({ entry, onOptions }: JournalCardProps) {
  const { colors: C } = useTheme();
  const localize = useLocalize();
  const { i18n } = useTranslation();
  const lang = i18n.language as "en" | "ar";

  const formattedDate = new Date(entry.createdAt).toLocaleDateString(
    lang === "ar" ? "ar-SA" : "en-US",
    { weekday: "short", month: "short", day: "numeric" },
  );
  const formattedTime = new Date(entry.createdAt).toLocaleTimeString(
    lang === "ar" ? "ar-SA" : "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const impactfulOption = entry.impactfulNiyyah
    ? NIYYAH_OPTIONS.find((n) => n.id === entry.impactfulNiyyah)
    : null;

  const activityDisplayName = localize(entry.activityName);

  return (
    <View
      style={[
        styles.journalCard,
        { backgroundColor: C.backgroundCard, borderColor: C.border },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardChips}>
          <View
            style={[styles.activityChip, { backgroundColor: C.tint + "18" }]}
          >
            <AppText weight='Bold' variant='caption' style={{ color: C.tint }}>
              {activityDisplayName}
            </AppText>
          </View>
          {(entry.selectedNiyyahCount ?? 0) > 1 && (
            <View
              style={[
                styles.countChip,
                {
                  backgroundColor: C.gold + "22",
                  borderColor: C.gold + "55",
                },
              ]}
            >
              <Feather name='star' size={10} color={C.gold} />
              <AppText weight='Bold' variant='caption' style={{ color: C.gold }}>
                ×{entry.selectedNiyyahCount}
              </AppText>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <View style={styles.dateInfo}>
            <AppText weight='Regular' variant='caption' style={{ color: C.textMuted }}>
              {formattedDate}
            </AppText>
            <AppText weight='Regular' variant='caption' style={{ color: C.textMuted }}>
              {formattedTime}
            </AppText>
          </View>
          <AnimatedPressable
            onPress={() => onOptions?.(entry)}
            hitSlop={8}
            scaleDownTo={0.85}
            style={styles.menuButton}
          >
            <Feather name='more-vertical' size={18} color={C.textMuted} />
          </AnimatedPressable>
        </View>
      </View>
      <AppText weight='Regular' variant='bodyLarge' style={[styles.noteText, { color: C.text }]}>
        {entry.note}
      </AppText>
      {impactfulOption && (
        <View
          style={[
            styles.impactRow,
            { backgroundColor: C.gold + "11", borderColor: C.gold + "33" },
          ]}
        >
          <Feather name='heart' size={12} color={C.gold} />
          <AppText
            weight='Regular'
            variant='caption'
            style={[styles.impactText, { color: C.gold }]}
          >
            {localize(impactfulOption.text)}
          </AppText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  journalCard: {
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  cardChips: {
    flexDirection: "row",
    gap: spacing.xs,
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
  },
  activityChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  countChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  dateInfo: { alignItems: "flex-end", gap: spacing.xs },
  menuButton: {
    paddingTop: spacing.xs,
  },
  noteText: { lineHeight: 24 },
  impactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    marginTop: spacing.xs,
  },
  impactText: { flex: 1 },
});
