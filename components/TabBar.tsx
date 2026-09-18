"use client";

import { FileText, Image as ImageIcon, Mic, FileUp, Link2, PenTool } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const TABS = [
  { id: "text", label: "متن", icon: FileText },
  { id: "voice", label: "صدا", icon: Mic },
  { id: "image", label: "تصویر", icon: ImageIcon },
  { id: "doc", label: "سند", icon: FileUp },
  { id: "link", label: "لینک", icon: Link2 },
  { id: "handwrite", label: "دست‌خط", icon: PenTool },
];

export default function TabBar() {
  const [active, setActive] = useState("text");

  return (
    <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-1 rounded-2xl bg-white/50 p-1.5 backdrop-blur-xl dark:bg-white/5">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
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
              className={`relative z-10 flex items-center gap-2 ${
                isActive ? "text-white" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}