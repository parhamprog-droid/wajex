"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Settings,
  Palette,
  Globe,
  Shield,
  Info,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Trash2,
  Type,
  Droplets,
} from "lucide-react";
import {
  loadSettings,
  saveSettings,
  DEFAULT_SETTINGS,
  type Settings as SettingsType,
  type Theme,
  type Tone,
} from "@/lib/settings";
import { clearAllTranslations } from "@/lib/db";

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

const TONES: { id: Tone; label: string }[] = [
  { id: "formal", label: "🎩 رسمی" },
  { id: "casual", label: "😎 خودمانی" },
  { id: "literary", label: "📚 ادبی" },
  { id: "scientific", label: "🧪 علمی" },
  { id: "funny", label: "🎭 طنز" },
];

export default function SettingsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [activeSection, setActiveSection] = useState<
    "appearance" | "translation" | "privacy" | "about"
  >("appearance");

  useEffect(() => {
    if (open) {
      setSettings(loadSettings());
    }
  }, [open]);

  const updateSetting = <K extends keyof SettingsType>(
    key: K,
    value: SettingsType[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleResetSettings = () => {
    if (!confirm("همه تنظیمات به حالت پیش‌فرض برگرده؟")) return;
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  };

  const handleClearHistory = async () => {
    if (!confirm("همه تاریخچه ترجمه پاک شود؟")) return;
    await clearAllTranslations();
    alert("✅ تاریخچه پاک شد");
  };

  const handleClearAllData = async () => {
    if (
      !confirm(
        "⚠️ هشدار: همه داده‌ها (تاریخچه + تنظیمات) پاک می‌شود. مطمئنی؟"
      )
    )
      return;
    await clearAllTranslations();
    localStorage.removeItem("wajex-settings");
    localStorage.removeItem("wajex-theme");
    alert("✅ همه داده‌ها پاک شد. صفحه رو رفرش کن.");
    window.location.reload();
  };

  const sections = [
    { id: "appearance" as const, label: "ظاهر", icon: Palette },
    { id: "translation" as const, label: "ترجمه", icon: Globe },
    { id: "privacy" as const, label: "حریم خصوصی", icon: Shield },
    { id: "about" as const, label: "درباره", icon: Info },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-[#0f0f1a]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-brand-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  تنظیمات
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="بستن"
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sections nav */}
            <div className="flex gap-1 border-b border-gray-200 px-4 py-2 dark:border-white/10">
              {sections.map((s) => {
                const Icon = s.icon;
                const isActive = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition ${
                      isActive
                        ? "bg-brand-500/15 text-brand-600 dark:text-brand-300"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    <Icon size={14} />
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Appearance */}
              {activeSection === "appearance" && (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Sun size={15} />
                      تم
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "light" as Theme, label: "روشن", icon: Sun },
                        { id: "dark" as Theme, label: "تاریک", icon: Moon },
                        { id: "auto" as Theme, label: "خودکار", icon: Monitor },
                      ].map((t) => {
                        const Icon = t.icon;
                        const isActive = settings.theme === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => updateSetting("theme", t.id)}
                            className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-xs font-medium transition ${
                              isActive
                                ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-300"
                                : "border-gray-200 text-gray-600 hover:border-brand-500/40 dark:border-white/10 dark:text-gray-400"
                            }`}
                          >
                            <Icon size={18} />
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Type size={15} />
                      اندازه فونت
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "small" as const, label: "کوچک" },
                        { id: "medium" as const, label: "متوسط" },
                        { id: "large" as const, label: "بزرگ" },
                      ].map((s) => {
                        const isActive = settings.fontSize === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => updateSetting("fontSize", s.id)}
                            className={`rounded-xl border-2 px-3 py-2.5 text-xs font-medium transition ${
                              isActive
                                ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-300"
                                : "border-gray-200 text-gray-600 hover:border-brand-500/40 dark:border-white/10 dark:text-gray-400"
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Droplets size={15} />
                      شفافیت شیشه: {Math.round(settings.glassOpacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.05"
                      value={settings.glassOpacity}
                      onChange={(e) =>
                        updateSetting(
                          "glassOpacity",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full accent-brand-500"
                    />
                  </div>
                </div>
              )}

              {/* Translation */}
              {activeSection === "translation" && (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      زبان پیش‌فرض مبدأ
                    </label>
                    <select
                      value={settings.defaultSourceLang}
                      onChange={(e) =>
                        updateSetting("defaultSourceLang", e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
                    >
                      {LANGS.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.flag} {l.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      زبان پیش‌فرض مقصد
                    </label>
                    <select
                      value={settings.defaultTargetLang}
                      onChange={(e) =>
                        updateSetting("defaultTargetLang", e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
                    >
                      {LANGS.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.flag} {l.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-brand-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        تشخیص خودکار زبان
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        updateSetting(
                          "autoDetectLanguage",
                          !settings.autoDetectLanguage
                        )
                      }
                      className={`relative h-6 w-11 rounded-full transition ${
                        settings.autoDetectLanguage
                          ? "bg-brand-500"
                          : "bg-gray-300 dark:bg-white/10"
                      }`}
                    >
                      <motion.span
                        layout
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                          settings.autoDetectLanguage
                            ? "right-0.5"
                            : "right-[22px]"
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      لحن پیش‌فرض
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TONES.map((t) => {
                        const isActive = settings.defaultTone === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => updateSetting("defaultTone", t.id)}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                              isActive
                                ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                            }`}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy */}
              {activeSection === "privacy" && (
                <div className="space-y-3">
                  <button
                    onClick={handleClearHistory}
                    className="flex w-full items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-right transition hover:bg-amber-500/10"
                  >
                    <Trash2 size={18} className="text-amber-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                        پاک کردن تاریخچه
                      </p>
                      <p className="text-xs text-amber-600/70 dark:text-amber-400/70">
                        همه ترجمه‌های ذخیره‌شده حذف می‌شن
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={handleResetSettings}
                    className="flex w-full items-center gap-3 rounded-xl border border-orange-500/30 bg-orange-500/5 p-4 text-right transition hover:bg-orange-500/10"
                  >
                    <Settings size={18} className="text-orange-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                        بازگشت تنظیمات به پیش‌فرض
                      </p>
                      <p className="text-xs text-orange-600/70 dark:text-orange-400/70">
                        همه تنظیمات ریست می‌شن
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={handleClearAllData}
                    className="flex w-full items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-right transition hover:bg-red-500/10"
                  >
                    <Trash2 size={18} className="text-red-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-700 dark:text-red-400">
                        پاک کردن همه داده‌ها
                      </p>
                      <p className="text-xs text-red-600/70 dark:text-red-400/70">
                        تاریخچه + تنظیمات + تم
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {/* About */}
              {activeSection === "about" && (
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/10 to-brand-300/10 p-6 text-center">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-300 text-2xl font-bold text-white shadow-lg shadow-brand-500/30">
                      W
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Wajex
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      نسخه 0.1.0
                    </p>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                      مترجم هوشمند با طراحی مدرن
                    </p>
                  </div>

                  <a
                    href="https://github.com/parhamprog-droid/wajex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 p-3 text-sm font-medium text-gray-700 transition hover:border-brand-500/40 hover:bg-brand-500/5 dark:border-white/10 dark:text-gray-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    مشاهده در GitHub
                  </a>

                  <div className="rounded-xl bg-gray-50 p-4 text-center text-xs text-gray-500 dark:bg-white/5 dark:text-gray-400">
                    ساخته شده با ❤️ برای فارسی‌زبانان
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}