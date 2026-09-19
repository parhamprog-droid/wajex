// lib/stats.ts
// محاسبه آمار ترجمه‌ها

import { getAllTranslations, type TranslationItem } from "./db";

export type Stats = {
  totalTranslations: number;
  totalWords: number;
  totalChars: number;
  savedCount: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  streak: number;
  topLanguages: { code: string; count: number; name: string }[];
  topTones: { tone: string; count: number }[];
  hourlyActivity: number[];
  dailyActivity: { date: string; count: number }[];
};

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

export async function calculateStats(): Promise<Stats> {
  const translations = await getAllTranslations();

  const now = Date.now();
  const dayMs = 86400000;
  const weekMs = dayMs * 7;
  const monthMs = dayMs * 30;

  // محاسبه پایه
  const totalTranslations = translations.length;
  const savedCount = translations.filter((t) => t.saved).length;

  let totalWords = 0;
  let totalChars = 0;

  translations.forEach((t) => {
    totalWords += t.input.trim().split(/\s+/).filter(Boolean).length;
    totalChars += t.input.replace(/\s/g, "").length;
  });

  // بازه‌های زمانی
  const todayCount = translations.filter(
    (t) => now - t.createdAt < dayMs
  ).length;
  const weekCount = translations.filter(
    (t) => now - t.createdAt < weekMs
  ).length;
  const monthCount = translations.filter(
    (t) => now - t.createdAt < monthMs
  ).length;

  // محاسبه Streak (روزهای پیاپی)
  const uniqueDays = Array.from(
    new Set(
      translations.map((t) => {
        const d = new Date(t.createdAt);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
    )
  ).sort();

  let streak = 0;
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  if (uniqueDays.length > 0) {
    if (uniqueDays.includes(todayKey)) {
      streak = 1;
      let checkDate = new Date(today);
      for (let i = 1; i < 365; i++) {
        checkDate = new Date(checkDate.getTime() - dayMs);
        const key = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
        if (uniqueDays.includes(key)) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  // زبان‌های پرکاربرد
  const langCounts: Record<string, number> = {};
  translations.forEach((t) => {
    const key = t.targetLang;
    langCounts[key] = (langCounts[key] || 0) + 1;
  });

  const topLanguages = Object.entries(langCounts)
    .map(([code, count]) => ({
      code,
      count,
      name: LANG_NAMES[code] || code,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // ساعت‌های پرکار
  const hourlyActivity = new Array(24).fill(0);
  translations.forEach((t) => {
    const hour = new Date(t.createdAt).getHours();
    hourlyActivity[hour]++;
  });

  // فعالیت روزانه (۱۴ روز اخیر)
  const dailyActivity: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now - i * dayMs);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const count = translations.filter((t) => {
      const d = new Date(t.createdAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` === key;
    }).length;

    dailyActivity.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      count,
    });
  }

  return {
    totalTranslations,
    totalWords,
    totalChars,
    savedCount,
    todayCount,
    weekCount,
    monthCount,
    streak,
    topLanguages,
    topTones: [],
    hourlyActivity,
    dailyActivity,
  };
}

// فرمت عدد با جداکننده
export function formatNumber(num: number): string {
  return num.toLocaleString("fa-IR");
}