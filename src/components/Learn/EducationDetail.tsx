import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import {
  I18nManager,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "@components/UI/AppText";
import { type EducationEntry } from "@types";
import { useLocalize } from "@hooks/useLocalize";
import { useTheme } from "@context/ThemeContext";

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
            paddingTop: (isWeb ? 67 : insets.top) + 16,
            paddingBottom: isWeb ? 34 : insets.bottom + 24,
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
          <Feather
            name={I18nManager.isRTL ? "arrow-right" : "arrow-left"}
            size={20}
            color={C.text}
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
            <AppText
              weight='Medium'
              style={[styles.detailCategoryText, { color: C.textSecondary }]}
            >
              {mapCategoryLabel(entry.category)}
            </AppText>
          </View>
          <AppText
            weight='Bold'
            style={[styles.detailTitle, { color: C.text }]}
          >
            {localize(entry.title)}
          </AppText>
          {showBilingual && (
            <AppText
              weight='Regular'
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
          <AppText
            weight='Regular'
            style={[styles.detailText, { color: C.text }]}
          >
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
            <AppText
              weight='Medium'
              style={[styles.arabicLabel, { color: C.textSecondary }]}
            >
              {t("learn.arabicSection")}
            </AppText>
            <AppText
              weight='Regular'
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
            <AppText
              weight='Bold'
              style={[styles.sourceLabel, { color: C.tint }]}
            >
              {t("common.source")}
            </AppText>
            <AppText
              weight='Regular'
              style={[styles.sourceRef, { color: C.tint }]}
            >
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
  detailContent: { paddingHorizontal: 20 },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
  },
  detailHeader: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    gap: 10,
  },
  detailCategoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailCategoryText: { fontSize: 12 },
  detailTitle: { fontSize: 24, lineHeight: 32 },
  detailTitleAr: {
    fontSize: 16,
    textAlign: "right",
  },
  detailBody: {
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  detailText: { fontSize: 16, lineHeight: 26 },
  arabicBody: {
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },
  arabicLabel: { fontSize: 12 },
  arabicBodyText: {
    fontSize: 16,
    textAlign: "right",
    lineHeight: 28,
  },
  sourceCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sourceLabel: { fontSize: 12 },
  sourceRef: { fontSize: 14 },
});
