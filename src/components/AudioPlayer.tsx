import { useState, useCallback, useEffect, useRef } from "react";
import { speakChinese, stopSpeaking } from "../utils/speech";

interface AudioPlayerProps {
  text: string;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  maxReplays?: number;
  onPlaybackComplete?: () => void;
  compact?: boolean;
}

export default function AudioPlayer({
  text,
  autoPlay = true,
  autoPlayDelay = 1000,
  maxReplays = 2,
  onPlaybackComplete,
  compact = false,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaysUsed, setReplaysUsed] = useState(0);
  const [speed, setSpeed] = useState<1 | 0.7>(1);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);
  const mountedRef = useRef(true);
  const autoPlayedRef = useRef(false);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stopSpeaking();
    };
  }, []);

  const play = useCallback(
    async (isReplay: boolean = false) => {
      if (isPlaying) return;
      if (isReplay && replaysUsed >= maxReplays) return;

      setIsPlaying(true);
      if (isReplay) {
        setReplaysUsed((r) => r + 1);
      }

      try {
        await speakChinese(text, speed === 0.7 ? 0.7 : 0.9);
      } catch {
        // Speech API may not be available
      }

      if (mountedRef.current) {
        setIsPlaying(false);
        setHasPlayedOnce(true);
        onPlaybackComplete?.();
      }
    },
    [isPlaying, replaysUsed, maxReplays, text, speed, onPlaybackComplete]
  );

  useEffect(() => {
    if (autoPlay && !autoPlayedRef.current) {
      autoPlayedRef.current = true;
      const timer = setTimeout(() => {
        play(false);
      }, autoPlayDelay);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, autoPlayDelay, play]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPulsePhase((p) => (p + 1) % 3);
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const canReplay = replaysUsed < maxReplays && !isPlaying;
  const replaysLeft = maxReplays - replaysUsed;

  if (compact) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button
          onClick={() => play(hasPlayedOnce)}
          disabled={isPlaying || (hasPlayedOnce && !canReplay)}
          style={{
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "50%",
            background: isPlaying ? "var(--listening-blue)" : "var(--listening-blue)",
            border: "none",
            cursor: isPlaying || (hasPlayedOnce && !canReplay) ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            opacity: isPlaying || (hasPlayedOnce && !canReplay) ? 0.6 : 1,
            transition: "opacity 0.2s ease, transform 0.2s ease",
            color: "#FFFFFF",
            transform: isPlaying ? "scale(1.05)" : "scale(1)",
          }}
        >
          {isPlaying ? "🔊" : "▶"}
        </button>
        {hasPlayedOnce && (
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "11px",
              color: "var(--text-muted)",
            }}
          >
            {replaysLeft} replay{replaysLeft !== 1 ? "s" : ""} left
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: "1rem",
        padding: "1.5rem",
        textAlign: "center",
        border: "1px solid var(--border)",
      }}
    >
      {/* Waveform animation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          height: "3rem",
          marginBottom: "1rem",
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: "4px",
              borderRadius: "2px",
              background: isPlaying ? "var(--listening-blue)" : "var(--text-muted)",
              opacity: isPlaying ? 0.6 + 0.4 * Math.sin(((pulsePhase + i) / 5) * Math.PI * 2) : 0.3,
              height: isPlaying
                ? `${16 + 20 * Math.abs(Math.sin(((pulsePhase + i * 0.7) / 5) * Math.PI * 2))}px`
                : "8px",
              transition: "height 0.3s ease, opacity 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Play button */}
      <button
        onClick={() => play(hasPlayedOnce)}
        disabled={isPlaying || (hasPlayedOnce && !canReplay)}
        style={{
          width: "4rem",
          height: "4rem",
          borderRadius: "50%",
          background: isPlaying ? "var(--listening-blue)" : "var(--listening-blue)",
          border: "none",
          cursor: isPlaying || (hasPlayedOnce && !canReplay) ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          margin: "0 auto 1rem",
          opacity: isPlaying || (hasPlayedOnce && !canReplay) ? 0.6 : 1,
          transition: "opacity 0.2s ease, transform 0.2s ease",
          color: "#FFFFFF",
          transform: isPlaying ? "scale(1.08)" : "scale(1)",
          boxShadow: isPlaying
            ? "0 0 0 8px rgba(107, 127, 215, 0.15)"
            : "0 2px 8px rgba(107, 127, 215, 0.2)",
        }}
      >
        {isPlaying ? "🔊" : hasPlayedOnce ? "🔄" : "▶"}
      </button>

      {/* Controls row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        {/* Speed control */}
        <div style={{ display: "flex", gap: "0.25rem" }}>
          <button
            onClick={() => setSpeed(1)}
            disabled={isPlaying}
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "12px",
              fontWeight: speed === 1 ? 700 : 400,
              background: speed === 1 ? "var(--listening-blue)" : "transparent",
              color: speed === 1 ? "#FFFFFF" : "var(--text-muted)",
              border: `1px solid ${speed === 1 ? "var(--listening-blue)" : "var(--border)"}`,
              borderRadius: "0.375rem",
              padding: "0.25rem 0.5rem",
              cursor: isPlaying ? "default" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            1x
          </button>
          <button
            onClick={() => setSpeed(0.7)}
            disabled={isPlaying}
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "12px",
              fontWeight: speed === 0.7 ? 700 : 400,
              background: speed === 0.7 ? "var(--listening-blue)" : "transparent",
              color: speed === 0.7 ? "#FFFFFF" : "var(--text-muted)",
              border: `1px solid ${speed === 0.7 ? "var(--listening-blue)" : "var(--border)"}`,
              borderRadius: "0.375rem",
              padding: "0.25rem 0.5rem",
              cursor: isPlaying ? "default" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            0.7x
          </button>
        </div>

        {/* Replay info */}
        {hasPlayedOnce && (
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            {replaysLeft} replay{replaysLeft !== 1 ? "s" : ""} left
          </span>
        )}
      </div>

      {/* Status text */}
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "13px",
          color: "var(--text-muted)",
          marginTop: "0.75rem",
          fontStyle: "italic",
        }}
      >
        {isPlaying
          ? "Listen carefully..."
          : !hasPlayedOnce
            ? "Audio will play automatically"
            : canReplay
              ? "Click to replay"
              : "No replays remaining"}
      </div>
    </div>
  );
}
