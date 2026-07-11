import type { NiyyahOption } from "@types";

export const NIYYAH_OPTIONS: NiyyahOption[] = [
  // ── Eating & Drinking (Breakfast) ──
  {
    id: "breakfast_basic",
    activityId: "breakfast",
    level: "basic",
    text: {
      en: "Say Bismillah and eat with your right hand. This is exactly what the Prophet ﷺ taught.",
      ar: "سمِّ الله، وكُل بيمينك، فهذه من هدي النبي ﷺ.",
    },
  },
  {
    id: "breakfast_1",
    activityId: "breakfast",
    level: "advanced",
    text: {
      en: "Say Bismillah and eat with your right hand. This is exactly what the Prophet ﷺ taught.",
      ar: "ابدأ طعامك ببسم الله، وكُل بيمينك؛ اقتداءً بسنة النبي ﷺ.",
    },
  },
  {
    id: "breakfast_2",
    activityId: "breakfast",
    level: "advanced",
    text: {
      en: "Eat this to provide for yourself and those you love. Every bite you place for your family is counted as sadaqah.",
      ar: "انوِ بهذا الطعام أن تتقوّى على النفقة على نفسك وأهلك، فما تُطعمه لأهلك يُكتب لك به أجرٌ وصدقة.",
    },
  },
  {
    id: "breakfast_3",
    activityId: "breakfast",
    level: "advanced",
    text: {
      en: "Praise Allah when you finish. A single meal eaten with gratitude earns His pleasure.",
      ar: "اختم طعامك بحمد الله، فإن الله يرضى عن العبد إذا أكل الأكلة فحمده عليها.",
    },
  },
  {
    id: "breakfast_4",
    activityId: "breakfast",
    level: "advanced",
    text: {
      en: "Eat enough to keep you going, no more. A third for food, a third for drink, a third for air.",
      ar: "كُل بقدر حاجتك، ولا تُسرف؛ فثلثٌ للطعام، وثلثٌ للشراب، وثلثٌ للنَّفَس.",
    },
  },
  {
    id: "breakfast_5",
    activityId: "breakfast",
    level: "advanced",
    text: {
      en: "Gather your family around this table if you can. Eating together brings blessing to the meal.",
      ar: "اجمع أهلك على المائدة إن استطعت، فإن الاجتماع على الطعام سببٌ لحلول البركة.",
    },
  },

  // ── Lunch ──
  {
    id: "lunch_basic",
    activityId: "lunch",
    level: "basic",
    text: {
      en: "Eat this to sustain your body as Allah's trust.",
      ar: "كُل هذا لتُديم جسمك أمانةً من الله.",
    },
  },
  {
    id: "lunch_1",
    activityId: "lunch",
    level: "advanced",
    text: {
      en: "Say Bismillah and eat with your right hand, even mid-day.",
      ar: "قل بسم الله وكل بيمينك، حتى في منتصف اليوم.",
    },
  },
  {
    id: "lunch_2",
    activityId: "lunch",
    level: "advanced",
    text: {
      en: "Eat now to recharge for Asr and the rest of your afternoon.",
      ar: "كُل الآن لتجدد طاقتك لصلاة العصر وما تبقى من يومك.",
    },
  },
  {
    id: "lunch_3",
    activityId: "lunch",
    level: "advanced",
    text: {
      en: "Thank Allah for provision and health that's carried you this far today.",
      ar: "اشكر الله على الرزق والصحة التي رافقتك حتى الآن اليوم.",
    },
  },

  // ── Dinner ──
  {
    id: "dinner_basic",
    activityId: "dinner",
    level: "basic",
    text: {
      en: "Gather for this meal in Allah's name.",
      ar: "اجتمعوا على هذه الوجبة باسم الله.",
    },
  },
  {
    id: "dinner_1",
    activityId: "dinner",
    level: "advanced",
    text: {
      en: "Say Bismillah and eat with your right hand, even at the end of the day.",
      ar: "قل بسم الله وكل بيمينك، حتى في آخر اليوم.",
    },
  },
  {
    id: "dinner_2",
    activityId: "dinner",
    level: "advanced",
    text: {
      en: "Share this meal with family. It strengthens your bond, and it's worship too.",
      ar: "شارك هذه الوجبة مع عائلتك. تقوّي الرابط، وهي عبادة أيضاً.",
    },
  },
  {
    id: "dinner_3",
    activityId: "dinner",
    level: "advanced",
    text: {
      en: "Close your day with gratitude, before Isha calls you to pray.",
      ar: "اختم يومك بالشكر، قبل أن يدعوك العشاء للصلاة.",
    },
  },

  // ── Exercise ──
  {
    id: "exercise_basic",
    activityId: "exercise",
    level: "basic",
    text: {
      en: "Train today to worship better tomorrow. A strong body is a stronger servant of Allah.",
      ar: "تدرَّب اليوم لتكون اكثر قدرة على عبادة الله غدًا. فالجسم القوي اكثر قدرة على طاعة الله.",
    },
  },
  {
    id: "exercise_1",
    activityId: "exercise",
    level: "advanced",
    text: {
      en: "Train your body to stand longer in prayer, fast without fatigue, and make Hajj with ease.",
      ar: "درِّب جسدك ليعينك على إطالة القيام في الصلاة، والصيام بقوة، وأداء الحج بيسر.",
    },
  },
  {
    id: "exercise_2",
    activityId: "exercise",
    level: "advanced",
    text: {
      en: "This body is Allah's trust in your hands. Moving it is how you say thank you.",
      ar: "جسدك أمانةٌ من الله بين يديك، والمحافظة عليه وتقويته من شكر هذه النعمة.",
    },
  },
  {
    id: "exercise_3",
    activityId: "exercise",
    level: "advanced",
    text: {
      en: "The Prophet ﷺ said the strong believer is more beloved to Allah. Train to be that believer.",
      ar: "قال رسول الله ﷺ: «المؤمن القوي خيرٌ وأحبُّ إلى الله من المؤمن الضعيف». فتدرَّب لتكون من المؤمنين الأقوياء.",
    },
  },
  {
    id: "exercise_4",
    activityId: "exercise",
    level: "advanced",
    text: {
      en: "Clear your mind and renew your energy. Then go back to your work and worship with full presence.",
      ar: "جدِّد نشاطك وصفِّ ذهنك، ثم عُد إلى عملك وعبادتك بقلبٍ حاضرٍ وهمَّةٍ متجددة.",
    },
  },

  // ── Work ──
  {
    id: "work_basic",
    activityId: "work",
    level: "basic",
    text: {
      en: "Work today to earn halal provision for yourself and your family.",
      ar: "اعمل اليوم لتكسب رزقاً حلالاً لنفسك ولعائلتك.",
    },
  },
  {
    id: "work_1",
    activityId: "work",
    level: "advanced",
    text: {
      en: "Work knowing what you provide for your family is counted as sadaqah.",
      ar: "اعمل وأنت تعلم أن ما تنفقه على عائلتك يُحتسب صدقة.",
    },
  },
  {
    id: "work_2",
    activityId: "work",
    level: "advanced",
    text: {
      en: "Work to stay independent. Don't lean on others, keep your dignity.",
      ar: "اعمل لتبقى مستقلاً. لا تتكل على غيرك، واحفظ كرامتك.",
    },
  },
  {
    id: "work_3",
    activityId: "work",
    level: "advanced",
    text: {
      en: "Set some of today's earnings aside for zakat and good causes.",
      ar: "خصّص جزءاً من كسب اليوم للزكاة والأعمال الخيرية.",
    },
  },
  {
    id: "work_4",
    activityId: "work",
    level: "advanced",
    text: {
      en: "Work in a way that benefits others, not just yourself.",
      ar: "اعمل بطريقة تفيد غيرك، لا نفسك فقط.",
    },
  },
  {
    id: "work_professional_1",
    activityId: "work",
    level: "advanced",
    profileTags: ["professional"],
    text: {
      en: "Work with honesty and excellence. Treat it as worship.",
      ar: "اعمل بأمانة وإتقان. اعتبره عبادة.",
    },
  },
  {
    id: "work_professional_2",
    activityId: "work",
    level: "advanced",
    profileTags: ["professional"],
    text: {
      en: "Spend part of what you earn in Allah's path, through zakat and sadaqah.",
      ar: "أنفق جزءاً مما تكسبه في سبيل الله، بالزكاة والصدقة.",
    },
  },
  {
    id: "work_professional_3",
    activityId: "work",
    level: "advanced",
    profileTags: ["professional", "parent"],
    text: {
      en: "Earn halal provision for your family. Every dirham you spend on them is sadaqah.",
      ar: "اكسب الرزق الحلال لأسرتك. كل درهم تنفقه عليهم صدقة.",
    },
  },

  // ── Cooking ──
  {
    id: "cooking_basic",
    activityId: "cooking",
    level: "basic",
    text: {
      en: "Prepare this meal to nourish your household.",
      ar: "حضّر هذه الوجبة لتغذية أسرتك.",
    },
  },
  {
    id: "cooking_1",
    activityId: "cooking",
    level: "advanced",
    text: {
      en: "Feed your family today. It's an act of charity and love.",
      ar: "أطعم عائلتك اليوم. إنه عمل من الصدقة والمحبة.",
    },
  },
  {
    id: "cooking_2",
    activityId: "cooking",
    level: "advanced",
    profileTags: ["homemaker", "parent"],
    text: {
      en: "Spend on your household. Every bit of it is counted as charity.",
      ar: "أنفق على أسرتك. كل ما تقدّمه يُحتسب صدقة.",
    },
  },
  {
    id: "cooking_3",
    activityId: "cooking",
    level: "advanced",
    text: {
      en: "Cook with care. A healthy household can worship better.",
      ar: "اطبخ باهتمام. الأسرة السليمة تقدر على العبادة أكثر.",
    },
  },
  {
    id: "cooking_4",
    activityId: "cooking",
    level: "advanced",
    text: {
      en: "Say Bismillah at every step, even while preparing the food.",
      ar: "قل بسم الله في كل خطوة، حتى وأنت تحضّر الطعام.",
    },
  },
  {
    id: "cooking_homemaker_1",
    activityId: "cooking",
    level: "advanced",
    profileTags: ["homemaker"],
    text: {
      en: "Cook to make this home a place of warmth and blessing.",
      ar: "اطبخ لتجعل هذا البيت مكاناً من الدفء والبركة.",
    },
  },
  {
    id: "cooking_homemaker_2",
    activityId: "cooking",
    level: "advanced",
    profileTags: ["homemaker"],
    text: {
      en: "Taking care of your household is an act of worship. Treat it that way.",
      ar: "الاعتناء بأسرتك عبادة. تعامل معه على هذا الأساس.",
    },
  },
  {
    id: "cooking_parent_1",
    activityId: "cooking",
    level: "advanced",
    profileTags: ["parent"],
    text: {
      en: "Feed your children well. Good food helps raise righteous kids.",
      ar: "أطعم أطفالك جيداً. الطعام الجيد يساعد على تربية أبناء صالحين.",
    },
  },

  // ── Cleaning ──
  {
    id: "cleaning_basic",
    activityId: "cleaning",
    level: "basic",
    text: {
      en: "Clean your home, following the Sunnah of cleanliness.",
      ar: "نظّف بيتك، اتباعاً لسنة النظافة.",
    },
  },
  {
    id: "cleaning_1",
    activityId: "cleaning",
    level: "advanced",
    text: {
      en: "Clean this space so it's ready for worship.",
      ar: "نظّف هذا المكان ليكون جاهزاً للعبادة.",
    },
  },
  {
    id: "cleaning_2",
    activityId: "cleaning",
    level: "advanced",
    profileTags: ["homemaker", "parent"],
    text: {
      en: "Clean with kindness and sincerity, as a service to your family.",
      ar: "نظّف بطيب نفس وإخلاص، كخدمة لعائلتك.",
    },
  },
  {
    id: "cleaning_3",
    activityId: "cleaning",
    level: "advanced",
    text: {
      en: "Clean today. Purity is half of faith.",
      ar: "نظّف اليوم. الطهور شطر الإيمان.",
    },
  },
  {
    id: "cleaning_4",
    activityId: "cleaning",
    level: "advanced",
    profileTags: ["parent"],
    text: {
      en: "Clean alongside your children. Teach them order as you go.",
      ar: "نظّف مع أطفالك. علّمهم النظام وأنت تفعل ذلك.",
    },
  },
  {
    id: "cleaning_homemaker_1",
    activityId: "cleaning",
    level: "advanced",
    profileTags: ["homemaker"],
    text: {
      en: "Keep this home as a blessed place fit for worship.",
      ar: "حافظ على هذا البيت مكاناً مباركاً يليق بالعبادة.",
    },
  },
  {
    id: "cleaning_parent_1",
    activityId: "cleaning",
    level: "advanced",
    profileTags: ["parent"],
    text: {
      en: "Clean today and raise children who value order and purity.",
      ar: "نظّف اليوم وربِّ أطفالاً يقدّرون النظام والطهارة.",
    },
  },

  // ── Sleep ──
  {
    id: "sleep_basic",
    activityId: "sleep",
    level: "basic",
    text: {
      en: "Rest now to recharge for tomorrow's worship.",
      ar: "ارتح الآن لتجدد طاقتك لعبادة الغد.",
    },
  },
  {
    id: "sleep_1",
    activityId: "sleep",
    level: "advanced",
    text: {
      en: "Set your intention now to wake for Tahajjud.",
      ar: "اعقد نيتك الآن على الاستيقاظ لصلاة التهجد.",
    },
  },
  {
    id: "sleep_2",
    activityId: "sleep",
    level: "advanced",
    text: {
      en: "Sleep tonight knowing your health is a trust from Allah.",
      ar: "نم الليلة وأنت تعلم أن صحتك أمانة من الله.",
    },
  },
  {
    id: "sleep_3",
    activityId: "sleep",
    level: "advanced",
    text: {
      en: "Make wudu, lie on your right side, and say the Sunnah dua before you sleep.",
      ar: "توضأ، واضطجع على شقك الأيمن، وقل دعاء النوم السني قبل أن تنام.",
    },
  },
  {
    id: "sleep_4",
    activityId: "sleep",
    level: "advanced",
    text: {
      en: "Sleep with this intention. The reward is counted like a night of worship.",
      ar: "نم بهذه النية. الأجر يُحتسب كليلة من العبادة.",
    },
  },

  // ── Fajr ──
  {
    id: "fajr_basic",
    activityId: "fajr",
    level: "basic",
    text: {
      en: "Pray Fajr now. Allah commanded it.",
      ar: "صلِّ الفجر الآن. أمر الله بها.",
    },
  },
  {
    id: "fajr_1",
    activityId: "fajr",
    level: "advanced",
    text: {
      en: "Pray Fajr now and start your day under Allah's protection.",
      ar: "صلِّ الفجر الآن وابدأ يومك في حفظ الله.",
    },
  },
  {
    id: "fajr_2",
    activityId: "fajr",
    level: "advanced",
    text: {
      en: "Pray now. The dawn prayer is a moment the angels themselves witness.",
      ar: "صلِّ الآن. صلاة الفجر لحظة يشهدها الملائكة أنفسهم.",
    },
  },
  {
    id: "fajr_3",
    activityId: "fajr",
    level: "advanced",
    text: {
      en: "Don't forget the two Sunnah rak'ahs before Fajr. They outweigh everything in this world.",
      ar: "لا تنسَ ركعتي سنة الفجر. هما خيرٌ من الدنيا وما فيها.",
    },
  },

  // ── Dhuhur ──
  {
    id: "dhuhur_basic",
    activityId: "dhuhur",
    level: "basic",
    text: {
      en: "Pause from work and pray. This is the time Allah commanded.",
      ar: "توقف عن العمل وصلِّ. هذا الوقت أمر الله به.",
    },
  },
  {
    id: "dhuhur_1",
    activityId: "dhuhur",
    level: "advanced",
    text: {
      en: "Pause now and ask forgiveness for any shortcomings since the morning.",
      ar: "توقف الآن واستغفر عن أي تقصير منذ الصباح.",
    },
  },
  {
    id: "dhuhur_2",
    activityId: "dhuhur",
    level: "advanced",
    text: {
      en: "Pray now and renew your gratitude for a productive morning.",
      ar: "صلِّ الآن وجدد شكرك على صباح مثمر.",
    },
  },

  // ── Asr ──
  {
    id: "asr_basic",
    activityId: "asr",
    level: "basic",
    text: {
      en: "Pray Asr now. Guard the middle prayer, Allah named it specifically.",
      ar: "صلِّ العصر الآن. حافظ على الصلاة الوسطى، الله خصّها بالذكر.",
    },
  },
  {
    id: "asr_1",
    activityId: "asr",
    level: "advanced",
    text: {
      en: "Don't delay Asr. The angels of the day shift are about to ascend, let them find you praying.",
      ar: "لا تؤخر صلاة العصر. ملائكة النهار على وشك الصعود، دعهم يجدونك تصلي.",
    },
  },
  {
    id: "asr_2",
    activityId: "asr",
    level: "advanced",
    text: {
      en: "Because nations before us were given this prayer and wasted it so you earn twice: once for praying it, once for guarding what they lost.",
      ar: "لأن أمم قبلنا أُعطيت هذه الصلاة فضيّعوها فلك أجران: مرة على صلاتك، ومرة على حفظ ما ضيّعوه.",
    },
  },
  {
    id: "asr_3",
    activityId: "asr",
    level: "advanced",
    text: {
      en: "Whoever misses it, it's as if he lost his family and everything he owns.",
      ar: "من فاتته فكأنما خسر أهله وماله.",
    },
  },
  {
    id: "asr_4",
    activityId: "asr",
    level: "advanced",
    text: {
      en: "Leaving it wipes out your deeds, so be early, not late.",
      ar: "تركها يُحبط العمل، فبادر قبل أن يفوت الوقت.",
    },
  },

  // ── Maghrib ──
  {
    id: "maghrib_basic",
    activityId: "maghrib",
    level: "basic",
    text: {
      en: "Pray Maghrib now and thank Allah for completing another day.",
      ar: "صلِّ المغرب الآن واشكر الله على إتمام يوم آخر.",
    },
  },
  {
    id: "maghrib_1",
    activityId: "maghrib",
    level: "advanced",
    text: {
      en: "Pray two rak'ahs before it. A small gift the Prophet ﷺ recommended.",
      ar: "صلِّ ركعتين قبلها. هدية صغيرة أوصى بها النبي ﷺ.",
    },
  },
  {
    id: "maghrib_2",
    activityId: "maghrib",
    level: "advanced",
    text: {
      en: "Gather your family for this prayer. Pray together if you can.",
      ar: "اجمع عائلتك لهذه الصلاة. صلوا معاً إن استطعتم.",
    },
  },

  // ── Isha ──
  {
    id: "isha_basic",
    activityId: "isha",
    level: "basic",
    text: {
      en: "Pray Isha now and end your day in submission to Allah.",
      ar: "صلِّ العشاء الآن واختم يومك بالخضوع لله.",
    },
  },
  {
    id: "isha_1",
    activityId: "isha",
    level: "advanced",
    text: {
      en: "Pray it in congregation. It counts as half a night of standing in prayer.",
      ar: "صلِّها في جماعة. تُحتسب كقيام نصف ليلة.",
    },
  },
  {
    id: "isha_2",
    activityId: "isha",
    level: "advanced",
    text: {
      en: "Pray now, then prepare your heart for peaceful, grateful sleep.",
      ar: "صلِّ الآن، ثم هيّئ قلبك لنوم مسالم شاكر.",
    },
  },

  // ── Reading ──
  {
    id: "reading_basic",
    activityId: "reading",
    level: "basic",
    text: {
      en: "Read now. Seeking knowledge is a religious obligation.",
      ar: "اقرأ الآن. طلب العلم واجب ديني.",
    },
  },
  {
    id: "reading_1",
    activityId: "reading",
    level: "advanced",
    profileTags: ["professional"],
    text: {
      en: "Build a skill today that earns you better halal income.",
      ar: "طوّر مهارة اليوم تكسب بها دخلاً حلالاً أفضل.",
    },
  },
  {
    id: "reading_2",
    activityId: "reading",
    level: "advanced",
    text: {
      en: "Learn something today and share it. Knowledge passed on is ongoing sadaqah.",
      ar: "تعلّم شيئاً اليوم وانشره. العلم الذي يُنقل صدقة جارية.",
    },
  },
  {
    id: "reading_3",
    activityId: "reading",
    level: "advanced",
    text: {
      en: "Read to deepen your understanding, of your deen and your world.",
      ar: "اقرأ لتعمّق فهمك، لدينك ودنياك.",
    },
  },
  {
    id: "reading_4",
    activityId: "reading",
    level: "advanced",
    text: {
      en: "Seek this knowledge for Allah's sake alone.",
      ar: "اطلب هذا العلم لوجه الله وحده.",
    },
  },
  {
    id: "reading_student_2",
    activityId: "reading",
    level: "advanced",
    profileTags: ["student", "professional"],
    text: {
      en: "Learn this so you can put it to use in dawah and serving others.",
      ar: "تعلّم هذا لتستخدمه في الدعوة وخدمة الآخرين.",
    },
  },
  {
    id: "reading_student_3",
    activityId: "reading",
    level: "advanced",
    profileTags: ["student"],
    text: {
      en: "Read today to strengthen your mind for better ibadah.",
      ar: "اقرأ اليوم لتقوي عقلك لعبادة أفضل.",
    },
  },

  // ── Family ──
  {
    id: "family_basic",
    activityId: "family",
    level: "basic",
    text: {
      en: "Spend this time with family. Fulfill their rights.",
      ar: "اقضِ هذا الوقت مع العائلة. أدِّ حقوقهم.",
    },
  },
  {
    id: "family_1",
    activityId: "family",
    level: "advanced",
    text: {
      en: "Strengthen your family ties today. Allah commanded keeping them strong.",
      ar: "قوِّ صلة رحمك اليوم. أوجب الله الحفاظ عليها.",
    },
  },
  {
    id: "family_2",
    activityId: "family",
    level: "advanced",
    profileTags: ["parent"],
    text: {
      en: "Show your children good character. They learn it from watching you.",
      ar: "أرِ أطفالك حسن الخلق. يتعلمونه من مراقبتك.",
    },
  },
  {
    id: "family_3",
    activityId: "family",
    level: "advanced",
    text: {
      en: "Be good to your spouse today. Aim to be among the best to them.",
      ar: "أحسن إلى زوجك اليوم. اسعَ لتكون من أفضل الناس له.",
    },
  },
  {
    id: "family_parent_1",
    activityId: "family",
    level: "advanced",
    profileTags: ["parent"],
    text: {
      en: "Raise your children well. A righteous child keeps making du'a for you, even after you're gone.",
      ar: "ربِّ أطفالك جيداً. الولد الصالح يدعو لك، حتى بعد رحيلك.",
    },
  },
  {
    id: "family_parent_2",
    activityId: "family",
    level: "advanced",
    profileTags: ["parent"],
    text: {
      en: "Be patient and kind with your children. Treat it as worship.",
      ar: "كن لطيفاً وصبوراً مع أطفالك. اعتبره عبادة.",
    },
  },
  {
    id: "family_parent_3",
    activityId: "family",
    level: "advanced",
    profileTags: ["parent"],
    text: {
      en: "Teach your children their deen today, through how you live, not just what you say.",
      ar: "علّم أطفالك دينهم اليوم، من خلال سلوكك لا كلامك فقط.",
    },
  },

  // ── Charity ──
  {
    id: "charity_basic",
    activityId: "charity",
    level: "basic",
    text: {
      en: "Give today, purely for Allah's sake.",
      ar: "تصدّق اليوم، خالصاً لوجه الله.",
    },
  },
  {
    id: "charity_1",
    activityId: "charity",
    level: "advanced",
    text: {
      en: "Give even a little today. Charity extinguishes sins as water extinguishes fire.",
      ar: "تصدّق ولو بالقليل اليوم. فالصدقة تطفئ الخطيئة كما يطفئ الماء النار.",
    },
  },
  {
    id: "charity_2",
    activityId: "charity",
    level: "advanced",
    text: {
      en: "Give today. Allah multiplies the reward many times over for whomever He wills.",
      ar: "تصدّق اليوم، فالله يضاعف الأجر أضعافاً لمن يشاء.",
    },
  },
  {
    id: "charity_3",
    activityId: "charity",
    level: "advanced",
    text: {
      en: "The greatest reward in charity is when you give while you are healthy and attached to your wealth, fearing poverty.",
      ar: "الصدقة الأعظم أجراً أن تتصدق وأنت صحيح شحيح تخشى الفقر.",
    },
  },

  // ── Commute ──
  {
    id: "commute_basic",
    activityId: "commute",
    level: "basic",
    text: {
      en: "Set off now, under Allah's protection.",
      ar: "استودِع الله نفسك، وانطلق مستعينًا به.",
    },
  },
  {
    id: "commute_1",
    activityId: "commute",
    level: "advanced",
    text: {
      en: "Fill this journey with dhikr or a bit of Quran.",
      ar: "اجعل رحلتك عامرةً بذكر الله أو بتلاوة شيءٍ من القرآن.",
    },
  },
  {
    id: "commute_2",
    activityId: "commute",
    level: "advanced",
    text: {
      en: "Intend by this journey to seek lawful provision or beneficial knowledge for the sake of Allah.",
      ar: "انوِ بهذه الرحلة طلبَ الرزق الحلال أو العلم النافع ابتغاءَ مرضاة الله.",
    },
  },
  {
    id: "commute_3",
    activityId: "commute",
    level: "advanced",
    text: {
      en: "Ask Allah to make this journey easy and return you safely.",
      ar: "سلِ الله أن ييسِّر لك رحلتك، وأن يردَّك سالمًا غانمًا.",
    },
  },
];

export function getNiyyahOptions(
  activityId: string,
  profileTags: string[] = [],
): NiyyahOption[] {
  return NIYYAH_OPTIONS.filter(
    (n) =>
      n.activityId === activityId &&
      (!n.profileTags ||
        n.profileTags.length === 0 ||
        n.profileTags.some((tag) => profileTags.includes(tag))),
  );
}
