"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import {
  subscribe,
  dismissToast,
  type Toast,
  type ToastType,
} from "@/lib/toast";

const TOAST_STYLES: Record<
  ToastType,
  {
    icon: any;
    iconColor: string;
    borderColor: string;
    bgColor: string;
    progressColor: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-green-500",
    borderColor: "border-green-500/30",
    bgColor: "bg-green-500/5",
    progressColor: "bg-green-500",
  },
  error: {
    icon: XCircle,
    iconColor: "text-red-500",
    borderColor: "border-red-500/30",
    bgColor: "bg-red-500/5",
    progressColor: "bg-red-500",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/5",
    progressColor: "bg-amber-500",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/5",
    progressColor: "bg-blue-500",
  },
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = subscribe(setToasts);
    return () => unsubscribe();
  }, []);

  return (
    <div className="pointer-events-none fixed top-4 left-4 z-[9999] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type];
          const Icon = style.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: -100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
              className="pointer-events-auto"
            >
              <div
                className={`glass relative overflow-hidden rounded-2xl border-2 ${style.borderColor} ${style.bgColor} p-4 shadow-lg`}
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className={`shrink-0 ${style.iconColor}`}
                  >
                    <Icon size={20} />
                  </motion.div>

                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {toast.title}
                    </p>
                    {toast.message && (
                      <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                        {toast.message}
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => dismissToast(toast.id)}
                    className="shrink-0 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-gray-200"
                    aria-label="بستن"
                  >
                    <X size={14} />
                  </motion.button>
                </div>

                {/* نوار پیشرفت */}
                {toast.duration && toast.duration > 0 && (
                  <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{
                      duration: toast.duration / 1000,
                      ease: "linear",
                    }}
                    className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left ${style.progressColor}`}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}