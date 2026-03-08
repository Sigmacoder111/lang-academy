import { useState, useCallback, useMemo } from "react";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { TaskResult, MCQuestion } from "../types/tasks";
import { generateMixedQuestions } from "../engine/tasks";
import { GRAPH } from "../data/graph";

interface MultistepViewProps {
  topic: GraphNode;
  progress: UserProgress;
  onComplete: (result: TaskResult) => void;
  onBack: () => void;
}

const STEP_COUNT = 10;

const SCENARIOS = [
  {
    title: "Ordering at a Restaurant",
    context: "You're at a restaurant in Beijing. The waiter hands you a menu with Chinese characters. Use your knowledge to navigate the meal.",
  },
  {
    title: "Exploring Nature",
    context: "You're hiking through the Chinese countryside. Signs along the trail describe the scenery. Can you understand what you see?",
  },
  {
    title: "Meeting a Friend",
    context: "You've arrived in Shanghai to meet a pen pal. They send you messages mixing characters you've learned. Time to put your skills to use!",
  },
  {
    title: "Reading a Story",
    context: "A children's book lies open at a library in Taipei. Each page uses characters and words you've been studying. Let's read together.",
  },
];

export default function MultistepView({ topic, progress, onComplete, onBack }: MultistepViewProps) {
  const initialQuestions = useMemo(() => {
    const available = GRAPH.filter(
      (n) => progress[n.id] && progress[n.id].mastery >= 0.3
    );
    const topics = available.length >= 3 ? available : [topic, ...GRAPH.slice(0, 5)];
    return generateMixedQuestions(topics, GRAPH, STEP_COUNT);
  }, [topic, progress]);
  const [questions] = useState<MCQuestion[]>(initialQuestions);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [done, setDone] = useState(false);
  const [scenario] = useState(() => SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]);
  const [skillsApplied, setSkillsApplied] = useState<Set<string>>(new Set());

  const handleAnswer = useCallback((idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    setTotalAnswered((a) => a + 1);

    const correct = idx === questions[currentStep].correctIndex;
    if (correct) setTotalCorrect((c) => c + 1);

    setSkillsApplied((prev) => new Set([...prev, questions[currentStep].topicId]));
  }, [selectedAnswer, questions, currentStep]);

  const advance = useCallback(() => {
    if (currentStep + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentStep((s) => s + 1);
  }, [currentStep, questions.length]);

  const handleComplete = useCallback(() => {
    const perfect = totalCorrect === totalAnswered && totalAnswered === questions.length;
    onComplete({
      xpEarned: 20 + (perfect ? 5 : 0),
      bonusXP: perfect ? 5 : 0,
      questionsAnswered: totalAnswered,
      correctCount: totalCorrect,
      perfectScore: perfect,
    });
  }, [onComplete, totalCorrect, totalAnswered, questions.length]);

  if (done) {
    const perfect = totalCorrect === totalAnswered && totalAnswered === questions.length;
    const appliedNodes = GRAPH.filter((n) => skillsApplied.has(n.id));

    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: "center" as const }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🧩</div>
          <h2 style={titleStyle}>Multistep Complete!</h2>
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "15px", color: "var(--text-muted)", marginBottom: "1rem" }}>
            {scenario.title}
          </div>
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", margin: "0.5rem 0" }}>
            {totalCorrect}/{totalAnswered}
          </div>
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--xp-gold)", animation: "countUp 0.6s ease" }}>
            +{20 + (perfect ? 5 : 0)} XP
          </div>
          {perfect && (
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1rem", color: "var(--xp-gold)", marginTop: "0.5rem", animation: "fadeIn 0.5s ease 0.3s both" }}>
              +5 Bonus XP ✨
            </div>
          )}

          {/* Skills applied */}
          {appliedNodes.length > 0 && (
            <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: "0.75rem", background: "rgba(0,0,0,0.03)" }}>
              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                Skills Applied
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                {appliedNodes.map((n) => (
                  <span
                    key={n.id}
                    style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      background: "var(--success)",
                      color: "#FFFFFF",
                      fontFamily: "'Noto Serif SC', serif",
                      fontSize: "14px",
                    }}
                  >
                    {n.hanzi}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleComplete} style={{ ...primaryButtonStyle, marginTop: "1.5rem" }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const q = questions[currentStep];
  const isCorrect = selectedAnswer !== null && selectedAnswer === q.correctIndex;

  return (
    <div style={containerStyle}>
      <button onClick={onBack} style={backButtonStyle}>← Back</button>
      <div style={cardStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <span style={{ ...badgeStyle, background: "var(--success)" }}>Multistep</span>
          <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "13px", color: "var(--text-muted)" }}>
            Step {currentStep + 1} of {questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ width: "100%", height: "4px", borderRadius: "2px", background: "rgba(0,0,0,0.06)", marginBottom: "1rem", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((currentStep + (selectedAnswer !== null ? 1 : 0)) / questions.length) * 100}%`, background: "var(--success)", borderRadius: "2px", transition: "width 0.3s ease" }} />
        </div>

        {/* Scenario context (shown on first step) */}
        {currentStep === 0 && !selectedAnswer && (
          <div style={{ marginBottom: "1.5rem", padding: "1rem", borderRadius: "0.75rem", background: "rgba(0,0,0,0.03)" }}>
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
              {scenario.title}
            </div>
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>
              {scenario.context}
            </div>
          </div>
        )}

        {q.hanzi && (
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
              {currentStep + 1 >= questions.length ? "See Results" : "Next Step"}
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
