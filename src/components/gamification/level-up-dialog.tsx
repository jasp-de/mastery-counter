"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { LevelBadge } from "@/components/gamification/level-badge";
import { RewardWheel } from "@/components/gamification/reward-wheel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { levelTitle, MAX_LEVEL } from "@/lib/levels";
import type { LevelUpEvent } from "@/lib/log-with-level-check";
import type { WheelPrize } from "@/lib/rewards";
import { cn } from "@/lib/utils";

interface LevelUpDialogProps {
  event: LevelUpEvent | null;
  open: boolean;
  onClose: () => void;
}

export function LevelUpDialog({ event, open, onClose }: LevelUpDialogProps) {
  if (!event) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="max-w-lg overflow-hidden border-primary/30 p-0">
        <LevelUpDialogBody
          key={`${event.counterId}-${event.newLevel}`}
          event={event}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}

function LevelUpDialogBody({
  event,
  onClose,
}: {
  event: LevelUpEvent;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"celebrate" | "wheel" | "done">(
    "celebrate",
  );
  const [prize, setPrize] = useState<WheelPrize | null>(null);

  const isMastery = event.newLevel >= MAX_LEVEL;

  function handlePrize(won: WheelPrize) {
    setPrize(won);
    setPhase("done");
  }

  return (
    <>
      <div className="level-up-confetti pointer-events-none absolute inset-0 overflow-hidden" />

      <div className="relative space-y-4 p-6">
        {phase === "celebrate" && (
          <>
            <DialogHeader className="text-center sm:text-center">
              <div className="mx-auto mb-2 flex size-16 animate-bounce items-center justify-center rounded-2xl bg-primary/10 text-4xl">
                {event.counterEmoji}
              </div>
              <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
                <Sparkles className="size-6 text-primary" />
                Level up!
              </DialogTitle>
              <DialogDescription className="text-base">
                {event.counterName} reached level {event.newLevel}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center gap-3 rounded-xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent p-5 text-center">
              <LevelBadge level={event.newLevel} size="lg" />
              <p
                className="text-xl font-semibold"
                style={{ fontFamily: "var(--font-display), serif" }}
              >
                {levelTitle(event.newLevel)}
              </p>
              {isMastery ? (
                <p className="text-sm text-muted-foreground">
                  You hit the goal. The journey continues, but the badge is
                  yours.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {MAX_LEVEL - event.newLevel} levels left on this counter.
                  Keep going.
                </p>
              )}
            </div>

            <Button size="lg" className="w-full" onClick={() => setPhase("wheel")}>
              Spin the nonsense wheel!
            </Button>
          </>
        )}

        {phase === "wheel" && (
          <>
            <DialogHeader className="text-center sm:text-center">
              <DialogTitle>Wheel of questionable rewards</DialogTitle>
              <DialogDescription>
                Eight nonsense prizes. One pointer. Zero refunds.
              </DialogDescription>
            </DialogHeader>
            <RewardWheel
              onComplete={handlePrize}
            />
          </>
        )}

        {phase === "done" && prize && (
          <>
            <DialogHeader className="text-center sm:text-center">
              <DialogTitle className="text-xl">Claim your nonsense</DialogTitle>
              <DialogDescription>
                Level {event.newLevel}: {levelTitle(event.newLevel)}
              </DialogDescription>
            </DialogHeader>

            <div
              className={cn(
                "rounded-xl border border-primary/25 bg-primary/5 p-6 text-center",
                "animate-in zoom-in-95 duration-300",
              )}
            >
              <p className="text-5xl">{prize.emoji}</p>
              <p className="mt-3 text-lg font-semibold">{prize.label}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Redeemable nowhere. Cherish forever.
              </p>
            </div>

            <Button size="lg" className="w-full" onClick={onClose}>
              Back to grinding
            </Button>
          </>
        )}
      </div>
    </>
  );
}
