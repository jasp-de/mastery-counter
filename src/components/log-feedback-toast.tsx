"use client";

import { useEffect, useState } from "react";
import { Check, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogFeedbackToastProps {
  message: string | null;
  canUndo: boolean;
  onUndo: () => void;
  onDismiss: () => void;
}

export function LogFeedbackToast({
  message,
  canUndo,
  onUndo,
  onDismiss,
}: LogFeedbackToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="fixed inset-x-4 bottom-6 z-50 mx-auto flex max-w-sm items-center gap-2 rounded-lg border bg-card px-4 py-3 shadow-lg">
      <Check className="size-4 shrink-0 text-primary" />
      <p className="flex-1 text-sm">{message}</p>
      {canUndo && (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 shrink-0 gap-1"
          onClick={() => {
            onUndo();
            onDismiss();
          }}
        >
          <Undo2 className="size-3.5" />
          Undo
        </Button>
      )}
    </div>
  );
}

interface UseLogFeedbackOptions {
  canUndo: boolean;
  undo: () => void;
}

export function useLogFeedback({ canUndo, undo }: UseLogFeedbackOptions) {
  const [message, setMessage] = useState<string | null>(null);

  function showFeedback(text: string) {
    setMessage(text);
  }

  function dismiss() {
    setMessage(null);
  }

  const toast = (
    <LogFeedbackToast
      message={message}
      canUndo={canUndo}
      onUndo={undo}
      onDismiss={dismiss}
    />
  );

  return { showFeedback, toast };
}
