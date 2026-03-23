import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import type { GraphNode } from "../types/graph";
import type { TaskResult } from "../types/tasks";
import type {
  VocabularyExercise,
  SentenceExercise,
  DialogueExercise,
  DictationExercise,
  DialogueQuestion,
} from "../data/listening-exercises";
import { selectListeningExercises } from "../data/listening-exercises";
import AudioPlayer from "./AudioPlayer";
import { speakChineseWithVoice, stopSpeaking } from "../utils/speech";

interface ListeningViewProps {
  topic: GraphNode;
  onComplete: (result: TaskResult) => void;
  onBack: () => void;
}

const EXERCISE_COUNT = 5;
const BASE_XP = 6;

export default function ListeningView({
  topic,
  onComplete,
  onBack,
}: ListeningViewProps) {
  const exercises = useMemo(() => selectListeningExercises(EXERCISE_COUNT), []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [done, setDone] = useState(false);
  const [audioFinished, setAudioFinished] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleAudioComplete = useCallback(() => {
    setAudioFinished(true);
    setTimerActive(true);
  }, []);

  const handleExerciseAnswer = useCallback(
    (correct: boolean) => {
      setTotalAnswered((a) => a + 1);
      if (correct) setTotalCorrect((c) => c + 1);
    },
    []
  );

  const handleAdvance = useCallback(() => {
    if (currentIdx + 1 >= exercises.length) {
      setDone(true);
      setTimerActive(false);
      return;
    }
    setCurrentIdx((i) => i + 1);
    setAudioFinished(false);
    setTimerActive(false);
    setTimer(0);
  }, [currentIdx, exercises.length]);

  const handleComplete = useCallback(() => {
    const perfect = totalCorrect === totalAnswered && totalAnswered > 0;
    const xp = BASE_XP + (perfect ? 2 : 0);
    onComplete({
      xpEarned: xp,
      bonusXP: perfect ? 2 : 0,
      questionsAnswered: totalAnswered,
      correctCount: totalCorrect,
      perfectScore: perfect,
    });
  }, [onComplete, totalCorrect, totalAnswered]);

  if (done) {
    const perfect = totalCorrect === totalAnswered && totalAnswered > 0;
    const xp = BASE_XP + (perfect ? 2 : 0);
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: "center" as const }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
            {perfect ? "🌟" : "🎧"}
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
            Listening Complete!
          </h2>
          <div
            style={{
              fontFamily: "'Noto Serif SC', serif",
              fontSize: "2rem",
              color: "var(--text-primary)",
              margin: "0.75rem 0",
            }}
          >
            {topic.hanzi}
          </div>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--xp-gold)",
              animation: "countUp 0.6s ease",
            }}
          >
            +{xp} XP
          </div>
          {perfect && (
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "1rem",
                color: "var(--xp-gold)",
                marginTop: "0.5rem",
                animation: "fadeIn 0.5s ease 0.3s both",
              }}
            >
              +2 Bonus XP
            </div>
          )}
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "13px",
              color: "var(--text-muted)",
              marginTop: "1rem",
            }}
          >
            {totalCorrect}/{totalAnswered} correct
          </div>
          <button onClick={handleComplete} style={{ ...primaryButtonStyle, marginTop: "1.5rem" }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) return null;
  const exercise = exercises[currentIdx];

  return (
    <div style={containerStyle}>
      <button onClick={onBack} style={backButtonStyle}>
        ← Back
      </button>
      <div style={cardStyle}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <span style={{ ...badgeStyle, background: "var(--listening-blue)" }}>
            Listening
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "13px",
                color: "var(--text-muted)",
              }}
            >
              {currentIdx + 1}/{exercises.length}
            </span>
            {timerActive && (
              <span
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                }}
              >
                {timer}s
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            height: "4px",
            borderRadius: "2px",
            background: "rgba(0,0,0,0.06)",
            marginBottom: "1.5rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(currentIdx / exercises.length) * 100}%`,
              background: "var(--listening-blue)",
              borderRadius: "2px",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* Exercise type label */}
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--text-muted)",
            marginBottom: "1rem",
          }}
        >
          {exercise.type === "vocabulary" && "Vocabulary Recognition"}
          {exercise.type === "sentence" && "Sentence Comprehension"}
          {exercise.type === "dialogue" && "Dialogue Comprehension"}
          {exercise.type === "dictation" && "Dictation"}
        </div>

        {/* Exercise content — key forces full remount on exercise change */}
        {exercise.type === "vocabulary" && (
          <VocabularyExerciseView
            key={exercise.id}
            exercise={exercise}
            audioFinished={audioFinished}
            onAudioComplete={handleAudioComplete}
            onAnswer={handleExerciseAnswer}
            onAdvance={handleAdvance}
          />
        )}
        {exercise.type === "sentence" && (
          <SentenceExerciseView
            key={exercise.id}
            exercise={exercise}
            audioFinished={audioFinished}
            onAudioComplete={handleAudioComplete}
            onAnswer={handleExerciseAnswer}
            onAdvance={handleAdvance}
          />
        )}
        {exercise.type === "dialogue" && (
          <DialogueExerciseView
            key={exercise.id}
            exercise={exercise}
            onAnswer={handleExerciseAnswer}
            onAdvance={handleAdvance}
          />
        )}
        {exercise.type === "dictation" && (
          <DictationExerciseView
            key={exercise.id}
            exercise={exercise}
            audioFinished={audioFinished}
            onAudioComplete={handleAudioComplete}
            onAnswer={handleExerciseAnswer}
            onAdvance={handleAdvance}
          />
        )}
      </div>
    </div>
  );
}

