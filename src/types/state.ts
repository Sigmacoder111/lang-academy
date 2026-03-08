export interface NodeState {
  mastery: number;              // 0.0 to 1.0
  automaticity: number;         // ratio: expectedTime / solveTime (>1 = fast, <1 = slow)
  consecutiveCorrect: number;   // streak of correct answers (for lesson progression)
  implicitReviewCredit: number; // Unix timestamp (ms) of last implicit review from hierarchical SRS
  interval: number;             // seconds until next review
  nextReview: number;           // Unix timestamp (ms)
  totalReviews: number;         // how many times reviewed
  lastReviewedAt: number;       // Unix timestamp (ms)
}

export type UserProgress = Record<string, NodeState>;

export function makeDefaultNodeState(overrides: Partial<NodeState> = {}): NodeState {
  return {
    mastery: 0,
    automaticity: 0,
    consecutiveCorrect: 0,
    implicitReviewCredit: 0,
    interval: 60,
    nextReview: 0,
    totalReviews: 0,
    lastReviewedAt: 0,
    ...overrides,
  };
}
