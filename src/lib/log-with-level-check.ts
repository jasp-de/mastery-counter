import { emojiForCounter } from "@/lib/counter-emoji";
import { levelForCounter } from "@/lib/levels";
import {
  getCounter,
  logHoursToCounter,
  type CountersState,
} from "@/lib/training-hours";

export interface LevelUpEvent {
  counterId: string;
  counterName: string;
  counterEmoji: string;
  previousLevel: number;
  newLevel: number;
}

export function logHoursAndDetectLevelUp(
  state: CountersState,
  counterId: string,
  hours: number,
  date: string,
  note?: string,
): { state: CountersState; levelUp: LevelUpEvent | null } {
  const counter = getCounter(state, counterId);
  if (!counter) return { state, levelUp: null };

  const previousLevel = levelForCounter(counter);
  const nextState = logHoursToCounter(state, counterId, hours, date, note);
  const nextCounter = getCounter(nextState, counterId);
  if (!nextCounter) return { state: nextState, levelUp: null };

  const newLevel = levelForCounter(nextCounter);
  if (newLevel <= previousLevel) {
    return { state: nextState, levelUp: null };
  }

  return {
    state: nextState,
    levelUp: {
      counterId,
      counterName: nextCounter.name,
      counterEmoji: emojiForCounter(nextCounter),
      previousLevel,
      newLevel,
    },
  };
}
