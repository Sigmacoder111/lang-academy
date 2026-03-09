import { useMemo } from "react";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { XPState } from "../types/tasks";
import { getThemeStats, estimateThemeReadiness } from "../engine/analytics";
import { AP_THEMES } from "../data/themes";
import { loadAPExamDate } from "../data/themes";

interface Props {
  graph: GraphNode[];
  progress: UserProgress;
  xpState: XPState;
}

export default function ThemeMasteryBreakdown({ graph, progress, xpState }: Props) {
  const themeStats = useMemo(
    () => getThemeStats(graph, progress),
    [graph, progress]
  );

  const examDate = useMemo(() => new Date(loadAPExamDate()), []);
  const daysUntilExam = useMemo(() => {
    const now = new Date();
    return Math.max(0, Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }, [examDate]);

  const readinessEstimates = useMemo(() => {
    const estimates: Record<string, number> = {};
    for (const theme of AP_THEMES) {
      estimates[theme.key] = estimateThemeReadiness(
        theme.key, examDate, graph, progress, xpState
      );
    }
    return estimates;
  }, [graph, progress, xpState, examDate]);

  if (themeStats.length === 0) {
    return null;
  }

  return (
    <section>
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "0.75rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <h3 style={sectionTitleStyle}>Theme Mastery</h3>
          {daysUntilExam > 0 && (
            <span style={subtextStyle}>
              {daysUntilExam} days to AP exam
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {themeStats.map((ts) => {
            const theme = AP_THEMES.find((t) => t.key === ts.key);
            if (!theme) return null;
            const readiness = readinessEstimates[ts.key] ?? 0;

            return (
              <div key={ts.key}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    marginBottom: "0.375rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem" }}>
                    <span
                      style={{
                        fontFamily: "'Noto Serif SC', serif",
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {theme.chinese}
                    </span>
                    <span style={subtextStyle}>{theme.english}</span>
                  </div>
                  <span
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: ts.masteryPercent >= 80 ? "var(--success)" : "var(--text-primary)",
                    }}
                  >
                    {ts.masteryPercent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    height: "0.5rem",
                    background: "var(--border)",
                    borderRadius: "9999px",
                    overflow: "hidden",
                    marginBottom: "0.25rem",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${ts.masteryPercent}%`,
                      background:
                        ts.masteryPercent >= 80
                          ? "var(--success)"
                          : "var(--accent)",
                      borderRadius: "9999px",
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>

                {/* Sub-stats */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={statChipStyle}>
                    {ts.total} total
                  </span>
                  <span style={statChipStyle}>
                    {ts.mastered} mastered
                  </span>
                  <span style={statChipStyle}>
                    {ts.inProgress} in progress
                  </span>
                  <span style={statChipStyle}>
                    {ts.gaps} gaps
                  </span>
                  {daysUntilExam > 0 && (
                    <span
                      style={{
                        ...statChipStyle,
                        color: readiness >= 80 ? "var(--success)" : "var(--accent)",
                      }}
                    >
                      ~{readiness}% ready by exam
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  margin: 0,
};

const subtextStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.6875rem",
  color: "var(--text-muted)",
};

const statChipStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.6875rem",
  color: "var(--text-muted)",
};
