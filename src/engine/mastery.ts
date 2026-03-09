import type { GraphNode } from "../types/graph";
import type { NodeState, UserProgress } from "../types/state";
import { makeDefaultNodeState } from "../types/state";

const MAX_INTERVAL_SECONDS = 30 * 24 * 60 * 60; // 30 days
const AUTOMATICITY_WEIGHT = 0.3;
const MASTERY_EMA_ALPHA = 0.2;

export function isUnlocked(
  nodeId: string,
  graph: GraphNode[],
  progress: UserProgress
): boolean {
  const node = graph.find((n) => n.id === nodeId);
  if (!node) return false;

  if (node.prereqs.length === 0) return true;

  return node.prereqs.every((prereqId) => {
    const prereqState = progress[prereqId];
    return prereqState !== undefined && prereqState.mastery >= 0.8;
  });
}

/**
 * Update mastery based on correctness, solve time, and expected time.
 * Computes automaticity as ratio of expected time to actual solve time.
 * Automaticity > 1 means student solved faster than expected.
 */
export function updateMastery(
  nodeState: NodeState,
  correct: boolean,
  solveTimeSeconds?: number,
  expectedTimeSeconds?: number
): NodeState {
  const now = Date.now();

  const rawMastery = nodeState.mastery * (1 - MASTERY_EMA_ALPHA) + (correct ? 1 : 0) * MASTERY_EMA_ALPHA;

  let automaticity = nodeState.automaticity;
  if (solveTimeSeconds !== undefined && expectedTimeSeconds !== undefined && solveTimeSeconds > 0) {
    const rawAutomaticity = expectedTimeSeconds / solveTimeSeconds;
    const clampedAutomaticity = Math.min(Math.max(rawAutomaticity, 0), 3);
    automaticity = automaticity * (1 - AUTOMATICITY_WEIGHT) + clampedAutomaticity * AUTOMATICITY_WEIGHT;
  }

  const automaticityBonus = correct && automaticity > 1 ? (automaticity - 1) * 0.05 : 0;
  const mastery = Math.min(1, rawMastery + automaticityBonus);

  let interval: number;
  if (correct) {
    const speedMultiplier = automaticity > 1 ? 1 + (automaticity - 1) * 0.2 : 1;
    interval = Math.min(nodeState.interval * 2.5 * speedMultiplier, MAX_INTERVAL_SECONDS);
  } else {
    interval = 60;
  }

  const consecutiveCorrect = correct ? nodeState.consecutiveCorrect + 1 : 0;

  return {
    mastery,
    automaticity,
    consecutiveCorrect,
    implicitReviewCredit: nodeState.implicitReviewCredit,
    interval,
    nextReview: now + interval * 1000,
    totalReviews: nodeState.totalReviews + 1,
    lastReviewedAt: now,
  };
}

export interface Stats {
  total: number;
  unlocked: number;
  inProgress: number;
  mastered: number;
}

export function getStats(
  graph: GraphNode[],
  progress: UserProgress,
  themeFilter?: string[]
): Stats {
  const nodes =
    themeFilter && themeFilter.length > 0
      ? graph.filter((n) => n.themes?.some((t) => themeFilter.includes(t)))
      : graph;

  let unlocked = 0;
  let inProgress = 0;
  let mastered = 0;

  for (const node of nodes) {
    if (!isUnlocked(node.id, graph, progress)) continue;
    unlocked++;

    const state = progress[node.id];
    if (state) {
      if (state.mastery >= 0.8) {
        mastered++;
      } else {
        inProgress++;
      }
    }
  }

  return {
    total: nodes.length,
    unlocked,
    inProgress,
    mastered,
  };
}

/**
 * When a student struggles, find prerequisite nodes that are weak
 * and should be revisited. Returns prerequisite nodes sorted by
 * how much remediation they need.
 */
export function fallBackwards(
  nodeId: string,
  graph: GraphNode[],
  progress: UserProgress
): GraphNode[] {
  const node = graph.find((n) => n.id === nodeId);
  if (!node) return [];

  const weakPrereqs: { node: GraphNode; mastery: number }[] = [];

  for (const prereqId of node.prereqs) {
    const prereqNode = graph.find((n) => n.id === prereqId);
    if (!prereqNode) continue;

    const state = progress[prereqId];
    const mastery = state?.mastery ?? 0;

    if (mastery < 0.8) {
      weakPrereqs.push({ node: prereqNode, mastery });
    }
  }

  weakPrereqs.sort((a, b) => a.mastery - b.mastery);
  return weakPrereqs.map((wp) => wp.node);
}

/**
 * Get the single highest-priority next item for study.
 * Used by the legacy study session view. Prefers overdue reviews,
 * then new unlocked items.
 */
export function getNextItem(
  graph: GraphNode[],
  progress: UserProgress
): GraphNode | null {
  const now = Date.now();

  const dueForReview: { node: GraphNode; overdueBy: number }[] = [];
  const notStarted: GraphNode[] = [];

  for (const node of graph) {
    if (!isUnlocked(node.id, graph, progress)) continue;

    const state = progress[node.id];
    if (state) {
      if (state.nextReview < now) {
        dueForReview.push({ node, overdueBy: now - state.nextReview });
      }
    } else {
      notStarted.push(node);
    }
  }

  if (dueForReview.length > 0) {
    dueForReview.sort((a, b) => b.overdueBy - a.overdueBy);
    return dueForReview[0].node;
  }

  if (notStarted.length > 0) {
    return notStarted[0];
  }

  return null;
}

/**
 * Ensure a NodeState has all required fields, filling defaults for
 * legacy data that may be missing the new fields.
 */
export function ensureNodeState(partial: Partial<NodeState>): NodeState {
  return makeDefaultNodeState(partial);
}
