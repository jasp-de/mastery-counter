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
import { GuestMergeDialog } from "@/components/guest-merge-dialog";
import {
  hasMeaningfulGuestData,
  isLikelyEmptyCloudState,
  mergeCountersStates,
  mergeHandledKey,
} from "@/lib/merge-state";
import {
  createDefaultState,
  GUEST_STORAGE_KEY,
  loadGuestState,
  normalizeCountersState,
  saveGuestState,
  type CountersState,
} from "@/lib/training-hours";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface CountersContextValue {
  state: CountersState;
  setState: (updater: (prev: CountersState) => CountersState) => void;
  mutateWithUndo: (updater: (prev: CountersState) => CountersState) => void;
  hydrated: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  saveStatus: SaveStatus;
  undo: () => void;
  canUndo: boolean;
}

const CountersContext = createContext<CountersContextValue | null>(null);

export function CountersProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const userId = session?.user?.id ?? session?.user?.email ?? "";

  const [state, setStateInternal] = useState<CountersState>(createDefaultState());
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [canUndo, setCanUndo] = useState(false);
  const [mergePrompt, setMergePrompt] = useState<{
    guest: CountersState;
    cloud: CountersState;
  } | null>(null);

  const skipPersist = useRef(true);
  const undoSnapshot = useRef<CountersState | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setState = useCallback(
    (updater: (prev: CountersState) => CountersState) => {
      setStateInternal((prev) => normalizeCountersState(updater(prev)));
    },
    [],
  );

  const mutateWithUndo = useCallback(
    (updater: (prev: CountersState) => CountersState) => {
      setStateInternal((prev) => {
        undoSnapshot.current = prev;
        setCanUndo(true);
        return normalizeCountersState(updater(prev));
      });
    },
    [],
  );

  const undo = useCallback(() => {
    if (!undoSnapshot.current) return;
    setStateInternal(normalizeCountersState(undoSnapshot.current));
    undoSnapshot.current = null;
    setCanUndo(false);
  }, []);

  const persist = useCallback(
    async (next: CountersState) => {
      const normalized = normalizeCountersState(next);
      if (isAuthenticated) {
        setSaveStatus("saving");
        try {
          const res = await fetch("/api/training-hours", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(normalized),
          });
          if (!res.ok) throw new Error("Save failed");
          setSaveStatus("saved");
          if (saveTimer.current) clearTimeout(saveTimer.current);
          saveTimer.current = setTimeout(() => setSaveStatus("idle"), 2500);
        } catch {
          setSaveStatus("error");
        }
      } else {
        saveGuestState(normalized);
        setSaveStatus("saved");
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => setSaveStatus("idle"), 1500);
      }
    },
    [isAuthenticated],
  );

  function finishMerge(next: CountersState) {
    if (userId) {
      sessionStorage.setItem(mergeHandledKey(userId), "1");
    }
    localStorage.removeItem(GUEST_STORAGE_KEY);
    setStateInternal(normalizeCountersState(next));
    setMergePrompt(null);
    setHydrated(true);
    skipPersist.current = false;
  }

  useEffect(() => {
    if (status === "loading") return;

    skipPersist.current = true;
    undoSnapshot.current = null;

    if (!isAuthenticated || !userId) {
      queueMicrotask(() => {
        setMergePrompt(null);
        setCanUndo(false);
        setStateInternal(loadGuestState());
        setHydrated(true);
        skipPersist.current = false;
      });
      return;
    }

    const guestData = loadGuestState();
    const mergeAlreadyHandled =
      sessionStorage.getItem(mergeHandledKey(userId)) === "1";

    fetch("/api/training-hours")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        const cloud = normalizeCountersState(data);
        setCanUndo(false);
        const shouldPrompt =
          !mergeAlreadyHandled &&
          hasMeaningfulGuestData(guestData) &&
          !isLikelyEmptyCloudState(cloud);

        if (shouldPrompt) {
          setMergePrompt({ guest: guestData, cloud });
          setStateInternal(cloud);
          setHydrated(true);
          skipPersist.current = true;
          return;
        }

        if (
          !mergeAlreadyHandled &&
          hasMeaningfulGuestData(guestData) &&
          isLikelyEmptyCloudState(cloud)
        ) {
          sessionStorage.setItem(mergeHandledKey(userId), "1");
          localStorage.removeItem(GUEST_STORAGE_KEY);
          setMergePrompt(null);
          setStateInternal(guestData);
        } else {
          setMergePrompt(null);
          setStateInternal(cloud);
        }

        setHydrated(true);
        skipPersist.current = false;
      })
      .catch(() => {
        setMergePrompt(null);
        setStateInternal(createDefaultState());
        setHydrated(true);
        skipPersist.current = false;
      });
  }, [isAuthenticated, status, userId]);

  useEffect(() => {
    if (!hydrated || skipPersist.current || mergePrompt) return;
    const timer = setTimeout(() => {
      void persist(state);
    }, 400);
    return () => clearTimeout(timer);
  }, [state, hydrated, persist, mergePrompt]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  return (
    <CountersContext.Provider
      value={{
        state,
        setState,
        mutateWithUndo,
        hydrated,
        isAuthenticated,
        isGuest: hydrated && !isAuthenticated,
        saveStatus,
        undo,
        canUndo,
      }}
    >
      {children}
      {mergePrompt && (
        <GuestMergeDialog
          open
          guest={mergePrompt.guest}
          cloud={mergePrompt.cloud}
          onUseGuest={() => finishMerge(mergePrompt.guest)}
          onUseCloud={() => finishMerge(mergePrompt.cloud)}
          onMerge={() =>
            finishMerge(
              mergeCountersStates(mergePrompt.cloud, mergePrompt.guest),
            )
          }
        />
      )}
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
