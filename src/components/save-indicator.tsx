"use client";

import { Cloud, CloudOff, Loader2 } from "lucide-react";
import type { SaveStatus } from "@/components/providers/counters-provider";
import { cn } from "@/lib/utils";

interface SaveIndicatorProps {
  status: SaveStatus;
  isGuest: boolean;
  className?: string;
}

export function SaveIndicator({ status, isGuest, className }: SaveIndicatorProps) {
  if (isGuest) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
          className,
        )}
        title="Saved in this browser"
      >
        <CloudOff className="size-3.5" />
        Local
      </span>
    );
  }

  if (status === "saving") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
        <Loader2 className="size-3.5 animate-spin" />
        Saving…
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs text-destructive", className)}>
        <CloudOff className="size-3.5" />
        Save failed
      </span>
    );
  }

  if (status === "saved") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs text-primary", className)}>
        <Cloud className="size-3.5" />
        Saved
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <Cloud className="size-3.5" />
      Synced
    </span>
  );
}
