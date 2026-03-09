import type { GraphNode, DiagnosticQuestion, DiagnosticQuestionFormat } from "../types/graph";
import type { NodeState, UserProgress } from "../types/state";
import { makeDefaultNodeState } from "../types/state";

// --- Types ---

export interface DiagnosticResponse {
  nodeId: string;
  correct: boolean;
  solveTimeSeconds: number;
  expectedSeconds: number;
}

export interface DiagnosticState {
  phase: "adaptive_search" | "frontier_refinement" | "complete";
  currentLevel: number;
  responses: DiagnosticResponse[];
  boundaryLevel: number | null;
  conditionalTopics: string[];
  foundationalGaps: string[];
  testedNodeIds: Set<string>;
  askedQuestionIds: Set<string>;
  pinyinQuestionCount: number;
  levelScores: Record<number, { correct: number; total: number; weightedScore: number }>;
  questionCount: number;
  startedAt: number;
}

export interface DiagnosticReport {
  placementLevel: number;
  masteryByLevel: Record<number, { total: number; mastered: number; conditional: number }>;
  foundationalGaps: Array<{ nodeId: string; blocksCount: number }>;
  estimatedCompletionDates: Array<{ dailyXP: number; date: string; beforeTarget: boolean }>;
  recommendedDailyXP: number;
  topicsAssessed: Array<{ nodeId: string; correct: boolean; fast: boolean }>;
  nodesAutoMastered: number;
  nodesToStudy: number;
  totalQuestions: number;
  totalTimeSeconds: number;
}

export interface SerializedDiagnosticState {
  phase: DiagnosticState["phase"];
  currentLevel: number;
  responses: DiagnosticResponse[];
  boundaryLevel: number | null;
  conditionalTopics: string[];
  foundationalGaps: string[];
  testedNodeIds: string[];
  askedQuestionIds: string[];
  pinyinQuestionCount: number;
  levelScores: Record<number, { correct: number; total: number; weightedScore: number }>;
  questionCount: number;
  startedAt: number;
}

// --- Constants ---

const HSK_LEVELS = [1, 2, 3, 4, 5, 6];
const START_LEVEL = 3;
const QUESTIONS_PER_LEVEL = 3;
const ADAPTIVE_PHASE_MIN = 15;
const FRONTIER_PHASE_MAX = 20;
const TOTAL_MAX = 35;
const MAX_PINYIN_QUESTIONS = 4;
const FAST_THRESHOLD_RATIO = 1.2;
const ESTIMATED_XP_PER_TOPIC = 20;
const AP_EXAM_DATE = "2026-05-08";
const DIAGNOSTIC_STORAGE_KEY = "lang-academy-diagnostic";
const XP_PACES = [30, 50, 80];

// --- Serialization ---

export function serializeDiagnosticState(state: DiagnosticState): SerializedDiagnosticState {
  return {
    ...state,
    testedNodeIds: [...state.testedNodeIds],
    askedQuestionIds: [...state.askedQuestionIds],
  };
}

export function deserializeDiagnosticState(raw: SerializedDiagnosticState): DiagnosticState {
  return {
    ...raw,
    testedNodeIds: new Set(raw.testedNodeIds),
    askedQuestionIds: new Set(raw.askedQuestionIds ?? []),
    pinyinQuestionCount: raw.pinyinQuestionCount ?? 0,
  };
}

export function saveDiagnosticState(state: DiagnosticState): void {
  localStorage.setItem(DIAGNOSTIC_STORAGE_KEY, JSON.stringify(serializeDiagnosticState(state)));
}

export function loadDiagnosticState(): DiagnosticState | null {
  const raw = localStorage.getItem(DIAGNOSTIC_STORAGE_KEY);
  if (!raw) return null;
  try {
    return deserializeDiagnosticState(JSON.parse(raw) as SerializedDiagnosticState);
  } catch {
    return null;
  }
}

export function clearDiagnosticState(): void {
  localStorage.removeItem(DIAGNOSTIC_STORAGE_KEY);
}

