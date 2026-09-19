// lib/db.ts
// لایه ساده روی IndexedDB برای ذخیره تاریخچه ترجمه‌ها

export type TranslationItem = {
  id: string;
  sourceLang: string;
  targetLang: string;
  input: string;
  output: string;
  createdAt: number;
  saved: boolean;
};

const DB_NAME = "wajex-db";
const DB_VERSION = 1;
const STORE_NAME = "translations";

// باز کردن دیتابیس
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("IndexedDB only works in browser"));
      return;
    }

    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt", { unique: false });
        store.createIndex("saved", "saved", { unique: false });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// اضافه کردن ترجمه
export async function addTranslation(
  item: Omit<TranslationItem, "id" | "createdAt" | "saved">
): Promise<TranslationItem> {
  const db = await openDB();
  const newItem: TranslationItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    saved: false,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.add(newItem);

    req.onsuccess = () => resolve(newItem);
    req.onerror = () => reject(req.error);
  });
}

// گرفتن همه ترجمه‌ها (جدیدترین اول)
export async function getAllTranslations(): Promise<TranslationItem[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();

    req.onsuccess = () => {
      const items = req.result as TranslationItem[];
      items.sort((a, b) => b.createdAt - a.createdAt);
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

// حذف یه ترجمه
export async function deleteTranslation(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// پاک کردن همه
export async function clearAllTranslations(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.clear();

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// toggle ذخیره‌شده (با id)
export async function toggleSaved(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const item = getReq.result as TranslationItem;
      if (!item) {
        reject(new Error("Item not found"));
        return;
      }
      item.saved = !item.saved;
      const putReq = store.put(item);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };

    getReq.onerror = () => reject(getReq.error);
  });
}

// پیدا کردن ترجمه بر اساس محتوا
export async function findByContent(
  sourceLang: string,
  targetLang: string,
  input: string
): Promise<TranslationItem | null> {
  const all = await getAllTranslations();
  return (
    all.find(
      (item) =>
        item.sourceLang === sourceLang &&
        item.targetLang === targetLang &&
        item.input === input
    ) || null
  );
}

// toggle ذخیره‌شده بر اساس محتوا (اگه نبود، می‌سازه)
export async function toggleSavedByContent(
  sourceLang: string,
  targetLang: string,
  input: string,
  output: string
): Promise<boolean> {
  const existing = await findByContent(sourceLang, targetLang, input);

  if (existing) {
    await toggleSaved(existing.id);
    return !existing.saved;
  } else {
    // اگه وجود نداره، بساز و ذخیره‌ش کن
    const db = await openDB();
    const newItem: TranslationItem = {
      id: crypto.randomUUID(),
      sourceLang,
      targetLang,
      input,
      output,
      createdAt: Date.now(),
      saved: true,
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.add(newItem);

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }
}