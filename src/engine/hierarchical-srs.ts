import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";

const IMPLICIT_CREDIT_DECAY = 0.5;
const IMPLICIT_CREDIT_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

/**
 * When a higher-level topic is practiced, propagate implicit partial review
 * credit to its prerequisites. This models the Math Academy insight that
 * practicing advanced topics partially reviews foundational ones.
 *
 * Returns updated progress with implicit review timestamps set on prereqs.
 */
export function propagateReviewCredit(
  nodeId: string,
  graph: GraphNode[],
  progress: UserProgress,
  depth: number = 2
): UserProgress {
  if (depth <= 0) return progress;

  const node = graph.find((n) => n.id === nodeId);
  if (!node) return progress;

  const now = Date.now();
  let updated = { ...progress };
  const creditStrength = Math.pow(IMPLICIT_CREDIT_DECAY, 1);

  for (const prereqId of node.prereqs) {
    const prereqState = updated[prereqId];
    if (!prereqState) continue;
    if (prereqState.mastery < 0.5) continue;

    updated[prereqId] = {
      ...prereqState,
      implicitReviewCredit: now,
      nextReview: Math.max(
        prereqState.nextReview,
        now + prereqState.interval * 1000 * creditStrength
      ),
    };

    if (depth > 1) {
      updated = propagateReviewCredit(prereqId, graph, updated, depth - 1);
    }
  }

  return updated;
}

/**
 * Determines if a node needs explicit review, accounting for implicit
 * review credit from hierarchical SRS.
 *
 * A node is considered reviewed if:
 * 1. It was explicitly reviewed recently (nextReview in the future), OR
 * 2. It received implicit review credit within the credit duration window
 */
export function needsReview(
  nodeId: string,
  progress: UserProgress,
  now?: number
): boolean {
  const currentTime = now ?? Date.now();
  const state = progress[nodeId];
  if (!state) return false;
  if (state.mastery >= 0.95) return false;

  if (state.nextReview > currentTime) return false;

  if (state.implicitReviewCredit > 0) {
    const timeSinceCredit = currentTime - state.implicitReviewCredit;
    if (timeSinceCredit < IMPLICIT_CREDIT_DURATION_MS) {
      return false;
    }
  }

  return true;
}

/**
 * Calculate how overdue a node is for review. Higher values = more overdue.
 * Returns 0 if not overdue, negative if reviewed recently via implicit credit.
 */
export function overdueScore(
  nodeId: string,
  progress: UserProgress,
  now?: number
): number {
  const currentTime = now ?? Date.now();
  const state = progress[nodeId];
  if (!state) return 0;

  const baseOverdue = currentTime - state.nextReview;

  if (state.implicitReviewCredit > 0) {
    const timeSinceCredit = currentTime - state.implicitReviewCredit;
    if (timeSinceCredit < IMPLICIT_CREDIT_DURATION_MS) {
      const creditFreshness = 1 - (timeSinceCredit / IMPLICIT_CREDIT_DURATION_MS);
      return baseOverdue * (1 - creditFreshness * IMPLICIT_CREDIT_DECAY);
    }
  }

  return baseOverdue;
}
