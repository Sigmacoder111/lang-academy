import { useMemo } from "react";
import type { XPState } from "../types/tasks";
import { loadXPHistory } from "../engine/analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  xpState: XPState;
}

const CHART_DAYS = 28;

export default function XPChart({ xpState }: Props) {
  const history = useMemo(() => loadXPHistory(), []);

  const chartData = useMemo(() => {
    const today = new Date();
    const days: { date: string; label: string; xp: number; isToday: boolean }[] = [];

    for (let i = CHART_DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayNum = d.getDate();
      const month = d.toLocaleDateString("en-US", { month: "short" });
      const label = i === 0 ? "Today" : dayNum === 1 || i === CHART_DAYS - 1 ? `${month} ${dayNum}` : `${dayNum}`;
      const entry = history.find((h) => h.date === dateStr);
      days.push({
        date: dateStr,
        label,
        xp: entry?.xp ?? (i === 0 ? xpState.todayXP : 0),
        isToday: i === 0,
      });
    }
    return days;
  }, [history, xpState.todayXP]);

  const weeklyAvg = useMemo(() => {
    const last7 = chartData.slice(-7);
    const total = last7.reduce((sum, d) => sum + d.xp, 0);
    return Math.round(total / 7);
  }, [chartData]);

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={sectionTitleStyle}>Weekly XP</h3>
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Avg: <strong style={{ color: "var(--xp-gold)" }}>{weeklyAvg} XP/day</strong>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fontFamily: "Georgia, 'Times New Roman', serif", fill: "var(--text-muted)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fontFamily: "Georgia, 'Times New Roman', serif", fill: "var(--text-muted)" }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "0.8125rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
              labelStyle={{ color: "var(--text-primary)", fontWeight: 600 }}
              formatter={(value: unknown) => [`${value} XP`, "XP"]}
              labelFormatter={(label: unknown) => String(label)}
            />
            <ReferenceLine
              y={xpState.dailyGoal}
              stroke="var(--text-muted)"
              strokeDasharray="6 3"
              strokeOpacity={0.5}
              label={{
                value: `Goal: ${xpState.dailyGoal}`,
                position: "insideTopRight",
                style: { fontSize: 10, fontFamily: "Georgia, 'Times New Roman', serif", fill: "var(--text-muted)" },
              }}
            />
            <Bar dataKey="xp" radius={[2, 2, 0, 0]} maxBarSize={20}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.xp >= xpState.dailyGoal
                      ? "var(--success)"
                      : entry.xp > 0
                        ? "var(--accent)"
                        : "var(--border)"
                  }
                  opacity={entry.isToday ? 1 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", justifyContent: "center" }}>
          <LegendItem color="var(--success)" label="Met goal" />
          <LegendItem color="var(--accent)" label="Below goal" />
          <LegendItem color="var(--text-muted)" label={`Daily goal (${xpState.dailyGoal} XP)`} dashed />
        </div>
      </div>
    </section>
  );
}

function LegendItem({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
      <div
        style={{
          width: "0.625rem",
          height: "0.625rem",
          borderRadius: "2px",
          background: dashed ? "transparent" : color,
          borderTop: dashed ? `2px dashed ${color}` : undefined,
        }}
      />
      <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "0.6875rem", color: "var(--text-muted)" }}>
        {label}
      </span>
    </div>
  );
}

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  margin: 0,
};
