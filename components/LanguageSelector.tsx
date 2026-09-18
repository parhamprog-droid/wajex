"use client";

import { ChevronDown } from "lucide-react";

const LANGS = [
  { code: "fa", name: "فارسی", flag: "🇮🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
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
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code} className="dark:bg-gray-900">
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