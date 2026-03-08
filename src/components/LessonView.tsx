import { useState, useEffect, useCallback, useMemo } from "react";
import type { GraphNode } from "../types/graph";
import type { TaskResult, MCQuestion } from "../types/tasks";
import { generateMCQuestions } from "../engine/tasks";
import { GRAPH } from "../data/graph";

interface LessonViewProps {
  topic: GraphNode;
  onComplete: (result: TaskResult) => void;
  onBack: () => void;
}

type Phase = "tutorial" | "worked-example" | "practice" | "complete";

export default function LessonView({ topic, onComplete, onBack }: LessonViewProps) {
  const [phase, setPhase] = useState<Phase>("tutorial");
  const initialQuestions = useMemo(() => generateMCQuestions(topic, GRAPH, 5), [topic]);
  const [questions, setQuestions] = useState<MCQuestion[]>(initialQuestions);
  const [currentQ, setCurrentQ] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [bonusXP, setBonusXP] = useState(0);

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleAnswer = useCallback((idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    setTimerActive(false);
    setTotalAnswered((a) => a + 1);

    const correct = idx === questions[currentQ].correctIndex;
    if (correct) {
      setTotalCorrect((c) => c + 1);
      setConsecutiveCorrect((c) => c + 1);
    } else {
      setConsecutiveCorrect(0);
      const extraQs = generateMCQuestions(topic, GRAPH, 2);
      setQuestions((qs) => [...qs, ...extraQs]);
    }
  }, [selectedAnswer, questions, currentQ, topic]);

  const advanceQuestion = useCallback(() => {
    if (consecutiveCorrect >= 2 && currentQ >= 1) {
      const perfect = totalCorrect === totalAnswered;
      const base = 10;
      const bonus = perfect ? 3 : 0;
      setXpEarned(base);
      setBonusXP(bonus);
      setPhase("complete");
      return;
    }

    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimer(0);
    setTimerActive(true);

    if (currentQ + 1 < questions.length) {
      setCurrentQ((q) => q + 1);
    } else {
      const extraQs = generateMCQuestions(topic, GRAPH, 2);
      setQuestions((qs) => [...qs, ...extraQs]);
      setCurrentQ((q) => q + 1);
    }
  }, [consecutiveCorrect, currentQ, questions.length, topic, totalCorrect, totalAnswered]);

  const handleComplete = useCallback(() => {
    onComplete({
      xpEarned: xpEarned + bonusXP,
      bonusXP,
      questionsAnswered: totalAnswered,
      correctCount: totalCorrect,
      perfectScore: bonusXP > 0,
    });
  }, [onComplete, xpEarned, bonusXP, totalAnswered, totalCorrect]);

  const prereqNodes = topic.prereqs
    .map((id) => GRAPH.find((n) => n.id === id))
    .filter(Boolean) as GraphNode[];

  if (phase === "tutorial") {
    return (
      <div style={containerStyle}>
        <BackButton onClick={onBack} />
        <div style={cardStyle}>
          <PhaseBadge label="Tutorial" />
          <div style={hanziDisplayStyle}>{topic.hanzi}</div>
          <div style={pinyinStyle}>{topic.pinyin}</div>
          <div style={meaningStyle}>{topic.meaning}</div>

          <div style={tutorialTextStyle}>
            {topic.type === "radical" && (
              <p>
                This is the radical <strong style={{ fontFamily: "'Noto Serif SC', serif" }}>{topic.hanzi}</strong> ({topic.pinyin}),
                meaning "{topic.meaning}". Radicals are the building blocks of Chinese characters.
                Learning to recognize this radical will help you understand many characters that contain it.
              </p>
            )}
            {topic.type === "character" && (
              <>
                <p>
                  The character <strong style={{ fontFamily: "'Noto Serif SC', serif" }}>{topic.hanzi}</strong> ({topic.pinyin})
                  means "{topic.meaning}".
                </p>
                {prereqNodes.length > 0 && (
                  <p>
                    It is composed of the radical{prereqNodes.length > 1 ? "s" : ""}:{" "}
                    {prereqNodes.map((n, i) => (
                      <span key={n.id}>
                        {i > 0 && " + "}
                        <strong style={{ fontFamily: "'Noto Serif SC', serif" }}>{n.hanzi}</strong> ({n.meaning})
                      </span>
                    ))}
                  </p>
                )}
              </>
            )}
            {topic.type === "word" && (
              <>
                <p>
                  The word <strong style={{ fontFamily: "'Noto Serif SC', serif" }}>{topic.hanzi}</strong> ({topic.pinyin})
                  means "{topic.meaning}".
                </p>
                {prereqNodes.length > 0 && (
                  <p>
                    It combines the characters:{" "}
                    {prereqNodes.map((n, i) => (
                      <span key={n.id}>
                        {i > 0 && " + "}
                        <strong style={{ fontFamily: "'Noto Serif SC', serif" }}>{n.hanzi}</strong> ({n.meaning})
                      </span>
                    ))}
                  </p>
                )}
              </>
            )}
          </div>

          <button onClick={() => setPhase("worked-example")} style={primaryButtonStyle}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (phase === "worked-example") {
    return (
      <div style={containerStyle}>
        <BackButton onClick={onBack} />
        <div style={cardStyle}>
          <PhaseBadge label="Worked Example" />

          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ ...tutorialTextStyle, marginBottom: "1rem" }}>
              <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                Example: What does "{topic.hanzi}" mean?
              </p>
            </div>

            <div
              style={{
                background: "rgba(0,0,0,0.03)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
              }}
            >
              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "14px", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                Step 1: Look at the character
              </div>
              <div style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "2rem", textAlign: "center", margin: "0.75rem 0", color: "var(--text-primary)" }}>
                {topic.hanzi}
              </div>

              {prereqNodes.length > 0 && (
                <>
                  <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "14px", color: "var(--text-muted)", marginBottom: "0.5rem", marginTop: "1rem" }}>
                    Step 2: Identify the components
                  </div>
                  <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "15px", color: "var(--text-primary)" }}>
                    {prereqNodes.map((n) => (
                      <span key={n.id} style={{ marginRight: "1rem" }}>
                        <span style={{ fontFamily: "'Noto Serif SC', serif" }}>{n.hanzi}</span> = {n.meaning}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "14px", color: "var(--text-muted)", marginBottom: "0.5rem", marginTop: "1rem" }}>
                Step {prereqNodes.length > 0 ? "3" : "2"}: The answer
              </div>
              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "15px", color: "var(--success)", fontWeight: 600 }}>
                {topic.hanzi} ({topic.pinyin}) = "{topic.meaning}"
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setPhase("practice");
              setTimerActive(true);
            }}
            style={primaryButtonStyle}
          >
            I understand, continue to practice
          </button>
        </div>
      </div>
    );
  }

  if (phase === "practice" && questions.length > 0 && currentQ < questions.length) {
    const q = questions[currentQ];
    const isCorrect = selectedAnswer !== null && selectedAnswer === q.correctIndex;

    return (
      <div style={containerStyle}>
        <BackButton onClick={onBack} />
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <PhaseBadge label="Practice" />
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "13px", color: "var(--text-muted)" }}>
              ⏱ {timer}s
            </div>
          </div>

          {/* Streak indicator */}
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "13px", color: "var(--text-muted)", marginBottom: "1rem" }}>
            {consecutiveCorrect > 0
              ? `${consecutiveCorrect}/2 correct in a row`
              : "Get 2 correct in a row to complete"}
          </div>

          {/* Question */}
          {q.hanzi && (
            <div
              style={{
                fontFamily: "'Noto Serif SC', serif",
                fontSize: "3rem",
                textAlign: "center",
                color: "var(--text-primary)",
                margin: "0.5rem 0 1rem",
              }}
            >
              {q.hanzi}
            </div>
          )}
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1.125rem",
              color: "var(--text-primary)",
              marginBottom: "1.25rem",
              fontWeight: 600,
            }}
          >
            {q.question}
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {q.options.map((opt, idx) => {
              let bg = "var(--surface)";
              let border = "1px solid var(--border)";
              let color = "var(--text-primary)";

              if (selectedAnswer !== null) {
                if (idx === q.correctIndex) {
                  bg = "var(--success)";
                  color = "#FFFFFF";
                  border = "1px solid var(--success)";
                } else if (idx === selectedAnswer && idx !== q.correctIndex) {
                  bg = "var(--error)";
                  color = "#FFFFFF";
                  border = "1px solid var(--error)";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedAnswer !== null}
                  style={{
                    fontFamily: q.hanzi === "" && opt.match(/[\u4e00-\u9fff]/)
                      ? "'Noto Serif SC', serif"
                      : "Georgia, 'Times New Roman', serif",
                    fontSize: "15px",
                    background: bg,
                    color,
                    border,
                    borderRadius: "0.5rem",
                    padding: "0.75rem 1rem",
                    cursor: selectedAnswer !== null ? "default" : "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "left",
                    opacity: selectedAnswer !== null && idx !== q.correctIndex && idx !== selectedAnswer ? 0.5 : 1,
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                borderRadius: "0.75rem",
                background: isCorrect ? "rgba(74, 140, 111, 0.08)" : "rgba(193, 95, 60, 0.08)",
                animation: "fadeIn 0.3s ease",
              }}
            >
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: isCorrect ? "var(--success)" : "var(--error)",
                  marginBottom: "0.25rem",
                }}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </div>
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                }}
              >
                {q.explanation}
              </div>
              <button onClick={advanceQuestion} style={{ ...primaryButtonStyle, marginTop: "1rem" }}>
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === "complete") {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎉</div>
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            Lesson Complete!
          </h2>
          <div
            style={{
              fontFamily: "'Noto Serif SC', serif",
              fontSize: "2.5rem",
              color: "var(--text-primary)",
              margin: "1rem 0",
            }}
          >
            {topic.hanzi}
          </div>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--xp-gold)",
              animation: "countUp 0.6s ease",
            }}
          >
            +{xpEarned} XP
          </div>
          {bonusXP > 0 && (
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "1rem",
                color: "var(--xp-gold)",
                marginTop: "0.5rem",
                animation: "fadeIn 0.5s ease 0.3s both",
              }}
            >
              +{bonusXP} Bonus XP ✨ Perfect score!
            </div>
          )}
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "13px",
              color: "var(--text-muted)",
              marginTop: "1rem",
            }}
          >
            {totalCorrect}/{totalAnswered} correct
          </div>
          <button onClick={handleComplete} style={{ ...primaryButtonStyle, marginTop: "1.5rem" }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "14px",
        color: "var(--text-muted)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "0.5rem 0",
        marginBottom: "1rem",
      }}
    >
      ← Back
    </button>
  );
}

function PhaseBadge({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        borderRadius: "9999px",
        padding: "0.125rem 0.625rem",
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        background: "var(--accent)",
        color: "#FFFFFF",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      {label}
    </span>
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

const hanziDisplayStyle: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
  fontSize: "3rem",
  fontWeight: 700,
  textAlign: "center",
  color: "var(--text-primary)",
  margin: "1.5rem 0 0.5rem",
};

const pinyinStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.25rem",
  color: "var(--text-muted)",
  textAlign: "center",
};

const meaningStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.125rem",
  color: "var(--text-primary)",
  textAlign: "center",
  marginBottom: "1.5rem",
};

const tutorialTextStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  color: "var(--text-primary)",
  lineHeight: 1.6,
};

const primaryButtonStyle: React.CSSProperties = {
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
  width: "100%",
};
