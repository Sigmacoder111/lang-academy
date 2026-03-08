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
