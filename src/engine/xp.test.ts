import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { XPState, TaskResult } from "../types/tasks";
import { makeDefaultNodeState } from "../types/state";
import {
  calculateXP,
  updateXPState,
  estimateCompletion,
  loadXPState,
  saveXPState,
} from "./xp";

const makeNode = (id: string): GraphNode => ({
  id,
  type: "radical",
  hanzi: "测",
  pinyin: "cè",
  meaning: "test",
  prereqs: [],
  lesson: {
    tutorial: "T",
    workedExample: { problem: "Q", solution: "A" },
    practiceProblems: [],
  },
});

const defaultXPState: XPState = {
  totalXP: 100,
  todayXP: 20,
  dailyGoal: 50,
  streak: 3,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  tasksCompletedToday: 2,
  questionsAnsweredToday: 10,
  xpSinceLastQuiz: 80,
};

afterEach(() => {
  vi.useRealTimers();
});

// ─── calculateXP ─────────────────────────────────────────────────────

describe("calculateXP", () => {
  it("returns base XP for non-perfect score", () => {
    const result: TaskResult = {
      xpEarned: 10,
      bonusXP: 0,
      questionsAnswered: 5,
      correctCount: 3,
      perfectScore: false,
    };
    const { xpEarned, bonusXP } = calculateXP(10, result);
    expect(xpEarned).toBe(10);
    expect(bonusXP).toBe(0);
  });

  it("returns base + bonus XP for perfect score", () => {
    const result: TaskResult = {
      xpEarned: 10,
      bonusXP: 0,
      questionsAnswered: 5,
      correctCount: 5,
      perfectScore: true,
    };
    const { xpEarned, bonusXP } = calculateXP(10, result);
    expect(xpEarned).toBe(10);
    expect(bonusXP).toBe(5);
  });

  it("bonus is 50% of base XP", () => {
    const result: TaskResult = {
      xpEarned: 20,
      bonusXP: 0,
      questionsAnswered: 3,
      correctCount: 3,
      perfectScore: true,
    };
    const { bonusXP } = calculateXP(20, result);
    expect(bonusXP).toBe(10);
  });

  it("bonus rounds up for odd base XP", () => {
    const result: TaskResult = {
      xpEarned: 15,
      bonusXP: 0,
      questionsAnswered: 3,
      correctCount: 3,
      perfectScore: true,
    };
    const { bonusXP } = calculateXP(15, result);
    expect(bonusXP).toBe(8);
  });
});

// ─── updateXPState ───────────────────────────────────────────────────

describe("updateXPState", () => {
  it("adds XP to total and today", () => {
    const updated = updateXPState(defaultXPState, 15, 5, false);
    expect(updated.totalXP).toBe(115);
    expect(updated.todayXP).toBe(35);
  });

  it("increments task and question counts", () => {
    const updated = updateXPState(defaultXPState, 15, 5, false);
    expect(updated.tasksCompletedToday).toBe(3);
    expect(updated.questionsAnsweredToday).toBe(15);
  });

  it("resets xpSinceLastQuiz to 0 when completing a quiz", () => {
    const updated = updateXPState(defaultXPState, 15, 5, true);
    expect(updated.xpSinceLastQuiz).toBe(0);
  });

  it("adds to xpSinceLastQuiz for non-quiz tasks", () => {
    const updated = updateXPState(defaultXPState, 15, 5, false);
    expect(updated.xpSinceLastQuiz).toBe(95);
  });

  it("resets daily counters on new day", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const stateFromYesterday: XPState = {
      ...defaultXPState,
      lastActiveDate: yesterday.toISOString().slice(0, 10),
      todayXP: 50,
      streak: 3,
    };

    const updated = updateXPState(stateFromYesterday, 10, 3, false);
    expect(updated.todayXP).toBe(10);
    expect(updated.tasksCompletedToday).toBe(1);
    expect(updated.questionsAnsweredToday).toBe(3);
  });

  it("increments streak when consecutive day and met goal", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const stateFromYesterday: XPState = {
      ...defaultXPState,
      lastActiveDate: yesterday.toISOString().slice(0, 10),
      todayXP: 50,
      dailyGoal: 50,
      streak: 3,
    };

    const updated = updateXPState(stateFromYesterday, 10, 3, false);
    expect(updated.streak).toBe(4);
  });

  it("resets streak on gap of more than 1 day", () => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 3);
    const oldState: XPState = {
      ...defaultXPState,
      lastActiveDate: twoDaysAgo.toISOString().slice(0, 10),
      streak: 5,
    };

    const updated = updateXPState(oldState, 10, 3, false);
    expect(updated.streak).toBe(0);
  });

  it("sets streak to 1 if was 0 and earning XP", () => {
    const zeroStreak: XPState = {
      ...defaultXPState,
      streak: 0,
    };
    const updated = updateXPState(zeroStreak, 10, 3, false);
    expect(updated.streak).toBe(1);
  });
});

