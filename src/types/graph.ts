export type NodeType = "radical" | "character" | "word" | "grammar" | "reading" | "writing";

export interface PracticeProblem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  expectedSeconds: number;
}

export interface Lesson {
  tutorial: string;
  workedExample: { problem: string; solution: string };
  practiceProblems: PracticeProblem[];
}

export interface GraphNode {
  id: string;
  type: NodeType;
  hanzi: string;
  pinyin: string;
  meaning: string;
  prereqs: string[];
  hskLevel?: number;
  themes?: string[];
  lesson: Lesson;
}

export interface ProblemBankEntry {
  nodeId: string;
  problems: PracticeProblem[];
}

export type DiagnosticQuestionFormat =
  | "character_to_meaning"
  | "meaning_to_character"
  | "sentence_context"
  | "pinyin_to_character"
  | "reading_comprehension";

export interface DiagnosticQuestion {
  id: string;
  format: DiagnosticQuestionFormat;
  prompt: string;
  sentenceZh?: string;
  sentenceEn?: string;
  passage?: string;
  passageQuestion?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  expectedSeconds: number;
  hskLevel: number;
  targetNodeId: string;
}

export interface MultistepScenario {
  id: string;
  title: string;
  theme: string;
  description: string;
  prereqNodeIds: string[];
  steps: Array<{
    instruction: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    hint?: string;
  }>;
}
