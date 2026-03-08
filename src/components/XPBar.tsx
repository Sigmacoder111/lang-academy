interface XPBarProps {
  current: number;
  goal: number;
  streak: number;
  variant?: "horizontal" | "compact";
  animate?: boolean;
}

export default function XPBar({
  current,
  goal,
  streak,
  variant = "horizontal",
  animate = false,
}: XPBarProps) {
  const percent = Math.min((current / goal) * 100, 100);
  const transitionStyle = animate ? "width 0.6s cubic-bezier(0.33, 1, 0.68, 1)" : "width 0.3s ease";

  if (variant === "compact") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            flex: 1,
            height: "6px",
            borderRadius: "3px",
            background: "rgba(0,0,0,0.06)",
            overflow: "hidden",
            minWidth: "80px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${percent}%`,
              background: "var(--accent)",
              borderRadius: "3px",
              transition: transitionStyle,
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "13px",
            color: "var(--text-muted)",
            whiteSpace: "nowrap",
          }}
        >
          {current}/{goal} XP
        </span>
        {streak > 0 && (
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "13px",
              color: "var(--xp-gold)",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {streak} 🔥
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
        borderRadius: "1rem",
        padding: "1.25rem 1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "13px",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Daily Progress
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "15px",
              color: "var(--text-primary)",
              fontWeight: 600,
            }}
          >
            {current} / {goal} XP
          </span>
          {streak > 0 && (
            <span
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "15px",
                color: "var(--xp-gold)",
                fontWeight: 600,
              }}
            >
              {streak} 🔥
            </span>
          )}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "8px",
          borderRadius: "4px",
          background: "rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            background: "var(--accent)",
            borderRadius: "4px",
            transition: transitionStyle,
          }}
        />
      </div>
      {percent >= 100 && (
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "13px",
            color: "var(--success)",
            marginTop: "0.5rem",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          Daily goal reached! ✨
        </div>
      )}
    </div>
  );
}