// --- Helpers ---

function getNodesByLevel(graph: GraphNode[]): Record<number, GraphNode[]> {
  const byLevel: Record<number, GraphNode[]> = {};
  for (const level of HSK_LEVELS) {
    byLevel[level] = [];
  }
  for (const node of graph) {
    const level = node.hskLevel ?? 1;
    if (byLevel[level]) {
      byLevel[level].push(node);
    }
  }
  return byLevel;
}

function isFast(solveTimeSeconds: number, expectedSeconds: number): boolean {
  return solveTimeSeconds <= expectedSeconds * FAST_THRESHOLD_RATIO;
}

function responseWeight(correct: boolean, fast: boolean): number {
  if (correct && fast) return 1.0;
  if (correct && !fast) return 0.6;
  return 0.0;
}

function countDependents(nodeId: string, graph: GraphNode[]): number {
  return graph.filter((n) => n.prereqs.includes(nodeId)).length;
}

// --- Core Functions ---

export function startDiagnostic(): DiagnosticState {
  return {
    phase: "adaptive_search",
    currentLevel: START_LEVEL,
    responses: [],
    boundaryLevel: null,
    conditionalTopics: [],
    foundationalGaps: [],
    testedNodeIds: new Set(),
    askedQuestionIds: new Set(),
    pinyinQuestionCount: 0,
    levelScores: {},
    questionCount: 0,
    startedAt: Date.now(),
  };
}

export function getDiagnosticProblem(
  state: DiagnosticState,
  diagnosticBank: DiagnosticQuestion[]
): { question: DiagnosticQuestion } | null {
  if (state.phase === "complete") return null;
  if (state.questionCount >= TOTAL_MAX) return null;

  // Intersperse pinyin questions: every ~8 questions, try to insert one
  const pinyinInterval = Math.floor(TOTAL_MAX / (MAX_PINYIN_QUESTIONS + 1));
  if (
    state.pinyinQuestionCount < MAX_PINYIN_QUESTIONS &&
    state.questionCount > 0 &&
    state.questionCount % pinyinInterval === 0
  ) {
    const pinyinQ = getPinyinQuestion(state, diagnosticBank);
    if (pinyinQ) return pinyinQ;
  }

  if (state.phase === "adaptive_search") {
    return getAdaptiveQuestion(state, diagnosticBank);
  }

  return getFrontierQuestion(state, diagnosticBank);
}

