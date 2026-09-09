"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Sayfa başına dön.
 *
 * Bağlantı değil düğme: hash değiştirmediği için tarayıcının geri
 * düğmesi bozulmaz. Görünür değilken DOM'da da yoktur, sekme sırasına
 * girmez.
 */
export function ToTop() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () =>
      setVisible(window.scrollY > Math.max(320, window.innerHeight * 0.8));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Sayfanın başına dön"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
            document.querySelector<HTMLElement>("header a")?.focus({ preventScroll: true });
          }}
          className="fixed bottom-8 right-6 z-50 flex size-12 items-center justify-center rounded-full border border-white/12 bg-ink-high/80 text-bone backdrop-blur-md transition-colors duration-300 hover:border-accent-soft/50 md:right-10"
          initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 14, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          whileHover={reduceMotion ? undefined : { y: -3 }}
          whileTap={{ scale: 0.94 }}
        >
          <ArrowUp size={18} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
