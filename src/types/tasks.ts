import type { GraphNode } from "./graph";

export type TaskType = "lesson" | "review" | "quiz" | "multistep";

export interface BaseTask {
  id: string;
  type: TaskType;
  xpReward: number;
  estimatedMinutes: number;
  required?: boolean;
}

export interface LessonTask extends BaseTask {
  type: "lesson";
  topic: GraphNode;
}

export interface ReviewTask extends BaseTask {
  type: "review";
  topic: GraphNode;
}

export interface QuizTask extends BaseTask {
  type: "quiz";
  topic: GraphNode;
  nodeIds: string[];
  timeLimit: number;
}

export interface MultistepTask extends BaseTask {
  type: "multistep";
  topic: GraphNode;
  scenarioId: string;
}

export type Task = LessonTask | ReviewTask | QuizTask | MultistepTask;

export interface XPState {
  totalXP: number;
  todayXP: number;
  dailyGoal: number;
  streak: number;
  lastActiveDate: string; // ISO date string YYYY-MM-DD
  tasksCompletedToday: number;
  questionsAnsweredToday: number;
  xpSinceLastQuiz: number;
}

export interface TaskResult {
  xpEarned: number;
  bonusXP: number;
  questionsAnswered: number;
  correctCount: number;
  perfectScore: boolean;
  missedTopicIds?: string[];
  totalSolveTimeSeconds?: number;
}

export interface MCQuestion {
  question: string;
  hanzi: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topicId: string;
}

export interface SessionStats {
  xpEarned: number;
  tasksCompleted: number;
  questionsAnswered: number;
  correctCount: number;
  timeSpentSeconds: number;
  perfectScores: number;
}

export interface LessonProgress {
  phase: "tutorial" | "worked_example" | "practice";
  practiceIndex: number;
  consecutiveCorrect: number;
  completed: boolean;
}
