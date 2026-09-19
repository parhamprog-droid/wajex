"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Monitor,
  Smartphone,
  Shield,
  Zap,
  Package,
  ExternalLink,
} from "lucide-react";

const PICOFILE_URL =
  "https://www.picofile.com/f/qMokfGqdRi/Wajex-0-1-0-x64-setup.zip";

export default function DownloadModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const handleDownload = () => {
    window.open(PICOFILE_URL, "_blank");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 z-[90] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#0f0f1a]"
          >
            {/* Header با Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-500 to-brand-300 p-6 text-white">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-white/10" />

              <button
                onClick={onClose}
                aria-label="بستن"
                className="absolute top-4 left-4 rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="relative">
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
                >
                  <Download size={28} />
                </motion.div>

                <h2 className="mb-1 text-2xl font-bold">
                  دانلود نسخه دسکتاپ
                </h2>
                <p className="text-sm text-white/90">
                  Wajex رو روی ویندوز نصب کن — سریع‌تر از مرورگر
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* ویژگی‌ها */}
              <div className="mb-5 grid grid-cols-3 gap-2">
                <Feature icon={<Zap size={16} />} label="سریع" />
                <Feature icon={<Shield size={16} />} label="امن" />
                <Feature icon={<Package size={16} />} label="سبک" />
              </div>

              {/* اطلاعات فایل */}
              <div className="mb-5 rounded-2xl border border-gray-200 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
                      <Monitor size={20} className="text-brand-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Wajex for Windows
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        نسخه 0.1.0 • آخرین آپدیت
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                    رایگان
                  </span>
                </div>
              </div>

              {/* دکمه دانلود */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                className="group relative mb-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-300 py-3.5 font-medium text-white shadow-lg shadow-brand-500/30 transition hover:shadow-xl hover:shadow-brand-500/40"
              >
                <div className="absolute inset-0 bg-white/0 transition group-hover:bg-white/10" />
                <Download size={18} className="relative" />
                <span className="relative">دانلود از Picofile</span>
                <ExternalLink size={14} className="relative opacity-70" />
              </motion.button>

              {/* QR Code */}
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-gray-200 p-3 dark:border-white/10">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-1">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      PICOFILE_URL
                    )}`}
                    alt="QR Code"
                    className="h-full w-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Smartphone size={14} className="text-brand-500" />
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      دانلود روی موبایل
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    با دوربین موبایل QR رو اسکن کن
                  </p>
                </div>
              </div>

              {/* راهنما */}
              <div className="rounded-xl bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
                <p className="mb-1 font-medium">📦 راهنمای نصب:</p>
                <ol className="mr-4 list-decimal space-y-0.5">
                  <li>فایل ZIP رو دانلود کن</li>
                  <li>روی فایل ZIP راست‌کلیک کن → Extract All</li>
                  <li>فایل .exe رو اجرا کن</li>
                  <li>نصب کن و لذت ببر!</li>
                </ol>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Feature({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 py-3 dark:border-white/10"
    >
      <div className="text-brand-500">{icon}</div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </motion.div>
  );
}