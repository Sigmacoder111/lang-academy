import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type {
  MockExamSection,
  MockExamListeningAnswer,
  MockExamReadingAnswer,
  MockExamWritingResponse,
  MockExamSpeakingResponse,
  MockExamResult,
  MockExamSectionScore,
} from "../types/mock-exam";
import {
  SECTION_ORDER,
  getSectionLabel,
  DEFAULT_EXAM_CONFIG,
} from "../types/mock-exam";
import type { GeneratedExam } from "../engine/mock-exam";
import {
  generateMockExam,
  getNextExamNumber,
  peekNextExamNumber,
  saveMockExamResult,
  calculateListeningScore,
  calculateReadingScore,
  calculateWritingScore,
  calculateSpeakingScore,
  calculateCompositeScore,
  compositeToAPScore,
  identifyAreasToImprove,
  gradeWritingLocally,
  gradeSpeakingLocally,
  loadMockExamResults,
  predictTrendScore,
} from "../engine/mock-exam";
import type { DialogueExercise } from "../data/listening-exercises";
import { speakChinese, playExerciseAudio } from "../utils/speech";

interface MockExamProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function MockExam({ onBack, onComplete }: MockExamProps) {
  const [phase, setPhase] = useState<"intro" | "exam" | "report">("intro");
  const [exam, setExam] = useState<GeneratedExam | null>(null);
  const [examNumber, setExamNumber] = useState(() => peekNextExamNumber());

