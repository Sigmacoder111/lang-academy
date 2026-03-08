import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, unlinkSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";

const CACHE_DIR = join(import.meta.dirname, "..", "cache");

export function ensureCacheDir(): void {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function cacheKey(namespace: string, input: string): string {
  const hash = createHash("sha256").update(input).digest("hex").slice(0, 16);
  return `${namespace}_${hash}`;
}

export function getCached<T>(namespace: string, input: string): T | null {
  ensureCacheDir();
  const key = cacheKey(namespace, input);
  const path = join(CACHE_DIR, `${key}.json`);
  if (existsSync(path)) {
    try {
      return JSON.parse(readFileSync(path, "utf-8")) as T;
    } catch {
      return null;
    }
  }
  return null;
}

export function setCache<T>(namespace: string, input: string, data: T): void {
  ensureCacheDir();
  const key = cacheKey(namespace, input);
  const path = join(CACHE_DIR, `${key}.json`);
  writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
}

export function clearCache(): void {
  ensureCacheDir();
  const files = readdirSync(CACHE_DIR);
  for (const file of files) {
    if (file.endsWith(".json")) {
      unlinkSync(join(CACHE_DIR, file));
    }
  }
}
