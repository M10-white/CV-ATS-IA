import { useEffect, useState } from "react";
import { create } from "zustand";

type ToastType = "success" | "info" | "error";

interface ToastState {
  message: string;
  visible: boolean;
  type: ToastType;
  show: (message: string, type?: ToastType) => void;
}

export const useToast = create<ToastState>((set) => ({
  message: "",
  visible: false,
  type: "success",
  show: (message, type = "success") => {
    set({ message, visible: true, type });
    setTimeout(() => set({ visible: false }), 2800);
  },
}));

const ICONS: Record<ToastType, string> = {
  success: "✓",
  info: "ℹ",
  error: "✕",
};

const BG: Record<ToastType, string> = {
  success: "linear-gradient(135deg, #059669, #10b981)",
  info: "linear-gradient(135deg, var(--color-ink), color-mix(in srgb, var(--color-ink), var(--color-accent) 30%))",
  error: "linear-gradient(135deg, #dc2626, #ef4444)",
};

export function ToastContainer() {
  const { message, visible, type } = useToast();
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (visible) setRender(true);
    else {
      const t = setTimeout(() => setRender(false), 400);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!render) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl text-white text-sm font-medium"
      style={{
        transform: visible ? "translateX(-50%) translateY(0) scale(1)" : "translateX(-50%) translateY(12px) scale(0.95)",
        opacity: visible ? 1 : 0,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        background: BG[type],
        boxShadow: "0 12px 40px -8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset",
        backdropFilter: "blur(12px)",
      }}
    >
      <span
        className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
        style={{ background: "rgba(255,255,255,0.2)" }}
      >
        {ICONS[type]}
      </span>
      {message}
    </div>
  );
}
