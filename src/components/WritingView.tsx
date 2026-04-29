import { useState, useCallback, useMemo } from "react";
import type { GraphNode } from "../types/graph";
import type { TaskResult } from "../types/tasks";
import type { WritingEvaluation } from "../types/writing";
import { getRandomWritingPrompt, getWritingPrompt } from "../data/writing-prompts";
import {
  evaluateWriting,
  generateLocalEvaluation,
  loadApiKey,
  saveApiKey,
} from "../engine/writing-evaluator";
import WritingInput from "./WritingInput";
import WritingFeedback from "./WritingFeedback";

interface WritingViewProps {
  topic?: GraphNode;
  promptId?: string;
  writingFormat?: "story_narration" | "email_response";
  onComplete: (result: TaskResult) => void;
  onBack: () => void;
}

const BASE_XP = 15;
const BONUS_XP_THRESHOLD = 5;

export default function WritingView({
  promptId,
  writingFormat,
  onComplete,
  onBack,
}: WritingViewProps) {
  const prompt = useMemo(() => {
    if (promptId) {
      return getWritingPrompt(promptId) || getRandomWritingPrompt(writingFormat);
    }
    return getRandomWritingPrompt(writingFormat);
  }, [promptId, writingFormat]);

  const [phase, setPhase] = useState<"writing" | "feedback" | "api_key">("writing");
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  const [studentText, setStudentText] = useState("");
  const [apiKey, setApiKey] = useState(loadApiKey);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (text: string) => {
      setStudentText(text);
      setIsLoading(true);
      setApiError(null);

      const key = loadApiKey();
      if (!key) {
        setIsLoading(false);
        setPhase("api_key");
        return;
      }

      try {
        const result = await evaluateWriting(prompt, text, key);
        setEvaluation(result);
        setPhase("feedback");
      } catch (error) {
        console.error("AI evaluation failed, using local fallback:", error);
        const localResult = generateLocalEvaluation(prompt, text);
        setEvaluation(localResult);
        setApiError(
          error instanceof Error
            ? error.message
            : "AI evaluation failed. Using local grading instead."
        );
        setPhase("feedback");
      } finally {
        setIsLoading(false);
      }
    },
    [prompt]
  );

  const handleApiKeySubmit = useCallback(async () => {
    if (!apiKey.trim()) return;
    saveApiKey(apiKey.trim());
    setPhase("writing");

    if (studentText) {
      setIsLoading(true);
      setApiError(null);
      try {
        const result = await evaluateWriting(prompt, studentText, apiKey.trim());
        setEvaluation(result);
        setPhase("feedback");
      } catch (error) {
        console.error("AI evaluation failed:", error);
        const localResult = generateLocalEvaluation(prompt, studentText);
        setEvaluation(localResult);
        setApiError("AI evaluation failed. Using local grading.");
        setPhase("feedback");
      } finally {
        setIsLoading(false);
      }
    }
  }, [apiKey, studentText, prompt]);

  const handleSkipApiKey = useCallback(() => {
    const localResult = generateLocalEvaluation(prompt, studentText);
    setEvaluation(localResult);
    setApiError("Using local grading (no API key provided).");
    setPhase("feedback");
  }, [prompt, studentText]);

  const handleTryAgain = useCallback(() => {
    setEvaluation(null);
    setStudentText("");
    setApiError(null);
    setPhase("writing");
  }, []);

  const handleFinish = useCallback(() => {
    if (!evaluation) return;

    const { scores, overallScore } = evaluation;
    const allHigh =
      scores.taskCompletion >= BONUS_XP_THRESHOLD &&
      scores.organization >= BONUS_XP_THRESHOLD &&
      scores.languageUse >= BONUS_XP_THRESHOLD;

    const xpEarned = BASE_XP + Math.round(overallScore * 0.5);
    const bonusXP = allHigh ? 5 : 0;

    onComplete({
      xpEarned,
      bonusXP,
      questionsAnswered: 1,
      correctCount: overallScore >= 3 ? 1 : 0,
      perfectScore: overallScore >= 5,
      totalSolveTimeSeconds: undefined,
    });
  }, [evaluation, onComplete]);

  if (phase === "api_key") {
    return (
      <div
        style={{
          maxWidth: "48rem",
          margin: "0 auto",
          padding: "0 1rem 3rem",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <button
          onClick={onBack}
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "14px",
            color: "var(--text-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem 0",
            marginBottom: "1.5rem",
          }}
        >
          &larr; Back
        </button>

        <div
          style={{
            background: "var(--surface)",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>&#128272;</div>
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "0 0 0.5rem 0",
            }}
          >
            Anthropic API Key Required
          </h2>
          <p
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "14px",
              color: "var(--text-muted)",
              margin: "0 0 1.5rem 0",
              lineHeight: 1.6,
            }}
          >
            To get AI-powered writing feedback, enter your Anthropic API key.
            Your key is stored locally and never shared.
          </p>

          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            style={{
              width: "100%",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "14px",
              color: "var(--text-primary)",
              background: "var(--bg-primary)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              marginBottom: "1rem",
              outline: "none",
            }}
          />

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={handleSkipApiKey}
              style={{
                flex: 1,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-muted)",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                padding: "0.75rem",
                cursor: "pointer",
              }}
            >
              Skip (local grading)
            </button>
            <button
              onClick={handleApiKeySubmit}
              disabled={!apiKey.trim()}
              style={{
                flex: 1,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#FFFFFF",
                background: apiKey.trim() ? "var(--accent)" : "var(--text-muted)",
                border: "none",
                borderRadius: "0.75rem",
                padding: "0.75rem",
                cursor: apiKey.trim() ? "pointer" : "not-allowed",
              }}
            >
              Save & Grade
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "feedback" && evaluation) {
    return (
      <div>
        {apiError && (
          <div
            style={{
              maxWidth: "48rem",
              margin: "0 auto 1rem",
              padding: "0 1rem",
            }}
          >
            <div
              style={{
                background: "rgba(212, 160, 48, 0.08)",
                border: "1px solid rgba(212, 160, 48, 0.2)",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "13px",
                color: "var(--xp-gold)",
              }}
            >
              {apiError}
            </div>
          </div>
        )}
        <WritingFeedback
          evaluation={evaluation}
          studentText={studentText}
          onTryAgain={handleTryAgain}
          onFinish={handleFinish}
        />
      </div>
    );
  }

  return (
    <WritingInput
      prompt={prompt}
      onSubmit={handleSubmit}
      onBack={onBack}
      isLoading={isLoading}
    />
  );
}
