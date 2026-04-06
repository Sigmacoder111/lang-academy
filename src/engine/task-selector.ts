import type { GraphNode, NodeType } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { Task, XPState } from "../types/tasks";
import type { ThemeWeights } from "../data/themes";
import { isUnlocked } from "./mastery";
import { needsReview, overdueScore } from "./hierarchical-srs";
import {
  getExamProximityConfig,
  detectWeakSpots,
  generateDrillTask,
} from "./adaptive-study";
import { getRandomWritingPrompt } from "../data/writing-prompts";

const QUIZ_GATE_XP = 150;
const MAX_TASKS = 5;

export interface CategoryWeights {
  vocabulary: number;
  grammar: number;
  reading: number;
  writing: number;
}

export const DEFAULT_CATEGORY_WEIGHTS: CategoryWeights = {
  vocabulary: 0.50,
  grammar: 0.25,
  reading: 0.15,
  writing: 0.10,
};

function getNodeCategory(type: NodeType): keyof CategoryWeights {
  if (type === "radical" || type === "character" || type === "word") return "vocabulary";
  if (type === "grammar") return "grammar";
  if (type === "reading") return "reading";
  return "writing";
}

function getThemeWeight(node: GraphNode, themeWeights?: ThemeWeights): number {
  if (!themeWeights || !node.themes || node.themes.length === 0) return 1;
  let maxWeight = 0;
  for (const theme of node.themes) {
    const w = themeWeights[theme] ?? 1;
    if (w > maxWeight) maxWeight = w;
  }
  return maxWeight;
}

function getWeaknessWeight(
  node: GraphNode,
  progress: UserProgress,
  boostFactor: number
): number {
  if (boostFactor <= 1) return 1;
  const state = progress[node.id];
  if (!state) return boostFactor;
  if (state.mastery < 0.5) return boostFactor;
  if (state.mastery < 0.8) return 1 + (boostFactor - 1) * 0.5;
  return 1;
}

