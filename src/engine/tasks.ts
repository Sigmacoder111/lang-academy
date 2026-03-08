import type { GraphNode } from "../types/graph";
import type { TaskType, MCQuestion } from "../types/tasks";

export { selectTasks } from "./task-selector";
export { loadXPState, saveXPState } from "./xp";
export { fallBackwards } from "./mastery";

export function generateMCQuestions(
  targetNode: GraphNode,
  graph: GraphNode[],
  count: number
): MCQuestion[] {
  const questions: MCQuestion[] = [];
  const distractors = graph.filter((n) => n.id !== targetNode.id);

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
  const distractors = graph;

  for (let i = 0; i < count; i++) {
    const topic = topics[i % topics.length];
    const others = distractors.filter((n) => n.id !== topic.id);
    const questionTypes = [
      () => meaningFromHanzi(topic, others),
      () => hanziFromMeaning(topic, others),
      () => pinyinFromHanzi(topic, others),
    ];
    questions.push(questionTypes[i % questionTypes.length]());
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
