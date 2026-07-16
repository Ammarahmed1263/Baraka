import { EDUCATION_ENTRIES, LEARN_CATEGORIES } from "@data/learnContent";

import EducationCard from "@components/Learn/EducationCard";
import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppText } from "@components/UI/AppText";
import { AppTextInput } from "@components/UI/AppTextInput";
import { ChipSelector } from "@components/UI/ChipSelector";
import { useTheme } from "@context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "@constants/spacing";

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
          { paddingTop: topPadding + spacing.lg, paddingBottom: isWeb ? 34 + 84 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppText weight='Bold' variant='hero' style={[styles.title, { color: C.gold }]}>
          {t("learn.title")}
        </AppText>
        <AppText
          weight='Regular'
          variant='body'
          style={[styles.subtitle, { color: C.textSecondary }]}
        >
          {t("learn.subtitle")}
        </AppText>

        <View style={{ marginBottom: spacing.md }}>
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

        <ChipSelector
          items={LEARN_CATEGORIES.map(cat => ({ label: t("category." + cat), value: cat }))}
          selectedValue={activeCategory}
          onSelect={setActiveCategory}
          style={styles.filterScroll}
        />

        <AppText
          weight='Regular'
          variant='footnote'
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
              variant='bodyLarge'
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
              style={{ marginBottom: spacing.md }}
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
  scrollContent: { paddingHorizontal: spacing.xl },
  title: { marginBottom: spacing.xs },
  subtitle: { marginBottom: spacing.lg },
  filterScroll: { marginBottom: spacing.md, marginHorizontal: -spacing.xl },
  count: { marginBottom: spacing.lg },
  emptyState: { alignItems: "center", paddingVertical: spacing.huge, gap: spacing.md },
  emptyText: {},
});
