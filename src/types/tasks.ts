import type { GraphNode } from "./graph";

export type TaskType = "lesson" | "review" | "quiz" | "multistep" | "listening" | "speaking";

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

export interface ListeningTask extends BaseTask {
  type: "listening";
  topic: GraphNode;
  exerciseIds?: string[];
}

export type SpeakingExerciseType = "word" | "sentence" | "conversation" | "presentation";

export interface SpeakingTask extends BaseTask {
  type: "speaking";
  topic: GraphNode;
  exerciseType?: SpeakingExerciseType;
}

export type Task = LessonTask | ReviewTask | QuizTask | MultistepTask | ListeningTask | SpeakingTask;

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
  questionType?: "standard" | "cloze" | "sentence_order" | "passage_comprehension" | "pattern_match";
  passage?: string;
  passagePinyin?: string;
  modelResponse?: string;
  rubric?: string[];
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
