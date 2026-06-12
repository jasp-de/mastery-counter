import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function minutesToHours(minutes: number): number {
  return minutes / 60;
}

export function formatDuration(hours: number): string {
  if (hours <= 0) return "0m";
  const totalMinutes = Math.round(hours * 60);
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** @deprecated Use formatDuration */
export function formatHours(hours: number): string {
  return formatDuration(hours);
}

export function formatGoalHours(hours: number): string {
  if (hours >= 1000) return `${hours.toLocaleString()}h`;
  return formatDuration(hours);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function todayISO(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

export function formatMinutesLabel(minutes: number): string {
  return `${minutes}m`;
}
