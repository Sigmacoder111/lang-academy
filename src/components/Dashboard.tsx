import type { Task } from "../types/tasks";
import type { XPState } from "../types/tasks";
import type { UserProgress } from "../types/state";
import type { GraphNode } from "../types/graph";
import { selectTasks, getTaskTypeInfo } from "../engine/tasks";
import { getStats } from "../engine/srs";
import XPBar from "./XPBar";

interface DashboardProps {
  graph: GraphNode[];
  progress: UserProgress;
  xpState: XPState;
  onSelectTask: (task: Task) => void;
}

export default function Dashboard({
  graph,
  progress,
  xpState,
  onSelectTask,
}: DashboardProps) {
  const tasks = selectTasks(graph, progress, xpState);
  const stats = getStats(graph, progress);
  const completionPercent = Math.round((stats.mastered / stats.total) * 100);

  return (
    <div
      style={{
        maxWidth: "48rem",
        margin: "0 auto",
        padding: "0 1rem 3rem",
      }}
    >
      {/* XP Bar */}
      <div style={{ marginBottom: "1.5rem" }}>
        <XPBar
          current={xpState.todayXP}
          goal={xpState.dailyGoal}
          streak={xpState.streak}
          animate
        />
      </div>

      {/* Course progress */}
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "13px",
          color: "var(--text-muted)",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        {completionPercent}% complete · {stats.mastered} of {stats.total} mastered
      </div>

      {/* Task list heading */}
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "13px",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "1rem",
        }}
      >
        Choose your next task
      </div>

      {/* Task cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onSelectTask(task)} />
        ))}
        {tasks.length === 0 && (
          <div
            style={{
              background: "var(--surface)",
              boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
              borderRadius: "1rem",
              padding: "3rem 2rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✨</div>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "1.125rem",
                color: "var(--text-primary)",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              All caught up!
            </div>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "15px",
                color: "var(--text-muted)",
              }}
            >
              No tasks available right now. Come back later for reviews.
            </div>
          </div>
        )}
      </div>

      {/* Bottom stats */}
      {(xpState.todayXP > 0 || xpState.tasksCompletedToday > 0) && (
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "13px",
            color: "var(--text-muted)",
            textAlign: "center",
            marginTop: "2rem",
            padding: "1rem 0",
            borderTop: "1px solid var(--border)",
          }}
        >
          Today: {xpState.todayXP} XP earned · {xpState.questionsAnsweredToday}{" "}
          questions · {xpState.tasksCompletedToday} tasks completed
        </div>
      )}
    </div>
  );
}

function TaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
}) {
  const info = getTaskTypeInfo(task.type);

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        width: "100%",
        background: "var(--surface)",
        boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
        borderRadius: "1rem",
        padding: "1.25rem 1.5rem",
        border: "none",
        borderLeft: `3px solid ${info.borderColor}`,
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        textAlign: "left",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 0.5rem 2rem rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 0.25rem 1.25rem rgba(0,0,0,0.035)";
      }}
    >
      {/* Icon */}
      <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{info.icon}</div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.25rem",
          }}
        >
          {/* Badge */}
          <span
            style={{
              display: "inline-block",
              borderRadius: "9999px",
              padding: "0.125rem 0.5rem",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              background: info.badgeBg,
              color: "#FFFFFF",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            {info.label}
          </span>
          {task.required && (
            <span
              style={{
                display: "inline-block",
                borderRadius: "9999px",
                padding: "0.125rem 0.5rem",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                background: "var(--xp-gold)",
                color: "#FFFFFF",
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              Required
            </span>
          )}
        </div>

        {/* Topic name */}
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1rem",
            color: "var(--text-primary)",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          <span style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {task.topic.hanzi}
          </span>{" "}
          — {task.topic.meaning}
        </div>
      </div>

      {/* Right: XP + time */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.25rem",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--xp-gold)",
          }}
        >
          +{task.xpReward} XP
        </span>
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          ~{task.estimatedMinutes} min
        </span>
      </div>
    </button>
  );
}
