import { DEFAULT_WEEKLY_GOAL_HOURS } from "@/lib/constants";
import type { Counter } from "@/lib/training-hours";

export function counterWeeklyGoal(counter: Counter): number {
  const goal = counter.weeklyGoalHours;
  return goal && goal > 0 ? goal : DEFAULT_WEEKLY_GOAL_HOURS;
}

export function weekProgressPercent(logged: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, (logged / goal) * 100);
}
