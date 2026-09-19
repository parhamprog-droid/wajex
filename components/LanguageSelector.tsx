"use client";

import { ChevronDown } from "lucide-react";

const LANGS = [
  { code: "fa", name: "فارسی", flag: "🇮🇷" },
  { code: "en", name: "انگلیسی", flag: "🇬🇧" },
  { code: "ar", name: "عربی", flag: "🇸🇦" },
  { code: "tr", name: "ترکی", flag: "🇹🇷" },
  { code: "fr", name: "فرانسوی", flag: "🇫🇷" },
  { code: "de", name: "آلمانی", flag: "🇩🇪" },
  { code: "es", name: "اسپانیایی", flag: "🇪🇸" },
  { code: "it", name: "ایتالیایی", flag: "🇮🇹" },
  { code: "ru", name: "روسی", flag: "🇷🇺" },
  { code: "zh", name: "چینی", flag: "🇨🇳" },
  { code: "ja", name: "ژاپنی", flag: "🇯🇵" },
  { code: "ko", name: "کره‌ای", flag: "🇰🇷" },
  { code: "hi", name: "هندی", flag: "🇮🇳" },
  { code: "ur", name: "اردو", flag: "🇵🇰" },
  { code: "pt", name: "پرتغالی", flag: "🇵🇹" },
  { code: "nl", name: "هلندی", flag: "🇳🇱" },
  { code: "sv", name: "سوئدی", flag: "🇸🇪" },
  { code: "pl", name: "لهستانی", flag: "🇵🇱" },
  { code: "he", name: "عبری", flag: "🇮🇱" },
  { code: "el", name: "یونانی", flag: "🇬🇷" },
];

export default function LanguageSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-xl bg-transparent py-2 pr-8 pl-3 text-sm font-medium text-gray-700 transition hover:bg-brand-500/10 focus:outline-none dark:text-gray-200"
        dir="rtl"
      >
        {LANGS.map((l) => (
          <option
            key={l.code}
            value={l.code}
            className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
          >
            {l.flag} {l.name}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}