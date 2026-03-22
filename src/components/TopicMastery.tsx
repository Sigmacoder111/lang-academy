import { useState, useMemo } from "react";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import { getHSKLayers } from "../engine/analytics";
import { needsReview } from "../engine/hierarchical-srs";

interface Props {
  graph: GraphNode[];
  progress: UserProgress;
}

type ItemTab = "needs_review" | "in_progress" | "mastered" | "all";

export default function TopicMastery({ graph, progress }: Props) {
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<ItemTab>("needs_review");
  const [searchQuery, setSearchQuery] = useState("");

  const layers = useMemo(() => getHSKLayers(graph), [graph]);
  const now = Date.now();

  const toggleLevel = (levelId: string) => {
    setExpandedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(levelId)) {
        next.delete(levelId);
      } else {
        next.add(levelId);
      }
      return next;
    });
  };

  const categorizeNodes = (nodes: GraphNode[]) => {
    const needsReviewNodes: (GraphNode & { overdueMs: number })[] = [];
    const inProgressNodes: (GraphNode & { mastery: number })[] = [];
    const masteredNodes: GraphNode[] = [];
    const allNodes = [...nodes];

    for (const node of nodes) {
      const state = progress[node.id];
      if (!state) continue;

      if (state.mastery >= 0.8) {
        if (needsReview(node.id, progress, now)) {
          needsReviewNodes.push({
            ...node,
            overdueMs: now - state.nextReview,
          });
        } else {
          masteredNodes.push(node);
        }
      } else if (state.mastery > 0) {
        if (needsReview(node.id, progress, now)) {
          needsReviewNodes.push({
            ...node,
            overdueMs: now - state.nextReview,
          });
        } else {
          inProgressNodes.push({
            ...node,
            mastery: state.mastery,
          });
        }
      }
    }

    needsReviewNodes.sort((a, b) => b.overdueMs - a.overdueMs);
    inProgressNodes.sort((a, b) => a.mastery - b.mastery);

    return { needsReviewNodes, inProgressNodes, masteredNodes, allNodes };
  };

  const filterBySearch = (nodes: GraphNode[]) => {
    if (!searchQuery.trim()) return nodes;
    const q = searchQuery.toLowerCase().trim();
    return nodes.filter(
      (n) =>
        n.hanzi.includes(q) ||
        n.pinyin.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q)
    );
  };

  const tabs: { id: ItemTab; label: string }[] = [
    { id: "needs_review", label: "Needs Review" },
    { id: "in_progress", label: "In Progress" },
    { id: "mastered", label: "Mastered" },
    { id: "all", label: "All" },
  ];

  return (
    <section>
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Topic Mastery</h3>

        {/* Search */}
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search by hanzi, pinyin, or meaning..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        {/* HSK Level Summaries */}
        {layers.map((layer) => {
          const isExpanded = expandedLevels.has(layer.id);
          const masteredInLayer = layer.nodes.filter(
            (n) => progress[n.id] && progress[n.id].mastery >= 0.8
          ).length;
          const inProgressCount = layer.nodes.filter(
            (n) => progress[n.id] && progress[n.id].mastery > 0 && progress[n.id].mastery < 0.8
          ).length;
          const masteryPercent = Math.round(
            (masteredInLayer / layer.nodes.length) * 100
          );

          const { needsReviewNodes, inProgressNodes, masteredNodes, allNodes } =
            categorizeNodes(layer.nodes);

          const filteredNeedsReview = filterBySearch(needsReviewNodes);
          const filteredInProgress = filterBySearch(inProgressNodes);
          const filteredMastered = filterBySearch(masteredNodes);
          const filteredAll = filterBySearch(allNodes);

          const activeItems =
            activeTab === "needs_review" ? filteredNeedsReview :
            activeTab === "in_progress" ? filteredInProgress :
            activeTab === "mastered" ? filteredMastered :
            filteredAll;

          return (
            <div key={layer.id} style={{ marginBottom: "0.5rem" }}>
              {/* Level header */}
              <button
                onClick={() => toggleLevel(layer.id)}
                style={levelHeaderStyle}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
                  <span style={{
                    ...chevronStyle,
                    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                  }}>
                    ▶
                  </span>
                  <span style={levelLabelStyle}>
                    {layer.label}
                  </span>
                  <span style={levelStatsStyle}>
                    — {masteryPercent}% mastered ({masteredInLayer}/{layer.nodes.length})
                  </span>
                  {inProgressCount > 0 && (
                    <span style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "0.6875rem",
                      color: "var(--accent)",
                    }}>
                      · {inProgressCount} in progress
                    </span>
                  )}
                  {needsReviewNodes.length > 0 && (
                    <span style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "0.6875rem",
                      color: "var(--xp-gold)",
                    }}>
                      · {needsReviewNodes.length} to review
                    </span>
                  )}
                </div>
                <ProgressBar percent={masteryPercent} />
              </button>

              {/* Expanded content with tabs */}
              {isExpanded && (
                <div style={{ padding: "0.75rem 0" }}>
                  {/* Tab bar */}
                  <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                    {tabs.map((tab) => {
                      const count =
                        tab.id === "needs_review" ? filteredNeedsReview.length :
                        tab.id === "in_progress" ? filteredInProgress.length :
                        tab.id === "mastered" ? filteredMastered.length :
                        filteredAll.length;

                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          style={{
                            fontFamily: "Georgia, 'Times New Roman', serif",
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.625rem",
                            borderRadius: "1rem",
                            border: activeTab === tab.id
                              ? "1px solid var(--accent)"
                              : "1px solid var(--border)",
                            background: activeTab === tab.id
                              ? "rgba(193,95,60,0.1)"
                              : "transparent",
                            color: activeTab === tab.id
                              ? "var(--accent)"
                              : "var(--text-muted)",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {tab.label} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {/* Content based on active tab */}
                  {activeItems.length === 0 && (
                    <div style={emptyStateStyle}>
                      {activeTab === "needs_review" ? "No items need review right now" :
                       activeTab === "in_progress" ? "No items in progress" :
                       activeTab === "mastered" ? "No items mastered yet" :
                       searchQuery ? "No matching items" : "No items"}
                    </div>
                  )}

                  {/* Mastered tab shows compact grid */}
                  {activeTab === "mastered" && filteredMastered.length > 0 && (
                    <div style={masteredGridStyle}>
                      {filteredMastered.map((node) => (
                        <div
                          key={node.id}
                          title={`${node.pinyin} — ${node.meaning}`}
                          style={masteredCellStyle}
                        >
                          {node.hanzi}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Other tabs show detailed rows */}
                  {activeTab !== "mastered" && activeItems.length > 0 && (
                    <div>
                      {activeItems.map((node) => (
                        <TopicRow
                          key={node.id}
                          node={node}
                          progress={progress}
                          now={now}
                        />
                      ))}
                    </div>
                  )}
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
  progress,
  now,
}: {
  node: GraphNode;
  progress: UserProgress;
  now: number;
}) {
  const nodeProgress = progress[node.id];
  const mastery = nodeProgress?.mastery ?? 0;
  const masteryPercent = Math.round(mastery * 100);
  const isOverdue = nodeProgress ? nodeProgress.nextReview < now : false;

  let statusIcon: string;
  let statusColor: string;
  if (mastery >= 0.8) {
    if (isOverdue) {
      statusIcon = "⚠";
      statusColor = "var(--xp-gold)";
    } else {
      statusIcon = "✓";
      statusColor = "var(--success)";
    }
  } else if (mastery > 0) {
    statusIcon = "◐";
    statusColor = "var(--accent)";
  } else {
    statusIcon = "○";
    statusColor = "var(--text-muted)";
  }

  return (
    <div style={topicRowStyle}>
      <span style={{ fontSize: "0.875rem", color: statusColor, width: "1.25rem", textAlign: "center", flexShrink: 0 }}>
        {statusIcon}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem", minWidth: "4rem" }}>
        <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "1rem", color: "var(--text-primary)" }}>
          {node.hanzi}
        </span>
        <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          {node.pinyin}
        </span>
      </div>
      <span style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "0.75rem",
        color: "var(--text-muted)",
        flex: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {node.meaning}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
        <div style={miniBarBg}>
          <div style={{
            height: "100%",
            width: `${masteryPercent}%`,
            background: mastery >= 0.8 ? "var(--success)" : mastery > 0 ? "var(--accent)" : "transparent",
            borderRadius: "2px",
            transition: "width 0.3s ease",
          }} />
        </div>
        <span style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          minWidth: "2.5rem",
          textAlign: "right",
        }}>
          {masteryPercent}%
        </span>
      </div>
    </div>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div style={{
      width: "5rem",
      height: "6px",
      background: "var(--border)",
      borderRadius: "3px",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      <div style={{
        height: "100%",
        width: `${percent}%`,
        background: percent >= 80 ? "var(--success)" : percent > 0 ? "var(--accent)" : "transparent",
        borderRadius: "3px",
        transition: "width 0.3s ease",
      }} />
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  borderRadius: "0.75rem",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  padding: "1.5rem",
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  margin: "0 0 1rem",
};

const searchInputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.875rem",
  padding: "0.5rem 0.75rem",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  background: "var(--bg-primary)",
  color: "var(--text-primary)",
  outline: "none",
  transition: "border-color 0.15s ease",
  boxSizing: "border-box",
};

const levelHeaderStyle: React.CSSProperties = {
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
};

const chevronStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.75rem",
  color: "var(--text-muted)",
  transition: "transform 0.2s ease",
  display: "inline-block",
};

const levelLabelStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.9375rem",
  fontWeight: 600,
  color: "var(--text-primary)",
};

const levelStatsStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.75rem",
  color: "var(--text-muted)",
};

const emptyStateStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "1.5rem 0",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.875rem",
  color: "var(--text-muted)",
};

const masteredGridStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.375rem",
};

const masteredCellStyle: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
  fontSize: "0.9375rem",
  color: "var(--success)",
  background: "rgba(74, 140, 111, 0.06)",
  borderRadius: "0.375rem",
  padding: "0.25rem 0.5rem",
  cursor: "default",
};

const topicRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.5rem 0.5rem",
  borderRadius: "0.375rem",
  transition: "background 0.1s ease",
};

const miniBarBg: React.CSSProperties = {
  width: "5rem",
  height: "4px",
  background: "var(--border)",
  borderRadius: "2px",
  overflow: "hidden",
};