  const [sectionIndex, setSectionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  const [listeningAnswers, setListeningAnswers] = useState<MockExamListeningAnswer[]>([]);
  const [readingAnswers, setReadingAnswers] = useState<MockExamReadingAnswer[]>([]);
  const [writingResponses, setWritingResponses] = useState<MockExamWritingResponse[]>([]);
  const [speakingResponses, setSpeakingResponses] = useState<MockExamSpeakingResponse[]>([]);

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [writingText, setWritingText] = useState("");
  const [speakingTranscript, setSpeakingTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [conversationTurnIdx, setConversationTurnIdx] = useState(0);
  const [prepPhase, setPrepPhase] = useState(false);

  const [examResult, setExamResult] = useState<MockExamResult | null>(null);
  const [startedAt] = useState(Date.now());

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const currentSection = SECTION_ORDER[sectionIndex];

  const getSectionTime = useCallback((section: MockExamSection): number => {
    const timeLimits = DEFAULT_EXAM_CONFIG.sectionTimeLimits;
    return timeLimits[section] || 0;
  }, []);

  useEffect(() => {
    if (phase !== "exam" || isPaused || currentSection === "section_break" || currentSection === "intro" || currentSection === "score_report") {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        if (prev === 300) {
          setShowTimeWarning(true);
          setTimeout(() => setShowTimeWarning(false), 5000);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isPaused, currentSection, sectionIndex]);

  const handleAutoSubmit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    moveToNextSection();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIndex, currentSection, writingText, speakingTranscript, conversationTurnIdx]);

  const startExam = useCallback(() => {
    const generated = generateMockExam();
    const num = getNextExamNumber();
    setExam(generated);
    setExamNumber(num);
    setSectionIndex(0);
    setPhase("exam");
    advanceToFirstSection(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advanceToFirstSection = useCallback((startIdx: number) => {
    let idx = startIdx;
    while (idx < SECTION_ORDER.length && (SECTION_ORDER[idx] === "intro" || SECTION_ORDER[idx] === "score_report")) {
      idx++;
    }
    if (idx < SECTION_ORDER.length) {
      if (SECTION_ORDER[idx] === "section_break") {
        setSectionIndex(idx);
        setIsPaused(true);
      } else {
        setSectionIndex(idx);
        setTimeRemaining(getSectionTime(SECTION_ORDER[idx]));
        setCurrentQuestionIdx(0);
        setWritingText("");
        setSpeakingTranscript("");
        setConversationTurnIdx(0);
        setPrepPhase(SECTION_ORDER[idx] === "speaking_presentation");
      }
    }
  }, [getSectionTime]);

  const moveToNextSection = useCallback(() => {
    if (currentSection === "writing_story" || currentSection === "writing_email") {
      if (writingText.trim()) {
        const { score, feedback } = gradeWritingLocally(writingText);
        const promptId = currentSection === "writing_story"
          ? exam?.storyNarration.id ?? ""
          : exam?.emailResponse.id ?? "";
        setWritingResponses(prev => [
          ...prev,
          { promptId, text: writingText, score, feedback },
        ]);
      }
      setWritingText("");
    }

    if (currentSection === "speaking_conversation" || currentSection === "speaking_presentation") {
      if (speakingTranscript.trim()) {
        const promptId = currentSection === "speaking_conversation"
          ? exam?.conversationPrompt.id ?? ""
          : exam?.presentationPrompt.id ?? "";
        const { score, feedback } = gradeSpeakingLocally(speakingTranscript);
        setSpeakingResponses(prev => [
          ...prev,
          { promptId, transcript: speakingTranscript, score, feedback },
        ]);
      }
      setSpeakingTranscript("");
      stopRecording();
    }

    const nextIdx = sectionIndex + 1;

    if (nextIdx >= SECTION_ORDER.length || SECTION_ORDER[nextIdx] === "score_report") {
      finishExam();
      return;
    }

    if (SECTION_ORDER[nextIdx] === "section_break") {
      setSectionIndex(nextIdx);
      setIsPaused(true);
      return;
    }

    setSectionIndex(nextIdx);
    setTimeRemaining(getSectionTime(SECTION_ORDER[nextIdx]));
    setCurrentQuestionIdx(0);
    setWritingText("");
    setSpeakingTranscript("");
    setConversationTurnIdx(0);
    setPrepPhase(SECTION_ORDER[nextIdx] === "speaking_presentation");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIndex, currentSection, writingText, speakingTranscript, exam, getSectionTime]);

  const resumeFromBreak = useCallback(() => {
    let nextIdx = sectionIndex + 1;
    while (nextIdx < SECTION_ORDER.length && SECTION_ORDER[nextIdx] === "section_break") {
      nextIdx++;
    }

    if (nextIdx >= SECTION_ORDER.length || SECTION_ORDER[nextIdx] === "score_report") {
      finishExam();
      return;
    }

    setSectionIndex(nextIdx);
    setIsPaused(false);
    setTimeRemaining(getSectionTime(SECTION_ORDER[nextIdx]));
    setCurrentQuestionIdx(0);
    setWritingText("");
    setSpeakingTranscript("");
    setConversationTurnIdx(0);
    setPrepPhase(SECTION_ORDER[nextIdx] === "speaking_presentation");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIndex, getSectionTime]);

  const finishExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    const listeningScore = calculateListeningScore(listeningAnswers);
    const readingScore = calculateReadingScore(readingAnswers);
    const writingScore = calculateWritingScore(writingResponses);
    const speakingScore = calculateSpeakingScore(speakingResponses);

    const sectionScores: MockExamSectionScore[] = [
      listeningScore,
      readingScore,
      writingScore,
      speakingScore,
    ];

    const composite = calculateCompositeScore(sectionScores);
    const apScore = compositeToAPScore(composite);
    const areasToImprove = identifyAreasToImprove(sectionScores);

    const result: MockExamResult = {
      id: `mock-exam-${examNumber}-${Date.now()}`,
      examNumber,
      date: new Date().toISOString().slice(0, 10),
      timestamp: Date.now(),
      predictedAPScore: apScore,
      compositeScore: Math.round(composite * 100),
      sectionScores,
      listeningAnswers,
      readingAnswers,
      writingResponses,
      speakingResponses,
      totalTimeSeconds: Math.round((Date.now() - startedAt) / 1000),
      areasToImprove,
    };

    saveMockExamResult(result);
    setExamResult(result);
    setPhase("report");
  }, [listeningAnswers, readingAnswers, writingResponses, speakingResponses, examNumber, startedAt]);

  const handleListeningAnswer = useCallback((questionId: string, selectedIndex: number, correctIndex: number) => {
    setListeningAnswers(prev => [
      ...prev,
      { questionId, selectedIndex, correct: selectedIndex === correctIndex },
    ]);
    setCurrentQuestionIdx(prev => prev + 1);
  }, []);

  const handleReadingAnswer = useCallback((questionId: string, selectedIndex: number, correctIndex: number) => {
    setReadingAnswers(prev => [
      ...prev,
      { questionId, selectedIndex, correct: selectedIndex === correctIndex },
    ]);
    setCurrentQuestionIdx(prev => prev + 1);
  }, []);

  const startRecording = useCallback(() => {
    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new (SpeechRecognition as new () => {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: ((event: { results: { length: number; [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
      onerror: (() => void) | null;
      start: () => void;
      stop: () => void;
    })();
    recognition.lang = "zh-CN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setSpeakingTranscript(transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (phase === "intro") {
    return <ExamIntro examNumber={examNumber} onStart={startExam} onBack={onBack} />;
  }

  if (phase === "report" && examResult) {
    return <ExamReport result={examResult} onDone={onComplete} />;
  }

  if (!exam) return null;

  return (
    <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "0 1rem" }}>
      {/* Timer Bar */}
      {currentSection !== "section_break" && (
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "var(--bg-primary)",
          padding: "0.75rem 0",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
          }}>
            {getSectionLabel(currentSection)}
          </div>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: timeRemaining <= 300 ? "#e74c3c" : "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}>
            {timeRemaining <= 300 && timeRemaining > 0 && (
              <span style={{ fontSize: "0.75rem", color: "#e74c3c" }}>⚠ LOW TIME</span>
            )}
            {formatTime(timeRemaining)}
          </div>
        </div>
      )}

      {showTimeWarning && (
        <div style={{
          position: "fixed",
          top: "4rem",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#e74c3c",
          color: "white",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.875rem",
          fontWeight: 600,
          zIndex: 30,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}>
          5 minutes remaining!
        </div>
      )}

      {/* Section Break */}
      {currentSection === "section_break" && (
        <SectionBreak
          nextSection={getNextActualSection(sectionIndex)}
          onResume={resumeFromBreak}
        />
      )}

      {/* Listening Section */}
      {currentSection === "listening" && (
        <ListeningSection
          exercises={exam.listeningExercises}
          questionIndex={currentQuestionIdx}
          onAnswer={handleListeningAnswer}
          onComplete={moveToNextSection}
          answeredCount={listeningAnswers.length}
        />
      )}

      {/* Reading Section */}
      {currentSection === "reading" && (
        <ReadingSection
          passages={exam.readingPassages}
          questionIndex={currentQuestionIdx}
          onAnswer={handleReadingAnswer}
          onComplete={moveToNextSection}
          answeredCount={readingAnswers.length}
        />
      )}

      {/* Writing Story */}
      {currentSection === "writing_story" && (
        <WritingSection
          prompt={exam.storyNarration}
          text={writingText}
          onChange={setWritingText}
          onSubmit={moveToNextSection}
        />
      )}

      {/* Writing Email */}
      {currentSection === "writing_email" && (
        <WritingSection
          prompt={exam.emailResponse}
          text={writingText}
          onChange={setWritingText}
          onSubmit={moveToNextSection}
        />
      )}

      {/* Speaking Conversation */}
      {currentSection === "speaking_conversation" && (
        <SpeakingConversationSection
          prompt={exam.conversationPrompt}
          turnIndex={conversationTurnIdx}
          transcript={speakingTranscript}
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onNextTurn={() => {
            const turns = exam.conversationPrompt.conversationTurns?.length ?? 0;
            if (conversationTurnIdx < turns - 1) {
              setConversationTurnIdx(prev => prev + 1);
              setSpeakingTranscript("");
            } else {
              moveToNextSection();
            }
          }}
          onComplete={moveToNextSection}
        />
      )}

      {/* Speaking Presentation */}
      {currentSection === "speaking_presentation" && (
        <SpeakingPresentationSection
          prompt={exam.presentationPrompt}
          transcript={speakingTranscript}
          isRecording={isRecording}
          isPrepPhase={prepPhase}
          onStartRecording={() => {
            setPrepPhase(false);
            startRecording();
          }}
          onStopRecording={stopRecording}
          onComplete={moveToNextSection}
        />
      )}
    </div>
  );
}

function getNextActualSection(currentIdx: number): MockExamSection {
  let idx = currentIdx + 1;
  while (idx < SECTION_ORDER.length && SECTION_ORDER[idx] === "section_break") {
    idx++;
  }
  return idx < SECTION_ORDER.length ? SECTION_ORDER[idx] : "score_report";
}

function ExamIntro({ examNumber, onStart, onBack }: { examNumber: number; onStart: () => void; onBack: () => void }) {
  return (
    <div style={{ maxWidth: "40rem", margin: "0 auto", padding: "2rem 1rem" }}>
      <button
        onClick={onBack}
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.8125rem",
          color: "var(--text-muted)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "0.25rem 0",
          marginBottom: "1.5rem",
        }}
      >
        ← Back to Dashboard
      </button>

      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "2rem",
      }}>
        <h2 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 0.5rem 0",
        }}>
          AP Chinese Practice Exam #{examNumber}
        </h2>
        <p style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.875rem",
          color: "var(--text-muted)",
          margin: "0 0 1.5rem 0",
        }}>
          Estimated time: ~95 minutes
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          <SectionInfoCard
            title="Section I Part A: Listening"
            description="Rejoinders and listening selections"
            time="~25 min"
            questions="~18 questions"
            color="var(--listening-blue, #4a90d9)"
          />
          <SectionInfoCard
            title="Section I Part B: Reading"
            description="Reading comprehension passages"
            time="~35 min"
            questions="~25 questions"
            color="var(--accent, #c76d32)"
          />
          <SectionInfoCard
            title="Section II Part A: Writing"
            description="Story narration + Email response"
            time="~30 min"
            questions="2 tasks"
            color="#6b8e23"
          />
          <SectionInfoCard
            title="Section II Part B: Speaking"
            description="Conversation + Cultural presentation"
            time="~10 min"
            questions="2 tasks"
            color="var(--speaking-brown, #8b6914)"
          />
        </div>

        <div style={{
          background: "var(--bg-primary)",
          border: "1px solid var(--border)",
          borderRadius: "0.5rem",
          padding: "1rem",
          marginBottom: "1.5rem",
        }}>
          <p style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
            margin: 0,
            lineHeight: 1.6,
          }}>
            Each section is timed with auto-submit when time expires. You may pause between sections but not within them. This mirrors the real AP exam experience.
          </p>
        </div>

        <button
          onClick={onStart}
          style={{
            width: "100%",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1rem",
            fontWeight: 600,
            color: "white",
            background: "var(--accent, #c76d32)",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.875rem",
            cursor: "pointer",
            transition: "opacity 0.15s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          Begin Exam
        </button>
      </div>
    </div>
  );
}

