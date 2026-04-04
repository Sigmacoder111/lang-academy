import type { GraphNode, NodeType } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { Task, SkillArea } from "../types/tasks";
import { loadAPExamDate } from "../data/themes";
import { isUnlocked } from "./mastery";
import { needsReview, overdueScore } from "./hierarchical-srs";

export const SKILL_AREAS: SkillArea[] = [
  "listening", "reading", "writing", "speaking", "vocabulary", "grammar",
];

const AP_EXAM_SECTION_WEIGHTS: Record<SkillArea, number> = {
  listening: 0.25,
  reading: 0.25,
  writing: 0.167,
  speaking: 0.167,
  vocabulary: 0.083,
  grammar: 0.083,
};

function nodeTypeToSkillArea(type: NodeType): SkillArea {
  if (type === "radical" || type === "character" || type === "word") return "vocabulary";
  if (type === "grammar") return "grammar";
  if (type === "reading") return "reading";
  return "writing";
}

export function getDaysUntilExam(): number {
  const examDate = loadAPExamDate();
  const target = new Date(examDate);
  const now = new Date();
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export function getExamDateFormatted(): string {
  const examDate = loadAPExamDate();
  return new Date(examDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

export interface SkillReadiness {
  skill: SkillArea;
  readinessPercent: number;
  masteredCount: number;
  totalCount: number;
  weakNodes: { node: GraphNode; mastery: number }[];
}

export function getSkillReadiness(
  graph: GraphNode[],
  progress: UserProgress
): SkillReadiness[] {
  const skillBuckets: Record<SkillArea, GraphNode[]> = {
    listening: [],
    reading: [],
    writing: [],
    speaking: [],
    vocabulary: [],
    grammar: [],
  };

  for (const node of graph) {
    if (node.meaning.startsWith("component of")) continue;
    const skill = nodeTypeToSkillArea(node.type);
    skillBuckets[skill].push(node);
  }

  // Listening/speaking nodes are inferred from vocabulary/grammar nodes that have been mastered
  // plus any explicit listening/reading/writing nodes
  // We also count mastered vocab as partial listening/speaking readiness
  const vocabNodes = [...skillBuckets.vocabulary, ...skillBuckets.grammar];

  if (skillBuckets.listening.length === 0) {
    skillBuckets.listening = vocabNodes;
  }
  if (skillBuckets.speaking.length === 0) {
    skillBuckets.speaking = vocabNodes;
  }

  return SKILL_AREAS.map((skill) => {
    const nodes = skillBuckets[skill];
    if (nodes.length === 0) {
      return {
        skill,
        readinessPercent: 0,
        masteredCount: 0,
        totalCount: 0,
        weakNodes: [],
      };
    }

    let weightedMastery = 0;
    let weightedTotal = 0;
    const weakNodes: { node: GraphNode; mastery: number }[] = [];

    for (const node of nodes) {
      const state = progress[node.id];
      const mastery = state?.mastery ?? 0;
      const hskWeight = node.hskLevel ? Math.max(1, node.hskLevel) : 1;

      weightedMastery += mastery * hskWeight;
      weightedTotal += hskWeight;

      if (mastery < 0.8) {
        weakNodes.push({ node, mastery });
      }
    }

    weakNodes.sort((a, b) => a.mastery - b.mastery);

    const readinessPercent =
      weightedTotal > 0 ? Math.round((weightedMastery / weightedTotal) * 100) : 0;

    const masteredCount = nodes.filter(
      (n) => progress[n.id] && progress[n.id].mastery >= 0.8
    ).length;

    return {
      skill,
      readinessPercent,
      masteredCount,
      totalCount: nodes.length,
      weakNodes,
    };
  });
}

export function getReadinessColor(percent: number): string {
  if (percent >= 75) return "#22c55e";
  if (percent >= 50) return "#eab308";
  return "#ef4444";
}

export function getSkillLabel(skill: SkillArea): string {
  return skill.charAt(0).toUpperCase() + skill.slice(1);
}

// --- Smart Session Generator ---

export interface SessionPlan {
  totalMinutes: number;
  segments: SessionSegment[];
}

export interface SessionSegment {
  skill: SkillArea;
  minutes: number;
  tasks: Task[];
}

export function generateSmartSession(
  totalMinutes: number,
  graph: GraphNode[],
  progress: UserProgress
): SessionPlan {
  const readiness = getSkillReadiness(graph, progress);
  const now = Date.now();

  // Calculate weakness scores: lower readiness = higher weight
  const weaknessScores: { skill: SkillArea; score: number }[] = readiness.map((r) => ({
    skill: r.skill,
    score: Math.max(0.05, (100 - r.readinessPercent) / 100) * AP_EXAM_SECTION_WEIGHTS[r.skill],
  }));

  const totalScore = weaknessScores.reduce((sum, w) => sum + w.score, 0);

  // Allocate time proportionally to weakness scores (minimum 2 min per included skill)
  const segments: SessionSegment[] = [];
  let remainingMinutes = totalMinutes;

  const sortedSkills = [...weaknessScores].sort((a, b) => b.score - a.score);

  for (const { skill, score } of sortedSkills) {
    if (remainingMinutes <= 0) break;
    const proportion = totalScore > 0 ? score / totalScore : 1 / sortedSkills.length;
    let minutes = Math.round(totalMinutes * proportion);
    if (minutes < 2) minutes = 0;
    if (minutes > remainingMinutes) minutes = remainingMinutes;
    if (minutes === 0) continue;

    const skillReadiness = readiness.find((r) => r.skill === skill)!;
    const tasks = generateSkillTasks(minutes, skillReadiness, graph, progress, now);

    segments.push({ skill, minutes, tasks });
    remainingMinutes -= minutes;
  }

  // Distribute any remaining time to the weakest skill
  if (remainingMinutes > 0 && segments.length > 0) {
    segments[0].minutes += remainingMinutes;
  }

  return { totalMinutes, segments };
}

function generateSkillTasks(
  minutes: number,
  readiness: SkillReadiness,
  graph: GraphNode[],
  progress: UserProgress,
  now: number
): Task[] {
  const tasks: Task[] = [];
  const weakNodes = readiness.weakNodes.slice(0, 10);

  if (weakNodes.length === 0) return tasks;

  const overdueNodes: { node: GraphNode; score: number }[] = [];
  const newNodes: GraphNode[] = [];

  for (const { node } of weakNodes) {
    const state = progress[node.id];
    if (state && needsReview(node.id, progress, now)) {
      const score = overdueScore(node.id, progress, now);
      overdueNodes.push({ node, score });
    } else if (!state && isUnlocked(node.id, graph, progress)) {
      newNodes.push(node);
    }
  }

  overdueNodes.sort((a, b) => b.score - a.score);

  let allocatedMinutes = 0;

  for (const { node } of overdueNodes) {
    if (allocatedMinutes >= minutes) break;
    tasks.push({
      id: `session-review-${node.id}-${now}`,
      type: "review",
      topic: node,
      xpReward: 5,
      estimatedMinutes: 3,
    });
    allocatedMinutes += 3;
  }

  for (const node of newNodes) {
    if (allocatedMinutes >= minutes) break;
    tasks.push({
      id: `session-lesson-${node.id}-${now}`,
      type: "lesson",
      topic: node,
      xpReward: 10,
      estimatedMinutes: 8,
    });
    allocatedMinutes += 8;
  }

  return tasks;
}

// --- Weekly Study Plan ---

export interface WeeklyPlan {
  dailyMinutes: number;
  daysUntilExam: number;
  recommendations: WeeklyRecommendation[];
  weeklyFocusMessage: string;
}

export interface WeeklyRecommendation {
  skill: SkillArea;
  sessions: number;
  minutesPerSession: number;
  priority: "high" | "medium" | "low";
}

export function generateWeeklyPlan(
  graph: GraphNode[],
  progress: UserProgress,
  dailyMinutes: number = 30
): WeeklyPlan {
  const daysUntilExam = getDaysUntilExam();
  const readiness = getSkillReadiness(graph, progress);
  const weeklyMinutes = dailyMinutes * 7;

  // Weight = (100 - readiness%) * AP section weight * urgency multiplier
  const urgencyMultiplier = daysUntilExam < 14 ? 2 : daysUntilExam < 30 ? 1.5 : 1;

  const weights: { skill: SkillArea; weight: number; readinessPercent: number }[] = readiness.map((r) => ({
    skill: r.skill,
    weight:
      Math.max(0.05, (100 - r.readinessPercent) / 100) *
      AP_EXAM_SECTION_WEIGHTS[r.skill] *
      urgencyMultiplier,
    readinessPercent: r.readinessPercent,
  }));

  // For < 7 days: heavy review focus
  if (daysUntilExam < 7) {
    for (const w of weights) {
      if (w.skill === "speaking" || w.skill === "writing") {
        w.weight *= 1.5;
      }
    }
  }

  // For < 14 days: boost speaking/writing (free-response sections)
  if (daysUntilExam < 14 && daysUntilExam >= 7) {
    for (const w of weights) {
      if (w.skill === "speaking" || w.skill === "writing") {
        w.weight *= 1.3;
      }
    }
  }

  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);

  const recommendations: WeeklyRecommendation[] = weights
    .sort((a, b) => b.weight - a.weight)
    .map((w) => {
      const proportion = totalWeight > 0 ? w.weight / totalWeight : 1 / weights.length;
      const skillMinutes = Math.round(weeklyMinutes * proportion);
      const sessionLen = w.skill === "speaking" || w.skill === "writing" ? 20 : 15;
      const sessions = Math.max(1, Math.round(skillMinutes / sessionLen));

      let priority: "high" | "medium" | "low" = "low";
      if (w.readinessPercent < 50) priority = "high";
      else if (w.readinessPercent < 75) priority = "medium";

      return {
        skill: w.skill,
        sessions,
        minutesPerSession: sessionLen,
        priority,
      };
    })
    .filter((r) => r.sessions > 0);

  const topFocus = recommendations
    .slice(0, 4)
    .map((r) => `${getSkillLabel(r.skill)} (${r.sessions} sessions)`)
    .join(", ");

  const weeklyFocusMessage = `This week, focus on: ${topFocus}`;

  return {
    dailyMinutes,
    daysUntilExam,
    recommendations,
    weeklyFocusMessage,
  };
}

// --- Weekly Plan Storage ---

const WEEKLY_PLAN_DAILY_MINUTES_KEY = "lang-academy-daily-study-minutes";

export function loadDailyStudyMinutes(): number {
  const val = localStorage.getItem(WEEKLY_PLAN_DAILY_MINUTES_KEY);
  return val ? parseInt(val, 10) : 30;
}

export function saveDailyStudyMinutes(minutes: number): void {
  localStorage.setItem(WEEKLY_PLAN_DAILY_MINUTES_KEY, String(minutes));
}

// --- Weak Spot Drill Generator ---

export function generateDrillTask(
  skill: SkillArea,
  graph: GraphNode[],
  progress: UserProgress
): Task | null {
  const readiness = getSkillReadiness(graph, progress);
  const skillData = readiness.find((r) => r.skill === skill);
  if (!skillData || skillData.weakNodes.length === 0) return null;

  const unlockedWeakNodes = skillData.weakNodes.filter(
    ({ node }) => isUnlocked(node.id, graph, progress)
  );
  if (unlockedWeakNodes.length === 0) return null;

  const drillNodes = unlockedWeakNodes.slice(0, 10);
  const topicNode = drillNodes[0].node;

  return {
    id: `drill-${skill}-${Date.now()}`,
    type: "drill",
    topic: topicNode,
    skillArea: skill,
    nodeIds: drillNodes.map((d) => d.node.id),
    xpReward: 8,
    estimatedMinutes: 5,
  };
}

export function detectWeakSpots(
  graph: GraphNode[],
  progress: UserProgress
): SkillArea[] {
  // Only detect weak spots if the student has some progress
  const hasProgress = Object.keys(progress).length > 0;
  if (!hasProgress) return [];

  const readiness = getSkillReadiness(graph, progress);

  // Only report weak spots for skills with unlocked content to drill
  return readiness
    .filter((r) => {
      if (r.readinessPercent >= 50 || r.totalCount === 0) return false;
      const hasUnlockedWeak = r.weakNodes.some(
        ({ node }) => isUnlocked(node.id, graph, progress)
      );
      return hasUnlockedWeak;
    })
    .sort((a, b) => a.readinessPercent - b.readinessPercent)
    .map((r) => r.skill);
}

// --- Exam Proximity Weights for Task Selector ---

export interface ExamProximityConfig {
  daysUntilExam: number;
  reviewOnlyMode: boolean;
  heavyReviewMode: boolean;
  weaknessBoostFactor: number;
  newMaterialAllowed: boolean;
}

export function getExamProximityConfig(): ExamProximityConfig {
  const daysUntilExam = getDaysUntilExam();

  if (daysUntilExam <= 7) {
    return {
      daysUntilExam,
      reviewOnlyMode: true,
      heavyReviewMode: true,
      weaknessBoostFactor: 3.0,
      newMaterialAllowed: false,
    };
  }

  if (daysUntilExam <= 14) {
    return {
      daysUntilExam,
      reviewOnlyMode: false,
      heavyReviewMode: true,
      weaknessBoostFactor: 2.5,
      newMaterialAllowed: true,
    };
  }

  if (daysUntilExam <= 30) {
    return {
      daysUntilExam,
      reviewOnlyMode: false,
      heavyReviewMode: false,
      weaknessBoostFactor: 1.8,
      newMaterialAllowed: true,
    };
  }

  return {
    daysUntilExam,
    reviewOnlyMode: false,
    heavyReviewMode: false,
    weaknessBoostFactor: 1.0,
    newMaterialAllowed: true,
  };
}
