"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Aynı grup içinde kademeli giriş için sıra numarası */
  index?: number;
  as?: "div" | "section" | "li" | "article" | "header";
};

/**
 * Görüş alanına girince yay fiziğiyle aşağıdan yukarı süzülür.
 * Hareket azaltma tercihinde içerik anında son hâlinde görünür.
 */
export function Reveal({
  children,
  className,
  index = 0,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 0.6,
        delay: Math.min(index, 6) * 0.07,
      }}
    >
      {children}
    </MotionTag>
  );
}
