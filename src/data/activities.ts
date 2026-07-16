import type { Activity } from "@types";

export const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: "fajr",
    name: { en: "Fajr Prayer", ar: "صلاة الفجر" },
    category: "worship",
    niyyahText: {
      en: "I pray Fajr now, one of the two prayers hardest on hypocrites, seeking its greatest reward.",
      ar: "أصلي الفجر الآن، من أثقل صلاتين على المنافقين، طالباً أجرها الأعظم.",
    },
    hadithRef: { en: "Bukhari 657", ar: "البخاري ٦٥٧" },
    defaultTime: "05:00",
  },
  {
    id: "breakfast",
    name: { en: "Eating & Drinking", ar: "الأكل والشرب" },
    category: "daily",
    niyyahText: {
      en: "I say Bismillah and eat with my right hand, exactly as the Prophet ﷺ taught.",
      ar: "أقول بسم الله وآكل بيميني، تماماً كما علّمنا النبي ﷺ.",
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
      en: "I work honestly today, knowing no food is better than what I earn with my own hands.",
      ar: "أعمل بأمانة اليوم، موقناً أنه لا طعام خير مما تكسبه يداي.",
    },
    hadithRef: { en: "Bukhari 2072", ar: "البخاري ٢٠٧٢" },
    defaultTime: "09:00",
  },
  {
    id: "exercise",
    name: { en: "Exercise", ar: "الرياضة" },
    category: "health",
    niyyahText: {
      en: "I move my body today, knowing Allah loves the strong believer more, and this body is His trust to me.",
      ar: "أحرّك جسمي اليوم، موقناً أن الله يحب المؤمن القوي أكثر، وأن هذا الجسم أمانته عندي.",
    },
    hadithRef: { en: "Muslim 2664", ar: "مسلم ٢٦٦٤" },
    defaultTime: "07:30",
  },
  {
    id: "siwak",
    name: { en: "Siwak", ar: "السواك" },
    category: "daily",
    niyyahText: {
      en: "I clean my mouth with siwak, following what the Prophet ﷺ nearly made required before every prayer.",
      ar: "أنظّف فمي بالسواك، اتباعاً لما كاد النبي ﷺ يجعله واجباً قبل كل صلاة.",
    },
    hadithRef: { en: "Bukhari 887, Muslim 252", ar: "البخاري ٨٨٧، مسلم ٢٥٢" },
  },
  {
    id: "cleaning",
    name: { en: "Cleaning / Chores", ar: "التنظيف / الأعمال المنزلية" },
    category: "daily",
    niyyahText: {
      en: "I clean my home today, knowing purity is half of faith, so this work counts as worship too.",
      ar: "أنظّف بيتي اليوم، موقناً أن الطهور شطر الإيمان، فهذا العمل يُحتسب عبادة أيضاً.",
    },
    hadithRef: { en: "Muslim 223", ar: "مسلم ٢٢٣" },
  },
  {
    id: "visiting_sick",
    name: { en: "Visiting the Sick", ar: "زيارة المريض" },
    category: "relationships",
    niyyahText: {
      en: "I visit someone who's sick, knowing every moment I stay is rewarded like picking fruit in Paradise.",
      ar: "أزور مريضاً، موقناً أن كل لحظة أبقى فيها تُكتب لي كجَنْي ثمار الجنة.",
    },
    hadithRef: { en: "Sahih Muslim 2568", ar: "صحيح مسلم ٢٥٦٨" },
    defaultTime: "13:00",
  },
  {
    id: "dhuhur",
    name: { en: "Dhuhr Prayer", ar: "صلاة الظهر" },
    category: "worship",
    niyyahText: {
      en: "I pray Dhuhr now, pausing from my day to stand before Allah in the middle of it.",
      ar: "أصلي الظهر الآن، متوقفاً عن يومي لأقف بين يدي الله في منتصفه.",
    },
    defaultTime: "13:30",
  },
  {
    id: "commute",
    name: { en: "Commute", ar: "التنقل" },
    category: "daily",
    niyyahText: {
      en: 'I say this before I set off: "Glory is to Him Who has subjected this to us, and we could never have subdued it ourselves. Indeed, to our Lord we will return." It\'s the Prophet\'s ﷺ own prayer for any journey, long or short.',
      ar: "أقول هذا قبل أن أتحرك: «سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ». هذا دعاء النبي ﷺ نفسه لأي رحلة، طويلة كانت أو قصيرة.",
    },
    hadithRef: { en: "Sahih Muslim (Ibn Umar)", ar: "صحيح مسلم (ابن عمر)" },
    defaultTime: "08:00",
  },
  {
    id: "asr",
    name: { en: "Asr Prayer", ar: "صلاة العصر" },
    category: "worship",
    niyyahText: {
      en: "I pray Asr on time, mindful that missing it is described as losing my family and wealth.",
      ar: "أصلي العصر في وقتها، مستحضراً أن من فاتته فكأنما خسر أهله وماله.",
    },
    hadithRef: { en: "Bukhari 552", ar: "البخاري ٥٥٢" },
    defaultTime: "16:00",
  },
  {
    id: "family",
    name: { en: "Family Time", ar: "وقت العائلة" },
    category: "relationships",
    niyyahText: {
      en: "I spend this time with my family, knowing the best of us are the best to their own.",
      ar: "أقضي هذا الوقت مع عائلتي، موقناً أن خيركم خيركم لأهله.",
    },
    hadithRef: { en: "Tirmidhi 3895", ar: "الترمذي ٣٨٩٥" },
    defaultTime: "18:00",
  },
  {
    id: "maghrib",
    name: { en: "Maghrib Prayer", ar: "صلاة المغرب" },
    category: "worship",
    niyyahText: {
      en: "I pray two rak'ahs before Maghrib, following what the Prophet ﷺ recommended for whoever wants the extra reward.",
      ar: "أصلي ركعتين قبل المغرب، اتباعاً لما أوصى به النبي ﷺ لمن أراد الأجر الزائد.",
    },
    hadithRef: { en: "Bukhari 7368", ar: "البخاري ٧٣٦٨" },
    defaultTime: "18:30",
  },
  {
    id: "dinner",
    name: { en: "Dinner", ar: "العشاء" },
    category: "daily",
    niyyahText: {
      en: "I sit down for dinner with gratitude, sharing this meal with the people I love.",
      ar: "أجلس لتناول العشاء بامتنان، أشارك هذه الوجبة مع من أحب.",
    },
    defaultTime: "20:00",
  },
  {
    id: "isha",
    name: { en: "Isha Prayer", ar: "صلاة العشاء" },
    category: "worship",
    niyyahText: {
      en: "I pray Isha now, in congregation if I can, knowing it counts as half a night of standing in prayer.",
      ar: "أصلي العشاء الآن، في جماعة إن استطعت، موقناً أنها تُحتسب كقيام نصف ليلة.",
    },
    hadithRef: { en: "Muslim 656", ar: "مسلم ٦٥٦" },
    defaultTime: "21:00",
  },
  {
    id: "sleep",
    name: { en: "Sleep", ar: "النوم" },
    category: "daily",
    niyyahText: {
      en: 'I make wudu before bed and lie on my right side, saying: "O Allah, I surrender my face to You, entrust my affairs to You, and rely upon You, out of hope and fear of You. There is no refuge or escape from You except to You. O Allah, I believe in Your Book which You revealed, and in Your Prophet whom You sent." I let these be my last words before sleep.',
      ar: "أتوضأ قبل النوم وأضطجع على شقي الأيمن، أقول: «اللَّهُمَّ أَسْلَمْتُ وَجْهِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، اللَّهُمَّ آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ». وأجعلهن آخر ما أقوله قبل أن أنام.",
    },
    hadithRef: { en: "Bukhari 247", ar: "البخاري ٢٤٧" },
    defaultTime: "22:30",
  },
  {
    id: "reading",
    name: { en: "Reading / Learning", ar: "القراءة / التعلم" },
    category: "productivity",
    niyyahText: {
      en: "I read for knowledge today, knowing every path that seeks it is a path Allah makes easier to Paradise.",
      ar: "أقرأ طلباً للعلم اليوم، موقناً أن كل طريق يُلتمس فيه العلم يسهّله الله إلى الجنة.",
    },
    hadithRef: { en: "Muslim 2699", ar: "مسلم ٢٦٩٩" },
    defaultTime: "20:00",
  },
  {
    id: "charity",
    name: { en: "Giving / Charity", ar: "الصدقة" },
    category: "worship",
    niyyahText: {
      en: "I give something today, even while I want it myself, knowing this is the charity with the greatest reward.",
      ar: "أتصدّق بشيء اليوم، حتى وأنا أريده لنفسي، موقناً أن هذه هي الصدقة الأعظم أجراً.",
    },
    hadithRef: { en: "Bukhari 1419", ar: "البخاري ١٤١٩" },
  },
];
