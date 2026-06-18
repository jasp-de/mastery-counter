import {
  DEFAULT_COUNTER_NAME,
  DEFAULT_GOAL_HOURS,
  GUEST_STORAGE_KEY,
  LEGACY_GUEST_STORAGE_KEY,
  LEGACY_GUEST_STORAGE_KEY_V1,
  LEGACY_GUEST_STORAGE_KEY_V2,
  LEGACY_GUEST_STORAGE_KEY_V3,
} from "@/lib/constants";

export interface DayEntry {
  id: string;
  date: string;
  hours: number;
  note?: string;
}

export interface Counter {
  id: string;
  name: string;
  emoji?: string;
  goalHours: number;
  entries: DayEntry[];
  createdAt: string;
}

export interface CountersState {
  counters: Counter[];
}

/** @deprecated Legacy single-counter shape for migration */
export interface TrainingState {
  goalHours: number;
  entries: DayEntry[];
}

export { DEFAULT_GOAL_HOURS, GUEST_STORAGE_KEY };

export function createEntry(
  date: string,
  hours: number,
  note?: string,
): DayEntry {
  return {
    id: crypto.randomUUID(),
    date,
    hours,
    note: note?.trim() || undefined,
  };
}

export function createCounter(
  name: string,
  goalHours: number = DEFAULT_GOAL_HOURS,
  emoji?: string,
): Counter {
  return {
    id: crypto.randomUUID(),
    name: name.trim() || "New counter",
    emoji: emoji?.trim() || undefined,
    goalHours,
    entries: [],
    createdAt: new Date().toISOString(),
  };
}

export function createDefaultState(): CountersState {
  return {
    counters: [createCounter(DEFAULT_COUNTER_NAME, DEFAULT_GOAL_HOURS)],
  };
}

export function totalLoggedHours(entries: DayEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.hours, 0);
}

export function remainingHours(goalHours: number, entries: DayEntry[]): number {
  return Math.max(0, goalHours - totalLoggedHours(entries));
}

export function progressPercent(goalHours: number, entries: DayEntry[]): number {
  if (goalHours <= 0) return 0;
  return Math.min(100, (totalLoggedHours(entries) / goalHours) * 100);
}

export function sortedEntries(entries: DayEntry[]): DayEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}

function isDayEntry(value: unknown): value is DayEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as DayEntry;
  return (
    typeof entry.id === "string" &&
    typeof entry.date === "string" &&
    typeof entry.hours === "number"
  );
}

function isCounter(value: unknown): value is Counter {
  if (!value || typeof value !== "object") return false;
  const counter = value as Counter;
  return (
    typeof counter.id === "string" &&
    typeof counter.name === "string" &&
    typeof counter.goalHours === "number" &&
    Array.isArray(counter.entries) &&
    counter.entries.every(isDayEntry)
  );
}

function isLegacyTrainingState(value: unknown): value is TrainingState {
  if (!value || typeof value !== "object") return false;
  const state = value as TrainingState;
  return (
    typeof state.goalHours === "number" &&
    Array.isArray(state.entries) &&
    !("counters" in state)
  );
}

export function normalizeCountersState(data: unknown): CountersState {
  if (!data || typeof data !== "object") return createDefaultState();

  if (isLegacyTrainingState(data)) {
    return {
      counters: [
        {
          id: crypto.randomUUID(),
          name: DEFAULT_COUNTER_NAME,
          goalHours: data.goalHours > 0 ? data.goalHours : DEFAULT_GOAL_HOURS,
          entries: data.entries.filter(isDayEntry),
          createdAt: new Date().toISOString(),
        },
      ],
    };
  }

  const state = data as CountersState;
  if (!Array.isArray(state.counters)) return createDefaultState();

  const counters = state.counters.filter(isCounter).map((counter) => ({
    ...counter,
    goalHours: counter.goalHours > 0 ? counter.goalHours : DEFAULT_GOAL_HOURS,
    entries: counter.entries.filter(isDayEntry),
  }));

  return counters.length > 0 ? { counters } : createDefaultState();
}

export function loadGuestState(): CountersState {
  if (typeof window === "undefined") return createDefaultState();
  try {
    let raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) {
      for (const legacyKey of [
        LEGACY_GUEST_STORAGE_KEY,
        LEGACY_GUEST_STORAGE_KEY_V3,
        LEGACY_GUEST_STORAGE_KEY_V2,
        LEGACY_GUEST_STORAGE_KEY_V1,
      ]) {
        raw = localStorage.getItem(legacyKey);
        if (raw) {
          localStorage.setItem(GUEST_STORAGE_KEY, raw);
          localStorage.removeItem(legacyKey);
          break;
        }
      }
    }
    if (!raw) return createDefaultState();
    return normalizeCountersState(JSON.parse(raw));
  } catch {
    return createDefaultState();
  }
}

export function saveGuestState(state: CountersState): void {
  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(state));
}

export function updateCounter(
  state: CountersState,
  counterId: string,
  updater: (counter: Counter) => Counter,
): CountersState {
  return {
    counters: state.counters.map((counter) =>
      counter.id === counterId ? updater(counter) : counter,
    ),
  };
}

export function removeCounter(
  state: CountersState,
  counterId: string,
): CountersState {
  const next = state.counters.filter((c) => c.id !== counterId);
  return next.length > 0 ? { counters: next } : createDefaultState();
}

export function addCounter(
  state: CountersState,
  name: string,
  goalHours?: number,
  emoji?: string,
): CountersState {
  return {
    counters: [...state.counters, createCounter(name, goalHours, emoji)],
  };
}

export function appendCounter(
  state: CountersState,
  counter: Counter,
): CountersState {
  return {
    counters: [...state.counters, counter],
  };
}

export function getCounter(
  state: CountersState,
  counterId: string,
): Counter | undefined {
  return state.counters.find((c) => c.id === counterId);
}

export function logHoursToCounter(
  state: CountersState,
  counterId: string,
  hours: number,
  date: string,
  note?: string,
): CountersState {
  const entry = createEntry(date, hours, note);
  return updateCounter(state, counterId, (c) => ({
    ...c,
    entries: [...c.entries, entry],
  }));
}

export function updateEntry(
  state: CountersState,
  counterId: string,
  entryId: string,
  patch: Partial<Pick<DayEntry, "date" | "hours" | "note">>,
): CountersState {
  return updateCounter(state, counterId, (c) => ({
    ...c,
    entries: c.entries.map((entry) => {
      if (entry.id !== entryId) return entry;
      return {
        ...entry,
        ...patch,
        note: patch.note !== undefined ? patch.note?.trim() || undefined : entry.note,
      };
    }),
  }));
}

export function hoursOnDate(entries: DayEntry[], date: string): number {
  return entries
    .filter((e) => e.date === date)
    .reduce((sum, e) => sum + e.hours, 0);
}
