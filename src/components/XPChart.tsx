import { useMemo } from "react";
import type { XPState } from "../types/tasks";
import { loadXPHistory } from "../engine/analytics";

interface Props {
  xpState: XPState;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
      const dayOfWeek = d.getDay();
      const label = DAY_LABELS[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
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

  const maxXP = useMemo(
    () => Math.max(xpState.dailyGoal * 1.5, ...chartData.map((d) => d.xp), 1),
    [chartData, xpState.dailyGoal]
  );

  const weeklyAvg = useMemo(() => {
    const last7 = chartData.slice(-7);
    const total = last7.reduce((sum, d) => sum + d.xp, 0);
    return Math.round(total / 7);
  }, [chartData]);

  const goalLineY = (1 - xpState.dailyGoal / maxXP) * 100;

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
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
            }}
          >
            Avg: <strong style={{ color: "var(--xp-gold)" }}>{weeklyAvg} XP/day</strong>
          </div>
        </div>

        {/* Chart */}
        <div style={{ position: "relative", paddingLeft: "2.5rem" }}>
          {/* Y-axis labels */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: "1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "2rem",
            }}
          >
            <span style={axisLabelStyle}>{Math.round(maxXP)}</span>
            <span style={axisLabelStyle}>{Math.round(maxXP / 2)}</span>
            <span style={axisLabelStyle}>0</span>
          </div>

          {/* Bars area */}
          <div
            style={{
              position: "relative",
              height: "10rem",
              display: "flex",
              alignItems: "flex-end",
              gap: "2px",
            }}
          >
            {/* Daily goal line */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${goalLineY}%`,
                height: "1px",
                borderTop: "2px dashed var(--text-muted)",
                opacity: 0.3,
                zIndex: 1,
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  right: 0,
                  top: "-0.75rem",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.625rem",
                  color: "var(--text-muted)",
                }}
              >
                Goal
              </span>
            </div>

            {/* Week separator lines */}
            {[7, 14, 21].map((idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: `${(idx / CHART_DAYS) * 100}%`,
                  top: 0,
                  bottom: 0,
                  width: "1px",
                  background: "var(--border)",
                  zIndex: 0,
                }}
              />
            ))}

            {chartData.map((day) => {
              const heightPercent = maxXP > 0 ? (day.xp / maxXP) * 100 : 0;
              const meetsGoal = day.xp >= xpState.dailyGoal;

              return (
                <div
                  key={day.date}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: "100%",
                    position: "relative",
                    zIndex: 2,
                  }}
                  title={`${day.date}: ${day.xp} XP`}
                >
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "1.25rem",
                      height: `${Math.max(heightPercent, day.xp > 0 ? 2 : 0)}%`,
                      background: meetsGoal
                        ? "var(--success)"
                        : day.xp > 0
                          ? "var(--accent)"
                          : "var(--border)",
                      borderRadius: "2px 2px 0 0",
                      transition: "height 0.3s ease",
                      opacity: day.isToday ? 1 : 0.8,
                      boxShadow: day.isToday ? "0 0 0 2px var(--accent)" : "none",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* X-axis labels - show week markers */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "0.375rem",
              paddingLeft: "0",
            }}
          >
            {[0, 7, 14, 21, 27].map((idx) => (
              <span key={idx} style={axisLabelStyle}>
                {idx === 27
                  ? "Today"
                  : `${CHART_DAYS - idx - 1}d ago`}
              </span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "0.75rem",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <div
              style={{
                width: "0.625rem",
                height: "0.625rem",
                borderRadius: "2px",
                background: "var(--success)",
              }}
            />
            <span style={{ ...axisLabelStyle, fontSize: "0.6875rem" }}>Met goal</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <div
              style={{
                width: "0.625rem",
                height: "0.625rem",
                borderRadius: "2px",
                background: "var(--accent)",
              }}
            />
            <span style={{ ...axisLabelStyle, fontSize: "0.6875rem" }}>Below goal</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <div
              style={{
                width: "0.625rem",
                height: "0.625rem",
                borderRadius: "2px",
                borderTop: "2px dashed var(--text-muted)",
              }}
            />
            <span style={{ ...axisLabelStyle, fontSize: "0.6875rem" }}>
              Daily goal ({xpState.dailyGoal} XP)
            </span>
          </div>
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

const axisLabelStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.625rem",
  color: "var(--text-muted)",
};
