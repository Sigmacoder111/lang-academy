import { useState, useCallback, useMemo, useEffect } from "react";
import type { GraphNode } from "../types/graph";
import type { TaskResult } from "../types/tasks";
import {
  selectMixedSpeakingExercises,
  type ConversationExercise,
  type PresentationExercise,
  type WordExercise,
  type SentenceExercise,
} from "../data/speaking-exercises";
import { isSpeechRecognitionSupported } from "../utils/speech";
import { speakChinese, stopSpeaking, playVocabAudio } from "../utils/speech";
import SpeechRecorder from "./SpeechRecorder";
import SpeakingFeedback, {
  generateLocalFeedback,
  type SpeakingFeedbackData,
} from "./SpeakingFeedback";

interface SpeakingViewProps {
  topic: GraphNode;
  onComplete: (result: TaskResult) => void;
  onBack: () => void;
}

const EXERCISE_COUNT = 5;
const BASE_XP = 8;

export default function SpeakingView({
  topic,
  onComplete,
  onBack,
}: SpeakingViewProps) {
  const exercises = useMemo(() => selectMixedSpeakingExercises(EXERCISE_COUNT), []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [permissionNoticeShown, setPermissionNoticeShown] = useState(() => {
    return localStorage.getItem("lang-academy-mic-notice-shown") === "true";
  });

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleExerciseComplete = useCallback(
    (score: number) => {
      setScores((prev) => [...prev, score]);
      if (currentIdx + 1 >= exercises.length) {
        setDone(true);
      } else {
        setCurrentIdx((i) => i + 1);
      }
    },
    [currentIdx, exercises.length]
  );

  const handleDismissNotice = useCallback(() => {
    setPermissionNoticeShown(true);
    localStorage.setItem("lang-academy-mic-notice-shown", "true");
  }, []);

  const handleFinish = useCallback(() => {
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const perfect = avgScore >= 4.5;
    const bonusXP = perfect ? 4 : avgScore >= 3 ? 2 : 0;
    const xpEarned = BASE_XP + bonusXP;
    onComplete({
      xpEarned,
      bonusXP,
      questionsAnswered: scores.length,
      correctCount: scores.filter((s) => s >= 3).length,
      perfectScore: perfect,
    });
  }, [onComplete, scores]);

  if (!permissionNoticeShown) {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: "center" as const }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎤</div>
          <h2 style={noticeTitleStyle}>Microphone Access</h2>
          <p style={noticeTextStyle}>
            Lang Academy needs microphone access for speaking practice. Audio is
            processed locally using your browser's speech recognition — no audio
            files are sent to servers. Only the text transcript is used for
            feedback.
          </p>
          <div style={noticeSupportStyle}>
            {isSpeechRecognitionSupported() ? (
              <span style={{ color: "var(--success)" }}>
                ✓ Your browser supports speech recognition
              </span>
            ) : (
              <span style={{ color: "var(--error)" }}>
                ⚠ Speech recognition may not work in your browser. Chrome is recommended.
              </span>
            )}
          </div>
          <button onClick={handleDismissNotice} style={primaryButtonStyle}>
            Continue to Speaking Practice
          </button>
          <button
            onClick={onBack}
            style={{
              ...backButtonStyle,
              marginTop: "0.75rem",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    const avgScore =
      scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;
    const perfect = avgScore >= 4.5;
    const bonusXP = perfect ? 4 : avgScore >= 3 ? 2 : 0;
    const xpEarned = BASE_XP + bonusXP;

    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: "center" as const }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
            {perfect ? "🌟" : "🎤"}
          </div>
          <h2 style={completeTitleStyle}>Speaking Practice Complete!</h2>
          <div style={completeHanziStyle}>{topic.hanzi}</div>
          <div style={completeXPStyle}>+{xpEarned} XP</div>
          {bonusXP > 0 && (
            <div style={bonusStyle}>+{bonusXP} Bonus XP</div>
          )}
          <div style={completeStatsStyle}>
            Average score: {avgScore.toFixed(1)}/5 ·{" "}
            {scores.filter((s) => s >= 3).length}/{scores.length} passed
          </div>
          <button onClick={handleFinish} style={{ ...primaryButtonStyle, marginTop: "1.5rem" }}>
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
        <div style={headerStyle}>
          <span style={badgeStyle}>Speaking</span>
          <span style={progressTextStyle}>
            {currentIdx + 1}/{exercises.length}
          </span>
        </div>

        {/* Progress bar */}
        <div style={progressBarBgStyle}>
          <div
            style={{
              ...progressBarFillStyle,
              width: `${(currentIdx / exercises.length) * 100}%`,
            }}
          />
        </div>

        {/* Exercise type label */}
        <div style={exerciseTypeLabelStyle}>
          {exercise.type === "word" && "Word Pronunciation"}
          {exercise.type === "sentence" && "Sentence Read-Aloud"}
          {exercise.type === "conversation" && "Conversation Response"}
          {exercise.type === "presentation" && "Cultural Presentation"}
        </div>

        {/* Exercise content */}
        {exercise.type === "word" && (
          <WordExerciseView
            key={exercise.id}
            exercise={exercise}
            onComplete={handleExerciseComplete}
          />
        )}
        {exercise.type === "sentence" && (
          <SentenceExerciseView
            key={exercise.id}
            exercise={exercise}
            onComplete={handleExerciseComplete}
          />
        )}
        {exercise.type === "conversation" && (
          <ConversationExerciseView
            key={exercise.id}
            exercise={exercise}
            onComplete={handleExerciseComplete}
          />
        )}
        {exercise.type === "presentation" && (
          <PresentationExerciseView
            key={exercise.id}
            exercise={exercise}
            onComplete={handleExerciseComplete}
          />
        )}
      </div>
    </div>
  );
}

function WordExerciseView({
  exercise,
  onComplete,
}: {
  exercise: WordExercise;
  onComplete: (score: number) => void;
}) {
  const [feedback, setFeedback] = useState<SpeakingFeedbackData | null>(null);
  const [selfAssessMode, setSelfAssessMode] = useState(false);
  const isSupported = isSpeechRecognitionSupported();

  const handleTranscript = useCallback(
    (transcript: string) => {
      const fb = generateLocalFeedback(
        transcript,
        exercise.hanzi,
        "word"
      );
      setFeedback(fb);
    },
    [exercise.hanzi]
  );

  const handleSelfAssess = useCallback(
    (score: number) => {
      setFeedback({
        score,
        feedback:
          score >= 4
            ? "Great self-assessment! Keep practicing to maintain your pronunciation."
            : "Keep practicing! Listen to the model pronunciation and try to match it.",
        suggestion: "Practice this word several times, focusing on the tone.",
        vocabularyUsed: [exercise.hanzi],
        grammarPatterns: [],
      });
    },
    [exercise.hanzi]
  );

  return (
    <div>
      {/* Prompt */}
      <div style={promptContainerStyle}>
        <div style={promptHanziStyle}>{exercise.hanzi}</div>
        <div style={promptPinyinStyle}>{exercise.pinyin}</div>
        <div style={promptMeaningStyle}>{exercise.meaning}</div>
      </div>

      {/* Listen button */}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button
          onClick={() => playVocabAudio(exercise.id, exercise.hanzi, 0.8)}
          style={listenButtonStyle}
        >
          🔊 Listen
        </button>
      </div>

      {!feedback && (
        <>
          {isSupported && !selfAssessMode ? (
            <SpeechRecorder onTranscript={handleTranscript} />
          ) : (
            <SelfAssessment onScore={handleSelfAssess} />
          )}
          {isSupported && !selfAssessMode && (
            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <button
                onClick={() => setSelfAssessMode(true)}
                style={switchModeStyle}
              >
                Switch to self-assessment
              </button>
            </div>
          )}
          {!isSupported && (
            <SelfAssessment onScore={handleSelfAssess} />
          )}
        </>
      )}

      {feedback && (
        <SpeakingFeedback
          data={feedback}
          modelResponse={exercise.hanzi}
          onContinue={() => onComplete(feedback.score)}
        />
      )}
    </div>
  );
}

function SentenceExerciseView({
  exercise,
  onComplete,
}: {
  exercise: SentenceExercise;
  onComplete: (score: number) => void;
}) {
  const [feedback, setFeedback] = useState<SpeakingFeedbackData | null>(null);
  const [selfAssessMode, setSelfAssessMode] = useState(false);
  const isSupported = isSpeechRecognitionSupported();

  const handleTranscript = useCallback(
    (transcript: string) => {
      const fb = generateLocalFeedback(
        transcript,
        exercise.hanzi,
        "sentence"
      );
      setFeedback(fb);
    },
    [exercise.hanzi]
  );

  const handleSelfAssess = useCallback(
    (score: number) => {
      setFeedback({
        score,
        feedback:
          score >= 4
            ? "Nice work reading aloud! Your fluency is developing well."
            : "Keep practicing reading aloud. Focus on natural pacing and tone accuracy.",
        suggestion: "Try reading the sentence at different speeds to build automaticity.",
        vocabularyUsed: [],
        grammarPatterns: [],
      });
    },
    []
  );

  return (
    <div>
      <div style={promptContainerStyle}>
        <div style={promptSentenceStyle}>{exercise.hanzi}</div>
        <div style={promptPinyinStyle}>{exercise.pinyin}</div>
        <div style={promptMeaningStyle}>{exercise.meaning}</div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button
          onClick={() => playVocabAudio(exercise.id, exercise.hanzi, 0.8)}
          style={listenButtonStyle}
        >
          🔊 Listen
        </button>
      </div>

      {!feedback && (
        <>
          {isSupported && !selfAssessMode ? (
            <SpeechRecorder onTranscript={handleTranscript} />
          ) : (
            <SelfAssessment onScore={handleSelfAssess} />
          )}
          {isSupported && !selfAssessMode && (
            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <button
                onClick={() => setSelfAssessMode(true)}
                style={switchModeStyle}
              >
                Switch to self-assessment
              </button>
            </div>
          )}
          {!isSupported && (
            <SelfAssessment onScore={handleSelfAssess} />
          )}
        </>
      )}

      {feedback && (
        <SpeakingFeedback
          data={feedback}
          modelResponse={exercise.hanzi}
          onContinue={() => onComplete(feedback.score)}
        />
      )}
    </div>
  );
}

function ConversationExerciseView({
  exercise,
  onComplete,
}: {
  exercise: ConversationExercise;
  onComplete: (score: number) => void;
}) {
  const [phase, setPhase] = useState<"prompt" | "record" | "feedback">("prompt");
  const [feedback, setFeedback] = useState<SpeakingFeedbackData | null>(null);
  const [selfAssessMode, setSelfAssessMode] = useState(false);
  const isSupported = isSpeechRecognitionSupported();

  const handlePlayPrompt = useCallback(async () => {
    await speakChinese(exercise.promptChinese, 0.85, `/audio/speaking/${exercise.id}.mp3`);
    setPhase("record");
  }, [exercise.promptChinese, exercise.id]);

  const handleTranscript = useCallback(
    (transcript: string) => {
      const fb = generateLocalFeedback(
        transcript,
        exercise.modelResponse,
        "conversation"
      );
      setFeedback(fb);
      setPhase("feedback");
    },
    [exercise.modelResponse]
  );

  const handleSelfAssess = useCallback(
    (score: number) => {
      setFeedback({
        score,
        feedback:
          score >= 4
            ? "Strong response to the conversation prompt! You're building good conversational skills."
            : "Practice responding to conversation prompts. Try to address all parts of the question.",
        suggestion: "Listen to the model response and note the vocabulary and structures used.",
        vocabularyUsed: [],
        grammarPatterns: [],
      });
      setPhase("feedback");
    },
    []
  );

  return (
    <div>
      {/* Conversation prompt */}
      <div style={promptContainerStyle}>
        <div style={promptSentenceStyle}>{exercise.promptChinese}</div>
        <div style={promptPinyinStyle}>{exercise.promptPinyin}</div>
        <div style={promptMeaningStyle}>{exercise.promptEnglish}</div>
      </div>

      {phase === "prompt" && (
        <div style={{ textAlign: "center" }}>
          <button onClick={handlePlayPrompt} style={listenButtonStyle}>
            🔊 Listen to question
          </button>
          <div style={hintTextStyle}>
            Listen to the question, then respond in Chinese. You have{" "}
            {exercise.timeLimitSeconds} seconds.
          </div>
        </div>
      )}

      {phase === "record" && !feedback && (
        <>
          {isSupported && !selfAssessMode ? (
            <SpeechRecorder
              onTranscript={handleTranscript}
              timeLimitSeconds={exercise.timeLimitSeconds}
              autoStart
            />
          ) : (
            <SelfAssessment onScore={handleSelfAssess} />
          )}
          {isSupported && !selfAssessMode && (
            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <button
                onClick={() => setSelfAssessMode(true)}
                style={switchModeStyle}
              >
                Switch to self-assessment
              </button>
            </div>
          )}
          {!isSupported && (
            <SelfAssessment onScore={handleSelfAssess} />
          )}
        </>
      )}

      {phase === "feedback" && feedback && (
        <SpeakingFeedback
          data={feedback}
          modelResponse={exercise.modelResponse}
          onContinue={() => onComplete(feedback.score)}
        />
      )}
    </div>
  );
}

function PresentationExerciseView({
  exercise,
  onComplete,
}: {
  exercise: PresentationExercise;
  onComplete: (score: number) => void;
}) {
  const [phase, setPhase] = useState<"prepare" | "record" | "feedback">("prepare");
  const [prepTime, setPrepTime] = useState(30);
  const [feedback, setFeedback] = useState<SpeakingFeedbackData | null>(null);
  const [selfAssessMode, setSelfAssessMode] = useState(false);
  const isSupported = isSpeechRecognitionSupported();

  useEffect(() => {
    if (phase !== "prepare") return;
    const interval = setInterval(() => {
      setPrepTime((t) => {
        if (t <= 1) {
          setPhase("record");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const handleTranscript = useCallback(
    (transcript: string) => {
      const fb = generateLocalFeedback(
        transcript,
        exercise.modelResponse,
        "presentation"
      );
      setFeedback(fb);
      setPhase("feedback");
    },
    [exercise.modelResponse]
  );

  const handleSelfAssess = useCallback(
    (score: number) => {
      setFeedback({
        score,
        feedback:
          score >= 4
            ? "Excellent presentation! You demonstrated strong cultural knowledge and language skills."
            : "Keep working on your presentation skills. Try to cover all aspects of the topic.",
        suggestion: "Practice organizing your thoughts into clear sections before speaking.",
        vocabularyUsed: [],
        grammarPatterns: [],
      });
      setPhase("feedback");
    },
    []
  );

  return (
    <div>
      {/* Topic */}
      <div style={promptContainerStyle}>
        <div style={promptSentenceStyle}>{exercise.topicChinese}</div>
        <div style={promptMeaningStyle}>{exercise.topicEnglish}</div>
      </div>

      {/* Rubric points */}
      <div style={rubricContainerStyle}>
        <div style={rubricTitleStyle}>Evaluation criteria:</div>
        {exercise.rubricPoints.map((point, i) => (
          <div key={i} style={rubricPointStyle}>
            • {point}
          </div>
        ))}
      </div>

      {phase === "prepare" && (
        <div style={{ textAlign: "center" }}>
          <div style={prepTimerStyle}>
            Preparation: {prepTime}s
          </div>
          <div style={hintTextStyle}>
            Plan your 2-minute presentation. Think about structure, vocabulary,
            and cultural details.
          </div>
          <button
            onClick={() => setPhase("record")}
            style={{ ...primaryButtonStyle, marginTop: "1rem" }}
          >
            Start Recording Early
          </button>
        </div>
      )}

      {phase === "record" && !feedback && (
        <>
          {isSupported && !selfAssessMode ? (
            <SpeechRecorder
              onTranscript={handleTranscript}
              timeLimitSeconds={exercise.timeLimitSeconds}
              autoStart
            />
          ) : (
            <SelfAssessment onScore={handleSelfAssess} />
          )}
          {isSupported && !selfAssessMode && (
            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <button
                onClick={() => setSelfAssessMode(true)}
                style={switchModeStyle}
              >
                Switch to self-assessment
              </button>
            </div>
          )}
          {!isSupported && (
            <SelfAssessment onScore={handleSelfAssess} />
          )}
        </>
      )}

      {phase === "feedback" && feedback && (
        <SpeakingFeedback
          data={feedback}
          modelResponse={exercise.modelResponse}
          onContinue={() => onComplete(feedback.score)}
        />
      )}
    </div>
  );
}

function SelfAssessment({ onScore }: { onScore: (score: number) => void }) {
  return (
    <div style={selfAssessContainerStyle}>
      <div style={selfAssessTitleStyle}>Self-Assessment</div>
      <div style={selfAssessDescStyle}>
        How well did you perform? Rate your response:
      </div>
      <div style={selfAssessButtonsStyle}>
        {[
          { score: 1, label: "Struggled", color: "var(--error)" },
          { score: 2, label: "Needs work", color: "var(--error)" },
          { score: 3, label: "Okay", color: "var(--xp-gold)" },
          { score: 4, label: "Good", color: "var(--success)" },
          { score: 5, label: "Excellent", color: "var(--success)" },
        ].map(({ score, label, color }) => (
          <button
            key={score}
            onClick={() => onScore(score)}
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "13px",
              fontWeight: 600,
              background: "transparent",
              border: `1.5px solid ${color}`,
              color,
              borderRadius: "0.5rem",
              padding: "0.5rem 0.25rem",
              cursor: "pointer",
              flex: 1,
              transition: "background 0.15s ease",
              minWidth: 0,
            }}
          >
            {score}
            <br />
            <span style={{ fontSize: "10px", fontWeight: 400 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
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

const headerStyle: React.CSSProperties = {
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
  background: "var(--speaking-brown)",
};

const progressTextStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "13px",
  color: "var(--text-muted)",
};

const progressBarBgStyle: React.CSSProperties = {
  width: "100%",
  height: "4px",
  borderRadius: "2px",
  background: "rgba(0,0,0,0.06)",
  marginBottom: "1.5rem",
  overflow: "hidden",
};

const progressBarFillStyle: React.CSSProperties = {
  height: "100%",
  background: "var(--speaking-brown)",
  borderRadius: "2px",
  transition: "width 0.3s ease",
};

const exerciseTypeLabelStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--text-muted)",
  marginBottom: "1rem",
};

const promptContainerStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "1.5rem",
};

const promptHanziStyle: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
  fontSize: "3rem",
  color: "var(--text-primary)",
  lineHeight: 1.3,
  marginBottom: "0.25rem",
};

const promptSentenceStyle: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
  fontSize: "1.5rem",
  color: "var(--text-primary)",
  lineHeight: 1.6,
  marginBottom: "0.375rem",
};

const promptPinyinStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1rem",
  color: "var(--text-muted)",
  marginBottom: "0.25rem",
};

const promptMeaningStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.9375rem",
  color: "var(--text-muted)",
  fontStyle: "italic",
};

const listenButtonStyle: React.CSSProperties = {
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

const hintTextStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  color: "var(--text-muted)",
  marginTop: "0.75rem",
  fontStyle: "italic",
};

const switchModeStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "12px",
  color: "var(--text-muted)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  textDecoration: "underline",
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
  width: "100%",
  transition: "background 0.15s ease",
};

const noticeTitleStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.5rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  marginBottom: "0.75rem",
};

const noticeTextStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  color: "var(--text-primary)",
  lineHeight: 1.6,
  marginBottom: "1rem",
  maxWidth: "28rem",
  marginLeft: "auto",
  marginRight: "auto",
};

const noticeSupportStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  marginBottom: "1.5rem",
};

const completeTitleStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.5rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  marginBottom: "0.5rem",
};

