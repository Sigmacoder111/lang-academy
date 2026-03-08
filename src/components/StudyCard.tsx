import { useState } from "react";
import type { GraphNode } from "../types/graph";
import type { NodeState } from "../types/state";

interface StudyCardProps {
  node: GraphNode;
  nodeState: NodeState | undefined;
  onGrade: (correct: boolean) => void;
}

const badgeStyles: Record<string, { bg: string; text: string }> = {
  radical: { bg: "var(--badge-radical-bg)", text: "var(--badge-radical-text)" },
  character: { bg: "var(--badge-character-bg)", text: "var(--badge-character-text)" },
  word: { bg: "var(--badge-word-bg)", text: "var(--badge-word-text)" },
};

export default function StudyCard({ node, nodeState, onGrade }: StudyCardProps) {
  const [revealed, setRevealed] = useState(false);

  const mastery = nodeState?.mastery ?? 0;
  const masteryPercent = Math.round(mastery * 100);
  const badge = badgeStyles[node.type] ?? badgeStyles.radical;
  const progressColor = mastery >= 0.8 ? "var(--success)" : "var(--accent)";

  function handleReveal() {
    setRevealed(true);
  }

  function handleGrade(correct: boolean) {
    setRevealed(false);
    onGrade(correct);
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        boxShadow: "0 0.5rem 2rem rgba(0,0,0,0.06)",
        borderRadius: "1rem",
        padding: "2rem",
        maxWidth: "32rem",
        width: "100%",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Node type badge */}
      <span
        style={{
          display: "inline-block",
          borderRadius: "9999px",
          padding: "0.25rem 0.75rem",
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontWeight: 500,
          background: badge.bg,
          color: badge.text,
          marginBottom: "1.5rem",
        }}
      >
        {node.type}
      </span>

      {/* Hanzi */}
      <div
        style={{
          fontFamily: "'Noto Serif SC', serif",
          fontSize: node.type === "word" ? "4rem" : "5rem",
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.2,
          color: "var(--text-primary)",
          padding: "1rem 0",
        }}
      >
        {node.hanzi}
      </div>

      {/* Back side: pinyin + meaning */}
      <div
        style={{
          textAlign: "center",
          minHeight: "4.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.25rem",
        }}
      >
        {revealed ? (
          <div
            style={{
              animation: "fadeIn 0.3s ease",
            }}
          >
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "1.25rem",
                color: "var(--text-muted)",
                fontWeight: 400,
              }}
            >
              {node.pinyin}
            </div>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "1.125rem",
                color: "var(--text-primary)",
                marginTop: "0.25rem",
              }}
            >
              {node.meaning}
            </div>
          </div>
        ) : (
          <button
            onClick={handleReveal}
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "15px",
              fontWeight: 500,
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: "0.5rem",
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--border)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Reveal
          </button>
        )}
      </div>

      {/* Grade buttons */}
      {revealed && (
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1.5rem",
            justifyContent: "center",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <button
            onClick={() => handleGrade(false)}
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "15px",
              fontWeight: 500,
              background: "var(--accent)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
              transition: "background 0.15s ease",
              flex: 1,
              maxWidth: "12rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--accent)";
            }}
          >
            Missed it
          </button>
          <button
            onClick={() => handleGrade(true)}
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "15px",
              fontWeight: 500,
              background: "var(--success)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
              transition: "background 0.15s ease",
              flex: 1,
              maxWidth: "12rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#3D7A5E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--success)";
            }}
          >
            Got it
          </button>
        </div>
      )}

      {/* Mastery progress bar */}
      <div style={{ marginTop: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.375rem",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            Mastery
          </span>
          <span
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            {masteryPercent}%
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "4px",
            borderRadius: "2px",
            background: "rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${masteryPercent}%`,
              background: progressColor,
              borderRadius: "2px",
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
