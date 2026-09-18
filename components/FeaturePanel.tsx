"use client";

import { Sparkles, Info, Languages, BookOpen } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TONES = [
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

export default function FeaturePanel() {
  const [activeFeature, setActiveFeature] = useState("explain");
  const [tone, setTone] = useState("formal");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mx-auto mt-6 max-w-6xl"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Sparkles size={15} className="text-brand-500" />
          لحن ترجمه:
        </span>
        {TONES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTone(t.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              tone === t.id
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                : "bg-white/60 text-gray-600 hover:bg-brand-500/10 dark:bg-white/5 dark:text-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl p-1.5">
        <div className="flex gap-1 border-b border-gray-200/50 px-2 pb-2 dark:border-white/10">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            const isActive = activeFeature === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFeature(f.id)}
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
            {activeFeature === "explain" && (
              <p>
                کلمه <b className="text-brand-600 dark:text-brand-300">"سلام"</b> در
                انگلیسی به <b>"Hello"</b> ترجمه شده چون در بافت رسمی و مکالمه
                روزمره کاربرد داره. برای حالت غیررسمی، <b>"Hi"</b> پیشنهاد می‌شه.
              </p>
            )}
            {activeFeature === "synonyms" && (
              <div className="flex flex-wrap gap-2">
                {["Hello", "Hi", "Hey", "Greetings", "Howdy"].map((s) => (
                  <span
                    key={s}
                    className="rounded-lg bg-brand-500/10 px-3 py-1 text-brand-700 dark:text-brand-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
            {activeFeature === "examples" && (
              <ul className="space-y-2">
                <li>• <b>Hello</b>, how are you today?</li>
                <li>• She said <b>hello</b> with a warm smile.</li>
                <li>• <b>Hello</b> world! (first program)</li>
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}