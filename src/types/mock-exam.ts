export type MockExamSection =
  | "intro"
  | "listening"
  | "reading"
  | "writing_story"
  | "writing_email"
  | "speaking_conversation"
  | "speaking_presentation"
  | "section_break"
  | "score_report";

export interface MockExamReadingPassage {
  id: string;
  passageType: "sign" | "note" | "letter" | "article" | "advertisement";
  chinese: string;
  pinyin?: string;
  questions: MockExamMCQuestion[];
  theme: string;
}

export interface MockExamMCQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MockExamWritingPrompt {
  id: string;
  type: "story_narration" | "email_response";
  instructions: string;
  instructionsChinese?: string;
  imageDescriptions?: string[];
  emailContent?: string;
  emailContentChinese?: string;
  timeLimitMinutes: number;
}

export interface MockExamSpeakingPrompt {
  id: string;
  type: "conversation" | "presentation";
  prompt: string;
  promptChinese?: string;
  conversationTurns?: string[];
  timeLimitSeconds: number;
  prepTimeSeconds?: number;
}

export interface MockExamListeningAnswer {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
}

export interface MockExamReadingAnswer {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
}

export interface MockExamWritingResponse {
  promptId: string;
  text: string;
  score: number;
  feedback: string;
}

export interface MockExamSpeakingResponse {
  promptId: string;
  transcript: string;
  score: number;
  feedback: string;
}

export interface MockExamSectionScore {
  section: string;
  label: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface MockExamResult {
  id: string;
  examNumber: number;
  date: string;
  timestamp: number;
  predictedAPScore: number;
  compositeScore: number;
  sectionScores: MockExamSectionScore[];
  listeningAnswers: MockExamListeningAnswer[];
  readingAnswers: MockExamReadingAnswer[];
  writingResponses: MockExamWritingResponse[];
  speakingResponses: MockExamSpeakingResponse[];
  totalTimeSeconds: number;
  areasToImprove: string[];
}

export interface MockExamState {
  examId: string;
  examNumber: number;
  currentSection: MockExamSection;
  sectionIndex: number;
  sectionTimeRemaining: number;
  isPaused: boolean;
  listeningAnswers: MockExamListeningAnswer[];
  readingAnswers: MockExamReadingAnswer[];
  writingResponses: MockExamWritingResponse[];
  speakingResponses: MockExamSpeakingResponse[];
  startedAt: number;
}

export interface MockExamConfig {
  listeningQuestionCount: number;
  readingQuestionCount: number;
  writingPromptCount: number;
  speakingConversationTurns: number;
  sectionTimeLimits: Record<string, number>;
}

export const DEFAULT_EXAM_CONFIG: MockExamConfig = {
  listeningQuestionCount: 30,
  readingQuestionCount: 35,
  writingPromptCount: 2,
  speakingConversationTurns: 6,
  sectionTimeLimits: {
    listening: 25 * 60,
    reading: 35 * 60,
    writing_story: 15 * 60,
    writing_email: 15 * 60,
    speaking_conversation: 4 * 60,
    speaking_presentation: 6 * 60,
  },
};

export const SECTION_ORDER: MockExamSection[] = [
  "intro",
  "listening",
  "section_break",
  "reading",
  "section_break",
  "writing_story",
  "section_break",
  "writing_email",
  "section_break",
  "speaking_conversation",
  "section_break",
  "speaking_presentation",
  "score_report",
];

export function getSectionLabel(section: MockExamSection): string {
  switch (section) {
    case "intro": return "Exam Overview";
    case "listening": return "Section I Part A: Listening";
    case "reading": return "Section I Part B: Reading";
    case "writing_story": return "Section II Part A: Story Narration";
    case "writing_email": return "Section II Part A: Email Response";
    case "speaking_conversation": return "Section II Part B: Conversation";
    case "speaking_presentation": return "Section II Part B: Cultural Presentation";
    case "section_break": return "Section Break";
    case "score_report": return "Score Report";
  }
}
