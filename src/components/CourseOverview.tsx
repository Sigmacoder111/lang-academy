import { useMemo } from "react";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { XPState } from "../types/tasks";
import { getStats } from "../engine/srs";
import {
  estimateCompletion,
  xpPaceForTarget,
  formatDate,
  getLongestStreak,
} from "../engine/analytics";

interface Props {
  graph: GraphNode[];
  progress: UserProgress;
  xpState: XPState;
}

const AP_EXAM_DATE = new Date("2026-05-08");

export default function CourseOverview({ graph, progress, xpState }: Props) {
  const stats = useMemo(() => getStats(graph, progress), [graph, progress]);
  const completion = useMemo(
    () => estimateCompletion(graph, progress, xpState),
    [graph, progress, xpState]
  );
  const completionPercent = Math.round((stats.mastered / stats.total) * 100);
  const longestStreak = useMemo(() => getLongestStreak(), []);
  const apPace = useMemo(
    () => xpPaceForTarget(graph, progress, AP_EXAM_DATE),
    [graph, progress]
  );

  const avgDailyXP = completion.dailyPace;

  return (
    <section>
      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
        }}
        className="stats-grid"
      >
        {/* Course Progress */}
        <StatCard>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ProgressRing percent={completionPercent} size={56} />
            <div>
              <div style={statValueStyle}>{completionPercent}%</div>
              <div style={statLabelStyle}>Course Progress</div>
            </div>
          </div>
          <div style={subTextStyle}>
            {completion.estimatedDate && completion.daysRemaining > 0
              ? `Est. completion: ${formatDate(completion.estimatedDate)}`
              : stats.mastered === stats.total
                ? "Course complete!"
                : "Start learning to estimate"}
          </div>
        </StatCard>

        {/* Total XP */}
        <StatCard>
          <div style={{ ...statValueStyle, color: "var(--xp-gold)" }}>
            {xpState.totalXP.toLocaleString()}
          </div>
          <div style={statLabelStyle}>Total XP</div>
          <div style={subTextStyle}>
            Avg {Math.round(avgDailyXP)} XP/day
          </div>
        </StatCard>

        {/* Streak */}
        <StatCard>
          <div style={statValueStyle}>
            {xpState.streak}
            <span style={{ fontSize: "1rem", marginLeft: "0.25rem" }}>🔥</span>
          </div>
          <div style={statLabelStyle}>Day Streak</div>
          <div style={subTextStyle}>
            Longest: {Math.max(longestStreak, xpState.streak)} days
          </div>
        </StatCard>

        {/* Mastery */}
        <StatCard>
          <div style={statValueStyle}>
            {stats.mastered}
            <span
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                fontWeight: 400,
              }}
            >
              {" "}
              / {stats.total}
            </span>
          </div>
          <div style={statLabelStyle}>Topics Mastered</div>
          <div style={subTextStyle}>
            {stats.inProgress} in progress
          </div>
        </StatCard>
      </div>

      {/* XP Pace Indicator */}
      {completion.daysRemaining > 0 && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem 1.25rem",
            background: "var(--surface)",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
          }}
        >
          At your current pace of{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            {Math.round(avgDailyXP)} XP/day
          </strong>
          , you'll complete the course by{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            {completion.estimatedDate ? formatDate(completion.estimatedDate) : "—"}
          </strong>
          .
          {AP_EXAM_DATE > new Date() && apPace > avgDailyXP && (
            <>
              {" "}
              Increase to{" "}
              <strong style={{ color: "var(--accent)" }}>
                {apPace} XP/day
              </strong>{" "}
              to finish by{" "}
              <strong style={{ color: "var(--accent)" }}>
                May 8th (AP Exam)
              </strong>
              .
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

function StatCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        borderRadius: "0.75rem",
        padding: "1.25rem",
      }}
    >
      {children}
    </div>
  );
}

function ProgressRing({
  percent,
  size,
}: {
  percent: number;
  size: number;
}) {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--border)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--success)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

const statValueStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "var(--text-primary)",
  lineHeight: 1.2,
};

const statLabelStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.75rem",
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginTop: "0.125rem",
};

const subTextStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.75rem",
  color: "var(--text-muted)",
  marginTop: "0.5rem",
};
