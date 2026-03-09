import type { GraphNode } from "../types/graph";
import type { TaskType, MCQuestion } from "../types/tasks";

export { selectTasks, DEFAULT_CATEGORY_WEIGHTS } from "./task-selector";
export type { CategoryWeights } from "./task-selector";
export { loadXPState, saveXPState } from "./xp";
export { fallBackwards } from "./mastery";

export function generateMCQuestions(
  targetNode: GraphNode,
  graph: GraphNode[],
  count: number
): MCQuestion[] {
  const questions: MCQuestion[] = [];
  const distractors = graph.filter((n) => n.id !== targetNode.id);

  if (targetNode.type === "grammar") {
    return generateGrammarQuestions(targetNode, distractors, count);
  }
  if (targetNode.type === "reading") {
    return generateReadingQuestions(targetNode, distractors, count);
  }
  if (targetNode.type === "writing") {
    return generateWritingQuestions(targetNode, distractors, count);
  }

  for (let i = 0; i < count; i++) {
    const questionTypes = [
      () => meaningFromHanzi(targetNode, distractors),
      () => hanziFromMeaning(targetNode, distractors),
      () => pinyinFromHanzi(targetNode, distractors),
    ];

    const gen = questionTypes[i % questionTypes.length];
    questions.push(gen());
  }

  return questions;
}

function generateGrammarQuestions(
  node: GraphNode,
  distractors: GraphNode[],
  count: number
): MCQuestion[] {
  const questions: MCQuestion[] = [];
  const grammarDistractors = distractors.filter((n) => n.type === "grammar");
  const pool = grammarDistractors.length >= 3 ? grammarDistractors : distractors;

  const generators = [
    (): MCQuestion => {
      const wrongMeanings = shuffle(pool).slice(0, 3).map((n) => n.meaning);
      const options = shuffle([node.meaning, ...wrongMeanings]);
      return {
        question: `Fill in the blank: The pattern "${node.hanzi}" is used to express ____.`,
        hanzi: node.hanzi,
        options,
        correctIndex: options.indexOf(node.meaning),
        explanation: `${node.hanzi} (${node.pinyin}) expresses "${node.meaning}".`,
        topicId: node.id,
        questionType: "cloze",
      };
    },
    (): MCQuestion => {
      const wrongPatterns = shuffle(pool).slice(0, 3).map((n) => n.hanzi);
      const options = shuffle([node.hanzi, ...wrongPatterns]);
      return {
        question: `Which grammar pattern means "${node.meaning}"?`,
        hanzi: "",
        options,
        correctIndex: options.indexOf(node.hanzi),
        explanation: `"${node.meaning}" is expressed using the pattern ${node.hanzi} (${node.pinyin}).`,
        topicId: node.id,
        questionType: "pattern_match",
      };
    },
    (): MCQuestion => {
      const wrongMeanings = shuffle(pool).slice(0, 3).map((n) => n.meaning);
      const options = shuffle([node.meaning, ...wrongMeanings]);
      return {
        question: `What does the grammar pattern "${node.hanzi}" (${node.pinyin}) express?`,
        hanzi: node.hanzi,
        options,
        correctIndex: options.indexOf(node.meaning),
        explanation: `${node.hanzi} (${node.pinyin}) is used for "${node.meaning}".`,
        topicId: node.id,
        questionType: "standard",
      };
    },
  ];

  for (let i = 0; i < count; i++) {
    questions.push(generators[i % generators.length]());
  }
  return questions;
}

