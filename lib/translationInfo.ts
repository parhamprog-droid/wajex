// lib/translationInfo.ts
// تولید توضیحات و آمار ترجمه

export type TranslationStats = {
  sourceWordCount: number;
  targetWordCount: number;
  sourceCharCount: number;
  targetCharCount: number;
  sourceLang: string;
  targetLang: string;
  tone: string;
  toneLabel: string;
  translationTimeMs: number;
  estimatedReadingTime: string;
};

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function countChars(text: string): number {
  return text.replace(/\s/g, "").length;
}

export function getReadingTime(wordCount: number, lang: string): string {
  const minutes = wordCount / 200;
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${seconds} ثانیه`;
  }
  return `${Math.round(minutes)} دقیقه`;
}

export function buildTranslationStats(
  source: string,
  target: string,
  sourceLang: string,
  targetLang: string,
  tone: string,
  toneLabel: string,
  translationTimeMs: number
): TranslationStats {
  const sourceWordCount = countWords(source);
  const targetWordCount = countWords(target);

  return {
    sourceWordCount,
    targetWordCount,
    sourceCharCount: countChars(source),
    targetCharCount: countChars(target),
    sourceLang,
    targetLang,
    tone,
    toneLabel,
    translationTimeMs,
    estimatedReadingTime: getReadingTime(targetWordCount, targetLang),
  };
}

const LANG_NAMES: Record<string, string> = {
  fa: "فارسی",
  en: "انگلیسی",
  ar: "عربی",
  tr: "ترکی",
  fr: "فرانسوی",
  de: "آلمانی",
  es: "اسپانیایی",
  it: "ایتالیایی",
  ru: "روسی",
  zh: "چینی",
  ja: "ژاپنی",
  ko: "کره‌ای",
  hi: "هندی",
  ur: "اردو",
  pt: "پرتغالی",
  nl: "هلندی",
  sv: "سوئدی",
  pl: "لهستانی",
  he: "عبری",
  el: "یونانی",
};

export function getLangName(code: string): string {
  return LANG_NAMES[code] || code;
}

// ========== مترادف‌های گسترده ==========
const SYNONYMS: Record<string, string[]> = {
  // ===== انگلیسی =====
  hello: ["hi", "hey", "greetings", "howdy", "what's up"],
  hi: ["hello", "hey", "greetings", "howdy"],
  hey: ["hi", "hello", "yo", "howdy"],
  goodbye: ["bye", "farewell", "see ya", "so long"],
  bye: ["goodbye", "farewell", "see ya", "later"],
  thanks: ["thank you", "much appreciated", "cheers", "ta"],
  "thank you": ["thanks", "much appreciated", "cheers"],
  please: ["kindly", "if you please", "pray"],
  sorry: ["apologies", "my bad", "excuse me", "pardon"],
  yes: ["yeah", "yep", "yup", "indeed", "certainly"],
  no: ["nope", "nah", "negative", "not at all"],
  maybe: ["perhaps", "possibly", "potentially"],
  ok: ["okay", "alright", "sure", "fine"],
  good: ["great", "fine", "excellent", "nice", "well"],
  bad: ["poor", "terrible", "awful", "not good"],
  beautiful: ["gorgeous", "lovely", "stunning", "pretty", "attractive"],
  pretty: ["beautiful", "lovely", "cute", "attractive"],
  ugly: ["unattractive", "hideous", "unsightly"],
  happy: ["joyful", "cheerful", "delighted", "glad", "content"],
  sad: ["unhappy", "sorrowful", "melancholy", "down", "blue"],
  angry: ["mad", "furious", "irate", "annoyed"],
  tired: ["exhausted", "weary", "fatigued", "worn out"],
  hungry: ["starving", "famished", "peckish"],
  thirsty: ["parched", "dry"],
  big: ["large", "huge", "enormous", "massive", "giant"],
  small: ["tiny", "little", "miniature", "petite"],
  fast: ["quick", "rapid", "swift", "speedy", "brisk"],
  slow: ["sluggish", "gradual", "leisurely"],
  smart: ["clever", "intelligent", "bright", "brilliant"],
  dumb: ["stupid", "foolish", "silly"],
  easy: ["simple", "effortless", "straightforward"],
  hard: ["difficult", "tough", "challenging", "complex"],
  hot: ["warm", "boiling", "scorching"],
  cold: ["chilly", "freezing", "frigid"],
  new: ["fresh", "recent", "modern", "novel"],
  old: ["ancient", "aged", "antique", "vintage"],
  young: ["youthful", "juvenile", "adolescent"],
  rich: ["wealthy", "affluent", "prosperous"],
  poor: ["impoverished", "destitute", "needy"],
  friend: ["buddy", "pal", "companion", "mate", "comrade"],
  buddy: ["friend", "pal", "mate", "bro"],
  dude: ["guy", "man", "bro", "fellow"],
  kid: ["child", "youngster", "young one"],
  baby: ["infant", "newborn", "toddler"],
  mom: ["mother", "mama", "mum"],
  dad: ["father", "papa", "pop"],
  wife: ["spouse", "partner", "significant other"],
  husband: ["spouse", "partner", "significant other"],
  job: ["work", "occupation", "profession", "career"],
  money: ["cash", "funds", "currency", "wealth"],
  home: ["house", "residence", "dwelling", "abode"],
  car: ["automobile", "vehicle", "auto", "ride"],
  food: ["meal", "cuisine", "nourishment", "grub"],
  water: ["H2O", "liquid", "beverage"],
  love: ["adore", "cherish", "treasure", "affection"],
  hate: ["detest", "loathe", "despise"],
  want: ["desire", "wish", "crave", "long for"],
  need: ["require", "necessitate", "demand"],
  like: ["enjoy", "appreciate", "fancy", "be fond of"],
  think: ["believe", "consider", "suppose", "reckon"],
  know: ["understand", "be aware", "realize"],
  understand: ["comprehend", "grasp", "get"],
  remember: ["recall", "recollect", "reminisce"],
  forget: ["fail to recall", "overlook"],
  see: ["look", "view", "observe", "watch", "spot"],
  hear: ["listen", "perceive", "catch"],
  speak: ["talk", "say", "converse", "chat"],
  say: ["tell", "speak", "state", "mention"],
  tell: ["inform", "say", "reveal", "disclose"],
  ask: ["inquire", "question", "query"],
  answer: ["reply", "respond", "retort"],
  help: ["assist", "aid", "support", "facilitate"],
  make: ["create", "produce", "build", "construct"],
  get: ["obtain", "acquire", "receive", "gain"],
  give: ["provide", "offer", "donate", "supply"],
  take: ["grab", "seize", "receive"],
  keep: ["retain", "hold", "maintain"],
  put: ["place", "set", "position"],
  find: ["discover", "locate", "spot"],
  lose: ["misplace", "forfeit", "drop"],
  buy: ["purchase", "acquire", "procure"],
  sell: ["vend", "trade", "market"],
  start: ["begin", "commence", "initiate", "launch"],
  end: ["finish", "conclude", "complete", "terminate"],
  finish: ["complete", "end", "conclude", "wrap up"],
  begin: ["start", "commence", "initiate"],
  stop: ["cease", "halt", "quit", "end"],
  go: ["proceed", "move", "travel", "depart"],
  come: ["approach", "arrive", "near"],
  walk: ["stroll", "stride", "amble"],
  run: ["sprint", "dash", "jog"],
  drive: ["operate", "steer", "navigate"],
  fly: ["soar", "travel by air"],
  eat: ["dine", "consume", "devour", "munch"],
  drink: ["sip", "gulp", "consume"],
  sleep: ["rest", "doze", "slumber", "nap"],
  wake: ["arise", "rouse", "get up"],
  laugh: ["chuckle", "giggle", "guffaw"],
  cry: ["weep", "sob", "shed tears"],
  smile: ["grin", "beam", "smirk"],
  today: ["this day", "nowadays"],
  tomorrow: ["the morrow", "next day"],
  yesterday: ["the previous day", "last day"],
  now: ["currently", "at present", "right now"],
  later: ["afterwards", "subsequently", "down the line"],
  soon: ["shortly", "in a bit", "before long"],
  always: ["forever", "constantly", "invariably"],
  never: ["at no time", "not ever"],
  really: ["truly", "genuinely", "honestly"],
  very: ["extremely", "highly", "exceedingly"],
  too: ["also", "as well", "excessively"],
  much: ["a lot", "a great deal", "plenty"],
  many: ["numerous", "several", "a lot of"],
  few: ["a handful", "a small number"],

  // ===== فارسی =====
  "سلام": ["درود", "سلام علیکم", "های", "سلام و عرض ادب"],
  "درود": ["سلام", "سلام علیکم"],
  "خداحافظ": ["بای", "به امید دیدار", "خدانگهدار"],
  "بای": ["خداحافظ", "به امید دیدار"],
  "ممنون": ["مرسی", "سپاس", "متشکرم", "دستت درد نکنه"],
  "مرسی": ["ممنون", "سپاس", "متشکرم"],
  "سپاس": ["ممنون", "مرسی", "متشکرم"],
  "ببخشید": ["معذرت می‌خوام", "شرمنده", "متأسفم"],
  "معذرت": ["ببخشید", "شرمنده"],
  "آره": ["بله", "بله بله", "آری"],
  "بله": ["آره", "آری", "بله بله"],
  "نه": ["خیر", "نخیر", "ابدا"],
  "خیر": ["نه", "نخیر"],
  "خب": ["باشه", "بسیار خوب", "اوکی"],
  "باشه": ["خب", "اوکی", "حتماً"],
  "اوکی": ["باشه", "خب", "fine"],
  "خوب": ["عالی", "خوب خوب", "مرتب"],
  "بد": ["خراب", "افتضاح", "ناجور"],
  "زیبا": ["قشنگ", "خوشگل", "دل‌انگیز", "دل‌فریب"],
  "قشنگ": ["زیبا", "خوشگل", "دل‌انگیز"],
  "خوشگل": ["زیبا", "قشنگ", "دل‌انگیز"],
  "خوشحال": ["شاد", "خوش", "مسرور", "ذوق‌زده"],
  "شاد": ["خوشحال", "خوش", "مسرور"],
  "غمگین": ["ناراحت", "دل‌تنگ", "افسرده", "دل‌شکسته"],
  "ناراحت": ["غمگین", "دل‌تنگ", "دلخور"],
  "عصبانی": ["خشمگین", "داغون", "حرصی"],
  "خسته": ["داغون", "فرسوده", "بی‌حال", "کوفته"],
  "گشنمه": ["گرسنه‌ام", "دارم از گشنگی می‌میرم"],
  "خوابم میاد": ["خواب‌آلودم", "چشمام سنگین شده"],
  "بزرگ": ["گنده", "عظیم", "کلان", "بزرگوار"],
  "کوچک": ["ریز", "خرد", "کوچولو", "قد نخود"],
  "سریع": ["تند", "چابک", "برق‌آسا", "زرین"],
  "کند": ["آهسته", "یواش", "لاک‌پشتی"],
  "باهوش": ["زرنگ", "هوشمند", "تیزهوش", "نابغه"],
  "زرنگ": ["باهوش", "تیزهوش", "چالاک"],
  "احمق": ["نادان", "کودن", "بی‌عقل"],
  "آسان": ["ساده", "راحت", "بی‌دردسر"],
  "سخت": ["مشکل", "دشوار", "پیچیده"],
  "گرم": ["داغ", "خیلی گرم"],
  "سرد": ["سرد سرد", "یخ", "خنک"],
  "جدید": ["نو", "تازه", "نوین"],
  "قدیمی": ["کهنه", "کهن", "قدیمی قدیمی"],
  "ثروتمند": ["پولدار", "غنی", "متمول"],
  "فقیر": ["بی‌پول", "تنگدست", "ندار"],
  "دوست": ["رفیق", "همدم", "یار", "همراز"],
  "رفیق": ["دوست", "همدم", "یار"],
  "عشق": ["دلبستگی", "محبت", "دوستی"],
  "دوستت دارم": ["عاشقتم", "دل در گروت دارم"],
  "می‌خوام": ["می‌خواهم", "قصد دارم", "دلم می‌خواد"],
  "می‌خواهم": ["می‌خوام", "قصد دارم"],
  "نمی‌خوام": ["نمی‌خواهم", "دلم نمی‌خواد"],
  "فکر می‌کنم": ["گمان می‌کنم", "به نظرم", "حدس می‌زنم"],
  "می‌دونم": ["می‌دانم", "آگاهم", "خبر دارم"],
  "نمی‌دونم": ["نمی‌دانم", "خبر ندارم", "بی‌خبرم"],
  "یادم میاد": ["به یاد دارم", "به خاطر دارم"],
  "یادم نمیاد": ["فراموش کردم", "به یاد ندارم"],
  "می‌بینم": ["نگاه می‌کنم", "مشاهده می‌کنم"],
  "می‌شنوم": ["گوش می‌دم", "می‌شنوم"],
  "می‌گم": ["می‌گویم", "عرض می‌کنم"],
  "می‌پرسم": ["سؤال می‌کنم", "می‌پرسیدم"],
  "کمک": ["یاری", "مساعدت", "همیاری"],
  "کار": ["شغل", "حرفه", "پیشه"],
  "پول": ["وجه", "مال", "سکه"],
  "خانه": ["خونه", "منزل", "سرا", "مسکن"],
  "ماشین": ["خودرو", "اتومبیل", "ماشین"],
  "غذا": ["خوراک", "خوردنی", "ناهار"],
  "آب": ["آب خوردن"],
  "امروز": ["امروزه", "این روزها"],
  "فردا": ["فردا روز", "روز بعد"],
  "دیروز": ["دیروز روز", "روز قبل"],
  "الان": ["همین حالا", "در حال حاضر", "فعلاً"],
  "بعداً": ["بعد", "در آینده", "آینده"],
  "زود": ["سریع", "به‌زودی"],
  "دیر": ["با تأخیر", "دیروقت"],
  "همیشه": ["همواره", "همیشه و همه‌وقت"],
  "هرگز": ["ابدا", "هیچ‌وقت"],
  "واقعاً": ["به‌راستی", "حقیقتاً", "جدی"],
  "خیلی": ["بسیار", "فوق‌العاده", "کلی"],
  "زیاد": ["فراوان", "بسیار", "کلی"],
  "کم": ["اندک", "ناچیز", "یه کم"],
};

export function findSynonyms(word: string): string[] {
  if (!word) return [];

  // پاک‌سازی: حذف علائم نگارشی
  const clean = word.replace(/[.,!?؟:;()"']/g, "").trim();
  if (!clean) return [];

  // جستجوی مستقیم
  if (SYNONYMS[clean]) return SYNONYMS[clean];
  if (SYNONYMS[clean.toLowerCase()]) return SYNONYMS[clean.toLowerCase()];

  // جستجو case-insensitive
  const lower = clean.toLowerCase();
  const key = Object.keys(SYNONYMS).find(
    (k) => k.toLowerCase() === lower
  );
  if (key) return SYNONYMS[key];

  return [];
}

export function buildExamples(word: string, lang: string): string[] {
  const clean = word.replace(/[.,!?؟:;()"']/g, "").trim();
  if (!clean) return [];

  if (lang === "en") {
    return [
      `"${clean}" is a common word in English.`,
      `How do you use "${clean}" in a sentence?`,
      `She said "${clean}" with a smile.`,
      `I often hear people say "${clean}".`,
      `Can you explain what "${clean}" means?`,
    ];
  } else if (lang === "fa") {
    return [
      `کلمه «${clean}» در فارسی رایجه.`,
      `چطوری «${clean}» رو توی جمله استفاده می‌کنی؟`,
      `او با لبخند گفت «${clean}».`,
      `من زیاد می‌شنوم که مردم می‌گن «${clean}».`,
      `می‌تونی معنی «${clean}» رو توضیح بدی؟`,
    ];
  }

  return [];
}