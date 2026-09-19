"use client";

import { motion } from "framer-motion";

export default function AnimatedLogo({
  size = 40,
}: {
  size?: number;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Glow پشت */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background:
            "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)",
          filter: "blur(15px)",
          opacity: 0.6,
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* لوگو */}
      <motion.div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-300 font-bold text-white shadow-lg"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        {/* موج SVG داخل */}
        <svg
          viewBox="0 0 40 40"
          className="absolute inset-0 h-full w-full opacity-30"
        >
          <motion.path
            d="M 0 20 Q 10 10 20 20 T 40 20"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            animate={{
              d: [
                "M 0 20 Q 10 10 20 20 T 40 20",
                "M 0 20 Q 10 30 20 20 T 40 20",
                "M 0 20 Q 10 10 20 20 T 40 20",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </svg>

        <span className="relative z-10">W</span>
      </motion.div>
    </motion.div>
  );
}