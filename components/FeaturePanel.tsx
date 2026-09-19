"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Info,
  Languages,
  BookOpen,
  Clock,
  FileText,
  Type,
  Hash,
} from "lucide-react";
import {
  getToneLabel,
  type Tone,
} from "@/lib/tone";
import {
  buildTranslationStats,
  getLangName,
  findSynonyms,
  buildExamples,
} from "@/lib/translationInfo";

const TONES: { id: Tone; label: string }[] = [
  { id: "formal", label: "🎩 رسمی" },
  { id: "casual", label: "😎 خودمانی" },
  { id: "literary", label: "📚 ادبی" },
  { id: "scientific", label: "🧪 علمی" },
  { id: "funny", label: "🎭 طنز" },
];

const FEATURES = [
  { id: "explain", label: "توضیح ترجمه", icon: Info },
  { id: "synonyms", label: "مترادف‌ها", icon: Languages },
  { id: "examples", label: "مثال‌ها", icon: BookOpen },
];

export default function FeaturePanel({
  tone,
  onToneChange,
  input,
  output,
  sourceLang,
  targetLang,
  translationTimeMs = 0,
}: {
  tone: Tone;
  onToneChange: (tone: Tone) => void;
  input: string;
  output: string;
  sourceLang: string;
  targetLang: string;
  translationTimeMs?: number;
}) {
  const [activeFeature, setActiveFeature] = useState<
    "explain" | "synonyms" | "examples"
  >("explain");

  // ساخت آمار ترجمه
  const stats = useMemo(() => {
    if (!input.trim() || !output.trim()) return null;
    return buildTranslationStats(
      input,
      output,
      sourceLang,
      targetLang,
      tone,
      getToneLabel(tone),
      translationTimeMs
    );
  }, [input, output, sourceLang, targetLang, tone, translationTimeMs]);

  // اولین کلمه مهم برای مترادف/مثال
  const firstWord = useMemo(() => {
    if (!output.trim()) return "";
    const words = output.trim().split(/\s+/);
    // اولین کلمه با طول بیشتر از ۳
    return words.find((w) => w.length > 3) || words[0] || "";
  }, [output]);

  // مترادف‌ها
  const synonyms = useMemo(() => {
    if (!firstWord) return [];
    return findSynonyms(firstWord);
  }, [firstWord]);

  // مثال‌ها
  const examples = useMemo(() => {
    if (!firstWord) return [];
    return buildExamples(firstWord, targetLang);
  }, [firstWord, targetLang]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mx-auto mt-6 max-w-6xl"
    >
      {/* انتخاب لحن */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Sparkles size={15} className="text-brand-500" />
          لحن ترجمه:
        </span>
        {TONES.map((t) => (
          <button
            key={t.id}
            onClick={() => onToneChange(t.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              tone === t.id
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                : "bg-white/60 text-gray-600 hover:bg-brand-500/10 dark:bg-white/5 dark:text-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
        {tone !== "formal" && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-400"
          >
            فعال
          </motion.span>
        )}
      </div>

      {/* پنل ویژگی */}
      <div className="glass rounded-2xl p-1.5">
        <div className="flex gap-1 border-b border-gray-200/50 px-2 pb-2 dark:border-white/10">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            const isActive = activeFeature === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFeature(f.id as any)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-500/15 text-brand-600 dark:text-brand-300"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
              >
                <Icon size={15} />
                {f.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="p-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
          >
            {/* توضیح ترجمه */}
            {activeFeature === "explain" && (
              <>
                {!stats ? (
                  <p className="text-center text-gray-400 dark:text-gray-500">
                    یه متن ترجمه کن تا توضیحات اینجا نمایش داده بشه
                  </p>
                ) : (
                  <div className="space-y-3">
                    {/* آمار */}
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                      <StatBox
                        icon={<FileText size={14} />}
                        label="کلمات مبدأ"
                        value={stats.sourceWordCount.toString()}
                      />
                      <StatBox
                        icon={<FileText size={14} />}
                        label="کلمات مقصد"
                        value={stats.targetWordCount.toString()}
                      />
                      <StatBox
                        icon={<Hash size={14} />}
                        label="کاراکترها"
                        value={stats.targetCharCount.toString()}
                      />
                      <StatBox
                        icon={<Clock size={14} />}
                        label="زمان ترجمه"
                        value={
                          stats.translationTimeMs > 0
                            ? `${stats.translationTimeMs}ms`
                            : "—"
                        }
                      />
                    </div>

                    {/* مسیر ترجمه */}
                    <div className="rounded-xl bg-brand-500/5 p-3">
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-300">
                        <Languages size={13} />
                        مسیر ترجمه
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">
                          {getLangName(stats.sourceLang)}
                        </span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="font-medium">
                          {getLangName(stats.targetLang)}
                        </span>
                      </p>
                    </div>

                    {/* لحن */}
                    <div className="rounded-xl bg-purple-500/5 p-3">
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-purple-600 dark:text-purple-300">
                        <Sparkles size={13} />
                        لحن اعمال‌شده
                      </p>
                      <p className="text-sm font-medium">{stats.toneLabel}</p>
                    </div>

                    {/* زمان خواندن */}
                    <div className="rounded-xl bg-blue-500/5 p-3">
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-300">
                        <Clock size={13} />
                        زمان تقریبی خواندن
                      </p>
                      <p className="text-sm">{stats.estimatedReadingTime}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* مترادف‌ها */}
            {activeFeature === "synonyms" && (
              <>
                {synonyms.length === 0 ? (
                  <p className="text-center text-gray-400 dark:text-gray-500">
                    {!output
                      ? "یه متن ترجمه کن تا مترادف‌ها نمایش داده بشن"
                      : `برای «${firstWord}» مترادفی پیدا نشد`}
                  </p>
                ) : (
                  <div>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                      مترادف‌های «
                      <span className="font-medium text-brand-600 dark:text-brand-300">
                        {firstWord}
                      </span>
                      »:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {synonyms.map((s) => (
                        <button
                          key={s}
                          onClick={() => navigator.clipboard.writeText(s)}
                          className="rounded-lg bg-brand-500/10 px-3 py-1.5 text-brand-700 transition hover:bg-brand-500/20 active:scale-95 dark:text-brand-300"
                          title="کلیک کن تا کپی کنی"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* مثال‌ها */}
            {activeFeature === "examples" && (
              <>
                {examples.length === 0 ? (
                  <p className="text-center text-gray-400 dark:text-gray-500">
                    {!output
                      ? "یه متن ترجمه کن تا مثال‌ها نمایش داده بشن"
                      : "مثالی برای این متن پیدا نشد"}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {examples.map((ex, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-brand-500">•</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function StatBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-gray-100/50 p-2.5 text-center dark:bg-white/5">
      <div className="mb-1 flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400">
        {icon}
        <span className="text-[10px]">{label}</span>
      </div>
      <p className="text-base font-bold text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
}