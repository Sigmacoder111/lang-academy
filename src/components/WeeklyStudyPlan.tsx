import { useState, useMemo, useCallback } from "react";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import {
  generateWeeklyPlan,
  getSkillLabel,
  getReadinessColor,
  getSkillReadiness,
  loadDailyStudyMinutes,
  saveDailyStudyMinutes,
} from "../engine/adaptive-study";

interface WeeklyStudyPlanProps {
  graph: GraphNode[];
  progress: UserProgress;
}

const DAILY_MINUTES_OPTIONS = [15, 30, 45, 60, 90];

export default function WeeklyStudyPlan({ graph, progress }: WeeklyStudyPlanProps) {
  const [expanded, setExpanded] = useState(false);
  const [dailyMinutes, setDailyMinutes] = useState(loadDailyStudyMinutes);

  const plan = useMemo(
    () => generateWeeklyPlan(graph, progress, dailyMinutes),
    [graph, progress, dailyMinutes]
  );

  const readiness = useMemo(
    () => getSkillReadiness(graph, progress),
    [graph, progress]
  );

  const handleDailyMinutesChange = useCallback((val: number) => {
    setDailyMinutes(val);
    saveDailyStudyMinutes(val);
  }, []);

  return (
    <div
      style={{
        background: "var(--surface)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        borderRadius: "0.75rem",
        overflow: "hidden",
        marginBottom: "1.5rem",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "1rem 1.25rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.25rem" }}>&#128197;</span>
          <div>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              Weekly Study Plan
            </div>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              {plan.weeklyFocusMessage}
            </div>
          </div>
        </div>
        <span
          style={{
            color: "var(--text-muted)",
            transform: expanded ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.2s ease",
          }}
        >
          &#9662;
        </span>
      </button>

      {expanded && (
        <div style={{ padding: "0 1.25rem 1.25rem" }}>
          {/* Daily study time selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "0.8125rem",
                color: "var(--text-muted)",
              }}
            >
              I can study
            </span>
            <div style={{ display: "flex", gap: "0.375rem" }}>
              {DAILY_MINUTES_OPTIONS.map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleDailyMinutesChange(mins)}
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "0.75rem",
                    fontWeight: dailyMinutes === mins ? 600 : 400,
                    color: dailyMinutes === mins ? "#FFFFFF" : "var(--text-primary)",
                    background: dailyMinutes === mins ? "var(--accent)" : "transparent",
                    border: `1px solid ${dailyMinutes === mins ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: "9999px",
                    padding: "0.25rem 0.625rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}/day
                </button>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {plan.recommendations.map((rec) => {
              const skillReadiness = readiness.find((r) => r.skill === rec.skill);
              const readinessPercent = skillReadiness?.readinessPercent ?? 0;
              const color = getReadinessColor(readinessPercent);

              return (
                <div
                  key={rec.skill}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.625rem 0.75rem",
                    background: "rgba(0,0,0,0.02)",
                    borderRadius: "0.5rem",
                    borderLeft: `3px solid ${color}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      {getSkillLabel(rec.skill)}
                    </span>
                    {rec.priority === "high" && (
                      <span
                        style={{
                          fontSize: "0.625rem",
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          fontWeight: 600,
                          color: "#ef4444",
                          background: "rgba(239, 68, 68, 0.1)",
                          padding: "0.1rem 0.375rem",
                          borderRadius: "9999px",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Priority
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span
                      style={{
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {rec.sessions} sessions
                    </span>
                    <span
                      style={{
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        fontSize: "0.6875rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {rec.minutesPerSession}m each
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {plan.daysUntilExam <= 7 && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.75rem",
                background: "rgba(239, 68, 68, 0.05)",
                borderRadius: "0.5rem",
                border: "1px solid rgba(239, 68, 68, 0.15)",
              }}
            >
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#ef4444",
                  marginBottom: "0.25rem",
                }}
              >
                Final Week Strategy
              </div>
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                }}
              >
                Focus on review only &mdash; no new material. Prioritize speaking and writing practice
                for the free-response sections.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
