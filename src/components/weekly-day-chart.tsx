"use client";

import { useMemo } from "react";
import type { WeekDayCell } from "@/lib/weekly";
import { cn, formatDuration } from "@/lib/utils";

interface WeeklyDayChartProps {
  days: WeekDayCell[];
  className?: string;
}

export function WeeklyDayChart({ days, className }: WeeklyDayChartProps) {
  const maxHours = useMemo(
    () => Math.max(0.5, ...days.map((d) => d.hours)),
    [days],
  );

  return (
    <div className={cn("grid grid-cols-7 gap-1.5 sm:gap-2", className)}>
      {days.map((day) => {
        const heightPct = day.hours > 0 ? (day.hours / maxHours) * 100 : 8;
        return (
          <div key={day.date} className="flex flex-col items-center gap-2">
            <div className="flex h-28 w-full flex-col justify-end sm:h-32">
              <div
                className={cn(
                  "relative w-full min-h-[6px] rounded-lg transition-all duration-500",
                  day.hours > 0
                    ? "bg-gradient-to-t from-primary to-primary/55 shadow-sm"
                    : "bg-muted/80",
                  day.isToday && "ring-2 ring-primary/40 ring-offset-1 ring-offset-background",
                  day.isFuture && "opacity-40",
                )}
                style={{ height: `${Math.max(8, heightPct)}%` }}
                title={
                  day.hours > 0
                    ? `${day.weekday}: ${formatDuration(day.hours)}`
                    : day.weekday
                }
              >
                {day.hours > 0 && (
                  <span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 text-[10px] font-semibold tabular-nums text-primary sm:block">
                    {formatDuration(day.hours)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-center">
              <p
                className={cn(
                  "text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs",
                  day.isToday && "text-primary",
                )}
              >
                {day.weekday}
              </p>
              <p
                className={cn(
                  "text-xs tabular-nums text-muted-foreground",
                  day.isToday && "font-semibold text-foreground",
                )}
              >
                {day.dayNum}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
