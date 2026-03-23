import { useState } from "react";
import { speakChinese } from "../utils/speech";

export interface SpeakingFeedbackData {
  score: number;
  feedback: string;
  suggestion: string;
  vocabularyUsed: string[];
  grammarPatterns: string[];
}

interface SpeakingFeedbackProps {
  data: SpeakingFeedbackData;
  modelResponse?: string;
  onContinue: () => void;
}

export default function SpeakingFeedback({
  data,
  modelResponse,
  onContinue,
}: SpeakingFeedbackProps) {
  const [playingModel, setPlayingModel] = useState(false);

  const handlePlayModel = async () => {
    if (!modelResponse || playingModel) return;
    setPlayingModel(true);
    try {
      await speakChinese(modelResponse, 0.85);
    } finally {
      setPlayingModel(false);
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      {/* Score display */}
      <div style={scoreContainerStyle}>
        <div style={scoreLabelStyle}>Score</div>
        <div style={scoreDotsStyle}>
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              style={{
                width: "1.25rem",
                height: "1.25rem",
                borderRadius: "50%",
                background:
                  n <= data.score
                    ? scoreColor(data.score)
                    : "rgba(0,0,0,0.08)",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>
        <div style={{ ...scoreValueStyle, color: scoreColor(data.score) }}>
          {data.score}/5
        </div>
      </div>

      {/* Written feedback */}
      <div style={feedbackContainerStyle}>
        <div style={feedbackTextStyle}>{data.feedback}</div>
      </div>

      {/* Suggestion callout */}
      {data.suggestion && (
        <div style={suggestionContainerStyle}>
          <div style={suggestionHeaderStyle}>
            <span style={{ fontSize: "1rem" }}>💡</span>
            <span>Suggestion</span>
          </div>
          <div style={suggestionTextStyle}>{data.suggestion}</div>
        </div>
      )}

      {/* Vocabulary & grammar */}
      <div style={analysisContainerStyle}>
        {data.vocabularyUsed.length > 0 && (
          <div style={analysisSectionStyle}>
            <div style={analysisLabelStyle}>Vocabulary used</div>
            <div style={tagContainerStyle}>
              {data.vocabularyUsed.map((word, i) => (
                <span key={i} style={vocabTagStyle}>
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
        {data.grammarPatterns.length > 0 && (
          <div style={analysisSectionStyle}>
            <div style={analysisLabelStyle}>Grammar patterns</div>
            <div style={tagContainerStyle}>
              {data.grammarPatterns.map((pattern, i) => (
                <span key={i} style={grammarTagStyle}>
                  {pattern}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Model response button */}
      {modelResponse && (
        <button
          onClick={handlePlayModel}
          disabled={playingModel}
          style={{
            ...modelButtonStyle,
            opacity: playingModel ? 0.6 : 1,
          }}
        >
          {playingModel ? "🔊 Playing..." : "🔊 Listen to model response"}
        </button>
      )}

      {/* Continue */}
      <button onClick={onContinue} style={continueButtonStyle}>
        Continue
      </button>
    </div>
  );
}

function scoreColor(score: number): string {
  if (score >= 4) return "var(--success)";
  if (score >= 3) return "var(--xp-gold)";
  return "var(--error)";
}

export function generateLocalFeedback(
  transcript: string,
  expected: string,
  exerciseType: "word" | "sentence" | "conversation" | "presentation"
): SpeakingFeedbackData {
  if (!transcript.trim()) {
    return {
      score: 1,
      feedback: "No speech was detected. Try speaking more clearly and closer to the microphone.",
      suggestion: "Make sure your microphone is working and try again in a quiet environment.",
      vocabularyUsed: [],
      grammarPatterns: [],
    };
  }

  const normalizedTranscript = transcript.replace(/[\s.,!?，。！？、]/g, "");
  const normalizedExpected = expected.replace(/[\s.,!?，。！？、]/g, "");

  if (exerciseType === "word" || exerciseType === "sentence") {
    const match = normalizedTranscript === normalizedExpected;
    const partialMatch =
      normalizedExpected.includes(normalizedTranscript) ||
      normalizedTranscript.includes(normalizedExpected);

    if (match) {
      return {
        score: 5,
        feedback: "Excellent! Your pronunciation was accurately recognized. The speech recognition matched the expected text perfectly.",
        suggestion: "Great job! Try practicing at a faster speed to build fluency.",
        vocabularyUsed: [expected],
        grammarPatterns: [],
      };
    } else if (partialMatch) {
      return {
        score: 3,
        feedback: `Close! The recognizer heard "${transcript}" instead of "${expected}". This might indicate a tone or pronunciation difference.`,
        suggestion: "Pay attention to the tones of each character. Try listening to the model pronunciation and repeat.",
        vocabularyUsed: [transcript],
        grammarPatterns: [],
      };
    } else {
      return {
        score: 2,
        feedback: `The recognizer heard "${transcript}" which differs from the expected "${expected}". This could be a tone or pronunciation issue.`,
        suggestion: "Listen carefully to the model pronunciation and focus on matching the tones exactly.",
        vocabularyUsed: [transcript],
        grammarPatterns: [],
      };
    }
  }

  const chars = new Set(normalizedTranscript.split(""));
  const expectedChars = new Set(normalizedExpected.split(""));
  let overlap = 0;
  for (const ch of chars) {
    if (expectedChars.has(ch)) overlap++;
  }
  const overlapRatio = expectedChars.size > 0 ? overlap / expectedChars.size : 0;

  const length = normalizedTranscript.length;
  const lengthScore = Math.min(1, length / 20);

  const commonPatterns: string[] = [];
  const patternChecks = [
    { pattern: "因为", name: "因为 (because)" },
    { pattern: "所以", name: "所以 (therefore)" },
    { pattern: "虽然", name: "虽然...但是 (although)" },
    { pattern: "如果", name: "如果...就 (if...then)" },
    { pattern: "不但", name: "不但...而且 (not only...but also)" },
    { pattern: "除了", name: "除了...以外 (besides)" },
    { pattern: "觉得", name: "觉得 (think/feel)" },
    { pattern: "可以", name: "可以 (can)" },
    { pattern: "应该", name: "应该 (should)" },
    { pattern: "比较", name: "比较 (comparatively)" },
  ];
  for (const { pattern, name } of patternChecks) {
    if (normalizedTranscript.includes(pattern)) {
      commonPatterns.push(name);
    }
  }

  const vocabFound: string[] = [];
  const vocabChecks = ["我", "你", "他", "很", "也", "都", "的", "了", "是", "在", "有", "不"];
  for (const v of vocabChecks) {
    if (normalizedTranscript.includes(v)) {
      vocabFound.push(v);
    }
  }

  let score: number;
  let feedback: string;
  let suggestion: string;

  if (exerciseType === "conversation") {
    const rawScore = overlapRatio * 2 + lengthScore * 1.5 + commonPatterns.length * 0.5;
    score = Math.max(1, Math.min(5, Math.round(rawScore)));

    if (score >= 4) {
      feedback = "Strong response! You addressed the topic well and used appropriate vocabulary. Your response demonstrated good comprehension of the question.";
      suggestion = "Try incorporating more complex sentence structures to push your speaking to the next level.";
    } else if (score >= 3) {
      feedback = "Good attempt! You communicated your ideas, though there's room for more detailed responses. Try expanding your answers with examples.";
      suggestion = "Practice using transitional phrases like 首先 (first), 然后 (then), and 最后 (finally) to organize your response.";
    } else {
      feedback = "Keep practicing! Try to respond with complete sentences and address all parts of the question.";
      suggestion = "Start by repeating key words from the question in your answer, then add your own thoughts.";
    }
  } else {
    const rawScore = overlapRatio * 1.5 + lengthScore * 2 + commonPatterns.length * 0.3;
    score = Math.max(1, Math.min(5, Math.round(rawScore)));

    if (score >= 4) {
      feedback = "Excellent presentation! You covered the topic thoroughly with good vocabulary range and clear organization.";
      suggestion = "To achieve a top score, try incorporating more cultural details and specific examples.";
    } else if (score >= 3) {
      feedback = "Good presentation with relevant content. Consider adding more specific examples and cultural details to strengthen your response.";
      suggestion = "Practice organizing your presentation with a clear introduction, body, and conclusion.";
    } else {
      feedback = "You made an effort, but the response needs more development. Try to speak for the full time and cover multiple aspects of the topic.";
      suggestion = "Before speaking, mentally outline 3-4 points you want to make about the topic.";
    }
  }

  return {
    score,
    feedback,
    suggestion,
    vocabularyUsed: vocabFound.slice(0, 8),
    grammarPatterns: commonPatterns.slice(0, 4),
  };
}

const scoreContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  marginBottom: "1rem",
};

const scoreLabelStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--text-muted)",
};

const scoreDotsStyle: React.CSSProperties = {
  display: "flex",
  gap: "0.375rem",
};

const scoreValueStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.125rem",
  fontWeight: 700,
};

const feedbackContainerStyle: React.CSSProperties = {
  background: "rgba(139, 111, 71, 0.06)",
  borderRadius: "0.75rem",
  padding: "1rem",
  marginBottom: "0.75rem",
};

const feedbackTextStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  color: "var(--text-primary)",
  lineHeight: 1.6,
};

const suggestionContainerStyle: React.CSSProperties = {
  background: "rgba(212, 160, 48, 0.08)",
  borderLeft: "3px solid var(--xp-gold)",
  borderRadius: "0 0.5rem 0.5rem 0",
  padding: "0.75rem 1rem",
  marginBottom: "0.75rem",
};

const suggestionHeaderStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--xp-gold)",
  display: "flex",
  alignItems: "center",
  gap: "0.375rem",
  marginBottom: "0.25rem",
};

const suggestionTextStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  color: "var(--text-primary)",
  lineHeight: 1.5,
};

const analysisContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  marginBottom: "1rem",
};

const analysisSectionStyle: React.CSSProperties = {};

const analysisLabelStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--text-muted)",
  marginBottom: "0.375rem",
};

const tagContainerStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.375rem",
};

const vocabTagStyle: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
  fontSize: "0.875rem",
  background: "rgba(139, 111, 71, 0.1)",
  color: "var(--speaking-brown)",
  borderRadius: "0.375rem",
  padding: "0.125rem 0.5rem",
};

const grammarTagStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.8125rem",
  background: "rgba(107, 127, 215, 0.1)",
  color: "var(--listening-blue)",
  borderRadius: "0.375rem",
  padding: "0.125rem 0.5rem",
};

const modelButtonStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  fontWeight: 600,
  color: "var(--speaking-brown)",
  background: "transparent",
  border: "1px solid var(--speaking-brown)",
  borderRadius: "0.5rem",
  padding: "0.5rem 1.25rem",
  cursor: "pointer",
  width: "100%",
  marginBottom: "0.75rem",
  transition: "background 0.15s ease",
};

const continueButtonStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  fontWeight: 600,
  background: "var(--accent)",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.75rem 1.5rem",
  cursor: "pointer",
  width: "100%",
  transition: "background 0.15s ease",
};
