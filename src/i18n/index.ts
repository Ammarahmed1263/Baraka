import "intl-pluralrules";

import { storage } from "@lib/storage";
import { getLocales } from "expo-localization";
import * as Updates from "expo-updates";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { DevSettings, I18nManager } from "react-native";

import en from "./locales/en.json";
import ar from "./locales/ar.json";
import { useCallback, useMemo } from "react";

const LANG_KEY = "@app_language";
const SUPPORTED = ["en", "ar"] as const;
const FALLBACK = "ar";
const RTL_LANGUAGES = ["ar"];

type AppLanguage = (typeof SUPPORTED)[number];

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

const normalizeLanguage = (lang?: string | null): AppLanguage => {
  if (!lang) return FALLBACK;

  if (lang.startsWith("ar")) return "ar";
  return "en";
};

const applyRTL = (lng: string) => {
  const isRTL = RTL_LANGUAGES.includes(lng);
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
};

let isReloading = false;

const reloadApp = async () => {
  if (isReloading) return;
  isReloading = true;

  try {
    if (__DEV__) {
      DevSettings.reload();
    } else {
      await Updates.reloadAsync();
    }
  } catch {}
};

async function syncInitialRTL() {
  try {
    const savedLang = storage.getString(LANG_KEY);
    if (savedLang) {
      applyRTL(normalizeLanguage(savedLang));
      return;
    }
  } catch {}

  const deviceLang = getLocales()[0]?.languageCode;
  applyRTL(normalizeLanguage(deviceLang));
}

const languageDetector = {
  type: "languageDetector" as const,
  async: true,

  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLang = storage.getString(LANG_KEY);

      if (savedLang && SUPPORTED.includes(savedLang as AppLanguage)) {
        return callback(savedLang);
      }

      const deviceLang = getLocales()[0]?.languageCode;
      return callback(normalizeLanguage(deviceLang));
    } catch {
      return callback(FALLBACK);
    }
  },

  init: () => {},

  cacheUserLanguage: async (lang: string) => {
    if (SUPPORTED.includes(lang as AppLanguage)) {
      storage.set(LANG_KEY, lang);
    }
  },
};

async function initI18n() {
  await syncInitialRTL();

  await i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: FALLBACK,
      compatibilityJSON: "v4",
      interpolation: {
        escapeValue: false,
      },
    });

  i18n.on("languageChanged", async (lng) => {
    const isRTL = RTL_LANGUAGES.includes(lng);

    if (I18nManager.isRTL !== isRTL) {
      applyRTL(lng);

      await reloadApp();
    }
  });
}

initI18n();

export function useLanguage() {
  const { i18n: instance } = useTranslation();

  const language: AppLanguage = instance.language.startsWith("ar")
    ? "ar"
    : "en";

  const changeLanguage = useCallback(
    async (lang: AppLanguage) => {
      if (!SUPPORTED.includes(lang)) return;
      await instance.changeLanguage(lang);
    },
    [instance],
  );

  return useMemo(
    () => ({
      language,
      changeLanguage,
    }),
    [language],
  );
}

export default i18n;
