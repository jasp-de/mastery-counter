import { levelTitle, MAX_LEVEL } from "@/lib/levels";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LevelBadge({ level, className, size = "md" }: LevelBadgeProps) {
  const clamped = Math.min(MAX_LEVEL, Math.max(1, level));

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold tabular-nums text-primary ring-1 ring-primary/25",
        size === "sm" && "size-6 text-[10px]",
        size === "md" && "size-8 text-xs",
        size === "lg" && "size-11 text-sm",
        className,
      )}
      title={levelTitle(clamped)}
    >
      {clamped}
    </span>
  );
}