function SectionInfoCard({ title, description, time, questions, color }: {
  title: string; description: string; time: string; questions: string; color: string;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "0.75rem",
      background: "var(--bg-primary)",
      borderRadius: "0.5rem",
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "var(--text-primary)",
        }}>{title}</div>
        <div style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
        }}>{description}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: "var(--text-primary)",
        }}>{time}</div>
        <div style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
        }}>{questions}</div>
      </div>
    </div>
  );
}

function SectionBreak({ nextSection, onResume }: { nextSection: MockExamSection; onResume: () => void }) {
  return (
    <div style={{ maxWidth: "32rem", margin: "4rem auto", textAlign: "center" }}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "2rem",
      }}>
        <h3 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 0.5rem 0",
        }}>
          Section Complete
        </h3>
        <p style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.875rem",
          color: "var(--text-muted)",
          margin: "0 0 1rem 0",
        }}>
          Take a moment to rest. The next section will be:
        </p>
        <p style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--accent)",
          margin: "0 0 1.5rem 0",
        }}>
          {getSectionLabel(nextSection)}
        </p>
        <button
          onClick={onResume}
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "white",
            background: "var(--accent, #c76d32)",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.75rem 2rem",
            cursor: "pointer",
          }}
        >
          Continue to Next Section
        </button>
      </div>
    </div>
  );
}

