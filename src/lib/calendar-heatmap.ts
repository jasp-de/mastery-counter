import type { DayEntry } from "@/lib/training-hours";

export interface CalendarCell {
  date: string;
  day: number;
  inMonth: boolean;
  hours: number;
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function hoursByDate(entries: DayEntry[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const entry of entries) {
    map.set(entry.date, (map.get(entry.date) ?? 0) + entry.hours);
  }
  return map;
}

export function toMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function parseMonthKey(key: string): { year: number; month: number } {
  const [year, month] = key.split("-").map(Number);
  return { year, month: month - 1 };
}

export function formatMonthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function buildMonthGrid(
  year: number,
  month: number,
  hoursMap: Map<string, number>,
): CalendarCell[] {
  const firstOfMonth = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();

  // Monday = 0 … Sunday = 6
  const startOffset = (firstOfMonth.getDay() + 6) % 7;

  const cells: CalendarCell[] = [];

  for (let i = 0; i < startOffset; i++) {
    const d = new Date(year, month, -startOffset + i + 1);
    const date = isoDate(d);
    cells.push({
      date,
      day: d.getDate(),
      inMonth: false,
      hours: hoursMap.get(date) ?? 0,
    });
  }

  for (let day = 1; day <= lastDay; day++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({
      date,
      day,
      inMonth: true,
      hours: hoursMap.get(date) ?? 0,
    });
  }

  const trailing = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    const d = new Date(year, month + 1, i);
    const date = isoDate(d);
    cells.push({
      date,
      day: d.getDate(),
      inMonth: false,
      hours: hoursMap.get(date) ?? 0,
    });
  }

  return cells;
}

export function monthTotalHours(cells: CalendarCell[]): number {
  return cells
    .filter((c) => c.inMonth)
    .reduce((sum, c) => sum + c.hours, 0);
}

export function heatLevel(hours: number, maxHours: number): 0 | 1 | 2 | 3 | 4 {
  if (hours <= 0 || maxHours <= 0) return 0;
  const ratio = hours / maxHours;
  if (ratio >= 0.85) return 4;
  if (ratio >= 0.6) return 3;
  if (ratio >= 0.35) return 2;
  return 1;
}

export function heatCellClass(level: 0 | 1 | 2 | 3 | 4): string {
  switch (level) {
    case 0:
      return "bg-muted text-muted-foreground";
    case 1:
      return "bg-primary/20 text-foreground";
    case 2:
      return "bg-primary/40 text-foreground";
    case 3:
      return "bg-primary/65 text-primary-foreground";
    case 4:
      return "bg-primary text-primary-foreground";
    default: {
      const _exhaustive: never = level;
      return _exhaustive;
    }
  }
}

export { WEEKDAY_LABELS };

function isoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function currentMonthKey(): string {
  const now = new Date();
  return toMonthKey(now.getFullYear(), now.getMonth());
}

export function shiftMonthKey(key: string, delta: number): string {
  const { year, month } = parseMonthKey(key);
  const d = new Date(year, month + delta, 1);
  return toMonthKey(d.getFullYear(), d.getMonth());
}

export function isFutureMonth(key: string): boolean {
  return key > currentMonthKey();
}
