import { useState, useMemo, useCallback } from "react";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { NodeMasteryState } from "../types/analytics";
import { getNodeMasteryState, getGraphLayers, formatDate } from "../engine/analytics";

interface Props {
  graph: GraphNode[];
  progress: UserProgress;
}

interface TooltipData {
  node: GraphNode;
  state: NodeMasteryState;
  mastery: number;
  lastReviewed: string | null;
  x: number;
  y: number;
}

function getCellColor(state: NodeMasteryState, mastery: number): string {
  switch (state) {
    case "locked":
      return "rgba(0,0,0,0.04)";
    case "unlocked":
      return "rgba(193,95,60,0.15)";
    case "in_progress": {
      const opacity = 0.3 + mastery * 0.7;
      return `rgba(193,95,60,${opacity})`;
    }
    case "mastered":
      return "var(--success)";
    case "needs_review":
      return "var(--xp-gold)";
  }
}

function getStateLabel(state: NodeMasteryState): string {
  switch (state) {
    case "locked": return "Locked";
    case "unlocked": return "Ready to learn";
    case "in_progress": return "In progress";
    case "mastered": return "Mastered ✓";
    case "needs_review": return "Needs review ⚠";
  }
}

export default function KnowledgeMap({ graph, progress }: Props) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const layers = useMemo(() => getGraphLayers(graph), [graph]);

  const nodeStates = useMemo(() => {
    const map = new Map<string, NodeMasteryState>();
    for (const node of graph) {
      map.set(node.id, getNodeMasteryState(node.id, graph, progress));
    }
    return map;
  }, [graph, progress]);

  const handleMouseEnter = useCallback(
    (node: GraphNode, e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const state = nodeStates.get(node.id) || "locked";
      const nodeProgress = progress[node.id];
      setTooltip({
        node,
        state,
        mastery: nodeProgress?.mastery ?? 0,
        lastReviewed: nodeProgress?.lastReviewedAt
          ? formatDate(new Date(nodeProgress.lastReviewedAt))
          : null,
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    },
    [nodeStates, progress]
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleClick = useCallback((nodeId: string) => {
    setSelectedNode((prev) => (prev === nodeId ? null : nodeId));
  }, []);

  const selectedNodeData = useMemo(() => {
    if (!selectedNode) return null;
    const node = graph.find((n) => n.id === selectedNode);
    if (!node) return null;
    const prereqNodes = graph.filter((n) => node.prereqs.includes(n.id));
    const dependentNodes = graph.filter((n) => n.prereqs.includes(selectedNode));
    return { node, prereqNodes, dependentNodes };
  }, [selectedNode, graph]);

  return (
    <section>
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "0.75rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          padding: "1.5rem",
          overflowX: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={sectionTitleStyle}>Knowledge Frontier</h3>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Legend color="rgba(0,0,0,0.04)" label="Locked" />
            <Legend color="rgba(193,95,60,0.15)" label="Unlocked" />
            <Legend color="var(--accent)" label="In Progress" />
            <Legend color="var(--success)" label="Mastered" />
            <Legend color="var(--xp-gold)" label="Review" />
          </div>
        </div>

        {layers.map((layer) => (
          <div key={layer.id} style={{ marginBottom: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  width: "5.5rem",
                  flexShrink: 0,
                  textAlign: "right",
                }}
              >
                {layer.label}
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  flex: 1,
                }}
              >
                {layer.nodes.map((node) => {
                  const state = nodeStates.get(node.id) || "locked";
                  const mastery = progress[node.id]?.mastery ?? 0;
                  const isSelected = selectedNode === node.id;

                  return (
                    <div
                      key={node.id}
                      onMouseEnter={(e) => handleMouseEnter(node, e)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleClick(node.id)}
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "0.375rem",
                        background: getCellColor(state, mastery),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: state !== "locked" ? "pointer" : "default",
                        transition: "transform 0.15s ease, box-shadow 0.15s ease",
                        transform: isSelected ? "scale(1.15)" : "scale(1)",
                        boxShadow: isSelected
                          ? "0 0 0 2px var(--accent)"
                          : "none",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Noto Serif SC', serif",
                          fontSize: state === "locked" ? "0.625rem" : "0.875rem",
                          color:
                            state === "mastered"
                              ? "#fff"
                              : state === "needs_review"
                                ? "#fff"
                                : state === "locked"
                                  ? "var(--text-muted)"
                                  : "var(--text-primary)",
                          opacity: state === "locked" ? 0.3 : 1,
                        }}
                      >
                        {node.hanzi}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y - 8,
            transform: "translate(-50%, -100%)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            zIndex: 100,
            pointerEvents: "none",
            minWidth: "10rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span
              style={{
                fontFamily: "'Noto Serif SC', serif",
                fontSize: "1.25rem",
                color: "var(--text-primary)",
              }}
            >
              {tooltip.node.hanzi}
            </span>
            <span
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "0.875rem",
                color: "var(--text-muted)",
              }}
            >
              {tooltip.node.pinyin}
            </span>
          </div>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.8125rem",
              color: "var(--text-primary)",
              marginBottom: "0.375rem",
            }}
          >
            {tooltip.node.meaning}
          </div>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
            }}
          >
            <div>Mastery: {Math.round(tooltip.mastery * 100)}%</div>
            <div>Status: {getStateLabel(tooltip.state)}</div>
            {tooltip.lastReviewed && <div>Last reviewed: {tooltip.lastReviewed}</div>}
          </div>
        </div>
      )}

      {/* Expanded node detail */}
      {selectedNodeData && (
        <div
          style={{
            marginTop: "1rem",
            background: "var(--surface)",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            padding: "1.25rem",
            animation: "fadeIn 0.2s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1.5rem", color: "var(--text-primary)" }}>
              {selectedNodeData.node.hanzi}
            </span>
            <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1rem", color: "var(--text-muted)" }}>
              {selectedNodeData.node.pinyin} — {selectedNodeData.node.meaning}
            </span>
          </div>

          {selectedNodeData.prereqNodes.length > 0 && (
            <div style={{ marginBottom: "0.5rem" }}>
              <span style={detailLabelStyle}>Prerequisites: </span>
              {selectedNodeData.prereqNodes.map((p, i) => (
                <span key={p.id}>
                  <span
                    style={{
                      fontFamily: "'Noto Serif SC', serif",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick(p.id)}
                  >
                    {p.hanzi}
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    {" "}({p.meaning})
                  </span>
                  {i < selectedNodeData.prereqNodes.length - 1 && (
                    <span style={{ color: "var(--text-muted)" }}>, </span>
                  )}
                </span>
              ))}
            </div>
          )}

          {selectedNodeData.dependentNodes.length > 0 && (
            <div>
              <span style={detailLabelStyle}>Unlocks: </span>
              {selectedNodeData.dependentNodes.map((d, i) => (
                <span key={d.id}>
                  <span
                    style={{
                      fontFamily: "'Noto Serif SC', serif",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick(d.id)}
                  >
                    {d.hanzi}
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    {" "}({d.meaning})
                  </span>
                  {i < selectedNodeData.dependentNodes.length - 1 && (
                    <span style={{ color: "var(--text-muted)" }}>, </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
      <div
        style={{
          width: "0.75rem",
          height: "0.75rem",
          borderRadius: "2px",
          background: color,
        }}
      />
      <span
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.6875rem",
          color: "var(--text-muted)",
        }}
      >
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

const detailLabelStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.8125rem",
  color: "var(--text-muted)",
  fontWeight: 600,
};
