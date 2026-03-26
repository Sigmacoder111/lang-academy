import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { loadMockExamResults, predictTrendScore } from "../engine/mock-exam";

export default function MockExamScoreChart() {
  const results = useMemo(() => loadMockExamResults(), []);
  const trendScore = useMemo(() => predictTrendScore(results), [results]);

  if (results.length === 0) {
    return (
      <div style={{
        background: "var(--surface)",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <h3 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 0.75rem 0",
        }}>
          AP Mock Exam Scores
        </h3>
        <p style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.8125rem",
          color: "var(--text-muted)",
          margin: 0,
          textAlign: "center",
          padding: "2rem 0",
        }}>
          No mock exams taken yet. Take your first practice exam to start tracking your predicted AP score.
        </p>
      </div>
    );
  }

  const chartData = results.map(r => ({
    name: `#${r.examNumber}`,
    date: r.date,
    score: r.predictedAPScore,
    composite: r.compositeScore,
    listening: r.sectionScores.find(s => s.section === "listening")?.percentage ?? 0,
    reading: r.sectionScores.find(s => s.section === "reading")?.percentage ?? 0,
    writing: r.sectionScores.find(s => s.section === "writing")?.percentage ?? 0,
    speaking: r.sectionScores.find(s => s.section === "speaking")?.percentage ?? 0,
  }));

  const latestResult = results[results.length - 1];
  const firstResult = results[0];
  const improvement = latestResult.predictedAPScore - firstResult.predictedAPScore;

  return (
    <div style={{
      background: "var(--surface)",
      borderRadius: "0.75rem",
      padding: "1.5rem",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <h3 style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "1rem",
        fontWeight: 600,
        color: "var(--text-primary)",
        margin: "0 0 0.25rem 0",
      }}>
        AP Mock Exam Scores
      </h3>

      <div style={{
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        marginBottom: "1rem",
      }}>
        <ScoreStat
          label="Latest Score"
          value={String(latestResult.predictedAPScore)}
          color={apScoreColor(latestResult.predictedAPScore)}
        />
        <ScoreStat
          label="Exams Taken"
          value={String(results.length)}
          color="var(--text-primary)"
        />
        {results.length >= 2 && (
          <ScoreStat
            label="Improvement"
            value={`${improvement >= 0 ? "+" : ""}${improvement}`}
            color={improvement >= 0 ? "#27ae60" : "#e74c3c"}
          />
        )}
        {trendScore !== null && (
          <ScoreStat
            label="Projected (May 8)"
            value={String(trendScore)}
            color="var(--accent)"
          />
        )}
      </div>

      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tick={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, fill: "var(--text-muted)" }}
              stroke="var(--border)"
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, fill: "var(--text-muted)" }}
              stroke="var(--border)"
            />
            <Tooltip
              contentStyle={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "0.75rem",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.375rem",
              }}
              formatter={(value, name) => {
                if (name === "score") return [`AP Score: ${value}`, ""];
                return [String(value), String(name)];
              }}
              labelFormatter={(label) => {
                const item = chartData.find(d => d.name === label);
                return item ? `Exam ${label} (${item.date})` : label;
              }}
            />
            <ReferenceLine y={3} stroke="var(--text-muted)" strokeDasharray="5 5" label="" />
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--accent, #c76d32)"
              strokeWidth={2.5}
              dot={{ r: 5, fill: "var(--accent, #c76d32)", stroke: "var(--surface)", strokeWidth: 2 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Section breakdown for latest exam */}
      {latestResult.sectionScores.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <div style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
          }}>
            Latest Exam Section Scores
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {latestResult.sectionScores.map(section => (
              <div key={section.section} style={{
                flex: "1 1 0",
                minWidth: "6rem",
                background: "var(--bg-primary)",
                borderRadius: "0.5rem",
                padding: "0.5rem 0.75rem",
                textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.6875rem",
                  color: "var(--text-muted)",
                  marginBottom: "0.125rem",
                }}>
                  {section.section.charAt(0).toUpperCase() + section.section.slice(1)}
                </div>
                <div style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: section.percentage >= 70 ? "#27ae60" : section.percentage >= 50 ? "#f39c12" : "#e74c3c",
                }}>
                  {section.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {trendScore !== null && results.length >= 2 && (
        <p style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.8125rem",
          color: "var(--text-muted)",
          margin: "1rem 0 0 0",
          textAlign: "center",
          lineHeight: 1.5,
        }}>
          You scored {latestResult.predictedAPScore} on {latestResult.date}
          {results.length >= 3 && `, up from ${firstResult.predictedAPScore} on ${firstResult.date}`}
          — trending toward a <strong style={{ color: "var(--accent)" }}>{trendScore}</strong> by exam day.
        </p>
      )}
    </div>
  );
}

function ScoreStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "0.6875rem",
        color: "var(--text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "1.25rem",
        fontWeight: 700,
        color,
      }}>
        {value}
      </div>
    </div>
  );
}

function apScoreColor(score: number): string {
  if (score >= 5) return "#27ae60";
  if (score >= 4) return "#2ecc71";
  if (score >= 3) return "#f39c12";
  if (score >= 2) return "#e67e22";
  return "#e74c3c";
}
