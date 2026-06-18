"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Undo2 } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { GuestBanner } from "@/components/guest-banner";
import { QuickMinuteRow } from "@/components/quick-minute-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LevelBadge } from "@/components/gamification/level-badge";
import { useLevelUp } from "@/components/providers/level-up-provider";
import { useCountersState } from "@/components/providers/counters-provider";
import { emojiForCounter } from "@/lib/counter-emoji";
import { levelSnapshot } from "@/lib/levels";
import { hoursOnDate, type Counter } from "@/lib/training-hours";
import { formatDuration, todayISO } from "@/lib/utils";

interface Toast {
  message: string;
}

export function QuickViewPage() {
  const { state, hydrated, isGuest, undo, canUndo } = useCountersState();
  const { logHoursWithCelebration } = useLevelUp();
  const [toast, setToast] = useState<Toast | null>(null);
  const today = todayISO();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  function logToCounter(counter: Counter, hours: number, note?: string) {
    logHoursWithCelebration(counter.id, hours, today, note);
    const suffix = note ? ` · ${note}` : "";
    setToast({
      message: `${formatDuration(hours)} → ${counter.name}${suffix}`,
    });
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/40 via-background to-background">
      <div className="mx-auto max-w-2xl px-4 py-10 pb-24 sm:px-6">
        <AppHeader
          title="Quick log"
          subtitle="Tap a duration to add time to any counter — all entries go to today."
          backHref="/"
        />

        {isGuest && <GuestBanner />}

        {state.counters.length === 0 ? (
          <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
            No counters yet.{" "}
            <Link href="/" className="text-primary underline-offset-4 hover:underline">
              Create one first
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {state.counters.map((counter) => {
              const todayTotal = hoursOnDate(counter.entries, today);
              const level = levelSnapshot(counter);

              return (
                <li key={counter.id}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <h3 className="flex min-w-0 items-center gap-2 truncate font-semibold">
                          <span className="text-xl leading-none" aria-hidden="true">
                            {emojiForCounter(counter)}
                          </span>
                          {counter.name}
                        </h3>
                        <div className="flex shrink-0 items-center gap-2">
                          <LevelBadge level={level.level} size="sm" />
                          <Badge variant="secondary" className="tabular-nums">
                            Today {formatDuration(todayTotal)}
                          </Badge>
                        </div>
                      </div>
                      <QuickMinuteRow
                        compact
                        label={counter.name}
                        onLog={(hours, note) =>
                          logToCounter(counter, hours, note)
                        }
                      />
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {toast && (
        <div className="fixed inset-x-4 bottom-6 z-50 mx-auto flex max-w-sm items-center gap-2 rounded-xl border bg-card px-4 py-3 shadow-lg">
          <Check className="size-4 shrink-0 text-primary" />
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          {canUndo && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 shrink-0 gap-1"
              onClick={() => {
                undo();
                setToast(null);
              }}
            >
              <Undo2 className="size-3.5" />
              Undo
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
