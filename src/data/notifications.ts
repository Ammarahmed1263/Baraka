import { LocalizedString } from "@/types";

type DailyNotifications = {
  title: LocalizedString;
  body: LocalizedString;
};

export const DAILY_NOTIFICATIONS: DailyNotifications[] = [
  {
    title: {
      en: "Begin with intention 🤲",
      ar: "ابدأ بالنيّة 🤲",
    },
    body: {
      en: "Actions are by intentions — what will yours be today?",
      ar: "الأعمال بالنيّات — فماذا تنوي اليوم؟",
    },
  },
  {
    title: {
      en: "A new day, a fresh niyyah 🌅",
      ar: "يومٌ جديد، نيّةٌ جديدة 🌅",
    },
    body: {
      en: "Every act done for Allah — even the small ones — counts.",
      ar: "كل عمل لله — حتى الصغير منه — في الميزان.",
    },
  },
  {
    title: {
      en: "Don't let today pass without intention 🌿",
      ar: "لا تدع اليوم يمرّ بلا نيّة 🌿",
    },
    body: {
      en: "One sincere intention can turn your whole day into worship.",
      ar: "نيّةٌ صادقة تحوّل يومك كلّه إلى عبادة.",
    },
  },
  {
    title: {
      en: "Bismillah — let's begin ✨",
      ar: "بسم الله — لنبدأ ✨",
    },
    body: {
      en: "Set your intention now. Allah sees even what the heart conceals.",
      ar: "انوِ الآن. الله يرى ما تُخفيه القلوب.",
    },
  },
  {
    title: {
      en: "Your routine can be worship 🌟",
      ar: "روتينك يمكن أن يكون عبادة 🌟",
    },
    body: {
      en: "Work, rest, family — all of it counts with the right niyyah.",
      ar: "العمل، الراحة، الأسرة — كلّها تُحتسب بالنيّة الصالحة.",
    },
  },
];
