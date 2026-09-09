import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

export const inputClass =
  "w-full min-h-11 rounded-lg border border-white/12 bg-white/[0.03] px-3.5 py-2.5 " +
  "text-[0.95rem] text-bone outline-none transition-colors duration-200 " +
  "placeholder:text-muted/70 hover:border-white/20 " +
  "focus:border-accent-soft focus:bg-white/[0.06]";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-white/8 bg-ink-raised/70 p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">{title}</h1>
      {description && (
        <p className="mt-2 max-w-2xl text-[0.95rem] text-muted">{description}</p>
      )}
    </header>
  );
}

export function Field({
  label,
  help,
  htmlFor,
  children,
}: {
  label: string;
  help?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-bone-dim"
      >
        {label}
      </label>
      {children}
      {help && <p className="text-[0.8rem] leading-relaxed text-muted">{help}</p>}
    </div>
  );
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "ghost" | "danger";
};

const variants = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  ghost: "border border-white/12 bg-white/[0.03] text-bone hover:border-white/25",
  danger:
    "border border-danger/35 bg-danger/10 text-danger-soft hover:border-danger/60",
} as const;

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-[0.9rem] font-medium",
        "transition-[background-color,border-color,transform] duration-200 active:scale-[0.98]",
        "disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

/** Kaydetme sonucunu ekran okuyuculara da bildiren durum satırı. */
export function StatusLine({
  state,
}: {
  state: { ok: boolean; message: string };
}) {
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "min-h-5 text-sm",
        state.message === "" && "text-muted",
        state.message !== "" && (state.ok ? "text-ok" : "text-danger-soft"),
      )}
    >
      {state.message}
    </p>
  );
}