function getPinyinQuestion(
  state: DiagnosticState,
  bank: DiagnosticQuestion[]
): { question: DiagnosticQuestion } | null {
  const level = state.currentLevel;
  const searchLevels = [level, level - 1, level + 1, level - 2, level + 2]
    .filter((l) => l >= 1 && l <= 6);

  for (const l of searchLevels) {
    const candidates = bank.filter(
      (q) =>
        q.hskLevel === l &&
        q.format === "pinyin_to_character" &&
        !state.askedQuestionIds.has(q.id)
    );
    if (candidates.length > 0) {
      return { question: pickRandom(candidates) };
    }
  }
  return null;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getAdaptiveQuestion(
  state: DiagnosticState,
  bank: DiagnosticQuestion[]
): { question: DiagnosticQuestion } | null {
  const level = state.currentLevel;

  const allowedFormats: DiagnosticQuestionFormat[] = [
    "character_to_meaning",
    "sentence_context",
  ];

  const candidates = bank.filter(
    (q) =>
      q.hskLevel === level &&
      allowedFormats.includes(q.format) &&
      !state.askedQuestionIds.has(q.id)
  );

  if (candidates.length > 0) {
    return { question: pickRandom(candidates) };
  }

  const adjacent = [level - 1, level + 1].filter((l) => l >= 1 && l <= 6);
  for (const adj of adjacent) {
    const adjCandidates = bank.filter(
      (q) =>
        q.hskLevel === adj &&
        allowedFormats.includes(q.format) &&
        !state.askedQuestionIds.has(q.id)
    );
    if (adjCandidates.length > 0) {
      return { question: pickRandom(adjCandidates) };
    }
  }

  const anyAtLevel = bank.filter(
    (q) => q.hskLevel === level && !state.askedQuestionIds.has(q.id)
  );
  if (anyAtLevel.length > 0) return { question: pickRandom(anyAtLevel) };

  return null;
}

function getFrontierQuestion(
  state: DiagnosticState,
  bank: DiagnosticQuestion[]
): { question: DiagnosticQuestion } | null {
  const boundary = state.boundaryLevel ?? START_LEVEL;

  const allowedFormats: DiagnosticQuestionFormat[] = [
    "meaning_to_character",
    "sentence_context",
  ];

  if (boundary >= 4) {
    allowedFormats.push("reading_comprehension");
  }

  if (state.pinyinQuestionCount < MAX_PINYIN_QUESTIONS) {
    allowedFormats.push("pinyin_to_character");
  }

  const targetLevels = [boundary, Math.max(1, boundary - 1)];

  for (const level of targetLevels) {
    const candidates = bank.filter(
      (q) =>
        q.hskLevel === level &&
        allowedFormats.includes(q.format) &&
        !state.askedQuestionIds.has(q.id)
    );
    if (candidates.length > 0) {
      return { question: pickRandom(candidates) };
    }
  }

  const aboveLevel = Math.min(6, boundary + 1);
  const aboveCandidates = bank.filter(
    (q) =>
      q.hskLevel === aboveLevel &&
      allowedFormats.includes(q.format) &&
      !state.askedQuestionIds.has(q.id)
  );
  if (aboveCandidates.length > 0) {
    return { question: pickRandom(aboveCandidates) };
  }

  const anyNearBoundary = bank.filter(
    (q) =>
      Math.abs(q.hskLevel - boundary) <= 1 &&
      !state.askedQuestionIds.has(q.id)
  );
  if (anyNearBoundary.length > 0) {
    return { question: pickRandom(anyNearBoundary) };
  }

  return null;
}

export function recordDiagnosticResponse(
  state: DiagnosticState,
  question: DiagnosticQuestion,
  correct: boolean,
  solveTimeSeconds: number,
): DiagnosticState {
  const nodeLevel = question.hskLevel;
  const fast = isFast(solveTimeSeconds, question.expectedSeconds);
  const weight = responseWeight(correct, fast);

  const newResponses = [
    ...state.responses,
    {
      nodeId: question.targetNodeId,
      correct,
      solveTimeSeconds,
      expectedSeconds: question.expectedSeconds,
    },
  ];

  const newTested = new Set(state.testedNodeIds);
  if (question.targetNodeId && !question.targetNodeId.startsWith("_rc_")) {
    newTested.add(question.targetNodeId);
  }

  const newAsked = new Set(state.askedQuestionIds);
  newAsked.add(question.id);

  let newPinyinCount = state.pinyinQuestionCount;
  if (question.format === "pinyin_to_character") newPinyinCount++;

  const newLevelScores = { ...state.levelScores };
  if (!newLevelScores[nodeLevel]) {
    newLevelScores[nodeLevel] = { correct: 0, total: 0, weightedScore: 0 };
  }
  newLevelScores[nodeLevel] = {
    correct: newLevelScores[nodeLevel].correct + (correct ? 1 : 0),
    total: newLevelScores[nodeLevel].total + 1,
    weightedScore: newLevelScores[nodeLevel].weightedScore + weight,
  };

  const newQuestionCount = state.questionCount + 1;

  let newPhase = state.phase;
  let newCurrentLevel = state.currentLevel;
  let newBoundaryLevel = state.boundaryLevel;
  let newConditionalTopics = [...state.conditionalTopics];
  let newFoundationalGaps = [...state.foundationalGaps];

  if (state.phase === "adaptive_search") {
    const currentLevelScore = newLevelScores[state.currentLevel];
    const questionsAtLevel = currentLevelScore?.total ?? 0;

    if (questionsAtLevel >= QUESTIONS_PER_LEVEL) {
      const accuracy = currentLevelScore.weightedScore / currentLevelScore.total;
      if (accuracy >= 0.5 && state.currentLevel < 6) {
        newCurrentLevel = state.currentLevel + 1;
      } else if (accuracy < 0.5 && state.currentLevel > 1) {
        newCurrentLevel = state.currentLevel - 1;
      }
    }

    if (newQuestionCount >= ADAPTIVE_PHASE_MIN) {
      newBoundaryLevel = computeBoundaryLevel(newLevelScores);
      newPhase = "frontier_refinement";
      newCurrentLevel = newBoundaryLevel;
    }
  } else if (state.phase === "frontier_refinement") {
    if (correct && !fast && nodeLevel === (state.boundaryLevel ?? START_LEVEL)) {
      newConditionalTopics = [...newConditionalTopics, question.targetNodeId];
    }

    if (!correct && nodeLevel < (state.boundaryLevel ?? START_LEVEL)) {
      newFoundationalGaps = [...newFoundationalGaps, question.targetNodeId];
    }

    const frontierQuestions = newQuestionCount - ADAPTIVE_PHASE_MIN;
    if (frontierQuestions >= FRONTIER_PHASE_MAX || newQuestionCount >= TOTAL_MAX) {
      newPhase = "complete";
    }
  }

  return {
    phase: newPhase,
    currentLevel: newCurrentLevel,
    responses: newResponses,
    boundaryLevel: newBoundaryLevel,
    conditionalTopics: newConditionalTopics,
    foundationalGaps: newFoundationalGaps,
    testedNodeIds: newTested,
    askedQuestionIds: newAsked,
    pinyinQuestionCount: newPinyinCount,
    levelScores: newLevelScores,
    questionCount: newQuestionCount,
    startedAt: state.startedAt,
  };
}

function computeBoundaryLevel(
  levelScores: Record<number, { correct: number; total: number; weightedScore: number }>
): number {
  let boundary = 1;

  for (const level of HSK_LEVELS) {
    const score = levelScores[level];
    if (!score || score.total === 0) continue;

    const accuracy = score.weightedScore / score.total;
    if (accuracy >= 0.5) {
      boundary = level;
    } else {
      break;
    }
  }

  return boundary;
}

// --- Commit Results ---

export function commitDiagnosticResults(
  state: DiagnosticState,
  graph: GraphNode[]
): { progress: UserProgress; report: DiagnosticReport } {
  const boundary = state.boundaryLevel ?? computeBoundaryLevel(state.levelScores);
  const now = Date.now();
  const progress: UserProgress = {};

  const nodesByLevel = getNodesByLevel(graph);
  const testedResponses = new Map<string, { correct: boolean; fast: boolean }>();

  for (const resp of state.responses) {
    if (resp.nodeId.startsWith("_rc_")) continue;
    const fast = isFast(resp.solveTimeSeconds, resp.expectedSeconds);
    testedResponses.set(resp.nodeId, { correct: resp.correct, fast });
  }

  const topicsAssessed: DiagnosticReport["topicsAssessed"] = [];
  for (const [nodeId, result] of testedResponses) {
    topicsAssessed.push({ nodeId, correct: result.correct, fast: result.fast });
  }

  let nodesAutoMastered = 0;
  let nodesToStudy = 0;

  const masteryByLevel: DiagnosticReport["masteryByLevel"] = {};
  for (const level of HSK_LEVELS) {
    masteryByLevel[level] = { total: (nodesByLevel[level] ?? []).length, mastered: 0, conditional: 0 };
  }

  for (const level of HSK_LEVELS) {
    const nodes = nodesByLevel[level] ?? [];

    for (const node of nodes) {
      const tested = testedResponses.get(node.id);

      if (level < boundary - 1) {
        progress[node.id] = makeNodeState(1.0, 30 * 24 * 3600, now);
        masteryByLevel[level].mastered++;
        nodesAutoMastered++;
      } else if (level === boundary - 1) {
        if (tested) {
          if (tested.correct) {
            progress[node.id] = makeNodeState(1.0, 14 * 24 * 3600, now);
            masteryByLevel[level].mastered++;
            nodesAutoMastered++;
          } else {
            progress[node.id] = makeNodeState(0.3, 60, now);
            nodesToStudy++;
          }
        } else {
          progress[node.id] = makeNodeState(1.0, 21 * 24 * 3600, now);
          masteryByLevel[level].mastered++;
          nodesAutoMastered++;
        }
      } else if (level === boundary) {
        if (tested) {
          if (tested.correct && tested.fast) {
            progress[node.id] = makeNodeState(0.9, 7 * 24 * 3600, now);
            masteryByLevel[level].mastered++;
            nodesAutoMastered++;
          } else if (tested.correct && !tested.fast) {
            progress[node.id] = makeNodeState(0.7, 3 * 24 * 3600, now);
            masteryByLevel[level].conditional++;
          } else {
            progress[node.id] = makeNodeState(0.0, 60, now);
            nodesToStudy++;
          }
        } else {
          progress[node.id] = makeNodeState(0.7, 3 * 24 * 3600, now);
          masteryByLevel[level].conditional++;
        }
      }
    }
  }

  for (const node of graph) {
    if (node.hskLevel) continue;
    if (progress[node.id]) continue;
    progress[node.id] = makeNodeState(1.0, 30 * 24 * 3600, now);
    nodesAutoMastered++;
  }

  for (const level of HSK_LEVELS) {
    if (level > boundary) {
      nodesToStudy += (nodesByLevel[level] ?? []).length;
    }
  }

  const foundationalGaps = state.foundationalGaps
    .filter((id) => !id.startsWith("_rc_"))
    .map((nodeId) => ({
      nodeId,
      blocksCount: countDependents(nodeId, graph),
    }));
  foundationalGaps.sort((a, b) => b.blocksCount - a.blocksCount);

  const totalRemaining = nodesToStudy + (masteryByLevel[boundary]?.conditional ?? 0);
  const remainingXP = totalRemaining * ESTIMATED_XP_PER_TOPIC;
  const targetDate = new Date(AP_EXAM_DATE);

  const estimatedCompletionDates = XP_PACES.map((dailyXP) => {
    const days = Math.ceil(remainingXP / dailyXP);
    const date = new Date();
    date.setDate(date.getDate() + days);
    return {
      dailyXP,
      date: date.toISOString().slice(0, 10),
      beforeTarget: date <= targetDate,
    };
  });

  const daysUntilTarget = Math.max(
    1,
    Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );
  const recommendedDailyXP = Math.ceil(remainingXP / daysUntilTarget);

  const totalTimeSeconds = Math.round((Date.now() - state.startedAt) / 1000);

  const report: DiagnosticReport = {
    placementLevel: boundary,
    masteryByLevel,
    foundationalGaps,
    estimatedCompletionDates,
    recommendedDailyXP,
    topicsAssessed,
    nodesAutoMastered,
    nodesToStudy,
    totalQuestions: state.questionCount,
    totalTimeSeconds,
  };

  return { progress, report };
}

function makeNodeState(mastery: number, intervalSeconds: number, now: number): NodeState {
  return makeDefaultNodeState({
    mastery,
    interval: intervalSeconds,
    nextReview: now + intervalSeconds * 1000,
    totalReviews: 1,
    lastReviewedAt: now,
  });
}

// --- Estimated question count ---

export function estimatedTotalQuestions(state: DiagnosticState): number {
  if (state.phase === "adaptive_search") {
    return ADAPTIVE_PHASE_MIN + Math.round(FRONTIER_PHASE_MAX * 0.7);
  }
  const frontierDone = state.questionCount - ADAPTIVE_PHASE_MIN;
  const remaining = Math.max(0, FRONTIER_PHASE_MAX - frontierDone);
  return state.questionCount + Math.round(remaining * 0.7);
}
