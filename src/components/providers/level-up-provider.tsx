"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { LevelUpDialog } from "@/components/gamification/level-up-dialog";
import { useCountersState } from "@/components/providers/counters-provider";
import {
  logHoursAndDetectLevelUp,
  type LevelUpEvent,
} from "@/lib/log-with-level-check";

interface LevelUpContextValue {
  logHoursWithCelebration: (
    counterId: string,
    hours: number,
    date: string,
    note?: string,
  ) => void;
}

const LevelUpContext = createContext<LevelUpContextValue | null>(null);

export function LevelUpProvider({ children }: { children: ReactNode }) {
  const { setState, mutateWithUndo } = useCountersState();
  const [queue, setQueue] = useState<LevelUpEvent[]>([]);
  const current = queue[0] ?? null;

  const enqueue = useCallback((event: LevelUpEvent) => {
    setQueue((prev) => [...prev, event]);
  }, []);

  const logHoursWithCelebration = useCallback(
    (counterId: string, hours: number, date: string, note?: string) => {
      mutateWithUndo((prev) => {
        const { state, levelUp } = logHoursAndDetectLevelUp(
          prev,
          counterId,
          hours,
          date,
          note,
        );
        if (levelUp) {
          queueMicrotask(() => enqueue(levelUp));
        }
        return state;
      });
    },
    [enqueue, mutateWithUndo],
  );

  function closeDialog() {
    setQueue((prev) => prev.slice(1));
  }

  return (
    <LevelUpContext.Provider value={{ logHoursWithCelebration }}>
      {children}
      <LevelUpDialog
        event={current}
        open={current !== null}
        onClose={closeDialog}
      />
    </LevelUpContext.Provider>
  );
}

export function useLevelUp() {
  const ctx = useContext(LevelUpContext);
  if (!ctx) {
    throw new Error("useLevelUp must be used within LevelUpProvider");
  }
  return ctx;
}
