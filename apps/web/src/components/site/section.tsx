import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { isBlank } from "@decha/content";

import { EmptySlot } from "./empty-slot";
import { Reveal } from "./reveal";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6 md:px-10", className)}>
      {children}
    </div>
  );
}

/** Mono, büyük harf, geniş harf aralıklı bölüm etiketi. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-3 font-mono text-[0.75rem] uppercase tracking-[0.22em] text-muted">
      <span
        aria-hidden="true"
        className="h-px w-8 bg-gradient-to-r from-accent-soft/70 to-transparent"
      />
      {children}
    </span>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  body: string;
  /** Boş başlık için yer tutucu etiketi */
  emptyLabel: string;
  align?: "left" | "center";
};

/**
 * Bölüm başlığı. Başlık metni içerikten gelir; boşsa yerine
 * tasarlanmış bir yer tutucu görünür.
 */
export function SectionHeading({
  eyebrow,
  title,
  body,
  emptyLabel,
  align = "left",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        centered && "items-center text-center",
      )}
    >
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>

      {isBlank(title) ? (
        <Reveal index={1} className={cn("w-full", centered && "max-w-2xl")}>
          <EmptySlot label={emptyLabel} size="sm" />
        </Reveal>
      ) : (
        <Reveal index={1}>
          <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-[-0.02em] text-balance md:text-5xl">
            {title}
          </h2>
        </Reveal>
      )}

      {!isBlank(body) && (
        <Reveal index={2}>
          <p
            className={cn(
              "max-w-xl text-[1.0625rem] leading-relaxed text-bone-dim text-pretty",
              centered && "mx-auto",
            )}
          >
            {body}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 py-24 md:py-32", className)}
    >
      {children}
    </section>
  );
}
