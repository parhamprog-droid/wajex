"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  FileText,
  Hash,
  Bookmark,
  Calendar,
  Clock,
  Flame,
  Languages,
  Loader2,
  Award,
  BarChart3,
} from "lucide-react";
import { calculateStats, formatNumber, type Stats } from "@/lib/stats";

export default function StatsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await calculateStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="mb-3"
        >
          <Loader2 size={32} className="text-brand-500" />
        </motion.div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          در حال محاسبه آمار...
        </p>
      </div>
    );
  }

  if (!stats || stats.totalTranslations === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <BarChart3
          size={48}
          className="mb-3 text-gray-300 dark:text-gray-600"
        />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          هنوز آماری نداری
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          یه چند تا ترجمه کن تا آمارت اینجا نمایش داده بشه
        </p>
      </div>
    );
  }

  const maxLang = Math.max(...stats.topLanguages.map((l) => l.count), 1);
  const maxDaily = Math.max(...stats.dailyActivity.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      {/* کارت‌های اصلی */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<TrendingUp size={18} />}
          label="کل ترجمه‌ها"
          value={formatNumber(stats.totalTranslations)}
          color="brand"
          delay={0}
        />
        <StatCard
          icon={<FileText size={18} />}
          label="کلمات ترجمه‌شده"
          value={formatNumber(stats.totalWords)}
          color="blue"
          delay={0.05}
        />
        <StatCard
          icon={<Hash size={18} />}
          label="کاراکترها"
          value={formatNumber(stats.totalChars)}
          color="purple"
          delay={0.1}
        />
        <StatCard
          icon={<Bookmark size={18} />}
          label="ذخیره‌شده‌ها"
          value={formatNumber(stats.savedCount)}
          color="amber"
          delay={0.15}
        />
      </div>

      {/* Streak */}
      {stats.streak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 p-4"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20"
            >
              <Flame size={24} className="text-orange-500" />
            </motion.div>
            <div>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                روزهای پیاپی
              </p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {formatNumber(stats.streak)}{" "}
                <span className="text-sm font-normal">روز</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* بازه‌های زمانی */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-gray-200 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5"
      >
        <div className="mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-brand-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            بازه‌های زمانی
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <TimeBox label="امروز" value={stats.todayCount} />
          <TimeBox label="این هفته" value={stats.weekCount} />
          <TimeBox label="این ماه" value={stats.monthCount} />
        </div>
      </motion.div>

      {/* زبان‌های پرکاربرد */}
      {stats.topLanguages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-gray-200 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5"
        >
          <div className="mb-3 flex items-center gap-2">
            <Languages size={16} className="text-brand-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              زبان‌های پرکاربرد
            </h3>
          </div>
          <div className="space-y-2">
            {stats.topLanguages.map((lang, i) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
              >
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {lang.name}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatNumber(lang.count)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(lang.count / maxLang) * 100}%` }}
                    transition={{
                      delay: 0.4 + i * 0.05,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* فعالیت ۱۴ روز اخیر */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="rounded-2xl border border-gray-200 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5"
      >
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-brand-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            فعالیت ۱۴ روز اخیر
          </h3>
        </div>
        <div className="flex h-24 items-end justify-between gap-1">
          {stats.dailyActivity.map((day, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{
                height: `${Math.max((day.count / maxDaily) * 100, 4)}%`,
              }}
              transition={{
                delay: 0.5 + i * 0.03,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex-1 rounded-t-lg bg-gradient-to-t from-brand-500 to-brand-300 transition-all hover:from-brand-600 hover:to-brand-400"
            >
              <div className="absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1 text-[10px] text-white group-hover:block dark:bg-gray-700">
                {day.count}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
          <span>{stats.dailyActivity[0]?.date}</span>
          <span>امروز</span>
        </div>
      </motion.div>

      {/* ساعت‌های پرکار */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="rounded-2xl border border-gray-200 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5"
      >
        <div className="mb-3 flex items-center gap-2">
          <Clock size={16} className="text-brand-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            ساعت‌های پرکار
          </h3>
        </div>
        <div className="flex h-16 items-end justify-between gap-0.5">
          {stats.hourlyActivity.map((count, hour) => {
            const maxHourly = Math.max(...stats.hourlyActivity, 1);
            return (
              <div
                key={hour}
                className="group relative flex-1"
                title={`ساعت ${hour}: ${count} ترجمه`}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{
                    height: `${Math.max((count / maxHourly) * 100, 3)}%`,
                  }}
                  transition={{ delay: 0.6 + hour * 0.02, duration: 0.4 }}
                  className={`w-full rounded-t ${
                    count > 0
                      ? "bg-gradient-to-t from-brand-500 to-brand-300"
                      : "bg-gray-200 dark:bg-white/5"
                  }`}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
          <span>۰۰:۰۰</span>
          <span>۱۲:۰۰</span>
          <span>۲۳:۰۰</span>
        </div>
      </motion.div>

      {/* Achievement */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="rounded-2xl bg-gradient-to-br from-brand-500/10 to-brand-300/10 p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20">
            <Award size={24} className="text-brand-500" />
          </div>
          <div>
            <p className="text-xs text-brand-600 dark:text-brand-400">
              سطح فعلی
            </p>
            <p className="text-lg font-bold text-brand-700 dark:text-brand-300">
              {getLevel(stats.totalTranslations)}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "brand" | "blue" | "purple" | "amber";
  delay: number;
}) {
  const colors = {
    brand: "from-brand-500/10 to-brand-300/10 text-brand-600 dark:text-brand-300",
    blue: "from-blue-500/10 to-blue-300/10 text-blue-600 dark:text-blue-300",
    purple:
      "from-purple-500/10 to-purple-300/10 text-purple-600 dark:text-purple-300",
    amber: "from-amber-500/10 to-amber-300/10 text-amber-600 dark:text-amber-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.03, y: -2 }}
      className={`rounded-2xl bg-gradient-to-br ${colors[color]} p-3`}
    >
      <div className="mb-2 flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </motion.div>
  );
}

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="rounded-xl bg-gray-100/50 p-3 text-center dark:bg-white/5"
    >
      <p className="text-[10px] text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
        {formatNumber(value)}
      </p>
    </motion.div>
  );
}

function getLevel(count: number): string {
  if (count < 10) return "🌱 تازه‌کار";
  if (count < 50) return "📚 فعال";
  if (count < 100) return "⭐ حرفه‌ای";
  if (count < 500) return "🏆 استاد";
  return "👑 افسانه";
}