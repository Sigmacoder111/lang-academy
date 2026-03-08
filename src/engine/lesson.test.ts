import { describe, it, expect } from "vitest";
import type { GraphNode } from "../types/graph";
import { startLesson, advanceLesson, getCurrentProblem, lessonProgressPercent } from "./lesson";

const makeNode = (practiceCount: number = 2): GraphNode => ({
  id: "r1",
  type: "radical",
  hanzi: "测",
  pinyin: "cè",
  meaning: "test",
  prereqs: [],
  lesson: {
    tutorial: "Tutorial content here.",
    workedExample: { problem: "What does 测 mean?", solution: "It means test." },
    practiceProblems: Array.from({ length: practiceCount }, (_, i) => ({
      question: `Question ${i + 1}?`,
      options: ["a", "b", "c", "d"],
      correctIndex: 0,
      explanation: `Explanation ${i + 1}.`,
      expectedSeconds: 10,
    })),
  },
});

// ─── startLesson ─────────────────────────────────────────────────────

describe("startLesson", () => {
  it("starts in tutorial phase", () => {
    const state = startLesson();
    expect(state.phase).toBe("tutorial");
    expect(state.practiceIndex).toBe(0);
    expect(state.consecutiveCorrect).toBe(0);
    expect(state.completed).toBe(false);
  });
});

// ─── advanceLesson ───────────────────────────────────────────────────

describe("advanceLesson", () => {
  const topic = makeNode(2);

  it("advances from tutorial to worked_example", () => {
    const state = startLesson();
    const next = advanceLesson(state, topic);
    expect(next.phase).toBe("worked_example");
  });

  it("advances from worked_example to practice", () => {
    const state = { ...startLesson(), phase: "worked_example" as const };
    const next = advanceLesson(state, topic);
    expect(next.phase).toBe("practice");
    expect(next.practiceIndex).toBe(0);
    expect(next.consecutiveCorrect).toBe(0);
  });

  it("increments consecutiveCorrect on correct answer in practice", () => {
    const state = {
      phase: "practice" as const,
      practiceIndex: 0,
      consecutiveCorrect: 0,
      completed: false,
    };
    const next = advanceLesson(state, topic, true);
    expect(next.consecutiveCorrect).toBe(1);
    expect(next.practiceIndex).toBe(0);
  });

  it("advances to next problem after 2 correct in a row", () => {
    const state = {
      phase: "practice" as const,
      practiceIndex: 0,
      consecutiveCorrect: 1,
      completed: false,
    };
    const next = advanceLesson(state, topic, true);
    expect(next.practiceIndex).toBe(1);
    expect(next.consecutiveCorrect).toBe(0);
  });

  it("completes lesson after all problems pass with 2 correct each", () => {
    const state = {
      phase: "practice" as const,
      practiceIndex: 1,
      consecutiveCorrect: 1,
      completed: false,
    };
    const next = advanceLesson(state, topic, true);
    expect(next.completed).toBe(true);
  });

  it("resets consecutiveCorrect on wrong answer", () => {
    const state = {
      phase: "practice" as const,
      practiceIndex: 0,
      consecutiveCorrect: 1,
      completed: false,
    };
    const next = advanceLesson(state, topic, false);
    expect(next.consecutiveCorrect).toBe(0);
    expect(next.practiceIndex).toBe(0);
  });

  it("does not advance already completed lesson", () => {
    const state = {
      phase: "practice" as const,
      practiceIndex: 1,
      consecutiveCorrect: 2,
      completed: true,
    };
    const next = advanceLesson(state, topic, true);
    expect(next.completed).toBe(true);
    expect(next).toEqual(state);
  });

  it("handles topic with no practice problems", () => {
    const emptyTopic = makeNode(0);
    const state = {
      phase: "practice" as const,
      practiceIndex: 0,
      consecutiveCorrect: 0,
      completed: false,
    };
    const next = advanceLesson(state, emptyTopic);
    expect(next.completed).toBe(true);
  });

  it("full lesson flow: tutorial → worked example → practice → complete", () => {
    let state = startLesson();

    state = advanceLesson(state, topic);
    expect(state.phase).toBe("worked_example");

    state = advanceLesson(state, topic);
    expect(state.phase).toBe("practice");

    state = advanceLesson(state, topic, true);
    expect(state.consecutiveCorrect).toBe(1);

    state = advanceLesson(state, topic, true);
    expect(state.practiceIndex).toBe(1);

    state = advanceLesson(state, topic, false);
    expect(state.consecutiveCorrect).toBe(0);

    state = advanceLesson(state, topic, true);
    state = advanceLesson(state, topic, true);
    expect(state.completed).toBe(true);
  });
});

// ─── getCurrentProblem ───────────────────────────────────────────────

describe("getCurrentProblem", () => {
  const topic = makeNode(3);

  it("returns null when not in practice phase", () => {
    const state = startLesson();
    expect(getCurrentProblem(state, topic)).toBeNull();
  });

  it("returns the current practice problem", () => {
    const state = {
      phase: "practice" as const,
      practiceIndex: 1,
      consecutiveCorrect: 0,
      completed: false,
    };
    const problem = getCurrentProblem(state, topic);
    expect(problem).not.toBeNull();
    expect(problem!.question).toBe("Question 2?");
  });

  it("returns null when index exceeds problems", () => {
    const state = {
      phase: "practice" as const,
      practiceIndex: 10,
      consecutiveCorrect: 0,
      completed: false,
    };
    expect(getCurrentProblem(state, topic)).toBeNull();
  });
});

// ─── lessonProgressPercent ───────────────────────────────────────────

describe("lessonProgressPercent", () => {
  const topic = makeNode(4);

  it("returns 0 for tutorial phase", () => {
    const state = startLesson();
    expect(lessonProgressPercent(state, topic)).toBe(0);
  });

  it("returns 15 for worked_example phase", () => {
    const state = { ...startLesson(), phase: "worked_example" as const };
    expect(lessonProgressPercent(state, topic)).toBe(15);
  });

  it("returns 100 for completed lesson", () => {
    const state = { ...startLesson(), completed: true };
    expect(lessonProgressPercent(state, topic)).toBe(100);
  });

  it("returns proportional value for practice phase", () => {
    const state = {
      phase: "practice" as const,
      practiceIndex: 2,
      consecutiveCorrect: 0,
      completed: false,
    };
    const percent = lessonProgressPercent(state, topic);
    expect(percent).toBeGreaterThan(15);
    expect(percent).toBeLessThan(100);
  });
});
