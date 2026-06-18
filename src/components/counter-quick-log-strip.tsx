"use client";

import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
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
import { QUICK_LOG_SLOT_COUNT } from "@/lib/constants";
import { quickLogMinutesForCounter } from "@/lib/counter-quick-presets";
import type { Counter } from "@/lib/training-hours";
import {
  cn,
  formatDuration,
  formatMinutesLabel,
  minutesToHours,
} from "@/lib/utils";

interface CounterQuickLogStripProps {
  counter: Counter;
  onLog: (hours: number, note?: string) => void;
  onSavePresets: (minutes: number[]) => void;
}

const chipClass =
  "h-8 min-w-0 flex-1 rounded-md border border-border/60 bg-muted/30 px-1 text-xs font-medium tabular-nums text-foreground shadow-none hover:border-primary/35 hover:bg-muted/60";

const customChipClass =
  "h-8 shrink-0 rounded-md border border-dashed border-border/60 bg-transparent px-2 text-xs font-medium text-muted-foreground shadow-none hover:border-primary/35 hover:bg-muted/40 hover:text-foreground";

export function CounterQuickLogStrip({
  counter,
  onLog,
  onSavePresets,
}: CounterQuickLogStripProps) {
  const [editing, setEditing] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [pendingHours, setPendingHours] = useState<number | null>(null);
  const [pendingNote, setPendingNote] = useState("");
  const minutes = quickLogMinutesForCounter(counter);
  const [draft, setDraft] = useState<string[]>(() => minutes.map(String));

  function startEditing() {
    setDraft(quickLogMinutesForCounter(counter).map(String));
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
  }

  function saveEditing() {
    const parsed = draft
      .map((value) => parseInt(value, 10))
      .filter((value) => value > 0 && value <= 24 * 60);
    if (parsed.length < 2) return;
    const next = [...parsed];
    while (next.length < QUICK_LOG_SLOT_COUNT) {
      next.push(minutes[next.length] ?? 15);
    }
    onSavePresets(next.slice(0, QUICK_LOG_SLOT_COUNT));
    setEditing(false);
  }

  function requestPresetLog(hours: number) {
    if (counter.promptNoteOnQuickLog) {
      setPendingNote("");
      setPendingHours(hours);
      return;
    }
    onLog(hours);
  }

  function confirmPresetLog(includeNote: boolean) {
    if (pendingHours === null) return;
    const trimmed = pendingNote.trim();
    onLog(
      pendingHours,
      includeNote && trimmed ? trimmed : undefined,
    );
    setPendingHours(null);
    setPendingNote("");
  }

  function openCustomDialog() {
    setCustomMinutes("");
    setCustomNote("");
    setCustomOpen(true);
  }

  function submitCustom() {
    const parsed = parseInt(customMinutes, 10);
    if (!parsed || parsed <= 0 || parsed > 24 * 60) return;
    const trimmed = customNote.trim();
    setCustomMinutes("");
    setCustomNote("");
    setCustomOpen(false);
    onLog(minutesToHours(parsed), trimmed || undefined);
  }

  const pendingLabel =
    pendingHours !== null ? formatDuration(pendingHours) : "";

  return (
    <>
      <div
        className="flex items-center gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-w-0 flex-1 gap-1.5">
          {editing
            ? draft.map((value, index) => (
                <Input
                  key={`${counter.id}-slot-${index}`}
                  type="number"
                  min={1}
                  max={1440}
                  inputMode="numeric"
                  aria-label={`Quick button ${index + 1} minutes`}
                  className="h-8 min-w-0 flex-1 px-1 text-center text-xs tabular-nums"
                  value={value}
                  onChange={(e) => {
                    const next = [...draft];
                    next[index] = e.target.value;
                    setDraft(next);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEditing();
                    if (e.key === "Escape") cancelEditing();
                  }}
                />
              ))
            : minutes.map((minute) => (
                <Button
                  key={`${counter.id}-${minute}`}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={chipClass}
                  onClick={() => requestPresetLog(minutesToHours(minute))}
                >
                  +{formatMinutesLabel(minute)}
                </Button>
              ))}
        </div>

        {editing ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label="Save quick buttons"
              onClick={saveEditing}
            >
              <Check className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-muted-foreground"
              aria-label="Cancel editing"
              onClick={cancelEditing}
            >
              <X className="size-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={customChipClass}
              onClick={openCustomDialog}
            >
              Custom
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "size-8 shrink-0 text-muted-foreground",
                "hover:text-foreground",
              )}
              aria-label="Edit quick buttons"
              onClick={startEditing}
            >
              <Pencil className="size-3.5" />
            </Button>
          </>
        )}
      </div>

      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Custom lock-in</DialogTitle>
            <DialogDescription>
              {counter.name} · weird duration welcome
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor={`custom-minutes-${counter.id}`}>Minutes</Label>
              <Input
                id={`custom-minutes-${counter.id}`}
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
            <div className="space-y-2">
              <Label htmlFor={`custom-note-${counter.id}`}>
                Note{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id={`custom-note-${counter.id}`}
                placeholder="What got done (be honest)"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitCustom();
                }}
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
              Log {pendingLabel} · {counter.name}
            </DialogTitle>
            <DialogDescription>
              Optional receipt — or skip and lock in the time anyway.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor={`preset-note-${counter.id}`}>
                Note{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id={`preset-note-${counter.id}`}
                placeholder="What got done (be honest)"
                value={pendingNote}
                onChange={(e) => setPendingNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmPresetLog(true);
                }}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => confirmPresetLog(false)}
              >
                Skip
              </Button>
              <Button className="flex-1" onClick={() => confirmPresetLog(true)}>
                Log
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
