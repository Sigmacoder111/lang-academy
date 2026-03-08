import { describe, it, expect, vi } from "vitest";
import type { GraphNode } from "../types/graph";
import type { NodeState, UserProgress } from "../types/state";
import { makeDefaultNodeState } from "../types/state";
import {
  isUnlocked,
  updateMastery,
  getNextItem,
  getStats,
  fallBackwards,
} from "./mastery";

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
    tutorial: "Test tutorial content.",
    workedExample: { problem: "What does 测 mean?", solution: "It means test." },
    practiceProblems: [
      { question: "What does 测 mean?", options: ["test", "try", "do", "go"], correctIndex: 0, explanation: "测 means test.", expectedSeconds: 10 },
      { question: "How is 测 pronounced?", options: ["cè", "cā", "cī", "cū"], correctIndex: 0, explanation: "测 is cè.", expectedSeconds: 10 },
    ],
  },
});

const makeState = (overrides: Partial<NodeState> = {}): NodeState =>
  makeDefaultNodeState(overrides);

// ─── isUnlocked ──────────────────────────────────────────────────────

describe("isUnlocked", () => {
  const graph: GraphNode[] = [
    makeNode("r1"),
    makeNode("r2"),
    makeNode("c1", ["r1", "r2"], "character"),
  ];

  it("returns true for radicals (no prereqs)", () => {
    expect(isUnlocked("r1", graph, {})).toBe(true);
  });

  it("returns false when prereqs are not in progress", () => {
    expect(isUnlocked("c1", graph, {})).toBe(false);
  });

  it("returns false when prereqs have mastery < 0.8", () => {
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.9 }),
      r2: makeState({ mastery: 0.7 }),
    };
    expect(isUnlocked("c1", graph, progress)).toBe(false);
  });

  it("returns true when all prereqs have mastery >= 0.8", () => {
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.8 }),
      r2: makeState({ mastery: 0.95 }),
    };
    expect(isUnlocked("c1", graph, progress)).toBe(true);
  });

  it("returns false for unknown node IDs", () => {
    expect(isUnlocked("nonexistent", graph, {})).toBe(false);
  });
});

// ─── updateMastery ───────────────────────────────────────────────────

describe("updateMastery", () => {
  it("increases mastery on correct answer", () => {
    const state = makeState({ mastery: 0 });
    const updated = updateMastery(state, true);
    expect(updated.mastery).toBeGreaterThan(0);
  });

  it("decreases mastery on wrong answer", () => {
    const state = makeState({ mastery: 0.8 });
    const updated = updateMastery(state, false);
    expect(updated.mastery).toBeLessThan(0.8);
  });

  it("applies EMA formula for mastery base", () => {
    const state = makeState({ mastery: 0.5 });
    const correct = updateMastery(state, true);
    expect(correct.mastery).toBeGreaterThanOrEqual(0.5 * 0.8 + 0.2);
  });

  it("multiplies interval on correct answer", () => {
    const state = makeState({ interval: 100 });
    const updated = updateMastery(state, true);
    expect(updated.interval).toBeGreaterThanOrEqual(250);
  });

  it("resets interval to 60 on wrong answer", () => {
    const state = makeState({ interval: 5000 });
    const updated = updateMastery(state, false);
    expect(updated.interval).toBe(60);
  });

  it("caps interval at 30 days", () => {
    const thirtyDays = 30 * 24 * 60 * 60;
    const state = makeState({ interval: thirtyDays });
    const updated = updateMastery(state, true);
    expect(updated.interval).toBe(thirtyDays);
  });

  it("increments totalReviews", () => {
    const state = makeState({ totalReviews: 3 });
    const updated = updateMastery(state, true);
    expect(updated.totalReviews).toBe(4);
  });

  it("sets lastReviewedAt to current time", () => {
    const now = Date.now();
    vi.setSystemTime(now);
    const state = makeState();
    const updated = updateMastery(state, true);
    expect(updated.lastReviewedAt).toBe(now);
    vi.useRealTimers();
  });

  it("computes automaticity from solve time vs expected time", () => {
    const state = makeState({ automaticity: 0 });
    const updated = updateMastery(state, true, 5, 10);
    expect(updated.automaticity).toBeGreaterThan(0);
  });

  it("automaticity > 0 when solving faster than expected", () => {
    const state = makeState({ automaticity: 0 });
    const updated = updateMastery(state, true, 5, 10);
    expect(updated.automaticity).toBeGreaterThan(0);
  });

  it("automaticity reflects speed improvement over time", () => {
    let state = makeState({ automaticity: 0 });
    state = updateMastery(state, true, 5, 10);
    const first = state.automaticity;
    state = updateMastery(state, true, 5, 10);
    expect(state.automaticity).toBeGreaterThan(first);
  });

  it("resets consecutiveCorrect on wrong answer", () => {
    const state = makeState({ consecutiveCorrect: 3 });
    const updated = updateMastery(state, false);
    expect(updated.consecutiveCorrect).toBe(0);
  });

  it("increments consecutiveCorrect on correct answer", () => {
    const state = makeState({ consecutiveCorrect: 1 });
    const updated = updateMastery(state, true);
    expect(updated.consecutiveCorrect).toBe(2);
  });

  it("gives automaticity bonus to mastery when solving fast", () => {
    const slowState = makeState({ mastery: 0.5, automaticity: 0.5 });
    const slowResult = updateMastery(slowState, true, 20, 10);

    const fastState = makeState({ mastery: 0.5, automaticity: 1.5 });
    const fastResult = updateMastery(fastState, true, 5, 10);

    expect(fastResult.mastery).toBeGreaterThan(slowResult.mastery);
  });

  it("preserves implicitReviewCredit", () => {
    const state = makeState({ implicitReviewCredit: 12345 });
    const updated = updateMastery(state, true);
    expect(updated.implicitReviewCredit).toBe(12345);
  });
});

