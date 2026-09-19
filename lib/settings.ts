// lib/settings.ts
// مدیریت تنظیمات کاربر با localStorage

export type Theme = "light" | "dark" | "auto";
export type Tone = "formal" | "casual" | "literary" | "scientific" | "funny";

export type Settings = {
  theme: Theme;
  fontSize: "small" | "medium" | "large";
  glassOpacity: number; // 0.5 - 1.0
  defaultSourceLang: string;
  defaultTargetLang: string;
  autoDetectLanguage: boolean;
  defaultTone: Tone;
};

export const DEFAULT_SETTINGS: Settings = {
  theme: "auto",
  fontSize: "medium",
  glassOpacity: 0.75,
  defaultSourceLang: "fa",
  defaultTargetLang: "en",
  autoDetectLanguage: true,
  defaultTone: "formal",
};

const STORAGE_KEY = "wajex-settings";

// خوندن تنظیمات
export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// ذخیره تنظیمات
export function saveSettings(settings: Settings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // اعمال تم
    applyTheme(settings.theme);
    // اعمال اندازه فونت
    applyFontSize(settings.fontSize);
    // اعمال شفافیت
    applyGlassOpacity(settings.glassOpacity);
  } catch (err) {
    console.error("Failed to save settings:", err);
  }
}

// اعمال تم
export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (theme === "auto") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    root.classList.toggle("dark", prefersDark);
    localStorage.setItem("wajex-theme", prefersDark ? "dark" : "light");
  } else {
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("wajex-theme", theme);
  }
}

// اعمال اندازه فونت
export function applyFontSize(size: "small" | "medium" | "large") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("font-small", "font-medium", "font-large");
  root.classList.add(`font-${size}`);
}

// اعمال شفافیت شیشه
export function applyGlassOpacity(opacity: number) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty(
    "--glass-opacity",
    opacity.toString()
  );
}

// بارگذاری و اعمال تنظیمات اولیه
export function initSettings(): Settings {
  const settings = loadSettings();
  applyTheme(settings.theme);
  applyFontSize(settings.fontSize);
  applyGlassOpacity(settings.glassOpacity);
  return settings;
}