"use client";

import { Moon, Sun, Clock, Bookmark, Settings } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-50 px-6 py-4">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3">
        {/* لوگو */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-300 text-lg font-bold text-white shadow-lg shadow-brand-500/30">
            ت
          </div>
          <span className="text-lg font-semibold tracking-tight">
            ترجمان
          </span>
        </div>

        {/* اکشن‌ها */}
        <nav className="flex items-center gap-1">
          <IconBtn icon={<Clock size={18} />} label="تاریخچه" />
          <IconBtn icon={<Bookmark size={18} />} label="ذخیره‌شده" />
          <IconBtn
            icon={dark ? <Sun size={18} /> : <Moon size={18} />}
            label="تم"
            onClick={() => setDark(!dark)}
          />
          <IconBtn icon={<Settings size={18} />} label="تنظیمات" />
        </nav>
      </div>
    </header>
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
      className="rounded-xl p-2.5 text-gray-600 transition-all hover:bg-brand-500/10 hover:text-brand-600 active:scale-95 dark:text-gray-300 dark:hover:text-brand-300"
    >
      {icon}
    </button>
  );
}