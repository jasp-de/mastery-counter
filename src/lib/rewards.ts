export interface WheelPrize {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export const WHEEL_PRIZES: WheelPrize[] = [
  { id: "high-five", label: "One imaginary high-five", emoji: "🖐️", color: "#f97316" },
  { id: "brag", label: "Permission to brag once", emoji: "😤", color: "#eab308" },
  { id: "nap", label: "A nap you didn't earn", emoji: "😴", color: "#84cc16" },
  { id: "nothing", label: "Nothing. The wheel lied.", emoji: "🫥", color: "#22c55e" },
  { id: "confetti", label: "Confetti (visual only)", emoji: "🎊", color: "#14b8a6" },
  { id: "placebo", label: "Extra motivation (placebo)", emoji: "💊", color: "#06b6d4" },
  { id: "snack", label: "Snack voucher (expired 1997)", emoji: "🍫", color: "#3b82f6" },
  { id: "cat", label: "Respect from your cat", emoji: "🐱", color: "#6366f1" },
  { id: "smug", label: "+1% smugness buff", emoji: "😏", color: "#8b5cf6" },
  { id: "guilt", label: "Skip tomorrow's guilt", emoji: "🛡️", color: "#a855f7" },
  { id: "empty", label: "Mystery box (it's empty)", emoji: "📦", color: "#d946ef" },
  { id: "spin", label: "You spin me right round", emoji: "🎡", color: "#ec4899" },
];

export function pickRandomPrizeIndex(): number {
  return Math.floor(Math.random() * WHEEL_PRIZES.length);
}

export function prizeAtIndex(index: number): WheelPrize {
  const normalized =
    ((index % WHEEL_PRIZES.length) + WHEEL_PRIZES.length) % WHEEL_PRIZES.length;
  return WHEEL_PRIZES[normalized];
}
