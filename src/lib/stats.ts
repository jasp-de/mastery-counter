import type { Counter, CountersState, DayEntry } from "@/lib/training-hours";
import { totalLoggedHours } from "@/lib/training-hours";
import { todayISO } from "@/lib/utils";

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

export function hoursByDateMap(entries: DayEntry[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const entry of entries) {
    map.set(entry.date, (map.get(entry.date) ?? 0) + entry.hours);
  }
  return map;
}

/** Consecutive days with logged hours, counting back from today (or last log day). */
export function currentStreak(entries: DayEntry[]): number {
  const byDate = hoursByDateMap(entries);
  const activeDates = [...byDate.entries()]
    .filter(([, hours]) => hours > 0)
    .map(([date]) => date)
    .sort((a, b) => b.localeCompare(a));

  if (activeDates.length === 0) return 0;

  const today = todayISO();
  const mostRecent = activeDates[0];
  const start = parseDate(mostRecent);
  const todayDate = parseDate(today);
  const dayMs = 86_400_000;

  if (todayDate.getTime() - start.getTime() > dayMs) {
    return 0;
  }

  let streak = 0;
  let cursor = start;

  while (true) {
    const key = dateISO(cursor);
    if ((byDate.get(key) ?? 0) <= 0) break;
    streak += 1;
    cursor = new Date(cursor.getTime() - dayMs);
  }

  return streak;
}

export function hoursInRange(entries: DayEntry[], startDate: string, endDate: string): number {
  return entries
    .filter((e) => e.date >= startDate && e.date <= endDate)
    .reduce((sum, e) => sum + e.hours, 0);
}

export function weekRange(reference = todayISO()): { start: string; end: string } {
  const date = parseDate(reference);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: dateISO(monday), end: dateISO(sunday) };
}

export function hoursThisWeek(entries: DayEntry[], reference = todayISO()): number {
  const { start, end } = weekRange(reference);
  return hoursInRange(entries, start, end);
}

export function totalHoursAllCounters(state: CountersState): number {
  return state.counters.reduce(
    (sum, counter) => sum + totalLoggedHours(counter.entries),
    0,
  );
}

export function hoursThisWeekAllCounters(state: CountersState): number {
  return state.counters.reduce(
    (sum, counter) => sum + hoursThisWeek(counter.entries),
    0,
  );
}

export function bestStreak(entries: DayEntry[]): number {
  const byDate = hoursByDateMap(entries);
  const dates = [...byDate.entries()]
    .filter(([, h]) => h > 0)
    .map(([d]) => d)
    .sort();

  if (dates.length === 0) return 0;

  let best = 1;
  let run = 1;
  const dayMs = 86_400_000;

  for (let i = 1; i < dates.length; i += 1) {
    const prev = parseDate(dates[i - 1]);
    const curr = parseDate(dates[i]);
    if (curr.getTime() - prev.getTime() === dayMs) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }

  return best;
}

export function counterSummary(counter: Counter): {
  logged: number;
  streak: number;
  weekHours: number;
} {
  return {
    logged: totalLoggedHours(counter.entries),
    streak: currentStreak(counter.entries),
    weekHours: hoursThisWeek(counter.entries),
  };
}
