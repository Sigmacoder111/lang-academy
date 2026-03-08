/**
 * Stage 3: Generate lesson content for each node.
 * Produces tutorials, worked examples, and practice problems.
 * Uses deterministic templates with optional LLM enhancement.
 */

import type { Lesson, PracticeProblem } from "../../src/types/graph";
import type { NodeWithPrereqs } from "./stage2-prereqs";
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

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SENTENCE_TEMPLATES: Record<string, string[]> = {
  radical: [
    "The radical {hanzi} ({pinyin}) means \"{meaning}\". It appears as a component in many Chinese characters. Recognizing this radical helps decode unfamiliar characters. When you see {hanzi} on the left side of a character, it often relates to {meaning}.",
    "This is the radical {hanzi}, pronounced {pinyin}, meaning \"{meaning}\". As one of the fundamental building blocks, it carries semantic weight in compound characters. Many common characters contain this radical. Study its shape carefully — you'll see it frequently.",
    "{hanzi} ({pinyin}) is a radical meaning \"{meaning}\". Radicals are the DNA of Chinese characters — they reveal hidden meaning. Characters containing {hanzi} often relate to {meaning} in some way. Memorizing radicals is the fastest path to reading fluency.",
  ],
  character: [
    "The character {hanzi} ({pinyin}) means \"{meaning}\". {composition} This character is commonly used in everyday Chinese at HSK level {hsk}. Practice writing it stroke by stroke to build muscle memory.",
    "{hanzi} is pronounced {pinyin} and means \"{meaning}\". {composition} It frequently appears in HSK {hsk} vocabulary. Try to associate the visual shape with its meaning for better recall.",
    "Meet {hanzi} ({pinyin}): \"{meaning}\". {composition} This HSK {hsk} character is essential for reading and writing. Creating a vivid mental image connecting the radicals to the meaning will help you remember it.",
  ],
  word: [
    "The word {hanzi} ({pinyin}) means \"{meaning}\". {composition} This HSK {hsk} vocabulary item is commonly used in daily conversation. Pay attention to the tones — they're essential for being understood.",
    "{hanzi} ({pinyin}) translates to \"{meaning}\". {composition} As an HSK {hsk} word, you'll encounter it frequently in reading and listening. Practice using it in context to solidify your memory.",
    "Learn the word {hanzi}, pronounced {pinyin}, meaning \"{meaning}\". {composition} This is a key HSK {hsk} term. Try making your own sentences with it to deepen understanding.",
  ],
  grammar: [
    "The pattern {hanzi} ({pinyin}) expresses the idea of \"{meaning}\". This is an essential HSK {hsk} grammar structure. Mastering this pattern will significantly improve your sentence construction. Practice by creating your own examples using this structure.",
    "{hanzi} ({pinyin}): \"{meaning}\". This grammar pattern is fundamental at HSK level {hsk}. It appears constantly in both spoken and written Chinese. Understanding when and how to use it is crucial for natural communication.",
    "This grammar point covers {hanzi} ({pinyin}), used for \"{meaning}\". At HSK {hsk}, this is a core structure you must master. Listen for it in native speech and try to use it actively in your own sentences.",
  ],
};

function generateComposition(node: NodeWithPrereqs, allNodes: Map<string, NodeWithPrereqs>): string {
  if (node.prereqs.length === 0) return "";

  const parts = node.prereqs
    .map(pid => allNodes.get(pid))
    .filter(Boolean)
    .map(p => `${p!.hanzi} (${p!.meaning})`);

  if (node.type === "character") {
    if (parts.length === 1) {
      return `It contains the radical ${parts[0]}.`;
    }
    return `It is composed of ${parts.join(" and ")}.`;
  }

  if (node.type === "word") {
    if (parts.length === 1) {
      return `It is built from the character ${parts[0]}.`;
    }
    return `It combines the characters ${parts.join(" and ")}.`;
  }

  return "";
}

function generateTutorial(node: NodeWithPrereqs, allNodes: Map<string, NodeWithPrereqs>): string {
  const rng = seededRandom(`tutorial-${node.id}`);
  const templates = SENTENCE_TEMPLATES[node.type] || SENTENCE_TEMPLATES.character;
  const template = pick(templates, rng);
  const composition = generateComposition(node, allNodes);

  return template
    .replace(/\{hanzi\}/g, node.hanzi)
    .replace(/\{pinyin\}/g, node.pinyin)
    .replace(/\{meaning\}/g, node.meaning)
    .replace(/\{composition\}/g, composition)
    .replace(/\{hsk\}/g, String(node.hskLevel || 1))
    .replace(/\s+/g, " ")
    .trim();
}

