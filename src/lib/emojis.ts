export const DEFAULT_COUNTER_EMOJI = "🎯";

/** Curated emojis for the picker grid */
export const PICKER_EMOJIS = [
  "🎯",
  "📖",
  "✍️",
  "🎻",
  "🎹",
  "🎸",
  "💻",
  "🎨",
  "🏃",
  "🧘",
  "🧠",
  "🛋️",
  "💬",
  "🌍",
  "♟️",
  "📓",
  "🚶",
  "🏋️",
  "⚽",
  "🎵",
  "🎬",
  "📸",
  "🍳",
  "☕",
  "🔬",
  "📚",
  "💡",
  "🚀",
  "⭐",
  "🔥",
  "💪",
  "❤️",
] as const;

export function isSingleEmoji(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return [...new Intl.Segmenter().segment(trimmed)].length === 1;
}

export function normalizeEmoji(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return DEFAULT_COUNTER_EMOJI;
  if (isSingleEmoji(trimmed)) return trimmed;
  return DEFAULT_COUNTER_EMOJI;
}
