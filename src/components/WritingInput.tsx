import { useState, useEffect, useCallback, useRef } from "react";

interface WritingInputProps {
  onSubmit: (text: string) => void;
  onBack: () => void;
  expectedCharCount: { min: number; max: number };
  timeLimitMinutes: number;
  promptType: "story_narration" | "email_response";
  prompt: string;
  promptChinese: string;
  title: string;
  titleChinese: string;
}

export default function WritingInput({
  onSubmit,
  onBack,
  expectedCharCount,
  timeLimitMinutes,
  promptType,
  prompt,
  promptChinese,
  title,
  titleChinese,
}: WritingInputProps) {
  const [text, setText] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(timeLimitMinutes * 60);
  const [started, setStarted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = text.replace(/\s/g, "").length;
  const isInRange = charCount >= expectedCharCount.min && charCount <= expectedCharCount.max;
  const isOverMin = charCount >= expectedCharCount.min;

  useEffect(() => {
    if (!started || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0 && text.trim().length > 0) {
      onSubmit(text);
    }
  }, [timeRemaining, text, onSubmit]);

  const handleStart = useCallback(() => {
    setStarted(true);
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, []);

  const handleSubmit = useCallback(() => {
    if (text.trim().length === 0) return;
    onSubmit(text);
  }, [text, onSubmit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const timeWarning = timeRemaining < 120 && timeRemaining > 0;
  const timeCritical = timeRemaining < 60 && timeRemaining > 0;

  if (!started) {
    return (
      <div style={containerStyle}>
        <button onClick={onBack} style={backButtonStyle}>
          ← Back
        </button>
        <div style={cardStyle}>
          <div style={headerBadgeRow}>
            <span style={badgeStyle}>
              {promptType === "story_narration" ? "Story Narration" : "Email Response"}
            </span>
          </div>

          <h2 style={titleStyle}>
            <span style={titleChineseStyle}>{titleChinese}</span>
            {" "}{title}
          </h2>

          {promptType === "story_narration" ? (
            <div style={scenesContainerStyle}>
              <div style={sectionLabelStyle}>Scenes to narrate:</div>
              <div style={promptTextStyle}>{prompt}</div>
              {promptChinese && (
                <div style={{ ...promptTextStyle, color: "var(--text-muted)", fontSize: "14px", marginTop: "0.5rem" }}>
                  {promptChinese}
                </div>
              )}
            </div>
          ) : (
            <div style={emailContainerStyle}>
              <div style={sectionLabelStyle}>Email to respond to:</div>
              <div style={emailBodyStyle}>
                {promptChinese.split("\n").map((line, i) => (
                  <div key={i} style={{ minHeight: line.trim() === "" ? "0.75rem" : undefined }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={infoRowStyle}>
            <div style={infoItemStyle}>
              <span style={infoLabelStyle}>Expected length</span>
              <span style={infoValueStyle}>{expectedCharCount.min}–{expectedCharCount.max} characters</span>
            </div>
            <div style={infoItemStyle}>
              <span style={infoLabelStyle}>Time limit</span>
              <span style={infoValueStyle}>{timeLimitMinutes} minutes</span>
            </div>
          </div>

          <button onClick={handleStart} style={startButtonStyle}>
            Start Writing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <button onClick={onBack} style={backButtonStyle}>
        ← Back
      </button>
      <div style={cardStyle}>
        {/* Header */}
        <div style={writingHeaderStyle}>
          <span style={badgeStyle}>
            {promptType === "story_narration" ? "Story Narration" : "Email Response"}
          </span>
          <span
            style={{
              ...timerStyle,
              color: timeCritical
                ? "var(--error)"
                : timeWarning
                ? "var(--xp-gold)"
                : "var(--text-muted)",
            }}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>

        {/* Compact prompt reminder */}
        <div style={promptReminderStyle}>
          <span style={titleChineseStyle}>{titleChinese}</span>
          {" — "}
          <span style={{ color: "var(--text-muted)" }}>{title}</span>
        </div>

        {/* Text area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            promptType === "story_narration"
              ? "用中文写一个故事... (Write your story in Chinese...)"
              : "用中文写回复邮件... (Write your email reply in Chinese...)"
          }
          style={textareaStyle}
          dir="auto"
          lang="zh"
        />

        {/* Character counter */}
        <div style={counterRowStyle}>
          <div
            style={{
              ...counterStyle,
              color: isInRange
                ? "var(--success)"
                : isOverMin
                ? "var(--xp-gold)"
                : "var(--text-muted)",
            }}
          >
            {charCount} characters
            <span style={counterTargetStyle}>
              {" "}(target: {expectedCharCount.min}–{expectedCharCount.max})
            </span>
          </div>
          {/* Progress towards min */}
          <div style={charProgressBgStyle}>
            <div
              style={{
                ...charProgressFillStyle,
                width: `${Math.min(100, (charCount / expectedCharCount.min) * 100)}%`,
                background: isInRange
                  ? "var(--success)"
                  : charCount > expectedCharCount.max
                  ? "var(--error)"
                  : "var(--accent)",
              }}
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={text.trim().length === 0}
          style={{
            ...submitButtonStyle,
            opacity: text.trim().length === 0 ? 0.5 : 1,
            cursor: text.trim().length === 0 ? "not-allowed" : "pointer",
          }}
        >
          Submit for Grading
        </button>

        {!isOverMin && charCount > 0 && (
          <div style={hintStyle}>
            Write at least {expectedCharCount.min - charCount} more characters to reach the minimum.
          </div>
        )}
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  maxWidth: "48rem",
  margin: "0 auto",
  padding: "0 1rem",
};

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  boxShadow: "0 0.5rem 2rem rgba(0,0,0,0.06)",
  borderRadius: "1rem",
  padding: "2rem",
};

const backButtonStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  color: "var(--text-muted)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "0.5rem 0",
  marginBottom: "1rem",
};

const headerBadgeRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  borderRadius: "9999px",
  padding: "0.125rem 0.625rem",
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "#FFFFFF",
  fontFamily: "Georgia, 'Times New Roman', serif",
  background: "var(--writing-green, #4A8C6F)",
};

const titleStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.375rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  marginBottom: "1.25rem",
  lineHeight: 1.4,
};

const titleChineseStyle: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
};

const scenesContainerStyle: React.CSSProperties = {
  background: "rgba(74, 140, 111, 0.04)",
  border: "1px solid rgba(74, 140, 111, 0.15)",
  borderRadius: "0.75rem",
  padding: "1rem 1.25rem",
  marginBottom: "1.25rem",
};

const emailContainerStyle: React.CSSProperties = {
  background: "rgba(74, 140, 111, 0.04)",
  border: "1px solid rgba(74, 140, 111, 0.15)",
  borderRadius: "0.75rem",
  padding: "1rem 1.25rem",
  marginBottom: "1.25rem",
};

const sectionLabelStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--text-muted)",
  marginBottom: "0.5rem",
};

const promptTextStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  color: "var(--text-primary)",
  lineHeight: 1.7,
};

const emailBodyStyle: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
  fontSize: "15px",
  color: "var(--text-primary)",
  lineHeight: 1.8,
};

const infoRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "2rem",
  marginBottom: "1.5rem",
};

const infoItemStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.125rem",
};

const infoLabelStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--text-muted)",
};

const infoValueStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  fontWeight: 600,
  color: "var(--text-primary)",
};

const startButtonStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  fontWeight: 600,
  background: "var(--writing-green, #4A8C6F)",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.75rem 1.5rem",
  cursor: "pointer",
  width: "100%",
  transition: "background 0.15s ease",
};

const writingHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0.75rem",
};

const timerStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.125rem",
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
};

const promptReminderStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  color: "var(--text-primary)",
  marginBottom: "1rem",
  paddingBottom: "0.75rem",
  borderBottom: "1px solid var(--border)",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "14rem",
  fontFamily: "'Noto Serif SC', Georgia, serif",
  fontSize: "1rem",
  lineHeight: 2,
  color: "var(--text-primary)",
  background: "rgba(0,0,0,0.02)",
  border: "1.5px solid var(--border)",
  borderRadius: "0.75rem",
  padding: "1rem",
  resize: "vertical",
  outline: "none",
  transition: "border-color 0.2s ease",
};

const counterRowStyle: React.CSSProperties = {
  marginTop: "0.75rem",
  marginBottom: "1rem",
};

const counterStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  fontWeight: 600,
  marginBottom: "0.375rem",
};

const counterTargetStyle: React.CSSProperties = {
  fontWeight: 400,
  fontSize: "13px",
};

const charProgressBgStyle: React.CSSProperties = {
  width: "100%",
  height: "4px",
  borderRadius: "2px",
  background: "rgba(0,0,0,0.06)",
  overflow: "hidden",
};

const charProgressFillStyle: React.CSSProperties = {
  height: "100%",
  borderRadius: "2px",
  transition: "width 0.3s ease, background 0.3s ease",
};

const submitButtonStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  fontWeight: 600,
  background: "var(--writing-green, #4A8C6F)",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.75rem 1.5rem",
  width: "100%",
  transition: "background 0.15s ease, opacity 0.15s ease",
};

const hintStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "13px",
  color: "var(--text-muted)",
  textAlign: "center",
  marginTop: "0.75rem",
  fontStyle: "italic",
};
