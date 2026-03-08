import { useState, useMemo } from "react";
import type { ActivityEntry, TaskFilter } from "../types/analytics";
import type { TaskType } from "../types/tasks";
import { loadActivityLog, daysAgo } from "../engine/analytics";
import { getTaskTypeInfo } from "../engine/tasks";

export default function ActivityLog() {
  const [filter, setFilter] = useState<TaskFilter>("all");
  const activityLog = useMemo(() => loadActivityLog(), []);

  const filtered = useMemo(() => {
    if (filter === "all") return activityLog;
    return activityLog.filter((e) => e.taskType === filter);
  }, [activityLog, filter]);

  const grouped = useMemo(() => {
    const groups: { date: string; entries: ActivityEntry[]; totalXP: number }[] = [];
    const dateMap = new Map<string, ActivityEntry[]>();

    for (const entry of filtered) {
      const existing = dateMap.get(entry.date);
      if (existing) {
        existing.push(entry);
      } else {
        dateMap.set(entry.date, [entry]);
      }
    }

    for (const [date, entries] of dateMap) {
      const totalXP = entries.reduce((sum, e) => sum + e.xpEarned, 0);
      groups.push({ date, entries, totalXP });
    }

    groups.sort((a, b) => b.date.localeCompare(a.date));
    return groups.slice(0, 7);
  }, [filtered]);

  const filterOptions: { value: TaskFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "lesson", label: "Lessons" },
    { value: "review", label: "Reviews" },
    { value: "quiz", label: "Quizzes" },
    { value: "multistep", label: "Multisteps" },
  ];

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
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <h3 style={sectionTitleStyle}>Activity Log</h3>
          <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.625rem",
                  borderRadius: "1rem",
                  border:
                    filter === opt.value
                      ? "1px solid var(--accent)"
                      : "1px solid var(--border)",
                  background:
                    filter === opt.value
                      ? "rgba(193,95,60,0.1)"
                      : "transparent",
                  color:
                    filter === opt.value
                      ? "var(--accent)"
                      : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {grouped.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "2rem 0",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.875rem",
              color: "var(--text-muted)",
            }}
          >
            No activity yet. Complete some tasks to see your history here.
          </div>
        )}

        {grouped.map((group) => (
          <div key={group.date} style={{ marginBottom: "1rem" }}>
            {/* Day header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
                borderBottom: "1px solid var(--border)",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                {daysAgo(group.date)}
                <span
                  style={{
                    fontWeight: 400,
                    color: "var(--text-muted)",
                    marginLeft: "0.5rem",
                    fontSize: "0.75rem",
                  }}
                >
                  {group.date}
                </span>
              </span>
              <span
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--xp-gold)",
                }}
              >
                +{group.totalXP} XP
              </span>
            </div>

            {/* Entries */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {group.entries.map((entry) => (
                <ActivityRow key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivityRow({ entry }: { entry: ActivityEntry }) {
  const typeInfo = getTaskTypeInfo(entry.taskType as TaskType);
  const scoreText =
    entry.questionsAnswered > 0
      ? `${entry.correctCount}/${entry.questionsAnswered}`
      : "—";
  const timeText = formatTime(entry.timeSpentSeconds);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.5rem 0.625rem",
        background: "var(--surface)",
        borderRadius: "0.375rem",
        transition: "background 0.1s ease",
      }}
    >
      <span style={{ fontSize: "1rem", flexShrink: 0 }}>{typeInfo.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem" }}>
          <span
            style={{
              fontFamily: "'Noto Serif SC', serif",
              fontSize: "0.9375rem",
              color: "var(--text-primary)",
            }}
          >
            {entry.topicHanzi}
          </span>
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {entry.topicMeaning}
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          flexShrink: 0,
        }}
      >
        <span style={metaStyle}>{scoreText}</span>
        <span style={metaStyle}>{timeText}</span>
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--xp-gold)",
            minWidth: "3rem",
            textAlign: "right",
          }}
        >
          +{entry.xpEarned}
        </span>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  margin: 0,
};

const metaStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.75rem",
  color: "var(--text-muted)",
};
