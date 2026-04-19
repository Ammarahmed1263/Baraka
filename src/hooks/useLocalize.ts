import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { LocalizedString } from "@types";

/**
 * Returns a stable `localize` function that resolves a LocalizedString
 * to a plain string in the current UI language.
 *
 * Post-MVP: pass `showBilingual` here and return both strings combined.
 */
export function useLocalize() {
  const { i18n } = useTranslation();
  const lang = i18n.language as "ar" | "en";

  return useCallback(
    (field: LocalizedString): string => field[lang] ?? field.en ?? field.ar,
    [lang]
  );
}


