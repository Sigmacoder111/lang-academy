import type { GraphNode } from "../types/graph";
import type { NodeState, UserProgress } from "../types/state";

const MAX_INTERVAL_SECONDS = 30 * 24 * 60 * 60; // 30 days

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

export function updateMastery(nodeState: NodeState, correct: boolean): NodeState {
  const now = Date.now();
  const mastery = nodeState.mastery * 0.8 + (correct ? 1 : 0) * 0.2;

  let interval: number;
  if (correct) {
    interval = Math.min(nodeState.interval * 2.5, MAX_INTERVAL_SECONDS);
  } else {
    interval = 60;
  }

  return {
    mastery,
    interval,
    nextReview: now + interval * 1000,
    totalReviews: nodeState.totalReviews + 1,
    lastReviewedAt: now,
  };
}

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

export interface Stats {
  total: number;
  unlocked: number;
  inProgress: number;
  mastered: number;
}

export function getStats(graph: GraphNode[], progress: UserProgress): Stats {
  let unlocked = 0;
  let inProgress = 0;
  let mastered = 0;

  for (const node of graph) {
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
    total: graph.length,
    unlocked,
    inProgress,
    mastered,
  };
}
