"use client";

import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Camera,
  Paperclip,
  Copy,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Check,
  FileUp,
  Link2,
  Loader2,
  X,
  FileText,
  Sparkles,
} from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import SwapButton from "./SwapButton";
import type { TabId } from "./TabBar";
import {
  addTranslation,
  findByContent,
  toggleSavedByContent,
  type TranslationItem,
} from "@/lib/db";
import { applyTone, type Tone } from "@/lib/tone";

type SpeechRecognitionType = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
};

export type TranslatorCardHandle = {
  clear: () => void;
  save: () => void;
};

async function translateLongText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  const MAX_CHUNK = 450;
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?؟।\n])\s+/);
  let currentChunk = "";
  for (const sentence of sentences) {
    if ((currentChunk + " " + sentence).length <= MAX_CHUNK) {
      currentChunk += (currentChunk ? " " : "") + sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());

  const translations: string[] = [];
  for (const chunk of chunks) {
    if (!chunk.trim()) continue;
    const langPair = `${sourceLang}|${targetLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      chunk
    )}&langpair=${encodeURIComponent(langPair)}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      let translated = data.responseData?.translatedText || "";
      if (translated && !translated.includes("INVALID")) {
        translated = translated.replace(/\[.*?\]\s*/g, "");
        translated = translated.replace(/\(.*?\)\s*/g, "");
        translations.push(translated.trim());
      }
    } catch (err) {
      console.error("Chunk translation error:", err);
    }
  }
  return translations.join(" ");
}

function detectByCharacters(text: string): string | null {
  const persianRegex =
    /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g;
  const cjkRegex = /[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/g;
  const cyrillicRegex = /[\u0400-\u04FF]/g;
  const latinRegex = /[a-zA-Z]/g;
  const persianMatches = (text.match(persianRegex) || []).length;
  const cjkMatches = (text.match(cjkRegex) || []).length;
  const cyrillicMatches = (text.match(cyrillicRegex) || []).length;
  const latinMatches = (text.match(latinRegex) || []).length;
  const total = persianMatches + cjkMatches + cyrillicMatches + latinMatches;
  if (total === 0) return null;
  if (persianMatches / total > 0.5) return "fa";
  if (cjkMatches / total > 0.3) return "zh";
  if (cyrillicMatches / total > 0.5) return "ru";
  if (latinMatches / total > 0.5) return "en";
  return null;
}

const TranslatorCard = forwardRef<
  TranslatorCardHandle,
  {
    prefill?: TranslationItem | null;
    activeTab: TabId;
    tone: Tone;
    onToneChange: (tone: Tone) => void;
    onTranslationComplete?: (
      input: string,
      output: string,
      sourceLang: string,
      targetLang: string,
      translationTimeMs: number
    ) => void;
  }
>(function TranslatorCard(
  {
    prefill,
    activeTab,
    tone,
    onToneChange,
    onTranslationComplete,
  },
  ref
) {
  const [sourceLang, setSourceLang] = useState(prefill?.sourceLang ?? "fa");
  const [targetLang, setTargetLang] = useState(prefill?.targetLang ?? "en");
  const [input, setInput] = useState(prefill?.input ?? "");
  const [output, setOutput] = useState(prefill?.output ?? "");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docLoading, setDocLoading] = useState(false);
  const [docStatus, setDocStatus] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [autoDetect, setAutoDetect] = useState(true);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>("");
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const detectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const toneRef = useRef<Tone>(tone);

  useEffect(() => {
    toneRef.current = tone;
  }, [tone]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      setInput("");
      setOutput("");
      setIsSaved(false);
      lastSavedRef.current = "";
    },
    save: async () => {
      if (!input.trim() || !output || output.startsWith("❌")) return;
      await addTranslation({
        sourceLang,
        targetLang,
        input: input.trim(),
        output,
      });
      setIsSaved(true);
    },
  }));

  useEffect(() => {
    if (!autoDetect || !input.trim() || input.length < 3) {
      setDetectedLang(null);
      return;
    }
    if (detectTimerRef.current) clearTimeout(detectTimerRef.current);
    detectTimerRef.current = setTimeout(() => {
      const detected = detectByCharacters(input);
      setDetectedLang(detected);
      if (detected && detected !== sourceLang && detected !== targetLang) {
        setSourceLang(detected);
        if (detected === targetLang) {
          setTargetLang(detected === "fa" ? "en" : "fa");
        }
      }
    }, 500);
    return () => {
      if (detectTimerRef.current) clearTimeout(detectTimerRef.current);
    };
  }, [input, autoDetect, sourceLang, targetLang]);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setIsSaved(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doTranslate(input);
    }, 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, sourceLang, targetLang, tone]);

  useEffect(() => {
    if (!input.trim() || !output || output.startsWith("❌")) {
      setIsSaved(false);
      return;
    }
    let cancelled = false;
    findByContent(sourceLang, targetLang, input.trim()).then((item) => {
      if (!cancelled) setIsSaved(item?.saved ?? false);
    });
    return () => {
      cancelled = true;
    };
  }, [input, output, sourceLang, targetLang]);

  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (!input.trim() || !output || output.startsWith("❌")) return;
    if (input.trim().length < 5) return;
    saveTimerRef.current = setTimeout(async () => {
      const cacheKey = `${sourceLang}|${targetLang}|${input}`;
      if (cacheKey === lastSavedRef.current) return;
      const existing = await findByContent(
        sourceLang,
        targetLang,
        input.trim()
      );
      if (existing) {
        lastSavedRef.current = cacheKey;
        return;
      }
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
    const startTime = Date.now();
    try {
      const tonedText = applyTone(text, toneRef.current);
      const translated = await translateLongText(
        tonedText,
        sourceLang,
        targetLang
      );
      const finalOutput = translated || "❌ ترجمه پیدا نشد";
      setOutput(finalOutput);

      const timeMs = Date.now() - startTime;
      if (
        onTranslationComplete &&
        finalOutput &&
        !finalOutput.startsWith("❌")
      ) {
        onTranslationComplete(
          text,
          finalOutput,
          sourceLang,
          targetLang,
          timeMs
        );
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
    setDetectedLang(null);
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

  const handleToggleSave = async () => {
    if (!input.trim() || !output || output.startsWith("❌")) return;
    const newSaved = await toggleSavedByContent(
      sourceLang,
      targetLang,
      input.trim(),
      output
    );
    setIsSaved(newSaved);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("مرورگر شما از تشخیص گفتار پشتیبانی نمی‌کند.");
      return;
    }
    const recognition: SpeechRecognitionType = new SpeechRecognition();
    recognition.lang = sourceLang === "fa" ? "fa-IR" : sourceLang;
    recognition.continuous = true;
    recognition.interimResults = true;
    let finalTranscript = "";
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interim += transcript;
      }
      setInput((finalTranscript + interim).trim());
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const handleLinkTranslate = async () => {
    if (!linkUrl.trim()) return;
    setLinkLoading(true);
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
        linkUrl
      )}`;
      const res = await fetch(proxyUrl);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      doc
        .querySelectorAll("script, style, noscript, nav, header, footer")
        .forEach((el) => el.remove());
      let text = "";
      const main = doc.querySelector("main, article, .content, #content");
      if (main) text = main.textContent || "";
      else text = doc.body?.textContent || "";
      const cleanText = text
        .replace(/\s+/g, " ")
        .replace(/\n+/g, "\n")
        .trim()
        .slice(0, 2000);
      if (!cleanText) setInput("❌ متنی توی این صفحه پیدا نشد");
      else setInput(cleanText);
    } catch (err) {
      console.error(err);
      setInput("❌ خطا در دریافت محتوای سایت");
    } finally {
      setLinkLoading(false);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      setDocStatus(`در حال خواندن صفحه ${i} از ${pdf.numPages}...`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n\n";
    }
    return fullText.trim();
  };

  const extractTextFromDOCX = async (file: File): Promise<string> => {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  };

  const handleDocFile = async (file: File) => {
    setDocFile(file);
    setDocLoading(true);
    setDocStatus("در حال پردازش فایل...");
    try {
      let text = "";
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith(".pdf")) text = await extractTextFromPDF(file);
      else if (fileName.endsWith(".docx"))
        text = await extractTextFromDOCX(file);
      else if (fileName.endsWith(".txt")) text = await file.text();
      else throw new Error("فرمت فایل پشتیبانی نمی‌شود.");
      if (!text || text.length < 2) setInput("❌ متنی توی این فایل پیدا نشد");
      else {
        setInput(text.slice(0, 5000));
        setDocStatus(`✅ ${text.length} کاراکتر استخراج شد`);
      }
    } catch (err: any) {
      console.error("Doc error:", err);
      setInput(`❌ خطا در خواندن فایل: ${err?.message || "دوباره تلاش کن"}`);
    } finally {
      setDocLoading(false);
      setTimeout(() => setDocStatus(""), 3000);
    }
  };

  const onDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleDocFile(file);
  };

  const onDocDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleDocFile(file);
  };

  const clearDoc = () => {
    setDocFile(null);
    setDocStatus("");
    setInput("");
    setOutput("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass relative mx-auto max-w-6xl rounded-3xl p-2"
    >
      <div className="mb-2 flex items-center justify-between rounded-2xl bg-white/40 px-4 py-2 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoDetect(!autoDetect)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              autoDetect
                ? "bg-brand-500/15 text-brand-600 dark:text-brand-300"
                : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            }`}
            title="تشخیص خودکار زبان"
          >
            <Sparkles size={14} />
            تشخیص خودکار زبان
          </button>
          {detectedLang && autoDetect && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-400"
            >
              تشخیص:{" "}
              {detectedLang === "fa"
                ? "فارسی"
                : detectedLang === "en"
                ? "انگلیسی"
                : detectedLang === "ar"
                ? "عربی"
                : detectedLang === "zh"
                ? "چینی"
                : detectedLang === "ru"
                ? "روسی"
                : detectedLang}
            </motion.span>
          )}
        </div>

        {loading && (
          <div className="progress-bar h-1 w-24 overflow-hidden rounded-full bg-brand-500/20">
            <div className="h-full w-full bg-gradient-to-r from-brand-500 to-brand-300" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeTab === "link" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 overflow-hidden"
          >
            <div className="flex items-center gap-2 rounded-2xl bg-white/40 p-3 dark:bg-white/5">
              <Link2 size={18} className="text-brand-500" />
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                dir="ltr"
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLinkTranslate();
                }}
              />
              <button
                onClick={handleLinkTranslate}
                disabled={linkLoading || !linkUrl.trim()}
                className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-brand-500/30 transition hover:bg-brand-600 active:scale-95 disabled:opacity-50"
              >
                {linkLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  "ترجمه"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeTab === "doc" && !docFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 overflow-hidden"
          >
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDocDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition ${
                isDragging
                  ? "border-brand-500 bg-brand-500/10"
                  : "border-gray-300 bg-white/40 hover:border-brand-500/60 hover:bg-brand-500/5 dark:border-white/20 dark:bg-white/5"
              }`}
            >
              <FileUp
                size={40}
                className={`mb-3 ${
                  isDragging ? "text-brand-500" : "text-gray-400"
                }`}
              />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isDragging
                  ? "رها کن تا آپلود شه"
                  : "سند را بکش و رها کن یا کلیک کن"}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                PDF, DOCX, TXT (حداکثر ۱۰ مگابایت)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={onDocChange}
                className="hidden"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeTab === "doc" && docFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 overflow-hidden"
          >
            <div className="relative rounded-2xl bg-white/40 p-3 dark:bg-white/5">
              <button
                onClick={clearDoc}
                className="absolute top-2 right-2 z-10 rounded-full bg-red-500 p-1 text-white shadow-md transition hover:bg-red-600"
                aria-label="حذف سند"
              >
                <X size={14} />
              </button>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-brand-500/10">
                  <FileText size={28} className="text-brand-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {docFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(docFile.size / 1024).toFixed(1)} KB
                  </p>
                  {docLoading && (
                    <p className="mt-1 text-xs text-brand-600 dark:text-brand-300">
                      {docStatus || "در حال پردازش..."}
                    </p>
                  )}
                  {!docLoading && docStatus && (
                    <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                      {docStatus}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-2 md:grid-cols-2">
        <Panel
          lang={sourceLang}
          onLangChange={(v) => {
            setSourceLang(v);
            setAutoDetect(false);
          }}
          value={input}
          onChange={setInput}
          placeholder={
            activeTab === "voice"
              ? "🎤 در حال شنیدن... حرف بزن"
              : activeTab === "doc"
              ? "📄 متن استخراج‌شده اینجا میاد..."
              : activeTab === "link"
              ? "🔗 نتیجه ترجمه لینک اینجا میاد..."
              : "متن خود را بنویسید... (Ctrl+K برای پاک کردن)"
          }
          actions={
            <>
              {activeTab === "text" && (
                <>
                  <IconBtn
                    icon={
                      isListening ? (
                        <MicOff size={17} className="text-red-500" />
                      ) : (
                        <Mic size={17} />
                      )
                    }
                    label="میکروفون"
                    onClick={toggleListening}
                    isActive={isListening}
                  />
                  <IconBtn icon={<Camera size={17} />} label="دوربین" />
                  <IconBtn icon={<Paperclip size={17} />} label="پیوست" />
                </>
              )}
              {activeTab === "voice" && (
                <IconBtn
                  icon={
                    isListening ? (
                      <MicOff size={17} className="text-red-500" />
                    ) : (
                      <Mic size={17} />
                    )
                  }
                  label={isListening ? "توقف" : "شروع"}
                  onClick={toggleListening}
                  isActive={isListening}
                />
              )}
              {activeTab === "doc" && (
                <IconBtn
                  icon={<FileUp size={17} />}
                  label="انتخاب سند"
                  onClick={() => fileInputRef.current?.click()}
                />
              )}
              {activeTab === "link" && (
                <IconBtn icon={<Link2 size={17} />} label="لینک" />
              )}
            </>
          }
          isListening={isListening}
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
              <IconBtn
                icon={
                  isSaved ? (
                    <BookmarkCheck size={17} className="text-brand-500" />
                  ) : (
                    <Bookmark size={17} />
                  )
                }
                label={isSaved ? "حذف" : "ذخیره (Ctrl+S)"}
                onClick={handleToggleSave}
              />
            </>
          }
        />
      </div>
    </motion.div>
  );
});

export default TranslatorCard;

// ============ Panel Component ============
function Panel({
  lang,
  onLangChange,
  value,
  onChange,
  placeholder,
  actions,
  readOnly,
  loading,
  isListening,
}: {
  lang: string;
  onLangChange: (v: string) => void;
  value: string;
  onChange?: (v: string) => void;
  placeholder: string;
  actions: React.ReactNode;
  readOnly?: boolean;
  loading?: boolean;
  isListening?: boolean;
}) {
  return (
    <div
      className={`flex min-h-[280px] flex-col rounded-2xl bg-white/40 p-5 transition-all dark:bg-white/5 ${
        isListening ? "ring-2 ring-red-500/60" : ""
      }`}
    >
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

        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-2 right-2 flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-red-500"
            />
            در حال شنیدن
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ============ IconBtn Component ============
function IconBtn({
  icon,
  label,
  onClick,
  isActive,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`rounded-lg p-2 transition active:scale-90 ${
        isActive
          ? "bg-red-500/15 text-red-500"
          : "text-gray-500 hover:bg-brand-500/10 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-300"
      }`}
    >
      {icon}
    </button>
  );
}