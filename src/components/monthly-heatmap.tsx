"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  buildMonthGrid,
  currentMonthKey,
  formatMonthLabel,
  heatCellClass,
  heatLevel,
  hoursByDate,
  isFutureMonth,
  monthTotalHours,
  parseMonthKey,
  shiftMonthKey,
  WEEKDAY_LABELS,
} from "@/lib/calendar-heatmap";
import type { DayEntry } from "@/lib/training-hours";
import { cn, formatHours } from "@/lib/utils";

interface MonthlyHeatmapProps {
  entries: DayEntry[];
}

export function MonthlyHeatmap({ entries }: MonthlyHeatmapProps) {
  const [monthKey, setMonthKey] = useState(currentMonthKey);

  const hoursMap = useMemo(() => hoursByDate(entries), [entries]);

  const { year, month } = parseMonthKey(monthKey);
  const cells = useMemo(
    () => buildMonthGrid(year, month, hoursMap),
    [year, month, hoursMap],
  );

  const inMonthCells = cells.filter((c) => c.inMonth);
  const maxHours = Math.max(0, ...inMonthCells.map((c) => c.hours));
  const total = monthTotalHours(cells);

  const canGoForward = !isFutureMonth(monthKey);

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Monthly activity</CardTitle>
            <CardDescription>
              {formatHours(total)} logged in {formatMonthLabel(year, month)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setMonthKey((k) => shiftMonthKey(k, -1))}
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[8.5rem] text-center text-sm font-medium">
              {formatMonthLabel(year, month)}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={!canGoForward}
              onClick={() => setMonthKey((k) => shiftMonthKey(k, 1))}
              aria-label="Next month"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell) => {
            const level = cell.inMonth ? heatLevel(cell.hours, maxHours) : 0;
            const isToday = cell.date === new Date().toISOString().slice(0, 10);

            return (
              <div
                key={cell.date}
                title={
                  cell.inMonth
                    ? `${cell.date}: ${formatHours(cell.hours)}`
                    : undefined
                }
                className={cn(
                  "relative flex aspect-square items-center justify-center rounded-md text-[11px] font-medium tabular-nums transition-colors",
                  cell.inMonth
                    ? heatCellClass(level)
                    : "bg-transparent text-muted-foreground/40",
                  isToday &&
                    cell.inMonth &&
                    "ring-2 ring-primary ring-offset-1 ring-offset-background",
                )}
              >
                {cell.day}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
          <span>Less</span>
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <div
              key={level}
              className={cn("size-3 rounded-sm", heatCellClass(level))}
            />
          ))}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
