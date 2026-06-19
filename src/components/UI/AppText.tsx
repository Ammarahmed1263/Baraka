import { forwardRef } from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "@context/ThemeContext";

type FontWeight = "Light" | "Regular" | "Medium" | "Bold";

interface AppTextProps extends TextProps {
  weight?: FontWeight;
}

export const AppText = forwardRef<Text, AppTextProps>(
  ({ weight = "Regular", style, ...props }, ref) => {
    const { colors: C } = useTheme();
    const fontFamily = `Tajawal-${weight}`;

    return (
      <Text
        ref={ref}
        style={[
          {
            fontFamily,
            color: C.text,
            letterSpacing: 0,
          },
          style,
        ]}
        {...props}
      />
    );
  },
);
