import { useState, useEffect, useCallback, useRef } from "react";
import type { WritingPrompt } from "../types/writing";

interface WritingInputProps {
  prompt: WritingPrompt;
  onSubmit: (text: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

export default function WritingInput({
  prompt,
  onSubmit,
  onBack,
  isLoading,
}: WritingInputProps) {
  const [text, setText] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(prompt.timeLimitMinutes * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [showPromptChinese, setShowPromptChinese] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = text.length;
  const { min, max } = prompt.expectedCharacters;

  useEffect(() => {
    if (!timerActive || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  useEffect(() => {
    if (text.length > 0 && !timerActive) {
      setTimerActive(true);
    }
  }, [text, timerActive]);

  const handleSubmit = useCallback(() => {
    if (text.trim().length === 0 || isLoading) return;
    onSubmit(text.trim());
  }, [text, isLoading, onSubmit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getCharCountColor = () => {
    if (charCount >= min && charCount <= max) return "var(--success)";
    if (charCount > max) return "var(--error)";
    if (charCount >= min * 0.7) return "var(--xp-gold)";
    return "var(--text-muted)";
  };

  const getTimerColor = () => {
    if (timeRemaining <= 60) return "var(--error)";
    if (timeRemaining <= 180) return "var(--xp-gold)";
    return "var(--text-muted)";
  };

  const isStoryNarration = prompt.format === "story_narration";

  return (
    <div
      style={{
        maxWidth: "48rem",
        margin: "0 auto",
        padding: "0 1rem 3rem",
        animation: "fadeIn 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={onBack}
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "14px",
            color: "var(--text-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem 0",
          }}
        >
          &larr; Back
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* Timer */}
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "14px",
              fontWeight: 600,
              color: getTimerColor(),
              background: timeRemaining <= 60 ? "rgba(193, 95, 60, 0.08)" : "transparent",
              borderRadius: "0.5rem",
              padding: "0.25rem 0.75rem",
              transition: "all 0.3s ease",
            }}
          >
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      {/* Task type badge */}
      <div style={{ marginBottom: "1rem" }}>
        <span
          style={{
            display: "inline-block",
            borderRadius: "9999px",
            padding: "0.25rem 0.75rem",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            background: isStoryNarration ? "#6B7FD7" : "var(--success)",
            color: "#FFFFFF",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          {isStoryNarration ? "Story Narration" : "Email Response"}
        </span>
      </div>

      {/* Title */}
      <h2
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "1.375rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 0.25rem 0",
        }}
      >
        {prompt.title}
      </h2>
      <p
        style={{
          fontFamily: "'Noto Serif SC', serif",
          fontSize: "1rem",
          color: "var(--text-muted)",
          margin: "0 0 1.5rem 0",
        }}
      >
        {prompt.titleChinese}
      </p>

      {/* Prompt card */}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: "0.75rem",
          }}
        >
          Prompt
        </div>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "14px",
            color: "var(--text-primary)",
            lineHeight: 1.7,
            whiteSpace: "pre-line",
          }}
        >
          {showPromptChinese ? prompt.promptChinese : prompt.prompt}
        </div>
        <button
          onClick={() => setShowPromptChinese(!showPromptChinese)}
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "12px",
            color: "var(--accent)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            marginTop: "0.75rem",
            padding: 0,
          }}
        >
          {showPromptChinese ? "Show in English" : "显示中文"}
        </button>
      </div>

      {/* Writing area */}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "1rem",
          boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.035)",
          border: "1px solid var(--border)",
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
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Your Response
          </div>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "13px",
              color: getCharCountColor(),
              fontWeight: 600,
            }}
          >
            {charCount} / {min}-{max} characters
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isStoryNarration
              ? "用中文写你的故事..."
              : "用中文写你的回复..."
          }
          disabled={isLoading || timeRemaining === 0}
          style={{
            width: "100%",
            minHeight: "250px",
            fontFamily: "'Noto Serif SC', Georgia, serif",
            fontSize: "16px",
            lineHeight: 2,
            color: "var(--text-primary)",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "vertical",
            padding: 0,
          }}
        />

        {/* Character count bar */}
        <div
          style={{
            height: "4px",
            background: "var(--border)",
            borderRadius: "2px",
            overflow: "hidden",
            marginTop: "0.75rem",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min(100, (charCount / max) * 100)}%`,
              background: getCharCountColor(),
              borderRadius: "2px",
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Time's up notice */}
      {timeRemaining === 0 && (
        <div
          style={{
            background: "rgba(193, 95, 60, 0.08)",
            border: "1px solid rgba(193, 95, 60, 0.2)",
            borderRadius: "0.75rem",
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "13px",
            color: "var(--error)",
          }}
        >
          Time's up! You can still submit your current response.
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={text.trim().length === 0 || isLoading}
        style={{
          width: "100%",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "16px",
          fontWeight: 600,
          color: "#FFFFFF",
          background:
            text.trim().length === 0 || isLoading
              ? "var(--text-muted)"
              : "var(--accent)",
          border: "none",
          borderRadius: "0.75rem",
          padding: "1rem",
          cursor: text.trim().length === 0 || isLoading ? "not-allowed" : "pointer",
          transition: "background 0.2s ease, transform 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
        onMouseEnter={(e) => {
          if (text.trim().length > 0 && !isLoading) {
            e.currentTarget.style.background = "var(--accent-hover)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          if (text.trim().length > 0 && !isLoading) {
            e.currentTarget.style.background = "var(--accent)";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Evaluating with AI...
          </>
        ) : (
          "Submit for Grading"
        )}
      </button>

      {/* Guidelines */}
      <div
        style={{
          marginTop: "1.5rem",
          background: "var(--surface)",
          borderRadius: "0.75rem",
          padding: "1rem 1.25rem",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text-muted)",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          AP Rubric Criteria
        </div>
        <ul
          style={{
            margin: 0,
            paddingLeft: "1.25rem",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "13px",
            color: "var(--text-muted)",
            lineHeight: 1.8,
          }}
        >
          {prompt.rubricCriteria.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div
      style={{
        width: "18px",
        height: "18px",
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#FFFFFF",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}
