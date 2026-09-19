"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Clock,
  Bookmark,
  BookmarkCheck,
  Search,
} from "lucide-react";
import {
  getAllTranslations,
  deleteTranslation,
  clearAllTranslations,
  toggleSaved,
  type TranslationItem,
} from "@/lib/db";

export default function HistoryPanel({
  open,
  onClose,
  onSelect,
  initialFilter = "all",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (item: TranslationItem) => void;
  initialFilter?: "all" | "saved";
}) {
  const [items, setItems] = useState<TranslationItem[]>([]);
  const [filter, setFilter] = useState<"all" | "saved">(initialFilter);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadItems();
      setFilter(initialFilter);
    }
  }, [open, initialFilter]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await getAllTranslations();
      setItems(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteTranslation(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearAll = async () => {
    if (!confirm("همه تاریخچه پاک شود؟")) return;
    await clearAllTranslations();
    setItems([]);
  };

  const handleToggleSave = async (id: string) => {
    await toggleSaved(id);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, saved: !i.saved } : i))
    );
  };

  const filtered = items.filter((item) => {
    if (filter === "saved" && !item.saved) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        item.input.toLowerCase().includes(q) ||
        item.output.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "همین الان";
    if (diffMin < 60) return `${diffMin} دقیقه پیش`;
    if (diffHour < 24) return `${diffHour} ساعت پیش`;
    if (diffDay < 7) return `${diffDay} روز پیش`;
    return d.toLocaleDateString("fa-IR");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-[#0f0f1a]"
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Clock size={20} className="text-brand-500" />
                </motion.span>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  تاریخچه ترجمه‌ها
                </h2>
                <motion.span
                  key={items.length}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-medium text-brand-600 dark:text-brand-300"
                >
                  {items.length}
                </motion.span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                aria-label="بستن"
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="border-b border-gray-200 p-4 dark:border-white/10">
              <div className="relative mb-3">
                <Search
                  size={16}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در تاریخچه..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFilter("all")}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                    filter === "all"
                      ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                  }`}
                >
                  همه
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFilter("saved")}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                    filter === "saved"
                      ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                  }`}
                >
                  ذخیره‌شده
                </motion.button>
                {items.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClearAll}
                    className="rounded-lg bg-red-500/10 p-2 text-red-500 transition hover:bg-red-500/20"
                    aria-label="پاک کردن همه"
                    title="پاک کردن همه"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading && (
                <div className="flex items-center justify-center py-10">
                  <div className="loading-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}

              {!loading && filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <Clock
                    size={48}
                    className="mb-3 text-gray-300 dark:text-gray-600"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {items.length === 0
                      ? "هنوز ترجمه‌ای نداری"
                      : "چیزی پیدا نشد"}
                  </p>
                </motion.div>
              )}

              <div className="space-y-2">
                <AnimatePresence>
                  {filtered.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-3.5 transition-all hover:border-brand-500/40 hover:bg-brand-500/5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:bg-brand-500/10"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-brand-600 dark:text-brand-300">
                            {item.sourceLang}
                          </span>
                          <span>→</span>
                          <span className="font-medium text-brand-600 dark:text-brand-300">
                            {item.targetLang}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>

                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleSave(item.id)}
                            aria-label="ذخیره"
                            className={`rounded-lg p-1.5 transition ${
                              item.saved
                                ? "text-brand-500"
                                : "text-gray-400 hover:text-brand-500"
                            }`}
                          >
                            {item.saved ? (
                              <BookmarkCheck size={15} />
                            ) : (
                              <Bookmark size={15} />
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(item.id)}
                            aria-label="حذف"
                            className="rounded-lg p-1.5 text-gray-400 transition hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </motion.button>
                        </div>
                      </div>

                      <p className="mb-1 line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.input}
                      </p>
                      <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                        {item.output}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}