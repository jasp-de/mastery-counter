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
- **Level-up dialog** → spin **Wheel of Questionable Rewards** (12 nonsense prizes)
- Manual wheel on counter detail anytime

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
