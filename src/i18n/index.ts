import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import * as Updates from "expo-updates";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

import "@formatjs/intl-pluralrules/polyfill";
import "@formatjs/intl-pluralrules/locale-data/en";
import "@formatjs/intl-pluralrules/locale-data/ar";

import ar from "./locales/ar.json";
import en from "./locales/en.json";

export const LANGUAGE_STORAGE_KEY = "@baraka/language";
const RTL_APPLIED_LANGUAGE_KEY = "@baraka/rtl-applied-language";

let initialized = false;
let bootstrapping = false;

const resources = {
  ar: { translation: ar },
  en: { translation: en },
};

type AppLanguage = "ar" | "en";

const resolveDeviceLanguage = (): AppLanguage => {
  const locale = Localization.getLocales()[0]?.languageTag?.toLowerCase() || "";
  if (locale.startsWith("ar")) return "ar";
  return "en";
};

const applyRTLDirection = async (language: AppLanguage): Promise<void> => {
  const shouldBeRTL = language === "ar";

  I18nManager.allowRTL(shouldBeRTL);
  I18nManager.forceRTL(shouldBeRTL);

  if (I18nManager.isRTL !== shouldBeRTL) {
    const appliedLanguage = await AsyncStorage.getItem(
      RTL_APPLIED_LANGUAGE_KEY,
    );

    if (appliedLanguage !== language) {
      await AsyncStorage.setItem(RTL_APPLIED_LANGUAGE_KEY, language);
      await Updates.reloadAsync();
    }
  } else {
    await AsyncStorage.setItem(RTL_APPLIED_LANGUAGE_KEY, language);
  }
};

i18n.use(initReactI18next);

export const initializeI18n = async (): Promise<AppLanguage> => {
  if (initialized) {
    return (i18n.language as AppLanguage) || "ar";
  }

  if (bootstrapping) {
    return "ar";
  }

  bootstrapping = true;

  const storedLanguage = (await AsyncStorage.getItem(
    LANGUAGE_STORAGE_KEY,
  )) as AppLanguage | null;
  const language = storedLanguage || resolveDeviceLanguage();

  await i18n.init({
    resources,
    lng: language,
    fallbackLng: "en",
    compatibilityJSON: "v4",
    interpolation: {
      escapeValue: false,
    },
  });

  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  await applyRTLDirection(language);

  i18n.on("languageChanged", async (nextLanguage) => {
    if (!initialized) return;

    const normalizedLanguage: AppLanguage = nextLanguage === "ar" ? "ar" : "en";
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
    await applyRTLDirection(normalizedLanguage);
  });

  initialized = true;
  bootstrapping = false;

  return language;
};

export const setAppLanguage = async (language: AppLanguage): Promise<void> => {
  await i18n.changeLanguage(language);
};

export default i18n;
