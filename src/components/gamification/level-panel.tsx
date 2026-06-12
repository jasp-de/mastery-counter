"use client";

import { LevelBadge } from "@/components/gamification/level-badge";
import { LevelTrack } from "@/components/gamification/level-track";
import { levelSnapshot, formatHoursToNextLevel } from "@/lib/levels";
import type { Counter } from "@/lib/training-hours";
import { cn } from "@/lib/utils";

interface LevelPanelProps {
  counter: Counter;
  className?: string;
  compact?: boolean;
}

export function LevelPanel({ counter, className, compact = false }: LevelPanelProps) {
  const snapshot = levelSnapshot(counter);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <LevelBadge level={snapshot.level} size={compact ? "sm" : "md"} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Level {snapshot.level}
            </p>
            <p
              className={cn(
                "font-semibold leading-tight",
                compact ? "text-sm" : "text-base",
              )}
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              {snapshot.title}
            </p>
          </div>
        </div>
        {!snapshot.isMaxLevel && (
          <p className="text-right text-xs text-muted-foreground">
            <span className="block font-medium text-foreground">
              {formatHoursToNextLevel(snapshot.hoursToNextLevel)}
            </span>
            to next level
          </p>
        )}
        {snapshot.isMaxLevel && (
          <p className="text-right text-xs font-medium text-primary">
            Max level
          </p>
        )}
      </div>
      <LevelTrack
        level={snapshot.level}
        progressInLevel={snapshot.progressInLevel}
        compact={compact}
      />
    </div>
  );
}
