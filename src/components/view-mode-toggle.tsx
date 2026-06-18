"use client";

import { cn } from "@/lib/utils";

export type CounterViewMode = "total" | "week";

interface ViewModeToggleProps {
  value: CounterViewMode;
  onChange: (mode: CounterViewMode) => void;
  className?: string;
}

export function ViewModeToggle({
  value,
  onChange,
  className,
}: ViewModeToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg border bg-muted/60 p-0.5 text-xs font-medium",
        className,
      )}
      role="tablist"
      aria-label="Counter view"
    >
      {(
        [
          { id: "total" as const, label: "All time" },
          { id: "week" as const, label: "This week" },
        ] as const
      ).map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={value === id}
          className={cn(
            "rounded-md px-3 py-1.5 transition-colors",
            value === id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
