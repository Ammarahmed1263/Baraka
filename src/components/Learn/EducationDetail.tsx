import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppIcon } from "@components/UI/AppIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "@components/UI/AppText";
import { type EducationEntry } from "@types";
import { useLocalize } from "@hooks/useLocalize";
import { useTheme } from "@context/ThemeContext";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";

interface EducationDetailProps {
  entry: EducationEntry;
  showBilingual: boolean;
  mapCategoryLabel: (category: string) => string;
  onClose: () => void;
}

export default function EducationDetail({
  entry,
  showBilingual,
  mapCategoryLabel,
  onClose,
}: EducationDetailProps) {
  const { t } = useTranslation();
  const { colors: C, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const localize = useLocalize();

  return (
    <View style={[styles.detailContainer, { backgroundColor: C.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.detailContent,
          {
            paddingTop: (isWeb ? 67 : insets.top) + spacing.lg,
            paddingBottom: isWeb ? 34 : insets.bottom + spacing.xxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedPressable
          onPress={onClose}
          style={[
            styles.closeButton,
            { backgroundColor: C.backgroundSubtle, borderColor: C.border },
          ]}
        >
          <AppIcon
            name="chevron-left"
            size={24}
            color={C.text}
            flipRTL
          />
        </AnimatedPressable>

        <LinearGradient
          colors={C.cardGradient}
          style={[
            styles.detailHeader,
            {
              shadowColor: isDark ? "transparent" : C.shadowColor,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isDark ? 0 : 0.08,
              shadowRadius: 4,
              elevation: isDark ? 0 : 2,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View
            style={[
              styles.detailCategoryBadge,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.15)"
                  : C.backgroundSubtle,
              },
            ]}
          >
            <AppText weight='Medium' variant='caption' style={{ color: C.textSecondary }}>
              {mapCategoryLabel(entry.category)}
            </AppText>
          </View>
          <AppText weight='Bold' variant='titleLarge' style={[styles.detailTitle, { color: C.text }]}>
            {localize(entry.title)}
          </AppText>
          {showBilingual && (
            <AppText
              weight='Regular'
              variant='bodyLarge'
              style={[styles.detailTitleAr, { color: C.textSecondary }]}
            >
              {entry.title.ar}
            </AppText>
          )}
        </LinearGradient>

        <View
          style={[
            styles.detailBody,
            { backgroundColor: C.backgroundCard, borderColor: C.border },
          ]}
        >
          <AppText weight='Regular' variant='bodyLarge' style={[styles.detailText, { color: C.text }]}>
            {localize(entry.content)}
          </AppText>
        </View>

        {showBilingual && (
          <View
            style={[
              styles.arabicBody,
              { backgroundColor: C.backgroundCard, borderColor: C.border },
            ]}
          >
            <AppText weight='Medium' variant='caption' style={{ color: C.textSecondary }}>
              {t("learn.arabicSection")}
            </AppText>
            <AppText
              weight='Regular'
              variant='bodyLarge'
              style={[styles.arabicBodyText, { color: C.text }]}
            >
              {entry.content.ar}
            </AppText>
          </View>
        )}

        <View
          style={[
            styles.sourceCard,
            { backgroundColor: C.successLight, borderColor: C.tint + "30" },
          ]}
        >
          <Feather name='book-open' size={16} color={C.tint} />
          <View style={{ flex: 1 }}>
            <AppText weight='Bold' variant='caption' style={{ color: C.tint }}>
              {t("common.source")}
            </AppText>
            <AppText weight='Regular' variant='body' style={{ color: C.tint }}>
              {localize(entry.source)}
            </AppText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  detailContainer: { flex: 1 },
  detailContent: { paddingHorizontal: spacing.xl },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    borderWidth: 1,
  },
  detailHeader: {
    borderRadius: radius.lg,
    padding: spacing.xxl,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  detailCategoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  detailTitle: { lineHeight: 32 },
  detailTitleAr: {
    textAlign: "right",
  },
  detailBody: {
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  detailText: { lineHeight: 26 },
  arabicBody: {
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  arabicBodyText: {
    textAlign: "right",
    lineHeight: 28,
  },
  sourceCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
