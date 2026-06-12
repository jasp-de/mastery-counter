"use client";

import { useState } from "react";
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
  showHours?: boolean;
  showCustom?: boolean;
  promptNote?: boolean;
  /** Shown in the note dialog, e.g. counter name */
  label?: string;
}

export function QuickMinuteRow({
  onLog,
  compact = false,
  showHours = true,
  showCustom = true,
  promptNote = true,
  label,
}: QuickMinuteRowProps) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const [pendingHours, setPendingHours] = useState<number | null>(null);
  const [note, setNote] = useState("");

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
    const minutes = parseInt(customMinutes, 10);
    if (!minutes || minutes <= 0 || minutes > 24 * 60) return;
    setCustomMinutes("");
    setCustomOpen(false);
    requestLog(minutesToHours(minutes));
  }

  const btnSize = compact ? "sm" : "sm";
  const pendingLabel =
    pendingHours !== null ? formatDuration(pendingHours) : "";

  return (
    <>
      <div className={cn("flex flex-wrap gap-1.5", !compact && "gap-2")}>
        {QUICK_MINUTES.map((m) => (
          <Button
            key={m}
            type="button"
            variant="secondary"
            size={btnSize}
            className={compact ? "h-8 px-2.5 text-xs" : undefined}
            onClick={() => requestLog(minutesToHours(m))}
          >
            +{formatMinutesLabel(m)}
          </Button>
        ))}
        {showHours &&
          QUICK_HOURS.map((h) => (
            <Button
              key={h}
              type="button"
              variant="secondary"
              size={btnSize}
              className={compact ? "h-8 px-2.5 text-xs" : undefined}
              onClick={() => requestLog(h)}
            >
              +{h}h
            </Button>
          ))}
        {showCustom && (
          <Button
            type="button"
            variant="outline"
            size={btnSize}
            className={compact ? "h-8 px-2.5 text-xs" : undefined}
            onClick={() => setCustomOpen(true)}
          >
            …
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
              Continue
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
