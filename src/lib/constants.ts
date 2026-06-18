export const APP_NAME = "Lock In";
export const APP_EMOJI = "";
export const APP_TAGLINE = "Clock the hours. Lock in the work.";
export const APP_DESCRIPTION =
  "An hour tracker for the thing you keep saying you'll do — until you actually lock in.";

/** Optional stretch target — not used as a default anywhere */
export const MASTERY_GOAL_HOURS = 10_000;
export const DEFAULT_GOAL_HOURS = 25;
export const GOAL_PRESETS = [
  { label: "10h warm-up", hours: 10 },
  { label: "25h lock-in", hours: 25 },
  { label: "100h arc", hours: 100 },
] as const;
export const DEFAULT_COUNTER_NAME = "My lock-in";

export const DEFAULT_WEEKLY_GOAL_HOURS = 2;
export const WEEKLY_GOAL_PRESETS = [
  { label: "1h/wk — ease in", hours: 1 },
  { label: "2h/wk — steady", hours: 2 },
  { label: "4h/wk — locked", hours: 4 },
] as const;

export const QUICK_MINUTES = [10, 15, 20, 30] as const;
export const QUICK_HOURS = [1, 2] as const;
export const QUICK_LOG_SLOT_COUNT = 4;

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
