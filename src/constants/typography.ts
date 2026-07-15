export type TypographyVariant =
  | "caption"
  | "footnote"
  | "body"
  | "bodyLarge"
  | "subtitle"
  | "title"
  | "titleLarge"
  | "hero"
  | "heroLarge";

interface TypeStyle {
  en: { fontSize: number };
  ar: { fontSize: number };
}

export const typography: Record<TypographyVariant, TypeStyle> = {
  caption: { en: { fontSize: 12 }, ar: { fontSize: 13 } },
  footnote: { en: { fontSize: 13 }, ar: { fontSize: 14 } },
  body: { en: { fontSize: 14 }, ar: { fontSize: 16 } },
  bodyLarge: { en: { fontSize: 16 }, ar: { fontSize: 18 } },
  subtitle: { en: { fontSize: 18 }, ar: { fontSize: 20 } },
  title: { en: { fontSize: 20 }, ar: { fontSize: 22 } },
  titleLarge: { en: { fontSize: 24 }, ar: { fontSize: 26 } },
  hero: { en: { fontSize: 28 }, ar: { fontSize: 30 } },
  heroLarge: { en: { fontSize: 40 }, ar: { fontSize: 42 } },
};

export default typography;
