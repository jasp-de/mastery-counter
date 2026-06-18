"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Settings2, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { AppShell } from "@/components/app-shell";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmojiPicker, normalizeEmoji } from "@/components/emoji-picker";
import { GuestBanner } from "@/components/guest-banner";
import { MonthlyHeatmap } from "@/components/monthly-heatmap";
import { QuickLogButtons } from "@/components/quick-log-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useCountersState } from "@/components/providers/counters-provider";
import { emojiForCounter } from "@/lib/counter-emoji";
import { DEFAULT_COUNTER_EMOJI } from "@/lib/emojis";
import { hoursThisWeek } from "@/lib/stats";
import {
  getCounter,
  logHoursToCounter,
  progressPercent,
  remainingHours,
  sortedEntries,
  totalLoggedHours,
  updateCounter,
  updateEntry,
  type DayEntry,
} from "@/lib/training-hours";
import {
  formatDate,
  formatDuration,
  formatGoalHours,
  todayISO,
} from "@/lib/utils";

interface CounterDetailProps {
  counterId: string;
}

export function CounterDetail({ counterId }: CounterDetailProps) {
  const router = useRouter();
  const { state, setState, mutateWithUndo, hydrated, isGuest } =
    useCountersState();
  const counter = getCounter(state, counterId);

  const [date, setDate] = useState(todayISO());
  const [hours, setHours] = useState("");
  const [note, setNote] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [emojiInput, setEmojiInput] = useState(DEFAULT_COUNTER_EMOJI);
  const [showSettings, setShowSettings] = useState(false);
  const [removeEntryId, setRemoveEntryId] = useState<string | null>(null);

  const logged = useMemo(
    () => (counter ? totalLoggedHours(counter.entries) : 0),
    [counter],
  );
  const remaining = useMemo(
    () => (counter ? remainingHours(counter.goalHours, counter.entries) : 0),
    [counter],
  );
  const progress = useMemo(
    () => (counter ? progressPercent(counter.goalHours, counter.entries) : 0),
    [counter],
  );
  const weekHours = useMemo(
    () => (counter ? hoursThisWeek(counter.entries) : 0),
    [counter],
  );
  const entries = useMemo(
    () => (counter ? sortedEntries(counter.entries) : []),
    [counter],
  );

  function patchCounter(
    updater: (c: NonNullable<typeof counter>) => NonNullable<typeof counter>,
  ) {
    if (!counter) return;
    setState((prev) => updateCounter(prev, counterId, updater));
  }

  function addHours(value?: number, noteOverride?: string) {
    const parsed = value ?? parseFloat(hours);
    if (!parsed || parsed <= 0 || parsed > 24) return;

    mutateWithUndo((prev) =>
      logHoursToCounter(
        prev,
        counterId,
        parsed,
        date,
        noteOverride !== undefined ? noteOverride : note,
      ),
    );
    if (value === undefined) setNote("");
    setHours("");
  }

  function removeEntry(id: string) {
    patchCounter((c) => ({
      ...c,
      entries: c.entries.filter((e) => e.id !== id),
    }));
    setRemoveEntryId(null);
  }

  function saveEntryEdit(
    entryId: string,
    patch: { date: string; hours: number; note?: string },
  ) {
    setState((prev) => updateEntry(prev, counterId, entryId, patch));
  }

  function saveSettings() {
    const nextGoal = parseInt(goalInput, 10);
    const nextName = nameInput.trim();
    if (!nextGoal || nextGoal <= 0 || !nextName) return;
    patchCounter((c) => ({
      ...c,
      name: nextName,
      goalHours: nextGoal,
      emoji: normalizeEmoji(emojiInput),
    }));
    setShowSettings(false);
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!counter) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground">Counter not found.</p>
        <Button variant="outline" onClick={() => router.push("/")}>
          Back
        </Button>
      </div>
    );
  }

  const isComplete = remaining === 0 && logged > 0;

  return (
    <AppShell>
      <AppHeader
        title={`${emojiForCounter(counter)} ${counter.name}`}
        subtitle={`${formatDuration(weekHours)} this week`}
        backHref="/"
      />

      {isGuest && <GuestBanner />}

      <div className="mb-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setGoalInput(String(counter.goalHours));
            setNameInput(counter.name);
            setEmojiInput(emojiForCounter(counter));
            setShowSettings((v) => !v);
          }}
        >
          <Settings2 className="size-4" />
          Edit
        </Button>
      </div>

      {showSettings && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <EmojiPicker
              id="edit-counter-emoji"
              value={emojiInput}
              onChange={setEmojiInput}
            />
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Goal (hours)</Label>
              <Input
                id="goal"
                type="number"
                min={1}
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
              />
            </div>
            <Button onClick={saveSettings}>Save</Button>
          </CardContent>
        </Card>
      )}

      <section className="mb-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className="text-4xl font-semibold tabular-nums tracking-tight">
              {formatGoalHours(remaining)}
            </p>
          </div>
          {isComplete && (
            <Badge variant="secondary" className="text-primary">
              Complete
            </Badge>
          )}
        </div>
        <Progress value={progress} className="mb-2 h-2" />
        <div className="flex justify-between text-xs tabular-nums text-muted-foreground">
          <span>{formatGoalHours(logged)} logged</span>
          <span>{formatGoalHours(counter.goalHours)} goal</span>
        </div>
      </section>

      <MonthlyHeatmap entries={counter.entries} />

      <Card className="mb-6 mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="size-4" />
            Log time
          </CardTitle>
          <CardDescription>Add hours for any day.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                max={todayISO()}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                min={0.25}
                max={24}
                step={0.25}
                placeholder="e.g. 2"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addHours();
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Input
              id="note"
              placeholder="Optional"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <QuickLogButtons
            label={counter.name}
            onLog={(h, n) => addHours(h, n)}
          />
          <Button className="w-full" onClick={() => addHours()}>
            Add
          </Button>
        </CardContent>
      </Card>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">History</h2>
          <span className="text-xs text-muted-foreground">
            {entries.length} entries
          </span>
        </div>
        {entries.length === 0 ? (
          <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            No entries yet.
          </div>
        ) : (
          <ul className="space-y-2">
            {entries.map((entry) => (
              <EntryRow
                key={entry.id}
                entry={entry}
                onRemove={() => setRemoveEntryId(entry.id)}
                onSave={(patch) => saveEntryEdit(entry.id, patch)}
              />
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={removeEntryId !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveEntryId(null);
        }}
        title="Delete entry?"
        description="Removes these hours from your total."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (removeEntryId) removeEntry(removeEntryId);
        }}
      />
    </AppShell>
  );
}

