export interface APTheme {
  key: string;
  english: string;
  chinese: string;
}

export const AP_THEMES: APTheme[] = [
  { key: "families_communities", english: "Families in Different Societies", chinese: "家庭" },
  { key: "personal_public_identities", english: "The Influence of Language and Culture", chinese: "语言文化" },
  { key: "beauty_aesthetics", english: "Influences of Beauty and Art", chinese: "美与艺术" },
  { key: "science_technology", english: "How Science and Technology Affect Our Lives", chinese: "科技" },
  { key: "contemporary_life", english: "Factors That Impact the Quality of Life", chinese: "生活质量" },
  { key: "global_challenges", english: "Environmental, Political, and Societal Challenges", chinese: "社会挑战" },
];

export const AP_THEME_KEYS = AP_THEMES.map((t) => t.key);

export type ThemeWeights = Record<string, number>;

export function defaultThemeWeights(): ThemeWeights {
  const weights: ThemeWeights = {};
  for (const theme of AP_THEMES) {
    weights[theme.key] = 1;
  }
  return weights;
}

export function autoBalanceWeights(
  themeMasteries: Record<string, number>
): ThemeWeights {
  const weights: ThemeWeights = {};
  for (const theme of AP_THEMES) {
    const mastery = themeMasteries[theme.key] ?? 0;
    weights[theme.key] = Math.max(0.2, 2 - mastery * 2);
  }
  return weights;
}

const THEME_WEIGHTS_KEY = "lang-academy-theme-weights";
const THEME_AUTO_BALANCE_KEY = "lang-academy-theme-auto-balance";
const AP_EXAM_DATE_KEY = "lang-academy-ap-exam-date";

export function loadThemeWeights(): ThemeWeights {
  const raw = localStorage.getItem(THEME_WEIGHTS_KEY);
  if (!raw) return defaultThemeWeights();
  try {
    return JSON.parse(raw) as ThemeWeights;
  } catch {
    return defaultThemeWeights();
  }
}

export function saveThemeWeights(weights: ThemeWeights): void {
  localStorage.setItem(THEME_WEIGHTS_KEY, JSON.stringify(weights));
}

export function loadAutoBalance(): boolean {
  return localStorage.getItem(THEME_AUTO_BALANCE_KEY) === "true";
}

export function saveAutoBalance(enabled: boolean): void {
  localStorage.setItem(THEME_AUTO_BALANCE_KEY, String(enabled));
}

export function loadAPExamDate(): string {
  return localStorage.getItem(AP_EXAM_DATE_KEY) || "2026-05-08";
}

export function saveAPExamDate(date: string): void {
  localStorage.setItem(AP_EXAM_DATE_KEY, date);
}
