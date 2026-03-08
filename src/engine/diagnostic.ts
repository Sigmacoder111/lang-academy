import type { GraphNode, PracticeProblem, ProblemBankEntry } from "../types/graph";
import type { NodeState, UserProgress } from "../types/state";

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
  levelScores: Record<number, { correct: number; total: number; weightedScore: number }>;
  questionCount: number;
  startedAt: number;
}

// --- Constants ---

const HSK_LEVELS = [1, 2, 3, 4, 5, 6];
const START_LEVEL = 3;
const ADAPTIVE_PHASE_MIN = 12;
const ADAPTIVE_PHASE_MAX = 20;
const FRONTIER_PHASE_MAX = 25;
const TOTAL_MAX = 45;
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
  };
}

export function deserializeDiagnosticState(raw: SerializedDiagnosticState): DiagnosticState {
  return {
    ...raw,
    testedNodeIds: new Set(raw.testedNodeIds),
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isFast(solveTimeSeconds: number, expectedSeconds: number): boolean {
  return solveTimeSeconds <= expectedSeconds * FAST_THRESHOLD_RATIO;
}

function responseWeight(correct: boolean, fast: boolean): number {
  if (correct && fast) return 1.0;
  if (correct && !fast) return 0.6;
  return 0.0;
}

function findProblemForNode(
  nodeId: string,
  graph: GraphNode[],
  problemBank: ProblemBankEntry[]
): PracticeProblem | null {
  const bankEntry = problemBank.find((e) => e.nodeId === nodeId);
  if (bankEntry && bankEntry.problems.length > 0) {
    return bankEntry.problems[Math.floor(Math.random() * bankEntry.problems.length)];
  }

  const node = graph.find((n) => n.id === nodeId);
  if (node && node.lesson.practiceProblems.length > 0) {
    const problems = node.lesson.practiceProblems;
    return problems[Math.floor(Math.random() * problems.length)];
  }

  return null;
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
    levelScores: {},
    questionCount: 0,
    startedAt: Date.now(),
  };
}

export function getDiagnosticProblem(
  state: DiagnosticState,
  graph: GraphNode[],
  problemBank: ProblemBankEntry[]
): { problem: PracticeProblem; nodeId: string } | null {
  if (state.phase === "complete") return null;
  if (state.questionCount >= TOTAL_MAX) return null;

  const byLevel = getNodesByLevel(graph);

  if (state.phase === "adaptive_search") {
    return getAdaptiveProblem(state, byLevel, graph, problemBank);
  }

  return getFrontierProblem(state, byLevel, graph, problemBank);
}

function getAdaptiveProblem(
  state: DiagnosticState,
  byLevel: Record<number, GraphNode[]>,
  graph: GraphNode[],
  problemBank: ProblemBankEntry[]
): { problem: PracticeProblem; nodeId: string } | null {
  const level = state.currentLevel;
  const candidates = byLevel[level]?.filter((n) => !state.testedNodeIds.has(n.id)) ?? [];

  if (candidates.length === 0) {
    const adjacent = [level - 1, level + 1].filter((l) => l >= 1 && l <= 6);
    for (const adj of adjacent) {
      const adjCandidates = byLevel[adj]?.filter((n) => !state.testedNodeIds.has(n.id)) ?? [];
      if (adjCandidates.length > 0) {
        const node = shuffle(adjCandidates)[0];
        const problem = findProblemForNode(node.id, graph, problemBank);
        if (problem) return { problem, nodeId: node.id };
      }
    }
    return null;
  }

  const node = shuffle(candidates)[0];
  const problem = findProblemForNode(node.id, graph, problemBank);
  if (!problem) {
    for (const candidate of shuffle(candidates).slice(0, 5)) {
      const p = findProblemForNode(candidate.id, graph, problemBank);
      if (p) return { problem: p, nodeId: candidate.id };
    }
    return null;
  }

  return { problem, nodeId: node.id };
}

function getFrontierProblem(
  state: DiagnosticState,
  byLevel: Record<number, GraphNode[]>,
  graph: GraphNode[],
  problemBank: ProblemBankEntry[]
): { problem: PracticeProblem; nodeId: string } | null {
  const boundary = state.boundaryLevel ?? START_LEVEL;

  const targetLevels = [boundary, Math.max(1, boundary - 1)];
  for (const level of targetLevels) {
    const candidates = byLevel[level]?.filter((n) => !state.testedNodeIds.has(n.id)) ?? [];
    if (candidates.length > 0) {
      for (const candidate of shuffle(candidates).slice(0, 5)) {
        const problem = findProblemForNode(candidate.id, graph, problemBank);
        if (problem) return { problem, nodeId: candidate.id };
      }
    }
  }

  const aboveLevel = Math.min(6, boundary + 1);
  const aboveCandidates = byLevel[aboveLevel]?.filter((n) => !state.testedNodeIds.has(n.id)) ?? [];
  if (aboveCandidates.length > 0) {
    for (const candidate of shuffle(aboveCandidates).slice(0, 3)) {
      const problem = findProblemForNode(candidate.id, graph, problemBank);
      if (problem) return { problem, nodeId: candidate.id };
    }
  }

  return null;
}

export function recordDiagnosticResponse(
  state: DiagnosticState,
  nodeId: string,
  correct: boolean,
  solveTimeSeconds: number,
  expectedSeconds: number,
  graph: GraphNode[]
): DiagnosticState {
  const node = graph.find((n) => n.id === nodeId);
  const nodeLevel = node?.hskLevel ?? 1;
  const fast = isFast(solveTimeSeconds, expectedSeconds);
  const weight = responseWeight(correct, fast);

  const newResponses = [...state.responses, { nodeId, correct, solveTimeSeconds, expectedSeconds }];
  const newTested = new Set(state.testedNodeIds);
  newTested.add(nodeId);

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
    if (correct) {
      if (newCurrentLevel < 6) {
        newCurrentLevel = Math.min(6, newCurrentLevel + 1);
      }
    } else {
      if (newCurrentLevel > 1) {
        newCurrentLevel = Math.max(1, newCurrentLevel - 1);
      }
    }

    const shouldTransition = newQuestionCount >= ADAPTIVE_PHASE_MIN;
    if (shouldTransition) {
      newBoundaryLevel = computeBoundaryLevel(newLevelScores);
      newPhase = "frontier_refinement";
      newCurrentLevel = newBoundaryLevel;
    } else if (newQuestionCount >= ADAPTIVE_PHASE_MAX) {
      newBoundaryLevel = computeBoundaryLevel(newLevelScores);
      newPhase = "frontier_refinement";
      newCurrentLevel = newBoundaryLevel;
    }
  } else if (state.phase === "frontier_refinement") {
    if (correct && !fast && nodeLevel === (state.boundaryLevel ?? START_LEVEL)) {
      newConditionalTopics = [...newConditionalTopics, nodeId];
    }

    if (!correct && nodeLevel < (state.boundaryLevel ?? START_LEVEL)) {
      newFoundationalGaps = [...newFoundationalGaps, nodeId];
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
          // Untested at boundary — mark conditional
          progress[node.id] = makeNodeState(0.7, 3 * 24 * 3600, now);
          masteryByLevel[level].conditional++;
        }
      }
      // Above boundary: untouched
    }
  }

  // Also handle nodes without hskLevel (radicals etc.) — auto-master if all dependents are below boundary
  for (const node of graph) {
    if (node.hskLevel) continue;
    if (progress[node.id]) continue;
    progress[node.id] = makeNodeState(1.0, 30 * 24 * 3600, now);
    nodesAutoMastered++;
  }

  // Count above-boundary as "to study"
  for (const level of HSK_LEVELS) {
    if (level > boundary) {
      nodesToStudy += (nodesByLevel[level] ?? []).length;
    }
  }

  const foundationalGaps = state.foundationalGaps.map((nodeId) => ({
    nodeId,
    blocksCount: countDependents(nodeId, graph),
  }));
  foundationalGaps.sort((a, b) => b.blocksCount - a.blocksCount);

  const totalRemaining = nodesToStudy + masteryByLevel[boundary]?.conditional;
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
  return {
    mastery,
    interval: intervalSeconds,
    nextReview: now + intervalSeconds * 1000,
    totalReviews: 1,
    lastReviewedAt: now,
  };
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
