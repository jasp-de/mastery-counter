"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QUICK_HOURS, QUICK_MINUTES } from "@/lib/constants";
import {
  cn,
  formatDuration,
  formatMinutesLabel,
  minutesToHours,
} from "@/lib/utils";

interface QuickMinuteRowProps {
  onLog: (hours: number, note?: string) => void;
  compact?: boolean;
  prominent?: boolean;
  minutes?: readonly number[];
  showHours?: boolean;
  showCustom?: boolean;
  promptNote?: boolean;
  /** Shown in the note dialog, e.g. counter name */
  label?: string;
}

const chipClass =
  "h-8 w-full rounded-md border border-border/60 bg-muted/30 text-xs font-medium tabular-nums text-foreground shadow-none hover:border-primary/35 hover:bg-muted/60";

export function QuickMinuteRow({
  onLog,
  compact = false,
  prominent = false,
  minutes = QUICK_MINUTES,
  showHours = true,
  showCustom = true,
  promptNote = true,
  label,
}: QuickMinuteRowProps) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const [pendingHours, setPendingHours] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const chips = useMemo(() => {
    const items: { key: string; label: string; hours: number }[] = minutes.map(
      (m) => ({
        key: `m-${m}`,
        label: formatMinutesLabel(m),
        hours: minutesToHours(m),
      }),
    );
    if (showHours) {
      for (const h of QUICK_HOURS) {
        items.push({ key: `h-${h}`, label: `${h}h`, hours: h });
      }
    }
    return items;
  }, [minutes, showHours]);

  function requestLog(hours: number) {
    if (promptNote) {
      setNote("");
      setPendingHours(hours);
      return;
    }
    onLog(hours);
  }

  function confirmLog(includeNote: boolean) {
    if (pendingHours === null) return;
    const trimmed = note.trim();
    onLog(pendingHours, includeNote && trimmed ? trimmed : undefined);
    setPendingHours(null);
    setNote("");
  }

  function submitCustom() {
    const parsed = parseInt(customMinutes, 10);
    if (!parsed || parsed <= 0 || parsed > 24 * 60) return;
    setCustomMinutes("");
    setCustomOpen(false);
    requestLog(minutesToHours(parsed));
  }

  const pendingLabel =
    pendingHours !== null ? formatDuration(pendingHours) : "";

  return (
    <>
      <div
        className={cn(
          prominent && "grid grid-cols-4 gap-1.5",
          compact && "flex flex-wrap gap-1.5",
          !compact && !prominent && "flex flex-wrap gap-2",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {chips.map((chip) => (
          <Button
            key={chip.key}
            type="button"
            variant="ghost"
            size="sm"
            className={prominent ? chipClass : compact ? "h-8 px-2.5 text-xs" : undefined}
            onClick={() => requestLog(chip.hours)}
          >
            +{chip.label}
          </Button>
        ))}
        {showCustom && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={
              prominent
                ? cn(chipClass, "text-muted-foreground")
                : compact
                  ? "h-8 px-2.5 text-xs"
                  : undefined
            }
            onClick={() => setCustomOpen(true)}
          >
            Custom
          </Button>
        )}
      </div>

      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Custom duration</DialogTitle>
            <DialogDescription>
              Enter any length in minutes (e.g. 5, 42, 90).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="quick-custom-minutes">Minutes</Label>
              <Input
                id="quick-custom-minutes"
                type="number"
                min={1}
                max={1440}
                placeholder="e.g. 42"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitCustom();
                }}
                autoFocus
              />
            </div>
            <Button className="w-full" onClick={submitCustom}>
              Log
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={pendingHours !== null}
        onOpenChange={(open) => {
          if (!open) setPendingHours(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Log {pendingLabel}
              {label ? ` · ${label}` : ""}
            </DialogTitle>
            <DialogDescription>
              What did you do? Optional — skip if you prefer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="quick-log-note">Note</Label>
              <Input
                id="quick-log-note"
                placeholder="e.g. Chapter 3, morning stretch…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmLog(true);
                }}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => confirmLog(false)}
              >
                Skip
              </Button>
              <Button className="flex-1" onClick={() => confirmLog(true)}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
