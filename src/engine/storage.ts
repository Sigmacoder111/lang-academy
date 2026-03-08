import type { UserProgress } from "../types/state";

const STORAGE_KEY = "lang-academy-progress";

export function saveProgress(progress: UserProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function loadProgress(): UserProgress {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as UserProgress;
  } catch {
    return {};
  }
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
