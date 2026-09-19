// lib/toast.ts
// سیستم Toast ساده و سبک

export type ToastType = "success" | "error" | "warning" | "info";

export type Toast = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
};

type ToastListener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let listeners: ToastListener[] = [];

function emit() {
  listeners.forEach((l) => l([...toasts]));
}

export function subscribe(listener: ToastListener) {
  listeners.push(listener);
  listener([...toasts]);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function showToast(
  type: ToastType,
  title: string,
  message?: string,
  duration: number = 4000
) {
  const id = Math.random().toString(36).substring(2, 9);
  const toast: Toast = { id, type, title, message, duration };

  toasts = [...toasts, toast];
  emit();

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }

  return id;
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

// توابع کمکی
export const toast = {
  success: (title: string, message?: string) =>
    showToast("success", title, message),
  error: (title: string, message?: string) =>
    showToast("error", title, message),
  warning: (title: string, message?: string) =>
    showToast("warning", title, message),
  info: (title: string, message?: string) =>
    showToast("info", title, message),
};