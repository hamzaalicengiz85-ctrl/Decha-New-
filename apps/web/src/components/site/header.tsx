"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

const links = [
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#isler", label: "İşler" },
  { href: "#iletisim", label: "İletişim" },
];

export function Header({ brandName }: { brandName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menü açıkken arka plan kaymasın ve Escape ile kapansın
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        "[transition-timing-function:var(--ease-spring)]",
        scrolled
          ? "border-b border-white/8 bg-ink/72 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6 md:px-10">
        <a
          href="#ust"
          className="group inline-flex min-h-11 flex-col justify-center font-[family-name:var(--font-display)] text-xl uppercase tracking-[0.06em] text-bone"
        >
          {brandName}
          <span className="mt-1 block h-px w-0 bg-accent-soft transition-[width] duration-500 [transition-timing-function:var(--ease-spring)] group-hover:w-full" />
        </a>

        <nav aria-label="Ana menü" className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center font-mono text-[0.75rem] uppercase tracking-[0.18em] text-muted transition-colors duration-300 hover:text-bone"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobil-menu"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          className="flex size-11 items-center justify-center rounded-full border border-white/12 text-bone transition-colors duration-300 hover:border-white/25 md:hidden"
        >
          {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobil-menu"
            className="fixed inset-0 top-20 z-40 bg-ink/97 backdrop-blur-xl md:hidden"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav aria-label="Mobil menü" className="flex flex-col px-6 pt-6">
              {links.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-white/8 py-6 font-[family-name:var(--font-display)] text-3xl text-bone"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 140,
                    damping: 20,
                    delay: index * 0.06,
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
