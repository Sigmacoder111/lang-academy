import type { GraphNode } from "../types/graph";
import type { DiagnosticReport as DiagnosticReportType } from "../engine/diagnostic";

interface DiagnosticReportProps {
  report: DiagnosticReportType;
  graph: GraphNode[];
  onStartStudying: (recommendedXP: number) => void;
}

export default function DiagnosticReport({
  report,
  graph,
  onStartStudying,
}: DiagnosticReportProps) {
  const graphMap = new Map(graph.map((n) => [n.id, n]));

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ textAlign: "center" as const, marginBottom: "2rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>&#127891;</div>
        <h1 style={titleStyle}>Diagnostic Results</h1>
        <p style={subtitleStyle}>
          {report.totalQuestions} questions &middot; {formatDuration(report.totalTimeSeconds)}
        </p>
      </div>

      {/* Placement Card */}
      <div style={{ ...cardStyle, textAlign: "center" as const, marginBottom: "1rem" }}>
        <p style={{ ...labelStyle, marginBottom: "0.25rem" }}>Your Level</p>
        <div style={placementStyle}>HSK {report.placementLevel}</div>
        <p style={{ ...mutedStyle, fontSize: "14px", marginTop: "0.5rem" }}>
          {report.nodesAutoMastered} topics mastered &middot; {report.nodesToStudy} topics to study
        </p>
      </div>

      {/* Mastery by Level */}
      <div style={{ ...cardStyle, marginBottom: "1rem" }}>
        <h3 style={sectionHeadingStyle}>Mastery by HSK Level</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[1, 2, 3, 4, 5, 6].map((level) => {
            const data = report.masteryByLevel[level];
            if (!data || data.total === 0) return null;
            const masteredPct = Math.round((data.mastered / data.total) * 100);
            const conditionalPct = Math.round((data.conditional / data.total) * 100);
            const isPlacement = level === report.placementLevel;

            return (
              <div key={level}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ ...textStyle, fontWeight: isPlacement ? 700 : 500, fontSize: "14px" }}>
                    HSK {level}
                    {isPlacement && (
                      <span style={{ color: "var(--accent)", marginLeft: "0.5rem", fontSize: "12px" }}>
                        &#9654; Your level
                      </span>
                    )}
                  </span>
                  <span style={{ ...mutedStyle, fontSize: "13px" }}>
                    {masteredPct}% mastered
                    {conditionalPct > 0 && ` · ${conditionalPct}% conditional`}
                  </span>
                </div>
                <div style={barBgStyle}>
                  <div
                    style={{
                      height: "100%",
                      width: `${masteredPct + conditionalPct}%`,
                      borderRadius: "4px",
                      background:
                        conditionalPct > 0
                          ? `linear-gradient(to right, var(--success) ${(masteredPct / (masteredPct + conditionalPct)) * 100}%, var(--xp-gold) ${(masteredPct / (masteredPct + conditionalPct)) * 100}%)`
                          : "var(--success)",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem" }}>
          <LegendDot color="var(--success)" label="Mastered" />
          <LegendDot color="var(--xp-gold)" label="Conditional" />
          <LegendDot color="var(--border)" label="Not started" />
        </div>
      </div>

      {/* Completion Estimates */}
      <div style={{ ...cardStyle, marginBottom: "1rem" }}>
        <h3 style={sectionHeadingStyle}>Estimated Completion</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {report.estimatedCompletionDates.map(({ dailyXP, date, beforeTarget }) => (
            <div
              key={dailyXP}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                borderRadius: "0.625rem",
                background: beforeTarget ? "rgba(74, 140, 111, 0.08)" : "var(--bg-primary)",
                border: dailyXP === report.recommendedDailyXP ? "1.5px solid var(--accent)" : "1px solid var(--border)",
              }}
            >
              <div>
                <span style={{ ...textStyle, fontWeight: 600, fontSize: "15px" }}>
                  {dailyXP} XP/day
                </span>
                {dailyXP === report.recommendedDailyXP && (
                  <span style={recommendedBadge}>Recommended</span>
                )}
              </div>
              <div style={{ textAlign: "right" as const }}>
                <span style={{ ...textStyle, fontSize: "14px" }}>
                  {formatDateNice(date)}
                </span>
                {beforeTarget && (
                  <span style={{ ...mutedStyle, display: "block", fontSize: "12px", color: "var(--success)" }}>
                    Before AP exam
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...mutedStyle, fontSize: "13px", marginTop: "0.75rem" }}>
          AP Chinese exam: May 8, 2026. Recommended pace:{" "}
          <strong style={{ color: "var(--text-primary)" }}>{report.recommendedDailyXP} XP/day</strong>
        </p>
      </div>

      {/* Foundational Gaps */}
      {report.foundationalGaps.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: "1rem" }}>
          <h3 style={sectionHeadingStyle}>
            Foundational Gaps
            <span style={{ ...mutedStyle, fontSize: "13px", fontWeight: 400, marginLeft: "0.5rem" }}>
              ({report.foundationalGaps.length} gaps found)
            </span>
          </h3>
          <p style={{ ...mutedStyle, fontSize: "14px", marginBottom: "0.75rem" }}>
            These lower-level topics need remediation. They will be interleaved with your course-level content.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {report.foundationalGaps.slice(0, 10).map(({ nodeId, blocksCount }) => {
              const node = graphMap.get(nodeId);
              if (!node) return null;
              return (
                <div key={nodeId} style={gapItemStyle}>
                  <div>
                    <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1rem" }}>
                      {node.hanzi}
                    </span>
                    <span style={{ ...mutedStyle, marginLeft: "0.5rem", fontSize: "14px" }}>
                      {node.pinyin} — {node.meaning}
                    </span>
                  </div>
                  <span style={{ ...mutedStyle, fontSize: "12px" }}>
                    Blocks {blocksCount} topic{blocksCount !== 1 ? "s" : ""}
                  </span>
                </div>
              );
            })}
            {report.foundationalGaps.length > 10 && (
              <p style={{ ...mutedStyle, fontSize: "13px", textAlign: "center" as const }}>
                +{report.foundationalGaps.length - 10} more gaps
              </p>
            )}
          </div>
        </div>
      )}

      {/* Topics Assessed */}
      <div style={{ ...cardStyle, marginBottom: "1.5rem" }}>
        <h3 style={sectionHeadingStyle}>Topics Assessed</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {report.topicsAssessed.map(({ nodeId, correct, fast }) => {
            const node = graphMap.get(nodeId);
            if (!node) return null;

            let bg = "rgba(193, 95, 60, 0.12)";
            let color = "var(--error)";
            let title = "Incorrect";
            if (correct && fast) {
              bg = "rgba(74, 140, 111, 0.12)";
              color = "var(--success)";
              title = "Correct & fast";
            } else if (correct) {
              bg = "rgba(212, 160, 48, 0.15)";
              color = "var(--xp-gold)";
              title = "Correct but slow";
            }

            return (
              <span
                key={nodeId}
                title={`${node.meaning} — ${title}`}
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.625rem",
                  borderRadius: "9999px",
                  background: bg,
                  color,
                  fontFamily: "'Noto Serif SC', serif",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {node.hanzi}
              </span>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem" }}>
          <LegendDot color="var(--success)" label="Correct & fast" />
          <LegendDot color="var(--xp-gold)" label="Correct, slow" />
          <LegendDot color="var(--error)" label="Incorrect" />
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center" as const }}>
        <button
          onClick={() => onStartStudying(report.recommendedDailyXP)}
          style={ctaBtnStyle}
        >
          Start Studying at {report.recommendedDailyXP} XP/day
        </button>
        <p style={{ ...mutedStyle, fontSize: "13px", marginTop: "0.75rem" }}>
          Your progress has been saved. Foundational gaps will be mixed into your study sessions.
        </p>
      </div>
    </div>
  );
}

// --- Small components ---

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
      <span
        style={{
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: color,
        }}
      />
      <span style={{ fontFamily: "Georgia, serif", fontSize: "12px", color: "var(--text-muted)" }}>
        {label}
      </span>
    </div>
  );
}

// --- Helpers ---

function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function formatDateNice(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// --- Styles ---

const containerStyle: React.CSSProperties = {
  maxWidth: "44rem",
  margin: "0 auto",
  padding: "0 1rem 3rem",
};

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  borderRadius: "1rem",
  padding: "1.5rem",
  boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
};

const titleStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.75rem",
  fontWeight: 700,
  color: "var(--text-primary)",
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  color: "var(--text-muted)",
  marginTop: "0.25rem",
};

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1rem",
  fontWeight: 700,
  color: "var(--text-primary)",
  marginBottom: "0.75rem",
  marginTop: 0,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: 0,
};

const textStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  color: "var(--text-primary)",
};

const mutedStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  color: "var(--text-muted)",
};

const placementStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "3rem",
  fontWeight: 700,
  color: "var(--accent)",
  lineHeight: 1.2,
};

const barBgStyle: React.CSSProperties = {
  height: "8px",
  borderRadius: "4px",
  background: "var(--border)",
  overflow: "hidden",
};

const recommendedBadge: React.CSSProperties = {
  display: "inline-block",
  marginLeft: "0.5rem",
  padding: "0.125rem 0.5rem",
  borderRadius: "9999px",
  fontSize: "11px",
  fontWeight: 600,
  background: "var(--accent)",
  color: "#fff",
  fontFamily: "Georgia, serif",
  textTransform: "uppercase",
  letterSpacing: "0.03em",
  verticalAlign: "middle",
};

const gapItemStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.625rem 1rem",
  borderRadius: "0.625rem",
  background: "var(--bg-primary)",
  border: "1px solid var(--border)",
};

const ctaBtnStyle: React.CSSProperties = {
  padding: "1rem 2.5rem",
  background: "var(--accent)",
  color: "#fff",
  border: "none",
  borderRadius: "0.75rem",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.125rem",
  fontWeight: 700,
  cursor: "pointer",
  transition: "background 0.15s ease",
  boxShadow: "0 0.25rem 1rem rgba(193, 95, 60, 0.3)",
};
