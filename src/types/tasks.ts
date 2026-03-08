import type { GraphNode } from "./graph";

export type TaskType = "lesson" | "review" | "quiz" | "multistep";

export interface Task {
  id: string;
  type: TaskType;
  topic: GraphNode;
  xpReward: number;
  estimatedMinutes: number;
  required?: boolean;
}

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
}

export interface MCQuestion {
  question: string;
  hanzi: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topicId: string;
}
