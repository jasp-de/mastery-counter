"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  prizeAtIndex,
  pickRandomPrizeIndex,
  rotationForPrizeIndex,
  WHEEL_PRIZES,
  WHEEL_SEGMENT_ANGLE,
  type WheelPrize,
} from "@/lib/rewards";
import { cn } from "@/lib/utils";

const SPIN_MS = 5000;
const FRAME = 320;
const INSET = 12;
const WHEEL = FRAME - INSET * 2;
const CX = WHEEL / 2;
const CY = WHEEL / 2;
const RIM = WHEEL / 2 - 6;
const HUB = 40;

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function wedgePath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function labelRotation(mid: number): number {
  return mid > 90 && mid < 270 ? mid + 180 : mid;
}

interface RewardWheelProps {
  onComplete?: (prize: WheelPrize) => void;
  className?: string;
}

export function RewardWheel({ onComplete, className }: RewardWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<WheelPrize | null>(null);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const rotationRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const spin = useCallback(() => {
    if (spinning) return;

    const index = pickRandomPrizeIndex();
    const prize = prizeAtIndex(index);
    const extraSpins = 4 + Math.floor(Math.random() * 3);
    const nextRotation = rotationForPrizeIndex(
      index,
      rotationRef.current,
      extraSpins,
    );

    rotationRef.current = nextRotation;
    setSpinning(true);
    setResult(null);
    setWinningIndex(index);
    setRotation(nextRotation);

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setSpinning(false);
      setResult(prize);
      onComplete?.(prize);
    }, SPIN_MS);
  }, [onComplete, spinning]);

  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      <div
        className="relative mx-auto"
        style={{ width: FRAME, height: FRAME + 24 }}
      >
        <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2" aria-hidden="true">
          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full border-2 border-background bg-primary shadow-md" />
            <div className="size-0 border-x-[12px] border-b-[20px] border-x-transparent border-b-primary drop-shadow-lg" />
          </div>
        </div>

        <div
          className={cn(
            "absolute rounded-full border-[5px] border-primary/35 bg-background shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
            spinning && "wheel-rim-spin",
          )}
          style={{ inset: 0 }}
        />

        <div
          className="absolute overflow-hidden rounded-full"
          style={{
            inset: INSET,
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.85, 0.12, 1)`
              : "none",
          }}
        >
          <svg width={WHEEL} height={WHEEL} viewBox={`0 0 ${WHEEL} ${WHEEL}`}>
            {WHEEL_PRIZES.map((prize, index) => {
              const start = index * WHEEL_SEGMENT_ANGLE;
              const end = start + WHEEL_SEGMENT_ANGLE;
              const mid = start + WHEEL_SEGMENT_ANGLE / 2;
              const emojiPos = polarToCartesian(CX, CY, RIM * 0.58, mid);
              const textRot = labelRotation(mid);
              const isWinner =
                !spinning && winningIndex === index && result !== null;

              return (
                <g key={prize.id}>
                  <path
                    d={wedgePath(CX, CY, RIM, start, end)}
                    fill={prize.color}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth={2}
                    className={cn(isWinner && "brightness-110")}
                  />
                  <g transform={`rotate(${textRot} ${emojiPos.x} ${emojiPos.y})`}>
                    <text
                      x={emojiPos.x}
                      y={emojiPos.y - 6}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={26}
                    >
                      {prize.emoji}
                    </text>
                    <text
                      x={emojiPos.x}
                      y={emojiPos.y + 16}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize={8.5}
                      fontWeight={700}
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {prize.shortLabel.toUpperCase()}
                    </text>
                  </g>
                </g>
              );
            })}
            <circle
              cx={CX}
              cy={CY}
              r={HUB + 4}
              fill="var(--background)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={2}
            />
          </svg>
        </div>

        <div
          className={cn(
            "absolute left-1/2 top-1/2 z-20 flex size-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-background bg-primary shadow-lg",
            spinning && "animate-pulse",
          )}
        >
          <span className="text-2xl leading-none">
            {spinning ? "🌀" : result ? "🎉" : "🎰"}
          </span>
        </div>
      </div>

      {!spinning && !result && (
        <Button size="lg" className="w-full max-w-sm text-base" onClick={spin}>
          Spin the wheel
        </Button>
      )}

      {spinning && (
        <p className="animate-pulse text-sm font-medium text-muted-foreground">
          Clack clack clack clack…
        </p>
      )}

      {result && (
        <div className="wheel-result-pop w-full max-w-sm rounded-xl border-2 border-primary/30 bg-gradient-to-b from-primary/10 to-background p-5 text-center shadow-lg">
          <p className="text-4xl">{result.emoji}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            You won
          </p>
          <p className="mt-1 text-lg font-semibold text-primary">{result.label}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Legally binding in zero jurisdictions.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setResult(null);
              setWinningIndex(null);
              spin();
            }}
          >
            Spin again
          </Button>
        </div>
      )}
    </div>
  );
}
