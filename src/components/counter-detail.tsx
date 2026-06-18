"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Flame,
  Pencil,
  Plus,
  Settings2,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { AppHeader } from "@/components/app-header";
import { BrandLogo } from "@/components/brand/brand-logo";
import { GuestBanner } from "@/components/guest-banner";
import { MonthlyHeatmap } from "@/components/monthly-heatmap";
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
import {
  getCounter,
  progressPercent,
  remainingHours,
  sortedEntries,
  totalLoggedHours,
  updateCounter,
  updateEntry,
  type DayEntry,
} from "@/lib/training-hours";
import { counterSummary } from "@/lib/stats";
import { EmojiPicker, normalizeEmoji } from "@/components/emoji-picker";
import { LevelPanel } from "@/components/gamification/level-panel";
import { RewardWheel } from "@/components/gamification/reward-wheel";
import { QuickLogButtons } from "@/components/quick-log-buttons";
import { useLevelUp } from "@/components/providers/level-up-provider";
import { emojiForCounter } from "@/lib/counter-emoji";
import { DEFAULT_COUNTER_EMOJI } from "@/lib/emojis";
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
  const { state, setState, hydrated, isGuest } = useCountersState();
  const { logHoursWithCelebration } = useLevelUp();
  const counter = getCounter(state, counterId);

  const [date, setDate] = useState(todayISO());
  const [hours, setHours] = useState("");
  const [note, setNote] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [emojiInput, setEmojiInput] = useState(DEFAULT_COUNTER_EMOJI);
  const [showSettings, setShowSettings] = useState(false);
  const [removeEntryId, setRemoveEntryId] = useState<string | null>(null);

  const stats = useMemo(
    () => (counter ? counterSummary(counter) : null),
    [counter],
  );

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
  const entries = useMemo(
    () => (counter ? sortedEntries(counter.entries) : []),
    [counter],
  );
  const todayTotal = useMemo(
    () =>
      counter
        ? counter.entries
            .filter((e) => e.date === todayISO())
            .reduce((sum, e) => sum + e.hours, 0)
        : 0,
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

    logHoursWithCelebration(
      counterId,
      parsed,
      date,
      noteOverride !== undefined ? noteOverride : note,
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <BrandLogo size="md" />
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!counter) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Counter not found.</p>
        <Button onClick={() => router.push("/")}>Back to all counters</Button>
      </div>
    );
  }

  const isComplete = remaining === 0 && logged > 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/40 via-background to-background">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <AppHeader
          title={`${emojiForCounter(counter)} ${counter.name}`}
          subtitle="Log hours and track progress toward this goal."
          backHref="/"
        />

        {isGuest && <GuestBanner />}

        <div className="mb-6 flex justify-end">
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
            Edit counter
          </Button>
        </div>

        {showSettings && (
          <Card className="mb-6 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Counter settings</CardTitle>
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
                <Label htmlFor="goal">Goal hours</Label>
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

        <section className="mb-8">
          <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-5">
              <LevelPanel counter={counter} />
            </CardContent>
          </Card>

          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p
                className="text-5xl font-semibold tabular-nums tracking-tight text-primary sm:text-6xl"
                style={{ fontFamily: "var(--font-display), serif" }}
              >
                {formatGoalHours(remaining)}
              </p>
            </div>
            {isComplete && (
              <Badge className="mb-2 bg-primary/15 text-primary hover:bg-primary/15">
                Goal reached
              </Badge>
            )}
          </div>

          <Progress value={progress} className="mb-3 h-4" />

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatGoalHours(logged)} logged</span>
            <span>{formatGoalHours(counter.goalHours)} goal</span>
          </div>
          <p className="mt-2 text-right text-sm font-medium text-foreground">
            {progress.toFixed(1)}% complete
          </p>
        </section>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            icon={<Clock className="size-4 text-primary" />}
            label="Today"
            value={formatDuration(todayTotal)}
          />
          <StatTile
            icon={<TrendingUp className="size-4 text-primary" />}
            label="Logged"
            value={formatGoalHours(logged)}
          />
          <StatTile
            icon={<Flame className="size-4 text-primary" />}
            label="Streak"
            value={stats ? `${stats.streak}d` : "0d"}
          />
          <StatTile
            icon={<Target className="size-4 text-primary" />}
            label="This week"
            value={stats ? formatGoalHours(stats.weekHours) : "0h"}
          />
        </div>

        <MonthlyHeatmap entries={counter.entries} />

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="size-5 text-primary" />
              Log hours
            </CardTitle>
            <CardDescription>
              Add how many hours you worked today or on any past date
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
                <Label htmlFor="hours">Hours worked</Label>
                <Input
                  id="hours"
                  type="number"
                  min={0.25}
                  max={24}
                  step={0.25}
                  placeholder="e.g. 6"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addHours();
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Input
                id="note"
                placeholder="What did you work on?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <QuickLogButtons
              label={counter.name}
              onLog={(h, note) => addHours(h, note)}
            />

            <Button className="w-full" onClick={() => addHours()}>
              Add hours
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-8 border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Wheel of questionable rewards</CardTitle>
            <CardDescription>
              No level up required. Spin when you need nonsense.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RewardWheel />
          </CardContent>
        </Card>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Daily log</h2>
            <span className="text-sm text-muted-foreground">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          {entries.length === 0 ? (
            <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
              No hours logged yet. Add your first entry above.
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
          title="Delete log entry?"
          description="This removes those hours from your total."
          confirmLabel="Delete"
          destructive
          onConfirm={() => {
            if (removeEntryId) removeEntry(removeEntryId);
          }}
        />
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-card/80 px-4 py-3 backdrop-blur-sm">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
    </div>
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
      <li className="rounded-xl border border-primary/30 bg-card px-4 py-3">
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
    <li className="group flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-colors hover:border-primary/30">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium tabular-nums">{formatDuration(entry.hours)}</p>
          <Separator orientation="vertical" className="h-4" />
          <p className="truncate text-sm text-muted-foreground">
            {formatDate(entry.date)}
          </p>
        </div>
        {entry.note && (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {entry.note}
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        onClick={() => setEditing(true)}
        aria-label="Edit entry"
      >
        <Pencil className="size-4 text-muted-foreground" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        onClick={onRemove}
        aria-label="Remove entry"
      >
        <Trash2 className="size-4 text-muted-foreground" />
      </Button>
    </li>
  );
}
