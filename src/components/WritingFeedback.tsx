import { useState } from "react";
import type { WritingEvaluation } from "../types/tasks";

interface WritingFeedbackProps {
  evaluation: WritingEvaluation;
  studentText: string;
  onTryAgain: () => void;
  onFinish: () => void;
  xpEarned: number;
  bonusXP: number;
}

export default function WritingFeedback({
  evaluation,
  studentText,
  onTryAgain,
  onFinish,
  xpEarned,
  bonusXP,
}: WritingFeedbackProps) {
  const [showModel, setShowModel] = useState(false);
  const [activeCorrection, setActiveCorrection] = useState<number | null>(null);

  const { scores, overallScore, feedback, corrections, vocabularySuggestions, grammarIssues, modelResponse } = evaluation;

  const getScoreColor = (score: number) => {
    if (score >= 5) return "var(--success)";
    if (score >= 3) return "var(--xp-gold)";
    return "var(--error)";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 5) return "Excellent";
    if (score >= 4) return "Good";
    if (score >= 3) return "Adequate";
    if (score >= 2) return "Developing";
    return "Needs Improvement";
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Overall Score */}
        <div style={overallScoreSection}>
          <div style={overallScoreCircle}>
            <span style={{ ...overallScoreNumber, color: getScoreColor(overallScore) }}>
              {overallScore}
            </span>
            <span style={overallScoreMax}>/6</span>
          </div>
          <div style={overallScoreLabel}>{getScoreLabel(overallScore)}</div>
          <div style={xpDisplay}>
            <span style={xpAmount}>+{xpEarned} XP</span>
            {bonusXP > 0 && <span style={xpBonus}>+{bonusXP} Bonus</span>}
          </div>
        </div>

        {/* Rubric Scores */}
        <div style={rubricSection}>
          <div style={sectionTitle}>AP Rubric Scores</div>
          <RubricBar label="Task Completion" labelChinese="任务完成" score={scores.taskCompletion} />
          <RubricBar label="Organization" labelChinese="组织结构" score={scores.organization} />
          <RubricBar label="Language Use" labelChinese="语言运用" score={scores.languageUse} />
        </div>

        {/* Overall Feedback */}
        <div style={feedbackSection}>
          <div style={sectionTitle}>Feedback</div>
          <div style={feedbackText}>{feedback}</div>
        </div>

        {/* Inline Corrections */}
        {corrections.length > 0 && (
          <div style={correctionsSection}>
            <div style={sectionTitle}>Corrections ({corrections.length})</div>
            <div style={studentTextDisplay}>
              {highlightCorrections(studentText, corrections, activeCorrection, setActiveCorrection)}
            </div>
            <div style={correctionsList}>
              {corrections.map((c, i) => (
                <div
                  key={i}
                  style={{
                    ...correctionItem,
                    borderLeft: activeCorrection === i
                      ? "3px solid var(--accent)"
                      : "3px solid var(--border)",
                    background: activeCorrection === i
                      ? "rgba(193, 95, 60, 0.04)"
                      : "transparent",
                  }}
                  onMouseEnter={() => setActiveCorrection(i)}
                  onMouseLeave={() => setActiveCorrection(null)}
                >
                  <div style={correctionOriginal}>{c.original}</div>
                  <div style={correctionArrow}>→</div>
                  <div style={correctionCorrected}>{c.corrected}</div>
                  <div style={correctionExplanation}>{c.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grammar Issues */}
        {grammarIssues.length > 0 && (
          <div style={issuesSection}>
            <div style={sectionTitle}>Grammar Issues</div>
            <div style={issuesList}>
              {grammarIssues.map((issue, i) => (
                <div key={i} style={issueItem}>
                  <span style={issueBullet}>•</span>
                  {issue}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vocabulary Suggestions */}
        {vocabularySuggestions.length > 0 && (
          <div style={vocabSection}>
            <div style={sectionTitle}>Vocabulary Suggestions</div>
            <div style={vocabList}>
              {vocabularySuggestions.map((word, i) => (
                <span key={i} style={vocabChip}>{word}</span>
              ))}
            </div>
          </div>
        )}

        {/* Model Response */}
        <div style={modelSection}>
          <button
            onClick={() => setShowModel(!showModel)}
            style={modelToggleButton}
          >
            {showModel ? "Hide" : "Show"} Model Response
            <span style={{ transform: showModel ? "rotate(180deg)" : "rotate(0)", display: "inline-block", transition: "transform 0.2s ease", marginLeft: "0.5rem" }}>
              ▾
            </span>
          </button>
          {showModel && (
            <div style={modelResponseBox}>
              <div style={modelResponseLabel}>Ideal response for comparison:</div>
              <div style={modelResponseText}>{modelResponse}</div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={actionsRow}>
          <button onClick={onTryAgain} style={tryAgainButton}>
            Try Again
          </button>
          <button onClick={onFinish} style={finishButton}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function RubricBar({ label, labelChinese, score }: { label: string; labelChinese: string; score: number }) {
  const pct = (score / 6) * 100;
  const color = score >= 5 ? "var(--success)" : score >= 3 ? "var(--xp-gold)" : "var(--error)";

  return (
    <div style={rubricBarContainer}>
      <div style={rubricBarHeader}>
        <div style={rubricBarLabel}>
          {label}
          <span style={rubricBarLabelChinese}>{labelChinese}</span>
        </div>
        <div style={{ ...rubricBarScore, color }}>{score}/6</div>
      </div>
      <div style={rubricBarBg}>
        <div style={{ ...rubricBarFill, width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function highlightCorrections(
  text: string,
  corrections: WritingEvaluation["corrections"],
  activeIdx: number | null,
  setActiveIdx: (idx: number | null) => void,
): React.ReactNode[] {
  if (corrections.length === 0) return [<span key="text">{text}</span>];

  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  const sortedCorrections = corrections
    .map((c, i) => ({ ...c, idx: i }))
    .sort((a, b) => {
      const posA = remaining.indexOf(a.original);
      const posB = remaining.indexOf(b.original);
      return posA - posB;
    });

  for (const correction of sortedCorrections) {
    const pos = remaining.indexOf(correction.original);
    if (pos === -1) continue;

    if (pos > 0) {
      parts.push(<span key={`t-${keyIdx++}`}>{remaining.slice(0, pos)}</span>);
    }

    const isActive = activeIdx === correction.idx;
    parts.push(
      <span
        key={`c-${keyIdx++}`}
        style={{
          background: isActive ? "rgba(193, 95, 60, 0.2)" : "rgba(193, 95, 60, 0.1)",
          borderBottom: "2px solid var(--error)",
          cursor: "pointer",
          padding: "0 2px",
          borderRadius: "2px",
          transition: "background 0.15s ease",
          position: "relative",
        }}
        onMouseEnter={() => setActiveIdx(correction.idx)}
        onMouseLeave={() => setActiveIdx(null)}
        title={`${correction.corrected} — ${correction.explanation}`}
      >
        {correction.original}
      </span>
    );

    remaining = remaining.slice(pos + correction.original.length);
  }

  if (remaining) {
    parts.push(<span key={`t-${keyIdx++}`}>{remaining}</span>);
  }

  return parts;
}

// Styles
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

const overallScoreSection: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "2rem",
  paddingBottom: "1.5rem",
  borderBottom: "1px solid var(--border)",
};

const overallScoreCircle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "baseline",
  gap: "2px",
  marginBottom: "0.375rem",
};

const overallScoreNumber: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "3.5rem",
  fontWeight: 700,
  lineHeight: 1,
};

const overallScoreMax: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.5rem",
  color: "var(--text-muted)",
  fontWeight: 400,
};

const overallScoreLabel: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1rem",
  color: "var(--text-muted)",
  marginBottom: "0.75rem",
};

const xpDisplay: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "0.75rem",
  alignItems: "center",
};

const xpAmount: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.25rem",
  fontWeight: 700,
  color: "var(--xp-gold)",
};

const xpBonus: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.875rem",
  color: "var(--xp-gold)",
  background: "rgba(212, 160, 48, 0.1)",
  borderRadius: "9999px",
  padding: "0.125rem 0.5rem",
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--text-muted)",
  marginBottom: "0.75rem",
};

const rubricSection: React.CSSProperties = {
  marginBottom: "1.5rem",
};

const rubricBarContainer: React.CSSProperties = {
  marginBottom: "0.75rem",
};

const rubricBarHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0.25rem",
};

const rubricBarLabel: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  fontWeight: 600,
  color: "var(--text-primary)",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const rubricBarLabelChinese: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
  fontSize: "13px",
  fontWeight: 400,
  color: "var(--text-muted)",
};

const rubricBarScore: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  fontWeight: 700,
};

const rubricBarBg: React.CSSProperties = {
  width: "100%",
  height: "8px",
  borderRadius: "4px",
  background: "rgba(0,0,0,0.06)",
  overflow: "hidden",
};

const rubricBarFill: React.CSSProperties = {
  height: "100%",
  borderRadius: "4px",
  transition: "width 0.6s ease",
};

const feedbackSection: React.CSSProperties = {
  marginBottom: "1.5rem",
  paddingBottom: "1.5rem",
  borderBottom: "1px solid var(--border)",
};

const feedbackText: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  color: "var(--text-primary)",
  lineHeight: 1.7,
};

const correctionsSection: React.CSSProperties = {
  marginBottom: "1.5rem",
};

const studentTextDisplay: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
  fontSize: "15px",
  color: "var(--text-primary)",
  lineHeight: 2,
  background: "rgba(0,0,0,0.02)",
  borderRadius: "0.75rem",
  padding: "1rem",
  marginBottom: "1rem",
  border: "1px solid var(--border)",
};

const correctionsList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const correctionItem: React.CSSProperties = {
  padding: "0.75rem",
  borderRadius: "0.5rem",
  transition: "background 0.15s ease, border-color 0.15s ease",
  cursor: "default",
};

const correctionOriginal: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
  fontSize: "15px",
  color: "var(--error)",
  textDecoration: "line-through",
  display: "inline",
};