function EntryRow({
  entry,
  onRemove,
  onSave,
}: {
  entry: DayEntry;
  onRemove: () => void;
  onSave: (patch: { date: string; hours: number; note?: string }) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(entry.date);
  const [hours, setHours] = useState(String(entry.hours));
  const [note, setNote] = useState(entry.note ?? "");

  function submitEdit() {
    const parsed = parseFloat(hours);
    if (!parsed || parsed <= 0 || parsed > 24) return;
    onSave({ date, hours: parsed, note: note.trim() || undefined });
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="rounded-lg border p-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor={`edit-date-${entry.id}`}>Date</Label>
            <Input
              id={`edit-date-${entry.id}`}
              type="date"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`edit-hours-${entry.id}`}>Hours</Label>
            <Input
              id={`edit-hours-${entry.id}`}
              type="number"
              min={0.25}
              max={24}
              step={0.25}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <Label htmlFor={`edit-note-${entry.id}`}>Note</Label>
          <Input
            id={`edit-note-${entry.id}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={submitEdit}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
      </li>
    );
  }

  return (
    <li className="group flex items-center gap-2 rounded-lg border px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium tabular-nums">
            {formatDuration(entry.hours)}
          </span>
          <Separator orientation="vertical" className="h-3" />
          <span className="truncate text-muted-foreground">
            {formatDate(entry.date)}
          </span>
        </div>
        {entry.note && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {entry.note}
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 shrink-0"
        onClick={() => setEditing(true)}
        aria-label="Edit"
      >
        <Pencil className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 shrink-0"
        onClick={onRemove}
        aria-label="Delete"
      >
        <Trash2 className="size-3.5 text-muted-foreground" />
      </Button>
    </li>
  );
}
