import { EDUCATION_ENTRIES } from "@data/learnContent";
import { type EducationEntry } from "@types";

import EducationCard from "@components/Learn/EducationCard";
import EducationDetail from "@components/Learn/EducationDetail";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppText } from "@components/UI/AppText";
import { AppTextInput } from "@components/UI/AppTextInput";
import { useTheme } from "@context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { useSettingsStore } from "@store";
import { Haptic } from "@utils/haptics";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
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

export default function LearnScreen() {
  const { t } = useTranslation();
  const { colors: C } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const settings = useSettingsStore((s) => s.settings);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedEntry, setSelectedEntry] = useState<EducationEntry | null>(
    null,
  );
  // const [loading, setLoading] = useState(true);

  // TODO: re-enable when data source changes to API/Realm
  // useEffect(() => {
  //   const timer = setTimeout(() => setLoading(false), 800);
  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    if (!selectedEntry) return;

    const backAction = () => {
      setSelectedEntry(null);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [selectedEntry]);

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
    switch (category) {
      case "All":
        return t("learn.category.all");
      case "Foundations":
        return t("learn.category.foundations");
      case "Work":
        return t("reminders.category.productivity");
      case "Health":
        return t("reminders.category.health");
      case "Daily Life":
        return t("reminders.category.daily");
      case "Worship":
        return t("reminders.category.worship");
      case "Relationships":
        return t("reminders.category.relationships");
      case "Learning":
        return t("reminders.category.learning");
      default:
        return category;
    }
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
        <AppText weight='Bold' style={[styles.title, { color: C.gold }]}>
          {t("learn.title")}
        </AppText>
        <AppText
          weight='Regular'
          style={[styles.subtitle, { color: C.textSecondary }]}
        >
          {t("learn.subtitle")}
        </AppText>

        {/* Search */}
        <View style={{ marginBottom: 14 }}>
          <AppTextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t("learn.searchPlaceholder")}
            leftIcon='search'
            rightIcon={
              search.length > 0 ? (
                <AnimatedPressable onPress={() => setSearch("")}>
                  <Feather name='x' size={16} color={C.textMuted} />
                </AnimatedPressable>
              ) : undefined
            }
          />
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {CATEGORIES.map((cat) => (
            <AnimatedPressable
              key={cat}
              scaleDownTo={0.94}
              onPress={() => {
                Haptic.selection();
                setActiveCategory(cat);
              }}
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
                weight='Medium'
                style={[
                  styles.filterText,
                  {
                    color: activeCategory === cat ? "#FFF" : C.textSecondary,
                  },
                ]}
              >
                {mapCategoryLabel(cat)}
              </AppText>
            </AnimatedPressable>
          ))}
        </ScrollView>

        {/* {loading ? (
          <>
            <Skeleton width={80} height={14} style={{ marginBottom: 16 }} />

            <View style={{ gap: 12 }}>
              <Skeleton height={140} borderRadius={14} />
              <Skeleton height={140} borderRadius={14} />
              <Skeleton height={140} borderRadius={14} />
            </View>
          </>
        ) : ( */}
          <>
            {/* Count */}
            <AppText
              weight='Regular'
              style={[styles.count, { color: C.textMuted }]}
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
                <Feather name='book-open' size={32} color={C.textMuted} />
                <AppText
                  weight='Regular'
                  style={[styles.emptyText, { color: C.textSecondary }]}
                >
                  {t("learn.noResults")}
                </AppText>
              </View>
            ) : (
              filtered.map((entry, index) => (
                <Animated.View
                  key={entry.id}
                  entering={FadeInDown.delay(index * 50).duration(250)}
                  style={{ marginBottom: 12 }}
                >
                  <EducationCard
                    entry={entry}
                    mapCategoryLabel={mapCategoryLabel}
                    onPress={() => setSelectedEntry(entry)}
                  />
                </Animated.View>
              ))
            )}
          </>
        {/* )} */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  title: { fontSize: 28, marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 16 },
  filterScroll: { marginBottom: 12, marginHorizontal: -20 },
  filterContent: { gap: 8, paddingHorizontal: 20 },
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
