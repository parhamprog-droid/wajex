"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Monitor, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function DesktopBanner({
  onDownload,
}: {
  onDownload: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // اگه قبلاً بسته شده، نشون نده
    const dismissed = localStorage.getItem("wajex-banner-dismissed");
    if (dismissed === "true") return;

    // بعد از ۲ ثانیه نشون بده
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem("wajex-banner-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-4 max-w-6xl overflow-hidden px-6"
        >
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-300 p-4 shadow-lg shadow-brand-500/20"
          >
            {/* Decorative circles */}
            <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/10" />

            <div className="relative flex items-center gap-3">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm sm:flex"
              >
                <Monitor size={22} className="text-white" />
              </motion.div>

              <div className="flex-1">
                <div className="mb-0.5 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-white/90" />
                  <h3 className="text-sm font-bold text-white sm:text-base">
                    نسخه دسکتاپ Wajex آماده‌ست!
                  </h3>
                </div>
                <p className="text-xs text-white/90 sm:text-sm">
                  سریع‌تر، سبک‌تر، بدون نیاز به مرورگر — فقط ۲.۷ مگابایت
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDownload}
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-brand-600 shadow-md transition hover:shadow-lg sm:px-4 sm:text-sm"
              >
                <Download size={14} />
                <span className="hidden sm:inline">دانلود</span>
              </motion.button>

              <button
                onClick={handleDismiss}
                aria-label="بستن"
                className="shrink-0 rounded-lg p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}