function ListeningSection({ exercises, questionIndex, onAnswer, onComplete, answeredCount }: {
  exercises: import("../data/listening-exercises").ListeningExercise[];
  questionIndex: number;
  onAnswer: (questionId: string, selectedIndex: number, correctIndex: number) => void;
  onComplete: () => void;
  answeredCount: number;
}) {
  const allQuestions = useMemo(() => {
    const qs: { id: string; audioText: string; question: string; options: string[]; correctIndex: number; type: string }[] = [];

    for (const ex of exercises) {
      if (ex.type === "vocabulary" || ex.type === "sentence") {
        qs.push({
          id: ex.id,
          audioText: ex.audioText,
          question: ex.type === "vocabulary"
            ? "What word or phrase did you hear?"
            : (ex as import("../data/listening-exercises").SentenceExercise).question,
          options: ex.options,
          correctIndex: ex.correctIndex,
          type: ex.type,
        });
      } else if (ex.type === "dialogue") {
        const dialogue = ex as DialogueExercise;
        const fullText = dialogue.lines.map(l => l.text).join(" ");
        for (const q of dialogue.questions) {
          qs.push({
            id: `${ex.id}-${q.question.slice(0, 20)}`,
            audioText: fullText,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            type: "dialogue",
          });
        }
      }
    }
    return qs;
  }, [exercises]);

  if (!allQuestions[questionIndex] || questionIndex >= allQuestions.length) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "var(--text-muted)" }}>
          Listening section complete ({answeredCount} questions answered)
        </p>
        <button onClick={onComplete} style={submitBtnStyle}>Continue</button>
      </div>
    );
  }

  return (
    <ListeningQuestion
      key={questionIndex}
      question={allQuestions[questionIndex]}
      questionIndex={questionIndex}
      totalQuestions={allQuestions.length}
      onAnswer={onAnswer}
    />
  );
}

