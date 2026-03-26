import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { XPState } from "../types/tasks";
import { makeDefaultNodeState } from "../types/state";
import {
  getSkillReadiness,
  getReadinessColor,
  getSkillLabel,
  getDaysUntilExam,
  generateSmartSession,
  generateWeeklyPlan,
  generateDrillTask,
  detectWeakSpots,
  getExamProximityConfig,
  SKILL_AREAS,
} from "./adaptive-study";

function makeNode(
  id: string,
  prereqs: string[] = [],
  type: GraphNode["type"] = "radical",
  hskLevel?: number
): GraphNode {
  return {
    id,
    type,
    hanzi: "测",
    pinyin: "cè",
    meaning: `meaning-${id}`,
    prereqs,
    hskLevel,
    lesson: {
      tutorial: "Tutorial",
      workedExample: { problem: "Q", solution: "A" },
      practiceProblems: [
        {
          question: "Q?",
          options: ["a", "b", "c", "d"],
          correctIndex: 0,
          explanation: "Because.",
          expectedSeconds: 10,
        },
      ],
    },
  };
}

function makeState(overrides: Partial<ReturnType<typeof makeDefaultNodeState>> = {}) {
  return makeDefaultNodeState(overrides);
}

const defaultXPState: XPState = {
  totalXP: 0,
  todayXP: 0,
  dailyGoal: 50,
  streak: 0,
  lastActiveDate: "",
  tasksCompletedToday: 0,
  questionsAnsweredToday: 0,
  xpSinceLastQuiz: 0,
};

