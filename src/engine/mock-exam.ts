import type {
  MockExamResult,
  MockExamSectionScore,
  MockExamListeningAnswer,
  MockExamReadingAnswer,
  MockExamWritingResponse,
  MockExamSpeakingResponse,
  MockExamReadingPassage,
  MockExamWritingPrompt,
  MockExamSpeakingPrompt,
} from "../types/mock-exam";
import type {
  ListeningExercise,
  DialogueExercise,
  VocabularyExercise,
  SentenceExercise,
} from "../data/listening-exercises";
import { ALL_LISTENING_EXERCISES } from "../data/listening-exercises";
import {
  selectReadingPassages,
  selectWritingPrompts,
  selectConversationPrompt,
  selectPresentationPrompt,
} from "../data/mock-exam-data";

const MOCK_EXAM_RESULTS_KEY = "lang-academy-mock-exam-results";
const MOCK_EXAM_COUNT_KEY = "lang-academy-mock-exam-count";

export function loadMockExamResults(): MockExamResult[] {
  const raw = localStorage.getItem(MOCK_EXAM_RESULTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MockExamResult[];
  } catch {
    return [];
  }
}

export function saveMockExamResult(result: MockExamResult): void {
  const results = loadMockExamResults();
  results.push(result);
  results.sort((a, b) => a.timestamp - b.timestamp);
  localStorage.setItem(MOCK_EXAM_RESULTS_KEY, JSON.stringify(results));
}

export function getNextExamNumber(): number {
  const raw = localStorage.getItem(MOCK_EXAM_COUNT_KEY);
  const count = raw ? parseInt(raw, 10) : 0;
  const next = count + 1;
  localStorage.setItem(MOCK_EXAM_COUNT_KEY, String(next));
  return next;
}

export function peekNextExamNumber(): number {
  const raw = localStorage.getItem(MOCK_EXAM_COUNT_KEY);
  return raw ? parseInt(raw, 10) + 1 : 1;
}

export interface GeneratedExam {
  listeningExercises: ListeningExercise[];
  readingPassages: MockExamReadingPassage[];
  storyNarration: MockExamWritingPrompt;
  emailResponse: MockExamWritingPrompt;
  conversationPrompt: MockExamSpeakingPrompt;
  presentationPrompt: MockExamSpeakingPrompt;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateMockExam(): GeneratedExam {
  const allListening = shuffle(ALL_LISTENING_EXERCISES);

  const dialogues = allListening.filter(e => e.type === "dialogue") as DialogueExercise[];
  const rejoinders = allListening.filter(e => e.type === "vocabulary" || e.type === "sentence") as (VocabularyExercise | SentenceExercise)[];

  const selectedRejoinders = rejoinders.slice(0, 12);
  const selectedDialogues = dialogues.slice(0, 6);

  const listeningExercises: ListeningExercise[] = [
    ...selectedRejoinders,
    ...selectedDialogues,
  ];

  const readingPassages = selectReadingPassages(8);
  const { storyNarration, emailResponse } = selectWritingPrompts();
  const conversationPrompt = selectConversationPrompt();
  const presentationPrompt = selectPresentationPrompt();

  return {
    listeningExercises,
    readingPassages,
    storyNarration,
    emailResponse,
    conversationPrompt,
    presentationPrompt,
  };
}

export function calculateListeningScore(
  answers: MockExamListeningAnswer[]
): MockExamSectionScore {
  const correct = answers.filter(a => a.correct).length;
  const total = answers.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    section: "listening",
    label: "Section I Part A: Listening",
    score: correct,
    maxScore: total,
    percentage,
  };
}

export function calculateReadingScore(
  answers: MockExamReadingAnswer[]
): MockExamSectionScore {
  const correct = answers.filter(a => a.correct).length;
  const total = answers.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    section: "reading",
    label: "Section I Part B: Reading",
    score: correct,
    maxScore: total,
    percentage,
  };
}

export function calculateWritingScore(
  responses: MockExamWritingResponse[]
): MockExamSectionScore {
  if (responses.length === 0) {
    return { section: "writing", label: "Section II Part A: Writing", score: 0, maxScore: 6, percentage: 0 };
  }

  const avgScore = responses.reduce((sum, r) => sum + r.score, 0) / responses.length;
  const percentage = Math.round((avgScore / 6) * 100);

  return {
    section: "writing",
    label: "Section II Part A: Writing",
    score: Math.round(avgScore * 10) / 10,
    maxScore: 6,
    percentage,
  };
}

export function calculateSpeakingScore(
  responses: MockExamSpeakingResponse[]
): MockExamSectionScore {
  if (responses.length === 0) {
    return { section: "speaking", label: "Section II Part B: Speaking", score: 0, maxScore: 6, percentage: 0 };
  }

  const avgScore = responses.reduce((sum, r) => sum + r.score, 0) / responses.length;
  const percentage = Math.round((avgScore / 6) * 100);

  return {
    section: "speaking",
    label: "Section II Part B: Speaking",
    score: Math.round(avgScore * 10) / 10,
    maxScore: 6,
    percentage,
  };
}

export function calculateCompositeScore(
  sectionScores: MockExamSectionScore[]
): number {
  const listening = sectionScores.find(s => s.section === "listening");
  const reading = sectionScores.find(s => s.section === "reading");
  const writing = sectionScores.find(s => s.section === "writing");
  const speaking = sectionScores.find(s => s.section === "speaking");

  const mcWeight = 0.5;
  const frWeight = 0.5;

  const listeningPct = listening?.percentage ?? 0;
  const readingPct = reading?.percentage ?? 0;
  const mcScore = (listeningPct * 0.4 + readingPct * 0.6) / 100;

  const writingPct = writing?.percentage ?? 0;
  const speakingPct = speaking?.percentage ?? 0;
  const frScore = (writingPct * 0.5 + speakingPct * 0.5) / 100;

  return mcWeight * mcScore + frWeight * frScore;
}