function ReadingSection({ passages, questionIndex, onAnswer, onComplete, answeredCount }: {
  passages: import("../types/mock-exam").MockExamReadingPassage[];
  questionIndex: number;
  onAnswer: (questionId: string, selectedIndex: number, correctIndex: number) => void;
  onComplete: () => void;
  answeredCount: number;
}) {
  const allQuestions = useMemo(() => {
    const qs: { id: string; passage: string; passageType: string; question: string; options: string[]; correctIndex: number }[] = [];
    for (const p of passages) {
      for (const q of p.questions) {
        qs.push({
          id: q.id,
          passage: p.chinese,
          passageType: p.passageType,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
        });
      }
    }
    return qs;
  }, [passages]);

  if (!allQuestions[questionIndex] || questionIndex >= allQuestions.length) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "var(--text-muted)" }}>
          Reading section complete ({answeredCount} questions answered)
        </p>
        <button onClick={onComplete} style={submitBtnStyle}>Continue</button>
      </div>
    );
  }

  return (
    <ReadingQuestion
      key={questionIndex}
      question={allQuestions[questionIndex]}
      questionIndex={questionIndex}
      totalQuestions={allQuestions.length}
      onAnswer={onAnswer}
    />
  );
}

function WritingSection({ prompt, text, onChange, onSubmit }: {
  prompt: import("../types/mock-exam").MockExamWritingPrompt;
  text: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
}) {
  const isStory = prompt.type === "story_narration";

  return (
    <div style={{ padding: "1.5rem 0" }}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "1.5rem",
      }}>
        <h3 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 0.75rem 0",
        }}>
          {isStory ? "Story Narration" : "Email Response"}
        </h3>

        <p style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.875rem",
          color: "var(--text-muted)",
          marginBottom: "1rem",
          lineHeight: 1.6,
        }}>
          {prompt.instructions}
        </p>

        {isStory && prompt.imageDescriptions && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}>
            {prompt.imageDescriptions.map((desc, i) => (
              <div key={i} style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
                padding: "0.75rem",
                textAlign: "center",
              }}>
                <div style={{
                  fontSize: "1.5rem",
                  marginBottom: "0.25rem",
                }}>
                  {["1️⃣", "2️⃣", "3️⃣", "4️⃣"][i]}
                </div>
                <p style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  margin: 0,
                  lineHeight: 1.4,
                }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {!isStory && prompt.emailContentChinese && (
          <div style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginBottom: "1rem",
            whiteSpace: "pre-wrap",
            fontFamily: "'Noto Serif SC', Georgia, serif",
            fontSize: "0.9375rem",
            lineHeight: 1.8,
            color: "var(--text-primary)",
          }}>
            {prompt.emailContentChinese}
          </div>
        )}

        <textarea
          value={text}
          onChange={e => onChange(e.target.value)}
          placeholder={isStory ? "Write your story here in Chinese..." : "Write your email response in Chinese..."}
          style={{
            width: "100%",
            minHeight: "12rem",
            fontFamily: "'Noto Serif SC', Georgia, serif",
            fontSize: "1rem",
            lineHeight: 1.8,
            padding: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid var(--border)",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.75rem",
        }}>
          <span style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}>
            {text.length} characters
          </span>
          <button onClick={onSubmit} style={submitBtnStyle}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

