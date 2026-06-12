import { ACTIVITY_TEMPLATES } from "@/lib/templates";
import { DEFAULT_COUNTER_EMOJI } from "@/lib/emojis";
import type { Counter } from "@/lib/training-hours";

export function emojiForCounter(counter: Counter): string {
  if (counter.emoji) return counter.emoji;
  const match = ACTIVITY_TEMPLATES.find(
    (t) => t.name.toLowerCase() === counter.name.toLowerCase(),
  );
  return match?.emoji ?? DEFAULT_COUNTER_EMOJI;
}
