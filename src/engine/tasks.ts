import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { Task, TaskType, XPState, MCQuestion } from "../types/tasks";
import { isUnlocked } from "./srs";

const XP_STORAGE_KEY = "lang-academy-xp";
const QUIZ_GATE_XP = 150;

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
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

function defaultXPState(): XPState {
  return {
    totalXP: 0,
    todayXP: 0,
    dailyGoal: 50,
    streak: 0,
    lastActiveDate: getTodayStr(),
    tasksCompletedToday: 0,
    questionsAnsweredToday: 0,
    xpSinceLastQuiz: 0,
  };
}

export function selectTasks(
  graph: GraphNode[],
  progress: UserProgress,
  xpState: XPState
): Task[] {
  const tasks: Task[] = [];
  const now = Date.now();

  const dueForReview: { node: GraphNode; overdueBy: number }[] = [];
  const newUnlocked: GraphNode[] = [];
  const mastered: GraphNode[] = [];

  for (const node of graph) {
    if (!isUnlocked(node.id, graph, progress)) continue;

    const state = progress[node.id];
    if (state) {
      if (state.nextReview < now) {
        dueForReview.push({ node, overdueBy: now - state.nextReview });
      }
      if (state.mastery >= 0.8) {
        mastered.push(node);
      }
    } else {
      newUnlocked.push(node);
    }
  }

  dueForReview.sort((a, b) => b.overdueBy - a.overdueBy);

  for (const { node } of dueForReview.slice(0, 2)) {
    tasks.push({
      id: `review-${node.id}`,
      type: "review",
      topic: node,
      xpReward: 5,
      estimatedMinutes: 3,
    });
  }

  for (const node of newUnlocked.slice(0, 2)) {
    tasks.push({
      id: `lesson-${node.id}`,
      type: "lesson",
      topic: node,
      xpReward: 10,
      estimatedMinutes: 8,
    });
  }

  if (xpState.xpSinceLastQuiz >= QUIZ_GATE_XP && mastered.length >= 3) {
    const quizTopic = mastered[Math.floor(Math.random() * mastered.length)];
    tasks.push({
      id: `quiz-${Date.now()}`,
      type: "quiz",
      topic: quizTopic,
      xpReward: 15,
      estimatedMinutes: 5,
      required: true,
    });
  }

  if (mastered.length >= 4 && tasks.length < 5) {
    const multistepTopic =
      mastered[Math.floor(Math.random() * mastered.length)];
    tasks.push({
      id: `multistep-${Date.now()}`,
      type: "multistep",
      topic: multistepTopic,
      xpReward: 20,
      estimatedMinutes: 12,
    });
  }

  while (tasks.length < 5) {
    if (newUnlocked.length > tasks.filter((t) => t.type === "lesson").length) {
      const idx = tasks.filter((t) => t.type === "lesson").length;
      if (idx < newUnlocked.length) {
        tasks.push({
          id: `lesson-${newUnlocked[idx].id}`,
          type: "lesson",
          topic: newUnlocked[idx],
          xpReward: 10,
          estimatedMinutes: 8,
        });
        continue;
      }
    }
    if (
      dueForReview.length > tasks.filter((t) => t.type === "review").length
    ) {
      const idx = tasks.filter((t) => t.type === "review").length;
      if (idx < dueForReview.length) {
        tasks.push({
          id: `review-${dueForReview[idx].node.id}`,
          type: "review",
          topic: dueForReview[idx].node,
          xpReward: 5,
          estimatedMinutes: 3,
        });
        continue;
      }
    }
    break;
  }

  const seen = new Set<string>();
  return tasks.filter((t) => {
    if (seen.has(t.topic.id)) return false;
    seen.add(t.topic.id);
    return true;
  }).slice(0, 5);
}

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
