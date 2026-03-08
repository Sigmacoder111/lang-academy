import { useState } from "react";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import type { XPState } from "../types/tasks";
import type { ProgressSubTab } from "../types/analytics";
import CourseOverview from "./CourseOverview";
import KnowledgeMap from "./KnowledgeMap";
import XPChart from "./XPChart";
import TopicMastery from "./TopicMastery";
import GapsPanel from "./GapsPanel";
import ActivityLog from "./ActivityLog";

interface Props {
  graph: GraphNode[];
  progress: UserProgress;
  xpState: XPState;
}

const subTabs: { id: ProgressSubTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "map", label: "Knowledge Map" },
  { id: "topics", label: "Topics" },
  { id: "activity", label: "Activity" },
];

export default function ProgressView({ graph, progress, xpState }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<ProgressSubTab>("overview");

  return (
    <div
      style={{
        maxWidth: "64rem",
        margin: "0 auto",
        padding: "0 1rem",
      }}
    >
      {/* Sub-navigation */}
      <nav
        style={{
          display: "flex",
          gap: "0.25rem",
          marginBottom: "1.5rem",
          borderBottom: "1px solid var(--border)",
          overflowX: "auto",
        }}
      >
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.8125rem",
              fontWeight: activeSubTab === tab.id ? 600 : 400,
              color:
                activeSubTab === tab.id
                  ? "var(--accent)"
                  : "var(--text-muted)",
              background: "transparent",
              border: "none",
              borderBottom:
                activeSubTab === tab.id
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
              padding: "0.625rem 1rem",
              cursor: "pointer",
              transition: "color 0.15s ease, border-color 0.15s ease",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {activeSubTab === "overview" && (
          <>
            <CourseOverview
              graph={graph}
              progress={progress}
              xpState={xpState}
            />
            <XPChart xpState={xpState} />
            <GapsPanel graph={graph} progress={progress} />
          </>
        )}

        {activeSubTab === "map" && (
          <KnowledgeMap graph={graph} progress={progress} />
        )}

        {activeSubTab === "topics" && (
          <>
            <TopicMastery graph={graph} progress={progress} />
            <GapsPanel graph={graph} progress={progress} />
          </>
        )}

        {activeSubTab === "activity" && <ActivityLog />}
      </div>
    </div>
  );
}
