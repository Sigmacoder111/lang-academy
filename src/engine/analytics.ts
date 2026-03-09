import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { XPState } from "../types/tasks";
import type { ActivityEntry, DailyXP, NodeMasteryState } from "../types/analytics";
import { isUnlocked } from "./mastery";

const ACTIVITY_KEY = "lang-academy-activity";
const XP_HISTORY_KEY = "lang-academy-xp-history";

// --- Activity Log Storage ---

export function loadActivityLog(): ActivityEntry[] {
  const raw = localStorage.getItem(ACTIVITY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ActivityEntry[];
  } catch {
    return [];
  }
}

export function saveActivityEntry(entry: ActivityEntry): void {
  const log = loadActivityLog();
  log.unshift(entry);
  // Keep last 200 entries
  const trimmed = log.slice(0, 200);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(trimmed));
}

// --- XP History Storage ---

export function loadXPHistory(): DailyXP[] {
  const raw = localStorage.getItem(XP_HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as DailyXP[];
  } catch {
    return [];
  }
}

export function recordDailyXP(date: string, xp: number, tasks: number): void {
  const history = loadXPHistory();
  const existing = history.find((d) => d.date === date);
  if (existing) {
    existing.xp = xp;
    existing.tasksCompleted = tasks;
  } else {
    history.push({ date, xp, tasksCompleted: tasks });
  }
  history.sort((a, b) => b.date.localeCompare(a.date));
  const trimmed = history.slice(0, 90); // Keep 90 days
  localStorage.setItem(XP_HISTORY_KEY, JSON.stringify(trimmed));
}

// --- Node State Classification ---

export function getNodeMasteryState(
  nodeId: string,
  graph: GraphNode[],
  progress: UserProgress
): NodeMasteryState {
  const unlocked = isUnlocked(nodeId, graph, progress);
  const state = progress[nodeId];

  if (!unlocked) return "locked";
  if (!state) return "unlocked";

  if (state.mastery >= 0.8) {
    if (state.nextReview < Date.now()) return "needs_review";
    return "mastered";
  }
  return "in_progress";
}

// --- Completion Estimation ---

const ESTIMATED_XP_PER_TOPIC = 20;

export function estimateCompletion(
  graph: GraphNode[],
  progress: UserProgress,
  xpState: XPState
): { estimatedDate: Date | null; daysRemaining: number; dailyPace: number } {
  const mastered = graph.filter(
    (n) => progress[n.id] && progress[n.id].mastery >= 0.8
  ).length;
  const remaining = graph.length - mastered;

  if (remaining === 0) {
    return { estimatedDate: new Date(), daysRemaining: 0, dailyPace: 0 };
  }

  const history = loadXPHistory();
  let dailyPace: number;

  if (history.length >= 3) {
    const recentDays = history.slice(0, 14);
    const totalXP = recentDays.reduce((sum, d) => sum + d.xp, 0);
    dailyPace = totalXP / recentDays.length;
  } else if (xpState.totalXP > 0 && xpState.todayXP > 0) {
    dailyPace = xpState.todayXP;
  } else {
    dailyPace = xpState.dailyGoal;
  }

  if (dailyPace <= 0) dailyPace = xpState.dailyGoal;

  const remainingXP = remaining * ESTIMATED_XP_PER_TOPIC;
  const daysRemaining = Math.ceil(remainingXP / dailyPace);
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + daysRemaining);

  return { estimatedDate, daysRemaining, dailyPace };
}

// --- XP needed to finish by a target date ---

export function xpPaceForTarget(
  graph: GraphNode[],
  progress: UserProgress,
  targetDate: Date
): number {
  const mastered = graph.filter(
    (n) => progress[n.id] && progress[n.id].mastery >= 0.8
  ).length;
  const remaining = graph.length - mastered;
  const remainingXP = remaining * ESTIMATED_XP_PER_TOPIC;

  const now = new Date();
  const daysUntilTarget = Math.max(
    1,
    Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  return Math.ceil(remainingXP / daysUntilTarget);
}

// --- Graph Layer Helpers ---

export type LayerInfo = {
  id: string;
  label: string;
  nodes: GraphNode[];
};

export function getGraphLayers(graph: GraphNode[]): LayerInfo[] {
  const radicals = graph.filter((n) => n.type === "radical");
  const characters = graph.filter((n) => n.type === "character");
  const words = graph.filter((n) => n.type === "word");

  const layers: LayerInfo[] = [];
  if (radicals.length > 0) layers.push({ id: "radical", label: "Radicals", nodes: radicals });
  if (characters.length > 0) layers.push({ id: "character", label: "Characters", nodes: characters });
  if (words.length > 0) layers.push({ id: "word", label: "Words", nodes: words });
  return layers;
}

export function getHSKLayers(graph: GraphNode[]): LayerInfo[] {
  const hskGroups = new Map<number, GraphNode[]>();
  const noLevel: GraphNode[] = [];

  for (const node of graph) {
    const level = node.hskLevel;
    if (level != null) {
      const group = hskGroups.get(level);
      if (group) group.push(node);
      else hskGroups.set(level, [node]);
    } else {
      noLevel.push(node);
    }
  }

  const layers: LayerInfo[] = [];
  const sortedLevels = [...hskGroups.keys()].sort((a, b) => a - b);
  for (const level of sortedLevels) {
    layers.push({
      id: `hsk${level}`,
      label: `HSK ${level}`,
      nodes: hskGroups.get(level)!,
    });
  }
  if (noLevel.length > 0) {
    layers.push({ id: "foundations", label: "Foundations", nodes: noLevel });
  }
  return layers;
}

// --- Foundational Gap Detection ---

export interface GapTopic {
  node: GraphNode;
  mastery: number;
  blockingCount: number;
  blockedNodes: string[];
}

export function findFoundationalGaps(
  graph: GraphNode[],
  progress: UserProgress
): GapTopic[] {
  const gaps: GapTopic[] = [];

  for (const node of graph) {
    const state = progress[node.id];
    const mastery = state?.mastery ?? 0;

    if (mastery >= 0.8) continue;

    // Count how many higher-level nodes depend on this one
    const blocking = graph.filter(
      (other) =>
        other.id !== node.id &&
        other.prereqs.includes(node.id) &&
        (!progress[other.id] || progress[other.id].mastery < 0.8)
    );

    if (blocking.length > 0) {
      gaps.push({
        node,
        mastery,
        blockingCount: blocking.length,
        blockedNodes: blocking.map((b) => b.id),
      });
    }
  }

  gaps.sort((a, b) => b.blockingCount - a.blockingCount);
  return gaps;
}

// --- Longest Streak Calculation ---

export function getLongestStreak(): number {
  const history = loadXPHistory();
  if (history.length === 0) return 0;

  const activeDates = new Set(
    history.filter((d) => d.xp > 0).map((d) => d.date)
  );

  if (activeDates.size === 0) return 0;

  const sorted = [...activeDates].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

// --- Date Formatting ---

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function daysAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}
