import { useState, useEffect, useCallback } from "react";
import type { Task, TaskResult, XPState } from "./types/tasks";
import type { UserProgress } from "./types/state";
import { loadProgress, saveProgress } from "./engine/storage";
import { loadXPState, saveXPState } from "./engine/tasks";
import { updateMastery } from "./engine/srs";
import { GRAPH } from "./data/graph";
import Dashboard from "./components/Dashboard";
import LessonView from "./components/LessonView";
import ReviewView from "./components/ReviewView";
import QuizView from "./components/QuizView";
import MultistepView from "./components/MultistepView";
import XPBar from "./components/XPBar";

type View = "dashboard" | "lesson" | "review" | "quiz" | "multistep";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [view, setView] = useState<View>("dashboard");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [xpState, setXpState] = useState<XPState>(loadXPState);
  const [activeTab, setActiveTab] = useState<"dashboard" | "progress">("dashboard");

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleSelectTask = useCallback((task: Task) => {
    setActiveTask(task);
    setView(task.type);
  }, []);

  const handleTaskComplete = useCallback((result: TaskResult) => {
    if (!activeTask) return;

    const existing = progress[activeTask.topic.id];
    const nodeState = existing ?? {
      mastery: 0,
      interval: 60,
      nextReview: 0,
      totalReviews: 0,
      lastReviewedAt: 0,
    };

    const wasCorrectOverall = result.correctCount > result.questionsAnswered / 2;
    const updatedNode = updateMastery(nodeState, wasCorrectOverall);
    const newProgress = { ...progress, [activeTask.topic.id]: updatedNode };
    setProgress(newProgress);
    saveProgress(newProgress);

    const newXPState: XPState = {
      ...xpState,
      totalXP: xpState.totalXP + result.xpEarned,
      todayXP: xpState.todayXP + result.xpEarned,
      tasksCompletedToday: xpState.tasksCompletedToday + 1,
      questionsAnsweredToday: xpState.questionsAnsweredToday + result.questionsAnswered,
      xpSinceLastQuiz: activeTask.type === "quiz" ? 0 : xpState.xpSinceLastQuiz + result.xpEarned,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      streak: xpState.streak || 1,
    };
    setXpState(newXPState);
    saveXPState(newXPState);

    setActiveTask(null);
    setView("dashboard");
  }, [activeTask, progress, xpState]);

  const handleBack = useCallback(() => {
    setActiveTask(null);
    setView("dashboard");
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        transition: "background 0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          maxWidth: "48rem",
          width: "100%",
          margin: "0 auto",
          padding: "1.25rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: 0,
            cursor: "pointer",
          }}
          onClick={handleBack}
        >
          Lang Academy
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <XPBar
            current={xpState.todayXP}
            goal={xpState.dailyGoal}
            streak={xpState.streak}
            variant="compact"
          />
          <button
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle dark mode"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "13px",
              fontWeight: 500,
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              borderRadius: "0.5rem",
              padding: "0.375rem 0.75rem",
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--border)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, paddingBottom: "5rem", paddingTop: "1rem" }}>
        {view === "dashboard" && activeTab === "dashboard" && (
          <Dashboard
            graph={GRAPH}
            progress={progress}
            xpState={xpState}
            onSelectTask={handleSelectTask}
          />
        )}

        {view === "dashboard" && activeTab === "progress" && (
          <ProgressView progress={progress} xpState={xpState} />
        )}

        {view === "lesson" && activeTask && (
          <LessonView
            topic={activeTask.topic}
            onComplete={handleTaskComplete}
            onBack={handleBack}
          />
        )}

        {view === "review" && activeTask && (
          <ReviewView
            topic={activeTask.topic}
            onComplete={handleTaskComplete}
            onBack={handleBack}
          />
        )}

        {view === "quiz" && activeTask && (
          <QuizView
            topic={activeTask.topic}
            progress={progress}
            onComplete={handleTaskComplete}
            onBack={handleBack}
          />
        )}

        {view === "multistep" && activeTask && (
          <MultistepView
            topic={activeTask.topic}
            progress={progress}
            onComplete={handleTaskComplete}
            onBack={handleBack}
          />
        )}
      </main>

      {/* Tab bar */}
      {view === "dashboard" && (
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "var(--surface)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            padding: "0.75rem 0",
            zIndex: 10,
          }}
        >
          <TabButton
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <TabButton
            label="Progress"
            active={activeTab === "progress"}
            onClick={() => setActiveTab("progress")}
          />
        </nav>
      )}
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "14px",
        fontWeight: active ? 600 : 400,
        color: active ? "var(--accent)" : "var(--text-muted)",
        background: "transparent",
        border: "none",
        borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
        cursor: "pointer",
        padding: "0.5rem 1rem",
        transition: "color 0.3s ease, border-color 0.3s ease",
      }}
    >
      {label}
    </button>
  );
}

function ProgressView({
  progress,
  xpState,
}: {
  progress: UserProgress;
  xpState: XPState;
}) {
  const mastered = GRAPH.filter(
    (n) => progress[n.id] && progress[n.id].mastery >= 0.8
  );
  const inProgress = GRAPH.filter(
    (n) => progress[n.id] && progress[n.id].mastery < 0.8
  );
  const completionPercent = Math.round((mastered.length / GRAPH.length) * 100);

  return (
    <div
      style={{
        maxWidth: "48rem",
        margin: "0 auto",
        padding: "0 1rem",
      }}
    >
      {/* Summary card */}
      <div
        style={{
          background: "var(--surface)",
          boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
          borderRadius: "1rem",
          padding: "2rem",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "var(--xp-gold)",
          }}
        >
          {xpState.totalXP}
        </div>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "13px",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Total XP Earned
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            marginTop: "1.5rem",
          }}
        >
          <StatBlock value={`${completionPercent}%`} label="Complete" />
          <StatBlock value={String(mastered.length)} label="Mastered" />
          <StatBlock
            value={`${xpState.streak}`}
            label="Day Streak"
            color="var(--xp-gold)"
          />
        </div>
      </div>

      {/* Mastered items */}
      {mastered.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "13px",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.75rem",
            }}
          >
            Mastered ({mastered.length})
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {mastered.map((n) => (
              <div
                key={n.id}
                style={{
                  background: "var(--surface)",
                  boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
                  borderRadius: "0.75rem",
                  padding: "0.75rem 1rem",
                  textAlign: "center",
                  minWidth: "4rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Noto Serif SC', serif",
                    fontSize: "1.5rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {n.hanzi}
                </div>
                <div
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "11px",
                    color: "var(--success)",
                    fontWeight: 600,
                  }}
                >
                  {Math.round((progress[n.id]?.mastery ?? 0) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In progress items */}
      {inProgress.length > 0 && (
        <div>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "13px",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.75rem",
            }}
          >
            In Progress ({inProgress.length})
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {inProgress.map((n) => (
              <div
                key={n.id}
                style={{
                  background: "var(--surface)",
                  boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
                  borderRadius: "0.75rem",
                  padding: "0.75rem 1rem",
                  textAlign: "center",
                  minWidth: "4rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Noto Serif SC', serif",
                    fontSize: "1.5rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {n.hanzi}
                </div>
                <div
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "11px",
                    color: "var(--accent)",
                    fontWeight: 600,
                  }}
                >
                  {Math.round((progress[n.id]?.mastery ?? 0) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBlock({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "1.5rem",
          fontWeight: 600,
          color: color ?? "var(--text-primary)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "12px",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default App;
