"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useInquiry } from "@/components/inquiry-provider";

type Toast = {
  id: string;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
};

let globalShowToast: ((toast: Omit<Toast, "id">) => void) | null = null;

export const triggerToast = (toast: Omit<Toast, "id">) => {
  if (globalShowToast) {
    globalShowToast(toast);
  }
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { toggle } = useInquiry();

  const showToast = useCallback((newToast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev.slice(-2), { ...newToast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  globalShowToast = showToast;

  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className="toast-card"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            <div className="toast-sparkle">✨</div>
            <div className="toast-body">
              <p className="toast-title">{t.title}</p>
              <p className="toast-message">{t.message}</p>
            </div>
            {t.onAction ? (
              <button
                className="toast-action"
                onClick={() => {
                  t.onAction?.();
                  setToasts((prev) => prev.filter((item) => item.id !== t.id));
                }}
              >
                {t.actionText || "View"}
              </button>
            ) : (
              <button
                className="toast-action"
                onClick={() => {
                  toggle();
                  setToasts((prev) => prev.filter((item) => item.id !== t.id));
                }}
              >
                View Bag →
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
