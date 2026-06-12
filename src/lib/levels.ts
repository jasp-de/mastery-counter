import {
  progressPercent,
  totalLoggedHours,
  type Counter,
} from "@/lib/training-hours";
import { formatGoalHours } from "@/lib/utils";

export const MAX_LEVEL = 10;

export const LEVEL_TITLES = [
  "Curious Onlooker",
  "Part-Time Try-Hard",
  "Serious Hobbyist",
  "Dedicated Grinder",
  "Consistency Gremlin",
  "Flow State Enjoyer",
  "Almost Intimidating",
  "Unreasonably Committed",
  "Final Boss Energy",
  "MASTERY UNLOCKED",
] as const;

export function levelFromProgress(percent: number): number {
  if (percent <= 0) return 1;
  if (percent >= 100) return MAX_LEVEL;
  return Math.min(MAX_LEVEL, Math.floor(percent / 10) + 1);
}

export function levelForCounter(counter: Counter): number {
  return levelFromProgress(
    progressPercent(counter.goalHours, counter.entries),
  );
}

export function levelTitle(level: number): string {
  const index = Math.min(MAX_LEVEL, Math.max(1, level)) - 1;
  return LEVEL_TITLES[index];
}

export interface LevelSnapshot {
  level: number;
  title: string;
  progressInLevel: number;
  hoursInLevel: number;
  hoursPerLevel: number;
  hoursToNextLevel: number;
  isMaxLevel: boolean;
}

export function levelSnapshot(counter: Counter): LevelSnapshot {
  const logged = totalLoggedHours(counter.entries);
  const level = levelForCounter(counter);
  const hoursPerLevel = counter.goalHours / MAX_LEVEL;
  const hoursAtLevelStart = (level - 1) * hoursPerLevel;
  const hoursInLevel = Math.max(0, logged - hoursAtLevelStart);
  const progressInLevel =
    level >= MAX_LEVEL
      ? 100
      : Math.min(100, (hoursInLevel / hoursPerLevel) * 100);
  const hoursToNextLevel =
    level >= MAX_LEVEL
      ? 0
      : Math.max(0, level * hoursPerLevel - logged);

  return {
    level,
    title: levelTitle(level),
    progressInLevel,
    hoursInLevel,
    hoursPerLevel,
    hoursToNextLevel,
    isMaxLevel: level >= MAX_LEVEL && logged >= counter.goalHours,
  };
}

export function formatHoursToNextLevel(hours: number): string {
  if (hours <= 0) return "0h";
  return formatGoalHours(hours);
}