function SpeakingConversationSection({ prompt, turnIndex, transcript, isRecording, onStartRecording, onStopRecording, onNextTurn, onComplete }: {
  prompt: import("../types/mock-exam").MockExamSpeakingPrompt;
  turnIndex: number;
  transcript: string;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onNextTurn: () => void;
  onComplete: () => void;
}) {
  const turns = prompt.conversationTurns ?? [];
  const currentTurn = turns[turnIndex];
  const isLastTurn = turnIndex >= turns.length - 1;

  const playPrompt = () => {
    if (currentTurn) {
      speakChinese(currentTurn);
    }
  };

  return (
    <div style={{ padding: "1.5rem 0" }}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "1.5rem",
      }}>
        <h3 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 0.5rem 0",
        }}>
          Conversation
        </h3>
        <p style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.8125rem",
          color: "var(--text-muted)",
          margin: "0 0 1rem 0",
        }}>
          {prompt.prompt}
        </p>

        <div style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          marginBottom: "0.75rem",
        }}>
          Turn {turnIndex + 1} of {turns.length}
        </div>

        {currentTurn && (
          <div style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginBottom: "1rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <button
                onClick={playPrompt}
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "white",
                  background: "var(--listening-blue, #4a90d9)",
                  border: "none",
                  borderRadius: "0.375rem",
                  padding: "0.5rem 0.75rem",
                  cursor: "pointer",
                }}
              >
                Play Prompt
              </button>
              <span style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}>~20 seconds to respond</span>
            </div>
            <p style={{
              fontFamily: "'Noto Serif SC', Georgia, serif",
              fontSize: "1rem",
              color: "var(--text-primary)",
              margin: 0,
              lineHeight: 1.6,
            }}>
              {currentTurn}
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.75rem" }}>
          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "white",
              background: isRecording ? "#e74c3c" : "var(--speaking-brown, #8b6914)",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.625rem 1rem",
              cursor: "pointer",
              animation: isRecording ? "micPulse 1.5s ease-in-out infinite" : "none",
            }}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
        </div>

        {transcript && (
          <div style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            padding: "0.75rem",
            marginBottom: "0.75rem",
            fontFamily: "'Noto Serif SC', Georgia, serif",
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            fontStyle: "italic",
          }}>
            Transcript: {transcript}
          </div>
        )}

        <button
          onClick={isLastTurn ? onComplete : onNextTurn}
          style={submitBtnStyle}
        >
          {isLastTurn ? "Finish Conversation" : "Next Turn"}
        </button>
      </div>
    </div>
  );
}

