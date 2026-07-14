"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import {
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  RotateCcw,
  Lock,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────── */
interface MCQOption {
  label: string;
  text: string;
}

interface MCQQuestion {
  id: number;
  question: string;
  options: MCQOption[];
  correct: string;
  explanation: string;
}

interface QuizState {
  selectedAnswers: Record<number, string>;
  submitted: boolean;
  score: number;
}

/* ─── Dummy MCQ Data ─────────────────────────────────── */
const SAMPLE_MCQS: MCQQuestion[] = [
  {
    id: 1,
    question: "What is Newton's Second Law of Motion?",
    options: [
      { label: "A", text: "An object at rest stays at rest unless acted upon" },
      { label: "B", text: "Force equals mass times acceleration (F = ma)" },
      { label: "C", text: "For every action, there is an equal and opposite reaction" },
      { label: "D", text: "Energy cannot be created or destroyed" },
    ],
    correct: "B",
    explanation: "Newton's Second Law states that the net force on an object equals its mass multiplied by its acceleration (F = ma).",
  },
  {
    id: 2,
    question: "Which of the following is the SI unit of electric current?",
    options: [
      { label: "A", text: "Volt" },
      { label: "B", text: "Watt" },
      { label: "C", text: "Ampere" },
      { label: "D", text: "Ohm" },
    ],
    correct: "C",
    explanation: "The SI unit of electric current is the Ampere (A), named after André-Marie Ampère.",
  },
  {
    id: 3,
    question: "What is the powerhouse of the cell?",
    options: [
      { label: "A", text: "Nucleus" },
      { label: "B", text: "Endoplasmic Reticulum" },
      { label: "C", text: "Golgi Apparatus" },
      { label: "D", text: "Mitochondria" },
    ],
    correct: "D",
    explanation: "Mitochondria are known as the powerhouse of the cell because they generate most of the cell's ATP through cellular respiration.",
  },
  {
    id: 4,
    question: "What is the value of acceleration due to gravity on Earth's surface?",
    options: [
      { label: "A", text: "9.0 m/s²" },
      { label: "B", text: "9.8 m/s²" },
      { label: "C", text: "10.8 m/s²" },
      { label: "D", text: "8.9 m/s²" },
    ],
    correct: "B",
    explanation: "The standard acceleration due to gravity on Earth's surface is approximately 9.8 m/s² (often rounded to 10 m/s² for simplicity).",
  },
];

const SUBJECTS = [
  "Physics", "Chemistry", "Biology", "Mathematics",
  "Economics", "Accounting", "English", "Computer Science",
];

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];
const QUESTION_COUNTS = [5, 10, 15, 20];

