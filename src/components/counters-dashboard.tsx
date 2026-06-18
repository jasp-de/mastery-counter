"use client";

import Link from "next/link";
import { useState } from "react";
import { GripVertical, LayoutTemplate, Plus } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { AppShell } from "@/components/app-shell";
import { BrandLogo } from "@/components/brand/brand-logo";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CounterGoalFields } from "@/components/counter-goal-fields";
import { CounterOptionsMenu } from "@/components/counter-options-menu";
import { CounterQuickLogStrip } from "@/components/counter-quick-log-strip";
import { DataBackupPanel } from "@/components/data-backup-panel";
import { EmojiPicker, normalizeEmoji } from "@/components/emoji-picker";
import { GuestBanner } from "@/components/guest-banner";
import { useLogFeedback } from "@/components/log-feedback-toast";
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
import { DEFAULT_WEEKLY_GOAL_HOURS } from "@/lib/constants";
import { DEFAULT_COUNTER_EMOJI } from "@/lib/emojis";
import { hoursThisWeek } from "@/lib/stats";
import {
  addCounter,
  DEFAULT_GOAL_HOURS,
  hoursOnDate,
  logHoursToCounter,
  moveCounter,
  progressPercent,
  remainingHours,
  removeCounter,
  reorderCounters,
  totalLoggedHours,
  updateCounter,
  type Counter,
} from "@/lib/training-hours";
import { counterWeeklyGoal, weekProgressPercent } from "@/lib/weekly";
import { cn, formatDuration, formatGoalHours, todayISO } from "@/lib/utils";