function SpeakingPresentationSection({ prompt, transcript, isRecording, isPrepPhase, onStartRecording, onStopRecording, onComplete }: {
  prompt: import("../types/mock-exam").MockExamSpeakingPrompt;
  transcript: string;
  isRecording: boolean;
  isPrepPhase: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onComplete: () => void;
}) {
  return (
    <div style={{ padding: "1.5rem 0" }}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "1.5rem",
      }}>
        <h3 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 0.5rem 0",
        }}>
          Cultural Presentation
        </h3>

        <div style={{
          background: "var(--bg-primary)",
          border: "1px solid var(--border)",
          borderRadius: "0.5rem",
          padding: "1rem",
          marginBottom: "1rem",
        }}>
          <p style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.875rem",
            color: "var(--text-primary)",
            margin: "0 0 0.5rem 0",
            lineHeight: 1.6,
          }}>
            {prompt.prompt}
          </p>
          {prompt.promptChinese && (
            <p style={{
              fontFamily: "'Noto Serif SC', Georgia, serif",
              fontSize: "0.9375rem",
              color: "var(--text-muted)",
              margin: 0,
              lineHeight: 1.6,
            }}>
              {prompt.promptChinese}
            </p>
          )}
        </div>

        {isPrepPhase ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <p style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
            }}>
              Preparation Phase
            </p>
            <p style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              marginBottom: "1rem",
            }}>
              You have 4 minutes to prepare your presentation. When ready, click the button below to begin your 2-minute presentation.
            </p>
            <button
              onClick={onStartRecording}
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "white",
                background: "var(--speaking-brown, #8b6914)",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.75rem 1.5rem",
                cursor: "pointer",
              }}
            >
              Begin Presentation
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.75rem" }}>
              <button
                onClick={isRecording ? onStopRecording : onStartRecording}
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "white",
                  background: isRecording ? "#e74c3c" : "var(--speaking-brown, #8b6914)",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.625rem 1rem",
                  cursor: "pointer",
                  animation: isRecording ? "micPulse 1.5s ease-in-out infinite" : "none",
                }}
              >
                {isRecording ? "Stop Recording" : "Resume Recording"}
              </button>
              <span style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}>2-minute presentation</span>
            </div>

            {transcript && (
              <div style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
                padding: "0.75rem",
                marginBottom: "0.75rem",
                fontFamily: "'Noto Serif SC', Georgia, serif",
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                fontStyle: "italic",
              }}>
                Transcript: {transcript}
              </div>
            )}

            <button onClick={onComplete} style={submitBtnStyle}>
              Finish Presentation
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ExamReport({ result, onDone }: { result: MockExamResult; onDone: () => void }) {
  const allResults = loadMockExamResults();
  const trendScore = predictTrendScore(allResults);

  const apScoreColor = (score: number) => {
    if (score >= 5) return "#27ae60";
    if (score >= 4) return "#2ecc71";
    if (score >= 3) return "#f39c12";
    if (score >= 2) return "#e67e22";
    return "#e74c3c";
  };

  return (
    <div style={{ maxWidth: "40rem", margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "2rem",
      }}>
        <h2 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 0.25rem 0",
          textAlign: "center",
        }}>
          Practice Exam #{result.examNumber} — Score Report
        </h2>
        <p style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.8125rem",
          color: "var(--text-muted)",
          margin: "0 0 1.5rem 0",
          textAlign: "center",
        }}>
          {result.date} — Total time: {Math.round(result.totalTimeSeconds / 60)} minutes
        </p>

        {/* AP Score */}
        <div style={{
          textAlign: "center",
          padding: "1.5rem",
          background: "var(--bg-primary)",
          borderRadius: "0.75rem",
          marginBottom: "1.5rem",
        }}>
          <div style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.25rem",
          }}>
            Predicted AP Score
          </div>
          <div style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "3.5rem",
            fontWeight: 700,
            color: apScoreColor(result.predictedAPScore),
            lineHeight: 1,
          }}>
            {result.predictedAPScore}
          </div>
          <div style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            marginTop: "0.5rem",
          }}>
            Composite: {result.compositeScore}%
          </div>
          {trendScore !== null && allResults.length >= 2 && (
            <div style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.8125rem",
              color: "var(--accent)",
              marginTop: "0.5rem",
            }}>
              Trending toward {trendScore} by exam day (May 8)
            </div>
          )}
        </div>

        {/* Section Breakdown */}
        <h3 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 0.75rem 0",
        }}>
          Section Breakdown
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {result.sectionScores.map(section => (
            <div key={section.section} style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem",
              background: "var(--bg-primary)",
              borderRadius: "0.5rem",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}>
                  {section.label}
                </div>
                <div style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                }}>
                  {section.score}/{section.maxScore}
                </div>
              </div>
              <div style={{ width: "5rem" }}>
                <div style={{
                  height: "0.375rem",
                  background: "var(--border)",
                  borderRadius: "0.25rem",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${section.percentage}%`,
                    background: section.percentage >= 70 ? "#27ae60" : section.percentage >= 50 ? "#f39c12" : "#e74c3c",
                    borderRadius: "0.25rem",
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
              <div style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: section.percentage >= 70 ? "#27ae60" : section.percentage >= 50 ? "#f39c12" : "#e74c3c",
                minWidth: "2.5rem",
                textAlign: "right",
              }}>
                {section.percentage}%
              </div>
            </div>
          ))}
        </div>

        {/* Areas to Improve */}
        <h3 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 0.75rem 0",
        }}>
          Areas to Improve
        </h3>

        <div style={{
          background: "var(--bg-primary)",
          borderRadius: "0.5rem",
          padding: "1rem",
          marginBottom: "1.5rem",
        }}>
          {result.areasToImprove.map((area, i) => (
            <p key={i} style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              margin: i === result.areasToImprove.length - 1 ? 0 : "0 0 0.5rem 0",
              lineHeight: 1.5,
            }}>
              • {area}
            </p>
          ))}
        </div>

        {/* Writing/Speaking Feedback */}
        {(result.writingResponses.length > 0 || result.speakingResponses.length > 0) && (
          <>
            <h3 style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "0 0 0.75rem 0",
            }}>
              Detailed Feedback
            </h3>

            {result.writingResponses.map((wr, i) => (
              <div key={i} style={{
                background: "var(--bg-primary)",
                borderRadius: "0.5rem",
                padding: "0.75rem",
                marginBottom: "0.5rem",
              }}>
                <div style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}>
                  Writing Task {i + 1}: {wr.score}/6
                </div>
                <p style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  margin: "0.25rem 0 0 0",
                }}>
                  {wr.feedback}
                </p>
              </div>
            ))}

            {result.speakingResponses.map((sr, i) => (
              <div key={i} style={{
                background: "var(--bg-primary)",
                borderRadius: "0.5rem",
                padding: "0.75rem",
                marginBottom: "0.5rem",
              }}>
                <div style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}>
                  Speaking Task {i + 1}: {sr.score}/6
                </div>
                <p style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  margin: "0.25rem 0 0 0",
                }}>
                  {sr.feedback}
                </p>
              </div>
            ))}
          </>
        )}

        {/* Previous Exams */}
        {allResults.length > 1 && (
          <>
            <h3 style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "1.5rem 0 0.75rem 0",
            }}>
              Score History
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "1.5rem" }}>
              {allResults.map(r => (
                <div key={r.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.5rem 0.75rem",
                  background: r.id === result.id ? "var(--bg-primary)" : "transparent",
                  borderRadius: "0.25rem",
                }}>
                  <span style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "0.8125rem",
                    color: "var(--text-muted)",
                  }}>
                    Exam #{r.examNumber} — {r.date}
                  </span>
                  <span style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: apScoreColor(r.predictedAPScore),
                  }}>
                    AP Score: {r.predictedAPScore}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <button
          onClick={onDone}
          style={{
            width: "100%",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1rem",
            fontWeight: 600,
            color: "white",
            background: "var(--accent, #c76d32)",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.875rem",
            cursor: "pointer",
          }}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

function ListeningQuestion({ question, questionIndex, totalQuestions, onAnswer }: {
  question: { id: string; audioText: string; question: string; options: string[]; correctIndex: number; type: string };
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (questionId: string, selectedIndex: number, correctIndex: number) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const playAudio = () => {
    playExerciseAudio(question.id).catch(() => {
      speakChinese(question.audioText);
    });
    setAudioPlayed(true);
  };

  const confirmAnswer = () => {
    if (selectedOption !== null) {
      onAnswer(question.id, selectedOption, question.correctIndex);
    }
  };

  return (
    <div style={{ padding: "1.5rem 0" }}>
      <div style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "0.75rem",
        color: "var(--text-muted)",
        marginBottom: "1rem",
      }}>
        Question {questionIndex + 1} of {totalQuestions}
      </div>

      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "1.5rem",
      }}>
        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={playAudio}
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "white",
              background: "var(--listening-blue, #4a90d9)",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.625rem 1.25rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {audioPlayed ? "Replay Audio" : "Play Audio"}
          </button>
        </div>

        <p style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.9375rem",
          color: "var(--text-primary)",
          marginBottom: "1rem",
        }}>
          {question.question}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelectedOption(i)}
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "0.875rem",
                textAlign: "left",
                padding: "0.75rem",
                background: selectedOption === i ? "var(--accent)" : "var(--bg-primary)",
                color: selectedOption === i ? "white" : "var(--text-primary)",
                border: `1px solid ${selectedOption === i ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "0.5rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
        </div>

        <button
          onClick={confirmAnswer}
          disabled={selectedOption === null}
          style={{
            ...submitBtnStyle,
            opacity: selectedOption === null ? 0.5 : 1,
            cursor: selectedOption === null ? "not-allowed" : "pointer",
          }}
        >
          Next Question
        </button>
      </div>
    </div>
  );
}

function ReadingQuestion({ question, questionIndex, totalQuestions, onAnswer }: {
  question: { id: string; passage: string; passageType: string; question: string; options: string[]; correctIndex: number };
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (questionId: string, selectedIndex: number, correctIndex: number) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const confirmAnswer = () => {
    if (selectedOption !== null) {
      onAnswer(question.id, selectedOption, question.correctIndex);
    }
  };

  return (
    <div style={{ padding: "1.5rem 0" }}>
      <div style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "0.75rem",
        color: "var(--text-muted)",
        marginBottom: "1rem",
      }}>
        Question {questionIndex + 1} of {totalQuestions} — {question.passageType}
      </div>

      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "1.5rem",
      }}>
        <div style={{
          background: "var(--bg-primary)",
          border: "1px solid var(--border)",
          borderRadius: "0.5rem",
          padding: "1rem",
          marginBottom: "1rem",
          whiteSpace: "pre-wrap",
          fontFamily: "'Noto Serif SC', Georgia, serif",
          fontSize: "1rem",
          lineHeight: 1.8,
          color: "var(--text-primary)",
        }}>
          {question.passage}
        </div>

        <p style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "0.9375rem",
          color: "var(--text-primary)",
          marginBottom: "1rem",
          fontWeight: 500,
        }}>
          {question.question}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelectedOption(i)}
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "0.875rem",
                textAlign: "left",
                padding: "0.75rem",
                background: selectedOption === i ? "var(--accent)" : "var(--bg-primary)",
                color: selectedOption === i ? "white" : "var(--text-primary)",
                border: `1px solid ${selectedOption === i ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "0.5rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
        </div>

        <button
          onClick={confirmAnswer}
          disabled={selectedOption === null}
          style={{
            ...submitBtnStyle,
            opacity: selectedOption === null ? 0.5 : 1,
            cursor: selectedOption === null ? "not-allowed" : "pointer",
          }}
        >
          Next Question
        </button>
      </div>
    </div>
  );
}

const submitBtnStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "white",
  background: "var(--accent, #c76d32)",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.625rem 1.25rem",
  cursor: "pointer",
};
