import { useState, useMemo, useCallback } from "react";
import type { GraphNode } from "../types/graph";
import type { TaskResult, MCQuestion, DrillTask } from "../types/tasks";
import { generateMCQuestions } from "../engine/tasks";
import { getSkillLabel } from "../engine/adaptive-study";

interface DrillViewProps {
  task: DrillTask;
  graph: GraphNode[];
  onComplete: (result: TaskResult) => void;
  onBack: () => void;
}

export default function DrillView({ task, graph, onComplete, onBack }: DrillViewProps) {
  const drillNodes = useMemo(() => {
    return task.nodeIds
      .map((id) => graph.find((n) => n.id === id))
      .filter(Boolean) as GraphNode[];
  }, [task.nodeIds, graph]);

  const questions = useMemo(() => {
    const allQs: MCQuestion[] = [];
    for (const node of drillNodes.slice(0, 10)) {
      const qs = generateMCQuestions(node, graph, 1);
      allQs.push(...qs);
    }
    return allQs.slice(0, 10);
  }, [drillNodes, graph]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(() => Date.now());

  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback(
    (idx: number) => {
      if (showResult) return;
      setSelectedAnswer(idx);
      setShowResult(true);
      if (idx === currentQuestion?.correctIndex) {
        setCorrectCount((c) => c + 1);
      }
    },
    [showResult, currentQuestion]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentIndex, questions.length]);

  const handleFinish = useCallback(() => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const isPerfect = correctCount === questions.length;
    onComplete({
      xpEarned: task.xpReward,
      bonusXP: isPerfect ? 3 : 0,
      questionsAnswered: questions.length,
      correctCount,
      perfectScore: isPerfect,
      totalSolveTimeSeconds: timeSpent,
    });
  }, [correctCount, questions.length, startTime, task.xpReward, onComplete]);

  if (questions.length === 0) {
    return (
      <div style={{ maxWidth: "40rem", margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>&#127919;</div>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1.125rem",
            color: "var(--text-primary)",
            marginBottom: "1rem",
          }}
        >
          No drill questions available
        </div>
        <button
          onClick={onBack}
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.875rem",
            color: "var(--accent)",
            background: "transparent",
            border: "1px solid var(--accent)",
            borderRadius: "0.5rem",
            padding: "0.5rem 1.5rem",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    const hskLevel = drillNodes[0]?.hskLevel;

    return (
      <div style={{ maxWidth: "40rem", margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          {percentage >= 70 ? "🎉" : percentage >= 50 ? "💪" : "📚"}
        </div>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Drill Complete!
        </div>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1rem",
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
          }}
        >
          You got {correctCount}/{questions.length} on{" "}
          {hskLevel ? `HSK ${hskLevel} ` : ""}
          {getSkillLabel(task.skillArea)} patterns
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "2rem",
          }}
        >
          {questions.map((_, i) => (
            <div
              key={i}
              style={{
                width: "2rem",
                height: "0.375rem",
                borderRadius: "9999px",
                background: i < correctCount ? "#22c55e" : "#ef4444",
              }}
            />
          ))}
        </div>

        <div
          style={{
            background: "var(--surface)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            marginBottom: "1.5rem",
            display: "inline-flex",
            gap: "2rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--accent)",
              }}
            >
              {percentage}%
            </div>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              Accuracy
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--xp-gold)",
              }}
            >
              +{task.xpReward + (correctCount === questions.length ? 3 : 0)}
            </div>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              XP Earned
            </div>
          </div>
        </div>

        <br />
        <button
          onClick={handleFinish}
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "#FFFFFF",
            background: "var(--accent)",
            border: "none",
            borderRadius: "0.75rem",
            padding: "0.75rem 2rem",
            cursor: "pointer",
            transition: "opacity 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "40rem", margin: "0 auto", padding: "1rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={onBack}
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          &larr; Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1rem" }}>&#127919;</span>
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#ef4444",
            }}
          >
            {getSkillLabel(task.skillArea)} Drill
          </span>
        </div>
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
          }}
        >
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: "0.25rem",
          background: "var(--border)",
          borderRadius: "9999px",
          marginBottom: "2rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100}%`,
            background: "var(--accent)",
            borderRadius: "9999px",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Question */}
      {currentQuestion && (
        <div
          style={{
            background: "var(--surface)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          {currentQuestion.hanzi && (
            <div
              style={{
                fontFamily: "'Noto Serif SC', serif",
                fontSize: "2.5rem",
                textAlign: "center",
                color: "var(--text-primary)",
                marginBottom: "0.5rem",
              }}
            >
              {currentQuestion.hanzi}
            </div>
          )}

          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1rem",
              color: "var(--text-primary)",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            {currentQuestion.question}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {currentQuestion.options.map((opt, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = i === currentQuestion.correctIndex;
              let bg = "transparent";
              let borderColor = "var(--border)";
              let textColor = "var(--text-primary)";

              if (showResult) {
                if (isCorrect) {
                  bg = "rgba(34, 197, 94, 0.1)";
                  borderColor = "#22c55e";
                  textColor = "#22c55e";
                } else if (isSelected && !isCorrect) {
                  bg = "rgba(239, 68, 68, 0.1)";
                  borderColor = "#ef4444";
                  textColor = "#ef4444";
                }
              } else if (isSelected) {
                borderColor = "var(--accent)";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showResult}
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "0.9375rem",
                    color: textColor,
                    background: bg,
                    border: `1.5px solid ${borderColor}`,
                    borderRadius: "0.5rem",
                    padding: "0.75rem 1rem",
                    cursor: showResult ? "default" : "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div style={{ marginTop: "1rem" }}>
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.8125rem",
                  color: "var(--text-muted)",
                  padding: "0.75rem",
                  background: "rgba(0,0,0,0.02)",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                {currentQuestion.explanation}
              </div>
              <button
                onClick={handleNext}
                style={{
                  width: "100%",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  background: "var(--accent)",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  cursor: "pointer",
                }}
              >
                {currentIndex + 1 >= questions.length ? "See Results" : "Next"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
