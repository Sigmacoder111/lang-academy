/**
 * Stage 4: Generate review/quiz problem bank.
 * 2-3 extra problems per node, separate from lesson problems.
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

function generateReviewProblems(
  node: NodeWithLesson,
  allNodes: NodeWithLesson[],
  count: number
): PracticeProblem[] {
  const rng = seededRandom(`review-bank-${node.id}`);
  const problems: PracticeProblem[] = [];
  const distractorPool = allNodes.filter(n => n.id !== node.id);

  const questionGenerators = [
    // Translation: meaning → hanzi
    () => {
      const wrong = shuffle(distractorPool, rng).slice(0, 3).map(n => n.hanzi);
      const opts = shuffle([node.hanzi, ...wrong], rng);
      return {
        question: `Which character/word means "${node.meaning}"?`,
        options: opts,
        correctIndex: opts.indexOf(node.hanzi),
        explanation: `"${node.meaning}" is ${node.hanzi} (${node.pinyin}).`,
        expectedSeconds: 15,
      };
    },
    // Pronunciation: hanzi → pinyin
    () => {
      const wrong = shuffle(distractorPool, rng).slice(0, 3).map(n => n.pinyin);
      const opts = shuffle([node.pinyin, ...wrong], rng);
      return {
        question: `How do you pronounce "${node.hanzi}"?`,
        options: opts,
        correctIndex: opts.indexOf(node.pinyin),
        explanation: `${node.hanzi} is pronounced ${node.pinyin}.`,
        expectedSeconds: 12,
      };
    },
    // Context: sentence completion
    () => {
      const wrong = shuffle(distractorPool, rng).slice(0, 3).map(n => n.hanzi);
      const opts = shuffle([node.hanzi, ...wrong], rng);
      const contexts = [
        `Fill in: 他很喜欢____ (He really likes ____)`,
        `Fill in: 请你____一下 (Please ____ for a moment)`,
        `Fill in: 我想学____ (I want to learn ____)`,
        `Fill in: 那个____很好 (That ____ is very good)`,
      ];
      const ctx = contexts[Math.floor(rng() * contexts.length)];
      return {
        question: `${ctx} — Choose "${node.meaning}":`,
        options: opts,
        correctIndex: opts.indexOf(node.hanzi),
        explanation: `${node.hanzi} (${node.pinyin}) means "${node.meaning}" and fits the context.`,
        expectedSeconds: 20,
      };
    },
    // Odd one out
    () => {
      const sameType = distractorPool.filter(n => n.type === node.type);
      const diffType = distractorPool.filter(n => n.type !== node.type);
      const similar = shuffle(sameType, rng).slice(0, 2).map(n => n.hanzi);
      const oddOne = shuffle(diffType, rng).slice(0, 1).map(n => n.hanzi);
      if (oddOne.length === 0) {
        return null;
      }
      const opts = shuffle([...similar, node.hanzi, oddOne[0]], rng);
      return {
        question: `Which one is NOT a ${node.type}?`,
        options: opts,
        correctIndex: opts.indexOf(oddOne[0]),
        explanation: `${oddOne[0]} is not a ${node.type}, while the others are.`,
        expectedSeconds: 18,
      };
    },
    // Matching: pinyin → meaning
    () => {
      const wrong = shuffle(distractorPool, rng).slice(0, 3).map(n => n.meaning);
      const opts = shuffle([node.meaning, ...wrong], rng);
      return {
        question: `What does the pronunciation "${node.pinyin}" correspond to in meaning?`,
        options: opts,
        correctIndex: opts.indexOf(node.meaning),
        explanation: `${node.pinyin} is the pronunciation of ${node.hanzi}, meaning "${node.meaning}".`,
        expectedSeconds: 15,
      };
    },
  ];

  for (let i = 0; i < count; i++) {
    const genIdx = (i + 2) % questionGenerators.length;
    const gen = questionGenerators[genIdx];
    const problem = gen();
    if (problem && problem.options.length === 4 && problem.correctIndex >= 0) {
      problems.push(problem);
    } else {
      const wrong = shuffle(distractorPool, rng).slice(0, 3).map(n => n.meaning);
      const opts = shuffle([node.meaning, ...wrong], rng);
      problems.push({
        question: `What does "${node.hanzi}" (${node.pinyin}) mean?`,
        options: opts,
        correctIndex: opts.indexOf(node.meaning),
        explanation: `${node.hanzi} (${node.pinyin}) means "${node.meaning}".`,
        expectedSeconds: 15,
      });
    }
  }

  return problems;
}

export function generateProblemBank(nodes: NodeWithLesson[]): ProblemBankEntry[] {
  const cacheKey = `problem-bank-v3-${nodes.length}`;
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