// ─── estimateCompletion ──────────────────────────────────────────────

describe("estimateCompletion", () => {
  it("returns 0 days when all nodes are mastered", () => {
    const graph = [makeNode("r1"), makeNode("r2")];
    const progress: UserProgress = {
      r1: makeDefaultNodeState({ mastery: 0.9 }),
      r2: makeDefaultNodeState({ mastery: 0.85 }),
    };
    const { daysRemaining } = estimateCompletion(graph, progress, defaultXPState);
    expect(daysRemaining).toBe(0);
  });

  it("estimates based on daily pace from XP history", () => {
    const graph = Array.from({ length: 10 }, (_, i) => makeNode(`r${i}`));
    const progress: UserProgress = {};

    const history = Array.from({ length: 7 }, (_, i) => ({
      date: `2026-03-0${i + 1}`,
      xp: 50,
    }));

    const result = estimateCompletion(graph, progress, defaultXPState, history);
    expect(result.daysRemaining).toBeGreaterThan(0);
    expect(result.dailyPace).toBe(50);
  });

  it("falls back to daily goal when no history", () => {
    const graph = [makeNode("r1")];
    const xp: XPState = { ...defaultXPState, totalXP: 0, todayXP: 0 };
    const result = estimateCompletion(graph, {}, xp);
    expect(result.dailyPace).toBe(xp.dailyGoal);
  });

  it("returns an estimated date in the future", () => {
    const graph = Array.from({ length: 5 }, (_, i) => makeNode(`r${i}`));
    const result = estimateCompletion(graph, {}, defaultXPState);
    expect(result.estimatedDate).not.toBeNull();
    expect(result.estimatedDate!.getTime()).toBeGreaterThan(Date.now());
  });
});

// ─── loadXPState / saveXPState ───────────────────────────────────────

describe("XP storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loadXPState returns defaults when nothing saved", () => {
    const state = loadXPState();
    expect(state.totalXP).toBe(0);
    expect(state.dailyGoal).toBe(50);
    expect(state.streak).toBe(0);
  });

  it("saveXPState → loadXPState round-trips correctly", () => {
    saveXPState(defaultXPState);
    const loaded = loadXPState();
    expect(loaded.totalXP).toBe(defaultXPState.totalXP);
    expect(loaded.dailyGoal).toBe(defaultXPState.dailyGoal);
  });

  it("resets daily counters on load if day changed", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const oldState: XPState = {
      ...defaultXPState,
      lastActiveDate: yesterday.toISOString().slice(0, 10),
      todayXP: 100,
    };
    saveXPState(oldState);

    const loaded = loadXPState();
    expect(loaded.todayXP).toBe(0);
    expect(loaded.tasksCompletedToday).toBe(0);
  });

  it("handles corrupt data gracefully", () => {
    localStorage.setItem("lang-academy-xp", "not-valid{json");
    const state = loadXPState();
    expect(state.totalXP).toBe(0);
  });
});
