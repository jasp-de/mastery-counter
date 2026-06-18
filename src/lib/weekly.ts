export const WEEKLY_GOAL_STORAGE_KEY = "mastery-weekly-goal-hours";
export const DEFAULT_WEEKLY_GOAL_HOURS = 10;

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
