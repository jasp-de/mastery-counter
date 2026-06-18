import type { CountersState } from "@/lib/training-hours";
import { normalizeCountersState } from "@/lib/training-hours";

const EXPORT_VERSION = 1;

export interface LockInExport {
  version: number;
  exportedAt: string;
  counters: CountersState["counters"];
}

/** @deprecated Use LockInExport */
export type MasteryExport = LockInExport;

export function buildExport(state: CountersState): LockInExport {
  const normalized = normalizeCountersState(state);
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    counters: normalized.counters,
  };
}

export function exportToJson(state: CountersState): string {
  return JSON.stringify(buildExport(state), null, 2);
}

export function parseImport(raw: string): CountersState {
  const data = JSON.parse(raw) as LockInExport | CountersState;
  if ("counters" in data && Array.isArray(data.counters)) {
    return normalizeCountersState(data);
  }
  throw new Error("Invalid backup file");
}

export function downloadJson(
  state: CountersState,
  filename = "lock-in-backup.json",
): void {
  const blob = new Blob([exportToJson(state)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