const completeHanziStyle: React.CSSProperties = {
  fontFamily: "'Noto Serif SC', serif",
  fontSize: "2rem",
  color: "var(--text-primary)",
  margin: "0.75rem 0",
};

const completeXPStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "var(--xp-gold)",
  animation: "countUp 0.6s ease",
};

const bonusStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1rem",
  color: "var(--xp-gold)",
  marginTop: "0.5rem",
  animation: "fadeIn 0.5s ease 0.3s both",
};

const completeStatsStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "13px",
  color: "var(--text-muted)",
  marginTop: "1rem",
};

const rubricContainerStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.03)",
  borderRadius: "0.5rem",
  padding: "0.75rem 1rem",
  marginBottom: "1rem",
};

const rubricTitleStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--text-muted)",
  marginBottom: "0.375rem",
};

const rubricPointStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "13px",
  color: "var(--text-primary)",
  lineHeight: 1.5,
};

const prepTimerStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1.25rem",
  fontWeight: 600,
  color: "var(--speaking-brown)",
  marginBottom: "0.5rem",
};

const selfAssessContainerStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "1rem",
  background: "rgba(139, 111, 71, 0.04)",
  borderRadius: "0.75rem",
  border: "1px dashed var(--speaking-brown)",
};

const selfAssessTitleStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "1rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  marginBottom: "0.375rem",
};

const selfAssessDescStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  color: "var(--text-muted)",
  marginBottom: "0.75rem",
};

const selfAssessButtonsStyle: React.CSSProperties = {
  display: "flex",
  gap: "0.5rem",
};
