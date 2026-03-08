/**
 * Stage 4: Generate review/quiz problem bank.
 * 2-3 extra problems per node, separate from lesson problems.
 *
 * Question generation rules (from LAN-16):
 * 1. The answer must NEVER appear in the question text.
 * 2. Distractors must be plausible — same HSK level, same part of speech, similar semantic domain.
 * 3. Each question tests exactly one knowledge point.
 * 4. No metalinguistic questions (no "is this a character or a word", no stroke counts).
 * 5. Pinyin must use tone marks (not numbers).
 */

import type { PracticeProblem, ProblemBankEntry } from "../../src/types/graph";
import type { NodeWithLesson } from "./stage3-lessons";
import { getCached, setCache } from "./cache";

function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
    h = (h ^ (h >>> 16)) >>> 0;
    return h / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function hasChinese(str: string): boolean {
  return /[\u4e00-\u9fff]/.test(str);
}

function getSameLevelNodes(node: NodeWithLesson, allNodes: NodeWithLesson[]): NodeWithLesson[] {
  const level = node.hskLevel ?? 0;
  return allNodes.filter(n =>
    n.id !== node.id &&
    (n.hskLevel ?? 0) === level &&
    n.type === node.type &&
    !hasChinese(n.meaning)
  );
}

function generateReviewProblems(
  node: NodeWithLesson,
  allNodes: NodeWithLesson[],
  count: number
): PracticeProblem[] {
  const rng = seededRandom(`review-bank-v4-${node.id}`);
  const problems: PracticeProblem[] = [];

  const sameLevelPool = getSameLevelNodes(node, allNodes);
  const fallbackPool = allNodes.filter(n =>
    n.id !== node.id &&
    !hasChinese(n.meaning) &&
    n.meaning !== node.meaning
  );
  const distractorPool = sameLevelPool.length >= 3 ? sameLevelPool : fallbackPool;

  const questionGenerators = [
    // Character → Meaning: "What does X mean?"
    () => {
      const wrong = shuffle(distractorPool, rng).slice(0, 3).map(n => n.meaning);
      const opts = shuffle([node.meaning, ...wrong], rng);
      return {
        question: `What does "${node.hanzi}" mean?`,
        options: opts,
        correctIndex: opts.indexOf(node.meaning),
        explanation: `${node.hanzi} (${node.pinyin}) means "${node.meaning}".`,
        expectedSeconds: 10,
      };
    },
    // Meaning → Character: "Which word means X?"
    () => {
      const wrong = shuffle(distractorPool, rng).slice(0, 3).map(n => n.hanzi);
      const opts = shuffle([node.hanzi, ...wrong], rng);
      return {
        question: `Which character/word means "${node.meaning}"?`,
        options: opts,
        correctIndex: opts.indexOf(node.hanzi),
        explanation: `"${node.meaning}" is ${node.hanzi} (${node.pinyin}).`,
        expectedSeconds: 12,
      };
    },
    // Pronunciation: "How do you pronounce X?"
    () => {
      const wrong = shuffle(distractorPool, rng).slice(0, 3).map(n => n.pinyin);
      const opts = shuffle([node.pinyin, ...wrong], rng);
      return {
        question: `How is "${node.hanzi}" pronounced?`,
        options: opts,
        correctIndex: opts.indexOf(node.pinyin),
        explanation: `${node.hanzi} is pronounced ${node.pinyin}.`,
        expectedSeconds: 12,
      };
    },
    // Pinyin → Meaning: "What does this pronunciation mean?"
    () => {
      const wrong = shuffle(distractorPool, rng).slice(0, 3).map(n => n.meaning);
      const opts = shuffle([node.meaning, ...wrong], rng);
      return {
        question: `What does the word pronounced "${node.pinyin}" mean?`,
        options: opts,
        correctIndex: opts.indexOf(node.meaning),
        explanation: `${node.pinyin} is the pronunciation of ${node.hanzi}, meaning "${node.meaning}".`,
        expectedSeconds: 15,
      };
    },
  ];

  for (let i = 0; i < count; i++) {
    const genIdx = i % questionGenerators.length;
    const gen = questionGenerators[genIdx];
    const problem = gen();
    if (problem && problem.options.length === 4 && problem.correctIndex >= 0) {
      problems.push(problem);
    } else {
      const wrong = shuffle(distractorPool, rng).slice(0, 3).map(n => n.meaning);
      const opts = shuffle([node.meaning, ...wrong], rng);
      problems.push({
        question: `What does "${node.hanzi}" mean?`,
        options: opts,
        correctIndex: opts.indexOf(node.meaning),
        explanation: `${node.hanzi} (${node.pinyin}) means "${node.meaning}".`,
        expectedSeconds: 10,
      });
    }
  }

  return problems;
}

export function generateProblemBank(nodes: NodeWithLesson[]): ProblemBankEntry[] {
  const cacheKey = `problem-bank-v4-${nodes.length}`;
  const cached = getCached<ProblemBankEntry[]>("stage4", cacheKey);
  if (cached) {
    console.log(`  [cache hit] ${cached.length} problem bank entries loaded`);
    return cached;
  }

  const bank: ProblemBankEntry[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const problemCount = node.type === "radical" ? 2 : 3;
    const problems = generateReviewProblems(node, nodes, problemCount);
    bank.push({ nodeId: node.id, problems });

    if ((i + 1) % 500 === 0) {
      console.log(`    Generated review problems for ${i + 1}/${nodes.length} nodes`);
    }
  }

  const totalProblems = bank.reduce((sum, e) => sum + e.problems.length, 0);
  console.log(`  Generated ${totalProblems} review problems for ${bank.length} nodes`);
  setCache("stage4", cacheKey, bank);
  return bank;
}
