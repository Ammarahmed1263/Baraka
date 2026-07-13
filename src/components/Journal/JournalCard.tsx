import { Feather } from "@expo/vector-icons";
import { StyleSheet, View, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { AppText } from "@components/UI/AppText";
import { NIYYAH_OPTIONS } from "@data/niyyahTemplates";
import { useLocalize } from "@hooks/useLocalize";
import { type JournalEntry } from "@types";
import { useTheme } from "@context/ThemeContext";

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
            <AppText
              weight='Bold'
              style={[styles.activityChipText, { color: C.tint }]}
            >
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
              <AppText
                weight='Bold'
                style={[styles.countChipText, { color: C.gold }]}
              >
                ×{entry.selectedNiyyahCount}
              </AppText>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <View style={styles.dateInfo}>
            <AppText
              weight='Regular'
              style={[styles.dateText, { color: C.textMuted }]}
            >
              {formattedDate}
            </AppText>
            <AppText
              weight='Regular'
              style={[styles.timeText, { color: C.textMuted }]}
            >
              {formattedTime}
            </AppText>
          </View>
          <Pressable
            onPress={() => onOptions?.(entry)}
            hitSlop={8}
            style={styles.menuButton}
          >
            <Feather name='more-vertical' size={18} color={C.textMuted} />
          </Pressable>
        </View>
      </View>
      <AppText weight='Regular' style={[styles.noteText, { color: C.text }]}>
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
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  cardChips: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
  },
  activityChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activityChipText: { fontSize: 12 },
  countChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  countChipText: { fontSize: 12 },
  dateInfo: { alignItems: "flex-end", gap: 2 },
  dateText: { fontSize: 12 },
  timeText: { fontSize: 12 },
  menuButton: {
    paddingTop: 2,
  },
  noteText: { fontSize: 16, lineHeight: 24 },
  impactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 2,
  },
  impactText: { flex: 1, fontSize: 12 },
});
