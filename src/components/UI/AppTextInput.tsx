import React, { useState, useMemo } from "react";
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { AppText } from "./AppText";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from "@i18n";

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

  const fontFamily = language === "ar" ? "Tajawal-Regular" : "SourceSerif4-Regular";
  const dynamicStyle = useMemo(() => ({
    color: C.text,
    backgroundColor: C.backgroundSubtle,
    borderColor: isFocused ? C.tint : C.border,
    fontFamily,
    letterSpacing: 0,
  }), [C, isFocused, fontFamily]);

  return (
    <View style={styles.container}>
      {label && (
        <AppText weight="Medium" style={[styles.label, { color: C.textSecondary }]}>
          {label}
        </AppText>
      )}
      <View style={styles.inputContainer}>
        {props.leftIcon && (
          <Feather name={props.leftIcon} size={18} color={C.textMuted} style={styles.leftIcon} />
        )}
        <TextInput
          style={[
            styles.input,
            dynamicStyle,
            props.multiline && styles.multiline,
            props.leftIcon ? styles.withLeftIcon : undefined,
            props.rightIcon ? styles.withRightIcon : undefined,
            style,
          ]}
          placeholderTextColor={C.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          cursorColor={C.tint}
          {...props}
        />
        {props.rightIcon && (
          <View style={styles.rightIconContainer}>
            {props.rightIcon}
          </View>
        )}
      </View>
      {error && (
        <AppText style={[styles.error, { color: C.error }]}>
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "100%",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  leftIcon: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  rightIconContainer: {
    position: "absolute",
    right: 16,
    zIndex: 1,
  },
  multiline: {
    height: 120,
    paddingTop: 16,
    textAlignVertical: "top",
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  withLeftIcon: { paddingStart: 42 },
  withRightIcon: { paddingEnd: 42 },
});