const correctionArrow: React.CSSProperties = {
  display: "inline",
  margin: "0 0.5rem",
  color: "var(--text-muted)",
  fontSize: "14px",
};

const correctionCorrected: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
  fontSize: "15px",
  color: "var(--success)",
  fontWeight: 600,
  display: "inline",
};

const correctionExplanation: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "13px",
  color: "var(--text-muted)",
  marginTop: "0.375rem",
  lineHeight: 1.5,
};

const issuesSection: React.CSSProperties = {
  marginBottom: "1.5rem",
};

const issuesList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
};

const issueItem: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  color: "var(--text-primary)",
  lineHeight: 1.5,
  display: "flex",
  gap: "0.5rem",
};

const issueBullet: React.CSSProperties = {
  color: "var(--error)",
  flexShrink: 0,
};

const vocabSection: React.CSSProperties = {
  marginBottom: "1.5rem",
};

const vocabList: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
};

const vocabChip: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
  fontSize: "14px",
  color: "var(--writing-green, #4A8C6F)",
  background: "rgba(74, 140, 111, 0.08)",
  borderRadius: "9999px",
  padding: "0.25rem 0.75rem",
  border: "1px solid rgba(74, 140, 111, 0.2)",
};

const modelSection: React.CSSProperties = {
  marginBottom: "1.5rem",
  paddingTop: "0.5rem",
  borderTop: "1px solid var(--border)",
};