// --- Vocabulary Exercise ---

function VocabularyExerciseView({
  exercise,
  audioFinished,
  onAudioComplete,
  onAnswer,
  onAdvance,
}: {
  exercise: VocabularyExercise;
  audioFinished: boolean;
  onAudioComplete: () => void;
  onAnswer: (correct: boolean) => void;
  onAdvance: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const answeredRef = useRef(false);

  const handleSelect = useCallback(
    (idx: number) => {
      if (selected !== null || !audioFinished) return;
      setSelected(idx);
      if (!answeredRef.current) {
        answeredRef.current = true;
        onAnswer(idx === exercise.correctIndex);
      }
    },
    [selected, audioFinished, exercise.correctIndex, onAnswer]
  );

  const isCorrect = selected === exercise.correctIndex;

  return (
    <>
      <AudioPlayer
        text={exercise.audioText}
        onPlaybackComplete={onAudioComplete}
        maxReplays={2}
      />

      {!audioFinished && (
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1rem",
            color: "var(--text-muted)",
            textAlign: "center",
            margin: "1.5rem 0",
            fontStyle: "italic",
          }}
        >
          Listen to the audio...
        </div>
      )}

      {audioFinished && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "1.25rem 0",
            }}
          >
            What word did you hear?
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {exercise.options.map((opt, idx) => {
              let bg = "var(--surface)";
              let border = "1px solid var(--border)";
              let color = "var(--text-primary)";
              if (selected !== null) {
                if (idx === exercise.correctIndex) {
                  bg = "var(--success)";
                  color = "#FFFFFF";
                  border = "1px solid var(--success)";
                } else if (idx === selected) {
                  bg = "var(--error)";
                  color = "#FFFFFF";
                  border = "1px solid var(--error)";
                }
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  style={{
                    fontFamily: "'Noto Serif SC', serif",
                    fontSize: "1.25rem",
                    background: bg,
                    color,
                    border,
                    borderRadius: "0.5rem",
                    padding: "0.75rem 1rem",
                    cursor: selected !== null ? "default" : "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "left",
                    opacity:
                      selected !== null &&
                      idx !== exercise.correctIndex &&
                      idx !== selected
                        ? 0.5
                        : 1,
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                borderRadius: "0.75rem",
                background: isCorrect
                  ? "rgba(74, 140, 111, 0.08)"
                  : "rgba(193, 95, 60, 0.08)",
                animation: "fadeIn 0.3s ease",
              }}
            >
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: isCorrect ? "var(--success)" : "var(--error)",
                  marginBottom: "0.25rem",
                }}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </div>
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                }}
              >
                {exercise.explanation}
              </div>

              {/* Transcript */}
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "12px",
                  color: "var(--listening-blue)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem 0 0",
                  textDecoration: "underline",
                }}
              >
                {showTranscript ? "Hide transcript" : "Show transcript"}
              </button>

              {showTranscript && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.75rem",
                    background: "rgba(0,0,0,0.03)",
                    borderRadius: "0.5rem",
                    fontFamily: "'Noto Serif SC', serif",
                    fontSize: "1.125rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {exercise.audioText}
                  <div
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "0.875rem",
                      color: "var(--text-muted)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {exercise.pinyin}
                  </div>
                </div>
              )}

              <button
                onClick={onAdvance}
                style={{ ...primaryButtonStyle, marginTop: "1rem" }}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// --- Sentence Exercise ---

