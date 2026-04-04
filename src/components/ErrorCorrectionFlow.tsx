import { useState, useCallback } from "react";
import type { MCQuestion } from "../types/tasks";
import { speakChinese } from "../utils/speech";

interface ErrorCorrectionFlowProps {
  question: MCQuestion;
  selectedAnswer: number;
  onComplete: () => void;
}

type CorrectionStep = "surprise" | "speak" | "connect";

export default function ErrorCorrectionFlow({
  question,
  selectedAnswer,
  onComplete,
}: ErrorCorrectionFlowProps) {
  const [step, setStep] = useState<CorrectionStep>("surprise");

  const correctOption = question.options[question.correctIndex];
  const wrongOption = question.options[selectedAnswer];
  const hasChinese = /[\u4e00-\u9fff]/.test(correctOption);

  const handleNext = useCallback(() => {
    if (step === "surprise") {
      setStep("speak");
    } else if (step === "speak") {
      setStep("connect");
    } else {
      onComplete();
    }
  }, [step, onComplete]);

  return (
    <div style={containerStyle}>
      {step === "surprise" && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div style={stepLabelStyle}>Step 1 — Correction</div>
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={wrongBoxStyle}>
              <div style={miniLabelStyle}>Your answer</div>
              <div style={answerTextStyle}>{wrongOption}</div>
            </div>
            <div style={correctBoxStyle}>
              <div style={miniLabelStyle}>Correct answer</div>
              <div style={answerTextStyle}>{correctOption}</div>
            </div>
          </div>
          <div style={explanationTextStyle}>
            {question.explanation}
          </div>
        </div>
      )}

      {step === "speak" && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div style={stepLabelStyle}>Step 2 — Say it aloud</div>
          <div style={focusDisplayStyle}>
            <div style={{
              fontFamily: hasChinese ? "'Noto Serif SC', serif" : "Georgia, 'Times New Roman', serif",
              fontSize: hasChinese ? "2.5rem" : "1.5rem",
              fontWeight: 700,
              color: "var(--success)",
              marginBottom: "0.5rem",
            }}>
              {correctOption}
            </div>
            {question.hanzi && (
              <div style={{
                fontFamily: "'Noto Serif SC', serif",
                fontSize: "1.25rem",
                color: "var(--text-muted)",
                marginBottom: "0.25rem",
              }}>
                {question.hanzi}
              </div>
            )}
            <div style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1rem",
              color: "var(--accent)",
              fontStyle: "italic",
            }}>
              Say the correct answer aloud to reinforce it
            </div>
            {hasChinese && (
              <button
                onClick={() => speakChinese(correctOption, 0.85)}
                style={{
                  marginTop: "0.75rem",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "14px",
                  background: "var(--listening-blue, #6b7fd7)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1.25rem",
                  cursor: "pointer",
                  transition: "opacity 0.2s ease",
                }}
              >
                🔊 Listen to pronunciation
              </button>
            )}
          </div>
        </div>
      )}

      {step === "connect" && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div style={stepLabelStyle}>Step 3 — Connect</div>
          <div style={connectBoxStyle}>
            {question.hanzi && (
              <div style={{
                fontFamily: "'Noto Serif SC', serif",
                fontSize: "2rem",
                textAlign: "center",
                color: "var(--text-primary)",
                marginBottom: "0.5rem",
              }}>
                {question.hanzi}
              </div>
            )}
            <div style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "14px",
              color: "var(--text-primary)",
              lineHeight: 1.6,
              textAlign: "center",
            }}>
              {question.explanation}
            </div>
            <div style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "13px",
              color: "var(--text-muted)",
              marginTop: "0.75rem",
              textAlign: "center",
              fontStyle: "italic",
            }}>
              This item will reappear shortly for another attempt.
            </div>
          </div>
        </div>
      )}

      <button onClick={handleNext} style={continueButtonStyle}>
        {step === "connect" ? "Got it" : "Continue"}
      </button>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  marginTop: "1rem",
  padding: "1.25rem",
  borderRadius: "0.75rem",
  background: "rgba(193, 95, 60, 0.06)",
  animation: "fadeIn 0.3s ease",
};

const stepLabelStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--text-muted)",
  marginBottom: "0.75rem",
};

const miniLabelStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.03em",
  color: "var(--text-muted)",
  marginBottom: "0.25rem",
};

const wrongBoxStyle: React.CSSProperties = {
  flex: 1,
  padding: "0.75rem",
  borderRadius: "0.5rem",
  background: "rgba(193, 95, 60, 0.1)",
  border: "1.5px solid var(--error)",
};

const correctBoxStyle: React.CSSProperties = {
  flex: 1,
  padding: "0.75rem",
  borderRadius: "0.5rem",
  background: "rgba(74, 140, 111, 0.1)",
  border: "1.5px solid var(--success)",
};

const answerTextStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  fontWeight: 600,
  color: "var(--text-primary)",
};

const explanationTextStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  color: "var(--text-primary)",
  lineHeight: 1.5,
};

const focusDisplayStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "1.5rem",
  borderRadius: "0.75rem",
  background: "rgba(74, 140, 111, 0.06)",
  border: "1px solid rgba(74, 140, 111, 0.2)",
};

const connectBoxStyle: React.CSSProperties = {
  padding: "1.25rem",
  borderRadius: "0.75rem",
  background: "var(--surface)",
  border: "1px solid var(--border)",
};

const continueButtonStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: "1rem",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  fontWeight: 600,
  background: "var(--accent)",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.75rem 1.5rem",
  cursor: "pointer",
  transition: "background 0.15s ease",
};
