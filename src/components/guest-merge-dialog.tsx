"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatGoalHours } from "@/lib/utils";
import type { CountersState } from "@/lib/training-hours";
import { totalLoggedInState } from "@/lib/merge-state";

interface GuestMergeDialogProps {
  open: boolean;
  guest: CountersState;
  cloud: CountersState;
  onUseGuest: () => void;
  onUseCloud: () => void;
  onMerge: () => void;
}

export function GuestMergeDialog({
  open,
  guest,
  cloud,
  onUseGuest,
  onUseCloud,
  onMerge,
}: GuestMergeDialogProps) {
  const guestHours = totalLoggedInState(guest);
  const cloudHours = totalLoggedInState(cloud);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Sync your browser data?</DialogTitle>
          <DialogDescription>
            You logged hours as a guest before signing in. Choose what to keep.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 rounded-lg border bg-muted/40 p-3 text-sm">
          <p>
            <span className="font-medium">This browser:</span>{" "}
            {guest.counters.length} counter{guest.counters.length === 1 ? "" : "s"},{" "}
            {formatGoalHours(guestHours)} logged
          </p>
          <p>
            <span className="font-medium">Your account:</span>{" "}
            {cloud.counters.length} counter{cloud.counters.length === 1 ? "" : "s"},{" "}
            {formatGoalHours(cloudHours)} logged
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button className="w-full" onClick={onUseGuest}>
            Use browser data
          </Button>
          <Button className="w-full" variant="secondary" onClick={onMerge}>
            Merge both
          </Button>
          <Button className="w-full" variant="ghost" onClick={onUseCloud}>
            Keep account data only
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
