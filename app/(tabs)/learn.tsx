import Colors from "@/constants/colors";
import { EDUCATION_ENTRIES, type EducationEntry } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/src/i18n";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { AppText } from "@/components/UI/AppText";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CATEGORIES = [
  "All",
  "Foundations",
  "Work",
  "Health",
  "Daily Life",
  "Worship",
  "Relationships",
  "Learning",
];

function EducationCard({
  entry,
  lang,
  mapCategoryLabel,
  onPress,
}: {
  entry: EducationEntry;
  lang: "en" | "ar";
  mapCategoryLabel: (category: string) => string;
  onPress: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;

  const categoryColors: Record<string, string> = {
    Foundations: "#C9A84C",
    Work: "#3B82F6",
    Health: "#EF4444",
    "Daily Life": "#2D7A4F",
    Worship: "#8B5CF6",
    Relationships: "#EC4899",
    Learning: "#059669",
  };
  const catColor = categoryColors[entry.category] || C.tint;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.eduCard,
        {
          backgroundColor: C.backgroundCard,
          borderColor: C.border,
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
      <View
        style={[styles.categoryBadge, { backgroundColor: catColor + "18" }]}
      >
        <AppText
          weight="Bold"
          style={[
            styles.categoryBadgeText,
            { color: catColor },
          ]}
        >
          {mapCategoryLabel(entry.category)}
        </AppText>
      </View>
      <AppText
        weight="Bold"
        style={[
          styles.eduTitle,
          { color: C.text },
        ]}
        numberOfLines={2}
      >
        {lang === "ar" && entry.titleAr ? entry.titleAr : entry.title}
      </AppText>
      <AppText
        weight="Regular"
        style={[
          styles.eduPreview,
          { color: C.textSecondary },
        ]}
        numberOfLines={3}
      >
        {lang === "ar" && entry.contentAr ? entry.contentAr : entry.content}
      </AppText>
      <View style={styles.eduFooter}>
        <View style={styles.sourceRow}>
          <Feather name="book-open" size={11} color={C.tint} />
          <AppText
            weight="Regular"
            style={[
              styles.sourceText,
              { color: C.tint },
            ]}
          >
            {entry.source}
          </AppText>
        </View>
        <Feather name="chevron-right" size={16} color={C.textMuted} />
      </View>
    </Pressable>
  );
}

function EducationDetail({
  entry,
  lang,
  showBilingual,
  mapCategoryLabel,
  onClose,
}: {
  entry: EducationEntry;
  lang: "en" | "ar";
  showBilingual: boolean;
  mapCategoryLabel: (category: string) => string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

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
        <TouchableOpacity
          onPress={onClose}
          style={[
            styles.closeButton,
            { backgroundColor: C.backgroundSecondary },
          ]}
        >
          <Feather name="arrow-left" size={20} color={C.text} />
        </TouchableOpacity>

        <LinearGradient
          colors={isDark ? ["#1A3326", "#0D2E1F"] : ["#2D7A4F", "#1A5C38"]}
          style={styles.detailHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={[styles.detailCategoryBadge]}>
            <AppText
              weight="Medium"
              style={styles.detailCategoryText}
            >
              {mapCategoryLabel(entry.category)}
            </AppText>
          </View>
          <AppText weight="Bold" style={styles.detailTitle}>
            {lang === "ar" && entry.titleAr ? entry.titleAr : entry.title}
          </AppText>
          {entry.titleAr && (showBilingual || lang === "en") && (
            <AppText
              weight="Regular"
              style={styles.detailTitleAr}
            >
              {entry.titleAr}
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
            weight="Regular"
            style={[
              styles.detailText,
              { color: C.text },
            ]}
          >
            {lang === "ar" && entry.contentAr ? entry.contentAr : entry.content}
          </AppText>
        </View>

        {entry.contentAr && (showBilingual || lang === "en") && (
          <View
            style={[
              styles.arabicBody,
              { backgroundColor: C.backgroundCard, borderColor: C.border },
            ]}
          >
            <AppText
              weight="Medium"
              style={[
                styles.arabicLabel,
                { color: C.textSecondary },
              ]}
            >
              {t("learn.arabicSection")}
            </AppText>
            <AppText weight="Regular" style={[styles.arabicBodyText, { color: C.text }]}>
              {entry.contentAr}
            </AppText>
          </View>
        )}

        <View
          style={[
            styles.sourceCard,
            { backgroundColor: C.successLight, borderColor: C.tint + "30" },
          ]}
        >
          <Feather name="book-open" size={16} color={C.tint} />
          <View>
            <AppText
              weight="Bold"
              style={[
                styles.sourceLabel,
                { color: C.tint },
              ]}
            >
              {t("common.source")}
            </AppText>
            <AppText
              weight="Regular"
              style={[
                styles.sourceRef,
                { color: C.tint },
              ]}
            >
              {entry.source}
            </AppText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function LearnScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { settings } = useApp();
  const { language: lang } = useLanguage();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedEntry, setSelectedEntry] = useState<EducationEntry | null>(
    null,
  );

  const filtered = useMemo(() => {
    return EDUCATION_ENTRIES.filter((e) => {
      const matchSearch =
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.titleAr.toLowerCase().includes(search.toLowerCase()) ||
        e.keywords.some((k) =>
          k.toLowerCase().includes(search.toLowerCase()),
        ) ||
        e.content.toLowerCase().includes(search.toLowerCase()) ||
        e.contentAr.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        activeCategory === "All" || e.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  const mapCategoryLabel = (category: string) => {
    if (category === "All") return t("learn.category.all");
    if (category === "Foundations") return t("learn.category.foundations");
    if (category === "Work") return t("reminders.category.productivity");
    if (category === "Health") return t("reminders.category.health");
    if (category === "Daily Life") return t("reminders.category.daily");
    if (category === "Worship") return t("reminders.category.worship");
    if (category === "Relationships")
      return t("reminders.category.relationships");
    if (category === "Learning") return t("reminders.category.learning");
    return category;
  };

  if (selectedEntry) {
    return (
      <EducationDetail
        entry={selectedEntry}
        lang={lang}
        showBilingual={settings.showBilingual}
        mapCategoryLabel={mapCategoryLabel}
        onClose={() => setSelectedEntry(null)}
      />
    );
  }

  const topPadding = isWeb ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding + 16, paddingBottom: isWeb ? 34 + 84 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <AppText
          weight="Bold"
          style={[styles.title, { color: C.text }]}
        >
          {t("learn.title")}
        </AppText>
        <AppText
          weight="Regular"
          style={[
            styles.subtitle,
            { color: C.textSecondary },
          ]}
        >
          {t("learn.subtitle")}
        </AppText>

        {/* Search */}
        <View
          style={[
            styles.searchBar,
            { backgroundColor: C.backgroundSecondary, borderColor: C.border },
          ]}
        >
          <Feather name="search" size={16} color={C.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t("learn.searchPlaceholder")}
            placeholderTextColor={C.textMuted}
            style={[
              styles.searchInput,
              { color: C.text },
            ]}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={C.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    activeCategory === cat ? C.tint : C.backgroundSecondary,
                  borderColor: activeCategory === cat ? C.tint : C.border,
                },
              ]}
            >
              <AppText
                weight="Medium"
                style={[
                  styles.filterText,
                  {
                    color: activeCategory === cat ? "#FFF" : C.textSecondary,
                  },
                ]}
              >
                {mapCategoryLabel(cat)}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Count */}
        <AppText
          weight="Regular"
          style={[
            styles.count,
            { color: C.textMuted },
          ]}
        >
          {t(
            filtered.length === 1
              ? "learn.entryCount.one"
              : "learn.entryCount.other",
            { count: filtered.length },
          )}
        </AppText>

        {/* Entries */}
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="book-open" size={32} color={C.textMuted} />
            <AppText
              weight="Regular"
              style={[
                styles.emptyText,
                { color: C.textSecondary },
              ]}
            >
              {t("learn.noResults")}
            </AppText>
          </View>
        ) : (
          filtered.map((entry) => (
            <EducationCard
              key={entry.id}
              entry={entry}
              lang={lang}
              mapCategoryLabel={mapCategoryLabel}
              onPress={() => setSelectedEntry(entry)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  title: { fontSize: 28, marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 16 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: "Tajawal-Regular" },
  filterScroll: { marginBottom: 12 },
  filterContent: { gap: 8, paddingRight: 20 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: { fontSize: 13 },
  count: { fontSize: 13, marginBottom: 16 },
  eduCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 10,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryBadgeText: { fontSize: 11 },
  eduTitle: { fontSize: 16, lineHeight: 22 },
  eduPreview: { fontSize: 13, lineHeight: 20 },
  eduFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  sourceRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  sourceText: { fontSize: 11 },
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 12 },
  emptyText: { fontSize: 15 },
  // Detail styles
  detailContainer: { flex: 1 },
  detailContent: { paddingHorizontal: 20 },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  detailHeader: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    gap: 10,
  },
  detailCategoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  detailCategoryText: { fontSize: 12, color: "rgba(255,255,255,0.9)" },
  detailTitle: { fontSize: 22, color: "#FFF", lineHeight: 30 },
  detailTitleAr: {
    fontSize: 15,
    color: "rgba(255,255,255,0.75)",
    textAlign: "right",
  },
  detailBody: {
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  detailText: { fontSize: 15, lineHeight: 26 },
  arabicBody: {
    borderRadius: 14,
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
