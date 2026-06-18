import type { CountersState } from "@/lib/training-hours";
import { hoursOnDate } from "@/lib/training-hours";
import { hoursInRange, weekRange } from "@/lib/stats";
import { todayISO } from "@/lib/utils";

export { weekRange };

export const WEEKLY_GOAL_STORAGE_KEY = "mastery-weekly-goal-hours";
export const DEFAULT_WEEKLY_GOAL_HOURS = 10;

export const WEEKLY_GOAL_PRESETS = [5, 10, 15, 20, 30] as const;

const DAY_MS = 86_400_000;

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function dateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function shiftWeekReference(reference: string, weeks: number): string {
  const d = parseDate(reference);
  d.setDate(d.getDate() + weeks * 7);
  return dateISO(d);
}

export function isCurrentWeek(reference: string): boolean {
  const today = todayISO();
  const { start, end } = weekRange(today);
  const { start: refStart } = weekRange(reference);
  return refStart === start && weekRange(reference).end === end;
}

export function formatWeekLabel(start: string, end: string): string {
  const s = parseDate(start);
  const e = parseDate(end);
  const sameMonth = s.getMonth() === e.getMonth();
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (sameMonth) {
    return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${e.getDate()}, ${e.getFullYear()}`;
  }
  return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", { ...opts, year: "numeric" })}`;
}

export interface WeekDayCell {
  date: string;
  weekday: string;
  dayNum: number;
  hours: number;
  isToday: boolean;
  isFuture: boolean;
}

export function hoursAllCountersOnDate(
  state: CountersState,
  date: string,
): number {
  return state.counters.reduce(
    (sum, counter) => sum + hoursOnDate(counter.entries, date),
    0,
  );
}

export function hoursForWeek(
  state: CountersState,
  reference = todayISO(),
): number {
  const allEntries = state.counters.flatMap((c) => c.entries);
  const { start, end } = weekRange(reference);
  return hoursInRange(allEntries, start, end);
}

export function buildWeekDays(
  state: CountersState,
  reference = todayISO(),
): WeekDayCell[] {
  const { start } = weekRange(reference);
  const today = todayISO();
  const startDate = parseDate(start);
  const days: WeekDayCell[] = [];

  for (let i = 0; i < 7; i += 1) {
    const d = new Date(startDate.getTime() + i * DAY_MS);
    const date = dateISO(d);
    days.push({
      date,
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: d.getDate(),
      hours: hoursAllCountersOnDate(state, date),
      isToday: date === today,
      isFuture: date > today,
    });
  }

  return days;
}

export function activeDaysInWeek(
  state: CountersState,
  reference = todayISO(),
): number {
  return buildWeekDays(state, reference).filter((d) => d.hours > 0).length;
}

export function counterHoursInWeek(
  state: CountersState,
  counterId: string,
  reference = todayISO(),
): number {
  const counter = state.counters.find((c) => c.id === counterId);
  if (!counter) return 0;
  const { start, end } = weekRange(reference);
  return hoursInRange(counter.entries, start, end);
}

export function weekComparisonDelta(
  state: CountersState,
  reference = todayISO(),
): number {
  const current = hoursForWeek(state, reference);
  const previous = hoursForWeek(state, shiftWeekReference(reference, -1));
  return current - previous;
}

export function loadWeeklyGoalHours(): number {
  if (typeof window === "undefined") return DEFAULT_WEEKLY_GOAL_HOURS;
  try {
    const raw = localStorage.getItem(WEEKLY_GOAL_STORAGE_KEY);
    const parsed = raw ? parseFloat(raw) : NaN;
    return parsed > 0 ? parsed : DEFAULT_WEEKLY_GOAL_HOURS;
  } catch {
    return DEFAULT_WEEKLY_GOAL_HOURS;
  }
}

export function saveWeeklyGoalHours(hours: number): void {
  localStorage.setItem(WEEKLY_GOAL_STORAGE_KEY, String(hours));
}

export function weekProgressPercent(logged: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, (logged / goal) * 100);
}
