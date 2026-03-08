import type { TaskType } from "./tasks";

export interface ActivityEntry {
  id: string;
  timestamp: number;
  date: string; // YYYY-MM-DD
  taskType: TaskType;
  topicId: string;
  topicHanzi: string;
  topicMeaning: string;
  xpEarned: number;
  questionsAnswered: number;
  correctCount: number;
  timeSpentSeconds: number;
}

export interface DailyXP {
  date: string; // YYYY-MM-DD
  xp: number;
  tasksCompleted: number;
}

export type NodeMasteryState =
  | "locked"
  | "unlocked"
  | "in_progress"
  | "mastered"
  | "needs_review";

export type SortOption = "mastery" | "last_reviewed" | "level";
export type TaskFilter = "all" | TaskType;

export type ProgressSubTab = "overview" | "map" | "topics" | "activity";
