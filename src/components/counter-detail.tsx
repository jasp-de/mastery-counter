"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { AppShell } from "@/components/app-shell";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CounterGoalFields } from "@/components/counter-goal-fields";
import { CounterOptionsMenu } from "@/components/counter-options-menu";
import { EmojiPicker, normalizeEmoji } from "@/components/emoji-picker";
import { GuestBanner } from "@/components/guest-banner";
import { MonthlyHeatmap } from "@/components/monthly-heatmap";
import { QuickLogButtons } from "@/components/quick-log-buttons";
import { RowOptionsMenu } from "@/components/row-options-menu";
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
import { hoursThisWeek } from "@/lib/stats";
import { counterWeeklyGoal, weekProgressPercent } from "@/lib/weekly";
import {
  getCounter,
  logHoursToCounter,
  progressPercent,
  remainingHours,
  removeCounter,
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
  const searchParams = useSearchParams();
  const editFromUrl = searchParams.get("edit") === "1";
  const { state, setState, mutateWithUndo, hydrated, isGuest } =
    useCountersState();
  const counter = getCounter(state, counterId);

  const [date, setDate] = useState(todayISO());
  const [hours, setHours] = useState("");
  const [note, setNote] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [weeklyGoalInput, setWeeklyGoalInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [emojiInput, setEmojiInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [removeEntryId, setRemoveEntryId] = useState<string | null>(null);
  const [removeCounterOpen, setRemoveCounterOpen] = useState(false);

  const settingsOpen = showSettings || editFromUrl;

  function populateSettingsForm() {
    if (!counter) return;
    setGoalInput(String(counter.goalHours));
    setWeeklyGoalInput(String(counterWeeklyGoal(counter)));
    setNameInput(counter.name);
    setEmojiInput(emojiForCounter(counter));
  }

  function closeSettings() {
    setShowSettings(false);
    if (editFromUrl) {
      router.replace(`/counter/${counterId}`);
    }
  }

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
  const weeklyGoal = useMemo(
    () => (counter ? counterWeeklyGoal(counter) : 0),
    [counter],
  );
  const weekProgress = useMemo(
    () => weekProgressPercent(weekHours, weeklyGoal),
    [weekHours, weeklyGoal],
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
    const nextGoal = parseInt(settingsGoal, 10);
    const nextWeeklyGoal = parseFloat(settingsWeeklyGoal);
    const nextName = settingsName.trim();
    if (
      !nextGoal ||
      nextGoal <= 0 ||
      !nextWeeklyGoal ||
      nextWeeklyGoal <= 0 ||
      !nextName
    ) {
      return;
    }
    patchCounter((c) => ({
      ...c,
      name: nextName,
      goalHours: nextGoal,
      weeklyGoalHours: nextWeeklyGoal,
      emoji: normalizeEmoji(settingsEmoji),
    }));
    closeSettings();
  }

  function handleRemoveCounter() {
    if (state.counters.length <= 1) return;
    setState((prev) => removeCounter(prev, counterId));
    setRemoveCounterOpen(false);
    router.push("/");
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
  const settingsGoal = goalInput || String(counter.goalHours);
  const settingsWeeklyGoal =
    weeklyGoalInput || String(counterWeeklyGoal(counter));
  const settingsName = nameInput || counter.name;
  const settingsEmoji = emojiInput || emojiForCounter(counter);

  return (
    <AppShell>
      <AppHeader
        title={`${emojiForCounter(counter)} ${counter.name}`}
        subtitle={`${formatDuration(weekHours)} / ${formatGoalHours(weeklyGoal)} this week`}
        backHref="/"
        actions={
          <CounterOptionsMenu
            variant="detail"
            counterId={counterId}
            canDelete={state.counters.length > 1}
            onEdit={() => {
              populateSettingsForm();
              setShowSettings(true);
            }}
            onDelete={() => setRemoveCounterOpen(true)}
            promptNoteOnQuickLog={counter.promptNoteOnQuickLog === true}
            onTogglePromptNote={() =>
              patchCounter((c) => ({
                ...c,
                promptNoteOnQuickLog: !c.promptNoteOnQuickLog,
              }))
            }
          />
        }
      />

      {isGuest && <GuestBanner />}

      {settingsOpen && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Retune this lock-in</CardTitle>
            <CardDescription>
              Rename it, move the goalposts — we won&apos;t tell anyone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <EmojiPicker
              id="edit-counter-emoji"
              value={settingsEmoji}
              onChange={setEmojiInput}
            />
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={settingsName}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>
            <CounterGoalFields
              totalGoal={settingsGoal}
              weeklyGoal={settingsWeeklyGoal}
              onTotalGoalChange={setGoalInput}
              onWeeklyGoalChange={setWeeklyGoalInput}
              totalGoalId="edit-goal"
              weeklyGoalId="edit-weekly-goal"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={saveSettings}>Save</Button>
              <Button variant="ghost" onClick={closeSettings}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardContent className="space-y-4 p-4">
          <div>
            <div className="mb-2 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Total remaining</p>
                <p className="text-3xl font-semibold tabular-nums tracking-tight">
                  {formatGoalHours(remaining)}
                </p>
              </div>
              {isComplete && (
                <Badge variant="secondary" className="text-primary">
                  Locked in
                </Badge>
              )}
            </div>
            <Progress value={progress} className="mb-1.5 h-2" />
            <div className="flex justify-between text-xs tabular-nums text-muted-foreground">
              <span>{formatGoalHours(logged)} logged</span>
              <span>{formatGoalHours(counter.goalHours)} goal</span>
            </div>
          </div>
          <Separator />
          <div>
            <div className="mb-2 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">This week</p>
                <p className="text-2xl font-semibold tabular-nums tracking-tight">
                  {formatDuration(weekHours)}
                </p>
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {formatGoalHours(weeklyGoal)} goal
              </span>
            </div>
            <Progress value={weekProgress} className="h-1.5" />
          </div>
        </CardContent>
      </Card>

      <MonthlyHeatmap entries={counter.entries} />

      <Card className="mb-6 mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="size-4" />
            Log time
          </CardTitle>
          <CardDescription>Missed a session? Catch up here.</CardDescription>
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
            No entries yet. Tap a button above — future you will thank present you.
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
        description="Those hours vanish from your total. Like they never happened. (They did.)"
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (removeEntryId) removeEntry(removeEntryId);
        }}
      />

      <ConfirmDialog
        open={removeCounterOpen}
        onOpenChange={setRemoveCounterOpen}
        title="Break the lock?"
        description="Deletes this counter and every hour you logged. Gone. Poof."
        confirmLabel="Remove"
        destructive
        onConfirm={handleRemoveCounter}
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
    <li className="flex items-center gap-2 rounded-lg border px-3 py-2.5">
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
      <RowOptionsMenu
        ariaLabel="Entry options"
        items={[
          {
            kind: "action",
            label: "Edit",
            icon: Pencil,
            onSelect: () => setEditing(true),
          },
          { kind: "separator" },
          {
            kind: "action",
            label: "Delete",
            icon: Trash2,
            destructive: true,
            onSelect: onRemove,
          },
        ]}
      />
    </li>
  );
}