// ─── getNextItem ─────────────────────────────────────────────────────

describe("getNextItem", () => {
  const graph: GraphNode[] = [
    makeNode("r1"),
    makeNode("r2"),
    makeNode("c1", ["r1"], "character"),
  ];

  it("returns first unlocked not-started node when nothing in progress", () => {
    const result = getNextItem(graph, {});
    expect(result?.id).toBe("r1");
  });

  it("prioritizes overdue reviews over new nodes", () => {
    const now = Date.now();
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.5, nextReview: now - 10000 }),
    };
    const result = getNextItem(graph, progress);
    expect(result?.id).toBe("r1");
  });

  it("returns most overdue node first", () => {
    const now = Date.now();
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.5, nextReview: now - 5000 }),
      r2: makeState({ mastery: 0.5, nextReview: now - 20000 }),
    };
    const result = getNextItem(graph, progress);
    expect(result?.id).toBe("r2");
  });

  it("skips locked nodes", () => {
    const lockedGraph: GraphNode[] = [
      makeNode("c1", ["r_missing"], "character"),
    ];
    const result = getNextItem(lockedGraph, {});
    expect(result).toBeNull();
  });

  it("returns null when everything is reviewed and not yet due", () => {
    const future = Date.now() + 999999;
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.9, nextReview: future }),
      r2: makeState({ mastery: 0.9, nextReview: future }),
    };
    const twoRadicals = [makeNode("r1"), makeNode("r2")];
    const result = getNextItem(twoRadicals, progress);
    expect(result).toBeNull();
  });
});

// ─── getStats ────────────────────────────────────────────────────────

describe("getStats", () => {
  const graph: GraphNode[] = [
    makeNode("r1"),
    makeNode("r2"),
    makeNode("r3"),
    makeNode("c1", ["r1", "r2"], "character"),
  ];

  it("counts total nodes", () => {
    const stats = getStats(graph, {});
    expect(stats.total).toBe(4);
  });

  it("counts unlocked nodes (radicals are always unlocked)", () => {
    const stats = getStats(graph, {});
    expect(stats.unlocked).toBe(3);
  });

  it("counts in-progress nodes (started but mastery < 0.8)", () => {
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.5 }),
      r2: makeState({ mastery: 0.3 }),
    };
    const stats = getStats(graph, progress);
    expect(stats.inProgress).toBe(2);
  });

  it("counts mastered nodes (mastery >= 0.8)", () => {
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.85 }),
      r2: makeState({ mastery: 0.9 }),
    };
    const stats = getStats(graph, progress);
    expect(stats.mastered).toBe(2);
    expect(stats.unlocked).toBe(4);
  });

  it("returns zeros for empty progress", () => {
    const stats = getStats([], {});
    expect(stats).toEqual({ total: 0, unlocked: 0, inProgress: 0, mastered: 0 });
  });
});

// ─── fallBackwards ───────────────────────────────────────────────────

describe("fallBackwards", () => {
  const graph: GraphNode[] = [
    makeNode("r1"),
    makeNode("r2"),
    makeNode("c1", ["r1", "r2"], "character"),
  ];

  it("returns weak prereqs sorted by mastery (ascending)", () => {
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.3 }),
      r2: makeState({ mastery: 0.6 }),
    };
    const result = fallBackwards("c1", graph, progress);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("r1");
  });

  it("returns empty array for node with no prereqs", () => {
    const result = fallBackwards("r1", graph, {});
    expect(result).toEqual([]);
  });

  it("excludes prereqs with mastery >= 0.8", () => {
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.9 }),
      r2: makeState({ mastery: 0.5 }),
    };
    const result = fallBackwards("c1", graph, progress);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("r2");
  });

  it("returns empty for unknown nodeId", () => {
    const result = fallBackwards("nonexistent", graph, {});
    expect(result).toEqual([]);
  });
});