function generateReadingQuestions(
  node: GraphNode,
  distractors: GraphNode[],
  count: number
): MCQuestion[] {
  const questions: MCQuestion[] = [];
  const passage = node.lesson?.practiceProblems?.[0]?.passage
    || `这是一篇关于${node.hanzi}的短文。${node.meaning.replace(" passage", "")}是一个很重要的话题。我们每天都会遇到这样的情况。学习和了解${node.hanzi}可以帮助我们更好地理解中国文化和日常生活。`;
  const passagePinyin = node.lesson?.practiceProblems?.[0]?.passagePinyin || "";

  const readingDistractors = distractors.filter((n) => n.type === "reading");
  const pool = readingDistractors.length >= 3 ? readingDistractors : distractors;

  const generators = [
    (): MCQuestion => {
      const wrongMeanings = shuffle(pool).slice(0, 3).map((n) =>
        n.type === "reading" ? n.meaning.replace(" passage", "") : n.meaning
      );
      const correctAnswer = node.meaning.replace(" passage", "");
      const options = shuffle([correctAnswer, ...wrongMeanings]);
      return {
        question: "What is the main topic of this passage?",
        hanzi: "",
        options,
        correctIndex: options.indexOf(correctAnswer),
        explanation: `This passage is about ${node.hanzi} (${correctAnswer}).`,
        topicId: node.id,
        questionType: "passage_comprehension",
        passage,
        passagePinyin,
      };
    },
    (): MCQuestion => {
      const options = shuffle([
        `To introduce ${node.meaning.replace(" passage", "").toLowerCase()}`,
        "To tell a personal story",
        "To argue against a policy",
        "To describe a historical event",
      ]);
      const correct = `To introduce ${node.meaning.replace(" passage", "").toLowerCase()}`;
      return {
        question: "What is the author's purpose in writing this passage?",
        hanzi: "",
        options,
        correctIndex: options.indexOf(correct),
        explanation: `The passage is written to introduce the topic of ${node.hanzi}.`,
        topicId: node.id,
        questionType: "passage_comprehension",
        passage,
        passagePinyin,
      };
    },
    (): MCQuestion => {
      const options = shuffle([
        "True - the passage discusses this topic",
        "False - the passage discusses a different topic",
        "Not mentioned in the passage",
        "The passage contradicts this",
      ]);
      return {
        question: `Based on the passage, is "${node.hanzi}" the main subject discussed?`,
        hanzi: "",
        options,
        correctIndex: options.indexOf("True - the passage discusses this topic"),
        explanation: `Yes, ${node.hanzi} (${node.meaning}) is the main subject of this passage.`,
        topicId: node.id,
        questionType: "passage_comprehension",
        passage,
        passagePinyin,
      };
    },
  ];

  for (let i = 0; i < count; i++) {
    questions.push(generators[i % generators.length]());
  }
  return questions;
}

function generateWritingQuestions(
  node: GraphNode,
  distractors: GraphNode[],
  count: number
): MCQuestion[] {
  const questions: MCQuestion[] = [];
  const writingDistractors = distractors.filter((n) => n.type === "writing");
  const pool = writingDistractors.length >= 3 ? writingDistractors : distractors;

  const modelResponse = node.lesson?.practiceProblems?.[0]?.modelResponse
    || `这是一个${node.meaning.replace("Writing: ", "")}的范例。写作时要注意结构清晰，语言流畅，用词恰当。`;
  const rubric = node.lesson?.practiceProblems?.[0]?.rubric
    || ["Clear structure and organization", "Appropriate vocabulary usage", "Correct grammar patterns", "Addresses all parts of the prompt"];

  const generators = [
    (): MCQuestion => {
      const options = shuffle([
        "Opening greeting and purpose statement",
        "A list of unrelated facts",
        "A poem about nature",
        "A mathematical formula",
      ]);
      return {
        question: `When writing a ${node.meaning.replace("Writing: ", "").toLowerCase()}, what should you include first?`,
        hanzi: "",
        options,
        correctIndex: options.indexOf("Opening greeting and purpose statement"),
        explanation: `A good ${node.meaning.replace("Writing: ", "").toLowerCase()} starts with a clear opening that states the purpose.`,
        topicId: node.id,
        questionType: "standard",
        modelResponse,
        rubric,
      };
    },
    (): MCQuestion => {
      const wrongMeanings = shuffle(pool).slice(0, 3).map((n) => n.meaning.replace("Writing: ", ""));
      const correct = node.meaning.replace("Writing: ", "");
      const options = shuffle([correct, ...wrongMeanings]);
      return {
        question: "Which type of writing task does this model response demonstrate?",
        hanzi: "",
        options,
        correctIndex: options.indexOf(correct),
        explanation: `This is an example of ${correct}.`,
        topicId: node.id,
        questionType: "standard",
        modelResponse,
        rubric,
      };
    },
    (): MCQuestion => {
      const options = shuffle([
        "Formal and polite",
        "Casual slang only",
        "Only single-character words",
        "English mixed with Chinese",
      ]);
      return {
        question: `What tone is most appropriate for ${node.meaning.replace("Writing: ", "").toLowerCase()}?`,
        hanzi: "",
        options,
        correctIndex: options.indexOf("Formal and polite"),
        explanation: `${node.meaning.replace("Writing: ", "")} typically requires a formal and polite tone.`,
        topicId: node.id,
        questionType: "standard",
        modelResponse,
        rubric,
      };
    },
  ];

  for (let i = 0; i < count; i++) {
    questions.push(generators[i % generators.length]());
  }
  return questions;
}

