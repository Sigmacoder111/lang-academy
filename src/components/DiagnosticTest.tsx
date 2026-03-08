import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { GraphNode, ProblemBankEntry, DiagnosticQuestion } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { DiagnosticReport } from "../engine/diagnostic";
import {
  startDiagnostic,
  getDiagnosticProblem,
  recordDiagnosticResponse,
  commitDiagnosticResults,
  saveDiagnosticState,
  loadDiagnosticState,
  clearDiagnosticState,
  estimatedTotalQuestions,
} from "../engine/diagnostic";
import type { DiagnosticState } from "../engine/diagnostic";
import { buildDiagnosticBank } from "../data/diagnostic-questions";

interface DiagnosticTestProps {
  graph: GraphNode[];
  problemBank: ProblemBankEntry[];
  onComplete: (progress: UserProgress, report: DiagnosticReport) => void;
  onBack: () => void;
}

type TestScreen = "intro" | "testing" | "finished";

export default function DiagnosticTest({
  graph,
  onComplete,
  onBack,
}: DiagnosticTestProps) {
  const [screen, setScreen] = useState<TestScreen>("intro");
  const [state, setState] = useState<DiagnosticState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<DiagnosticQuestion | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const problemStartRef = useRef<number>(0);

  const diagnosticBank = useMemo(() => buildDiagnosticBank(graph), [graph]);

  const hasResumableState = loadDiagnosticState() !== null;

  const startTimer = useCallback(() => {
    setTimer(0);
    problemStartRef.current = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(Math.round((Date.now() - problemStartRef.current) / 1000));
    }, 200);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const loadNextProblem = useCallback(
    (diagState: DiagnosticState) => {
      if (diagState.phase === "complete") {
        stopTimer();
        const { progress, report } = commitDiagnosticResults(diagState, graph);
        clearDiagnosticState();
        onComplete(progress, report);
        return;
      }

      const result = getDiagnosticProblem(diagState, diagnosticBank);
      if (!result) {
        const forced: DiagnosticState = { ...diagState, phase: "complete" };
        const { progress, report } = commitDiagnosticResults(forced, graph);
        clearDiagnosticState();
        onComplete(progress, report);
        return;
      }

      setCurrentQuestion(result.question);
      setSelectedIndex(null);
      setShowExplanation(false);
      startTimer();
    },
    [graph, diagnosticBank, onComplete, startTimer, stopTimer]
  );

  const handleStart = useCallback(
    (resume: boolean) => {
      let diagState: DiagnosticState;
      if (resume) {
        const saved = loadDiagnosticState();
        diagState = saved ?? startDiagnostic();
      } else {
        clearDiagnosticState();
        diagState = startDiagnostic();
      }
      setState(diagState);
      setScreen("testing");
      loadNextProblem(diagState);
    },
    [loadNextProblem]
  );

  const handleAnswer = useCallback(
    (index: number) => {
      if (selectedIndex !== null || !currentQuestion || !state) return;
      stopTimer();
      setSelectedIndex(index);
      setShowExplanation(true);

      const solveTime = (Date.now() - problemStartRef.current) / 1000;
      const correct = index === currentQuestion.correctIndex;

      const newState = recordDiagnosticResponse(
        state,
        currentQuestion,
        correct,
        solveTime,
      );

      setState(newState);
      saveDiagnosticState(newState);
    },
    [selectedIndex, currentQuestion, state, stopTimer]
  );

  const handleNext = useCallback(() => {
    if (!state) return;
    loadNextProblem(state);
  }, [state, loadNextProblem]);

  if (screen === "intro") {
    return <IntroScreen onStart={handleStart} onBack={onBack} hasResumable={hasResumableState} />;
  }

  if (!currentQuestion || !state) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <p style={{ ...textStyle, textAlign: "center" as const }}>Loading...</p>
        </div>
      </div>
    );
  }

  const estimated = estimatedTotalQuestions(state);
  const progressPercent = Math.min(100, (state.questionCount / estimated) * 100);
  const phaseLabel = state.phase === "adaptive_search" ? "Finding your level" : "Refining placement";

  return (
    <div style={containerStyle}>
      {/* Progress header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <button onClick={onBack} style={backBtnStyle}>
            &larr; Save & Exit
          </button>
          <span style={{ ...mutedTextStyle, fontSize: "13px" }}>{phaseLabel}</span>
          <span style={{ ...mutedTextStyle, fontSize: "13px" }}>
            Question {state.questionCount + 1} of ~{estimated}
          </span>
        </div>
        <div style={progressBarBg}>
          <div
            style={{
              ...progressBarFill,
              width: `${progressPercent}%`,
            }}
          />
        </div>
      </div>

      {/* Timer */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1.25rem",
        }}
      >
        <div style={timerStyle}>
          <span style={timerIconStyle}>&#9201;</span>
          <span>{formatTime(timer)}</span>
        </div>
      </div>

      {/* Question card */}
      <div style={cardStyle}>
        <QuestionRenderer
          question={currentQuestion}
          selectedIndex={selectedIndex}
          onAnswer={handleAnswer}
          showExplanation={showExplanation}
          onNext={handleNext}
        />
      </div>

      {/* Level indicator */}
      <div style={{ textAlign: "center" as const, marginTop: "1.25rem" }}>
        <span style={{ ...mutedTextStyle, fontSize: "12px" }}>
          HSK {state.currentLevel}{state.boundaryLevel ? ` · Boundary: HSK ${state.boundaryLevel}` : ""}
        </span>
      </div>
    </div>
  );
}