export function CountersDashboard() {
  const { state, setState, hydrated, isGuest, mutateWithUndo, undo, canUndo } =
    useCountersState();
  const { showFeedback, toast } = useLogFeedback({ canUndo, undo });
  const [viewMode, setViewMode] = useState<CounterViewMode>("total");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGoal, setNewGoal] = useState(String(DEFAULT_GOAL_HOURS));
  const [newWeeklyGoal, setNewWeeklyGoal] = useState(
    String(DEFAULT_WEEKLY_GOAL_HOURS),
  );
  const [newEmoji, setNewEmoji] = useState(DEFAULT_COUNTER_EMOJI);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const today = todayISO();

  function logToCounter(counter: Counter, hours: number, note?: string) {
    mutateWithUndo((prev) =>
      logHoursToCounter(prev, counter.id, hours, today, note),
    );
    const suffix = note ? ` · ${note}` : "";
    showFeedback(`${formatDuration(hours)} → ${counter.name}${suffix}`);
  }

  function handleAdd() {
    const goal = parseInt(newGoal, 10);
    const weeklyGoal = parseFloat(newWeeklyGoal);
    if (!newName.trim() || !goal || goal <= 0 || !weeklyGoal || weeklyGoal <= 0) {
      return;
    }
    setState((prev) =>
      addCounter(
        prev,
        newName,
        goal,
        normalizeEmoji(newEmoji),
        weeklyGoal,
      ),
    );
    setNewName("");
    setNewGoal(String(DEFAULT_GOAL_HOURS));
    setNewWeeklyGoal(String(DEFAULT_WEEKLY_GOAL_HOURS));
    setNewEmoji(DEFAULT_COUNTER_EMOJI);
    setShowAdd(false);
  }

  function handleRemove(id: string) {
    if (state.counters.length <= 1) return;
    setState((prev) => removeCounter(prev, id));
    setRemoveId(null);
  }

  function handleDrop(toIndex: number) {
    if (dragIndex === null || dragIndex === toIndex) {
      setDragIndex(null);
      setDropIndex(null);
      return;
    }
    setState((prev) => reorderCounters(prev, dragIndex, toIndex));
    setDragIndex(null);
    setDropIndex(null);
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
    <>
      <AppShell>
        <AppHeader
          variant="home"
          subtitle="Clock it. Lock it in."
        />

        {isGuest && <GuestBanner />}

        <div className="mb-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/templates">
              <LayoutTemplate className="size-4" />
              Templates
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdd((v) => !v)}
          >
            <Plus className="size-4" />
            Add
          </Button>
        </div>

        {showAdd && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">New lock-in</CardTitle>
              <CardDescription>
                Name the thing. Set the bar. No take-backsies (well, a few).
              </CardDescription>
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
                  placeholder="The novel, violin, therapy hours…"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <CounterGoalFields
                totalGoal={newGoal}
                weeklyGoal={newWeeklyGoal}
                onTotalGoalChange={setNewGoal}
                onWeeklyGoalChange={setNewWeeklyGoal}
              />
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
            <CardTitle className="text-base">Counters</CardTitle>
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {state.counters.length === 0 ? (
              <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
                Nothing locked in yet.{" "}
                <button
                  type="button"
                  className="text-primary underline-offset-4 hover:underline"
                  onClick={() => setShowAdd(true)}
                >
                  Add one
                </button>
                {" or "}
                <Link
                  href="/templates"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  steal a template
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {state.counters.map((counter, index) => {
                  const logged = totalLoggedHours(counter.entries);
                  const weekHours = hoursThisWeek(counter.entries);
                  const todayHours = hoursOnDate(counter.entries, today);
                  const weeklyGoal = counterWeeklyGoal(counter);
                  const remaining = remainingHours(
                    counter.goalHours,
                    counter.entries,
                  );
                  const totalProgress = progressPercent(
                    counter.goalHours,
                    counter.entries,
                  );
                  const weekProgress = weekProgressPercent(
                    weekHours,
                    weeklyGoal,
                  );
                  const complete = remaining === 0 && logged > 0;
                  const progress =
                    viewMode === "week" ? weekProgress : totalProgress;
                  const isDragging = dragIndex === index;
                  const isDropTarget =
                    dropIndex === index &&
                    dragIndex !== null &&
                    dragIndex !== index;

                  return (
                    <li
                      key={counter.id}
                      draggable
                      onDragStart={() => setDragIndex(index)}
                      onDragEnd={() => {
                        setDragIndex(null);
                        setDropIndex(null);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDropIndex(index);
                      }}
                      onDragLeave={() => {
                        if (dropIndex === index) setDropIndex(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDrop(index);
                      }}
                      className={cn(
                        "overflow-hidden rounded-xl border bg-card transition-opacity",
                        isDragging && "opacity-40",
                        isDropTarget && "border-primary/50 ring-1 ring-primary/20",
                      )}
                    >
                      <div className="flex items-start gap-0.5 px-2 pt-4 sm:px-3">
                        <div
                          className="mt-0.5 flex size-8 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 active:cursor-grabbing"
                          aria-hidden="true"
                        >
                          <GripVertical className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-1 pr-1">
                            <Link
                              href={`/counter/${counter.id}`}
                              className="min-w-0 flex-1"
                            >
                              <div className="flex items-center gap-2.5">
                                <span
                                  className="text-lg leading-none"
                                  aria-hidden="true"
                                >
                                  {emojiForCounter(counter)}
                                </span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h3 className="truncate font-medium">
                                      {counter.name}
                                    </h3>
                                    {complete && viewMode === "total" && (
                                      <Badge
                                        variant="secondary"
                                        className="shrink-0 text-xs text-primary"
                                      >
                                        Done
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {viewMode === "week"
                                      ? `${formatDuration(weekHours)} this week`
                                      : `${formatGoalHours(remaining)} left`}
                                    {todayHours > 0 && (
                                      <span className="text-foreground/70">
                                        {" · "}
                                        {formatDuration(todayHours)} today
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </Link>
                            <CounterOptionsMenu
                              counterId={counter.id}
                              canDelete={state.counters.length > 1}
                              onDelete={() => setRemoveId(counter.id)}
                              promptNoteOnQuickLog={
                                counter.promptNoteOnQuickLog === true
                              }
                              onTogglePromptNote={() =>
                                setState((prev) =>
                                  updateCounter(prev, counter.id, (c) => ({
                                    ...c,
                                    promptNoteOnQuickLog: !c.promptNoteOnQuickLog,
                                  })),
                                )
                              }
                              canMoveUp={index > 0}
                              canMoveDown={index < state.counters.length - 1}
                              onMoveUp={() =>
                                setState((prev) =>
                                  moveCounter(prev, counter.id, "up"),
                                )
                              }
                              onMoveDown={() =>
                                setState((prev) =>
                                  moveCounter(prev, counter.id, "down"),
                                )
                              }
                            />
                          </div>

                          <Link
                            href={`/counter/${counter.id}`}
                            className="block py-3 pr-1"
                          >
                            <Progress value={progress} className="h-2" />
                            <p className="mt-1.5 text-xs tabular-nums text-muted-foreground">
                              {viewMode === "week"
                                ? `${formatDuration(weekHours)} / ${formatGoalHours(weeklyGoal)} weekly`
                                : `${formatGoalHours(logged)} / ${formatGoalHours(counter.goalHours)} total`}
                            </p>
                          </Link>
                        </div>
                      </div>

                      <div className="border-t bg-muted/20 px-3 py-3">
                        <CounterQuickLogStrip
                          key={`${counter.id}-${counter.quickLogMinutes?.join("-") ?? "default"}-${counter.promptNoteOnQuickLog ? "notes" : "nonotes"}`}
                          counter={counter}
                          onLog={(hours, note) =>
                            logToCounter(counter, hours, note)
                          }
                          onSavePresets={(minutes) =>
                            setState((prev) =>
                              updateCounter(prev, counter.id, (c) => ({
                                ...c,
                                quickLogMinutes: minutes,
                              })),
                            )
                          }
                        />
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
          title="Break the lock?"
          description="Deletes this counter and every hour you logged. Gone. Poof."
          confirmLabel="Remove"
          destructive
          onConfirm={() => {
            if (removeId) handleRemove(removeId);
          }}
        />
      </AppShell>

      {toast}
    </>
  );
}
