import { useState } from "react";
import type { WritingEvaluation } from "../types/writing";

interface WritingFeedbackProps {
  evaluation: WritingEvaluation;
  studentText: string;
  onTryAgain: () => void;
  onFinish: () => void;
}

export default function WritingFeedback({
  evaluation,
  studentText,
  onTryAgain,
  onFinish,
}: WritingFeedbackProps) {
  const [showModel, setShowModel] = useState(false);
  const [expandedCorrection, setExpandedCorrection] = useState<number | null>(null);

  const { scores, overallScore, feedback, corrections, vocabularySuggestions, grammarIssues, modelResponse } = evaluation;

  const getScoreColor = (score: number): string => {
    if (score >= 5) return "var(--success)";
    if (score >= 3) return "var(--xp-gold)";
    return "var(--error)";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 5) return "Excellent";
    if (score >= 4) return "Good";
    if (score >= 3) return "Adequate";
    if (score >= 2) return "Developing";
    return "Needs Work";
  };

  return (
    <div
      style={{
        maxWidth: "48rem",
        margin: "0 auto",
        padding: "0 1rem 3rem",
        animation: "fadeIn 0.3s ease",
      }}
    >
      {/* Overall Score */}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "1rem",
          padding: "2rem",
          marginBottom: "1.5rem",
          boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.75rem",
          }}
        >
          Overall Score
        </div>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "3.5rem",
            fontWeight: 700,
            color: getScoreColor(overallScore),
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}
        >
          {overallScore}
          <span
            style={{
              fontSize: "1.25rem",
              color: "var(--text-muted)",
              fontWeight: 400,
            }}
          >
            {" "}/ 6
          </span>
        </div>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "15px",
            color: getScoreColor(overallScore),
            fontWeight: 600,
          }}
        >
          {getScoreLabel(overallScore)}
        </div>
      </div>

      {/* Rubric Scores */}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: "1.25rem",
          }}
        >
          AP Rubric Scores
        </div>

        <RubricBar label="Task Completion" score={scores.taskCompletion} />
        <RubricBar label="Organization" score={scores.organization} />
        <RubricBar label="Language Use" score={scores.languageUse} />
      </div>

      {/* Feedback */}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: "0.75rem",
          }}
        >
          Feedback
        </div>
        <p
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "14px",
            color: "var(--text-primary)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {feedback}
        </p>
      </div>

      {/* Inline Corrections */}
      {corrections.length > 0 && (
        <div
          style={{
            background: "var(--surface)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            Corrections ({corrections.length})
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {corrections.map((correction, i) => (
              <div
                key={i}
                onClick={() => setExpandedCorrection(expandedCorrection === i ? null : i)}
                style={{
                  background: "rgba(193, 95, 60, 0.04)",
                  border: "1px solid rgba(193, 95, 60, 0.12)",
                  borderRadius: "0.75rem",
                  padding: "1rem",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    marginBottom: expandedCorrection === i ? "0.75rem" : 0,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        fontFamily: "'Noto Serif SC', serif",
                        fontSize: "15px",
                        color: "var(--error)",
                        textDecoration: "line-through",
                        opacity: 0.7,
                      }}
                    >
                      {correction.original}
                    </span>
                    <span
                      style={{
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        fontSize: "14px",
                        color: "var(--text-muted)",
                        margin: "0 0.5rem",
                      }}
                    >
                      &rarr;
                    </span>
                    <span
                      style={{
                        fontFamily: "'Noto Serif SC', serif",
                        fontSize: "15px",
                        color: "var(--success)",
                        fontWeight: 600,
                      }}
                    >
                      {correction.corrected}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      transform: expandedCorrection === i ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.2s ease",
                      flexShrink: 0,
                    }}
                  >
                    &#9660;
                  </span>
                </div>
                {expandedCorrection === i && (
                  <div
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                      paddingTop: "0.5rem",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    {correction.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Your Response */}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: "0.75rem",
          }}
        >
          Your Response
        </div>
        <div
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: "15px",
            color: "var(--text-primary)",
            lineHeight: 2,
            whiteSpace: "pre-line",
          }}
        >
          {highlightErrors(studentText, corrections)}
        </div>
      </div>

      {/* Grammar Issues */}
      {grammarIssues.length > 0 && (
        <div
          style={{
            background: "var(--surface)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "0.75rem",
            }}
          >
            Grammar Issues
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: "1.25rem",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "14px",
              color: "var(--text-primary)",
              lineHeight: 1.8,
            }}
          >
            {grammarIssues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Vocabulary Suggestions */}
      {vocabularySuggestions.length > 0 && (
        <div
          style={{
            background: "var(--surface)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "0.75rem",
            }}
          >
            Vocabulary Suggestions
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {vocabularySuggestions.map((suggestion, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "'Noto Serif SC', Georgia, serif",
                  fontSize: "13px",
                  color: "var(--accent)",
                  background: "rgba(193, 95, 60, 0.06)",
                  border: "1px solid rgba(193, 95, 60, 0.15)",
                  borderRadius: "0.5rem",
                  padding: "0.375rem 0.75rem",
                }}
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Model Response */}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
        }}
      >
        <button
          onClick={() => setShowModel(!showModel)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--text-primary)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span>Model Response</span>
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              transform: showModel ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.2s ease",
            }}
          >
            &#9660;
          </span>
        </button>
        {showModel && (
          <div
            style={{
              fontFamily: "'Noto Serif SC', serif",
              fontSize: "15px",
              color: "var(--text-primary)",
              lineHeight: 2,
              whiteSpace: "pre-line",
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border)",
            }}
          >
            {modelResponse}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginTop: "1.5rem",
        }}
      >
        <button
          onClick={onTryAgain}
          style={{
            flex: 1,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--accent)",
            background: "transparent",
            border: "2px solid var(--accent)",
            borderRadius: "0.75rem",
            padding: "0.875rem",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(193, 95, 60, 0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          Try Again
        </button>
        <button
          onClick={onFinish}
          style={{
            flex: 1,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "15px",
            fontWeight: 600,
            color: "#FFFFFF",
            background: "var(--accent)",
            border: "none",
            borderRadius: "0.75rem",
            padding: "0.875rem",
            cursor: "pointer",
            transition: "background 0.2s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent-hover)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--accent)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Finish
        </button>
      </div>
    </div>
  );
}

function RubricBar({ label, score }: { label: string; score: number }) {
  const getColor = (s: number) => {
    if (s >= 5) return "var(--success)";
    if (s >= 3) return "var(--xp-gold)";
    return "var(--error)";
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.375rem",
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "13px",
            color: "var(--text-primary)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "13px",
            fontWeight: 600,
            color: getColor(score),
          }}
        >
          {score} / 6
        </span>
      </div>
      <div
        style={{
          height: "8px",
          background: "var(--border)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(score / 6) * 100}%`,
            background: getColor(score),
            borderRadius: "4px",
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

function highlightErrors(
  text: string,
  corrections: { original: string; corrected: string }[]
): React.ReactNode {
  if (corrections.length === 0) return text;

  const highlights: { start: number; end: number; original: string }[] = [];

  for (const correction of corrections) {
    const idx = text.indexOf(correction.original);
    if (idx !== -1) {
      highlights.push({
        start: idx,
        end: idx + correction.original.length,
        original: correction.original,
      });
    }
  }

  if (highlights.length === 0) return text;

  highlights.sort((a, b) => a.start - b.start);

  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  for (let i = 0; i < highlights.length; i++) {
    const h = highlights[i];
    if (h.start > lastEnd) {
      parts.push(text.slice(lastEnd, h.start));
    }
    parts.push(
      <span
        key={i}
        style={{
          background: "rgba(193, 95, 60, 0.12)",
          borderBottom: "2px solid var(--error)",
          borderRadius: "2px",
          padding: "0 2px",
        }}
        title={`Correction available: ${corrections.find((c) => c.original === h.original)?.corrected || ""}`}
      >
        {h.original}
      </span>
    );
    lastEnd = h.end;
  }

  if (lastEnd < text.length) {
    parts.push(text.slice(lastEnd));
  }

  return <>{parts}</>;
}
