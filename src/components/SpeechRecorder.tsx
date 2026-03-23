import { useState, useEffect, useCallback, useRef } from "react";
import {
  isSpeechRecognitionSupported,
  startSpeechRecognition,
} from "../utils/speech";

interface SpeechRecorderProps {
  onTranscript: (transcript: string) => void;
  timeLimitSeconds?: number;
  disabled?: boolean;
  autoStart?: boolean;
}

export default function SpeechRecorder({
  onTranscript,
  timeLimitSeconds,
  disabled = false,
  autoStart = false,
}: SpeechRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isSupported] = useState(isSpeechRecognitionSupported);

  const stopRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (stopRef.current) stopRef.current();
    };
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording || disabled) return;

    setError(null);
    setTranscript("");
    setInterimText("");
    setElapsed(0);
    setIsRecording(true);

    timerRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      setElapsed((prev) => {
        const next = prev + 1;
        if (timeLimitSeconds && next >= timeLimitSeconds) {
          stopRef.current?.();
        }
        return next;
      });
    }, 1000);

    try {
      const { promise, stop } = startSpeechRecognition({
        continuous: true,
        maxAlternatives: 3,
        onInterim: (text) => {
          if (mountedRef.current) setInterimText(text);
        },
      });
      stopRef.current = stop;

      const result = await promise;
      if (mountedRef.current) {
        setTranscript(result);
        setIsRecording(false);
        setHasRecorded(true);
        setInterimText("");
        if (timerRef.current) clearInterval(timerRef.current);
        onTranscript(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(
          err instanceof Error ? err.message : "Speech recognition failed"
        );
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }
  }, [isRecording, disabled, timeLimitSeconds, onTranscript]);

  const stopRecording = useCallback(() => {
    if (stopRef.current) {
      stopRef.current();
      stopRef.current = null;
    }
  }, []);

  const handleRetry = useCallback(() => {
    setTranscript("");
    setInterimText("");
    setHasRecorded(false);
    setElapsed(0);
    setError(null);
  }, []);

  useEffect(() => {
    if (autoStart && !isRecording && !hasRecorded && isSupported && !disabled) {
      const timer = setTimeout(startRecording, 500);
      return () => clearTimeout(timer);
    }
  }, [autoStart, isRecording, hasRecorded, isSupported, disabled, startRecording]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const timeRemaining = timeLimitSeconds ? timeLimitSeconds - elapsed : null;
  const isTimeLow =
    timeRemaining !== null && timeRemaining <= 5 && timeRemaining > 0;

  if (!isSupported) {
    return (
      <div style={unsupportedContainerStyle}>
        <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🎤</div>
        <div style={unsupportedTitleStyle}>
          Speech recognition not available
        </div>
        <div style={unsupportedTextStyle}>
          Speaking practice requires Chrome for best results. You can still use
          self-assessment mode below.
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Timer display */}
      {(isRecording || hasRecorded) && (
        <div style={timerContainerStyle}>
          <span
            style={{
              ...timerStyle,
              color: isTimeLow ? "var(--error)" : "var(--text-muted)",
            }}
          >
            {isRecording && timeLimitSeconds
              ? formatTime(Math.max(0, timeRemaining ?? 0))
              : formatTime(elapsed)}
          </span>
          {isRecording && (
            <span style={recordingIndicatorStyle}>
              <span style={recordingDotStyle} />
              Recording
            </span>
          )}
        </div>
      )}

      {/* Waveform visualization */}
      {isRecording && (
        <div style={waveformContainerStyle}>
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              style={{
                width: "3px",
                borderRadius: "1.5px",
                background: "var(--speaking-brown)",
                opacity: 0.7,
                height: "100%",
                animation: `waveBar ${0.6 + (i % 4) * 0.15}s ease-in-out infinite`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Interim text while recording */}
      {isRecording && interimText && (
        <div style={interimTextStyle}>
          {interimText}
        </div>
      )}

      {/* Mic button */}
      {!hasRecorded && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={disabled}
              style={{
                ...micButtonStyle,
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? "default" : "pointer",
              }}
              aria-label="Start recording"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              style={stopButtonStyle}
              aria-label="Stop recording"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
              >
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Instruction text */}
      {!isRecording && !hasRecorded && !error && (
        <div style={instructionStyle}>
          Tap the microphone to start recording
        </div>
      )}

      {/* Transcript result */}
      {hasRecorded && transcript && (
        <div style={transcriptContainerStyle}>
          <div style={transcriptLabelStyle}>What we heard:</div>
          <div style={transcriptTextStyle}>{transcript}</div>
        </div>
      )}

      {hasRecorded && !transcript && (
        <div style={transcriptContainerStyle}>
          <div style={{ ...transcriptLabelStyle, color: "var(--error)" }}>
            No speech detected
          </div>
          <div style={transcriptTextStyle}>
            We couldn't detect any speech. Please try again.
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={errorStyle}>
          {error === "not-allowed"
            ? "Microphone access was denied. Please allow microphone access in your browser settings."
            : `Error: ${error}`}
        </div>
      )}

      {/* Try again button */}
      {(hasRecorded || error) && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "0.75rem",
          }}
        >
          <button onClick={handleRetry} style={retryButtonStyle}>
            🎤 Try again
          </button>
        </div>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.75rem",
  padding: "1rem 0",
};

const timerContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
};

const timerStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.5rem",
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
};

const recordingIndicatorStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "13px",
  color: "var(--error)",
  display: "flex",
  alignItems: "center",
  gap: "0.375rem",
};

