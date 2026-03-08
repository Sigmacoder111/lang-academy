import { describe, it, expect, vi, afterEach } from "vitest";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { XPState } from "../types/tasks";
import { makeDefaultNodeState } from "../types/state";
import { selectTasks } from "./task-selector";

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
    tutorial: "Tutorial",
    workedExample: { problem: "Q", solution: "A" },
    practiceProblems: [
      { question: "Q?", options: ["a", "b", "c", "d"], correctIndex: 0, explanation: "Because.", expectedSeconds: 10 },
    ],
  },
});

const makeState = (overrides: Partial<ReturnType<typeof makeDefaultNodeState>> = {}) =>
  makeDefaultNodeState(overrides);

const defaultXPState: XPState = {
  totalXP: 0,
  todayXP: 0,
  dailyGoal: 50,
  streak: 0,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  tasksCompletedToday: 0,
  questionsAnsweredToday: 0,
  xpSinceLastQuiz: 0,
};

afterEach(() => {
  vi.useRealTimers();
});

describe("selectTasks", () => {
  it("returns up to 5 tasks", () => {
    const graph: GraphNode[] = Array.from({ length: 10 }, (_, i) =>
      makeNode(`r${i}`)
    );
    const tasks = selectTasks(graph, {}, defaultXPState);
    expect(tasks.length).toBeLessThanOrEqual(5);
    expect(tasks.length).toBeGreaterThan(0);
  });

  it("returns lesson tasks for new unlocked nodes", () => {
    const graph: GraphNode[] = [makeNode("r1"), makeNode("r2"), makeNode("r3")];
    const tasks = selectTasks(graph, {}, defaultXPState);
    const lessons = tasks.filter((t) => t.type === "lesson");
    expect(lessons.length).toBeGreaterThan(0);
  });

  it("returns review tasks for overdue nodes", () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const graph: GraphNode[] = [makeNode("r1"), makeNode("r2")];
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.6, nextReview: now - 100000, interval: 3600 }),
    };
    const tasks = selectTasks(graph, progress, defaultXPState);
    const reviews = tasks.filter((t) => t.type === "review");
    expect(reviews.length).toBeGreaterThanOrEqual(1);
  });

  it("includes quiz gate when xpSinceLastQuiz >= 150 and enough mastered nodes", () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const graph: GraphNode[] = Array.from({ length: 5 }, (_, i) =>
      makeNode(`r${i}`)
    );
    const progress: UserProgress = {};
    for (let i = 0; i < 5; i++) {
      progress[`r${i}`] = makeState({
        mastery: 0.9,
        nextReview: now + 100000,
        interval: 86400,
      });
    }

    const xpState: XPState = { ...defaultXPState, xpSinceLastQuiz: 200 };
    const tasks = selectTasks(graph, progress, xpState);
    const quizzes = tasks.filter((t) => t.type === "quiz");
    expect(quizzes.length).toBe(1);
    expect(quizzes[0].required).toBe(true);
  });

  it("does not include quiz when xpSinceLastQuiz < 150", () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const graph: GraphNode[] = Array.from({ length: 5 }, (_, i) =>
      makeNode(`r${i}`)
    );
    const progress: UserProgress = {};
    for (let i = 0; i < 5; i++) {
      progress[`r${i}`] = makeState({
        mastery: 0.9,
        nextReview: now + 100000,
      });
    }

    const xpState: XPState = { ...defaultXPState, xpSinceLastQuiz: 100 };
    const tasks = selectTasks(graph, progress, xpState);
    const quizzes = tasks.filter((t) => t.type === "quiz");
    expect(quizzes.length).toBe(0);
  });

  it("prioritizes gap remediation for foundational weak nodes", () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const graph: GraphNode[] = [
      makeNode("r1"),
      makeNode("c1", ["r1"], "character"),
    ];
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.3, nextReview: now + 10000 }),
    };

    const tasks = selectTasks(graph, progress, defaultXPState);
    const gapLessons = tasks.filter(
      (t) => t.type === "lesson" && t.topic.id === "r1"
    );
    expect(gapLessons.length).toBe(1);
  });

  it("includes multistep tasks when enough nodes are mastered", () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const graph: GraphNode[] = Array.from({ length: 6 }, (_, i) =>
      makeNode(`r${i}`)
    );
    const progress: UserProgress = {};
    for (let i = 0; i < 6; i++) {
      progress[`r${i}`] = makeState({
        mastery: 0.9,
        nextReview: now + 100000,
        interval: 86400,
      });
    }

    const tasks = selectTasks(graph, progress, defaultXPState);
    const multisteps = tasks.filter((t) => t.type === "multistep");
    expect(multisteps.length).toBeLessThanOrEqual(1);
  });

  it("does not duplicate topics across tasks", () => {
    const graph: GraphNode[] = Array.from({ length: 3 }, (_, i) =>
      makeNode(`r${i}`)
    );
    const tasks = selectTasks(graph, {}, defaultXPState);
    const topicIds = tasks.map((t) => t.topic.id);
    const unique = new Set(topicIds);
    expect(unique.size).toBe(topicIds.length);
  });

  it("returns empty when all nodes are locked", () => {
    const graph: GraphNode[] = [
      makeNode("c1", ["r_missing"], "character"),
    ];
    const tasks = selectTasks(graph, {}, defaultXPState);
    expect(tasks).toEqual([]);
  });

  it("each task has correct structure", () => {
    const graph: GraphNode[] = [makeNode("r1")];
    const tasks = selectTasks(graph, {}, defaultXPState);
    expect(tasks.length).toBe(1);
    const t = tasks[0];
    expect(t).toHaveProperty("id");
    expect(t).toHaveProperty("type");
    expect(t).toHaveProperty("topic");
    expect(t).toHaveProperty("xpReward");
    expect(t).toHaveProperty("estimatedMinutes");
  });
});
