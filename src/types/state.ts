export interface NodeState {
  mastery: number;        // 0.0 to 1.0
  interval: number;       // seconds until next review
  nextReview: number;     // Unix timestamp (ms)
  totalReviews: number;   // how many times reviewed
  lastReviewedAt: number; // Unix timestamp (ms)
}

export type UserProgress = Record<string, NodeState>;
