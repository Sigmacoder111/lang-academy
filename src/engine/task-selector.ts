import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { Task, XPState } from "../types/tasks";
import { isUnlocked } from "./mastery";
import { needsReview, overdueScore } from "./hierarchical-srs";

const QUIZ_GATE_XP = 150;
const MAX_TASKS = 5;

/**
 * Select up to 5 optimal tasks for the student to choose from.
 * Priority order:
 *   1. Quiz gate (every ~150 XP) — required
 *   2. Overdue reviews (accounting for hierarchical SRS credit)
 *   3. Gap remediation (foundational weak nodes that block progress)
 *   4. New lessons (unlocked but not started)
 *   5. Multistep tasks (for mastered students)
 */
export function selectTasks(
  graph: GraphNode[],
  progress: UserProgress,
  xpState: XPState
): Task[] {
  const tasks: Task[] = [];
  const usedTopicIds = new Set<string>();
  const now = Date.now();

  const overdueReviews: { node: GraphNode; score: number }[] = [];
  const newUnlocked: GraphNode[] = [];
  const mastered: GraphNode[] = [];
  const conditionalRetest: GraphNode[] = [];
  const foundationalGaps: GraphNode[] = [];

  for (const node of graph) {
    if (!isUnlocked(node.id, graph, progress)) continue;

    const state = progress[node.id];
    if (state) {
      if (needsReview(node.id, progress, now)) {
        const score = overdueScore(node.id, progress, now);
        if (score > 0) {
          overdueReviews.push({ node, score });
        }
      }

      if (state.mastery >= 0.8) {
        mastered.push(node);
      }

      if (state.mastery >= 0.5 && state.mastery < 0.8 && state.totalReviews <= 2) {
        conditionalRetest.push(node);
      }

      if (state.mastery < 0.5 && state.mastery > 0) {
        const hasBlockedChildren = graph.some(
          (other) => other.prereqs.includes(node.id)
        );
        if (hasBlockedChildren) {
          foundationalGaps.push(node);
        }
      }
    } else {
      newUnlocked.push(node);
    }
  }

  overdueReviews.sort((a, b) => b.score - a.score);

  function addTask(task: Task): boolean {
    if (tasks.length >= MAX_TASKS) return false;
    if (usedTopicIds.has(task.topic.id)) return false;
    tasks.push(task);
    usedTopicIds.add(task.topic.id);
    return true;
  }

  // 1. Quiz gate — required every ~150 XP
  if (xpState.xpSinceLastQuiz >= QUIZ_GATE_XP && mastered.length >= 3) {
    const quizTopics = mastered.slice(0, Math.min(5, mastered.length));
    const quizTopic = quizTopics[Math.floor(Math.random() * quizTopics.length)];
    addTask({
      id: `quiz-${Date.now()}`,
      type: "quiz",
      topic: quizTopic,
      nodeIds: quizTopics.map((n) => n.id),
      timeLimit: 300,
      xpReward: 15,
      estimatedMinutes: 5,
      required: true,
    });
  }

  // 2. Conditional retests (diagnostic borderline topics)
  for (const node of conditionalRetest.slice(0, 1)) {
    addTask({
      id: `review-${node.id}`,
      type: "review",
      topic: node,
      xpReward: 5,
      estimatedMinutes: 3,
      required: true,
    });
  }

  // 3. Overdue reviews (hierarchical SRS-aware)
  for (const { node } of overdueReviews.slice(0, 2)) {
    addTask({
      id: `review-${node.id}`,
      type: "review",
      topic: node,
      xpReward: 5,
      estimatedMinutes: 3,
    });
  }

  // 4. Gap remediation (parallel paths)
  for (const gap of foundationalGaps.slice(0, 1)) {
    addTask({
      id: `lesson-${gap.id}`,
      type: "lesson",
      topic: gap,
      xpReward: 10,
      estimatedMinutes: 8,
    });
  }

  // 5. New lessons
  for (const node of newUnlocked) {
    if (tasks.length >= MAX_TASKS - 1) break;
    addTask({
      id: `lesson-${node.id}`,
      type: "lesson",
      topic: node,
      xpReward: 10,
      estimatedMinutes: 8,
    });
  }

  // 6. Multistep tasks
  if (mastered.length >= 4 && tasks.length < MAX_TASKS) {
    const multistepTopic = mastered[Math.floor(Math.random() * mastered.length)];
    addTask({
      id: `multistep-${Date.now()}`,
      type: "multistep",
      topic: multistepTopic,
      scenarioId: "",
      xpReward: 20,
      estimatedMinutes: 12,
    });
  }

  // Fill remaining slots
  while (tasks.length < MAX_TASKS) {
    let added = false;

    const lessonCount = tasks.filter((t) => t.type === "lesson").length;
    if (lessonCount < newUnlocked.length) {
      const node = newUnlocked.find((n) => !usedTopicIds.has(n.id));
      if (node) {
        added = addTask({
          id: `lesson-${node.id}`,
          type: "lesson",
          topic: node,
          xpReward: 10,
          estimatedMinutes: 8,
        });
        if (added) continue;
      }
    }

    const reviewIdx = overdueReviews.findIndex((r) => !usedTopicIds.has(r.node.id));
    if (reviewIdx >= 0) {
      const { node } = overdueReviews[reviewIdx];
      added = addTask({
        id: `review-${node.id}`,
        type: "review",
        topic: node,
        xpReward: 5,
        estimatedMinutes: 3,
      });
      if (added) continue;
    }

    break;
  }

  return tasks.slice(0, MAX_TASKS);
}
