"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, LayoutTemplate, Plus, Trash2, Zap } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { AppShell } from "@/components/app-shell";
import { BrandLogo } from "@/components/brand/brand-logo";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { DataBackupPanel } from "@/components/data-backup-panel";
import { EmojiPicker, normalizeEmoji } from "@/components/emoji-picker";
import { GuestBanner } from "@/components/guest-banner";
import {
  ViewModeToggle,
  type CounterViewMode,
} from "@/components/view-mode-toggle";
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
import { useCountersState } from "@/components/providers/counters-provider";
import { emojiForCounter } from "@/lib/counter-emoji";
import { GOAL_PRESETS } from "@/lib/constants";
import { DEFAULT_COUNTER_EMOJI } from "@/lib/emojis";
import { hoursThisWeek } from "@/lib/stats";
import {
  loadWeeklyGoalHours,
  saveWeeklyGoalHours,
  weekProgressPercent,
} from "@/lib/weekly";
import {
  addCounter,
  DEFAULT_GOAL_HOURS,
  progressPercent,
  remainingHours,
  removeCounter,
  totalLoggedHours,
} from "@/lib/training-hours";
import { formatDuration, formatGoalHours } from "@/lib/utils";

export function CountersDashboard() {
  const { state, setState, hydrated, isGuest } = useCountersState();
  const [viewMode, setViewMode] = useState<CounterViewMode>("total");
  const [weeklyGoal, setWeeklyGoal] = useState(() => loadWeeklyGoalHours());
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGoal, setNewGoal] = useState(String(DEFAULT_GOAL_HOURS));
  const [newEmoji, setNewEmoji] = useState(DEFAULT_COUNTER_EMOJI);
  const [removeId, setRemoveId] = useState<string | null>(null);

  function handleAdd() {
    const goal = parseInt(newGoal, 10);
    if (!newName.trim() || !goal || goal <= 0) return;
    setState((prev) =>
      addCounter(prev, newName, goal, normalizeEmoji(newEmoji)),
    );
    setNewName("");
    setNewGoal(String(DEFAULT_GOAL_HOURS));
    setNewEmoji(DEFAULT_COUNTER_EMOJI);
    setShowAdd(false);
  }

  function handleRemove(id: string) {
    if (state.counters.length <= 1) return;
    setState((prev) => removeCounter(prev, id));
    setRemoveId(null);
  }

  function updateWeeklyGoal(raw: string) {
    const parsed = parseFloat(raw);
    if (!parsed || parsed <= 0) return;
    setWeeklyGoal(parsed);
    saveWeeklyGoalHours(parsed);
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <BrandLogo size="md" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <AppShell>
      <AppHeader variant="home" subtitle="Track hours. Stay consistent." />

      {isGuest && <GuestBanner />}

      <div className="mb-4 flex flex-wrap gap-2">
        <Button size="sm" asChild>
          <Link href="/quick">
            <Zap className="size-4" />
            Quick log
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/templates">
            <LayoutTemplate className="size-4" />
            Templates
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowAdd((v) => !v)}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>

      {showAdd && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">New counter</CardTitle>
            <CardDescription>Name it, pick an icon, set a goal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <EmojiPicker
              id="counter-emoji"
              value={newEmoji}
              onChange={setNewEmoji}
            />
            <div className="space-y-2">
              <Label htmlFor="counter-name">Name</Label>
              <Input
                id="counter-name"
                placeholder="Writing, Piano, Therapy…"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="counter-goal">Goal (hours)</Label>
              <div className="flex flex-wrap gap-1.5 pb-1">
                {GOAL_PRESETS.map((preset) => (
                  <Button
                    key={preset.hours}
                    type="button"
                    variant={
                      newGoal === String(preset.hours) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setNewGoal(String(preset.hours))}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              <Input
                id="counter-goal"
                type="number"
                min={1}
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd}>Create</Button>
              <Button variant="ghost" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0 pb-3">
          <div>
            <CardTitle className="text-base">Counters</CardTitle>
            {viewMode === "week" && (
              <CardDescription className="mt-1 flex flex-wrap items-center gap-1.5">
                <span>Weekly target</span>
                <Input
                  type="number"
                  min={1}
                  max={168}
                  className="h-7 w-16 tabular-nums"
                  value={weeklyGoal}
                  onChange={(e) => updateWeeklyGoal(e.target.value)}
                />
                <span>h</span>
              </CardDescription>
            )}
          </div>
          <ViewModeToggle value={viewMode} onChange={setViewMode} />
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
      {state.counters.length === 0 ? (
        <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
          No counters yet.{" "}
          <button
            type="button"
            className="text-primary underline-offset-4 hover:underline"
            onClick={() => setShowAdd(true)}
          >
            Add one
          </button>
          {" or "}
          <Link href="/templates" className="text-primary underline-offset-4 hover:underline">
            use a template
          </Link>
        </div>
      ) : (
      <ul className="space-y-2">
        {state.counters.map((counter) => {
          const logged = totalLoggedHours(counter.entries);
          const weekHours = hoursThisWeek(counter.entries);
          const remaining = remainingHours(counter.goalHours, counter.entries);
          const totalProgress = progressPercent(
            counter.goalHours,
            counter.entries,
          );
          const weekProgress = weekProgressPercent(weekHours, weeklyGoal);
          const complete = remaining === 0 && logged > 0;
          const progress =
            viewMode === "week" ? weekProgress : totalProgress;

          return (
            <li key={counter.id}>
              <div className="overflow-hidden rounded-lg border transition-colors hover:border-primary/25">
                <Link href={`/counter/${counter.id}`} className="block p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="text-xl leading-none" aria-hidden="true">
                        {emojiForCounter(counter)}
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate font-medium">{counter.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {viewMode === "week"
                            ? `${formatDuration(weekHours)} this week`
                            : `${formatGoalHours(remaining)} left`}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {complete && viewMode === "total" && (
                        <Badge variant="secondary" className="text-primary">
                          Done
                        </Badge>
                      )}
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                  <p className="mt-2 text-right text-xs tabular-nums text-muted-foreground">
                    {viewMode === "week"
                      ? `${formatDuration(weekHours)} / ${formatGoalHours(weeklyGoal)}`
                      : `${formatGoalHours(logged)} / ${formatGoalHours(counter.goalHours)}`}
                  </p>
                </Link>
                {state.counters.length > 1 && (
                  <div className="border-t px-3 py-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        setRemoveId(counter.id);
                      }}
                    >
                      <Trash2 className="size-3" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <DataBackupPanel />
      </div>

      <ConfirmDialog
        open={removeId !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveId(null);
        }}
        title="Remove counter?"
        description="This deletes the counter and all logged hours."
        confirmLabel="Remove"
        destructive
        onConfirm={() => {
          if (removeId) handleRemove(removeId);
        }}
      />
    </AppShell>
  );
}