describe("adaptive-study", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-26T12:00:00Z"));
    globalThis.localStorage = {
      getItem: vi.fn((key: string) => {
        if (key === "lang-academy-ap-exam-date") return "2026-05-08";
        return null;
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    } as unknown as Storage;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getDaysUntilExam", () => {
    it("calculates days correctly", () => {
      const days = getDaysUntilExam();
      expect(days).toBe(43);
    });
  });

  describe("getSkillReadiness", () => {
    it("returns readiness for all skill areas", () => {
      const graph: GraphNode[] = [
        makeNode("r1", [], "radical"),
        makeNode("w1", [], "word"),
        makeNode("g1", [], "grammar"),
        makeNode("rd1", [], "reading"),
        makeNode("wr1", [], "writing"),
      ];
      const progress: UserProgress = {
        r1: makeState({ mastery: 0.9 }),
        w1: makeState({ mastery: 0.5 }),
      };

      const readiness = getSkillReadiness(graph, progress);
      expect(readiness.length).toBe(SKILL_AREAS.length);
      const vocab = readiness.find((r) => r.skill === "vocabulary");
      expect(vocab).toBeDefined();
      expect(vocab!.totalCount).toBeGreaterThan(0);
    });

    it("considers HSK level weighting", () => {
      const graph: GraphNode[] = [
        makeNode("w1", [], "word", 1),
        makeNode("w2", [], "word", 4),
      ];
      const progress: UserProgress = {
        w1: makeState({ mastery: 0.9 }),
        w2: makeState({ mastery: 0.2 }),
      };

      const readiness = getSkillReadiness(graph, progress);
      const vocab = readiness.find((r) => r.skill === "vocabulary")!;
      expect(vocab.readinessPercent).toBeLessThan(80);
    });
  });

  describe("getReadinessColor", () => {
    it("returns green for >= 75%", () => {
      expect(getReadinessColor(85)).toBe("#22c55e");
    });

    it("returns yellow for 50-74%", () => {
      expect(getReadinessColor(60)).toBe("#eab308");
    });

    it("returns red for < 50%", () => {
      expect(getReadinessColor(30)).toBe("#ef4444");
    });
  });

  describe("getSkillLabel", () => {
    it("capitalizes skill name", () => {
      expect(getSkillLabel("listening")).toBe("Listening");
      expect(getSkillLabel("grammar")).toBe("Grammar");
    });
  });

  describe("generateSmartSession", () => {
    it("creates a session plan with segments", () => {
      const graph: GraphNode[] = [
        makeNode("r1", [], "radical"),
        makeNode("w1", [], "word"),
        makeNode("g1", [], "grammar"),
      ];
      const progress: UserProgress = {
        r1: makeState({ mastery: 0.9, nextReview: Date.now() + 100000 }),
      };

      const plan = generateSmartSession(20, graph, progress, defaultXPState);
      expect(plan.totalMinutes).toBe(20);
      expect(plan.segments.length).toBeGreaterThan(0);

      const totalAllocated = plan.segments.reduce((sum, s) => sum + s.minutes, 0);
      expect(totalAllocated).toBeLessThanOrEqual(20);
    });
  });

  describe("generateWeeklyPlan", () => {
    it("generates a plan with recommendations", () => {
      const graph: GraphNode[] = [
        makeNode("r1", [], "radical"),
        makeNode("w1", [], "word"),
        makeNode("g1", [], "grammar"),
      ];
      const progress: UserProgress = {};

      const plan = generateWeeklyPlan(graph, progress, 30);
      expect(plan.dailyMinutes).toBe(30);
      expect(plan.daysUntilExam).toBe(43);
      expect(plan.recommendations.length).toBeGreaterThan(0);
      expect(plan.weeklyFocusMessage).toContain("This week, focus on:");
    });
  });

  describe("detectWeakSpots", () => {
    it("returns empty for no progress", () => {
      const graph: GraphNode[] = [makeNode("r1")];
      expect(detectWeakSpots(graph, {})).toEqual([]);
    });

    it("detects weak skill areas", () => {
      const graph: GraphNode[] = [
        makeNode("r1", [], "radical"),
        makeNode("g1", [], "grammar"),
      ];
      const progress: UserProgress = {
        r1: makeState({ mastery: 0.2 }),
        g1: makeState({ mastery: 0.2 }),
      };

      const weak = detectWeakSpots(graph, progress);
      expect(weak.length).toBeGreaterThan(0);
    });
  });

  describe("generateDrillTask", () => {
    it("generates a drill for a weak skill area", () => {
      const graph: GraphNode[] = [
        makeNode("g1", [], "grammar"),
        makeNode("g2", [], "grammar"),
      ];
      const progress: UserProgress = {
        g1: makeState({ mastery: 0.3 }),
        g2: makeState({ mastery: 0.2 }),
      };

      const drill = generateDrillTask("grammar", graph, progress);
      expect(drill).not.toBeNull();
      expect(drill!.type).toBe("drill");
      if (drill!.type === "drill") {
        expect(drill!.skillArea).toBe("grammar");
        expect(drill!.nodeIds.length).toBeGreaterThan(0);
      }
    });

    it("returns null when no weak nodes are unlocked", () => {
      const graph: GraphNode[] = [
        makeNode("g1", ["missing_prereq"], "grammar"),
      ];
      const progress: UserProgress = {};

      const drill = generateDrillTask("grammar", graph, progress);
      expect(drill).toBeNull();
    });
  });

  describe("getExamProximityConfig", () => {
    it("returns review-only mode at < 7 days", () => {
      vi.setSystemTime(new Date("2026-05-03T12:00:00Z"));
      const config = getExamProximityConfig();
      expect(config.reviewOnlyMode).toBe(true);
      expect(config.newMaterialAllowed).toBe(false);
      expect(config.weaknessBoostFactor).toBe(3.0);
    });

    it("returns heavy review mode at < 14 days", () => {
      vi.setSystemTime(new Date("2026-04-26T12:00:00Z"));
      const config = getExamProximityConfig();
      expect(config.reviewOnlyMode).toBe(false);
      expect(config.heavyReviewMode).toBe(true);
      expect(config.weaknessBoostFactor).toBe(2.5);
    });

    it("returns moderate boost at < 30 days", () => {
      vi.setSystemTime(new Date("2026-04-15T12:00:00Z"));
      const config = getExamProximityConfig();
      expect(config.reviewOnlyMode).toBe(false);
      expect(config.heavyReviewMode).toBe(false);
      expect(config.weaknessBoostFactor).toBe(1.8);
    });

    it("returns no boost at > 30 days", () => {
      vi.setSystemTime(new Date("2026-03-01T12:00:00Z"));
      const config = getExamProximityConfig();
      expect(config.weaknessBoostFactor).toBe(1.0);
      expect(config.newMaterialAllowed).toBe(true);
    });
  });
});
