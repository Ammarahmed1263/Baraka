import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import {
  ThemeProvider as NavThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import Colors from "@constants/colors";
import { useSettingsStore } from "@store/settingsStore";
import { type AppSettings } from "@/types";

type ThemeType = Exclude<AppSettings["darkMode"], "auto">;

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof Colors.light;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const darkModePreference = useSettingsStore((s) => s.settings.darkMode);

  const theme: ThemeType = useMemo(() => {
    if (darkModePreference === "auto") {
      return systemColorScheme === "dark" ? "dark" : "light";
    }
    return darkModePreference;
  }, [darkModePreference, systemColorScheme]);

  const value = useMemo(
    () => ({
      theme,
      colors: Colors[theme],
      isDark: theme === "dark",
    }),
    [theme],
  );

  const navTheme = theme === "dark" ? DarkTheme : DefaultTheme;
  navTheme.colors.background = value.colors.background;
  navTheme.colors.card = value.colors.backgroundCard;

  return (
    <ThemeContext.Provider value={value}>
      <NavThemeProvider value={navTheme}>{children}</NavThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