// --- Question Renderer ---

function QuestionRenderer({
  question,
  selectedIndex,
  onAnswer,
  showExplanation,
  onNext,
}: {
  question: DiagnosticQuestion;
  selectedIndex: number | null;
  onAnswer: (index: number) => void;
  showExplanation: boolean;
  onNext: () => void;
}) {
  switch (question.format) {
    case "character_to_meaning":
      return (
        <CharToMeaningView
          question={question}
          selectedIndex={selectedIndex}
          onAnswer={onAnswer}
          showExplanation={showExplanation}
          onNext={onNext}
        />
      );
    case "meaning_to_character":
      return (
        <MeaningToCharView
          question={question}
          selectedIndex={selectedIndex}
          onAnswer={onAnswer}
          showExplanation={showExplanation}
          onNext={onNext}
        />
      );
    case "sentence_context":
      return (
        <SentenceContextView
          question={question}
          selectedIndex={selectedIndex}
          onAnswer={onAnswer}
          showExplanation={showExplanation}
          onNext={onNext}
        />
      );
    case "pinyin_to_character":
      return (
        <PinyinToCharView
          question={question}
          selectedIndex={selectedIndex}
          onAnswer={onAnswer}
          showExplanation={showExplanation}
          onNext={onNext}
        />
      );
    case "reading_comprehension":
      return (
        <ReadingCompView
          question={question}
          selectedIndex={selectedIndex}
          onAnswer={onAnswer}
          showExplanation={showExplanation}
          onNext={onNext}
        />
      );
    default:
      return null;
  }
}

interface FormatViewProps {
  question: DiagnosticQuestion;
  selectedIndex: number | null;
  onAnswer: (index: number) => void;
  showExplanation: boolean;
  onNext: () => void;
}

// --- Format 1: Character → Meaning ---

function CharToMeaningView({ question, selectedIndex, onAnswer, showExplanation, onNext }: FormatViewProps) {
  return (
    <>
      <div style={{ marginBottom: "0.75rem" }}>
        <span style={formatLabelStyle}>What does this mean?</span>
      </div>
      <div style={hanziDisplayStyle}>
        {question.prompt}
      </div>
      <OptionsList
        options={question.options}
        correctIndex={question.correctIndex}
        selectedIndex={selectedIndex}
        onAnswer={onAnswer}
        isChinese={false}
      />
      <ExplanationBlock
        show={showExplanation}
        correct={selectedIndex === question.correctIndex}
        explanation={question.explanation}
        onNext={onNext}
      />
    </>
  );
}

// --- Format 2: Meaning → Character ---