function meaningFromHanzi(
  node: GraphNode,
  distractors: GraphNode[]
): MCQuestion {
  const wrongOptions = shuffle(distractors)
    .slice(0, 3)
    .map((n) => n.meaning);
  const options = shuffle([node.meaning, ...wrongOptions]);
  return {
    question: `What does "${node.hanzi}" mean?`,
    hanzi: node.hanzi,
    options,
    correctIndex: options.indexOf(node.meaning),
    explanation: `${node.hanzi} (${node.pinyin}) means "${node.meaning}".`,
    topicId: node.id,
  };
}

function hanziFromMeaning(
  node: GraphNode,
  distractors: GraphNode[]
): MCQuestion {
  const wrongOptions = shuffle(distractors)
    .slice(0, 3)
    .map((n) => n.hanzi);
  const options = shuffle([node.hanzi, ...wrongOptions]);
  return {
    question: `Which character means "${node.meaning}"?`,
    hanzi: "",
    options,
    correctIndex: options.indexOf(node.hanzi),
    explanation: `${node.hanzi} (${node.pinyin}) means "${node.meaning}".`,
    topicId: node.id,
  };
}

function pinyinFromHanzi(
  node: GraphNode,
  distractors: GraphNode[]
): MCQuestion {
  const wrongOptions = shuffle(distractors)
    .slice(0, 3)
    .map((n) => n.pinyin);
  const options = shuffle([node.pinyin, ...wrongOptions]);
  return {
    question: `What is the pinyin for "${node.hanzi}"?`,
    hanzi: node.hanzi,
    options,
    correctIndex: options.indexOf(node.pinyin),
    explanation: `${node.hanzi} is pronounced "${node.pinyin}" and means "${node.meaning}".`,
    topicId: node.id,
  };
}

export function generateMixedQuestions(
  topics: GraphNode[],
  graph: GraphNode[],
  count: number
): MCQuestion[] {
  const questions: MCQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const topic = topics[i % topics.length];
    const topicQuestions = generateMCQuestions(topic, graph, 1);
    if (topicQuestions.length > 0) {
      questions.push(topicQuestions[0]);
    }
  }

  return shuffle(questions);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getTaskTypeInfo(type: TaskType) {
  const info: Record<
    TaskType,
    { icon: string; label: string; borderColor: string; badgeBg: string }
  > = {
    lesson: {
      icon: "📖",
      label: "Lesson",
      borderColor: "var(--accent)",
      badgeBg: "var(--accent)",
    },
    review: {
      icon: "🔄",
      label: "Review",
      borderColor: "var(--text-muted)",
      badgeBg: "var(--text-muted)",
    },
    quiz: {
      icon: "⏱",
      label: "Quiz",
      borderColor: "var(--xp-gold)",
      badgeBg: "var(--xp-gold)",
    },
    multistep: {
      icon: "🧩",
      label: "Multistep",
      borderColor: "var(--success)",
      badgeBg: "var(--success)",
    },
  };
  return info[type];
}
