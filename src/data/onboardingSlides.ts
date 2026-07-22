import type { LocalizedString } from "@types";

export type OnboardingSlide = {
  title: LocalizedString;
  body: LocalizedString;
  icon: string;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    title: {
      en: "Intentions Made for Your Life",
      ar: "نيّات تناسب حياتك",
    },
    body: {
      en: "Student, parent, spouse, or professional: each role carries unique responsibilities before Allah. Tell us who you are, and we'll show you the intentions that matter most in your daily life.",
      ar: "طالب أو والد أو زوج أو موظف: لكل دور مسؤوليات مختلفة أمام الله. أخبرنا من أنت، وسنريك النيات التي تناسب حياتك اليومية.",
    },
    icon: "compass",
  },
  {
    title: {
      en: "Renew Your Niyyah",
      ar: "جدّد نيتك",
    },
    body: {
      en: "These intentions are a reminder for your heart. Read them with your eyes, and feel them in your heart, and let the niyyah settle before you begin. Verbalizing the niyyah was not the practice of the Prophet Mohamed ﷺ or his companions.\n\n- Ibn Taymiyyah, Majmu' al-Fatawa",
      ar: "هذه النيات تذكرة لقلبك. اقرأها بعينك، واستشعرها بقلبك، ودع النية تستقر قبل أن تبدأ. التلفظ بالنية لم يكن من هدي النبي ﷺ ولا أصحابه.\n\n- ابن تيمية، مجموع الفتاوى",
    },
    icon: "refresh-cw",
  },
  {
    title: {
      en: "Every Intention Counts",
      ar: "كل نية لها وزن",
    },
    body: {
      en: "The Prophet Mohamed ﷺ taught us that actions are only by their intentions. Baraka helps you bring sincere niyyah into every part of your day - turning ordinary moments into lasting worship.",
      ar: "قال النبي ﷺ: «إنما الأعمال بالنيات». بركة يساعدك على إحضار النية الصادقة في كل جزء من يومك - فيحوّل اللحظات العادية إلى عبادة باقية.",
    },
    icon: "star",
  },
];
