"use client";

import { Moon, Sun, Clock, Bookmark, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import HistoryPanel from "./HistoryPanel";
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

  // بارگذاری تم از localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("wajex-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
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
          {/* لوگو */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-300 text-lg font-bold text-white shadow-lg shadow-brand-500/30">
              W
            </div>
            <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Wajex
            </span>
          </div>

          {/* اکشن‌ها */}
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
            <IconBtn
              icon={mounted && dark ? <Sun size={18} /> : <Moon size={18} />}
              label="تم"
              onClick={toggleTheme}
            />
            <IconBtn icon={<Settings size={18} />} label="تنظیمات" />
          </nav>
        </div>
      </header>

      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelect={(item) => onSelectHistory?.(item)}
        initialFilter={historyFilter}
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
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-xl p-2.5 text-gray-600 transition-all hover:bg-brand-500/10 hover:text-brand-600 active:scale-95 dark:text-gray-300 dark:hover:text-brand-300"
    >
      {icon}
    </button>
  );
}