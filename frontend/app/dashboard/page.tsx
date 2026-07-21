"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/lib/context/UserContext";
import {
  Calendar,
  GraduationCap,
  Sparkles,
  BookOpen,
  Bell,
  MessageSquare,
  ChevronRight,
  Star,
  Clock,
  TrendingUp,
  Video,
  Search,
  ArrowRight,
  CheckCircle2,
  Target,
  Award,
  BarChart3,
  Flame,
  Users,
  BookMarked,
  ArrowUpRight,
  XCircle,
} from "lucide-react";

const QUICK_ACTIONS_STUDENT = [
  {
    icon: Search,
    label: "Find Tutors",
    href: "/find-tutors",
    color: "#0B4085",
    bg: "#e8eef7",
  },
  {
    icon: Calendar,
    label: "My Bookings",
    href: "/dashboard/bookings",
    color: "#0ea5e9",
    bg: "#e0f2fe",
  },
  {
    icon: GraduationCap,
    label: "My Learnings",
    href: "/dashboard/learnings",
    color: "#8b5cf6",
    bg: "#f3e8ff",
  },
  {
    icon: Sparkles,
    label: "MCQ Generator",
    href: "/dashboard/mcq",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
  {
    icon: MessageSquare,
    label: "Messages",
    href: "/dashboard/messages",
    color: "#22c55e",
    bg: "#dcfce7",
  },
  {
    icon: Bell,
    label: "Notifications",
    href: "/dashboard/notifications",
    color: "#ef4444",
    bg: "#fee2e2",
  },
];

const QUICK_ACTIONS_TUTOR = [
  {
    icon: Calendar,
    label: "My Sessions",
    href: "/dashboard/bookings",
    color: "#0B4085",
    bg: "#e8eef7",
  },
  {
    icon: BookOpen,
    label: "My Courses",
    href: "/dashboard/my-courses",
    color: "#0ea5e9",
    bg: "#e0f2fe",
  },
  {
    icon: MessageSquare,
    label: "Messages",
    href: "/dashboard/messages",
    color: "#8b5cf6",
    bg: "#f3e8ff",
  },
  {
    icon: Bell,
    label: "Notifications",
    href: "/dashboard/notifications",
    color: "#ef4444",
    bg: "#fee2e2",
  },
  {
    icon: Target,
    label: "Profile Setup",
    href: "/dashboard/tutor-profile",
    color: "#22c55e",
    bg: "#dcfce7",
  },
  {
    icon: Activity,
    label: "Recent Activity",
    href: "/dashboard/recent-activity",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
];


/* ─── Sub-components ─────────────────────────────────── */
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  bg,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "1.5rem",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
      className="stat-card"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={22} color={color} />
        </div>
        {trend && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.2rem",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#22c55e",
              background: "#dcfce7",
              padding: "0.2rem 0.5rem",
              borderRadius: "999px",
            }}
          >
            <ArrowUpRight size={10} /> {trend}
          </span>
        )}
      </div>
      <div>
        <p
          style={{
            fontSize: "2rem",
            fontWeight: 900,
            color: "#1a202c",
            margin: 0,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "#64748b",
            margin: "0.3rem 0 0",
          }}
        >
          {label}
        </p>
        {sub && (
          <p
            style={{
              fontSize: "0.72rem",
              color: "#94a3b8",
              margin: "0.1rem 0 0",
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div
      style={{
        height: "8px",
        background: "#f1f5f9",
        borderRadius: "999px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${value}%`,
          background: color,
          borderRadius: "999px",
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}

/* ─── Student Dashboard ──────────────────────────────── */
import { fetchStudentDashboardAction } from "@/lib/actions/student-action";

function StudentDashboard({ name }: { name: string }) {
  const firstName = name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchStudentDashboardAction().then((res) => {
      if (res.success) setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "4px solid #e2e8f0",
            borderTopColor: "#0B4085",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  const UPCOMING = data?.upcoming || [];
  const IN_PROGRESS = data?.inProgress || [];
  const RECENT_ACTIVITY = data?.recentActivity || [];
  const stats = data?.stats || {
    upcomingSessions: 0,
    activeCourses: 0,
    sessionsDone: 0,
    hoursLearned: 0,
  };

  const totalProgress =
    IN_PROGRESS.length > 0
      ? Math.round(
          IN_PROGRESS.reduce((a: any, c: any) => a + c.progress, 0) /
            IN_PROGRESS.length,
        )
      : 0;

  return (
    <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
        }}
      >
        {/* ── Hero Banner ── */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #0B4085 0%, #1a56b3 55%, #0ea5e9 100%)",
            borderRadius: "24px",
            padding: "2.5rem 3rem",
            marginBottom: "2rem",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 12px 40px rgba(11,64,133,0.22)",
          }}
        >
          {/* Decorative blobs */}
          <div
            style={{
              position: "absolute",
              right: "-60px",
              top: "-60px",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "120px",
              bottom: "-80px",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "40%",
              top: "-30px",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
            }}
          />

          <div style={{ position: "relative" }}>
            <p
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                opacity: 0.8,
                margin: "0 0 0.35rem",
              }}
            >
              {greeting} 👋
            </p>
            <h1
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 900,
                margin: "0 0 0.6rem",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back, {firstName}!
            </h1>
            <p
              style={{
                fontSize: "0.9rem",
                opacity: 0.8,
                margin: "0 0 1.5rem",
                maxWidth: "420px",
              }}
            >
              You have <strong>{UPCOMING.length} upcoming sessions</strong> this
              week. Keep up the great work!
            </p>
            {/* Progress badge */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(255,255,255,0.15)",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  borderRadius: "999px",
                  padding: "0.4rem 1rem",
                }}
              >
                <Target size={14} color="#34d399" />
                <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                  {totalProgress}% avg. progress
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <Link
              href="/find-tutors"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#fff",
                color: "#0B4085",
                borderRadius: "12px",
                padding: "0.75rem 1.5rem",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 800,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <Search size={16} /> Find Tutors
            </Link>
            <Link
              href="/dashboard/learnings"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(255,255,255,0.15)",
                border: "1.5px solid rgba(255,255,255,0.3)",
                borderRadius: "12px",
                padding: "0.7rem 1.4rem",
                color: "#fff",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              <GraduationCap size={16} /> My Learnings
            </Link>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <StatCard
            icon={Calendar}
            value={stats.upcomingSessions}
            label="Upcoming Sessions"
            sub="This week"
            color="#0B4085"
            bg="#e8eef7"
            trend="+1"
          />
          <StatCard
            icon={GraduationCap}
            value={stats.activeCourses}
            label="Active Courses"
            sub="In progress"
            color="#8b5cf6"
            bg="#f3e8ff"
          />
          <StatCard
            icon={CheckCircle2}
            value={stats.sessionsDone}
            label="Sessions Done"
            sub="Total"
            color="#22c55e"
            bg="#dcfce7"
            trend="+2"
          />
        </div>

        {/* ── Main Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: "1.5rem",
          }}
        >
          {/* Left Column */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Course Progress Summary */}
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 1px 8px rgba(11,64,133,0.04)",
              }}
            >
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#1a202c",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <BarChart3 size={17} color="#8b5cf6" /> Course Progress
                </h2>
                <Link
                  href="/dashboard/learnings"
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#8b5cf6",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  View all <ChevronRight size={14} />
                </Link>
              </div>
              <div style={{ padding: "0.5rem 0" }}>
                {IN_PROGRESS.map((course: any, i: number) => (
                  <Link
                    key={course.id}
                    href="/dashboard/learnings"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        padding: "1rem 1.5rem",
                        borderBottom:
                          i < IN_PROGRESS.length - 1
                            ? "1px solid #f8fafc"
                            : "none",
                        transition: "background 0.12s",
                      }}
                      className="course-row"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.6rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                          }}
                        >
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "10px",
                              background: course.color + "18",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <BookMarked size={16} color={course.color} />
                          </div>
                          <div>
                            <p
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: 700,
                                color: "#1a202c",
                                margin: "0 0 0.1rem",
                              }}
                            >
                              {course.subject}
                            </p>
                            <p
                              style={{
                                fontSize: "0.75rem",
                                color: "#64748b",
                                margin: 0,
                              }}
                            >
                              with {course.tutor} · {course.modules}/
                              {course.total} modules
                            </p>
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: "1rem",
                            fontWeight: 900,
                            color: course.color,
                          }}
                        >
                          {course.progress}%
                        </span>
                      </div>
                      <ProgressBar
                        value={course.progress}
                        color={course.color}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 1px 8px rgba(11,64,133,0.04)",
              }}
            >
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#1a202c",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Calendar size={17} color="#0B4085" /> Upcoming Sessions
                </h2>
                <Link
                  href="/dashboard/bookings"
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#0B4085",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  View all <ChevronRight size={14} />
                </Link>
              </div>
              <div>
                {UPCOMING.map((s: any, i: number) => (
                  <div
                    key={s.id}
                    style={{
                      padding: "1.1rem 1.5rem",
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      borderBottom:
                        i < UPCOMING.length - 1 ? "1px solid #f8fafc" : "none",
                    }}
                  >
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "50%",
                        background: s.color,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        flexShrink: 0,
                        boxShadow: `0 4px 10px ${s.color}44`,
                      }}
                    >
                      {s.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          color: "#1a202c",
                          margin: "0 0 0.15rem",
                        }}
                      >
                        {s.tutor}
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#64748b",
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <BookOpen size={12} color="#0B4085" /> {s.subject}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: "#1a202c",
                          margin: "0 0 0.1rem",
                        }}
                      >
                        {s.date}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Clock size={11} /> {s.time} · {s.duration}
                      </p>
                    </div>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        background: "linear-gradient(135deg, #0B4085, #1a56b3)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.5rem 0.9rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(11,64,133,0.25)",
                      }}
                    >
                      <Video size={12} /> Join
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 1px 8px rgba(11,64,133,0.04)",
              }}
            >
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#1a202c",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Clock size={17} color="#64748b" /> Recent Activity
                </h2>
              </div>
              <div style={{ padding: "0.5rem 0" }}>
                {RECENT_ACTIVITY.length === 0 ? (
                  <p
                    style={{
                      padding: "1rem 1.5rem",
                      fontSize: "0.85rem",
                      color: "#64748b",
                      margin: 0,
                    }}
                  >
                    No recent activity yet.
                  </p>
                ) : (
                  RECENT_ACTIVITY.map((item: any, i: number) => {
                    let Icon = CheckCircle2;
                    let color = "#22c55e";
                    if (item.type === "booking") {
                      Icon = Calendar;
                      color = "#0B4085";
                    } else if (item.type === "message") {
                      Icon = BookOpen;
                      color = "#8b5cf6";
                    }

                    // Format time
                    const timeStr = new Date(item.time).toLocaleDateString();

                    return (
                      <div
                        key={i}
                        style={{
                          padding: "0.85rem 1.5rem",
                          display: "flex",
                          gap: "0.85rem",
                          alignItems: "flex-start",
                          borderBottom:
                            i < RECENT_ACTIVITY.length - 1
                              ? "1px solid #f8fafc"
                              : "none",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: color + "18",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: "0.1rem",
                          }}
                        >
                          <Icon size={15} color={color} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p
                            style={{
                              fontSize: "0.85rem",
                              color: "#334155",
                              margin: "0 0 0.1rem",
                              fontWeight: 500,
                            }}
                          >
                            {item.text}
                          </p>
                          <p
                            style={{
                              fontSize: "0.72rem",
                              color: "#94a3b8",
                              margin: 0,
                            }}
                          >
                            {timeStr}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Quick Actions */}
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "1.25rem",
                boxShadow: "0 1px 8px rgba(11,64,133,0.04)",
              }}
            >
              <h2
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#1a202c",
                  margin: "0 0 1rem",
                }}
              >
                Quick Actions
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.65rem",
                }}
              >
                {QUICK_ACTIONS_STUDENT.map(
                  ({ icon: Icon, label, href, color, bg }) => (
                    <Link
                      key={href}
                      href={href}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        padding: "0.9rem 0.5rem",
                        background: bg,
                        borderRadius: "12px",
                        textDecoration: "none",
                        transition:
                          "transform 0.15s ease, box-shadow 0.15s ease",
                        border: "1px solid transparent",
                      }}
                      className="quick-action-card"
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                      >
                        <Icon size={18} color={color} />
                      </div>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: color,
                          textAlign: "center",
                        }}
                      >
                        {label}
                      </span>
                    </Link>
                  ),
                )}
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Tutor Dashboard ────────────────────────────────── */
import { fetchBookingsAction } from "@/lib/actions/booking-action";
import { fetchMyTutorProfileAction } from "@/lib/actions/tutor-action";
import { Activity } from "lucide-react";

