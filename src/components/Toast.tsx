import { useEffect, useState } from "react";
import { create } from "zustand";

interface ToastState {
  message: string;
  visible: boolean;
  show: (message: string) => void;
}

export const useToast = create<ToastState>((set) => ({
  message: "",
  visible: false,
  show: (message) => {
    set({ message, visible: true });
    setTimeout(() => set({ visible: false }), 2500);
  },
}));

export function ToastContainer() {
  const { message, visible } = useToast();
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (visible) setRender(true);
    else {
      const t = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!render) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl bg-ink text-paper text-sm font-medium shadow-lg transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {message}
    </div>
  );
}
