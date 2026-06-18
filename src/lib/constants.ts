export const APP_NAME = "MASTERY";
export const APP_EMOJI = "";
export const APP_TAGLINE = "Hour tracker";
export const APP_DESCRIPTION =
  "Track hours toward your goals. Simple counters, quick logging, weekly view.";

export const MASTERY_GOAL_HOURS = 10_000;
export const DEFAULT_GOAL_HOURS = 100;
export const GOAL_PRESETS = [
  { label: "Habit", hours: 100 },
  { label: "Deep dive", hours: 1_000 },
  { label: "Mastery", hours: MASTERY_GOAL_HOURS },
] as const;
export const DEFAULT_COUNTER_NAME = "My goal";

export const QUICK_MINUTES = [15, 20, 30, 45] as const;
export const QUICK_HOURS = [1, 2, 4] as const;

export const GUEST_STORAGE_KEY = "mastery-counters-guest";
export const LEGACY_GUEST_STORAGE_KEY = "hour-counters-guest";
export const LEGACY_GUEST_STORAGE_KEY_V3 = "hourglass-counters-guest";
export const LEGACY_GUEST_STORAGE_KEY_V2 = "hours-counter-guest";
export const LEGACY_GUEST_STORAGE_KEY_V1 = "psychotherapy-counters-guest";

export function isGoogleAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
}

export function brandTitle(): string {
  return APP_EMOJI ? `${APP_EMOJI} ${APP_NAME}` : APP_NAME;
}
