import { AnimatedPressable } from "@components/UI/AnimatedPressable";
import { AppText } from "@components/UI/AppText";
import { useTheme } from "@context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { useActivitiesStore } from "@store";
import { type UserActivity } from "@types";
import { Haptic } from "@utils/haptics";
import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AddActivityForm from "@components/Reminders/AddActivityForm";
import CategorySection from "@components/Reminders/CategorySection";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function RemindersScreen() {
  const { t } = useTranslation();
  const { colors: C } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const activities = useActivitiesStore((s) => s.activities);
  const toggleActivity = useActivitiesStore((s) => s.toggleActivity);
  const [showAddForm, setShowAddForm] = useState(false);
  // const [loading, setLoading] = useState(true);

  // TODO: re-enable when data source changes to API/Realm
  // useEffect(() => {
  //   const timer = setTimeout(() => setLoading(false), 800);
  //   return () => clearTimeout(timer);
  // }, []);

  const categoryGroups = useMemo(() => {
    const cats = [...new Set(activities.map((a) => a.category))];
    return cats.map((category) => ({
      category,
      activities: activities.filter((a) => a.category === category),
    }));
  }, [activities]);

  const handleToggle = useCallback((activity: UserActivity) => {
    Haptic.selection();
    toggleActivity(activity.id);
  }, [toggleActivity]);

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
        <View style={styles.header}>
          <View>
            <AppText weight='Bold' style={[styles.title, { color: C.gold }]}>
              {t("reminders.title")}
            </AppText>
            <AppText
              weight='Regular'
              style={[styles.subtitle, { color: C.textSecondary }]}
            >
              {t("reminders.subtitle")}
            </AppText>
          </View>
          <AnimatedPressable
            onPress={() => setShowAddForm(!showAddForm)}
            style={[styles.addButton, { backgroundColor: C.tint }]}
          >
            <Feather
              name={showAddForm ? "x" : "plus"}
              size={20}
              color={C.background}
            />
          </AnimatedPressable>
        </View>

        {/* Add Form */}
        {showAddForm && (
          <AddActivityForm onClose={() => setShowAddForm(false)} />
        )}

        {/* {loading ? (
          <View style={{ gap: 20 }}>
            <View style={{ gap: 8 }}>
              <Skeleton width={100} height={12} style={{ marginLeft: 4 }} />
              <Skeleton height={140} borderRadius={14} />
            </View>
            <View style={{ gap: 8 }}>
              <Skeleton width={120} height={12} style={{ marginLeft: 4 }} />
              <Skeleton height={190} borderRadius={14} />
            </View>
          </View>
        ) : ( */}
          <>
            {/* Activity List by Category */}
            {categoryGroups.map((group, index) => {
              return (
                <Animated.View
                  key={group.category}
                  entering={FadeInDown.delay(index * 50).duration(250)}
                  style={{ marginBottom: 20 }}
                >
                  <CategorySection
                    category={group.category}
                    categoryActivities={group.activities}
                    onToggleActivity={handleToggle}
                  />
                </Animated.View>
              );
            })}
          </>
        {/* )} */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: { fontSize: 28, marginBottom: 4 },
  subtitle: { fontSize: 14 },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