function weightedShuffle(
  nodes: GraphNode[],
  weights: CategoryWeights,
  themeWeights?: ThemeWeights,
  progress?: UserProgress,
  weaknessBoost?: number
): GraphNode[] {
  const scored = nodes.map((node) => {
    const cat = getNodeCategory(node.type);
    const catWeight = weights[cat];
    const tw = getThemeWeight(node, themeWeights);
    const ww = progress && weaknessBoost
      ? getWeaknessWeight(node, progress, weaknessBoost)
      : 1;
    return { node, score: Math.random() * catWeight * tw * ww };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.node);
}

/**
 * Select up to 5 optimal tasks for the student to choose from.
 * Uses category weights to balance vocabulary, grammar, reading, and writing.
 * Optionally applies theme weights to bias toward specific AP themes.
 * Auto-rebalances as the AP exam approaches:
 * - < 30 days: increased weight on weakest areas
 * - < 14 days: heavy review + speaking/writing practice
 * - < 7 days: review only, no new material
 */
export function selectTasks(
  graph: GraphNode[],
  progress: UserProgress,
  xpState: XPState,
  categoryWeights: CategoryWeights = DEFAULT_CATEGORY_WEIGHTS,
  themeWeights?: ThemeWeights
): Task[] {
  const tasks: Task[] = [];
  const usedTopicIds = new Set<string>();
  const now = Date.now();

  const examConfig = getExamProximityConfig();

  const overdueReviews: { node: GraphNode; score: number }[] = [];
  const newUnlocked: GraphNode[] = [];
  const mastered: GraphNode[] = [];
  const conditionalRetest: GraphNode[] = [];
  const foundationalGaps: GraphNode[] = [];

  for (const node of graph) {
    if (!isUnlocked(node.id, graph, progress)) continue;
    if (node.meaning.startsWith("component of")) continue;

    const state = progress[node.id];
    if (state) {
      if (needsReview(node.id, progress, now)) {
        let score = overdueScore(node.id, progress, now);
        if (examConfig.weaknessBoostFactor > 1 && state.mastery < 0.5) {
          score *= examConfig.weaknessBoostFactor;
        }
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

  const weightedNewUnlocked = weightedShuffle(
    newUnlocked,
    categoryWeights,
    themeWeights,
    progress,
    examConfig.weaknessBoostFactor
  );

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

  // 3. Overdue reviews — in review-only mode, fill more slots with reviews
  const reviewSlots = examConfig.reviewOnlyMode ? 4 : examConfig.heavyReviewMode ? 3 : 2;
  for (const { node } of overdueReviews.slice(0, reviewSlots)) {
    addTask({
      id: `review-${node.id}`,
      type: "review",
      topic: node,
      xpReward: 5,
      estimatedMinutes: 3,
    });
  }

  // In review-only mode (< 7 days before exam), skip new material
  if (!examConfig.reviewOnlyMode) {
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

    // 5. New lessons — weighted by category (skip if new material not allowed)
    if (examConfig.newMaterialAllowed) {
      for (const node of weightedNewUnlocked) {
        if (tasks.length >= MAX_TASKS - 1) break;
        addTask({
          id: `lesson-${node.id}`,
          type: "lesson",
          topic: node,
          xpReward: 10,
          estimatedMinutes: 8,
        });
      }
    }
  }

  // 5b. Weak Spot Drill — inject when system detects a specific weakness
  const weakSpots = detectWeakSpots(graph, progress);
  if (weakSpots.length > 0 && tasks.length < MAX_TASKS) {
    const drillTask = generateDrillTask(weakSpots[0], graph, progress);
    if (drillTask) {
      addTask(drillTask);
    }
  }

  // 6. Listening tasks
  if (mastered.length >= 2 && tasks.length < MAX_TASKS) {
    const vocabNodes = mastered.filter(
      (n) => n.type === "word" || n.type === "character"
    );
    const listeningTopic =
      vocabNodes.length > 0
        ? vocabNodes[Math.floor(Math.random() * vocabNodes.length)]
        : mastered[Math.floor(Math.random() * mastered.length)];
    addTask({
      id: `listening-${Date.now()}`,
      type: "listening",
      topic: listeningTopic,
      xpReward: 6,
      estimatedMinutes: 5,
    });
  }

  // 7. Speaking tasks — boost priority in heavy review mode (< 14 days)
  if (mastered.length >= 2 && tasks.length < MAX_TASKS) {
    const speakingCandidates = mastered.filter(
      (n) => n.type === "word" || n.type === "character" || n.type === "grammar"
    );
    const speakingTopic =
      speakingCandidates.length > 0
        ? speakingCandidates[Math.floor(Math.random() * speakingCandidates.length)]
        : mastered[Math.floor(Math.random() * mastered.length)];
    addTask({
      id: `speaking-${Date.now()}`,
      type: "speaking",
      topic: speakingTopic,
      xpReward: 8,
      estimatedMinutes: 6,
    });
  }

  // 8. Writing tasks — high-value practice for AP exam
  if (mastered.length >= 3 && tasks.length < MAX_TASKS) {
    const writingFormat = Math.random() < 0.5 ? "story_narration" as const : "email_response" as const;
    const writingPrompt = getRandomWritingPrompt(writingFormat);
    const writingTopic = mastered.filter(
      (n) => n.type === "writing" || n.type === "grammar" || n.type === "word"
    );
    const writingNode =
      writingTopic.length > 0
        ? writingTopic[Math.floor(Math.random() * writingTopic.length)]
        : mastered[Math.floor(Math.random() * mastered.length)];
    addTask({
      id: `writing-${Date.now()}`,
      type: "writing",
      topic: writingNode,
      writingFormat,
      promptId: writingPrompt.id,
      xpReward: 18,
      estimatedMinutes: 15,
    });
  }

  // 9. Multistep tasks (skip in review-only mode)
  if (!examConfig.reviewOnlyMode && mastered.length >= 4 && tasks.length < MAX_TASKS) {
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

    // In review-only mode, only fill with reviews
    if (examConfig.reviewOnlyMode) {
      const reviewIdx = overdueReviews.findIndex((r) => !usedTopicIds.has(r.node.id));
      if (reviewIdx >= 0) {
        const { node: rNode } = overdueReviews[reviewIdx];
        added = addTask({
          id: `review-${rNode.id}`,
          type: "review",
          topic: rNode,
          xpReward: 5,
          estimatedMinutes: 3,
        });
        if (added) continue;
      }
      break;
    }

    const node = weightedNewUnlocked.find((n) => !usedTopicIds.has(n.id));
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

    const reviewIdx = overdueReviews.findIndex((r) => !usedTopicIds.has(r.node.id));
    if (reviewIdx >= 0) {
      const { node: rNode } = overdueReviews[reviewIdx];
      added = addTask({
        id: `review-${rNode.id}`,
        type: "review",
        topic: rNode,
        xpReward: 5,
        estimatedMinutes: 3,
      });
      if (added) continue;
    }

    break;
  }

  return tasks.slice(0, MAX_TASKS);
}
