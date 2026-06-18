"use client";

import Link from "next/link";
import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { AppShell } from "@/components/app-shell";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CounterOptionsMenu } from "@/components/counter-options-menu";
import { CounterQuickLogStrip } from "@/components/counter-quick-log-strip";
import { GuestBanner } from "@/components/guest-banner";
import { useLogFeedback } from "@/components/log-feedback-toast";
import { useCountersState } from "@/components/providers/counters-provider";
import { emojiForCounter } from "@/lib/counter-emoji";
import {
  hoursOnDate,
  logHoursToCounter,
  removeCounter,
  updateCounter,
  type Counter,
} from "@/lib/training-hours";
import { formatDuration, todayISO } from "@/lib/utils";

export function QuickViewPage() {
  const { state, hydrated, isGuest, mutateWithUndo, undo, canUndo, setState } =
    useCountersState();
  const { showFeedback, toast } = useLogFeedback({ canUndo, undo });
  const [removeId, setRemoveId] = useState<string | null>(null);
  const today = todayISO();

  function logToCounter(counter: Counter, hours: number, note?: string) {
    mutateWithUndo((prev) =>
      logHoursToCounter(prev, counter.id, hours, today, note),
    );
    const suffix = note ? ` · ${note}` : "";
    showFeedback(`${formatDuration(hours)} → ${counter.name}${suffix}`);
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <>
      <AppShell>
        <AppHeader
          title="Quick log"
          subtitle="Fullscreen lock-in — tap, log, done."
          backHref="/"
        />

        {isGuest && <GuestBanner />}

        {state.counters.length === 0 ? (
          <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
            No locks yet.{" "}
            <Link href="/" className="text-primary hover:underline">
              Start one on home
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {state.counters.map((counter) => {
              const todayTotal = hoursOnDate(counter.entries, today);
              return (
                <li
                  key={counter.id}
                  className="overflow-hidden rounded-xl border bg-card"
                >
                  <div className="flex items-center justify-between gap-2 px-4 py-3">
                    <h3 className="flex min-w-0 items-center gap-2 truncate font-medium">
                      <span className="text-lg" aria-hidden="true">
                        {emojiForCounter(counter)}
                      </span>
                      {counter.name}
                    </h3>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {formatDuration(todayTotal)} today
                      </span>
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
                      />
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
      </AppShell>

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
          if (!removeId || state.counters.length <= 1) return;
          setState((prev) => removeCounter(prev, removeId));
          setRemoveId(null);
        }}
      />

      {toast}
    </>
  );
}
