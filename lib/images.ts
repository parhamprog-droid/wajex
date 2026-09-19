// lib/images.ts
// گرفتن عکس از loremflickr با دقت بهتر

export type ImageResult = {
  id: string;
  url: string;
  thumb: string;
  alt: string;
  author: string;
  authorUrl: string;
};

// گرفتن عکس‌های مرتبط از loremflickr
export async function searchImages(
  keyword: string,
  count: number = 6
): Promise<ImageResult[]> {
  if (!keyword.trim()) return [];

  try {
    const results: ImageResult[] = [];
    const encoded = encodeURIComponent(keyword.trim().toLowerCase());

    for (let i = 0; i < count; i++) {
      // loremflickr با lock برای عکس‌های مختلف
      const url = `https://loremflickr.com/400/400/${encoded}?lock=${i + 1}`;

      // تست لود شدن عکس
      const loaded = await new Promise<boolean>((resolve) => {
        const img = new Image();
        const timeout = setTimeout(() => resolve(false), 5000);
        img.onload = () => {
          clearTimeout(timeout);
          resolve(true);
        };
        img.onerror = () => {
          clearTimeout(timeout);
          resolve(false);
        };
        img.src = url;
      });

      if (loaded) {
        results.push({
          id: `img-${i}`,
          url: url,
          thumb: url,
          alt: keyword,
          author: "Flickr",
          authorUrl: `https://www.flickr.com/search/?text=${encoded}`,
        });
      }
    }

    return results;
  } catch (err) {
    console.error("Image search error:", err);
    return [];
  }
}

// تشخیص اینکه کلمه ارزش عکس داره یا نه
export function shouldShowImages(word: string): boolean {
  if (!word) return false;
  const clean = word.replace(/[.,!?؟:;()"']/g, "").trim();
  if (clean.length < 3) return false;

  const skipWords = [
    "the", "a", "an", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will",
    "would", "could", "should", "may", "might", "must", "shall",
    "can", "and", "or", "but", "if", "then", "else", "when",
    "where", "why", "how", "what", "which", "who", "whom",
    "whose", "this", "that", "these", "those",
    "از", "به", "با", "در", "بر", "را", "که", "این", "آن",
    "است", "هست", "بود", "شد", "می", "نمی", "هم", "یا", "و",
  ];

  if (skipWords.includes(clean.toLowerCase())) return false;
  return true;
}

// ترجمه کلمه به انگلیسی
export async function translateKeywordToEnglish(
  word: string,
  sourceLang: string
): Promise<string> {
  if (sourceLang === "en") return word;

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      word
    )}&langpair=${sourceLang}|en`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.responseData?.translatedText) {
      return data.responseData.translatedText
        .replace(/\[.*?\]\s*/g, "")
        .replace(/\(.*?\)\s*/g, "")
        .trim();
    }
  } catch (err) {
    console.error("Keyword translation error:", err);
  }

  return word;
}