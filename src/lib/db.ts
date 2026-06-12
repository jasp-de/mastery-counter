import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import {
  createDefaultState,
  normalizeCountersState,
  type CountersState,
} from "@/lib/training-hours";

const dataDir = path.join(process.cwd(), "data");

function getDb() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = new Database(path.join(dataDir, "training.db"));
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_training (
      user_id TEXT PRIMARY KEY,
      goal_hours INTEGER NOT NULL DEFAULT 3000,
      entries_json TEXT NOT NULL DEFAULT '[]',
      counters_json TEXT,
      updated_at TEXT NOT NULL
    )
  `);

  const columns = db
    .prepare("PRAGMA table_info(user_training)")
    .all() as { name: string }[];
  const hasCountersJson = columns.some((c) => c.name === "counters_json");
  if (!hasCountersJson) {
    db.exec(`ALTER TABLE user_training ADD COLUMN counters_json TEXT`);
  }

  return db;
}

export function getUserCounters(userId: string): CountersState {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT goal_hours, entries_json, counters_json FROM user_training WHERE user_id = ?",
    )
    .get(userId) as
    | {
        goal_hours: number;
        entries_json: string;
        counters_json: string | null;
      }
    | undefined;

  db.close();

  if (!row) return createDefaultState();

  if (row.counters_json) {
    try {
      return normalizeCountersState(JSON.parse(row.counters_json));
    } catch {
      return createDefaultState();
    }
  }

  try {
    const legacy = {
      goalHours: row.goal_hours,
      entries: JSON.parse(row.entries_json),
    };
    return normalizeCountersState(legacy);
  } catch {
    return createDefaultState();
  }
}

export function saveUserCounters(userId: string, state: CountersState): void {
  const normalized = normalizeCountersState(state);
  const db = getDb();
  db.prepare(
    `INSERT INTO user_training (user_id, goal_hours, entries_json, counters_json, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       counters_json = excluded.counters_json,
       updated_at = excluded.updated_at`,
  ).run(
    userId,
    normalized.counters[0]?.goalHours ?? 3000,
    JSON.stringify(normalized.counters[0]?.entries ?? []),
    JSON.stringify(normalized),
    new Date().toISOString(),
  );
  db.close();
}
