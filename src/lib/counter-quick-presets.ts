import {
  QUICK_LOG_SLOT_COUNT,
  QUICK_MINUTES,
} from "@/lib/constants";
import { ACTIVITY_TEMPLATES } from "@/lib/templates";
import type { Counter } from "@/lib/training-hours";

function padQuickLogMinutes(minutes: number[]): number[] {
  const defaults = [...QUICK_MINUTES];
  const next = [...minutes];
  while (next.length < QUICK_LOG_SLOT_COUNT) {
    next.push(defaults[next.length] ?? 10);
  }
  return next.slice(0, QUICK_LOG_SLOT_COUNT);
}

export function defaultQuickLogMinutesForName(name: string): number[] {
  const match = ACTIVITY_TEMPLATES.find(
    (t) => t.name.toLowerCase() === name.toLowerCase(),
  );
  const base = match ? [...match.suggestedMinutes] : [...QUICK_MINUTES];
  return padQuickLogMinutes(base);
}

export function sanitizeQuickLogMinutes(raw: unknown): number[] | null {
  if (!Array.isArray(raw)) return null;
  const parsed = raw
    .map((value) => (typeof value === "number" ? value : parseInt(String(value), 10)))
    .filter((value) => Number.isFinite(value) && value > 0 && value <= 24 * 60);
  if (parsed.length < 2) return null;
  return padQuickLogMinutes(parsed);
}

export function quickLogMinutesForCounter(counter: Counter): number[] {
  const saved = sanitizeQuickLogMinutes(counter.quickLogMinutes);
  if (saved) return saved;
  return defaultQuickLogMinutesForName(counter.name);
}

/** @deprecated use quickLogMinutesForCounter */
export function quickMinutesForCounter(counter: Counter): readonly number[] {
  return quickLogMinutesForCounter(counter);
}
