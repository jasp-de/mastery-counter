"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, LayoutTemplate, Plus, Trash2, Zap } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { BrandLogo } from "@/components/brand/brand-logo";
import { GuestBanner } from "@/components/guest-banner";
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
import { EmojiPicker, normalizeEmoji } from "@/components/emoji-picker";
import { LevelBadge } from "@/components/gamification/level-badge";
import { LevelTrack } from "@/components/gamification/level-track";
import { useCountersState } from "@/components/providers/counters-provider";
import { emojiForCounter } from "@/lib/counter-emoji";
import { DEFAULT_COUNTER_EMOJI } from "@/lib/emojis";
import { levelSnapshot } from "@/lib/levels";
import {
  addCounter,
  DEFAULT_GOAL_HOURS,
  progressPercent,
  remainingHours,
  removeCounter,
  totalLoggedHours,
} from "@/lib/training-hours";
import { formatGoalHours } from "@/lib/utils";

export function CountersDashboard() {
  const { state, setState, hydrated, isGuest } = useCountersState();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGoal, setNewGoal] = useState(String(DEFAULT_GOAL_HOURS));
  const [newEmoji, setNewEmoji] = useState(DEFAULT_COUNTER_EMOJI);

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
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <BrandLogo size="md" showTagline />
        <p className="text-muted-foreground">Loading your counters…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/40 via-background to-background">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <AppHeader
          variant="home"
          subtitle="Your path to 10,000 hours. Log minutes, track counters, watch mastery grow."
        />

        {isGuest && <GuestBanner />}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Your counters</h2>
          <div className="flex flex-wrap gap-2">
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
            <Button size="sm" onClick={() => setShowAdd((v) => !v)}>
              <Plus className="size-4" />
              Add counter
            </Button>
          </div>
        </div>

        {showAdd && (
          <Card className="mb-6 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">New counter</CardTitle>
              <CardDescription>
                e.g. Project work, Study, Side hustle, Fitness
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
                  placeholder="Project hours"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="counter-goal">Goal hours</Label>
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

        <ul className="space-y-3">
          {state.counters.map((counter) => {
            const logged = totalLoggedHours(counter.entries);
            const remaining = remainingHours(counter.goalHours, counter.entries);
            const progress = progressPercent(
              counter.goalHours,
              counter.entries,
            );
            const complete = remaining === 0 && logged > 0;
            const level = levelSnapshot(counter);

            return (
              <li key={counter.id}>
                <Card className="overflow-hidden transition-colors hover:border-primary/30">
                  <Link href={`/counter/${counter.id}`} className="block">
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-2xl leading-none"
                              aria-hidden="true"
                            >
                              {emojiForCounter(counter)}
                            </span>
                            <h3 className="truncate font-semibold">
                              {counter.name}
                            </h3>
                            <LevelBadge level={level.level} size="sm" />
                            {complete && (
                              <Badge
                                variant="secondary"
                                className="shrink-0 bg-primary/10 text-primary"
                              >
                                Done
                              </Badge>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {level.title} · {formatGoalHours(remaining)} left
                          </p>
                        </div>
                        <ChevronRight className="mt-1 size-5 shrink-0 text-muted-foreground" />
                      </div>
                      <LevelTrack
                        level={level.level}
                        progressInLevel={level.progressInLevel}
                        compact
                        className="mb-2"
                      />
                      <Progress value={progress} className="h-2.5" />
                      <p className="mt-2 text-right text-xs font-medium text-muted-foreground">
                        {progress.toFixed(1)}% complete
                      </p>
                    </CardContent>
                  </Link>
                  {state.counters.length > 1 && (
                    <div className="border-t px-4 py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(counter.id);
                        }}
                      >
                        <Trash2 className="size-3.5" />
                        Remove
                      </Button>
                    </div>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>

        {state.counters.length === 0 && (
          <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
            No counters yet.{" "}
            <button
              type="button"
              className="text-primary underline-offset-4 hover:underline"
              onClick={() => setShowAdd(true)}
            >
              Create one
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
