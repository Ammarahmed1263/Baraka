import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { AppText } from "@/components/UI/AppText";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp, type UserActivity } from "@/context/AppContext";
import { useLanguage } from "@/src/i18n";

const ICON_OPTIONS = [
  "sunrise", "coffee", "briefcase", "activity", "sun", "moon",
  "map-pin", "clock", "heart", "gift", "book-open", "music",
  "camera", "star", "home", "users", "droplet", "feather",
];

const COLOR_OPTIONS = [
  "#2D7A4F", "#C9A84C", "#3B82F6", "#EF4444", "#EC4899",
  "#8B5CF6", "#F97316", "#10B981", "#6366F1", "#059669",
  "#D97706", "#0891B2",
];

function generateId() {
  return "custom_" + Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

export default function RemindersScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const { activities, toggleActivity, addCustomActivity } = useApp();
  const { language: lang } = useLanguage();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNiyyah, setNewNiyyah] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("star");
  const [selectedColor, setSelectedColor] = useState("#2D7A4F");

  const categories = [...new Set(activities.map((a) => a.category))];

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      worship: t("reminders.category.worship"),
      daily: t("reminders.category.daily"),
      productivity: t("reminders.category.productivity"),
      health: t("reminders.category.health"),
      relationships: t("reminders.category.relationships"),
      learning: t("reminders.category.learning"),
    };
    return labels[cat] || cat;
  };

  const getCategoryIcon = (cat: string): any => {
    const icons: Record<string, string> = {
      worship: "star",
      daily: "sun",
      productivity: "briefcase",
      health: "activity",
      relationships: "heart",
      learning: "book-open",
    };
    return icons[cat] || "circle";
  };

  const handleToggle = async (activity: UserActivity) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await toggleActivity(activity.id);
  };

  const handleAddActivity = async () => {
    if (!newName.trim()) {
      Alert.alert(t("reminders.alert.nameRequiredTitle"), t("reminders.alert.nameRequiredMessage"));
      return;
    }
    const newActivity: Omit<UserActivity, "enabled"> = {
      id: generateId(),
      name: newName.trim(),
      nameAr: lang === "ar" ? newName.trim() : "",
      icon: selectedIcon,
      category: "daily",
      niyyahText: newNiyyah.trim() || t("reminders.defaultIntention", { activity: newName.trim() }),
      niyyahTextAr: lang === "ar" ? newNiyyah.trim() : "",
      color: selectedColor,
    };
    await addCustomActivity(newActivity);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowAddForm(false);
    setNewName("");
    setNewNiyyah("");
    setSelectedIcon("star");
    setSelectedColor("#2D7A4F");
  };

  const topPadding = isWeb ? 67 : insets.top;
  const getActivityDisplayName = (activity: UserActivity) => {
    if (lang === "ar") return activity.nameAr || activity.name;
    return activity.name;
  };

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
            <AppText weight="Bold" style={[styles.title, { color: C.text }]}>
              {t("reminders.title")}
            </AppText>
            <AppText weight="Regular" style={[styles.subtitle, { color: C.textSecondary }]}>
              {t("reminders.subtitle")}
            </AppText>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddForm(!showAddForm)}
            style={[styles.addButton, { backgroundColor: C.tint }]}
          >
            <Feather name={showAddForm ? "x" : "plus"} size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Add Form */}
        {showAddForm && (
          <View
            style={[styles.addForm, { backgroundColor: C.backgroundCard, borderColor: C.border }]}
          >
            <AppText weight="Bold" style={[styles.formTitle, { color: C.text }]}>
              {t("reminders.newActivity")}
            </AppText>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder={t("reminders.activityNamePlaceholder")}
              placeholderTextColor={C.textMuted}
              style={[
                styles.formInput,
                {
                  color: C.text,
                  borderColor: C.border,
                  backgroundColor: C.backgroundSecondary,
                },
              ]}
            />
            <TextInput
              value={newNiyyah}
              onChangeText={setNewNiyyah}
              placeholder={t("reminders.intentionPlaceholder")}
              placeholderTextColor={C.textMuted}
              multiline
              style={[
                styles.formInput,
                styles.formInputMulti,
                {
                  color: C.text,
                  borderColor: C.border,
                  backgroundColor: C.backgroundSecondary,
                },
              ]}
            />

            {/* Icon Picker */}
            <AppText weight="Medium" style={[styles.pickerLabel, { color: C.textSecondary }]}>
              {t("reminders.icon")}
            </AppText>
            <View style={styles.iconPicker}>
              {ICON_OPTIONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => setSelectedIcon(icon)}
                  style={[
                    styles.iconOption,
                    {
                      backgroundColor:
                        selectedIcon === icon ? C.tint + "20" : C.backgroundSecondary,
                      borderColor: selectedIcon === icon ? C.tint : "transparent",
                    },
                  ]}
                >
                  <Feather
                    name={icon as any}
                    size={18}
                    color={selectedIcon === icon ? C.tint : C.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Color Picker */}
            <AppText weight="Medium" style={[styles.pickerLabel, { color: C.textSecondary }]}>
              {t("reminders.color")}
            </AppText>
            <View style={styles.colorPicker}>
              {COLOR_OPTIONS.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected,
                  ]}
                >
                  {selectedColor === color && (
                    <Feather name="check" size={12} color="#FFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleAddActivity}
              style={[styles.formSubmit, { backgroundColor: C.tint }]}
            >
              <AppText weight="Bold" style={styles.formSubmitText}>
                {t("reminders.addActivity")}
              </AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* Activity List by Category */}
        {categories.map((category) => {
          const categoryActivities = activities.filter((a) => a.category === category);
          return (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Feather
                  name={getCategoryIcon(category)}
                  size={14}
                  color={C.textSecondary}
                />
                <AppText
                  weight="Bold"
                  style={[
                    styles.categoryLabel,
                    { color: C.textSecondary },
                  ]}
                >
                  {getCategoryLabel(category)}
                </AppText>
              </View>
              <View
                style={[
                  styles.categoryCard,
                  { backgroundColor: C.backgroundCard, borderColor: C.border },
                ]}
              >
                {categoryActivities.map((activity, index) => (
                  <View key={activity.id}>
                    <View style={styles.activityRow}>
                      <View
                        style={[
                          styles.activityIconWrapper,
                          { backgroundColor: (activity.color || C.tint) + "18" },
                        ]}
                      >
                        <Feather
                          name={(activity.icon as any) || "circle"}
                          size={16}
                          color={activity.color || C.tint}
                        />
                      </View>
                      <View style={styles.activityInfo}>
                        <AppText
                          weight="Medium"
                          style={[
                            styles.activityName,
                            { color: C.text },
                          ]}
                        >
                            {getActivityDisplayName(activity)}
                        </AppText>
                        {activity.hadithRef && (
                          <AppText
                            weight="Regular"
                            style={[
                              styles.activityRef,
                              { color: C.textMuted },
                            ]}
                          >
                            {activity.hadithRef}
                          </AppText>
                        )}
                      </View>
                      <Switch
                        value={activity.enabled}
                        onValueChange={() => handleToggle(activity)}
                        trackColor={{ false: C.border, true: C.tint + "80" }}
                        thumbColor={activity.enabled ? C.tint : C.textMuted}
                        ios_backgroundColor={C.border}
                      />
                    </View>
                    {index < categoryActivities.length - 1 && (
                      <View style={[styles.divider, { backgroundColor: C.borderLight }]} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          );
        })}
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
  addForm: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    gap: 12,
  },
  formTitle: { fontSize: 17, marginBottom: 4 },
  formInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  formInputMulti: { minHeight: 80, textAlignVertical: "top" },
  pickerLabel: { fontSize: 13 },
  iconPicker: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  iconOption: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  colorPicker: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  colorOptionSelected: {
    transform: [{ scale: 1.2 }],
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  formSubmit: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  formSubmitText: { color: "#FFF", fontSize: 16 },
  categorySection: { marginBottom: 20 },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
    paddingLeft: 4,
  },
  categoryLabel: { fontSize: 12, textTransform: "uppercase", letterSpacing: 1 },
  categoryCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  activityIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activityInfo: { flex: 1, gap: 2 },
  activityName: { fontSize: 15 },
  activityRef: { fontSize: 11 },
  divider: { height: 1, marginLeft: 62 },
});
