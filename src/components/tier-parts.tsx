import { cn } from "@/lib/cn";
import { ACCESS_LABEL, STATUS_LABEL, type AccessState, type Status } from "@/lib/tiers";

/** "Available now" or "In pilot, ask us". The words carry it, and the colour backs them up. */
export function StatusPill({
  status,
  label,
  onDark = false,
  className,
}: {
  status: Status;
  label?: string;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        status === "available"
          ? onDark
            ? "border-[#7BD3A0]/50 bg-[#2E9E5B]/20 text-[#BDEFD2]"
            : "border-[#2E9E5B]/30 bg-[#2E9E5B]/10 text-[#1F7A45]"
          : "border-dashed border-[var(--color-brand)]/45 bg-[var(--color-brand)]/[0.05] text-[var(--color-brand)]",
        className
      )}
    >
      {label ?? STATUS_LABEL[status]}
    </span>
  );
}

const ACCESS_STYLE: Record<AccessState, string> = {
  open: "border-[#2E9E5B]/30 bg-[#2E9E5B]/10 text-[#1F7A45]",
  conditions: "border-[#E0A500]/45 bg-[#E0A500]/15 text-[#7A5000]",
  ask: "border-dashed border-[var(--color-brand)]/45 bg-[var(--color-brand)]/[0.05] text-[var(--color-brand)]",
  waits: "border-[#B3261E]/30 bg-[#B3261E]/[0.07] text-[#B3261E]",
};

export function AccessPill({ state }: { state: AccessState }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", ACCESS_STYLE[state])}>
      {ACCESS_LABEL[state]}
    </span>
  );
}
