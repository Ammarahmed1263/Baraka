export type Direction = "ltr" | "rtl";

export const LANGUAGES = {
  en: { dir: "ltr" },
  ar: { dir: "rtl" },
} as const satisfies Record<string, { dir: Direction }>;

export type AppLanguage = keyof typeof LANGUAGES;

export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGES) as AppLanguage[];

export const DEFAULT_LANGUAGE: AppLanguage = "ar";

export const isSupportedLanguage = (lang: unknown): lang is AppLanguage =>
  typeof lang === "string" && lang in LANGUAGES;

export const isRTLLanguage = (lang: AppLanguage): boolean =>
  LANGUAGES[lang].dir === "rtl";

export const normalizeLanguage = (lang?: string | null): AppLanguage => {
  const code = lang?.toLowerCase().split(/[-_]/)[0];
  return isSupportedLanguage(code) ? code : DEFAULT_LANGUAGE;
};
