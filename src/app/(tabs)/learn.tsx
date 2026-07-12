import { EDUCATION_ENTRIES, LEARN_CATEGORIES } from "@data/learnContent";

import EducationCard from "@components/Learn/EducationCard";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppText } from "@components/UI/AppText";
import { AppTextInput } from "@components/UI/AppTextInput";
import { useTheme } from "@context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { Haptic } from "@utils/haptics";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function LearnScreen() {
  const { t } = useTranslation();
  const { colors: C } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

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
        <AppText weight='Bold' style={[styles.title, { color: C.gold }]}>
          {t("learn.title")}
        </AppText>
        <AppText
          weight='Regular'
          style={[styles.subtitle, { color: C.textSecondary }]}
        >
          {t("learn.subtitle")}
        </AppText>

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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {LEARN_CATEGORIES.map((cat) => (
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
                    color:
                      activeCategory === cat ? C.textOnTint : C.textSecondary,
                  },
                ]}
              >
                {t("category." + cat)}
              </AppText>
            </AnimatedPressable>
          ))}
        </ScrollView>

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
                onPress={() =>
                  router.push({
                    pathname: "/learn/[id]",
                    params: { id: entry.id },
                  })
                }
              />
            </Animated.View>
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
