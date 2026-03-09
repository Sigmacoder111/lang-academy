import { useState, useEffect, useCallback, useMemo } from "react";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { TaskResult, MCQuestion } from "../types/tasks";
import { generateMixedQuestions } from "../engine/tasks";
import { GRAPH } from "../data/graph";

interface QuizViewProps {
  topic: GraphNode;
  progress: UserProgress;
  onComplete: (result: TaskResult) => void;
  onBack: () => void;
}

const QUIZ_QUESTIONS = 10;
const QUIZ_TIME_SECONDS = 5 * 60;

export default function QuizView({ topic, progress, onComplete, onBack }: QuizViewProps) {
  const initialQuestions = useMemo(() => {
    const masteredTopics = GRAPH.filter(
      (n) => progress[n.id] && progress[n.id].mastery >= 0.5
    );
    const topics = masteredTopics.length >= 3 ? masteredTopics : [topic, ...GRAPH.slice(0, 4)];
    return generateMixedQuestions(topics, GRAPH, QUIZ_QUESTIONS);
  }, [topic, progress]);
  const [questions, setQuestions] = useState<MCQuestion[]>(initialQuestions);
  const [currentQ, setCurrentQ] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_TIME_SECONDS);
  const [done, setDone] = useState(false);
  const [missedTopics, setMissedTopics] = useState<string[]>([]);

  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          setDone(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [done]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleAnswer = useCallback((idx: number) => {
    if (selectedAnswer !== null || done) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);

    const correct = idx === questions[currentQ].correctIndex;
    if (correct) {
      setTotalCorrect((c) => c + 1);
    } else {
      setMissedTopics((prev) => [...new Set([...prev, questions[currentQ].topicId])]);
    }
  }, [selectedAnswer, done, questions, currentQ]);

  const advance = useCallback(() => {
    if (currentQ + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQ((q) => q + 1);
  }, [currentQ, questions.length]);

  const handleComplete = useCallback(() => {
    const answered = Math.min(currentQ + (selectedAnswer !== null ? 1 : 0), questions.length);
    const perfect = totalCorrect === answered && answered === questions.length;
    onComplete({
      xpEarned: 15 + (perfect ? 5 : 0),
      bonusXP: perfect ? 5 : 0,
      questionsAnswered: answered,
      correctCount: totalCorrect,
      perfectScore: perfect,
      missedTopicIds: missedTopics,
    });
  }, [onComplete, currentQ, selectedAnswer, questions.length, totalCorrect, missedTopics]);

  const handleRetake = useCallback(() => {
    const newQs = (() => {
      const masteredTopics = GRAPH.filter(
        (n) => progress[n.id] && progress[n.id].mastery >= 0.5
      );
      const topics = masteredTopics.length >= 3 ? masteredTopics : [topic, ...GRAPH.slice(0, 4)];
      return generateMixedQuestions(topics, GRAPH, QUIZ_QUESTIONS);
    })();
    setQuestions(newQs);
    setCurrentQ(0);
    setTotalCorrect(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeRemaining(QUIZ_TIME_SECONDS);
    setDone(false);
    setMissedTopics([]);
  }, [topic, progress]);

  if (done) {
    const answered = Math.min(currentQ + (selectedAnswer !== null ? 1 : 0), questions.length);
    const perfect = totalCorrect === answered && answered === questions.length;
    const timeUp = timeRemaining <= 0 && currentQ + 1 < questions.length;

    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: "center" as const }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
            {perfect ? "🏆" : timeUp ? "⏰" : "📊"}
          </div>
          <h2 style={titleStyle}>
            {timeUp ? "Time's Up!" : "Quiz Complete!"}
          </h2>
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", margin: "1rem 0" }}>
            {totalCorrect}/{answered}
          </div>
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--xp-gold)", animation: "countUp 0.6s ease" }}>
            +{15 + (perfect ? 5 : 0)} XP
          </div>
          {perfect && (
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1rem", color: "var(--xp-gold)", marginTop: "0.5rem", animation: "fadeIn 0.5s ease 0.3s both" }}>
              +5 Bonus XP ✨ Perfect quiz!
            </div>
          )}
          {missedTopics.length > 0 && (
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "13px", color: "var(--error)", marginTop: "1rem" }}>
              {missedTopics.length} topic{missedTopics.length > 1 ? "s" : ""} queued for review
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1.5rem" }}>
            <button onClick={handleComplete} style={primaryButtonStyle}>
              Back to Dashboard
            </button>
            <button
              onClick={handleRetake}
              style={{
                ...primaryButtonStyle,
                background: "transparent",
                color: "var(--accent)",
                border: "1px solid var(--accent)",
              }}
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const q = questions[currentQ];
  const isCorrect = selectedAnswer !== null && selectedAnswer === q.correctIndex;
  const timeWarning = timeRemaining < 60;
  const qType = q.questionType || "standard";

  return (
    <div style={containerStyle}>
      <button onClick={onBack} style={backButtonStyle}>← Back</button>
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ ...badgeStyle, background: "var(--xp-gold)" }}>Quiz</span>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "13px", color: "var(--text-muted)" }}>
              {currentQ + 1}/{questions.length}
            </span>
            <span
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "14px",
                fontWeight: 600,
                color: timeWarning ? "var(--error)" : "var(--text-primary)",
                transition: "color 0.3s ease",
              }}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <div style={{ width: "100%", height: "4px", borderRadius: "2px", background: "rgba(0,0,0,0.06)", marginBottom: "1.25rem", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((currentQ + (selectedAnswer !== null ? 1 : 0)) / questions.length) * 100}%`, background: "var(--xp-gold)", borderRadius: "2px", transition: "width 0.3s ease" }} />
        </div>

        {/* Passage for reading comprehension */}
        {qType === "passage_comprehension" && q.passage && (
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Passage</div>
            <div style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.05rem", lineHeight: 2, color: "var(--text-primary)", padding: "1rem", background: "rgba(0,0,0,0.02)", borderRadius: "0.75rem", borderLeft: "3px solid var(--xp-gold)" }}>
              {q.passage}
            </div>
          </div>
        )}

        {/* Pattern display */}
        {qType === "pattern_match" && q.hanzi && (
          <div style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.25rem", textAlign: "center", color: "var(--accent)", padding: "0.75rem", margin: "0 0 1rem", background: "rgba(193, 95, 60, 0.06)", borderRadius: "0.5rem", fontWeight: 600 }}>
            Pattern: {q.hanzi}
          </div>
        )}

        {/* Cloze display */}
        {qType === "cloze" && q.hanzi && (
          <div style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.5rem", textAlign: "center", color: "var(--text-primary)", margin: "0.5rem 0 1rem", padding: "0.75rem", background: "rgba(0,0,0,0.02)", borderRadius: "0.5rem" }}>
            {q.hanzi}
          </div>
        )}

        {/* Standard hanzi */}
        {(qType === "standard" || !qType) && q.hanzi && (
          <div style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "3rem", textAlign: "center", color: "var(--text-primary)", margin: "0.5rem 0 1rem" }}>
            {q.hanzi}
          </div>
        )}

        <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1.125rem", color: "var(--text-primary)", marginBottom: "1.25rem", fontWeight: 600 }}>
          {q.question}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {q.options.map((opt, idx) => {
            let bg = "var(--surface)";
            let border = "1px solid var(--border)";
            let color = "var(--text-primary)";
            if (selectedAnswer !== null) {
              if (idx === q.correctIndex) { bg = "var(--success)"; color = "#FFFFFF"; border = "1px solid var(--success)"; }
              else if (idx === selectedAnswer) { bg = "var(--error)"; color = "#FFFFFF"; border = "1px solid var(--error)"; }
            }
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedAnswer !== null}
                style={{
                  fontFamily: opt.match(/[\u4e00-\u9fff]/) ? "'Noto Serif SC', serif" : "Georgia, 'Times New Roman', serif",
                  fontSize: "15px", background: bg, color, border, borderRadius: "0.5rem", padding: "0.75rem 1rem",
                  cursor: selectedAnswer !== null ? "default" : "pointer", transition: "all 0.2s ease", textAlign: "left",
                  opacity: selectedAnswer !== null && idx !== q.correctIndex && idx !== selectedAnswer ? 0.5 : 1,
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: "0.75rem", background: isCorrect ? "rgba(74, 140, 111, 0.08)" : "rgba(193, 95, 60, 0.08)", animation: "fadeIn 0.3s ease" }}>
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "14px", fontWeight: 600, color: isCorrect ? "var(--success)" : "var(--error)", marginBottom: "0.25rem" }}>
              {isCorrect ? "Correct!" : "Incorrect"}
            </div>
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "14px", color: "var(--text-primary)" }}>
              {q.explanation}
            </div>
            <button onClick={advance} style={{ ...primaryButtonStyle, marginTop: "1rem" }}>
              {currentQ + 1 >= questions.length ? "See Results" : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: "48rem", margin: "0 auto", padding: "0 1rem" };
const cardStyle: React.CSSProperties = { background: "var(--surface)", boxShadow: "0 0.5rem 2rem rgba(0,0,0,0.06)", borderRadius: "1rem", padding: "2rem" };
const backButtonStyle: React.CSSProperties = { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "14px", color: "var(--text-muted)", background: "transparent", border: "none", cursor: "pointer", padding: "0.5rem 0", marginBottom: "1rem" };
const badgeStyle: React.CSSProperties = { display: "inline-block", borderRadius: "9999px", padding: "0.125rem 0.625rem", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "#FFFFFF", fontFamily: "Georgia, 'Times New Roman', serif" };
const titleStyle: React.CSSProperties = { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" };
const primaryButtonStyle: React.CSSProperties = { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "15px", fontWeight: 600, background: "var(--accent)", color: "#FFFFFF", border: "none", borderRadius: "0.5rem", padding: "0.75rem 1.5rem", cursor: "pointer", transition: "background 0.15s ease", width: "100%" };
