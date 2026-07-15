import { forwardRef } from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useLanguage } from "@i18n";
import { typography, TypographyVariant } from "@constants/typography";

type FontWeight = "Light" | "Regular" | "Medium" | "Bold";

interface AppTextProps extends TextProps {
  weight?: FontWeight;
  variant?: TypographyVariant;
}

export const AppText = forwardRef<Text, AppTextProps>(
  ({ weight = "Regular", variant, style, ...props }, ref) => {
    const { colors: C } = useTheme();
    const { language } = useLanguage();
    const isAr = language === "ar";
    const fontFamily = `${isAr ? "Tajawal" : "SourceSerif4"}-${weight}`;
    const typeStyle = variant ? typography[variant][isAr ? "ar" : "en"] : undefined;

    return (
      <Text
        ref={ref}
        style={[
          {
            fontFamily,
            color: C.text,
            letterSpacing: 0,
          },
          typeStyle,
          style,
        ]}
        {...props}
      />
    );
  },
);
