import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F3F1FF",
          100: "#E9E5FF",
          300: "#A29BFE",
          500: "#6C5CE7",
          600: "#5B4BD6",
          700: "#4A3BB8",
        },
      },
      fontFamily: {
        sans: ["Inter", "Vazirmatn", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;