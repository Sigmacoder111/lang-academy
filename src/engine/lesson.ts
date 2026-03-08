import type { GraphNode } from "../types/graph";
import type { LessonProgress } from "../types/tasks";

const CONSECUTIVE_CORRECT_TO_ADVANCE = 2;

/**
 * Create initial lesson progress state.
 * Lessons follow: tutorial → worked example → practice problems.
 */
export function startLesson(): LessonProgress {
  return {
    phase: "tutorial",
    practiceIndex: 0,
    consecutiveCorrect: 0,
    completed: false,
  };
}

/**
 * Advance lesson state based on user interaction.
 * - Tutorial phase: advance to worked example on any interaction
 * - Worked example phase: advance to practice on any interaction
 * - Practice phase: requires 2 correct in a row per problem to advance.
 *   If incorrect, reset consecutive count and stay on same problem.
 */
export function advanceLesson(
  lessonState: LessonProgress,
  topic: GraphNode,
  correct?: boolean
): LessonProgress {
  if (lessonState.completed) return lessonState;

  if (lessonState.phase === "tutorial") {
    return {
      ...lessonState,
      phase: "worked_example",
    };
  }

  if (lessonState.phase === "worked_example") {
    return {
      ...lessonState,
      phase: "practice",
      practiceIndex: 0,
      consecutiveCorrect: 0,
    };
  }

  if (lessonState.phase === "practice") {
    const totalProblems = topic.lesson.practiceProblems.length;
    if (totalProblems === 0) {
      return { ...lessonState, completed: true };
    }

    if (correct === undefined) return lessonState;

    if (correct) {
      const newConsecutive = lessonState.consecutiveCorrect + 1;

      if (newConsecutive >= CONSECUTIVE_CORRECT_TO_ADVANCE) {
        const nextIndex = lessonState.practiceIndex + 1;
        if (nextIndex >= totalProblems) {
          return {
            ...lessonState,
            consecutiveCorrect: newConsecutive,
            completed: true,
          };
        }
        return {
          ...lessonState,
          practiceIndex: nextIndex,
          consecutiveCorrect: 0,
        };
      }

      return {
        ...lessonState,
        consecutiveCorrect: newConsecutive,
      };
    } else {
      return {
        ...lessonState,
        consecutiveCorrect: 0,
      };
    }
  }

  return lessonState;
}

/**
 * Get the current practice problem for the lesson, if in practice phase.
 */
export function getCurrentProblem(
  lessonState: LessonProgress,
  topic: GraphNode
) {
  if (lessonState.phase !== "practice") return null;
  const problems = topic.lesson.practiceProblems;
  if (lessonState.practiceIndex >= problems.length) return null;
  return problems[lessonState.practiceIndex];
}

/**
 * Calculate lesson completion percentage for progress display.
 */
export function lessonProgressPercent(
  lessonState: LessonProgress,
  topic: GraphNode
): number {
  const totalProblems = topic.lesson.practiceProblems.length;

  if (lessonState.completed) return 100;
  if (lessonState.phase === "tutorial") return 0;
  if (lessonState.phase === "worked_example") return 15;

  if (totalProblems === 0) return 50;
  const problemProgress = lessonState.practiceIndex / totalProblems;
  return 15 + problemProgress * 85;
}
