import "intl-pluralrules";

import { storage } from "@lib/storage";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { I18nManager } from "react-native";
import { reloadApp } from "@utils/device";
import * as Sentry from "@sentry/react-native";

import en from "./locales/en.json";
import ar from "./locales/ar.json";
import { useCallback, useMemo } from "react";
import {
  DEFAULT_LANGUAGE,
  isRTLLanguage,
  isSupportedLanguage,
  normalizeLanguage,
  type AppLanguage,
  type Direction,
} from "./languages";

export { type AppLanguage } from "./languages";

const LANG_KEY = "@app_language";
// Direction a reload was last requested for. If the next boot still finds the
// same mismatch, the reload did not fix it and reloading again would loop.
const RELOAD_ATTEMPT_KEY = "@rtl_reload_attempt";

const resources: Record<AppLanguage, { translation: object }> = {
  en: { translation: en },
  ar: { translation: ar },
};

const applyRTL = (lng: AppLanguage) => {
  const isRTL = isRTLLanguage(lng);
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
};

const directionOf = (lng: AppLanguage): Direction =>
  isRTLLanguage(lng) ? "rtl" : "ltr";

// Writes the native direction flags and records the attempt. The new direction
// only takes effect after a reload, so callers reload right after this.
function requestDirection(lng: AppLanguage) {
  applyRTL(lng);
  try {
    storage.set(RELOAD_ATTEMPT_KEY, directionOf(lng));
  } catch {}
}

export let needsRTLReload = false;

function syncInitialRTL() {
  let lang: AppLanguage = DEFAULT_LANGUAGE;
  let lastAttempt: string | undefined;

  try {
    const savedLang = storage.getString(LANG_KEY);
    if (savedLang) lang = normalizeLanguage(savedLang);
    lastAttempt = storage.getString(RELOAD_ATTEMPT_KEY);
  } catch {}

  const isRTL = isRTLLanguage(lang);

  if (I18nManager.isRTL === isRTL) {
    try {
      storage.delete(RELOAD_ATTEMPT_KEY);
    } catch {}
    return;
  }

  if (lastAttempt === directionOf(lang)) {
    Sentry.captureMessage("RTL reload did not change direction", {
      level: "warning",
      tags: { feature: "i18n" },
      extra: { language: lang, nativeIsRTL: I18nManager.isRTL },
    });
    return;
  }

  requestDirection(lang);
  needsRTLReload = true;
}

const languageDetector = {
  type: "languageDetector" as const,
  async: true,

  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLang = storage.getString(LANG_KEY);

      if (isSupportedLanguage(savedLang)) {
        return callback(savedLang);
      }

      return callback(DEFAULT_LANGUAGE);
    } catch {
      return callback(DEFAULT_LANGUAGE);
    }
  },

  init: () => {},

  cacheUserLanguage: async (lang: string) => {
    if (isSupportedLanguage(lang)) {
      storage.set(LANG_KEY, lang);
    }
  },
};

async function initI18n() {
  syncInitialRTL();

  await i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: DEFAULT_LANGUAGE,
      compatibilityJSON: "v4",
      interpolation: {
        escapeValue: false,
      },
    });

  // Only a switch that crosses direction needs a reload. Same-direction
  // switches (for example Arabic to Urdu) just re-render through i18next.
  i18n.on("languageChanged", async (lng) => {
    const language = normalizeLanguage(lng);

    if (I18nManager.isRTL !== isRTLLanguage(language)) {
      requestDirection(language);

      await reloadApp();
    }
  });
}

// Resolves even if init fails, so the boot gate never waits forever on i18n.
export const i18nInitPromise = initI18n().catch((error) => {
  Sentry.captureException(error, {
    tags: { feature: "i18n" },
    extra: { phase: "initI18n" },
  });
});

export async function clearAppData(clearStorage: () => void) {
  clearStorage();

  // Cleared storage means the next boot uses the default language, so set its
  // direction now. Otherwise that boot finds a mismatch and reloads again.
  requestDirection(DEFAULT_LANGUAGE);

  await reloadApp();
}

export function useLanguage() {
  const { i18n: instance } = useTranslation();

  const language = normalizeLanguage(instance.language);

  const changeLanguage = useCallback(
    async (lang: AppLanguage) => {
      if (!isSupportedLanguage(lang)) return;
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
