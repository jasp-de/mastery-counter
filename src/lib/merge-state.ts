import { DEFAULT_COUNTER_NAME, DEFAULT_GOAL_HOURS } from "@/lib/constants";
import type { CountersState } from "@/lib/training-hours";
import { totalLoggedHours } from "@/lib/training-hours";

export function mergeCountersStates(
  primary: CountersState,
  secondary: CountersState,
): CountersState {
  const seen = new Set(primary.counters.map((c) => c.id));
  const merged = [...primary.counters];

  for (const counter of secondary.counters) {
    if (!seen.has(counter.id)) {
      merged.push(counter);
      seen.add(counter.id);
    }
  }

  return { counters: merged };
}

export function totalLoggedInState(state: CountersState): number {
  return state.counters.reduce(
    (sum, c) => sum + totalLoggedHours(c.entries),
    0,
  );
}

export function hasMeaningfulGuestData(state: CountersState): boolean {
  if (state.counters.length > 1) return true;
  if (state.counters.some((c) => c.entries.length > 0)) return true;
  const only = state.counters[0];
  if (!only) return false;
  return only.name !== DEFAULT_COUNTER_NAME || only.goalHours !== DEFAULT_GOAL_HOURS;
}

export function isLikelyEmptyCloudState(state: CountersState): boolean {
  if (state.counters.length === 0) return true;
  if (state.counters.length > 1) return false;
  const only = state.counters[0];
  return (
    only.entries.length === 0 &&
    only.name === DEFAULT_COUNTER_NAME
  );
}

export function mergeHandledKey(userId: string): string {
  return `mastery-merge-handled-${userId}`;
}
