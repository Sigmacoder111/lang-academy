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
  reading: [
    "This reading passage covers the topic of {hanzi} ({pinyin}). {meaning} At HSK level {hsk}, you should be able to read and comprehend passages on this topic. Focus on identifying the main idea, key details, and the author's purpose. Use context clues to understand unfamiliar words.",
    "Reading comprehension: {hanzi} ({pinyin}). {meaning} This HSK {hsk} passage will test your ability to extract information, make inferences, and understand the overall structure. Remember to read the questions before the passage to know what to look for.",
    "Let's practice reading about {hanzi} ({pinyin}). {meaning} As an HSK {hsk} topic, you should aim to understand both the explicit content and implied meanings. A pinyin overlay is available if you need pronunciation help.",
  ],
  writing: [
    "This writing lesson covers {hanzi} ({pinyin}): {meaning}. At HSK level {hsk}, you should be able to compose this type of text. Focus on structure, appropriate vocabulary, and matching the expected tone and formality level. Review the model response to understand the standard format.",
    "Writing practice: {hanzi} ({pinyin}). {meaning} This is an important HSK {hsk} writing skill. Pay attention to how model responses organize ideas, use transitional phrases, and maintain consistent tone. Self-assess your attempts against the rubric provided.",
    "Learn to write {hanzi} ({pinyin}): {meaning}. This HSK {hsk} writing task requires clear organization, appropriate vocabulary, and proper grammar. Study the model response to understand expectations, then practice creating your own responses.",
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
  reading: [
    { template: "Read this short passage about {hanzi} and identify the main idea. Focus on key vocabulary and sentence structure.", translation: "Practice reading comprehension by identifying the main topic and supporting details." },
    { template: "This passage discusses {hanzi}. Read carefully and think about what the author is trying to communicate.", translation: "Analyze the passage for both explicit information and implied meaning." },
  ],
  writing: [
    { template: "Task: Write about {hanzi}. Model response: 亲爱的朋友，我想和你分享关于{hanzi}的一些想法。这个话题对我来说很重要，因为它影响着我们的日常生活。", translation: "Review the model response and note the structure: greeting, topic introduction, personal connection, and closing." },
    { template: "Writing prompt for {hanzi}: Compose a response that addresses the topic clearly. Model: 关于{hanzi}，我认为这是一个值得讨论的话题。首先，我们需要了解它的背景。其次，我们应该考虑它的影响。", translation: "Study the model response's organizational pattern: thesis, supporting points, conclusion." },
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
  if (node.type === "grammar") {
    return generateGrammarPractice(node, allNodes, count);
  }
  if (node.type === "reading") {
    return generateReadingPractice(node, allNodes, count);
  }
  if (node.type === "writing") {
    return generateWritingPractice(node, allNodes, count);
  }

  const rng = seededRandom(`practice-${node.id}`);
  const problems: PracticeProblem[] = [];
  const sameType = allNodes.filter(n => n.id !== node.id && n.type === node.type);
  const distractorPool = sameType.length >= 3 ? sameType : allNodes.filter(n => n.id !== node.id);

  const questionTypes = [
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

function generateGrammarPractice(
  node: NodeWithPrereqs,
  allNodes: NodeWithPrereqs[],
  count: number
): PracticeProblem[] {
  const rng = seededRandom(`grammar-practice-${node.id}`);
  const problems: PracticeProblem[] = [];
  const grammarPool = allNodes.filter(n => n.id !== node.id && n.type === "grammar");
  const pool = grammarPool.length >= 3 ? grammarPool : allNodes.filter(n => n.id !== node.id);

  const generators: Array<() => PracticeProblem> = [
    () => {
      const wrongMeanings = shuffle(pool, rng).slice(0, 3).map(n => n.meaning);
      const allOptions = shuffle([node.meaning, ...wrongMeanings], rng);
      return {
        question: `Fill in the blank: The pattern "${node.hanzi}" is used to express ____.`,
        options: allOptions,
        correctIndex: allOptions.indexOf(node.meaning),
        explanation: `${node.hanzi} (${node.pinyin}) expresses "${node.meaning}".`,
        expectedSeconds: 20,
        questionType: "cloze" as const,
      };
    },
    () => {
      const wrongPatterns = shuffle(pool, rng).slice(0, 3).map(n => n.hanzi);
      const allOptions = shuffle([node.hanzi, ...wrongPatterns], rng);
      return {
        question: `Which grammar pattern means "${node.meaning}"?`,
        options: allOptions,
        correctIndex: allOptions.indexOf(node.hanzi),
        explanation: `"${node.meaning}" is expressed using ${node.hanzi} (${node.pinyin}).`,
        expectedSeconds: 20,
        questionType: "pattern_match" as const,
      };
    },
    () => {
      const wrongMeanings = shuffle(pool, rng).slice(0, 3).map(n => n.meaning);
      const allOptions = shuffle([node.meaning, ...wrongMeanings], rng);
      return {
        question: `What does the grammar pattern "${node.hanzi}" (${node.pinyin}) express?`,
        options: allOptions,
        correctIndex: allOptions.indexOf(node.meaning),
        explanation: `${node.hanzi} (${node.pinyin}) is used for "${node.meaning}".`,
        expectedSeconds: 15,
        questionType: "standard" as const,
      };
    },
    () => {
      const wrongPatterns = shuffle(pool, rng).slice(0, 3).map(n => n.hanzi);
      const allOptions = shuffle([node.hanzi, ...wrongPatterns], rng);
      return {
        question: `Which pattern correctly expresses "${node.meaning}"?`,
        options: allOptions,
        correctIndex: allOptions.indexOf(node.hanzi),
        explanation: `${node.hanzi} is the correct pattern for "${node.meaning}".`,
        expectedSeconds: 20,
        questionType: "pattern_match" as const,
      };
    },
  ];

  for (let i = 0; i < count; i++) {
    problems.push(generators[i % generators.length]());
  }
  return problems;
}

const READING_PASSAGES: Record<string, { passage: string; passagePinyin: string }> = {
  default_1: {
    passage: "今天天气很好。我和朋友一起去公园散步。公园里有很多花和树。我们在湖边坐了一会儿，聊了很多有趣的事情。",
    passagePinyin: "Jīntiān tiānqì hěn hǎo. Wǒ hé péngyou yīqǐ qù gōngyuán sànbù. Gōngyuán lǐ yǒu hěn duō huā hé shù. Wǒmen zài hú biān zuò le yīhuǐr, liáo le hěn duō yǒuqù de shìqing.",
  },
  default_2: {
    passage: "中国有很多传统节日。春节是最重要的节日。人们会回家和家人团聚，一起吃饺子，看烟花。孩子们最喜欢收到压岁钱。",
    passagePinyin: "Zhōngguó yǒu hěn duō chuántǒng jiérì. Chūnjié shì zuì zhòngyào de jiérì. Rénmen huì huí jiā hé jiārén tuánjù, yīqǐ chī jiǎozi, kàn yānhua. Háizimen zuì xǐhuan shōu dào yāsuìqián.",
  },
  default_3: {
    passage: "学习一门新语言需要时间和耐心。每天练习一点点，比一次学很多更有效。听、说、读、写都很重要，不能只练习其中一个方面。",
    passagePinyin: "Xuéxí yī mén xīn yǔyán xūyào shíjiān hé nàixīn. Měi tiān liànxí yī diǎndiǎn, bǐ yī cì xué hěn duō gèng yǒuxiào. Tīng, shuō, dú, xiě dōu hěn zhòngyào, bù néng zhǐ liànxí qízhōng yī gè fāngmiàn.",
  },
};

function generateReadingPractice(
  node: NodeWithPrereqs,
  allNodes: NodeWithPrereqs[],
  count: number
): PracticeProblem[] {
  const rng = seededRandom(`reading-practice-${node.id}`);
  const problems: PracticeProblem[] = [];
  const readingPool = allNodes.filter(n => n.id !== node.id && n.type === "reading");
  const pool = readingPool.length >= 3 ? readingPool : allNodes.filter(n => n.id !== node.id);

  const passageKeys = Object.keys(READING_PASSAGES);
  const selectedKey = passageKeys[Math.floor(rng() * passageKeys.length)];
  const { passage, passagePinyin } = READING_PASSAGES[selectedKey];

  const topicLabel = node.meaning.replace(" passage", "");

  const generators: Array<() => PracticeProblem> = [
    () => {
      const wrongTopics = shuffle(pool, rng).slice(0, 3).map(n =>
        n.type === "reading" ? n.meaning.replace(" passage", "") : n.meaning
      );
      const allOptions = shuffle([topicLabel, ...wrongTopics], rng);
      return {
        question: "What is the main topic of this passage?",
        options: allOptions,
        correctIndex: allOptions.indexOf(topicLabel),
        explanation: `This passage is about ${node.hanzi} (${topicLabel}).`,
        expectedSeconds: 30,
        questionType: "passage_comprehension" as const,
        passage,
        passagePinyin,
      };
    },
    () => {
      const allOptions = shuffle([
        `To introduce ${topicLabel.toLowerCase()}`,
        "To tell a personal story",
        "To argue against a policy",
        "To describe a historical event",
      ], rng);
      return {
        question: "What is the author's purpose in writing this passage?",
        options: allOptions,
        correctIndex: allOptions.indexOf(`To introduce ${topicLabel.toLowerCase()}`),
        explanation: `The passage is written to introduce the topic of ${node.hanzi}.`,
        expectedSeconds: 25,
        questionType: "passage_comprehension" as const,
        passage,
        passagePinyin,
      };
    },
    () => {
      const allOptions = shuffle([
        "True - the passage discusses this topic",
        "False - the passage discusses a different topic",
        "Not mentioned in the passage",
        "The passage contradicts this",
      ], rng);
      return {
        question: `Based on the passage, is "${node.hanzi}" the main subject discussed?`,
        options: allOptions,
        correctIndex: allOptions.indexOf("True - the passage discusses this topic"),
        explanation: `Yes, ${node.hanzi} (${node.meaning}) is the main subject.`,
        expectedSeconds: 20,
        questionType: "passage_comprehension" as const,
        passage,
        passagePinyin,
      };
    },
  ];

  for (let i = 0; i < count; i++) {
    problems.push(generators[i % generators.length]());
  }
  return problems;
}

function generateWritingPractice(
  node: NodeWithPrereqs,
  allNodes: NodeWithPrereqs[],
  count: number
): PracticeProblem[] {
  const rng = seededRandom(`writing-practice-${node.id}`);
  const problems: PracticeProblem[] = [];
  const writingPool = allNodes.filter(n => n.id !== node.id && n.type === "writing");
  const pool = writingPool.length >= 3 ? writingPool : allNodes.filter(n => n.id !== node.id);

  const writingType = node.meaning.replace("Writing: ", "");
  const modelResponse = `亲爱的朋友，关于${node.hanzi}这个话题，我想和你分享一些想法。首先，这是一个很有意义的话题。其次，我们可以从多个角度来思考。最后，希望我的分享对你有所帮助。`;
  const rubric = [
    "Clear opening that states the purpose",
    "Logical organization with transitions",
    "Appropriate vocabulary for the context",
    "Correct grammar and sentence structure",
  ];

  const generators: Array<() => PracticeProblem> = [
    () => {
      const allOptions = shuffle([
        "Opening greeting and purpose statement",
        "A list of unrelated facts",
        "A poem about nature",
        "A mathematical formula",
      ], rng);
      return {
        question: `When writing a ${writingType.toLowerCase()}, what should you include first?`,
        options: allOptions,
        correctIndex: allOptions.indexOf("Opening greeting and purpose statement"),
        explanation: `A good ${writingType.toLowerCase()} starts with a clear opening that states the purpose.`,
        expectedSeconds: 15,
        questionType: "standard" as const,
        modelResponse,
        rubric,
      };
    },
    () => {
      const wrongTypes = shuffle(pool, rng).slice(0, 3).map(n => n.meaning.replace("Writing: ", ""));
      const allOptions = shuffle([writingType, ...wrongTypes], rng);
      return {
        question: "Which type of writing task does this model response demonstrate?",
        options: allOptions,
        correctIndex: allOptions.indexOf(writingType),
        explanation: `This is an example of ${writingType}.`,
        expectedSeconds: 20,
        questionType: "standard" as const,
        modelResponse,
        rubric,
      };
    },
    () => {
      const allOptions = shuffle([
        "Formal and polite",
        "Casual slang only",
        "Only single-character words",
        "English mixed with Chinese",
      ], rng);
      return {
        question: `What tone is most appropriate for ${writingType.toLowerCase()}?`,
        options: allOptions,
        correctIndex: allOptions.indexOf("Formal and polite"),
        explanation: `${writingType} typically requires a formal and polite tone.`,
        expectedSeconds: 15,
        questionType: "standard" as const,
        modelResponse,
        rubric,
      };
    },
    () => {
      const allOptions = shuffle([
        "Introduction, body paragraphs, conclusion",
        "Random sentences with no connection",
        "Only questions with no answers",
        "A single very long sentence",
      ], rng);
      return {
        question: `What is the best structure for ${writingType.toLowerCase()}?`,
        options: allOptions,
        correctIndex: allOptions.indexOf("Introduction, body paragraphs, conclusion"),
        explanation: `Good writing follows a clear structure: introduction, body paragraphs, and conclusion.`,
        expectedSeconds: 15,
        questionType: "standard" as const,
        modelResponse,
        rubric,
      };
    },
  ];

  for (let i = 0; i < count; i++) {
    problems.push(generators[i % generators.length]());
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
    const problemCount = node.type === "radical" ? 3
      : node.type === "reading" ? 4
      : node.type === "writing" ? 4
      : node.type === "grammar" ? 4
      : 4;
    const practiceProblems = generatePracticeProblems(node, nodes, problemCount);

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