function SentenceExerciseView({
  exercise,
  audioFinished,
  onAudioComplete,
  onAnswer,
  onAdvance,
}: {
  exercise: SentenceExercise;
  audioFinished: boolean;
  onAudioComplete: () => void;
  onAnswer: (correct: boolean) => void;
  onAdvance: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const answeredRef = useRef(false);

  const handleSelect = useCallback(
    (idx: number) => {
      if (selected !== null || !audioFinished) return;
      setSelected(idx);
      if (!answeredRef.current) {
        answeredRef.current = true;
        onAnswer(idx === exercise.correctIndex);
      }
    },
    [selected, audioFinished, exercise.correctIndex, onAnswer]
  );

  const isCorrect = selected === exercise.correctIndex;

  return (
    <>
      <AudioPlayer
        text={exercise.audioText}
        onPlaybackComplete={onAudioComplete}
        maxReplays={2}
      />

      {!audioFinished && (
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1rem",
            color: "var(--text-muted)",
            textAlign: "center",
            margin: "1.5rem 0",
            fontStyle: "italic",
          }}
        >
          Listen to the sentence...
        </div>
      )}

      {audioFinished && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "1.25rem 0",
            }}
          >
            {exercise.question}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {exercise.options.map((opt, idx) => {
              let bg = "var(--surface)";
              let border = "1px solid var(--border)";
              let color = "var(--text-primary)";
              if (selected !== null) {
                if (idx === exercise.correctIndex) {
                  bg = "var(--success)";
                  color = "#FFFFFF";
                  border = "1px solid var(--success)";
                } else if (idx === selected) {
                  bg = "var(--error)";
                  color = "#FFFFFF";
                  border = "1px solid var(--error)";
                }
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "15px",
                    background: bg,
                    color,
                    border,
                    borderRadius: "0.5rem",
                    padding: "0.75rem 1rem",
                    cursor: selected !== null ? "default" : "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "left",
                    opacity:
                      selected !== null &&
                      idx !== exercise.correctIndex &&
                      idx !== selected
                        ? 0.5
                        : 1,
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                borderRadius: "0.75rem",
                background: isCorrect
                  ? "rgba(74, 140, 111, 0.08)"
                  : "rgba(193, 95, 60, 0.08)",
                animation: "fadeIn 0.3s ease",
              }}
            >
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: isCorrect ? "var(--success)" : "var(--error)",
                  marginBottom: "0.25rem",
                }}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </div>
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                }}
              >
                {exercise.explanation}
              </div>

              <button
                onClick={() => setShowTranscript(!showTranscript)}
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "12px",
                  color: "var(--listening-blue)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem 0 0",
                  textDecoration: "underline",
                }}
              >
                {showTranscript ? "Hide transcript" : "Show transcript"}
              </button>

              {showTranscript && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.75rem",
                    background: "rgba(0,0,0,0.03)",
                    borderRadius: "0.5rem",
                    fontFamily: "'Noto Serif SC', serif",
                    fontSize: "1.125rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {exercise.audioText}
                  <div
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "0.875rem",
                      color: "var(--text-muted)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {exercise.pinyin}
                  </div>
                </div>
              )}

              <button
                onClick={onAdvance}
                style={{ ...primaryButtonStyle, marginTop: "1rem" }}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// --- Dialogue Exercise ---

