import { cn } from "@/lib/cn";

type EmptySlotProps = {
  /** Bu alana hangi verinin geleceği */
  label: string;
  /** Admin panelinde nereden doldurulacağı */
  hint?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "min-h-24 p-5",
  md: "min-h-40 p-6",
  lg: "min-h-64 p-8",
} as const;

/**
 * Veri henüz girilmemiş alanlar için tasarlanmış boşluk.
 *
 * Kırık bir sayfa yerine, düzeni okunur kılan bilinçli bir yer tutucu:
 * kesik çizgili ince kenarlık, mono etiket, sessiz açıklama.
 * NEXT_PUBLIC_HIDE_EMPTY=1 ile yayında tamamen gizlenir.
 */
export function EmptySlot({
  label,
  hint,
  className,
  size = "md",
}: EmptySlotProps) {
  if (process.env.NEXT_PUBLIC_HIDE_EMPTY === "1") return null;

  return (
    <div
      className={cn(
        "flex flex-col items-start justify-center gap-2 rounded-card",
        "border border-dashed border-white/12 bg-white/[0.015]",
        sizes[size],
        className,
      )}
    >
      <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-accent-soft/70">
        {label}
      </span>
      <p className="max-w-md text-sm text-muted">
        {hint ?? "Bu alan yönetim panelinden doldurulacak."}
      </p>
    </div>
  );
}
