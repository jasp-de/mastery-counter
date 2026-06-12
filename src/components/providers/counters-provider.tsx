"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import {
  createDefaultState,
  loadGuestState,
  normalizeCountersState,
  saveGuestState,
  type CountersState,
} from "@/lib/training-hours";

interface CountersContextValue {
  state: CountersState;
  setState: (updater: (prev: CountersState) => CountersState) => void;
  hydrated: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
}

const CountersContext = createContext<CountersContextValue | null>(null);

export function CountersProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const [state, setStateInternal] = useState<CountersState>(createDefaultState());
  const [hydrated, setHydrated] = useState(false);
  const skipPersist = useRef(true);

  useEffect(() => {
    if (status === "loading") return;

    skipPersist.current = true;

    if (isAuthenticated) {
      fetch("/api/training-hours")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load");
          return res.json();
        })
        .then((data) => {
          setStateInternal(normalizeCountersState(data));
          setHydrated(true);
          skipPersist.current = false;
        })
        .catch(() => {
          setStateInternal(createDefaultState());
          setHydrated(true);
          skipPersist.current = false;
        });
      return;
    }

    queueMicrotask(() => {
      setStateInternal(loadGuestState());
      setHydrated(true);
      skipPersist.current = false;
    });
  }, [isAuthenticated, status]);

  const persist = useCallback(
    async (next: CountersState) => {
      const normalized = normalizeCountersState(next);
      if (isAuthenticated) {
        await fetch("/api/training-hours", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalized),
        });
      } else {
        saveGuestState(normalized);
      }
    },
    [isAuthenticated],
  );

  const setState = useCallback(
    (updater: (prev: CountersState) => CountersState) => {
      setStateInternal((prev) => normalizeCountersState(updater(prev)));
    },
    [],
  );

  useEffect(() => {
    if (!hydrated || skipPersist.current) return;
    const timer = setTimeout(() => {
      void persist(state);
    }, 400);
    return () => clearTimeout(timer);
  }, [state, hydrated, persist]);

  return (
    <CountersContext.Provider
      value={{
        state,
        setState,
        hydrated,
        isAuthenticated,
        isGuest: hydrated && !isAuthenticated,
      }}
    >
      {children}
    </CountersContext.Provider>
  );
}

export function useCountersState() {
  const ctx = useContext(CountersContext);
  if (!ctx) {
    throw new Error("useCountersState must be used within CountersProvider");
  }
  return ctx;
}
