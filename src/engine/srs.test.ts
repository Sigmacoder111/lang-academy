import { describe, it, expect, beforeEach, vi } from "vitest";
import type { GraphNode } from "../types/graph";
import type { NodeState, UserProgress } from "../types/state";
import { isUnlocked, updateMastery, getNextItem, getStats } from "./srs";
import { saveProgress, loadProgress, resetProgress } from "./storage";

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
});

const makeState = (overrides: Partial<NodeState> = {}): NodeState => ({
  mastery: 0,
  interval: 60,
  nextReview: 0,
  totalReviews: 0,
  lastReviewedAt: 0,
  ...overrides,
});

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
    const state = makeState({ mastery: 0, interval: 60 });
    const updated = updateMastery(state, true);
    expect(updated.mastery).toBeCloseTo(0.2);
  });

  it("decreases mastery on wrong answer", () => {
    const state = makeState({ mastery: 0.8, interval: 600 });
    const updated = updateMastery(state, false);
    expect(updated.mastery).toBeCloseTo(0.64);
  });

  it("applies EMA formula: mastery * 0.8 + correct * 0.2", () => {
    const state = makeState({ mastery: 0.5 });
    const correct = updateMastery(state, true);
    expect(correct.mastery).toBeCloseTo(0.5 * 0.8 + 0.2);

    const wrong = updateMastery(state, false);
    expect(wrong.mastery).toBeCloseTo(0.5 * 0.8);
  });

  it("multiplies interval by 2.5 on correct answer", () => {
    const state = makeState({ interval: 100 });
    const updated = updateMastery(state, true);
    expect(updated.interval).toBe(250);
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

  it("sets nextReview to now + interval * 1000", () => {
    const now = Date.now();
    vi.setSystemTime(now);
    const state = makeState({ interval: 120 });
    const updated = updateMastery(state, true);
    expect(updated.nextReview).toBe(now + 300 * 1000); // 120 * 2.5 = 300
    vi.useRealTimers();
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
    const graph: GraphNode[] = [
      makeNode("c1", ["r_missing"], "character"),
    ];
    const result = getNextItem(graph, {});
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

  it("returns not-started unlocked nodes in graph order", () => {
    const graph: GraphNode[] = [
      makeNode("r1"),
      makeNode("r2"),
      makeNode("r3"),
    ];
    const future = Date.now() + 999999;
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.5, nextReview: future }),
    };
    const result = getNextItem(graph, progress);
    expect(result?.id).toBe("r2");
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
    expect(stats.unlocked).toBe(3); // r1, r2, r3 (c1 locked)
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
    expect(stats.unlocked).toBe(4); // c1 now unlocked too
  });

  it("returns zeros for empty progress", () => {
    const stats = getStats([], {});
    expect(stats).toEqual({ total: 0, unlocked: 0, inProgress: 0, mastered: 0 });
  });
});

// ─── Storage ─────────────────────────────────────────────────────────

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loadProgress returns empty object when nothing saved", () => {
    expect(loadProgress()).toEqual({});
  });

  it("saveProgress → loadProgress round-trips correctly", () => {
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.6, interval: 300, totalReviews: 5 }),
    };
    saveProgress(progress);
    expect(loadProgress()).toEqual(progress);
  });

  it("resetProgress clears saved data", () => {
    saveProgress({ r1: makeState() });
    resetProgress();
    expect(loadProgress()).toEqual({});
  });

  it("loadProgress handles corrupt data gracefully", () => {
    localStorage.setItem("lang-academy-progress", "not-valid-json{{{");
    expect(loadProgress()).toEqual({});
  });
});
