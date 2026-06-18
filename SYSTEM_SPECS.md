# Lock In — System Specs

## Brand voice
- Tagline: *Clock the hours. Lock in the work.*
- Tone: dry, self-aware, "lock in" as verb — not corporate motivational

## Goals & presets
- **Default total goal:** 25h · presets: 10h warm-up / 25h lock-in / 100h arc
- **Default weekly goal:** 2h · presets: ease in / steady / locked (1–4h/wk)
- **Quick log minutes:** 10, 15, 20, 30 · **hours row:** 1, 2
- `MASTERY_GOAL_HOURS = 10_000` — legacy constant only, not used as a default

## Templates (`/templates`)
- **Deep practice** — per-skill goals (15–200h) + weekly targets (1–4h/wk)
- **Daily habits** — smaller goals (5–12h) + ~1h/wk
- Badge shows `{total goal} · {weekly}/wk`; descriptions explain the horizon

## Dashboard view modes
- **All time** — progress vs each counter’s total goal
- **This week** — hours logged this week vs each counter’s **weekly goal**
- Toggle in the **Counters** card header
- **Quick log** — one editable row per counter; **Notes on quick log** per goal in ⋯ menu
- Counter order persisted in state (drag handle or Move up/down in ⋯ menu)

## Data & sync
- Guest: localStorage · Auth: SQLite per user
- **Merge dialog** on sign-in (browser / cloud / merge both)
- Save status indicator · JSON export/import
- Undo last log (quick view)

## Stats
- Weekly hours on dashboard (week mode) · streak on counter detail · monthly heatmap

## Counters
- Optional `emoji` on each counter; picker on dashboard “Add counter” + detail “Edit counter”
- Fallback: template name match → default 🎯 + template `suggestedMinutes` for quick log

## Routes
- `/` dashboard (all-time + week toggle)
- `/quick` quick log all counters
- `/templates` deep practice + habit templates
- `/counter/[id]` detail + heatmap + quick log

## Stack
Next.js 16 · SQLite · Auth.js · PWA · Docker
