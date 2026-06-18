# MASTERY — System Specs

## Brand
- **MASTERY** — tagline: *Hour tracker*
- Logo: peak mark (`MasteryMark`) + uppercase wordmark
- `MASTERY_GOAL_HOURS = 10_000` (template preset only)

## Templates (`/templates`)
- **Mastery** (10k goal): psychotherapy, writing, instrument, programming, visual art, athletics, language, chess
- **Habits** (smaller goals): reading, stretching, meditation, walking, journaling

## Dashboard view modes
- **All time** — progress vs each counter’s goal
- **This week** — hours logged this calendar week vs editable weekly target (localStorage)
- Toggle lives in the **Counters** card header (no separate route)

## Data & sync
- Guest: localStorage · Auth: SQLite per user
- **Merge dialog** on sign-in (browser / cloud / merge both)
- Save status indicator · JSON export/import
- Undo last log (quick view)

## Stats
- Weekly hours on dashboard (week mode) · streak on counter detail · monthly heatmap

## Counters
- Optional `emoji` on each counter; picker on dashboard “Add counter” + detail “Edit counter”
- Fallback: template name match → default 🎯

## Routes
- `/` dashboard (all-time + week toggle)
- `/quick` quick log all counters
- `/templates` mastery + habit templates
- `/counter/[id]` detail + heatmap + quick log

## Quick log
- Minutes: 15, 20, 30, 45 + custom dialog
- Hours: 1, 2, 4

## Stack
Next.js 16 · SQLite · Auth.js · PWA · Docker
