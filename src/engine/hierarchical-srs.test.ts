import { describe, it, expect, vi, afterEach } from "vitest";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import { makeDefaultNodeState } from "../types/state";
import { propagateReviewCredit, needsReview, overdueScore } from "./hierarchical-srs";

const makeNode = (
  id: string,
  prereqs: string[] = [],
  type: GraphNode["type"] = "radical"
): GraphNode => ({
  id,
  type,
  hanzi: "测",
  pinyin: "cè",
  meaning: "test",
  prereqs,
  lesson: {
    tutorial: "Test tutorial.",
    workedExample: { problem: "Q", solution: "A" },
    practiceProblems: [],
  },
});

const makeState = (overrides: Partial<ReturnType<typeof makeDefaultNodeState>> = {}) =>
  makeDefaultNodeState(overrides);

afterEach(() => {
  vi.useRealTimers();
});

// ─── propagateReviewCredit ───────────────────────────────────────────

describe("propagateReviewCredit", () => {
  const graph: GraphNode[] = [
    makeNode("r1"),
    makeNode("r2"),
    makeNode("c1", ["r1", "r2"], "character"),
    makeNode("w1", ["c1"], "word"),
  ];

  it("sets implicitReviewCredit on prerequisite nodes", () => {
    const now = Date.now();
    vi.setSystemTime(now);
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.8, interval: 3600, nextReview: now - 1000 }),
      r2: makeState({ mastery: 0.7, interval: 3600, nextReview: now - 1000 }),
      c1: makeState({ mastery: 0.9 }),
    };

    const updated = propagateReviewCredit("c1", graph, progress);
    expect(updated.r1.implicitReviewCredit).toBe(now);
    expect(updated.r2.implicitReviewCredit).toBe(now);
  });

  it("does not propagate credit to nodes with mastery < 0.5", () => {
    const now = Date.now();
    vi.setSystemTime(now);
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.3, interval: 3600, nextReview: now - 1000 }),
      r2: makeState({ mastery: 0.7, interval: 3600, nextReview: now - 1000 }),
      c1: makeState({ mastery: 0.9 }),
    };

    const updated = propagateReviewCredit("c1", graph, progress);
    expect(updated.r1.implicitReviewCredit).toBe(0);
    expect(updated.r2.implicitReviewCredit).toBe(now);
  });

  it("propagates recursively up to specified depth", () => {
    const now = Date.now();
    vi.setSystemTime(now);
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.8, interval: 3600, nextReview: now }),
      r2: makeState({ mastery: 0.8, interval: 3600, nextReview: now }),
      c1: makeState({ mastery: 0.8, interval: 3600, nextReview: now }),
      w1: makeState({ mastery: 0.9 }),
    };

    const updated = propagateReviewCredit("w1", graph, progress, 2);
    expect(updated.c1.implicitReviewCredit).toBe(now);
    expect(updated.r1.implicitReviewCredit).toBe(now);
  });

  it("returns unchanged progress for unknown nodeId", () => {
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.8 }),
    };
    const updated = propagateReviewCredit("nonexistent", graph, progress);
    expect(updated).toEqual(progress);
  });

  it("returns unchanged progress for nodes without prereqs", () => {
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.8 }),
    };
    const updated = propagateReviewCredit("r1", graph, progress);
    expect(updated).toEqual(progress);
  });
});

// ─── needsReview ─────────────────────────────────────────────────────

describe("needsReview", () => {
  it("returns false for nodes not in progress", () => {
    expect(needsReview("r1", {})).toBe(false);
  });

  it("returns false if nextReview is in the future", () => {
    const now = Date.now();
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.7, nextReview: now + 10000 }),
    };
    expect(needsReview("r1", progress, now)).toBe(false);
  });

  it("returns true if nextReview has passed and no implicit credit", () => {
    const now = Date.now();
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.7, nextReview: now - 10000 }),
    };
    expect(needsReview("r1", progress, now)).toBe(true);
  });

  it("returns false if recently received implicit review credit", () => {
    const now = Date.now();
    const progress: UserProgress = {
      r1: makeState({
        mastery: 0.7,
        nextReview: now - 10000,
        implicitReviewCredit: now - 1000,
      }),
    };
    expect(needsReview("r1", progress, now)).toBe(false);
  });

  it("returns true if implicit credit has expired", () => {
    const now = Date.now();
    const fourDaysAgo = now - 4 * 24 * 60 * 60 * 1000;
    const progress: UserProgress = {
      r1: makeState({
        mastery: 0.7,
        nextReview: now - 10000,
        implicitReviewCredit: fourDaysAgo,
      }),
    };
    expect(needsReview("r1", progress, now)).toBe(true);
  });

  it("returns false for near-perfect mastery (>= 0.95)", () => {
    const now = Date.now();
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.95, nextReview: now - 10000 }),
    };
    expect(needsReview("r1", progress, now)).toBe(false);
  });
});

// ─── overdueScore ────────────────────────────────────────────────────

describe("overdueScore", () => {
  it("returns 0 for nodes not in progress", () => {
    expect(overdueScore("r1", {})).toBe(0);
  });

  it("returns positive value for overdue nodes", () => {
    const now = Date.now();
    const progress: UserProgress = {
      r1: makeState({ nextReview: now - 10000 }),
    };
    expect(overdueScore("r1", progress, now)).toBeGreaterThan(0);
  });

  it("returns negative value for nodes not yet due", () => {
    const now = Date.now();
    const progress: UserProgress = {
      r1: makeState({ nextReview: now + 10000 }),
    };
    expect(overdueScore("r1", progress, now)).toBeLessThan(0);
  });

  it("reduces overdue score when implicit credit is fresh", () => {
    const now = Date.now();
    const baseProgress: UserProgress = {
      r1: makeState({ nextReview: now - 100000 }),
    };
    const creditProgress: UserProgress = {
      r1: makeState({
        nextReview: now - 100000,
        implicitReviewCredit: now - 1000,
      }),
    };

    const baseScore = overdueScore("r1", baseProgress, now);
    const creditScore = overdueScore("r1", creditProgress, now);
    expect(creditScore).toBeLessThan(baseScore);
  });
});
