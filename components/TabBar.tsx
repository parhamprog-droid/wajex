"use client";

import { FileText, Mic, FileUp, Link2 } from "lucide-react";
import { motion } from "framer-motion";

export type TabId = "text" | "voice" | "doc" | "link";

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: "text", label: "متن", icon: FileText },
  { id: "voice", label: "صدا", icon: Mic },
  { id: "doc", label: "سند", icon: FileUp },
  { id: "link", label: "لینک", icon: Link2 },
];

export default function TabBar({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-1 rounded-2xl bg-white/50 p-1.5 backdrop-blur-xl dark:bg-white/5"
    >
      {TABS.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + index * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(tab.id)}
            className="relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition"
          >
            {isActive && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500 to-brand-300 shadow-md shadow-brand-500/30"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 flex items-center gap-2 transition-colors ${
                isActive ? "text-white" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <motion.span
                animate={isActive ? { rotate: [0, 10, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Icon size={16} />
              </motion.span>
              {tab.label}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}