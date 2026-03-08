import { useState, useMemo } from "react";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { SortOption } from "../types/analytics";
import { getGraphLayers, getNodeMasteryState, formatDate } from "../engine/analytics";

interface Props {
  graph: GraphNode[];
  progress: UserProgress;
}

export default function TopicMastery({ graph, progress }: Props) {
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set(["radical"]));
  const [sortBy, setSortBy] = useState<SortOption>("level");

  const layers = useMemo(() => getGraphLayers(graph), [graph]);

  const toggleLayer = (layerId: string) => {
    setExpandedLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layerId)) {
        next.delete(layerId);
      } else {
        next.add(layerId);
      }
      return next;
    });
  };

  const sortedNodes = (nodes: GraphNode[]) => {
    const sorted = [...nodes];
    switch (sortBy) {
      case "mastery":
        sorted.sort((a, b) => {
          const ma = progress[a.id]?.mastery ?? 0;
          const mb = progress[b.id]?.mastery ?? 0;
          return ma - mb;
        });
        break;
      case "last_reviewed":
        sorted.sort((a, b) => {
          const la = progress[a.id]?.lastReviewedAt ?? 0;
          const lb = progress[b.id]?.lastReviewedAt ?? 0;
          return la - lb;
        });
        break;
      case "level":
      default:
        break;
    }
    return sorted;
  };

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
          <h3 style={sectionTitleStyle}>Topic Mastery</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Sort:
            </span>
            {(["level", "mastery", "last_reviewed"] as SortOption[]).map((opt) => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.75rem",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "0.25rem",
                  border: sortBy === opt ? "1px solid var(--accent)" : "1px solid var(--border)",
                  background: sortBy === opt ? "rgba(193,95,60,0.1)" : "transparent",
                  color: sortBy === opt ? "var(--accent)" : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {opt === "level" ? "Level" : opt === "mastery" ? "Weakest" : "Oldest"}
              </button>
            ))}
          </div>
        </div>

        {layers.map((layer) => {
          const isExpanded = expandedLayers.has(layer.id);
          const masteredInLayer = layer.nodes.filter(
            (n) => progress[n.id] && progress[n.id].mastery >= 0.8
          ).length;
          const masteryPercent = Math.round(
            (masteredInLayer / layer.nodes.length) * 100
          );

          return (
            <div key={layer.id} style={{ marginBottom: "0.5rem" }}>
              {/* Layer header */}
              <button
                onClick={() => toggleLayer(layer.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      transition: "transform 0.2s ease",
                      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                      display: "inline-block",
                    }}
                  >
                    ▶
                  </span>
                  <span
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {layer.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    — {masteryPercent}% mastered ({masteredInLayer}/{layer.nodes.length})
                  </span>
                </div>
                <MiniProgressBar percent={masteryPercent} />
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div style={{ padding: "0.5rem 0" }}>
                  {sortedNodes(layer.nodes).map((node) => (
                    <TopicRow
                      key={node.id}
                      node={node}
                      graph={graph}
                      progress={progress}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TopicRow({
  node,
  graph,
  progress,
}: {
  node: GraphNode;
  graph: GraphNode[];
  progress: UserProgress;
}) {
  const state = getNodeMasteryState(node.id, graph, progress);
  const nodeProgress = progress[node.id];
  const mastery = nodeProgress?.mastery ?? 0;
  const masteryPercent = Math.round(mastery * 100);
  const lastReviewed = nodeProgress?.lastReviewedAt
    ? formatDate(new Date(nodeProgress.lastReviewedAt))
    : "—";

  let statusIcon: string;
  let statusColor: string;
  switch (state) {
    case "mastered":
      statusIcon = "✓";
      statusColor = "var(--success)";
      break;
    case "needs_review":
      statusIcon = "⚠";
      statusColor = "var(--xp-gold)";
      break;
    case "in_progress":
      statusIcon = "◐";
      statusColor = "var(--accent)";
      break;
    default:
      statusIcon = "○";
      statusColor = "var(--text-muted)";
  }

  // Automaticity: based on interval — longer intervals suggest faster recall
  const interval = nodeProgress?.interval ?? 0;
  let automaticityIcon: string;
  if (interval === 0) {
    automaticityIcon = "—";
  } else if (interval >= 7 * 24 * 60 * 60) {
    automaticityIcon = "⚡";
  } else {
    automaticityIcon = "🐢";
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.5rem 0.5rem",
        borderRadius: "0.375rem",
        transition: "background 0.1s ease",
      }}
    >
      <span
        style={{
          fontSize: "0.875rem",
          color: statusColor,
          width: "1.25rem",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {statusIcon}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem", minWidth: "4rem" }}>
        <span
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: "1rem",
            color: "var(--text-primary)",
          }}
        >
          {node.hanzi}
        </span>
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          {node.meaning}
        </span>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div
          style={{
            flex: 1,
            height: "4px",
            background: "var(--border)",
            borderRadius: "2px",
            overflow: "hidden",
            maxWidth: "10rem",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${masteryPercent}%`,
              background:
                mastery >= 0.8
                  ? "var(--success)"
                  : mastery > 0
                    ? "var(--accent)"
                    : "transparent",
              borderRadius: "2px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            minWidth: "2.5rem",
            textAlign: "right",
          }}
        >
          {masteryPercent}%
        </span>
      </div>
      <span style={{ fontSize: "0.75rem", width: "1.25rem", textAlign: "center" }}>
        {automaticityIcon}
      </span>
      <span
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.6875rem",
          color: "var(--text-muted)",
          minWidth: "5rem",
          textAlign: "right",
        }}
      >
        {lastReviewed}
      </span>
    </div>
  );
}

function MiniProgressBar({ percent }: { percent: number }) {
  return (
    <div
      style={{
        width: "4rem",
        height: "4px",
        background: "var(--border)",
        borderRadius: "2px",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${percent}%`,
          background: percent >= 80 ? "var(--success)" : "var(--accent)",
          borderRadius: "2px",
          transition: "width 0.3s ease",
        }}
      />
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
