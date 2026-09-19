"use client";

import { Moon, Sun, Clock, Bookmark, Settings, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import HistoryPanel from "./HistoryPanel";
import SettingsPanel from "./SettingsPanel";
import DownloadModal from "./DownloadModal";
import AnimatedLogo from "./AnimatedLogo";
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
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("wajex-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("wajex-theme", newDark ? "dark" : "light");
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 px-6 py-4"
      >
        <motion.div
          animate={{
            boxShadow: scrolled
              ? "0 8px 32px rgba(108, 92, 231, 0.15)"
              : "0 8px 32px rgba(31, 38, 135, 0.08)",
          }}
          transition={{ duration: 0.3 }}
          className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3"
        >
          {/* لوگو */}
          <div className="flex items-center gap-3">
            <AnimatedLogo size={40} />
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100"
            >
              Wajex
            </motion.span>
          </div>

          {/* اکشن‌ها */}
          <nav className="flex items-center gap-1">
            {/* دکمه دانلود */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDownloadOpen(true)}
              className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-300 px-3 py-2 text-xs font-medium text-white shadow-md shadow-brand-500/30 transition hover:shadow-lg hover:shadow-brand-500/40 sm:flex"
              title="دانلود اپ دسکتاپ"
            >
              <Download size={14} />
              دانلود اپ
            </motion.button>

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

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              aria-label="تغییر تم"
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
        </motion.div>
      </motion.header>

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

      <DownloadModal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
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
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-xl p-2.5 text-gray-600 transition-all hover:bg-brand-500/10 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-300"
    >
      {icon}
    </motion.button>
  );
}