/* ─── Question Card ──────────────────────────────────── */
function QuestionCard({
  question, index, selectedAnswer, submitted,
  onSelect,
}: {
  question: MCQQuestion;
  index: number;
  selectedAnswer?: string;
  submitted: boolean;
  onSelect: (qId: number, opt: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isCorrect = selectedAnswer === question.correct;

  return (
    <div style={{
      background: "#fff", borderRadius: "14px",
      border: submitted
        ? selectedAnswer
          ? isCorrect ? "1.5px solid #22c55e" : "1.5px solid #ef4444"
          : "1.5px solid #e2e8f0"
        : "1px solid #e2e8f0",
      padding: "1.5rem", marginBottom: "1rem",
      transition: "box-shadow 0.2s ease",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      {/* Question Header */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "50%",
          background: "var(--color-primary-light)", color: "#0B4085",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.8rem", fontWeight: 700, flexShrink: 0,
        }}>
          {index + 1}
        </div>
        <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1a202c", margin: 0, lineHeight: 1.5 }}>
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {question.options.map(opt => {
          const isSelected = selectedAnswer === opt.label;
          const isRight = opt.label === question.correct;
          let bg = "#f8fafc", border = "#e2e8f0", textColor = "#374151";

          if (submitted) {
            if (isRight) { bg = "#dcfce7"; border = "#22c55e"; textColor = "#166534"; }
            else if (isSelected && !isRight) { bg = "#fee2e2"; border = "#ef4444"; textColor = "#991b1b"; }
          } else if (isSelected) {
            bg = "#e8eef7"; border = "#0B4085"; textColor = "#0B4085";
          }

          return (
            <button
              key={opt.label}
              onClick={() => !submitted && onSelect(question.id, opt.label)}
              disabled={submitted}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                background: bg, border: `1.5px solid ${border}`,
                borderRadius: "10px", padding: "0.65rem 1rem",
                cursor: submitted ? "default" : "pointer",
                textAlign: "left", width: "100%",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{
                width: "24px", height: "24px", borderRadius: "50%",
                background: isSelected || (submitted && isRight) ? border : "#e2e8f0",
                color: isSelected || (submitted && isRight) ? "#fff" : "#64748b",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.72rem", fontWeight: 700, flexShrink: 0,
              }}>
                {opt.label}
              </span>
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: textColor }}>{opt.text}</span>
              {submitted && isRight && <CheckCircle size={16} color="#22c55e" style={{ marginLeft: "auto" }} />}
              {submitted && isSelected && !isRight && <XCircle size={16} color="#ef4444" style={{ marginLeft: "auto" }} />}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {submitted && (
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={() => setExpanded(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "none", border: "none", cursor: "pointer",
              fontSize: "0.8rem", fontWeight: 600, color: "#0B4085", padding: 0,
            }}
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            {expanded ? "Hide" : "Show"} Explanation
          </button>
          {expanded && (
            <div style={{
              marginTop: "0.75rem", background: "#f0f7ff",
              border: "1px solid #bfdbfe", borderRadius: "10px",
              padding: "0.9rem 1rem", fontSize: "0.85rem",
              color: "#1e40af", lineHeight: 1.6,
            }}>
              {question.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────── */
export default function MCQGeneratorPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState(5);
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [quizState, setQuizState] = useState<QuizState>({
    selectedAnswers: {}, submitted: false, score: 0,
  });

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={32} color="#0B4085" style={{ animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  // Access guard: only students
  if (!loading && user && user.role !== "student") {
    return (
      <div style={{ background: "#f4f6fa", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "3rem 2.5rem", textAlign: "center", border: "1px solid #e2e8f0", maxWidth: "420px" }}>
          <Lock size={48} color="#0B4085" style={{ margin: "0 auto 1rem" }} />
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.75rem" }}>Students Only</h2>
          <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
            The MCQ Generator is a learning tool designed exclusively for students. Tutors can access other features from their dashboard.
          </p>
          <button
            onClick={() => router.push("/")}
            style={{
              background: "#0B4085", color: "#fff", border: "none",
              borderRadius: "8px", padding: "0.65rem 1.5rem", fontSize: "0.875rem",
              fontWeight: 600, cursor: "pointer",
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleGenerate = () => {
    setGenerating(true);
    setQuizState({ selectedAnswers: {}, submitted: false, score: 0 });
    // Simulate AI generation — will be replaced with real API later
    setTimeout(() => {
      setQuestions(SAMPLE_MCQS.slice(0, count > SAMPLE_MCQS.length ? SAMPLE_MCQS.length : count));
      setGenerating(false);
    }, 1800);
  };

  const handleSelect = (qId: number, option: string) => {
    setQuizState(prev => ({
      ...prev,
      selectedAnswers: { ...prev.selectedAnswers, [qId]: option },
    }));
  };

  const handleSubmit = () => {
    const score = questions.filter(q => quizState.selectedAnswers[q.id] === q.correct).length;
    setQuizState(prev => ({ ...prev, submitted: true, score }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setQuizState({ selectedAnswers: {}, submitted: false, score: 0 });
    setQuestions([]);
  };

  const answeredCount = Object.keys(quizState.selectedAnswers).length;
  const percentage = questions.length > 0 ? Math.round((quizState.score / questions.length) * 100) : 0;

  return (
    <div style={{ background: "#f4f6fa", minHeight: "100vh" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "12px",
              background: "linear-gradient(135deg, #0B4085, #1a56b3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={22} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#1a202c", margin: 0, letterSpacing: "-0.02em" }}>
                MCQ Generator
              </h1>
              <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>AI-powered · Powered by Gemini</p>
            </div>
          </div>
          <p style={{ fontSize: "0.95rem", color: "#64748b", margin: 0, maxWidth: "540px" }}>
            Generate practice multiple-choice questions on any subject instantly. Test your knowledge and get detailed explanations.
          </p>
        </div>

        {/* Score Banner */}
        {quizState.submitted && (
          <div style={{
            background: percentage >= 80 ? "linear-gradient(135deg, #16a34a, #22c55e)" : percentage >= 50 ? "linear-gradient(135deg, #d97706, #f59e0b)" : "linear-gradient(135deg, #dc2626, #ef4444)",
            borderRadius: "14px", padding: "1.5rem 2rem", marginBottom: "1.5rem",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, opacity: 0.85, margin: "0 0 0.25rem" }}>Your Score</p>
              <h2 style={{ fontSize: "2rem", fontWeight: 900, margin: 0 }}>{quizState.score}/{questions.length}</h2>
              <p style={{ fontSize: "0.875rem", margin: "0.25rem 0 0", opacity: 0.9 }}>
                {percentage}% · {percentage >= 80 ? "Excellent! 🎉" : percentage >= 50 ? "Good effort! Keep practising." : "Keep studying! You can do it."}
              </p>
            </div>
            <button
              onClick={handleReset}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.5)",
                borderRadius: "10px", padding: "0.6rem 1.25rem",
                color: "#fff", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
              }}
            >
              <RotateCcw size={15} /> Try Again
            </button>
          </div>
        )}

        {/* Config Card */}
        {!questions.length && (
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.75rem", marginBottom: "1.5rem", boxShadow: "0 2px 12px rgba(11,64,133,0.06)" }}>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1a202c", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BookOpen size={18} color="#0B4085" /> Configure Your Quiz
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.4rem" }}>Subject</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  style={{
                    width: "100%", padding: "0.65rem 1rem", borderRadius: "8px",
                    border: "1.5px solid #e2e8f0", fontSize: "0.875rem",
                    color: "#1a202c", background: "#fff", cursor: "pointer", outline: "none",
                  }}
                >
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.4rem" }}>Difficulty</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {DIFFICULTY_LEVELS.map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      style={{
                        flex: 1, padding: "0.65rem 0", borderRadius: "8px",
                        border: `1.5px solid ${difficulty === d ? "#0B4085" : "#e2e8f0"}`,
                        background: difficulty === d ? "#e8eef7" : "#fff",
                        color: difficulty === d ? "#0B4085" : "#64748b",
                        fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.4rem" }}>Number of Questions</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {QUESTION_COUNTS.map(n => (
                    <button
                      key={n}
                      onClick={() => setCount(n)}
                      style={{
                        flex: 1, padding: "0.65rem 0", borderRadius: "8px",
                        border: `1.5px solid ${count === n ? "#0B4085" : "#e2e8f0"}`,
                        background: count === n ? "#e8eef7" : "#fff",
                        color: count === n ? "#0B4085" : "#64748b",
                        fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.4rem" }}>
                  Specific Topic <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder={`e.g. Thermodynamics, Calculus...`}
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  style={{
                    width: "100%", padding: "0.65rem 1rem", borderRadius: "8px",
                    border: "1.5px solid #e2e8f0", fontSize: "0.875rem",
                    color: "#1a202c", outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                gap: "0.6rem", background: "linear-gradient(135deg, #0B4085, #1a56b3)",
                color: "#fff", border: "none", borderRadius: "10px",
                padding: "0.85rem 2rem", fontSize: "0.95rem", fontWeight: 700,
                cursor: generating ? "not-allowed" : "pointer",
                opacity: generating ? 0.8 : 1,
                transition: "all 0.2s ease",
                boxShadow: "0 4px 14px rgba(11,64,133,0.3)",
              }}
            >
              {generating ? (
                <>
                  <Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} />
                  Generating questions with AI...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate {count} MCQs on {subject}
                </>
              )}
            </button>

            <p style={{ fontSize: "0.72rem", color: "#94a3b8", textAlign: "center", marginTop: "0.75rem" }}>
              🤖 AI generation will be powered by Gemini. Currently showing sample questions.
            </p>
          </div>
        )}

        {/* Questions */}
        {questions.length > 0 && !quizState.submitted && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.2rem" }}>
                  {subject} · {difficulty}
                </h2>
                <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>
                  {answeredCount}/{questions.length} answered
                </p>
              </div>
              <button
                onClick={handleReset}
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  background: "none", border: "1px solid #e2e8f0",
                  borderRadius: "8px", padding: "0.45rem 0.9rem",
                  fontSize: "0.8rem", fontWeight: 600, color: "#64748b", cursor: "pointer",
                }}
              >
                <Trash2 size={14} /> New Quiz
              </button>
            </div>

            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                selectedAnswer={quizState.selectedAnswers[q.id]}
                submitted={quizState.submitted}
                onSelect={handleSelect}
              />
            ))}

            <button
              onClick={handleSubmit}
              disabled={answeredCount < questions.length}
              style={{
                width: "100%", padding: "0.9rem", fontSize: "0.95rem", fontWeight: 700,
                background: answeredCount === questions.length ? "linear-gradient(135deg, #0B4085, #1a56b3)" : "#e2e8f0",
                color: answeredCount === questions.length ? "#fff" : "#94a3b8",
                border: "none", borderRadius: "12px",
                cursor: answeredCount === questions.length ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                boxShadow: answeredCount === questions.length ? "0 4px 14px rgba(11,64,133,0.25)" : "none",
              }}
            >
              {answeredCount < questions.length
                ? `Answer all questions to submit (${questions.length - answeredCount} remaining)`
                : "Submit Quiz"}
            </button>
          </div>
        )}

        {/* Reviewed Questions after Submit */}
        {quizState.submitted && questions.length > 0 && (
          <div>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1a202c", margin: "0 0 1.25rem" }}>Review Answers</h2>
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                selectedAnswer={quizState.selectedAnswers[q.id]}
                submitted={quizState.submitted}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        select:focus, input:focus { border-color: #0B4085 !important; box-shadow: 0 0 0 3px rgba(11,64,133,0.1); }
      `}</style>
    </div>
  );
}