function MeaningToCharView({ question, selectedIndex, onAnswer, showExplanation, onNext }: FormatViewProps) {
  return (
    <>
      <div style={{ marginBottom: "0.75rem" }}>
        <span style={formatLabelStyle}>Which word means:</span>
      </div>
      <div style={meaningDisplayStyle}>
        &ldquo;{question.prompt}&rdquo;
      </div>
      <OptionsList
        options={question.options}
        correctIndex={question.correctIndex}
        selectedIndex={selectedIndex}
        onAnswer={onAnswer}
        isChinese={true}
      />
      <ExplanationBlock
        show={showExplanation}
        correct={selectedIndex === question.correctIndex}
        explanation={question.explanation}
        onNext={onNext}
      />
    </>
  );
}

// --- Format 3: Sentence Context ---

function SentenceContextView({ question, selectedIndex, onAnswer, showExplanation, onNext }: FormatViewProps) {
  return (
    <>
      <div style={{ marginBottom: "0.75rem" }}>
        <span style={formatLabelStyle}>Choose the word that best completes the sentence:</span>
      </div>
      {question.sentenceZh && (
        <div style={sentenceDisplayStyle}>
          <p style={sentenceZhStyle}>{question.sentenceZh}</p>
          {question.sentenceEn && (
            <p style={sentenceEnStyle}>{question.sentenceEn}</p>
          )}
        </div>
      )}
      <OptionsList
        options={question.options}
        correctIndex={question.correctIndex}
        selectedIndex={selectedIndex}
        onAnswer={onAnswer}
        isChinese={true}
      />
      <ExplanationBlock
        show={showExplanation}
        correct={selectedIndex === question.correctIndex}
        explanation={question.explanation}
        onNext={onNext}
      />
    </>
  );
}

// --- Format 4: Pinyin → Character ---

function PinyinToCharView({ question, selectedIndex, onAnswer, showExplanation, onNext }: FormatViewProps) {
  return (
    <>
      <div style={{ marginBottom: "0.75rem" }}>
        <span style={formatLabelStyle}>Which character is pronounced:</span>
      </div>
      <div style={pinyinDisplayStyle}>
        {question.prompt}
      </div>
      <OptionsList
        options={question.options}
        correctIndex={question.correctIndex}
        selectedIndex={selectedIndex}
        onAnswer={onAnswer}
        isChinese={true}
      />
      <ExplanationBlock
        show={showExplanation}
        correct={selectedIndex === question.correctIndex}
        explanation={question.explanation}
        onNext={onNext}
      />
    </>
  );
}

// --- Format 5: Reading Comprehension ---

function ReadingCompView({ question, selectedIndex, onAnswer, showExplanation, onNext }: FormatViewProps) {
  return (
    <>
      <div style={{ marginBottom: "0.75rem" }}>
        <span style={formatLabelStyle}>Reading Comprehension</span>
      </div>
      {question.passage && (
        <div style={passageDisplayStyle}>
          <p style={passageTextStyle}>{question.passage}</p>
        </div>
      )}
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={questionTextStyle}>{question.passageQuestion ?? question.prompt}</p>
      </div>
      <OptionsList
        options={question.options}
        correctIndex={question.correctIndex}
        selectedIndex={selectedIndex}
        onAnswer={onAnswer}
        isChinese={false}
      />
      <ExplanationBlock
        show={showExplanation}
        correct={selectedIndex === question.correctIndex}
        explanation={question.explanation}
        onNext={onNext}
      />
    </>
  );
}

// --- Shared Components ---