const recordingDotStyle: React.CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "var(--error)",
  animation: "micPulse 1.5s infinite",
};

const waveformContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "3px",
  height: "2.5rem",
  padding: "0 1rem",
};

const interimTextStyle: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
  fontSize: "1.125rem",
  color: "var(--text-muted)",
  textAlign: "center",
  maxWidth: "100%",
  padding: "0 1rem",
  fontStyle: "italic",
};

const micButtonStyle: React.CSSProperties = {
  width: "4rem",
  height: "4rem",
  borderRadius: "50%",
  background: "var(--speaking-brown)",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
  boxShadow: "0 4px 12px rgba(139, 111, 71, 0.3)",
};

const stopButtonStyle: React.CSSProperties = {
  width: "4rem",
  height: "4rem",
  borderRadius: "50%",
  background: "var(--error)",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: "micPulse 1.5s infinite",
};

const instructionStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  color: "var(--text-muted)",
  textAlign: "center",
};

const transcriptContainerStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(139, 111, 71, 0.06)",
  borderRadius: "0.75rem",
  padding: "1rem",
  animation: "fadeIn 0.3s ease",
};

const transcriptLabelStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--speaking-brown)",
  marginBottom: "0.375rem",
};

const transcriptTextStyle: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
  fontSize: "1.25rem",
  color: "var(--text-primary)",
  lineHeight: 1.6,
};

const errorStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  color: "var(--error)",
  textAlign: "center",
  padding: "0.75rem",
  background: "rgba(193, 95, 60, 0.08)",
  borderRadius: "0.5rem",
  width: "100%",
};

const retryButtonStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  fontWeight: 600,
  color: "var(--speaking-brown)",
  background: "transparent",
  border: "1px solid var(--speaking-brown)",
  borderRadius: "0.5rem",
  padding: "0.5rem 1.25rem",
  cursor: "pointer",
  transition: "background 0.15s ease",
};

const unsupportedContainerStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "1.5rem",
  background: "rgba(139, 111, 71, 0.06)",
  borderRadius: "0.75rem",
  border: "1px dashed var(--speaking-brown)",
};

const unsupportedTitleStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  marginBottom: "0.375rem",
};

const unsupportedTextStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  color: "var(--text-muted)",
};