const EXAMPLE_SENTENCES: Record<string, Array<{ template: string; translation: string }>> = {
  radical: [
    { template: "Look at the radical {hanzi} — it appears in characters like 河, 海, 洗.", translation: "Identify the radical and name characters containing it." },
    { template: "The radical {hanzi} means \"{meaning}\". When you see it in a character, think of {meaning}-related concepts.", translation: "Connect the radical to its semantic field." },
  ],
  character: [
    { template: "她{hanzi}很好。(Tā {pinyin} hěn hǎo.) — She/He is very {meaning}.", translation: "Using {hanzi} in a simple predicate sentence." },
    { template: "我想{hanzi}。(Wǒ xiǎng {pinyin}.) — I want to {meaning}.", translation: "Using {hanzi} with the desire pattern 想+verb." },
    { template: "请给我一个{hanzi}。(Qǐng gěi wǒ yī gè {pinyin}.) — Please give me a {meaning}.", translation: "Using {hanzi} in a polite request." },
  ],
  word: [
    { template: "我喜欢{hanzi}。(Wǒ xǐhuan {pinyin}.) — I like {meaning}.", translation: "Express preference using 喜欢 + {hanzi}." },
    { template: "你去过{hanzi}吗？(Nǐ qù guò {pinyin} ma?) — Have you been to {meaning}?", translation: "Ask about experience using 过 with {hanzi}." },
    { template: "这个{hanzi}很好。(Zhège {pinyin} hěn hǎo.) — This {meaning} is very good.", translation: "Describe {hanzi} using 很+adjective pattern." },
  ],
  grammar: [
    { template: "Example: {hanzi} → 我是学生。(Wǒ shì xuéshēng.) — I am a student.", translation: "Apply the pattern {hanzi} in a basic sentence." },
    { template: "Example: {hanzi} → 他很高兴。(Tā hěn gāoxìng.) — He is very happy.", translation: "Apply the pattern {hanzi} with an adjective." },
  ],
};

function generateWorkedExample(node: NodeWithPrereqs): { problem: string; solution: string } {
  const rng = seededRandom(`example-${node.id}`);
  const templates = EXAMPLE_SENTENCES[node.type] || EXAMPLE_SENTENCES.character;
  const tmpl = pick(templates, rng);

  const problem = tmpl.template
    .replace(/\{hanzi\}/g, node.hanzi)
    .replace(/\{pinyin\}/g, node.pinyin)
    .replace(/\{meaning\}/g, node.meaning);

  const solution = `Step 1: Identify the key element — ${node.hanzi} (${node.pinyin}) means "${node.meaning}". ` +
    `Step 2: Read the sentence and locate ${node.hanzi}. ` +
    `Step 3: ${tmpl.translation.replace(/\{hanzi\}/g, node.hanzi).replace(/\{pinyin\}/g, node.pinyin).replace(/\{meaning\}/g, node.meaning)} ` +
    `Remember: ${node.hanzi} is pronounced ${node.pinyin} with the correct tones.`;

  return { problem, solution };
}

