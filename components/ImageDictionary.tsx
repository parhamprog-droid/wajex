"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Loader2, ExternalLink } from "lucide-react";
import {
  searchImages,
  shouldShowImages,
  translateKeywordToEnglish,
  type ImageResult,
} from "@/lib/images";

export default function ImageDictionary({
  word,
  englishWord: passedEnglishWord = "",
  sourceLang,
}: {
  word: string;
  englishWord?: string;
  sourceLang: string;
}) {
  const [images, setImages] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [englishWord, setEnglishWord] = useState(passedEnglishWord);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!word || !shouldShowImages(word)) {
      setImages([]);
      return;
    }

    let cancelled = false;

    const loadImages = async () => {
      setLoading(true);
      setError(false);

      try {
        // اگه کلمه انگلیسی از قبل داریم، استفاده کن
        let en = passedEnglishWord;

        // وگرنه ترجمه کن
        if (!en) {
          en = await translateKeywordToEnglish(word, sourceLang);
        }

        if (cancelled) return;
        setEnglishWord(en);

        // گرفتن عکس‌ها
        const results = await searchImages(en, 6);
        if (cancelled) return;

        if (results.length === 0) {
          setError(true);
          setImages([]);
        } else {
          setImages(results);
        }
      } catch (err) {
        console.error("Image loading error:", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [word, passedEnglishWord, sourceLang]);

  if (!word || !shouldShowImages(word)) {
    return (
      <p className="text-center text-gray-400 dark:text-gray-500">
        یه کلمه ترجمه کن تا عکس‌های مرتبط نشون داده بشه
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="mb-3"
        >
          <Loader2 size={28} className="text-brand-500" />
        </motion.div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          در حال جستجوی عکس...
        </p>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <ImageIcon
          size={32}
          className="mb-2 text-gray-300 dark:text-gray-600"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          عکسی برای «{englishWord || word}» پیدا نشد
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
        عکس‌های مرتبط با «
        <span className="font-medium text-brand-600 dark:text-brand-300">
          {englishWord || word}
        </span>
        »:
      </p>

      <div className="grid grid-cols-3 gap-2">
        <AnimatePresence>
          {images.map((img, i) => (
            <motion.a
              key={img.id}
              href={img.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring" }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 dark:border-white/10"
            >
              <img
                src={img.thumb}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
                <ExternalLink size={16} className="text-white" />
                <p className="mt-1 px-2 text-center text-[10px] text-white/90">
                  {img.author}
                </p>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
        <span>عکس‌ها از</span>
        <a
          href="https://www.flickr.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-500 hover:underline"
        >
          Flickr
        </a>
      </div>
    </div>
  );
}