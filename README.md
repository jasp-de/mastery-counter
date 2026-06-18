# MASTERY

A small hour tracker. Multiple counters, quick logging, weekly view — no fluff.

## Features

- **Counters** with emoji, goals, and progress
- **All time / This week** toggle on the dashboard
- **Templates** for mastery paths and daily habits
- Minute quick-add (15m, 20m, 30m, 45m) + custom duration · `/quick` view
- Streaks, monthly heatmaps
- Guest mode or Google sync with **merge on sign-in**
- Export / import JSON backups
- Installable PWA · dark mode

## Quick start

```bash
npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Google sign-in (optional)

Copy `.env.example` → `.env.local`:

```env
AUTH_SECRET=          # openssl rand -base64 32
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AUTH_URL=http://localhost:3000
```

Redirect URI in Google Cloud: `http://localhost:3000/api/auth/callback/google`

Guest mode works without any of this.

## Production

```bash
docker compose up -d --build
```

SQLite data persists in the Docker volume at `/app/data`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build + PWA |
| `npm start` | Run production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