function generatePracticeProblems(
  node: NodeWithPrereqs,
  allNodes: NodeWithPrereqs[],
  count: number
): PracticeProblem[] {
  const rng = seededRandom(`practice-${node.id}`);
  const problems: PracticeProblem[] = [];
  const sameType = allNodes.filter(n => n.id !== node.id && n.type === node.type);
  const distractorPool = sameType.length >= 3 ? sameType : allNodes.filter(n => n.id !== node.id);

  const questionTypes = [
    // Type 1: Meaning from hanzi
    () => {
      const wrongMeanings = shuffle(distractorPool, rng).slice(0, 3).map(n => n.meaning);
      const allOptions = shuffle([node.meaning, ...wrongMeanings], rng);
      return {
        question: `What does "${node.hanzi}" mean?`,
        options: allOptions,
        correctIndex: allOptions.indexOf(node.meaning),
        explanation: `${node.hanzi} (${node.pinyin}) means "${node.meaning}".`,
        expectedSeconds: node.type === "radical" ? 10 : node.type === "character" ? 15 : 20,
      };
    },
    // Type 2: Hanzi from meaning
    () => {
      const wrongHanzi = shuffle(distractorPool, rng).slice(0, 3).map(n => n.hanzi);
      const allOptions = shuffle([node.hanzi, ...wrongHanzi], rng);
      return {
        question: `Which one means "${node.meaning}"?`,
        options: allOptions,
        correctIndex: allOptions.indexOf(node.hanzi),
        explanation: `"${node.meaning}" is written as ${node.hanzi} (${node.pinyin}).`,
        expectedSeconds: node.type === "radical" ? 10 : node.type === "character" ? 15 : 20,
      };
    },
    // Type 3: Pinyin from hanzi
    () => {
      const wrongPinyin = shuffle(distractorPool, rng).slice(0, 3).map(n => n.pinyin);
      const allOptions = shuffle([node.pinyin, ...wrongPinyin], rng);
      return {
        question: `What is the pronunciation of "${node.hanzi}"?`,
        options: allOptions,
        correctIndex: allOptions.indexOf(node.pinyin),
        explanation: `${node.hanzi} is pronounced "${node.pinyin}" and means "${node.meaning}".`,
        expectedSeconds: 12,
      };
    },
    // Type 4: Fill in the blank
    () => {
      const wrongHanzi = shuffle(distractorPool, rng).slice(0, 3).map(n => n.hanzi);
      const allOptions = shuffle([node.hanzi, ...wrongHanzi], rng);
      return {
        question: `Complete the sentence: 我喜欢____。(I like ____.) Choose the word meaning "${node.meaning}".`,
        options: allOptions,
        correctIndex: allOptions.indexOf(node.hanzi),
        explanation: `The correct answer is ${node.hanzi} (${node.pinyin}), meaning "${node.meaning}".`,
        expectedSeconds: 20,
      };
    },
    // Type 5: Type identification
    () => {
      if (node.type === "radical") {
        const wrongOptions = ["character", "word", "grammar pattern"];
        const allOptions = shuffle(["radical", ...wrongOptions], rng);
        return {
          question: `What type of Chinese writing element is "${node.hanzi}"?`,
          options: allOptions,
          correctIndex: allOptions.indexOf("radical"),
          explanation: `${node.hanzi} is a radical — a fundamental building block of Chinese characters.`,
          expectedSeconds: 10,
        };
      }
      const wrongMeanings = shuffle(distractorPool, rng).slice(0, 3).map(n => n.meaning);
      const allOptions = shuffle([node.meaning, ...wrongMeanings], rng);
      return {
        question: `Select the correct meaning for ${node.hanzi} (${node.pinyin}):`,
        options: allOptions,
        correctIndex: allOptions.indexOf(node.meaning),
        explanation: `${node.hanzi} (${node.pinyin}) means "${node.meaning}".`,
        expectedSeconds: 15,
      };
    },
  ];

  for (let i = 0; i < count; i++) {
    const gen = questionTypes[i % questionTypes.length];
    const problem = gen();
    if (problem.options.length === 4 && problem.correctIndex >= 0 && problem.correctIndex < 4) {
      problems.push(problem);
    } else {
      // Fallback
      const wrongMeanings = shuffle(distractorPool, rng).slice(0, 3).map(n => n.meaning);
      const allOptions = shuffle([node.meaning, ...wrongMeanings], rng);
      problems.push({
        question: `What does "${node.hanzi}" mean?`,
        options: allOptions,
        correctIndex: allOptions.indexOf(node.meaning),
        explanation: `${node.hanzi} (${node.pinyin}) means "${node.meaning}".`,
        expectedSeconds: 15,
      });
    }
  }

  return problems;
}

export interface NodeWithLesson extends NodeWithPrereqs {
  lesson: Lesson;
}

export function generateLessons(nodes: NodeWithPrereqs[]): NodeWithLesson[] {
  const cacheKey = `lessons-v3-${nodes.length}`;
  const cached = getCached<NodeWithLesson[]>("stage3", cacheKey);
  if (cached) {
    console.log(`  [cache hit] ${cached.length} lessons loaded from cache`);
    return cached;
  }

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const result: NodeWithLesson[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const tutorial = generateTutorial(node, nodeMap);
    const workedExample = generateWorkedExample(node);
    const practiceProblems = generatePracticeProblems(node, nodes, node.type === "radical" ? 3 : 4);

    result.push({
      ...node,
      lesson: { tutorial, workedExample, practiceProblems },
    });

    if ((i + 1) % 500 === 0) {
      console.log(`    Generated lessons for ${i + 1}/${nodes.length} nodes`);
    }
  }

  console.log(`  Generated lessons for ${result.length} nodes`);
  setCache("stage3", cacheKey, result);
  return result;
}
