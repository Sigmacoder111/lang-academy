import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { XPState, TaskResult } from "../types/tasks";

const PERFECT_SCORE_BONUS = 0.5;
const DEFAULT_DAILY_GOAL = 50;
const ESTIMATED_XP_PER_TOPIC = 20;
const XP_STORAGE_KEY = "lang-academy-xp";

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultXPState(): XPState {
  return {
    totalXP: 0,
    todayXP: 0,
    dailyGoal: DEFAULT_DAILY_GOAL,
    streak: 0,
    lastActiveDate: getTodayStr(),
    tasksCompletedToday: 0,
    questionsAnsweredToday: 0,
    xpSinceLastQuiz: 0,
  };
}

/**
 * Calculate XP earned for a task result.
 * Base XP is the task's xpReward. Bonus XP for perfect scores (all correct).
 */
export function calculateXP(
  baseXP: number,
  result: TaskResult
): { xpEarned: number; bonusXP: number } {
  const bonusXP = result.perfectScore ? Math.ceil(baseXP * PERFECT_SCORE_BONUS) : 0;
  return {
    xpEarned: baseXP,
    bonusXP,
  };
}

/**
 * Update XP state after completing a task.
 * Handles daily resets, streak tracking, and quiz gate progress.
 */
export function updateXPState(
  current: XPState,
  xpEarned: number,
  questionsAnswered: number,
  isQuiz: boolean
): XPState {
  const today = getTodayStr();
  let streak = current.streak;
  let todayXP = current.todayXP;
  let tasksCompletedToday = current.tasksCompletedToday;
  let questionsAnsweredToday = current.questionsAnsweredToday;

  let isNewDay = false;
  if (current.lastActiveDate !== today) {
    isNewDay = true;
    const lastDate = new Date(current.lastActiveDate);
    const todayDate = new Date(today);
    const diff = Math.floor(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff === 1 && current.todayXP >= current.dailyGoal) {
      streak = current.streak + 1;
    } else if (diff > 1) {
      streak = 0;
    }

    todayXP = 0;
    tasksCompletedToday = 0;
    questionsAnsweredToday = 0;
  }

  todayXP += xpEarned;
  tasksCompletedToday += 1;
  questionsAnsweredToday += questionsAnswered;

  if (!isNewDay && streak === 0 && todayXP > 0) {
    streak = 1;
  }

  return {
    totalXP: current.totalXP + xpEarned,
    todayXP,
    dailyGoal: current.dailyGoal,
    streak,
    lastActiveDate: today,
    tasksCompletedToday,
    questionsAnsweredToday,
    xpSinceLastQuiz: isQuiz ? 0 : current.xpSinceLastQuiz + xpEarned,
  };
}

/**
 * Estimate course completion date based on current pace.
 */
export function estimateCompletion(
  graph: GraphNode[],
  progress: UserProgress,
  xpState: XPState,
  xpHistory?: { date: string; xp: number }[]
): { estimatedDate: Date | null; daysRemaining: number; dailyPace: number } {
  const mastered = graph.filter(
    (n) => progress[n.id] && progress[n.id].mastery >= 0.8
  ).length;
  const remaining = graph.length - mastered;

  if (remaining === 0) {
    return { estimatedDate: new Date(), daysRemaining: 0, dailyPace: 0 };
  }

  let dailyPace: number;

  if (xpHistory && xpHistory.length >= 3) {
    const recentDays = xpHistory.slice(0, 14);
    const totalXP = recentDays.reduce((sum, d) => sum + d.xp, 0);
    dailyPace = totalXP / recentDays.length;
  } else if (xpState.totalXP > 0 && xpState.todayXP > 0) {
    dailyPace = xpState.todayXP;
  } else {
    dailyPace = xpState.dailyGoal;
  }

  if (dailyPace <= 0) dailyPace = xpState.dailyGoal;

  const remainingXP = remaining * ESTIMATED_XP_PER_TOPIC;
  const daysRemaining = Math.ceil(remainingXP / dailyPace);
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + daysRemaining);

  return { estimatedDate, daysRemaining, dailyPace };
}

export function loadXPState(): XPState {
  const raw = localStorage.getItem(XP_STORAGE_KEY);
  if (!raw) return defaultXPState();
  try {
    const state = JSON.parse(raw) as XPState;
    const today = getTodayStr();
    if (state.lastActiveDate !== today) {
      const lastDate = new Date(state.lastActiveDate);
      const todayDate = new Date(today);
      const diff = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        ...state,
        todayXP: 0,
        tasksCompletedToday: 0,
        questionsAnsweredToday: 0,
        lastActiveDate: today,
        streak: diff === 1 ? state.streak + 1 : diff === 0 ? state.streak : 0,
      };
    }
    return state;
  } catch {
    return defaultXPState();
  }
}

export function saveXPState(state: XPState): void {
  localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(state));
}
