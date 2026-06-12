"use client";

import { QuickMinuteRow } from "@/components/quick-minute-row";

interface QuickLogButtonsProps {
  onLog: (hours: number, note?: string) => void;
  label?: string;
}

export function QuickLogButtons({ onLog, label }: QuickLogButtonsProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Quick add
        </p>
        <QuickMinuteRow onLog={onLog} showHours showCustom label={label} />
      </div>
    </div>
  );
}
