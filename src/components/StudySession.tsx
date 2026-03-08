import { useState } from "react";
import type { GraphNode } from "../types/graph";
import type { UserProgress } from "../types/state";
import { updateMastery, getStats, getNextItem } from "../engine/mastery";
import { makeDefaultNodeState } from "../types/state";
import { saveProgress, loadProgress } from "../engine/storage";
import { GRAPH } from "../data/graph";
import StudyCard from "./StudyCard";

function countDueItems(progress: UserProgress): number {
  const now = Date.now();
  return Object.values(progress).filter((s) => s.nextReview < now).length;
}

export default function StudySession() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [currentNode, setCurrentNode] = useState<GraphNode | null>(() =>
    getNextItem(GRAPH, loadProgress())
  );
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [dueCount, setDueCount] = useState(() => countDueItems(loadProgress()));

  function handleGrade(correct: boolean) {
    if (!currentNode) return;

    const existing = progress[currentNode.id];
    const nodeState = existing ?? makeDefaultNodeState();

    const updated = updateMastery(nodeState, correct);
    const newProgress = { ...progress, [currentNode.id]: updated };

    setProgress(newProgress);
    saveProgress(newProgress);
    setSessionCount((c) => c + 1);
    if (correct) setSessionCorrect((c) => c + 1);
    setDueCount(countDueItems(newProgress));

    setCurrentNode(getNextItem(GRAPH, newProgress));
  }

  const stats = getStats(GRAPH, progress);

  if (!currentNode) {
    return (
      <div
        style={{
          maxWidth: "32rem",
          margin: "0 auto",
          padding: "2rem 1rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
            borderRadius: "1rem",
            padding: "3rem 2rem",
          }}
        >
          <div
            style={{
              fontFamily: "'Noto Serif SC', serif",
              fontSize: "3rem",
              marginBottom: "1rem",
            }}
          >
            {"\u2714"}
          </div>
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            You're all caught up
          </h2>
          <p
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginBottom: "1.5rem",
            }}
          >
            No cards are due for review right now. Take a break and come back
            later.
          </p>

          {sessionCount > 0 && (
            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "1.5rem",
                marginTop: "0.5rem",
              }}
            >
              <p
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.75rem",
                }}
              >
                Session stats
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "2rem",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {sessionCount}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                    }}
                  >
                    reviewed
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      color: "var(--success)",
                    }}
                  >
                    {sessionCount > 0
                      ? Math.round((sessionCorrect / sessionCount) * 100)
                      : 0}
                    %
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                    }}
                  >
                    accuracy
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {stats.mastered}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                    }}
                  >
                    mastered
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "32rem",
        margin: "0 auto",
        padding: "0 1rem",
      }}
    >
      {/* Session meta */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "13px",
          color: "var(--text-muted)",
        }}
      >
        <span>
          Card {sessionCount + 1} of session
        </span>
        <span>Reviews due: {dueCount}</span>
      </div>

      <StudyCard
        key={currentNode.id + "-" + sessionCount}
        node={currentNode}
        nodeState={progress[currentNode.id]}
        onGrade={handleGrade}
      />
    </div>
  );
}
