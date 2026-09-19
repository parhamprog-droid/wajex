"use client";

import { Moon, Sun, Clock, Bookmark, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import HistoryPanel from "./HistoryPanel";
import SettingsPanel from "./SettingsPanel";
import type { TranslationItem } from "@/lib/db";

export default function Header({
  onSelectHistory,
}: {
  onSelectHistory?: (item: TranslationItem) => void;
}) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<"all" | "saved">("all");
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("wajex-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("wajex-theme", newDark ? "dark" : "light");
  };

  return (
    <>
      <header className="sticky top-0 z-50 px-6 py-4">
        <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-300 text-lg font-bold text-white shadow-lg shadow-brand-500/30"
            >
              W
            </motion.div>
            <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Wajex
            </span>
          </div>

          <nav className="flex items-center gap-1">
            <IconBtn
              icon={<Clock size={18} />}
              label="تاریخچه"
              onClick={() => {
                setHistoryFilter("all");
                setHistoryOpen(true);
              }}
            />
            <IconBtn
              icon={<Bookmark size={18} />}
              label="ذخیره‌شده‌ها"
              onClick={() => {
                setHistoryFilter("saved");
                setHistoryOpen(true);
              }}
            />

            {/* دکمه تم با انیمیشن چرخشی */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              aria-label="تغییر تم"
              title="تغییر تم روشن/تاریک"
              className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl text-gray-600 transition-all hover:bg-brand-500/10 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-300"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mounted && dark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.4, type: "spring" }}
                  >
                    <Sun size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 180, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -180, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.4, type: "spring" }}
                  >
                    <Moon size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <IconBtn
              icon={<Settings size={18} />}
              label="تنظیمات"
              onClick={() => setSettingsOpen(true)}
            />
          </nav>
        </div>
      </header>

      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelect={(item) => onSelectHistory?.(item)}
        initialFilter={historyFilter}
      />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
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
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-xl p-2.5 text-gray-600 transition-all hover:bg-brand-500/10 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-300"
    >
      {icon}
    </motion.button>
  );
}