function DialogueExerciseView({
  exercise,
  onAnswer,
  onAdvance,
}: {
  exercise: DialogueExercise;
  onAnswer: (correct: boolean) => void;
  onAdvance: () => void;
}) {
  const [phase, setPhase] = useState<"playing" | "questions" | "transcript">(
    "playing"
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaysUsed, setReplaysUsed] = useState(0);
  const answeredRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopSpeaking();
    };
  }, []);

  const playDialogue = useCallback(async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    for (const line of exercise.lines) {
      if (!mountedRef.current) return;
      await speakChineseWithVoice(line.text, line.speaker === "A", 0.9);
      await new Promise((r) => setTimeout(r, 600));
    }
    if (mountedRef.current) {
      setIsPlaying(false);
      setPhase("questions");
    }
  }, [exercise.lines, isPlaying]);

  useEffect(() => {
    if (phase === "playing" && !isPlaying && replaysUsed === 0) {
      const timer = setTimeout(playDialogue, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, isPlaying, replaysUsed, playDialogue]);

  const handleReplay = useCallback(() => {
    if (replaysUsed >= 2 || isPlaying) return;
    setReplaysUsed((r) => r + 1);
    playDialogue();
  }, [replaysUsed, isPlaying, playDialogue]);

  const q: DialogueQuestion | undefined = exercise.questions[currentQuestion];

  const handleSelect = useCallback(
    (idx: number) => {
      if (selected !== null || !q) return;
      setSelected(idx);
      if (!answeredRef.current) {
        answeredRef.current = true;
        onAnswer(idx === q.correctIndex);
      }
    },
    [selected, q, onAnswer]
  );

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion + 1 >= exercise.questions.length) {
      onAdvance();
      return;
    }
    setCurrentQuestion((c) => c + 1);
    setSelected(null);
    answeredRef.current = false;
  }, [currentQuestion, exercise.questions.length, onAdvance]);

  const isCorrect = q && selected === q.correctIndex;

  return (
    <>
      {/* Playing phase */}
      {phase === "playing" && (
        <div style={{ textAlign: "center" }}>
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
                  opacity: isPlaying ? 0.8 : 0.3,
                  height: isPlaying ? `${16 + ((i * 7 + 3) % 5) * 4}px` : "8px",
                  transition: "height 0.3s ease",
                }}
              />
            ))}
          </div>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
              marginBottom: "1rem",
            }}
          >
            {isPlaying ? "Listen to the dialogue..." : "Preparing audio..."}
          </div>
          {!isPlaying && replaysUsed > 0 && replaysUsed < 2 && (
            <button
              onClick={handleReplay}
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "14px",
                background: "var(--listening-blue)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem 1.25rem",
                cursor: "pointer",
              }}
            >
              Replay ({2 - replaysUsed} left)
            </button>
          )}
        </div>
      )}

      {/* Questions phase */}
      {phase === "questions" && q && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          {/* Replay button */}
          {replaysUsed < 2 && (
            <div style={{ marginBottom: "1rem", textAlign: "center" }}>
              <button
                onClick={handleReplay}
                disabled={isPlaying}
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "13px",
                  background: "transparent",
                  color: "var(--listening-blue)",
                  border: "1px solid var(--listening-blue)",
                  borderRadius: "0.5rem",
                  padding: "0.375rem 1rem",
                  cursor: isPlaying ? "default" : "pointer",
                  opacity: isPlaying ? 0.5 : 1,
                }}
              >
                🔊 Replay dialogue ({2 - replaysUsed} left)
              </button>
            </div>
          )}

          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "12px",
              color: "var(--text-muted)",
              marginBottom: "0.5rem",
            }}
          >
            Question {currentQuestion + 1} of {exercise.questions.length}
          </div>

          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            {q.question}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {q.options.map((opt, idx) => {
              let bg = "var(--surface)";
              let border = "1px solid var(--border)";
              let color = "var(--text-primary)";
              if (selected !== null) {
                if (idx === q.correctIndex) {
                  bg = "var(--success)";
                  color = "#FFFFFF";
                  border = "1px solid var(--success)";
                } else if (idx === selected) {
                  bg = "var(--error)";
                  color = "#FFFFFF";
                  border = "1px solid var(--error)";
                }
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "15px",
                    background: bg,
                    color,
                    border,
                    borderRadius: "0.5rem",
                    padding: "0.75rem 1rem",
                    cursor: selected !== null ? "default" : "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "left",
                    opacity:
                      selected !== null &&
                      idx !== q.correctIndex &&
                      idx !== selected
                        ? 0.5
                        : 1,
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                borderRadius: "0.75rem",
                background: isCorrect
                  ? "rgba(74, 140, 111, 0.08)"
                  : "rgba(193, 95, 60, 0.08)",
                animation: "fadeIn 0.3s ease",
              }}
            >
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: isCorrect ? "var(--success)" : "var(--error)",
                  marginBottom: "0.25rem",
                }}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </div>
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                }}
              >
                {q.explanation}
              </div>

              <button
                onClick={() => setShowTranscript(!showTranscript)}
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "12px",
                  color: "var(--listening-blue)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem 0 0",
                  textDecoration: "underline",
                }}
              >
                {showTranscript ? "Hide transcript" : "Show transcript"}
              </button>

              {showTranscript && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {exercise.lines.map((line, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "0.5rem 0.75rem",
                        background: "rgba(0,0,0,0.03)",
                        borderRadius: "0.5rem",
                        borderLeft: `3px solid ${line.speaker === "A" ? "var(--listening-blue)" : "var(--accent)"}`,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          marginBottom: "0.125rem",
                        }}
                      >
                        Speaker {line.speaker}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Noto Serif SC', serif",
                          fontSize: "1rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {line.text}
                      </div>
                      <div
                        style={{
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {line.pinyin}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleNextQuestion}
                style={{ ...primaryButtonStyle, marginTop: "1rem" }}
              >
                {currentQuestion + 1 >= exercise.questions.length
                  ? "Continue"
                  : "Next Question"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// --- Dictation Exercise ---

function DictationExerciseView({
  exercise,
  audioFinished,
  onAudioComplete,
  onAnswer,
  onAdvance,
}: {
  exercise: DictationExercise;
  audioFinished: boolean;
  onAudioComplete: () => void;
  onAnswer: (correct: boolean) => void;
  onAdvance: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const answeredRef = useRef(false);

  const correctAnswer = exercise.blanks[0]?.answer ?? "";

  const handleSelect = useCallback(
    (opt: string) => {
      if (selected !== null || !audioFinished) return;
      setSelected(opt);
      if (!answeredRef.current) {
        answeredRef.current = true;
        onAnswer(opt === correctAnswer);
      }
    },
    [selected, audioFinished, correctAnswer, onAnswer]
  );

  const isCorrect = selected === correctAnswer;

  const displayParts = exercise.displayText.split("___");

  return (
    <>
      <AudioPlayer
        text={exercise.audioText}
        onPlaybackComplete={onAudioComplete}
        maxReplays={2}
      />

      {!audioFinished && (
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1rem",
            color: "var(--text-muted)",
            textAlign: "center",
            margin: "1.5rem 0",
            fontStyle: "italic",
          }}
        >
          Listen carefully to fill in the blank...
        </div>
      )}

      {audioFinished && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          {/* Sentence with blank */}
          <div
            style={{
              fontFamily: "'Noto Serif SC', serif",
              fontSize: "1.5rem",
              textAlign: "center",
              color: "var(--text-primary)",
              margin: "1.25rem 0",
              lineHeight: 2,
            }}
          >
            {displayParts.map((part, i) => (
              <span key={i}>
                {part}
                {i < displayParts.length - 1 && (
                  <span
                    style={{
                      display: "inline-block",
                      minWidth: "3rem",
                      borderBottom: "2px solid var(--listening-blue)",
                      padding: "0 0.25rem",
                      color: selected
                        ? isCorrect
                          ? "var(--success)"
                          : "var(--error)"
                        : "var(--listening-blue)",
                      fontWeight: 600,
                    }}
                  >
                    {selected || "____"}
                  </span>
                )}
              </span>
            ))}
          </div>

          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "0.75rem",
            }}
          >
            Select the correct word:
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
            }}
          >
            {exercise.options.map((opt) => {
              let bg = "var(--surface)";
              let border = "1px solid var(--border)";
              let color = "var(--text-primary)";
              if (selected !== null) {
                if (opt === correctAnswer) {
                  bg = "var(--success)";
                  color = "#FFFFFF";
                  border = "1px solid var(--success)";
                } else if (opt === selected) {
                  bg = "var(--error)";
                  color = "#FFFFFF";
                  border = "1px solid var(--error)";
                }
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={selected !== null}
                  style={{
                    fontFamily: "'Noto Serif SC', serif",
                    fontSize: "1.125rem",
                    background: bg,
                    color,
                    border,
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    cursor: selected !== null ? "default" : "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "center",
                    opacity:
                      selected !== null && opt !== correctAnswer && opt !== selected
                        ? 0.5
                        : 1,
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                borderRadius: "0.75rem",
                background: isCorrect
                  ? "rgba(74, 140, 111, 0.08)"
                  : "rgba(193, 95, 60, 0.08)",
                animation: "fadeIn 0.3s ease",
              }}
            >
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: isCorrect ? "var(--success)" : "var(--error)",
                  marginBottom: "0.25rem",
                }}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </div>
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                }}
              >
                {exercise.explanation}
              </div>

              <button
                onClick={() => setShowTranscript(!showTranscript)}
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "12px",
                  color: "var(--listening-blue)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem 0 0",
                  textDecoration: "underline",
                }}
              >
                {showTranscript ? "Hide transcript" : "Show transcript"}
              </button>

              {showTranscript && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.75rem",
                    background: "rgba(0,0,0,0.03)",
                    borderRadius: "0.5rem",
                    fontFamily: "'Noto Serif SC', serif",
                    fontSize: "1.125rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {exercise.audioText}
                  <div
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "0.875rem",
                      color: "var(--text-muted)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {exercise.pinyin}
                  </div>
                </div>
              )}

              <button
                onClick={onAdvance}
                style={{ ...primaryButtonStyle, marginTop: "1rem" }}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// --- Shared styles ---

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
};

const primaryButtonStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  fontWeight: 600,
  background: "var(--accent)",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.75rem 1.5rem",
  cursor: "pointer",
  transition: "background 0.15s ease",
  width: "100%",
};
