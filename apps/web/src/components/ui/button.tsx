import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-[transform,background-color,border-color,box-shadow] duration-300 " +
  "[transition-timing-function:var(--ease-spring)] " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Beyaz metin --color-accent üzerinde 6.3:1
  primary:
    "bg-accent text-white hover:bg-accent-hover hover:-translate-y-0.5 " +
    "shadow-[0_10px_30px_-12px_rgb(79_70_229/0.9)] hover:shadow-[0_18px_40px_-14px_rgb(79_70_229/1)]",
  ghost:
    "border border-white/12 bg-white/[0.03] text-bone hover:-translate-y-0.5 " +
    "hover:border-white/25 hover:bg-white/[0.07]",
};

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, "min-h-12 px-7 text-[0.95rem]", variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

type LinkButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
  children: ReactNode;
};

export function LinkButton({
  variant = "primary",
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={cn(base, "min-h-12 px-7 text-[0.95rem]", variants[variant], className)}
      {...props}
    >
      {children}
    </a>
  );
}
