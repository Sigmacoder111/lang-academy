export interface WritingPrompt {
  id: string;
  format: "story_narration" | "email_response";
  theme: string;
  title: string;
  titleChinese: string;
  prompt: string;
  promptChinese: string;
  expectedCharacters: { min: number; max: number };
  timeLimitMinutes: number;
  rubricCriteria: string[];
  modelResponse: string;
}

export interface WritingRubricScores {
  taskCompletion: number;
  organization: number;
  languageUse: number;
}

export interface WritingCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface WritingEvaluation {
  scores: WritingRubricScores;
  overallScore: number;
  feedback: string;
  corrections: WritingCorrection[];
  vocabularySuggestions: string[];
  grammarIssues: string[];
  modelResponse: string;
}
