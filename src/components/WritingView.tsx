import { useState, useCallback, useMemo } from "react";
import type { GraphNode } from "../types/graph";
import type { TaskResult, WritingEvaluation } from "../types/tasks";
import { getWritingPrompt, getRandomWritingPrompt, type WritingPrompt } from "../data/writing-prompts";
import { evaluateWriting } from "../engine/writing-evaluator";
import WritingInput from "./WritingInput";
import WritingFeedback from "./WritingFeedback";

interface WritingViewProps {
  topic: GraphNode;
  onComplete: (result: TaskResult) => void;
  onBack: () => void;
  promptId?: string;
  writingFormat?: "story_narration" | "email_response";
}

const BASE_XP = 15;
const BONUS_THRESHOLD = 5;

export default function WritingView({
  topic: _topic,
  onComplete,
  onBack,
  promptId,
  writingFormat,
}: WritingViewProps) {
  void _topic;
  const [phase, setPhase] = useState<"input" | "evaluating" | "feedback" | "error">("input");
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  const [studentText, setStudentText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const prompt: WritingPrompt = useMemo(() => {
    if (promptId) {
      const p = getWritingPrompt(promptId);
      if (p) return p;
    }
    return getRandomWritingPrompt(writingFormat);
  }, [promptId, writingFormat]);

  const calculateXP = useCallback((eval_: WritingEvaluation) => {
    const allHigh = eval_.scores.taskCompletion >= BONUS_THRESHOLD
      && eval_.scores.organization >= BONUS_THRESHOLD
      && eval_.scores.languageUse >= BONUS_THRESHOLD;
    const bonusXP = allHigh ? 5 : 0;
    return { xpEarned: BASE_XP, bonusXP };
  }, []);

  const handleSubmit = useCallback(async (text: string) => {
    setStudentText(text);
    setPhase("evaluating");

    try {
      const result = await evaluateWriting({
        taskType: prompt.type,
        prompt: prompt.prompt,
        promptChinese: prompt.promptChinese,
        studentText: text,
        modelResponse: prompt.modelResponse,
        rubricFocus: prompt.rubricFocus,
      });
      setEvaluation(result);
      setPhase("feedback");
    } catch (err) {
      console.error("Writing evaluation failed:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to evaluate writing. Please try again."
      );
      setPhase("error");
    }
  }, [prompt]);

  const handleTryAgain = useCallback(() => {
    setEvaluation(null);
    setStudentText("");
    setPhase("input");
  }, []);

  const handleFinish = useCallback(() => {
    if (!evaluation) return;
    const { xpEarned, bonusXP } = calculateXP(evaluation);
    onComplete({
      xpEarned,
      bonusXP,
      questionsAnswered: 1,
      correctCount: evaluation.overallScore >= 4 ? 1 : 0,
      perfectScore: evaluation.overallScore >= 5,
    });
  }, [evaluation, calculateXP, onComplete]);

  if (phase === "evaluating") {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={loadingContainer}>
            <div style={loadingSpinner} />
            <div style={loadingTitle}>Evaluating Your Writing...</div>
            <div style={loadingSubtext}>
              AI is analyzing your response against the AP rubric. This may take a few seconds.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div style={containerStyle}>
        <button onClick={onBack} style={backButtonStyle}>
          ← Back
        </button>
        <div style={cardStyle}>
          <div style={{ textAlign: "center" as const, padding: "2rem 0" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⚠</div>
            <div style={errorTitle}>Evaluation Error</div>
            <div style={errorText}>{errorMessage}</div>
            <div style={errorHint}>
              Make sure you have set your Anthropic API key. The key should be stored in localStorage under the key <code>anthropic-api-key</code>.
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button
                onClick={() => {
                  const key = window.prompt("Enter your Anthropic API key:");
                  if (key) {
                    localStorage.setItem("anthropic-api-key", key.trim());
                    setPhase("input");
                  }
                }}
                style={apiKeyButton}
              >
                Set API Key
              </button>
              <button
                onClick={() => setPhase("input")}
                style={retryButton}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "feedback" && evaluation) {
    const { xpEarned, bonusXP } = calculateXP(evaluation);
    return (
      <WritingFeedback
        evaluation={evaluation}
        studentText={studentText}
        onTryAgain={handleTryAgain}
        onFinish={handleFinish}
        xpEarned={xpEarned}
        bonusXP={bonusXP}
      />
    );
  }

  return (
    <WritingInput
      onSubmit={handleSubmit}
      onBack={onBack}
      expectedCharCount={prompt.expectedCharCount}
      timeLimitMinutes={prompt.timeLimitMinutes}
      promptType={prompt.type}
      prompt={prompt.prompt}
      promptChinese={prompt.promptChinese}
      title={prompt.title}
      titleChinese={prompt.titleChinese}
    />
  );
}

const containerStyle: React.CSSProperties = {
  maxWidth: "48rem",
  margin: "0 auto",
  padding: "0 1rem",
};

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  boxShadow: "0 0.5rem 2rem rgba(0,0,0,0.06)",
  borderRadius: "1rem",
  padding: "2rem",
};

const backButtonStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  color: "var(--text-muted)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "0.5rem 0",
  marginBottom: "1rem",
};

const loadingContainer: React.CSSProperties = {
  textAlign: "center",
  padding: "3rem 1rem",
};

const loadingSpinner: React.CSSProperties = {
  width: "3rem",
  height: "3rem",
  border: "3px solid var(--border)",
  borderTopColor: "var(--writing-green, #4A8C6F)",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "0 auto 1.5rem",
};

const loadingTitle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.25rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  marginBottom: "0.5rem",
};

const loadingSubtext: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  color: "var(--text-muted)",
  lineHeight: 1.6,
};

const errorTitle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.25rem",
  fontWeight: 600,
  color: "var(--error)",
  marginBottom: "0.5rem",
};

const errorText: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  color: "var(--text-primary)",
  lineHeight: 1.6,
  marginBottom: "0.75rem",
};

const errorHint: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "13px",
  color: "var(--text-muted)",
  lineHeight: 1.6,
};

const apiKeyButton: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  fontWeight: 600,
  color: "var(--writing-green, #4A8C6F)",
  background: "transparent",
  border: "1.5px solid var(--writing-green, #4A8C6F)",
  borderRadius: "0.5rem",
  padding: "0.625rem 1.25rem",
  cursor: "pointer",
  flex: 1,
};

const retryButton: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  fontWeight: 600,
  color: "#FFFFFF",
  background: "var(--writing-green, #4A8C6F)",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.625rem 1.25rem",
  cursor: "pointer",
  flex: 1,
};
