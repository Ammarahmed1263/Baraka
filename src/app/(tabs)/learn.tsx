import Colors from "@constants/colors";
import { type EducationEntry } from "@types";
import { EDUCATION_ENTRIES } from "@data/learnContent";

import { useSettingsStore } from "@store";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "@components/UI/AppText";
import EducationCard from "@components/Learn/EducationCard";
import EducationDetail from "@components/Learn/EducationDetail";

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

export default function LearnScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const settings = useSettingsStore((s) => s.settings);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedEntry, setSelectedEntry] = useState<EducationEntry | null>(
    null,
  );

  const filtered = useMemo(() => {
    return EDUCATION_ENTRIES.filter((e) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        e.title.en.toLowerCase().includes(q) ||
        e.title.ar.toLowerCase().includes(q) ||
        e.keywords.some((k) => k.toLowerCase().includes(q)) ||
        e.content.en.toLowerCase().includes(q) ||
        e.content.ar.toLowerCase().includes(q);
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
            { backgroundColor: C.backgroundSubtle, borderColor: C.border },
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
                    activeCategory === cat ? C.tint : C.backgroundSubtle,
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
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 12 },
  emptyText: { fontSize: 15 },
});


