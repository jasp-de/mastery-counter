"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { GuestBanner } from "@/components/guest-banner";
import { PageShell } from "@/components/page-shell";
import { WeeklyDayChart } from "@/components/weekly-day-chart";
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
import { currentStreak } from "@/lib/stats";
import {
  activeDaysInWeek,
  buildWeekDays,
  counterHoursInWeek,
  formatWeekLabel,
  hoursForWeek,
  isCurrentWeek,
  loadWeeklyGoalHours,
  saveWeeklyGoalHours,
  shiftWeekReference,
  weekComparisonDelta,
  weekProgressPercent,
  WEEKLY_GOAL_PRESETS,
  weekRange,
} from "@/lib/weekly";
import { cn, formatDuration, formatGoalHours, todayISO } from "@/lib/utils";

export function WeeklyPage() {
  const { state, hydrated, isGuest } = useCountersState();
  const [weekRef, setWeekRef] = useState(todayISO());
  const [weeklyGoal, setWeeklyGoal] = useState(() => loadWeeklyGoalHours());
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(() =>
    String(loadWeeklyGoalHours()),
  );

  const { start, end } = weekRange(weekRef);
  const weekLabel = formatWeekLabel(start, end);
  const isThisWeek = isCurrentWeek(weekRef);

  const days = useMemo(
    () => (hydrated ? buildWeekDays(state, weekRef) : []),
    [state, weekRef, hydrated],
  );
  const totalHours = useMemo(
    () => (hydrated ? hoursForWeek(state, weekRef) : 0),
    [state, weekRef, hydrated],
  );
  const progress = weekProgressPercent(totalHours, weeklyGoal);
  const delta = useMemo(
    () => (hydrated ? weekComparisonDelta(state, weekRef) : 0),
    [state, weekRef, hydrated],
  );
  const activeDays = useMemo(
    () => (hydrated ? activeDaysInWeek(state, weekRef) : 0),
    [state, weekRef, hydrated],
  );
  const bestStreak = useMemo(() => {
    const allEntries = state.counters.flatMap((c) => c.entries);
    return currentStreak(allEntries);
  }, [state.counters]);

  const counterBreakdown = useMemo(
    () =>
      [...state.counters]
        .map((c) => ({
          counter: c,
          hours: counterHoursInWeek(state, c.id, weekRef),
        }))
        .filter((row) => row.hours > 0 || isThisWeek)
        .sort((a, b) => b.hours - a.hours),
    [state, weekRef, isThisWeek],
  );

  function saveGoal() {
    const parsed = parseFloat(goalInput);
    if (!parsed || parsed <= 0) return;
    setWeeklyGoal(parsed);
    saveWeeklyGoalHours(parsed);
    setEditingGoal(false);
  }

  if (!hydrated) {
    return (
      <PageShell withNav={false}>
        <p className="text-center text-muted-foreground">Loading week…</p>
      </PageShell>
    );
  }

  const remaining = Math.max(0, weeklyGoal - totalHours);
  const goalMet = totalHours >= weeklyGoal && weeklyGoal > 0;

  return (
    <PageShell>
      <AppHeader
        title="Weekly mode"
        subtitle="One week at a time. Set a rhythm, not just a lifetime goal."
        backHref="/"
      />

      {isGuest && <GuestBanner />}

      <div className="glass-card mb-6 flex items-center justify-between gap-2 rounded-2xl border p-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous week"
          onClick={() => setWeekRef((r) => shiftWeekReference(r, -1))}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-semibold">{weekLabel}</p>
          {isThisWeek ? (
            <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary">
              This week
            </Badge>
          ) : (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => setWeekRef(todayISO())}
            >
              Jump to today
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Next week"
          disabled={isThisWeek}
          onClick={() => setWeekRef((r) => shiftWeekReference(r, 1))}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>

      <Card className="glass-card mb-6 overflow-hidden border-primary/20">
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Week total
                </p>
                <p
                  className="mt-1 text-5xl font-semibold tabular-nums tracking-tight text-primary"
                  style={{ fontFamily: "var(--font-display), serif" }}
                >
                  {formatGoalHours(totalHours)}
                </p>
                {goalMet ? (
                  <p className="mt-2 text-sm font-medium text-primary">
                    Weekly goal crushed.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatGoalHours(remaining)} to weekly goal
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                {delta !== 0 && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "gap-1 tabular-nums",
                      delta > 0
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {delta > 0 ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {delta > 0 ? "+" : ""}
                    {formatDuration(delta)} vs last wk
                  </Badge>
                )}
                <div className="flex gap-3 text-right text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Flame className="size-3.5 text-primary" />
                    {bestStreak}d streak
                  </span>
                  <span>{activeDays}/7 active days</span>
                </div>
              </div>
            </div>
            <Progress value={progress} className="mt-5 h-3" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{progress.toFixed(0)}% of weekly goal</span>
              <span>{formatGoalHours(weeklyGoal)} goal</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="size-4 text-primary" />
                Weekly goal
              </CardTitle>
              <CardDescription>
                Separate from lifetime counter goals — rhythm for this week only.
              </CardDescription>
            </div>
            {!editingGoal && (
              <Button variant="outline" size="sm" onClick={() => setEditingGoal(true)}>
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        {editingGoal ? (
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {WEEKLY_GOAL_PRESETS.map((h) => (
                <Button
                  key={h}
                  type="button"
                  size="sm"
                  variant={goalInput === String(h) ? "default" : "outline"}
                  onClick={() => setGoalInput(String(h))}
                >
                  {h}h
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekly-goal">Hours per week</Label>
              <Input
                id="weekly-goal"
                type="number"
                min={1}
                max={168}
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveGoal}>Save</Button>
              <Button variant="ghost" onClick={() => setEditingGoal(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">
              {formatGoalHours(weeklyGoal)}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                / week
              </span>
            </p>
          </CardContent>
        )}
      </Card>

      <Card className="glass-card mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Day by day</CardTitle>
          <CardDescription>All counters combined</CardDescription>
        </CardHeader>
        <CardContent>
          <WeeklyDayChart days={days} />
        </CardContent>
      </Card>

      <section className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">By counter</h2>
        {counterBreakdown.length === 0 ? (
          <div className="rounded-2xl border border-dashed py-10 text-center text-muted-foreground">
            Nothing logged this week yet.
          </div>
        ) : (
          <ul className="space-y-2">
            {counterBreakdown.map(({ counter, hours }) => {
              const share = totalHours > 0 ? (hours / totalHours) * 100 : 0;
              return (
                <li key={counter.id}>
                  <Link
                    href={`/counter/${counter.id}`}
                    className="glass-card flex items-center gap-3 rounded-xl border p-4 transition-colors hover:border-primary/30"
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {emojiForCounter(counter)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{counter.name}</p>
                      <Progress value={share} className="mt-2 h-1.5" />
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-semibold tabular-nums">
                        {formatDuration(hours)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {share.toFixed(0)}%
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {isThisWeek && (
        <Button size="lg" className="w-full gap-2" asChild>
          <Link href="/quick">
            <Zap className="size-4" />
            Log time today
          </Link>
        </Button>
      )}
    </PageShell>
  );
}
