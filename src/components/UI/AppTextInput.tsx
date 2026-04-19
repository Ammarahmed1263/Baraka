import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import Colors from "@constants/colors";
import { AppText } from "./AppText";

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function AppTextInput({
  label,
  error,
  style,
  onFocus,
  onBlur,
  ...props
}: AppTextInputProps) {
  const isDark = useColorScheme() === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <View style={styles.container}>
      {label && (
        <AppText weight="Medium" style={[styles.label, { color: C.textSecondary }]}>
          {label}
        </AppText>
      )}
      <TextInput
        style={[
          styles.input,
          {
            color: C.text,
            backgroundColor: C.backgroundSubtle,
            borderColor: isFocused ? C.tint : C.border,
          },
          props.multiline && styles.multiline,
          style,
        ]}
        placeholderTextColor={C.textMuted}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
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
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Tajawal-Regular",
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
});