export function compositeToAPScore(composite: number): number {
  if (composite >= 0.82) return 5;
  if (composite >= 0.67) return 4;
  if (composite >= 0.52) return 3;
  if (composite >= 0.35) return 2;
  return 1;
}

export function identifyAreasToImprove(
  sectionScores: MockExamSectionScore[]
): string[] {
  const areas: string[] = [];

  for (const section of sectionScores) {
    if (section.percentage < 50) {
      areas.push(`Significant improvement needed in ${section.label} (${section.percentage}%)`);
    } else if (section.percentage < 70) {
      areas.push(`Practice more ${section.label} (${section.percentage}%)`);
    }
  }

  if (areas.length === 0) {
    const weakest = sectionScores.reduce((min, s) =>
      s.percentage < min.percentage ? s : min
    );
    areas.push(`Focus on strengthening ${weakest.label} for the best score improvement`);
  }

  return areas;
}

export function gradeWritingLocally(text: string): { score: number; feedback: string } {
  if (!text || text.trim().length === 0) {
    return { score: 0, feedback: "No response provided." };
  }

  const charCount = text.trim().length;
  let score = 0;
  const feedbackParts: string[] = [];

  if (charCount >= 200) {
    score += 2;
    feedbackParts.push("Good length and detail.");
  } else if (charCount >= 100) {
    score += 1.5;
    feedbackParts.push("Adequate length. Try to write more for a higher score.");
  } else if (charCount >= 50) {
    score += 1;
    feedbackParts.push("Response is somewhat short. Aim for at least 200 characters.");
  } else {
    score += 0.5;
    feedbackParts.push("Response is too short. More content is needed.");
  }

  const hasPunctuation = /[。！？，、；：""''（）]/.test(text);
  if (hasPunctuation) {
    score += 1;
    feedbackParts.push("Good use of Chinese punctuation.");
  } else {
    feedbackParts.push("Consider using Chinese punctuation marks.");
  }

  const hasComplexPatterns = /虽然|但是|因为|所以|不但|而且|如果|就|虽然.*但是|虽然.*却/.test(text);
  if (hasComplexPatterns) {
    score += 1;
    feedbackParts.push("Good use of complex sentence structures.");
  } else {
    feedbackParts.push("Try incorporating more complex grammar patterns (虽然...但是, 因为...所以, etc.).");
  }

  const uniqueChars = new Set(text.replace(/[^\u4e00-\u9fff]/g, "")).size;
  if (uniqueChars >= 60) {
    score += 1;
    feedbackParts.push("Excellent vocabulary range.");
  } else if (uniqueChars >= 30) {
    score += 0.5;
    feedbackParts.push("Good vocabulary. Try using more varied words.");
  } else {
    feedbackParts.push("Expand your vocabulary for a higher score.");
  }

  score = Math.min(6, Math.max(0, Math.round(score * 10) / 10));

  return {
    score,
    feedback: feedbackParts.join(" "),
  };
}

export function gradeSpeakingLocally(transcript: string): { score: number; feedback: string } {
  if (!transcript || transcript.trim().length === 0) {
    return { score: 1, feedback: "Very limited or no response detected. Try speaking more clearly." };
  }

  const wordCount = transcript.trim().length;
  let score = 0;
  const feedbackParts: string[] = [];

  if (wordCount >= 80) {
    score += 2;
    feedbackParts.push("Good amount of content.");
  } else if (wordCount >= 40) {
    score += 1.5;
    feedbackParts.push("Adequate response. Try to elaborate more.");
  } else if (wordCount >= 15) {
    score += 1;
    feedbackParts.push("Response is brief. More detail would improve your score.");
  } else {
    score += 0.5;
    feedbackParts.push("Response is too short.");
  }

  const uniqueChars = new Set(transcript.replace(/[^\u4e00-\u9fff]/g, "")).size;
  if (uniqueChars >= 25) {
    score += 1.5;
    feedbackParts.push("Good vocabulary range in speaking.");
  } else if (uniqueChars >= 12) {
    score += 1;
    feedbackParts.push("Adequate vocabulary.");
  } else {
    score += 0.5;
    feedbackParts.push("Try using more varied vocabulary.");
  }

  const hasConnectors = /因为|所以|但是|虽然|而且|如果|那|然后|首先|其次|最后/.test(transcript);
  if (hasConnectors) {
    score += 1;
    feedbackParts.push("Good use of connecting words.");
  } else {
    feedbackParts.push("Use connecting words to organize your speech.");
  }

  score += 1;

  score = Math.min(6, Math.max(1, Math.round(score * 10) / 10));

  return {
    score,
    feedback: feedbackParts.join(" "),
  };
}

export function predictTrendScore(results: MockExamResult[]): number | null {
  if (results.length < 2) return null;

  const sorted = [...results].sort((a, b) => a.timestamp - b.timestamp);
  const n = sorted.length;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += sorted[i].predictedAPScore;
    sumXY += i * sorted[i].predictedAPScore;
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const targetExamDate = new Date("2026-05-08");
  const lastExamDate = new Date(sorted[n - 1].date);
  const weeksBetween = Math.max(1,
    Math.ceil((targetExamDate.getTime() - lastExamDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
  );

  const projected = intercept + slope * (n - 1 + weeksBetween);
  return Math.min(5, Math.max(1, Math.round(projected * 10) / 10));
}
