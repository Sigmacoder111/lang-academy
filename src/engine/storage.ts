import type { UserProgress } from "../types/state";
import { makeDefaultNodeState } from "../types/state";

const STORAGE_KEY = "lang-academy-progress";
const SCHEMA_VERSION_KEY = "lang-academy-schema-version";
const CURRENT_SCHEMA_VERSION = 2;

/**
 * Check if stored data uses the old schema (v1) and needs migration.
 * Old schema NodeState had: mastery, interval, nextReview, totalReviews, lastReviewedAt
 * New schema (v2) adds: automaticity, consecutiveCorrect, implicitReviewCredit
 */
function getStoredSchemaVersion(): number {
  const raw = localStorage.getItem(SCHEMA_VERSION_KEY);
  if (!raw) return 1;
  try {
    return parseInt(raw, 10) || 1;
  } catch {
    return 1;
  }
}

function setSchemaVersion(version: number): void {
  localStorage.setItem(SCHEMA_VERSION_KEY, String(version));
}

/**
 * Migrate v1 progress data to v2 by adding default values for new fields.
 * If migration isn't possible, clears data and returns empty progress.
 */
function migrateV1ToV2(rawProgress: Record<string, unknown>): UserProgress {
  const migrated: UserProgress = {};

  for (const [nodeId, rawState] of Object.entries(rawProgress)) {
    if (typeof rawState !== "object" || rawState === null) continue;

    const s = rawState as Record<string, unknown>;
    migrated[nodeId] = makeDefaultNodeState({
      mastery: typeof s.mastery === "number" ? s.mastery : 0,
      interval: typeof s.interval === "number" ? s.interval : 60,
      nextReview: typeof s.nextReview === "number" ? s.nextReview : 0,
      totalReviews: typeof s.totalReviews === "number" ? s.totalReviews : 0,
      lastReviewedAt: typeof s.lastReviewedAt === "number" ? s.lastReviewedAt : 0,
      automaticity: 0,
      consecutiveCorrect: 0,
      implicitReviewCredit: 0,
    });
  }

  return migrated;
}

export function saveProgress(progress: UserProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  setSchemaVersion(CURRENT_SCHEMA_VERSION);
}

export function loadProgress(): UserProgress {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    setSchemaVersion(CURRENT_SCHEMA_VERSION);
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const version = getStoredSchemaVersion();

    if (version < CURRENT_SCHEMA_VERSION) {
      const migrated = migrateV1ToV2(parsed);
      saveProgress(migrated);
      return migrated;
    }

    return parsed as UserProgress;
  } catch {
    return {};
  }
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SCHEMA_VERSION_KEY);
}

export function getSchemaVersion(): number {
  return getStoredSchemaVersion();
}
