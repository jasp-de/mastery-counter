export interface WheelPrize {
  id: string;
  label: string;
  shortLabel: string;
  emoji: string;
  color: string;
}

/** 8 segments — readable on mobile */
export const WHEEL_PRIZES: WheelPrize[] = [
  {
    id: "high-five",
    label: "One imaginary high-five",
    shortLabel: "High-five",
    emoji: "🖐️",
    color: "#f97316",
  },
  {
    id: "brag",
    label: "Permission to brag once",
    shortLabel: "Brag pass",
    emoji: "😤",
    color: "#eab308",
  },
  {
    id: "nap",
    label: "A nap you didn't earn",
    shortLabel: "Free nap",
    emoji: "😴",
    color: "#84cc16",
  },
  {
    id: "nothing",
    label: "Nothing. The wheel lied.",
    shortLabel: "Nothing",
    emoji: "🫥",
    color: "#22c55e",
  },
  {
    id: "snack",
    label: "Snack voucher (expired 1997)",
    shortLabel: "Snack '97",
    emoji: "🍫",
    color: "#06b6d4",
  },
  {
    id: "cat",
    label: "Respect from your cat",
    shortLabel: "Cat respect",
    emoji: "🐱",
    color: "#6366f1",
  },
  {
    id: "smug",
    label: "+1% smugness buff",
    shortLabel: "+1% smug",
    emoji: "😏",
    color: "#a855f7",
  },
  {
    id: "empty",
    label: "Mystery box (it's empty)",
    shortLabel: "Empty box",
    emoji: "📦",
    color: "#ec4899",
  },
];

export const WHEEL_SEGMENT_COUNT = WHEEL_PRIZES.length;
export const WHEEL_SEGMENT_ANGLE = 360 / WHEEL_SEGMENT_COUNT;

export function pickRandomPrizeIndex(): number {
  return Math.floor(Math.random() * WHEEL_PRIZES.length);
}

export function prizeAtIndex(index: number): WheelPrize {
  const normalized =
    ((index % WHEEL_PRIZES.length) + WHEEL_PRIZES.length) % WHEEL_PRIZES.length;
  return WHEEL_PRIZES[normalized];
}

/** Degrees to rotate so segment `index` center lands under the top pointer. */
export function rotationForPrizeIndex(
  index: number,
  currentRotation: number,
  extraSpins = 5,
): number {
  const center = index * WHEEL_SEGMENT_ANGLE + WHEEL_SEGMENT_ANGLE / 2;
  const jitter = (Math.random() - 0.5) * (WHEEL_SEGMENT_ANGLE * 0.35);
  const targetMod = (360 - center + jitter + 360) % 360;
  const currentMod = ((currentRotation % 360) + 360) % 360;
  let delta = targetMod - currentMod;
  if (delta <= 0) delta += 360;
  return currentRotation + extraSpins * 360 + delta;
}
