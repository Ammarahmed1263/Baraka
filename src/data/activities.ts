import type { Activity } from "@types";

export const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: "fajr",
    name: { en: "Fajr Prayer", ar: "صلاة الفجر" },
    category: "worship",
    niyyahText: {
      en: "Pray Fajr now. It's one of the two prayers hardest on a weak heart, so its reward is the greatest.",
      ar: "صلِّ الفجر الآن. من أثقل صلاتين على القلب الضعيف، فأجرها الأعظم.",
    },
    hadithRef: { en: "Bukhari 657", ar: "البخاري ٦٥٧" },
    defaultTime: "05:00",
  },
  {
    id: "breakfast",
    name: { en: "Eating & Drinking", ar: "الأكل والشرب" },
    category: "daily",
    niyyahText: {
      en: "Say Bismillah and eat with your right hand. This is exactly what the Prophet ﷺ taught.",
      ar: "قل بسم الله وكل بيمينك. هذا ما علّمه النبي ﷺ بالضبط.",
    },
    hadithRef: {
      en: "Bukhari 5376, Muslim 2022",
      ar: "البخاري ٥٣٧٦، مسلم ٢٠٢٢",
    },
    defaultTime: "07:00",
  },
  {
    id: "work",
    name: { en: "Work / Earning", ar: "العمل / الكسب" },
    category: "productivity",
    niyyahText: {
      en: "Work honestly today. No food is better than what you earn with your own hands.",
      ar: "اعمل بأمانة اليوم. لا طعام خيرٌ مما تكسبه يداك.",
    },
    hadithRef: { en: "Bukhari 2072", ar: "البخاري ٢٠٧٢" },
    defaultTime: "09:00",
  },
  {
    id: "exercise",
    name: { en: "Exercise", ar: "الرياضة" },
    category: "health",
    niyyahText: {
      en: "Move your body today. Allah loves the strong believer more, and this body is His trust to you.",
      ar: "حرّك جسمك اليوم. الله يحب المؤمن القوي أكثر، وهذا الجسم أمانته عندك.",
    },
    hadithRef: { en: "Muslim 2664", ar: "مسلم ٢٦٦٤" },
    defaultTime: "07:30",
  },
  {
    id: "siwak",
    name: { en: "Siwak", ar: "السواك" },
    category: "daily",
    niyyahText: {
      en: "Clean your mouth with siwak. The Prophet ﷺ nearly made this required before every prayer.",
      ar: "نظّف فمك بالسواك. كاد النبي ﷺ يجعله واجباً قبل كل صلاة.",
    },
    hadithRef: { en: "Bukhari 887, Muslim 252", ar: "البخاري ٨٨٧، مسلم ٢٥٢" },
  },
  {
    id: "cleaning",
    name: { en: "Cleaning / Chores", ar: "التنظيف / الأعمال المنزلية" },
    category: "daily",
    niyyahText: {
      en: "Clean your home today. Purity is half of faith, so this work counts as worship too.",
      ar: "نظّف بيتك اليوم. الطهور شطر الإيمان، فهذا العمل يُحتسب عبادة أيضاً.",
    },
    hadithRef: { en: "Muslim 223", ar: "مسلم ٢٢٣" },
  },
  {
    id: "visiting_sick",
    name: { en: "Visiting the Sick", ar: "عيادة المريض" },
    category: "relationships",
    niyyahText: {
      en: "Visit someone who's sick. Every moment you stay is rewarded like picking fruit in Paradise.",
      ar: "زُر مريضاً. كل لحظة تبقى فيها تُكتب لك كجَنْي ثمار الجنة.",
    },
    hadithRef: { en: "Sahih Muslim 2568", ar: "صحيح مسلم ٢٥٦٨" },
    defaultTime: "13:00",
  },
  {
    id: "dhuhur",
    name: { en: "Dhuhr Prayer", ar: "صلاة الظهر" },
    category: "worship",
    niyyahText: {
      en: "Pray Dhuhr now. Pause from your day to stand before Allah in the middle of it.",
      ar: "صلِّ الظهر الآن. توقف عن يومك لتقف بين يدي الله في منتصفه.",
    },
    defaultTime: "13:30",
  },
  {
    id: "commute",
    name: { en: "Commute", ar: "التنقل" },
    category: "daily",
    niyyahText: {
      en: "Say this before you set off. It's the Prophet's ﷺ own prayer for any journey, long or short.",
      ar: "قل هذا قبل أن تتحرك. هذا دعاء النبي ﷺ نفسه لأي رحلة، طويلة كانت أو قصيرة.",
    },
    hadithRef: { en: "Sahih Muslim (Ibn Umar)", ar: "صحيح مسلم (ابن عمر)" },
    defaultTime: "08:00",
  },
  {
    id: "asr",
    name: { en: "Asr Prayer", ar: "صلاة العصر" },
    category: "worship",
    niyyahText: {
      en: "Pray Asr on time. Missing it is described as losing your family and wealth.",
      ar: "صلِّ العصر في وقتها. من فاتته فكأنما خسر أهله وماله.",
    },
    hadithRef: { en: "Bukhari 552", ar: "البخاري ٥٥٢" },
    defaultTime: "16:00",
  },
  {
    id: "family",
    name: { en: "Family Time", ar: "وقت العائلة" },
    category: "relationships",
    niyyahText: {
      en: "Spend this time with your family. The best of us are the best to their own.",
      ar: "اقضِ هذا الوقت مع عائلتك. خيركم خيركم لأهله.",
    },
    hadithRef: { en: "Tirmidhi 3895", ar: "الترمذي ٣٨٩٥" },
    defaultTime: "18:00",
  },
  {
    id: "maghrib",
    name: { en: "Maghrib Prayer", ar: "صلاة المغرب" },
    category: "worship",
    niyyahText: {
      en: "Pray two rak'ahs before Maghrib. The Prophet ﷺ recommended it for whoever wants the extra reward.",
      ar: "صلِّ ركعتين قبل المغرب. أوصى بها النبي ﷺ لمن أراد الأجر الزائد.",
    },
    hadithRef: { en: "Bukhari 7368", ar: "البخاري ٧٣٦٨" },
    defaultTime: "18:30",
  },
  {
    id: "dinner",
    name: { en: "Dinner", ar: "العشاء" },
    category: "daily",
    niyyahText: {
      en: "Sit down for dinner with gratitude, sharing this meal with the people you love.",
      ar: "اجلس لتناول العشاء بامتنان، تشارك هذه الوجبة مع من تحب.",
    },
    defaultTime: "20:00",
  },
  {
    id: "isha",
    name: { en: "Isha Prayer", ar: "صلاة العشاء" },
    category: "worship",
    niyyahText: {
      en: "Pray Isha now, in congregation if you can. It counts as half a night of standing in prayer.",
      ar: "صلِّ العشاء الآن، في جماعة إن استطعت. تُحتسب كقيام نصف ليلة.",
    },
    hadithRef: { en: "Muslim 656", ar: "مسلم ٦٥٦" },
    defaultTime: "21:00",
  },
  {
    id: "sleep",
    name: { en: "Sleep", ar: "النوم" },
    category: "daily",
    niyyahText: {
      en: "Make wudu before bed and lie on your right side. Say this dua, and let it be your last words before sleep.",
      ar: "توضأ قبل النوم واضطجع على شقك الأيمن. قل هذا الدعاء، واجعله آخر ما تقوله قبل أن تنام.",
    },
    hadithRef: { en: "Bukhari 247", ar: "البخاري ٢٤٧" },
    defaultTime: "22:30",
  },
  {
    id: "reading",
    name: { en: "Reading / Learning", ar: "القراءة / التعلم" },
    category: "productivity",
    niyyahText: {
      en: "Read for knowledge today. Every path that seeks it is a path Allah makes easier to Paradise.",
      ar: "اقرأ طلباً للعلم اليوم. كل طريق يُلتمس فيه العلم يسهّله الله إلى الجنة.",
    },
    hadithRef: { en: "Muslim 2699", ar: "مسلم ٢٦٩٩" },
    defaultTime: "20:00",
  },
  {
    id: "charity",
    name: { en: "Giving / Charity", ar: "الصدقة" },
    category: "worship",
    niyyahText: {
      en: "Give something today, even while you want it yourself. This is the charity with the greatest reward.",
      ar: "تصدّق بشيء اليوم، حتى وأنت تريده لنفسك. هذه هي الصدقة الأعظم أجراً.",
    },
    hadithRef: { en: "Bukhari 1419", ar: "البخاري ١٤١٩" },
  },
];
