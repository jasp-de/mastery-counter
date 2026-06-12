import { MAX_LEVEL } from "@/lib/levels";
import { cn } from "@/lib/utils";

interface LevelTrackProps {
  level: number;
  progressInLevel?: number;
  compact?: boolean;
  className?: string;
}

export function LevelTrack({
  level,
  progressInLevel = 0,
  compact = false,
  className,
}: LevelTrackProps) {
  const clampedLevel = Math.min(MAX_LEVEL, Math.max(1, level));

  return (
    <div className={cn("space-y-1.5", className)}>
      <div
        className={cn(
          "flex items-center gap-1",
          compact ? "gap-0.5" : "gap-1",
        )}
        aria-label={`Level ${clampedLevel} of ${MAX_LEVEL}`}
      >
        {Array.from({ length: MAX_LEVEL }, (_, index) => {
          const step = index + 1;
          const filled = step < clampedLevel;
          const current = step === clampedLevel;

          return (
            <div
              key={step}
              className={cn(
                "relative flex-1 overflow-hidden rounded-full bg-muted",
                compact ? "h-1.5" : "h-2",
              )}
            >
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  filled && "w-full bg-primary",
                  current && "bg-primary",
                  !filled && !current && "w-0",
                )}
                style={
                  current
                    ? { width: `${Math.min(100, progressInLevel)}%` }
                    : undefined
                }
              />
            </div>
          );
        })}
      </div>
      {!compact && (
        <div className="flex justify-between text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          <span>Lv 1</span>
          <span>Lv {MAX_LEVEL}</span>
        </div>
      )}
    </div>
  );
}