function OptionsList({
  options,
  correctIndex,
  selectedIndex,
  onAnswer,
  isChinese,
}: {
  options: string[];
  correctIndex: number;
  selectedIndex: number | null;
  onAnswer: (index: number) => void;
  isChinese: boolean;
}) {
  const answered = selectedIndex !== null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {options.map((opt, idx) => {
        const isSelected = selectedIndex === idx;
        const isCorrect = idx === correctIndex;

        let bg = "var(--surface)";
        let border = "1px solid var(--border)";
        let textColor = "var(--text-primary)";

        if (answered) {
          if (isCorrect) {
            bg = "rgba(74, 140, 111, 0.12)";
            border = "1.5px solid var(--success)";
            textColor = "var(--success)";
          } else if (isSelected && !isCorrect) {
            bg = "rgba(193, 95, 60, 0.12)";
            border = "1.5px solid var(--error)";
            textColor = "var(--error)";
          }
        }

        return (
          <button
            key={idx}
            onClick={() => onAnswer(idx)}
            disabled={answered}
            style={{
              display: "block",
              width: "100%",
              padding: "0.875rem 1.25rem",
              background: bg,
              border,
              borderRadius: "0.75rem",
              cursor: answered ? "default" : "pointer",
              textAlign: "left" as const,
              fontFamily: isChinese
                ? "'Noto Serif SC', Georgia, serif"
                : "Georgia, 'Times New Roman', serif",
              fontSize: isChinese ? "1.125rem" : "1rem",
              color: textColor,
              transition: "all 0.15s ease",
              opacity: answered && !isSelected && !isCorrect ? 0.5 : 1,
            }}
          >
            <span style={{ marginRight: "0.75rem", fontWeight: 600, opacity: 0.5 }}>
              {String.fromCharCode(65 + idx)}.
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ExplanationBlock({
  show,
  correct,
  explanation,
  onNext,
}: {
  show: boolean;
  correct: boolean;
  explanation: string;
  onNext: () => void;
}) {
  if (!show) return null;

  return (
    <div style={explanationContainerStyle}>
      <div
        style={{
          ...explanationStyle,
          borderLeft: correct
            ? "3px solid var(--success)"
            : "3px solid var(--error)",
        }}
      >
        <p style={{ margin: 0, ...textStyle, fontSize: "14px" }}>
          {correct ? "Correct!" : "Incorrect."} {explanation}
        </p>
      </div>
      <button onClick={onNext} style={nextBtnStyle}>
        Continue
      </button>
    </div>
  );
}

// --- Intro Screen ---

function IntroScreen({
  onStart,
  onBack,
  hasResumable,
}: {
  onStart: (resume: boolean) => void;
  onBack: () => void;
  hasResumable: boolean;
}) {
  return (
    <div style={containerStyle}>
      <div style={{ ...cardStyle, textAlign: "center" as const }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>&#128218;</div>
        <h2 style={{ ...headingStyle, marginBottom: "0.75rem" }}>Placement Diagnostic</h2>
        <p style={{ ...textStyle, marginBottom: "0.5rem", maxWidth: "28rem", marginLeft: "auto", marginRight: "auto" }}>
          This adaptive test will determine your Chinese proficiency level in about 20-30 minutes.
          It measures both <strong>accuracy</strong> and <strong>speed</strong> to find your knowledge frontier.
        </p>
        <p style={{ ...mutedTextStyle, marginBottom: "2rem", fontSize: "14px" }}>
          ~30-35 questions &middot; 5 question types &middot; Adapts to your level &middot; Results include placement, gaps &amp; study plan
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
          <button onClick={() => onStart(false)} style={primaryBtnStyle}>
            Start Diagnostic
          </button>
          {hasResumable && (
            <button onClick={() => onStart(true)} style={secondaryBtnStyle}>
              Resume Previous Test
            </button>
          )}
          <button onClick={onBack} style={ghostBtnStyle}>
            Back to Dashboard
          </button>
        </div>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            background: "rgba(193, 95, 60, 0.06)",
            borderRadius: "0.75rem",
            textAlign: "left" as const,
          }}
        >
          <p style={{ ...mutedTextStyle, fontSize: "13px", margin: "0 0 0.5rem" }}>
            <strong style={{ color: "var(--text-primary)" }}>How it works:</strong>
          </p>
          <ul style={{ ...mutedTextStyle, fontSize: "13px", margin: 0, paddingLeft: "1.25rem" }}>
            <li style={{ marginBottom: "0.25rem" }}>Phase 1: Adaptive search finds your approximate level (recognition &amp; sentence context)</li>
            <li style={{ marginBottom: "0.25rem" }}>Phase 2: Frontier refinement with recall, reading comprehension &amp; pronunciation</li>
            <li style={{ marginBottom: "0.25rem" }}>Speed matters — faster correct answers show stronger mastery</li>
            <li>You can save and resume anytime</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// --- Helpers ---

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// --- Styles ---

const containerStyle: React.CSSProperties = {
  maxWidth: "40rem",
  margin: "0 auto",
  padding: "0 1rem",
};

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  borderRadius: "1rem",
  padding: "2rem",
  boxShadow: "0 0.5rem 2rem rgba(0,0,0,0.06)",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "var(--text-primary)",
  margin: 0,
};

const textStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1rem",
  color: "var(--text-primary)",
  lineHeight: 1.6,
};

const mutedTextStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  color: "var(--text-muted)",
  lineHeight: 1.5,
};

const questionTextStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.05rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  margin: 0,
  lineHeight: 1.5,
};

const formatLabelStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "var(--text-muted)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
};

const hanziDisplayStyle: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', Georgia, serif",
  fontSize: "3rem",
  fontWeight: 700,
  color: "var(--text-primary)",
  textAlign: "center" as const,
  padding: "1.5rem 0",
  marginBottom: "1.5rem",
  background: "var(--bg-primary)",
  borderRadius: "0.75rem",
};

const meaningDisplayStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.5rem",
  fontWeight: 600,
  fontStyle: "italic" as const,
  color: "var(--text-primary)",
  textAlign: "center" as const,
  padding: "1.25rem 0",
  marginBottom: "1.5rem",
};

const pinyinDisplayStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "2rem",
  fontWeight: 700,
  color: "var(--accent)",
  textAlign: "center" as const,
  padding: "1.25rem 0",
  marginBottom: "1.5rem",
  background: "var(--bg-primary)",
  borderRadius: "0.75rem",
};

const sentenceDisplayStyle: React.CSSProperties = {
  padding: "1.25rem",
  marginBottom: "1.25rem",
  background: "var(--bg-primary)",
  borderRadius: "0.75rem",
  borderLeft: "3px solid var(--accent)",
};

const sentenceZhStyle: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', Georgia, serif",
  fontSize: "1.25rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  margin: 0,
  lineHeight: 1.6,
};

const sentenceEnStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.9rem",
  color: "var(--text-muted)",
  margin: "0.5rem 0 0",
  fontStyle: "italic" as const,
  lineHeight: 1.5,
};

const passageDisplayStyle: React.CSSProperties = {
  padding: "1.25rem",
  marginBottom: "1.25rem",
  background: "var(--bg-primary)",
  borderRadius: "0.75rem",
  borderLeft: "3px solid var(--accent)",
};

const passageTextStyle: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', Georgia, serif",
  fontSize: "1.15rem",
  fontWeight: 500,
  color: "var(--text-primary)",
  margin: 0,
  lineHeight: 1.8,
};

const progressBarBg: React.CSSProperties = {
  height: "4px",
  borderRadius: "2px",
  background: "var(--border)",
  overflow: "hidden",
};

const progressBarFill: React.CSSProperties = {
  height: "100%",
  background: "var(--accent)",
  borderRadius: "2px",
  transition: "width 0.4s ease",
};

const timerStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.125rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  background: "var(--surface)",
  padding: "0.375rem 1rem",
  borderRadius: "9999px",
  boxShadow: "0 0.125rem 0.5rem rgba(0,0,0,0.06)",
};

const timerIconStyle: React.CSSProperties = {
  fontSize: "1rem",
};

const explanationContainerStyle: React.CSSProperties = {
  marginTop: "1.25rem",
};

const explanationStyle: React.CSSProperties = {
  padding: "0.875rem 1rem",
  borderRadius: "0.5rem",
  background: "var(--bg-primary)",
  marginBottom: "1rem",
};

const backBtnStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--text-muted)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "0.25rem 0",
};

const nextBtnStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "0.75rem",
  background: "var(--accent)",
  color: "#fff",
  border: "none",
  borderRadius: "0.75rem",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 0.15s ease",
};

const primaryBtnStyle: React.CSSProperties = {
  padding: "0.875rem 2.5rem",
  background: "var(--accent)",
  color: "#fff",
  border: "none",
  borderRadius: "0.75rem",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 0.15s ease",
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: "0.75rem 2rem",
  background: "transparent",
  color: "var(--accent)",
  border: "1.5px solid var(--accent)",
  borderRadius: "0.75rem",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 0.15s ease",
};

const ghostBtnStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  background: "transparent",
  color: "var(--text-muted)",
  border: "none",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  cursor: "pointer",
};
