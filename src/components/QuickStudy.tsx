import { useState, useMemo, useCallback } from "react";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { Task, XPState } from "../types/tasks";
import {
  generateSmartSession,
  getSkillLabel,
  getReadinessColor,
  getSkillReadiness,
  type SessionPlan,
} from "../engine/adaptive-study";

const TIME_OPTIONS = [15, 20, 30, 45, 60];

interface QuickStudyProps {
  graph: GraphNode[];
  progress: UserProgress;
  xpState: XPState;
  onStartSession: (tasks: Task[]) => void;
}

export default function QuickStudy({
  graph,
  progress,
  xpState,
  onStartSession,
}: QuickStudyProps) {
  const [showSelector, setShowSelector] = useState(false);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [sessionPlan, setSessionPlan] = useState<SessionPlan | null>(null);

  const handleTimeSelect = useCallback(
    (minutes: number) => {
      setSelectedTime(minutes);
      const plan = generateSmartSession(minutes, graph, progress, xpState);
      setSessionPlan(plan);
    },
    [graph, progress, xpState]
  );

  const handleStart = useCallback(() => {
    if (!sessionPlan) return;
    const allTasks = sessionPlan.segments.flatMap((s) => s.tasks);
    if (allTasks.length > 0) {
      onStartSession(allTasks);
    }
    setShowSelector(false);
    setSelectedTime(null);
    setSessionPlan(null);
  }, [sessionPlan, onStartSession]);

  const handleClose = useCallback(() => {
    setShowSelector(false);
    setSelectedTime(null);
    setSessionPlan(null);
  }, []);

  if (!showSelector) {
    return (
      <button
        onClick={() => setShowSelector(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          width: "100%",
          background: "linear-gradient(135deg, var(--accent), #c9553d)",
          boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.1)",
          borderRadius: "1rem",
          padding: "1rem 1.5rem",
          border: "none",
          cursor: "pointer",
          textAlign: "left" as const,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          marginBottom: "1.5rem",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 0.5rem 2rem rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 0.25rem 1.25rem rgba(0,0,0,0.1)";
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>&#9889;</span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "15px",
              fontWeight: 600,
              color: "#FFFFFF",
            }}
          >
            Quick Study
          </div>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "13px",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Generate a focused session targeting your weakest areas
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        borderRadius: "0.75rem",
        padding: "1.25rem",
        marginBottom: "1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          How much time do you have?
        </div>
        <button
          onClick={handleClose}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            fontSize: "1.25rem",
            padding: "0.25rem",
            lineHeight: 1,
          }}
        >
          &times;
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: sessionPlan ? "1rem" : 0,
          flexWrap: "wrap",
        }}
      >
        {TIME_OPTIONS.map((mins) => (
          <button
            key={mins}
            onClick={() => handleTimeSelect(mins)}
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.875rem",
              fontWeight: selectedTime === mins ? 600 : 400,
              color: selectedTime === mins ? "#FFFFFF" : "var(--text-primary)",
              background: selectedTime === mins ? "var(--accent)" : "transparent",
              border: `1.5px solid ${selectedTime === mins ? "var(--accent)" : "var(--border)"}`,
              borderRadius: "9999px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {mins} min
          </button>
        ))}
      </div>

      {sessionPlan && (
        <div>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.6875rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.75rem",
            }}
          >
            Session Plan
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
            {sessionPlan.segments.map((seg) => {
              const color = getReadinessColor(50);
              return (
                <div
                  key={seg.skill}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem 0.75rem",
                    background: "rgba(0,0,0,0.02)",
                    borderRadius: "0.5rem",
                    borderLeft: `3px solid ${color}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    {getSkillLabel(seg.skill)}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "var(--accent)",
                      }}
                    >
                      {seg.minutes} min
                    </span>
                    <span
                      style={{
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        fontSize: "0.6875rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {seg.tasks.length} tasks
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleStart}
            style={{
              width: "100%",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "#FFFFFF",
              background: "var(--accent)",
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Start Session
          </button>
        </div>
      )}
    </div>
  );
}
