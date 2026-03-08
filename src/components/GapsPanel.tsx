import { useMemo } from "react";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import { findFoundationalGaps, getGraphLayers } from "../engine/analytics";

interface Props {
  graph: GraphNode[];
  progress: UserProgress;
}

export default function GapsPanel({ graph, progress }: Props) {
  const gaps = useMemo(
    () => findFoundationalGaps(graph, progress),
    [graph, progress]
  );

  const layers = useMemo(() => getGraphLayers(graph), [graph]);
  const layerLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const l of layers) {
      for (const n of l.nodes) {
        map.set(n.id, l.label);
      }
    }
    return map;
  }, [layers]);

  // Group gaps by layer
  const groupedGaps = useMemo(() => {
    const groups = new Map<string, typeof gaps>();
    for (const gap of gaps) {
      const layer = layerLabelMap.get(gap.node.id) || "Other";
      if (!groups.has(layer)) groups.set(layer, []);
      groups.get(layer)!.push(gap);
    }
    return [...groups.entries()];
  }, [gaps, layerLabelMap]);

  if (gaps.length === 0) {
    return (
      <section>
        <div
          style={{
            background: "var(--surface)",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <h3 style={sectionTitleStyle}>Foundational Gaps</h3>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              marginTop: "1rem",
            }}
          >
            No foundational gaps detected. Keep going!
          </div>
        </div>
      </section>
    );
  }

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
        <h3 style={{ ...sectionTitleStyle, marginBottom: "0.5rem" }}>
          Foundational Gaps
        </h3>
        <p
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
            margin: "0 0 1rem 0",
            lineHeight: 1.5,
          }}
        >
          These topics from earlier levels are blocking progress on higher topics.
          The system is remediating these gaps alongside your course work.
        </p>

        {groupedGaps.map(([layerLabel, layerGaps]) => (
          <div key={layerLabel} style={{ marginBottom: "1rem" }}>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: "0.5rem",
              }}
            >
              {layerLabel}
            </div>
            {layerGaps.map((gap) => (
              <GapRow key={gap.node.id} gap={gap} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function GapRow({ gap }: { gap: ReturnType<typeof findFoundationalGaps>[number] }) {
  const masteryPercent = Math.round(gap.mastery * 100);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.5rem 0.5rem",
        borderRadius: "0.375rem",
        marginBottom: "2px",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem", minWidth: "6rem" }}>
        <span
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: "1rem",
            color: "var(--text-primary)",
          }}
        >
          {gap.node.hanzi}
        </span>
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          {gap.node.meaning}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ flex: 1, maxWidth: "10rem" }}>
        <div
          style={{
            height: "4px",
            background: "var(--border)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${masteryPercent}%`,
              background: "var(--accent)",
              borderRadius: "2px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
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

      <span
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.6875rem",
          color: "var(--accent)",
          background: "rgba(193,95,60,0.1)",
          padding: "0.125rem 0.5rem",
          borderRadius: "1rem",
          whiteSpace: "nowrap",
        }}
      >
        Blocking {gap.blockingCount} topic{gap.blockingCount !== 1 ? "s" : ""}
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