// Helpers
const getInitials = (name: string) => {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
};

const getAvatarColor = (name: string) => {
  const colors = ["#0B4085", "#0ea5e9", "#7c3aed", "#ec4899", "#f59e0b", "#22c55e"];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

function TutorDashboard({ name }: { name: string }) {
  const firstName = name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [loading, setLoading] = React.useState(true);
  const [bookings, setBookings] = React.useState<any[]>([]);
  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    Promise.all([fetchBookingsAction(), fetchMyTutorProfileAction()]).then(
      ([bRes, pRes]) => {
        if (bRes.success) setBookings(bRes.data);
        if (pRes.success) setProfile(pRes.data);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  // Derive stats
  const upcomingBookings = bookings.filter((b) => b.status === "upcoming");
  const completedBookings = bookings.filter((b) => b.status === "completed");
  
  const totalEarned = completedBookings.reduce(
    (sum, b) => sum + parseInt(b.price?.toString().replace(/\D/g, "") || "0"),
    0
  );

  // Active Students (unique students with upcoming or completed sessions)
  const activeStudentsMap = new Map();
  bookings
    .filter((b) => b.status === "upcoming" || b.status === "completed")
    .forEach((b) => {
      if (!activeStudentsMap.has(b.studentName)) {
        activeStudentsMap.set(b.studentName, {
          name: b.studentName,
          initials: getInitials(b.studentName),
          color: getAvatarColor(b.studentName),
          subject: b.subject,
          sessions: 0,
        });
      }
      if (b.status === "completed") {
        activeStudentsMap.get(b.studentName).sessions += 1;
      }
    });
  const activeStudents = Array.from(activeStudentsMap.values());

  // Recent Activity (derived from recent bookings or status updates)
  const recentActivity = bookings
    .slice(0, 4)
    .map((b) => {
      if (b.status === "pending") {
        return { icon: Bell, text: `New booking request from ${b.studentName}`, time: new Date(b.createdAt).toLocaleDateString(), color: "#f59e0b" };
      } else if (b.status === "completed") {
        return { icon: CheckCircle2, text: `Completed session with ${b.studentName}`, time: new Date(b.createdAt).toLocaleDateString(), color: "#22c55e" };
      } else if (b.status === "upcoming") {
        return { icon: Calendar, text: `Accepted session with ${b.studentName}`, time: new Date(b.createdAt).toLocaleDateString(), color: "#0B4085" };
      } else {
        return { icon: XCircle, text: `Cancelled session with ${b.studentName}`, time: new Date(b.createdAt).toLocaleDateString(), color: "#ef4444" };
      }
    });

  return (
    <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
        }}
      >
        {/* ── Welcome Banner ── */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #0B4085 0%, #1a56b3 60%, #0ea5e9 100%)",
            borderRadius: "24px",
            padding: "2.5rem 3rem",
            marginBottom: "2rem",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 12px 40px rgba(11,64,133,0.22)",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "-40px",
              top: "-40px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }}
          />
          <div style={{ position: "relative" }}>
            <p
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                opacity: 0.8,
                margin: "0 0 0.3rem",
              }}
            >
              {greeting} 👋
            </p>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 900,
                margin: "0 0 0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back, {firstName}!
            </h1>
            <p style={{ fontSize: "0.9rem", opacity: 0.8, margin: 0 }}>
              You have{" "}
              <strong>{upcomingBookings.length} upcoming sessions</strong>. Keep
              inspiring!
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <Link
              href="/dashboard/bookings"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#fff",
                color: "#0B4085",
                borderRadius: "12px",
                padding: "0.75rem 1.5rem",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 800,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <Calendar size={16} /> My Sessions
            </Link>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <StatCard
            icon={Calendar}
            value={upcomingBookings.length}
            label="Upcoming Sessions"
            sub="Total"
            color="#0B4085"
            bg="#e8eef7"
          />
          <StatCard
            icon={CheckCircle2}
            value={completedBookings.length}
            label="Completed Sessions"
            sub="Total"
            color="#22c55e"
            bg="#dcfce7"
          />
          <StatCard
            icon={Star}
            value={profile?.averageRating?.toFixed(1) || "0.0"}
            label="Avg. Rating"
            sub={`${profile?.reviewCount || 0} reviews`}
            color="#f59e0b"
            bg="#fef3c7"
          />
          <StatCard
            icon={TrendingUp}
            value={`Rs.${totalEarned}`}
            label="Total Earned"
            sub="All time"
            color="#8b5cf6"
            bg="#f3e8ff"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "1.5rem",
          }}
        >
          {/* Left */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 1px 8px rgba(11,64,133,0.04)",
              }}
            >
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#1a202c",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Calendar size={17} color="#0B4085" /> Upcoming Sessions
                </h2>
                <Link
                  href="/dashboard/bookings"
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#0B4085",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  View all <ChevronRight size={14} />
                </Link>
              </div>
              <div>
                {upcomingBookings.slice(0, 4).map((s, i) => (
                  <div
                    key={s.id}
                    style={{
                      padding: "1rem 1.5rem",
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      borderBottom:
                        i < Math.min(upcomingBookings.length, 4) - 1
                          ? "1px solid #f8fafc"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: getAvatarColor(s.studentName),
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(s.studentName)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          color: "#1a202c",
                          margin: "0 0 0.15rem",
                        }}
                      >
                        {s.studentName}
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#64748b",
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <BookOpen size={12} color="#0B4085" /> {s.subject}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", marginRight: "1rem" }}>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "#1a202c",
                          margin: "0 0 0.1rem",
                        }}
                      >
                        {new Date(s.createdAt).toLocaleDateString()}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          margin: 0,
                        }}
                      >
                        {s.time} · {s.duration}
                      </p>
                    </div>
                    <button
                      onClick={() => window.open("https://meet.google.com/new", "_blank")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        background: "linear-gradient(135deg, #0B4085, #1a56b3)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.5rem 0.85rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(11,64,133,0.25)",
                      }}
                    >
                      <Video size={12} /> Start
                    </button>
                  </div>
                ))}
                {upcomingBookings.length === 0 && (
                  <div style={{ padding: "2rem", textAlign: "center", color: "#64748b", fontSize: "0.875rem" }}>
                    No upcoming sessions found.
                  </div>
                )}
              </div>
            </div>

            {/* Students summary */}
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 1px 8px rgba(11,64,133,0.04)",
              }}
            >
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#1a202c",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Users size={17} color="#0ea5e9" /> Active Students
                </h2>
              </div>
              {activeStudents.map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: "1rem 1.5rem",
                    display: "flex",
                    gap: "0.85rem",
                    alignItems: "center",
                    borderBottom: i < activeStudents.length - 1 ? "1px solid #f8fafc" : "none",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: s.color,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    {s.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "#1a202c",
                        margin: "0 0 0.1rem",
                      }}
                    >
                      {s.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        margin: 0,
                      }}
                    >
                      {s.subject} · {s.sessions} sessions done
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      background: "#dcfce7",
                      color: "#16a34a",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "999px",
                    }}
                  >
                    Active
                  </span>
                </div>
              ))}
              {activeStudents.length === 0 && (
                <div style={{ padding: "2rem", textAlign: "center", color: "#64748b", fontSize: "0.875rem" }}>
                  No active students yet.
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "1.25rem",
                boxShadow: "0 1px 8px rgba(11,64,133,0.04)",
              }}
            >
              <h2
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#1a202c",
                  margin: "0 0 1rem",
                }}
              >
                Quick Actions
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.65rem",
                }}
              >
                {QUICK_ACTIONS_TUTOR.map(
                  ({ icon: Icon, label, href, color, bg }) => (
                    <Link
                      key={href}
                      href={href}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        padding: "0.9rem 0.5rem",
                        background: bg,
                        borderRadius: "12px",
                        textDecoration: "none",
                      }}
                      className="quick-action-card"
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                      >
                        <Icon size={18} color={color} />
                      </div>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: color,
                          textAlign: "center",
                        }}
                      >
                        {label}
                      </span>
                    </Link>
                  ),
                )}
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Entry Point ────────────────────────────────────── */
export default function DashboardHomePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "4px solid #e2e8f0",
            borderTopColor: "#0B4085",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      {user.role === "tutor" ? (
        <TutorDashboard name={user.fullName} />
      ) : (
        <StudentDashboard name={user.fullName} />
      )}
      <style>{`
        .quick-action-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.1) !important;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
        }
        .course-row:hover { background: #f8fafc !important; }
        @media (max-width: 900px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
