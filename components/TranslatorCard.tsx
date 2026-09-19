"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Camera,
  Paperclip,
  Copy,
  Volume2,
  Bookmark,
  Check,
} from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import SwapButton from "./SwapButton";
import { addTranslation, type TranslationItem } from "@/lib/db";

export default function TranslatorCard({
  prefill,
}: {
  prefill?: TranslationItem | null;
}) {
  const [sourceLang, setSourceLang] = useState(prefill?.sourceLang ?? "fa");
  const [targetLang, setTargetLang] = useState(prefill?.targetLang ?? "en");
  const [input, setInput] = useState(prefill?.input ?? "");
  const [output, setOutput] = useState(prefill?.output ?? "");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>("");

  // ترجمه بعد از ۸۰۰ms توقف تایپ
  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      doTranslate(input);
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, sourceLang, targetLang]);

  // ذخیره در تاریخچه بعد از ۳ ثانیه بی‌کاری + حداقل ۵ حرف
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    if (!input.trim() || !output || output.startsWith("❌")) return;
    if (input.trim().length < 5) return;

    saveTimerRef.current = setTimeout(async () => {
      const cacheKey = `${sourceLang}|${targetLang}|${input}`;
      if (cacheKey === lastSavedRef.current) return;
      lastSavedRef.current = cacheKey;

      await addTranslation({
        sourceLang,
        targetLang,
        input: input.trim(),
        output,
      });
    }, 3000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [input, output, sourceLang, targetLang]);

  const doTranslate = async (text: string) => {
    setLoading(true);
    try {
      const langPair = `${sourceLang}|${targetLang}`;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${encodeURIComponent(langPair)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.responseData?.translatedText) {
        let cleanText = data.responseData.translatedText;

        if (
          cleanText.includes("INVALID") ||
          cleanText.includes("QUERY LENGTH")
        ) {
          setOutput("❌ این متن قابل ترجمه نیست");
          return;
        }

        cleanText = cleanText.replace(/\[.*?\]\s*/g, "");
        cleanText = cleanText.replace(/\(.*?\)\s*/g, "");
        cleanText = cleanText.trim();
        setOutput(cleanText || "❌ ترجمه پیدا نشد");
      } else {
        setOutput("❌ ترجمه پیدا نشد");
      }
    } catch (err) {
      console.error(err);
      setOutput("❌ خطا در اتصال به سرور ترجمه");
    } finally {
      setLoading(false);
    }
  };

  const swap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInput(output);
    setOutput(input);
    lastSavedRef.current = "";
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const speakOutput = () => {
    if (!output || typeof window === "undefined") return;
    const utter = new SpeechSynthesisUtterance(output);
    utter.lang = targetLang === "fa" ? "fa-IR" : targetLang;
    window.speechSynthesis.speak(utter);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass relative mx-auto max-w-6xl rounded-3xl p-2"
    >
      <div className="grid gap-2 md:grid-cols-2">
        <Panel
          lang={sourceLang}
          onLangChange={setSourceLang}
          value={input}
          onChange={setInput}
          placeholder="متن خود را بنویسید..."
          actions={
            <>
              <IconBtn icon={<Mic size={17} />} label="میکروفون" />
              <IconBtn icon={<Camera size={17} />} label="دوربین" />
              <IconBtn icon={<Paperclip size={17} />} label="پیوست" />
            </>
          }
        />

        <div className="absolute top-1/2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block">
          <SwapButton onSwap={swap} />
        </div>

        <Panel
          lang={targetLang}
          onLangChange={setTargetLang}
          value={output}
          readOnly
          loading={loading}
          placeholder="ترجمه اینجا ظاهر می‌شود..."
          actions={
            <>
              <IconBtn
                icon={
                  copied ? (
                    <Check size={17} className="text-green-500" />
                  ) : (
                    <Copy size={17} />
                  )
                }
                label="کپی"
                onClick={copyOutput}
              />
              <IconBtn
                icon={<Volume2 size={17} />}
                label="بلندگو"
                onClick={speakOutput}
              />
              <IconBtn icon={<Bookmark size={17} />} label="ذخیره" />
            </>
          }
        />
      </div>
    </motion.div>
  );
}

function Panel({
  lang,
  onLangChange,
  value,
  onChange,
  placeholder,
  actions,
  readOnly,
  loading,
}: {
  lang: string;
  onLangChange: (v: string) => void;
  value: string;
  onChange?: (v: string) => void;
  placeholder: string;
  actions: React.ReactNode;
  readOnly?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="flex min-h-[280px] flex-col rounded-2xl bg-white/40 p-5 dark:bg-white/5">
      <div className="mb-3 flex items-center justify-between">
        <LanguageSelector value={lang} onChange={onLangChange} />
        <div className="flex items-center gap-1">{actions}</div>
      </div>

      <div className="relative flex-1">
        <textarea
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          dir="auto"
          className="h-full w-full resize-none bg-transparent text-lg leading-relaxed text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
        />
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-2 left-2 flex gap-1"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="h-2 w-2 rounded-full bg-brand-500"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function IconBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-lg p-2 text-gray-500 transition hover:bg-brand-500/10 hover:text-brand-600 active:scale-90 dark:text-gray-400 dark:hover:text-brand-300"
    >
      {icon}
    </button>
  );
}