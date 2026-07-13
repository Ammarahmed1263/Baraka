import { ScrollView, StyleSheet } from "react-native";
import { AnimatedPressable } from "./AnimatedPressable";
import { AppText } from "./AppText";
import { Feather } from "@expo/vector-icons";
import { Haptic } from "@utils/haptics";
import { useTheme } from "@context/ThemeContext";

interface ChipItem {
  label: string;
  value: string;
  leftIcon?: keyof typeof Feather.glyphMap;
}

interface ChipSelectorProps {
  items: ChipItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
  style?: any;
  contentContainerStyle?: any;
}

export function ChipSelector({
  items,
  selectedValue,
  onSelect,
  style,
  contentContainerStyle,
}: ChipSelectorProps) {
  const { colors: C } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.scroll, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
    >
      {items.map((item) => {
        const isSelected = selectedValue === item.value;
        return (
          <AnimatedPressable
            key={item.value}
            scaleDownTo={0.94}
            onPress={() => {
              Haptic.selection();
              onSelect(item.value);
            }}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? C.tint : C.backgroundSubtle,
                borderColor: isSelected ? C.tint : C.border,
              },
            ]}
          >
            {item.leftIcon && (
              <Feather
                name={item.leftIcon}
                size={14}
                color={isSelected ? C.textOnTint : C.textSecondary}
                style={{ marginRight: 6 }}
              />
            )}
            <AppText
              weight='Medium'
              numberOfLines={1}
              style={[
                styles.text,
                {
                  color: isSelected ? C.textOnTint : C.textSecondary,
                },
              ]}
            >
              {item.label}
            </AppText>
          </AnimatedPressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: 16,
  },
  content: {
    gap: 8,
    paddingHorizontal: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
  },
});
