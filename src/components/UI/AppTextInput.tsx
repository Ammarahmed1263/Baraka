import React, { useState, useMemo } from "react";
import { TextInput, TextInputProps, StyleSheet, View } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { AppText } from "./AppText";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from "@i18n";
import { spacing } from "@constants/spacing";
import { radius } from "@constants/radius";
import { typography } from "@constants/typography";

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightIcon?: React.ReactNode;
}

export function AppTextInput({
  label,
  error,
  style,
  leftIcon,
  rightIcon,
  onFocus,
  onBlur,
  ...props
}: AppTextInputProps) {
  const { colors: C } = useTheme();
  const { language } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus: TextInputProps["onFocus"] = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur: TextInputProps["onBlur"] = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const isAr = language === "ar";
  const fontFamily = isAr ? "Tajawal-Regular" : "SourceSerif4-Regular";
  const dynamicStyle = useMemo(
    () => ({
      color: C.text,
      backgroundColor: C.backgroundSubtle,
      borderColor: isFocused ? C.tint : C.border,
      fontFamily,
      fontSize: typography.bodyLarge[isAr ? "ar" : "en"].fontSize,
      letterSpacing: 0,
    }),
    [C, isFocused, fontFamily, isAr],
  );

  return (
    <View style={styles.container}>
      {label && (
        <AppText
          weight='Medium'
          variant='body'
          style={[styles.label, { color: C.textSecondary }]}
        >
          {label}
        </AppText>
      )}
      <View style={styles.inputContainer}>
        {leftIcon && (
          <Feather
            name={leftIcon}
            size={18}
            color={C.textMuted}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            dynamicStyle,
            props.multiline && styles.multiline,
            leftIcon ? styles.withLeftIcon : undefined,
            rightIcon ? styles.withRightIcon : undefined,
            style
          ]}
          placeholderTextColor={C.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          cursorColor={C.tint}
          {...props}
        />
        {rightIcon && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>
      {error && (
        <AppText variant='caption' style={[styles.error, { color: C.error }]}>
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    width: "100%",
  },
  label: {
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  inputContainer: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    height: 52,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
    overflow: "hidden",
  },
  leftIcon: {
    position: "absolute",
    left: spacing.lg,
    zIndex: 1,
  },
  rightIconContainer: {
    position: "absolute",
    right: spacing.lg,
    zIndex: 1,
  },
  multiline: {
    height: 120,
    paddingTop: spacing.lg,
    textAlignVertical: "top",
  },
  error: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  withLeftIcon: { paddingStart: 42 },
  withRightIcon: { paddingEnd: 42 },
});
