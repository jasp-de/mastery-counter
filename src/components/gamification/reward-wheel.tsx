"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  pickRandomPrizeIndex,
  prizeAtIndex,
  WHEEL_PRIZES,
  type WheelPrize,
} from "@/lib/rewards";
import { cn } from "@/lib/utils";

const SEGMENT_COUNT = WHEEL_PRIZES.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;
const SPIN_MS = 4200;

interface RewardWheelProps {
  onComplete?: (prize: WheelPrize) => void;
  /** Start spinning as soon as the wheel mounts */
  spinOnMount?: boolean;
  className?: string;
}

export function RewardWheel({
  onComplete,
  spinOnMount = false,
  className,
}: RewardWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<WheelPrize | null>(null);
  const rotationRef = useRef(0);
  const mountedSpin = useRef(false);

  const gradient = useMemo(
    () =>
      WHEEL_PRIZES.map(
        (prize, index) =>
          `${prize.color} ${index * SEGMENT_ANGLE}deg ${(index + 1) * SEGMENT_ANGLE}deg`,
      ).join(", "),
    [],
  );

  const spin = useCallback(() => {
    if (spinning) return;

    const index = pickRandomPrizeIndex();
    const prize = prizeAtIndex(index);
    const spins = 5 + Math.floor(Math.random() * 4);
    const centerOffset = index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const nextRotation = rotationRef.current + spins * 360 + (360 - centerOffset);

    rotationRef.current = nextRotation;
    setSpinning(true);
    setResult(null);
    setRotation(nextRotation);

    window.setTimeout(() => {
      setSpinning(false);
      setResult(prize);
      onComplete?.(prize);
    }, SPIN_MS);
  }, [onComplete, spinning]);

  useEffect(() => {
    if (!spinOnMount || mountedSpin.current) return;
    mountedSpin.current = true;
    spin();
  }, [spinOnMount, spin]);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative mx-auto size-64 sm:size-72">
        <div
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1 drop-shadow-md"
          aria-hidden="true"
        >
          <div className="size-0 border-x-[14px] border-b-[22px] border-x-transparent border-b-primary" />
        </div>

        <div
          className={cn(
            "absolute inset-0 rounded-full border-4 border-primary/30 shadow-xl transition-transform ease-[cubic-bezier(0.15,0.85,0.15,1)]",
            spinning && "will-change-transform",
          )}
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: spinning ? `${SPIN_MS}ms` : "0ms",
            background: `conic-gradient(${gradient})`,
          }}
        />

        <div className="absolute left-1/2 top-1/2 z-20 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-background bg-primary text-xl shadow-lg">
          {spinning ? "🌀" : result ? "🎉" : "🎰"}
        </div>
      </div>

      {!spinOnMount && !result && (
        <Button
          size="lg"
          className="w-full max-w-xs"
          disabled={spinning}
          onClick={spin}
        >
          {spinning ? "Spinning…" : "Spin for nonsense"}
        </Button>
      )}

      {result && (
        <div className="animate-in fade-in zoom-in-95 w-full max-w-xs rounded-xl border border-primary/20 bg-primary/5 p-4 text-center duration-300">
          <p className="text-3xl">{result.emoji}</p>
          <p className="mt-2 text-sm font-semibold">You won:</p>
          <p className="text-base font-medium text-primary">{result.label}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            (Legally binding in zero jurisdictions)
          </p>
        </div>
      )}
    </div>
  );
}
