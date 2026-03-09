import { useState, useMemo, useCallback } from "react";
import type { Task } from "../types/tasks";
import type { XPState } from "../types/tasks";
import type { UserProgress } from "../types/state";
import type { GraphNode } from "../types/graph";
import { selectTasks, getTaskTypeInfo } from "../engine/tasks";
import { getStats } from "../engine/mastery";
import { getThemeStats } from "../engine/analytics";
import {
  AP_THEMES,
  type ThemeWeights,
  defaultThemeWeights,
  autoBalanceWeights,
  loadThemeWeights,
  saveThemeWeights,
  loadAutoBalance,
  saveAutoBalance,
  loadAPExamDate,
  saveAPExamDate,
} from "../data/themes";
import XPBar from "./XPBar";

interface DashboardProps {
  graph: GraphNode[];
  progress: UserProgress;
  xpState: XPState;
  onSelectTask: (task: Task) => void;
  onStartDiagnostic?: () => void;
}

export default function Dashboard({
  graph,
  progress,
  xpState,
  onSelectTask,
  onStartDiagnostic,
}: DashboardProps) {
  const [themeWeights, setThemeWeights] = useState<ThemeWeights>(loadThemeWeights);
  const [autoBalance, setAutoBalance] = useState(loadAutoBalance);
  const [showFocus, setShowFocus] = useState(false);
  const [examDate, setExamDate] = useState(loadAPExamDate);

  const themeStats = useMemo(
    () => getThemeStats(graph, progress),
    [graph, progress]
  );

  const effectiveWeights = useMemo(() => {
    if (!autoBalance) return themeWeights;
    const masteries: Record<string, number> = {};
    for (const ts of themeStats) {
      masteries[ts.key] = ts.masteryPercent / 100;
    }
    return autoBalanceWeights(masteries);
  }, [autoBalance, themeWeights, themeStats]);

  const tasks = useMemo(
    () => selectTasks(graph, progress, xpState, undefined, effectiveWeights),
    [graph, progress, xpState, effectiveWeights]
  );
  const stats = useMemo(() => getStats(graph, progress), [graph, progress]);
  const completionPercent = Math.round((stats.mastered / stats.total) * 100);

  const daysUntilExam = useMemo(() => {
    const target = new Date(examDate);
    const now = new Date();
    return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }, [examDate]);

  const handleWeightChange = useCallback(
    (key: string, value: number) => {
      const next = { ...themeWeights, [key]: value };
      setThemeWeights(next);
      saveThemeWeights(next);
    },
    [themeWeights]
  );

  const handleAutoBalanceToggle = useCallback(() => {
    const next = !autoBalance;
    setAutoBalance(next);
    saveAutoBalance(next);
    if (!next) {
      const w = defaultThemeWeights();
      setThemeWeights(w);
      saveThemeWeights(w);
    }
  }, [autoBalance]);

  const handleExamDateChange = useCallback((val: string) => {
    setExamDate(val);
    saveAPExamDate(val);
  }, []);

  return (
    <div
      style={{
        maxWidth: "48rem",
        margin: "0 auto",
        padding: "0 1rem 3rem",
      }}
    >
      {/* XP Bar */}
      <div style={{ marginBottom: "1.5rem" }}>
        <XPBar
          current={xpState.todayXP}
          goal={xpState.dailyGoal}
          streak={xpState.streak}
          animate
        />
      </div>

      {/* AP Exam Countdown */}
      {daysUntilExam > 0 && (
        <div
          style={{
            background: "var(--surface)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            borderRadius: "0.75rem",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: "var(--accent)",
                lineHeight: 1,
              }}
            >
              {daysUntilExam}
            </span>
            <div>
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                days until AP Chinese
              </div>
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                }}
              >
                {new Date(examDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
          <input
            type="date"
            value={examDate}
            onChange={(e) => handleExamDateChange(e.target.value)}
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "0.375rem",
              padding: "0.25rem 0.5rem",
              cursor: "pointer",
            }}
          />
        </div>
      )}

      {/* Course progress */}
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "13px",
          color: "var(--text-muted)",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        {completionPercent}% complete · {stats.mastered} of {stats.total} mastered
      </div>

      {/* Diagnostic button */}
      {onStartDiagnostic && (
        <div style={{ marginBottom: "1.5rem" }}>
          <button
            onClick={onStartDiagnostic}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              width: "100%",
              background: "var(--surface)",
              boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
              borderRadius: "1rem",
              padding: "1rem 1.5rem",
              border: "1.5px dashed var(--accent)",
              cursor: "pointer",
              textAlign: "left" as const,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 0.5rem 2rem rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 0.25rem 1.25rem rgba(0,0,0,0.035)";
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>&#128218;</span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "var(--accent)",
                }}
              >
                Take Placement Diagnostic
              </div>
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                }}
              >
                ~35 questions · Measures mastery &amp; speed · Get personalized study plan
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Task list heading */}
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "13px",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "1rem",
        }}
      >
        Choose your next task
      </div>

      {/* Task cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onSelectTask(task)} />
        ))}
        {tasks.length === 0 && (
          <div
            style={{
              background: "var(--surface)",
              boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
              borderRadius: "1rem",
              padding: "3rem 2rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✨</div>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "1.125rem",
                color: "var(--text-primary)",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              All caught up!
            </div>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "15px",
                color: "var(--text-muted)",
              }}
            >
              No tasks available right now. Come back later for reviews.
            </div>
          </div>
        )}
      </div>

      {/* Theme Focus Section */}
      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => setShowFocus(!showFocus)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "13px",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem 0",
            borderTop: "1px solid var(--border)",
          }}
        >
          <span>Theme Focus</span>
          <span style={{ transform: showFocus ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s ease" }}>
            ▾
          </span>
        </button>

        {showFocus && (
          <div
            style={{
              background: "var(--surface)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              marginTop: "0.5rem",
              animation: "fadeIn 0.2s ease",
            }}
          >
            {/* Auto-balance toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  Auto-balance
                </div>
                <div
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                  }}
                >
                  Automatically focus on your weakest themes
                </div>
              </div>
              <button
                onClick={handleAutoBalanceToggle}
                style={{
                  width: "2.75rem",
                  height: "1.5rem",
                  borderRadius: "9999px",
                  border: "none",
                  background: autoBalance ? "var(--accent)" : "var(--border)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s ease",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "1.125rem",
                    height: "1.125rem",
                    borderRadius: "50%",
                    background: "#FFFFFF",
                    position: "absolute",
                    top: "0.1875rem",
                    left: autoBalance ? "1.4375rem" : "0.1875rem",
                    transition: "left 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
              </button>
            </div>

            {/* Theme weight sliders */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {AP_THEMES.map((theme) => {
                const weight = autoBalance
                  ? effectiveWeights[theme.key] ?? 1
                  : themeWeights[theme.key] ?? 1;
                const ts = themeStats.find((s) => s.key === theme.key);

                return (
                  <div key={theme.key}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem" }}>
                        <span
                          style={{
                            fontFamily: "'Noto Serif SC', serif",
                            fontSize: "0.875rem",
                            color: "var(--text-primary)",
                          }}
                        >
                          {theme.chinese}
                        </span>
                        <span
                          style={{
                            fontFamily: "Georgia, 'Times New Roman', serif",
                            fontSize: "0.6875rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {theme.english}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          fontSize: "0.6875rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {ts ? `${ts.masteryPercent}% mastered` : "—"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="range"
                        min="0.2"
                        max="2"
                        step="0.1"
                        value={weight}
                        disabled={autoBalance}
                        onChange={(e) =>
                          handleWeightChange(theme.key, parseFloat(e.target.value))
                        }
                        style={{
                          flex: 1,
                          accentColor: "var(--accent)",
                          opacity: autoBalance ? 0.5 : 1,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          width: "2rem",
                          textAlign: "right",
                        }}
                      >
                        {weight.toFixed(1)}x
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom stats */}
      {(xpState.todayXP > 0 || xpState.tasksCompletedToday > 0) && (
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "13px",
            color: "var(--text-muted)",
            textAlign: "center",
            marginTop: "2rem",
            padding: "1rem 0",
            borderTop: "1px solid var(--border)",
          }}
        >
          Today: {xpState.todayXP} XP earned · {xpState.questionsAnsweredToday}{" "}
          questions · {xpState.tasksCompletedToday} tasks completed
        </div>
      )}
    </div>
  );
}

function TaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
}) {
  const info = getTaskTypeInfo(task.type);

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        width: "100%",
        background: "var(--surface)",
        boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
        borderRadius: "1rem",
        padding: "1.25rem 1.5rem",
        border: "none",
        borderLeft: `3px solid ${info.borderColor}`,
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        textAlign: "left",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 0.5rem 2rem rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 0.25rem 1.25rem rgba(0,0,0,0.035)";
      }}
    >
      {/* Icon */}
      <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{info.icon}</div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.25rem",
          }}
        >
          {/* Badge */}
          <span
            style={{
              display: "inline-block",
              borderRadius: "9999px",
              padding: "0.125rem 0.5rem",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              background: info.badgeBg,
              color: "#FFFFFF",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            {info.label}
          </span>
          {task.required && (
            <span
              style={{
                display: "inline-block",
                borderRadius: "9999px",
                padding: "0.125rem 0.5rem",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                background: "var(--xp-gold)",
                color: "#FFFFFF",
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              Required
            </span>
          )}
        </div>

        {/* Topic name */}
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1rem",
            color: "var(--text-primary)",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          <span style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {task.topic.hanzi}
          </span>{" "}
          — {task.topic.meaning}
        </div>
      </div>

      {/* Right: XP + time */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.25rem",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--xp-gold)",
          }}
        >
          +{task.xpReward} XP
        </span>
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          ~{task.estimatedMinutes} min
        </span>
      </div>
    </button>
  );
}
