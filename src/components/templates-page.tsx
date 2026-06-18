"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AppShell } from "@/components/app-shell";
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
import { useCountersState } from "@/components/providers/counters-provider";
import { MASTERY_GOAL_HOURS } from "@/lib/constants";
import {
  HABIT_TEMPLATES,
  MASTERY_TEMPLATES,
  type ActivityTemplate,
} from "@/lib/templates";
import {
  appendCounter,
  createCounter,
  createEntry,
  updateCounter,
  type CountersState,
} from "@/lib/training-hours";
import {
  cn,
  formatGoalHours,
  formatMinutesLabel,
  minutesToHours,
  todayISO,
} from "@/lib/utils";

function findCounterByName(state: CountersState, name: string) {
  return state.counters.find(
    (c) => c.name.toLowerCase() === name.toLowerCase(),
  );
}

export function TemplatesPage() {
  const router = useRouter();
  const { state, setState, hydrated, isGuest } = useCountersState();

  function addTemplateCounter(template: ActivityTemplate) {
    const existing = findCounterByName(state, template.name);
    if (existing) {
      router.push(`/counter/${existing.id}`);
      return;
    }

    const counter = createCounter(
      template.name,
      template.defaultGoalHours,
      template.emoji,
    );
    setState((prev) => appendCounter(prev, counter));
    router.push(`/counter/${counter.id}`);
  }

  function logTemplateMinutes(template: ActivityTemplate, minutes: number) {
    setState((prev) => {
      let counter = findCounterByName(prev, template.name);
      let next = prev;
      if (!counter) {
        const created = createCounter(
          template.name,
          template.defaultGoalHours,
          template.emoji,
        );
        next = appendCounter(prev, created);
        counter = created;
      }
      if (!counter) return prev;
      const entry = createEntry(todayISO(), minutesToHours(minutes));
      return updateCounter(next, counter.id, (c) => ({
        ...c,
        entries: [...c.entries, entry],
      }));
    });
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading templates…</p>
      </div>
    );
  }

  return (
    <AppShell>
        <AppHeader
          title="Templates"
          subtitle="Start from a preset or log a quick session."
          backHref="/"
        />

        {isGuest && <GuestBanner />}

        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">10,000 hour mastery</h2>
            <p className="text-sm text-muted-foreground">
              Long-arc skills — psychotherapy, writing, instrument, and more.
            </p>
          </div>
          <ul className="space-y-4">
            {MASTERY_TEMPLATES.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onLog={logTemplateMinutes}
                onAdd={addTemplateCounter}
              />
            ))}
          </ul>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Daily habits</h2>
            <p className="text-sm text-muted-foreground">
              Smaller goals with minute-sized steps.
            </p>
          </div>
          <ul className="space-y-4">
            {HABIT_TEMPLATES.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onLog={logTemplateMinutes}
                onAdd={addTemplateCounter}
              />
            ))}
          </ul>
        </section>

        <div className="mt-8 text-center">
          <Button variant="ghost" asChild>
            <Link href="/">Back to counters</Link>
          </Button>
        </div>
    </AppShell>
  );
}

function TemplateCard({
  template,
  onLog,
  onAdd,
}: {
  template: ActivityTemplate;
  onLog: (template: ActivityTemplate, minutes: number) => void;
  onAdd: (template: ActivityTemplate) => void;
}) {
  const isMastery = template.category === "mastery";

  return (
    <li>
      <Card className={cn(isMastery && "border-primary/20")}>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <span className="text-3xl" aria-hidden="true">
              {template.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                {isMastery && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {formatGoalHours(MASTERY_GOAL_HOURS)} goal
                  </Badge>
                )}
              </div>
              <CardDescription className="mt-1">
                {template.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Suggested steps
            </p>
            <div className="flex flex-wrap gap-2">
              {template.suggestedMinutes.map((m) => (
                <Button
                  key={m}
                  size="sm"
                  variant="secondary"
                  onClick={() => onLog(template, m)}
                >
                  +{formatMinutesLabel(m)}
                </Button>
              ))}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => onAdd(template)}>
            Add as counter
          </Button>
        </CardContent>
      </Card>
    </li>
  );
}
