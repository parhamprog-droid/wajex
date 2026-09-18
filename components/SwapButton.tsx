"use client";

import { ArrowLeftRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SwapButton({ onSwap }: { onSwap: () => void }) {
  const [rotated, setRotated] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{ rotate: rotated ? 180 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => {
        setRotated(!rotated);
        onSwap();
      }}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-300 text-white shadow-lg shadow-brand-500/40 transition hover:shadow-xl hover:shadow-brand-500/50"
      aria-label="جابجایی زبان‌ها"
    >
      <ArrowLeftRight size={18} />
    </motion.button>
  );
}