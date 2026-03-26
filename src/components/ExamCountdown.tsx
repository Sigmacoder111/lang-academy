import { useMemo } from "react";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import {
  getSkillReadiness,
  getReadinessColor,
  getSkillLabel,
  getDaysUntilExam,
  getExamDateFormatted,
  type SkillReadiness,
} from "../engine/adaptive-study";

interface ExamCountdownProps {
  graph: GraphNode[];
  progress: UserProgress;
}

export default function ExamCountdown({ graph, progress }: ExamCountdownProps) {
  const daysUntilExam = useMemo(() => getDaysUntilExam(), []);
  const examDateStr = useMemo(() => getExamDateFormatted(), []);
  const readiness = useMemo(
    () => getSkillReadiness(graph, progress),
    [graph, progress]
  );

  if (daysUntilExam <= 0) return null;

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
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "2.25rem",
              fontWeight: 700,
              color: daysUntilExam <= 7 ? "#ef4444" : daysUntilExam <= 14 ? "#eab308" : "var(--accent)",
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
              {examDateStr}
            </div>
          </div>
        </div>
        {daysUntilExam <= 7 && (
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.6875rem",
              fontWeight: 600,
              color: "#ef4444",
              background: "rgba(239, 68, 68, 0.1)",
              padding: "0.25rem 0.5rem",
              borderRadius: "9999px",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Review Only
          </span>
        )}
      </div>

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
        Skill Readiness
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {readiness.map((r) => (
          <ReadinessBar key={r.skill} readiness={r} />
        ))}
      </div>
    </div>
  );
}

function ReadinessBar({ readiness }: { readiness: SkillReadiness }) {
  const color = getReadinessColor(readiness.readinessPercent);
  const label = getSkillLabel(readiness.skill);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "0.2rem",
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
          {label}
        </span>
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            color,
          }}
        >
          {readiness.readinessPercent}% ready
        </span>
      </div>
      <div
        style={{
          height: "0.375rem",
          background: "var(--border)",
          borderRadius: "9999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${readiness.readinessPercent}%`,
            background: color,
            borderRadius: "9999px",
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}
