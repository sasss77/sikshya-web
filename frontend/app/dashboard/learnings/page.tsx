"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/lib/context/UserContext";
import {
  GraduationCap,
  PlayCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  Star,
  ChevronRight,
  BarChart2,
  TrendingUp,
  Award,
  Lock,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────── */
type CourseStatus = "in_progress" | "completed" | "not_started";

export interface Course {
  id: number;
  subject: string;
  tutorName: string;
  tutorInitials: string;
  tutorColor: string;
  progress: number;
  totalSessions: number;
  completedSessions: number;
  nextSession: string | null;
  status: CourseStatus;
  rating?: number;
  topics: { label: string; done: boolean }[];
}

import { fetchLearningsAction } from "@/lib/actions/enrollment-action";

// Helper to get initials and color from name
const getInitials = (name: string) => {
  if (!name) return "U";
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
};

const getAvatarColor = (name: string) => {
  const colors = ["#0B4085", "#0ea5e9", "#7c3aed", "#ec4899", "#f59e0b", "#22c55e"];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};



/* ─── Progress Bar ───────────────────────────────────── */
function ProgressBar({ value, color = "#0B4085" }: { value: number; color?: string }) {
  return (
    <div style={{ height: "7px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden", width: "100%" }}>
      <div style={{
        height: "100%", width: `${value}%`,
        background: value === 100 ? "#22c55e" : color,
        borderRadius: "999px",
        transition: "width 0.6s ease",
      }} />
    </div>
  );
}

/* ─── Course Card ────────────────────────────────────── */
function CourseCard({ course }: { course: Course }) {
  const [expanded, setExpanded] = useState(false);
  const isCompleted = course.status === "completed";
  const router = useRouter();

  return (
    <div style={{
      background: "#fff",
      borderRadius: "16px",
      border: "1.5px solid",
      borderColor: isCompleted ? "#bbf7d0" : "#e2e8f0",
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(11,64,133,0.05)",
      transition: "box-shadow 0.2s ease, transform 0.2s ease",
      cursor: "pointer",
    }}
    className="course-card"
    onClick={() => router.push(`/dashboard/learnings/${course.id}`)}
    >
      {/* Card Header */}
      <div style={{ padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        {/* Avatar */}
        <div style={{
          width: "50px", height: "50px", borderRadius: "50%",
          background: course.tutorColor, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: "1rem", flexShrink: 0,
        }}>
          {course.tutorInitials}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1a202c", margin: 0 }}>
              {course.subject}
            </h3>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {isCompleted ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.75rem", borderRadius: "999px", background: "#dcfce7", color: "#16a34a" }}>
                  <CheckCircle2 size={12} /> Completed
                </span>
              ) : (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.75rem", borderRadius: "999px", background: "#e8eef7", color: "#0B4085" }}>
                  <PlayCircle size={12} /> In Progress
                </span>
              )}
            </div>
          </div>

          <p style={{ fontSize: "0.8rem", color: "#64748b", margin: "0 0 0.9rem", fontWeight: 500 }}>
            Tutor: <strong style={{ color: "#374151" }}>{course.tutorName}</strong>
          </p>

          {/* Progress */}
          <div style={{ marginBottom: "0.6rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                {course.completedSessions}/{course.totalSessions} sessions completed
              </span>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: isCompleted ? "#16a34a" : "#0B4085" }}>
                {course.progress}%
              </span>
            </div>
            <ProgressBar value={course.progress} color={course.tutorColor} />
          </div>

          {/* Meta Row */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {course.nextSession && (
              <span style={{ fontSize: "0.78rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Clock size={13} color="#0B4085" /> Next: {course.nextSession}
              </span>
            )}
            {isCompleted && course.rating && (
              <span style={{ fontSize: "0.78rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={13} fill={s <= course.rating! ? "#f59e0b" : "none"} color="#f59e0b" />
                ))}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Topics Accordion */}
      <div style={{ borderTop: "1px solid #f1f5f9" }}>
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.8rem 1.5rem", background: "none", border: "none",
            cursor: "pointer", fontSize: "0.825rem", fontWeight: 600, color: "#64748b",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <BookOpen size={14} color="#94a3b8" /> {expanded ? "Hide" : "View"} Topics ({course.topics.filter(t => t.done).length}/{course.topics.length} done)
          </span>
          <ChevronRight size={16} style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
        </button>

        {expanded && (
          <div style={{ padding: "0.5rem 1.5rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {course.topics.map((t, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.5rem 0.75rem", borderRadius: "8px",
                background: t.done ? "#f0fdf4" : "#f8fafc",
              }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: t.done ? "#22c55e" : "#e2e8f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {t.done
                    ? <CheckCircle2 size={12} color="#fff" />
                    : <Lock size={10} color="#94a3b8" />
                  }
                </div>
                <span style={{ fontSize: "0.845rem", fontWeight: 500, color: t.done ? "#15803d" : "#64748b" }}>
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Stats Card ─────────────────────────────────────── */
function StatCard({ icon: Icon, value, label, color, bg }: { icon: React.ElementType; value: string | number; label: string; color: string; bg: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: "14px", padding: "1.25rem 1.5rem", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "1rem" }}>
      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={21} color={color} />
      </div>
      <div>
        <p style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a202c", margin: 0 }}>{value}</p>
        <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0, fontWeight: 500 }}>{label}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────── */
export default function LearningsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CourseStatus>("not_started");
  const [learnings, setLearnings] = useState<Course[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const loadLearnings = async () => {
    const res = await fetchLearningsAction();
    if (res.success) {
      setLearnings(res.data.map((l: any) => ({
        id: l.id,
        subject: l.subject || l.courseName || "Course",
        tutorName: l.tutorName,
        tutorInitials: getInitials(l.tutorName),
        tutorColor: getAvatarColor(l.tutorName),
        progress: l.progress,
        totalSessions: l.totalSessions,
        completedSessions: l.completedSessions,
        nextSession: l.nextSession || null,
        status: l.status || "not_started",
        topics: l.topics,
      })));
    } else {
      setToast({ message: res.error || "Failed to load learnings", type: "error" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    else if (user && user.role === "student") loadLearnings();
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  // Tutors don't have a "learnings" concept
  if (user.role === "tutor") {
    return (
      <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "3rem 2.5rem", textAlign: "center", border: "1px solid #e2e8f0", maxWidth: "420px" }}>
          <GraduationCap size={48} color="#0B4085" style={{ margin: "0 auto 1rem" }} />
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.75rem" }}>Students Only</h2>
          <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
            My Learnings is designed for students to track their learning progress. As a tutor, check your <strong>My Bookings</strong> page to manage your sessions.
          </p>
          <button
            onClick={() => router.push("/dashboard/bookings")}
            style={{ background: "#0B4085", color: "#fff", border: "none", borderRadius: "8px", padding: "0.65rem 1.5rem", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const notStarted = learnings.filter(c => c.status === "not_started");
  const inProgress = learnings.filter(c => c.status === "in_progress");
  const completed = learnings.filter(c => c.status === "completed");
  const totalSessionsDone = learnings.reduce((sum, c) => sum + c.completedSessions, 0);
  const avgProgress = learnings.length > 0 ? Math.round(learnings.reduce((sum, c) => sum + c.progress, 0) / learnings.length) : 0;

  const TABS = [
    { key: "not_started" as const, label: `Not Started (${notStarted.length})` },
    { key: "in_progress" as const, label: `In Progress (${inProgress.length})` },
    { key: "completed" as const, label: `Completed (${completed.length})` },
  ];

  return (
    <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Page Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #0B4085, #1a56b3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={20} color="#fff" />
            </div>
            <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 900, color: "#1a202c", margin: 0, letterSpacing: "-0.02em" }}>
              My Learnings
            </h1>
          </div>
          <p style={{ fontSize: "0.95rem", color: "#64748b", margin: 0 }}>
            Browse available courses, start learning, and track your progress across all subjects.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <StatCard icon={BookOpen} value={learnings.length} label="Enrolled Subjects" color="#0B4085" bg="#e8eef7" />
          <StatCard icon={CheckCircle2} value={completed.length} label="Completed" color="#16a34a" bg="#dcfce7" />
          <StatCard icon={TrendingUp} value={totalSessionsDone} label="Sessions Done" color="#8b5cf6" bg="#f3e8ff" />
          <StatCard icon={BarChart2} value={`${avgProgress}%`} label="Avg. Progress" color="#f59e0b" bg="#fef3c7" />
        </div>

        {/* Overall Progress Banner */}
        <div style={{
          background: "linear-gradient(135deg, #0B4085 0%, #1a56b3 100%)",
          borderRadius: "16px", padding: "1.5rem 2rem", marginBottom: "2rem",
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, opacity: 0.8, margin: "0 0 0.25rem" }}>Overall Learning Progress</p>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 900, margin: 0 }}>{avgProgress}%</h2>
          </div>
          <div style={{ flex: 1, minWidth: "200px", maxWidth: "400px" }}>
            <div style={{ height: "12px", background: "rgba(255,255,255,0.2)", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${avgProgress}%`, background: "#fff", borderRadius: "999px", transition: "width 0.6s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>0%</span>
              <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>100%</span>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <Award size={40} color="rgba(255,255,255,0.4)" />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0" }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "0.6rem 1rem", fontSize: "0.875rem", fontWeight: 600,
                color: activeTab === tab.key ? "#0B4085" : "#64748b",
                borderBottom: activeTab === tab.key ? "2px solid #0B4085" : "2px solid transparent",
                transition: "all 0.15s ease", whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {activeTab === "not_started" && (
            notStarted.length === 0 ? (
              <EmptyState message="No courses added yet. Browse tutors and add courses to your learnings!" />
            ) : (
              notStarted.map(course => <CourseCard key={course.id} course={course} />)
            )
          )}

          {activeTab === "in_progress" && (
            inProgress.length === 0 ? (
              <EmptyState message="You haven't started any courses yet." />
            ) : (
              inProgress.map(course => <CourseCard key={course.id} course={course} />)
            )
          )}

          {activeTab === "completed" && (
            completed.length === 0 ? (
              <EmptyState message="You haven't completed any courses yet." />
            ) : (
              completed.map(course => <CourseCard key={course.id} course={course} />)
            )
          )}
        </div>

      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed", top: "5rem", right: "2rem", zIndex: 1000,
          background: toast.type === "success" ? "#22c55e" : "#ef4444",
          color: "#fff", padding: "1rem 1.5rem", borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          display: "flex", alignItems: "center", gap: "0.75rem",
          fontWeight: 600, fontSize: "0.95rem",
          animation: "toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .course-card:hover {
          box-shadow: 0 8px 28px rgba(11,64,133,0.1) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: "14px", padding: "3rem", textAlign: "center", border: "1px solid #e2e8f0" }}>
      <GraduationCap size={40} color="#cbd5e0" style={{ margin: "0 auto 1rem" }} />
      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.5rem" }}>Nothing here yet</h3>
      <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>{message}</p>
    </div>
  );
}


