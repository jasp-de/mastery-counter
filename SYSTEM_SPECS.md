# MASTERY — System Specs

## Brand
- **MASTERY** — tagline: *10,000 hours to mastery*
- Logo: peak mark (`MasteryMark`) + uppercase wordmark
- `MASTERY_GOAL_HOURS = 10_000`

## Templates (`/templates`)
- **Mastery** (10k goal): psychotherapy, writing, instrument, programming, visual art, athletics, language, chess
- **Habits** (smaller goals): reading, stretching, meditation, walking, journaling

## Gamification
- Goal split into **10 levels** (10% of goal each)
- Level titles + track UI on dashboard & counter detail
- **Level-up dialog** → spin **Wheel of Questionable Rewards**
- Manual wheel on counter detail anytime

## Data & sync
- Guest: localStorage · Auth: SQLite per user
- **Merge dialog** on sign-in (browser / cloud / merge both)
- Save status indicator · JSON export/import
- Undo last log (quick view)

## Stats
- Weekly total on dashboard · streak + week on counter detail

## Counters
- Optional `emoji` on each counter; picker on dashboard “Add counter” + detail “Edit counter”
- Fallback: template name match → default 🎯

## Routes
- `/` dashboard
- `/quick` quick log all counters
- `/templates` mastery + habit templates
- `/counter/[id]` detail + heatmap + quick log

## Quick log
- Minutes: 15, 20, 30, 45 + custom dialog
- Hours: 1, 2, 4

## Stack
Next.js 16 · SQLite · Auth.js · PWA · Docker