const modelToggleButton: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  fontWeight: 600,
  color: "var(--text-primary)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "0.75rem 0",
  width: "100%",
  textAlign: "left",
  display: "flex",
  alignItems: "center",
};

const modelResponseBox: React.CSSProperties = {
  background: "rgba(74, 140, 111, 0.04)",
  border: "1px solid rgba(74, 140, 111, 0.15)",
  borderRadius: "0.75rem",
  padding: "1rem",
  marginTop: "0.5rem",
  animation: "fadeIn 0.2s ease",
};

const modelResponseLabel: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--text-muted)",
  marginBottom: "0.5rem",
};

const modelResponseText: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
  fontSize: "15px",
  color: "var(--text-primary)",
  lineHeight: 2,
};

const actionsRow: React.CSSProperties = {
  display: "flex",
  gap: "0.75rem",
};

const tryAgainButton: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  fontWeight: 600,
  color: "var(--writing-green, #4A8C6F)",
  background: "transparent",
  border: "1.5px solid var(--writing-green, #4A8C6F)",
  borderRadius: "0.5rem",
  padding: "0.75rem 1.5rem",
  cursor: "pointer",
  flex: 1,
  transition: "background 0.15s ease",
};

const finishButton: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  fontWeight: 600,
  background: "var(--writing-green, #4A8C6F)",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.75rem 1.5rem",
  cursor: "pointer",
  flex: 1,
  transition: "background 0.15s ease",
};
