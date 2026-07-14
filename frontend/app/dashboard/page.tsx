"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/lib/context/UserContext";
import {
  Calendar, GraduationCap, Sparkles, BookOpen, Bell,
  MessageSquare, ChevronRight, Star, Clock, TrendingUp,
  Video, Search, ArrowRight, CheckCircle2, Target, Award,
  BarChart3, Flame, Users, BookMarked, ArrowUpRight,
} from "lucide-react";

/* ─── Dummy Data ─────────────────────────────────────── */
const UPCOMING = [
  { id: 1, tutor: "Anish Shrestha", initials: "AS", color: "#0B4085", subject: "Engineering Physics", date: "Jul 18", time: "10:00 AM", duration: "90 min" },
  { id: 2, tutor: "Priya Sharma", initials: "PS", color: "#0ea5e9", subject: "Biology", date: "Jul 20", time: "2:00 PM", duration: "60 min" },
];

const IN_PROGRESS = [
  { id: 1, subject: "Engineering Physics", tutor: "Anish Shrestha", progress: 60, color: "#0B4085", modules: 4, total: 7 },
  { id: 2, subject: "Biology", tutor: "Priya Sharma", progress: 30, color: "#0ea5e9", modules: 2, total: 6 },
  { id: 3, subject: "Economics", tutor: "Sohan Gurung", progress: 85, color: "#8b5cf6", modules: 6, total: 7 },
];

const QUICK_ACTIONS_STUDENT = [
  { icon: Search, label: "Find Tutors", href: "/find-tutors", color: "#0B4085", bg: "#e8eef7" },
  { icon: Calendar, label: "My Bookings", href: "/dashboard/bookings", color: "#0ea5e9", bg: "#e0f2fe" },
  { icon: GraduationCap, label: "My Learnings", href: "/dashboard/learnings", color: "#8b5cf6", bg: "#f3e8ff" },
  { icon: Sparkles, label: "MCQ Generator", href: "/dashboard/mcq", color: "#f59e0b", bg: "#fef3c7" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", color: "#22c55e", bg: "#dcfce7" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications", color: "#ef4444", bg: "#fee2e2" },
];

const QUICK_ACTIONS_TUTOR = [
  { icon: Calendar, label: "My Sessions", href: "/dashboard/bookings", color: "#0B4085", bg: "#e8eef7" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", color: "#8b5cf6", bg: "#f3e8ff" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications", color: "#ef4444", bg: "#fee2e2" },
  { icon: Search, label: "Find Students", href: "/find-tutors", color: "#22c55e", bg: "#dcfce7" },
];

const TUTOR_UPCOMING = [
  { id: 1, student: "Rajan Thapa", initials: "RT", color: "#0B4085", subject: "Engineering Physics", date: "Jul 18", time: "10:00 AM", duration: "90 min" },
  { id: 2, student: "Sima Karki", initials: "SK", color: "#22c55e", subject: "Engineering Physics", date: "Jul 21", time: "3:00 PM", duration: "60 min" },
];

const RECENT_ACTIVITY = [
  { icon: CheckCircle2, text: "Completed Module 4 in Engineering Physics", time: "2h ago", color: "#22c55e" },
  { icon: Star, text: "Left feedback for Anish Shrestha's session", time: "Yesterday", color: "#f59e0b" },
  { icon: BookOpen, text: "Started Biology Module 2: Cell Division", time: "2 days ago", color: "#0ea5e9" },
  { icon: Calendar, text: "Booked session with Priya Sharma for Jul 20", time: "3 days ago", color: "#0B4085" },
];

/* ─── Sub-components ─────────────────────────────────── */
function StatCard({ label, value, sub, icon: Icon, color, bg, trend }: {
  label: string; value: string | number; sub?: string; trend?: string;
  icon: React.ElementType; color: string; bg: string;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: "16px", padding: "1.5rem",
      border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "1rem",
      boxShadow: "0 1px 6px rgba(0,0,0,0.04)", transition: "transform 0.15s, box-shadow 0.15s",
    }} className="stat-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={22} color={color} />
        </div>
        {trend && (
          <span style={{ display: "flex", alignItems: "center", gap: "0.2rem", fontSize: "0.72rem", fontWeight: 700, color: "#22c55e", background: "#dcfce7", padding: "0.2rem 0.5rem", borderRadius: "999px" }}>
            <ArrowUpRight size={10} /> {trend}
          </span>
        )}
      </div>
      <div>
        <p style={{ fontSize: "2rem", fontWeight: 900, color: "#1a202c", margin: 0, lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</p>
        <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#64748b", margin: "0.3rem 0 0" }}>{label}</p>
        {sub && <p style={{ fontSize: "0.72rem", color: "#94a3b8", margin: "0.1rem 0 0" }}>{sub}</p>}
      </div>
    </div>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: "999px", transition: "width 0.6s ease" }} />
    </div>
  );
}

/* ─── Student Dashboard ──────────────────────────────── */
function StudentDashboard({ name }: { name: string }) {
  const firstName = name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const totalProgress = Math.round(IN_PROGRESS.reduce((a, c) => a + c.progress, 0) / IN_PROGRESS.length);
  const streak = 7;

  return (
    <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* ── Hero Banner ── */}
        <div style={{
          background: "linear-gradient(135deg, #0B4085 0%, #1a56b3 55%, #0ea5e9 100%)",
          borderRadius: "24px", padding: "2.5rem 3rem", marginBottom: "2rem",
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between",
          overflow: "hidden", position: "relative", boxShadow: "0 12px 40px rgba(11,64,133,0.22)",
        }}>
          {/* Decorative blobs */}
          <div style={{ position: "absolute", right: "-60px", top: "-60px", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", right: "120px", bottom: "-80px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", left: "40%", top: "-30px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

          <div style={{ position: "relative" }}>
            <p style={{ fontSize: "0.9rem", fontWeight: 500, opacity: 0.8, margin: "0 0 0.35rem" }}>{greeting} 👋</p>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, margin: "0 0 0.6rem", letterSpacing: "-0.02em" }}>
              Welcome back, {firstName}!
            </h1>
            <p style={{ fontSize: "0.9rem", opacity: 0.8, margin: "0 0 1.5rem", maxWidth: "420px" }}>
              You have <strong>{UPCOMING.length} upcoming sessions</strong> this week. Keep up the great work!
            </p>
            {/* Streak badge */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: "999px", padding: "0.4rem 1rem" }}>
                <Flame size={14} color="#fbbf24" fill="#fbbf24" />
                <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>{streak}-day learning streak!</span>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: "999px", padding: "0.4rem 1rem" }}>
                <Target size={14} color="#34d399" />
                <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>{totalProgress}% avg. progress</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", position: "relative", flexShrink: 0 }}>
            <Link href="/find-tutors" style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "#fff", color: "#0B4085",
              borderRadius: "12px", padding: "0.75rem 1.5rem",
              textDecoration: "none", fontSize: "0.875rem", fontWeight: 800,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}>
              <Search size={16} /> Find Tutors
            </Link>
            <Link href="/dashboard/learnings" style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)",
              borderRadius: "12px", padding: "0.7rem 1.4rem",
              color: "#fff", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600,
            }}>
              <GraduationCap size={16} /> My Learnings
            </Link>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          <StatCard icon={Calendar} value={2} label="Upcoming Sessions" sub="This week" color="#0B4085" bg="#e8eef7" trend="+1" />
          <StatCard icon={GraduationCap} value={3} label="Active Courses" sub="In progress" color="#8b5cf6" bg="#f3e8ff" />
          <StatCard icon={CheckCircle2} value={6} label="Sessions Done" sub="Total" color="#22c55e" bg="#dcfce7" trend="+2" />
          <StatCard icon={Flame} value={`${streak}`} label="Day Streak" sub="Keep it up!" color="#f59e0b" bg="#fef3c7" trend="🔥" />
        </div>

        {/* ── Main Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.5rem" }}>
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Course Progress Summary */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 8px rgba(11,64,133,0.04)" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a202c", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <BarChart3 size={17} color="#8b5cf6" /> Course Progress
                </h2>
                <Link href="/dashboard/learnings" style={{ fontSize: "0.8rem", fontWeight: 600, color: "#8b5cf6", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  View all <ChevronRight size={14} />
                </Link>
              </div>
              <div style={{ padding: "0.5rem 0" }}>
                {IN_PROGRESS.map((course, i) => (
                  <Link key={course.id} href="/dashboard/learnings" style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ padding: "1rem 1.5rem", borderBottom: i < IN_PROGRESS.length - 1 ? "1px solid #f8fafc" : "none", transition: "background 0.12s" }} className="course-row">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: course.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <BookMarked size={16} color={course.color} />
                          </div>
                          <div>
                            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.1rem" }}>{course.subject}</p>
                            <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>with {course.tutor} · {course.modules}/{course.total} modules</p>
                          </div>
                        </div>
                        <span style={{ fontSize: "1rem", fontWeight: 900, color: course.color }}>{course.progress}%</span>
                      </div>
                      <ProgressBar value={course.progress} color={course.color} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 8px rgba(11,64,133,0.04)" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a202c", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Calendar size={17} color="#0B4085" /> Upcoming Sessions
                </h2>
                <Link href="/dashboard/bookings" style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0B4085", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  View all <ChevronRight size={14} />
                </Link>
              </div>
              <div>
                {UPCOMING.map((s, i) => (
                  <div key={s.id} style={{
                    padding: "1.1rem 1.5rem", display: "flex", gap: "1rem", alignItems: "center",
                    borderBottom: i < UPCOMING.length - 1 ? "1px solid #f8fafc" : "none",
                  }}>
                    <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0, boxShadow: `0 4px 10px ${s.color}44` }}>
                      {s.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.15rem" }}>{s.tutor}</p>
                      <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <BookOpen size={12} color="#0B4085" /> {s.subject}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.1rem" }}>{s.date}</p>
                      <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0, display: "flex", alignItems: "center", gap: "0.3rem", justifyContent: "flex-end" }}>
                        <Clock size={11} /> {s.time} · {s.duration}
                      </p>
                    </div>
                    <button style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "linear-gradient(135deg, #0B4085, #1a56b3)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.5rem 0.9rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", flexShrink: 0, boxShadow: "0 2px 8px rgba(11,64,133,0.25)" }}>
                      <Video size={12} /> Join
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 8px rgba(11,64,133,0.04)" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a202c", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Clock size={17} color="#64748b" /> Recent Activity
                </h2>
              </div>
              <div style={{ padding: "0.5rem 0" }}>
                {RECENT_ACTIVITY.map((item, i) => (
                  <div key={i} style={{ padding: "0.85rem 1.5rem", display: "flex", gap: "0.85rem", alignItems: "flex-start", borderBottom: i < RECENT_ACTIVITY.length - 1 ? "1px solid #f8fafc" : "none" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: item.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "0.1rem" }}>
                      <item.icon size={15} color={item.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.85rem", color: "#334155", margin: "0 0 0.1rem", fontWeight: 500 }}>{item.text}</p>
                      <p style={{ fontSize: "0.72rem", color: "#94a3b8", margin: 0 }}>{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Quick Actions */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.25rem", boxShadow: "0 1px 8px rgba(11,64,133,0.04)" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a202c", margin: "0 0 1rem" }}>Quick Actions</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
                {QUICK_ACTIONS_STUDENT.map(({ icon: Icon, label, href, color, bg }) => (
                  <Link key={href} href={href} style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: "0.5rem", padding: "0.9rem 0.5rem",
                    background: bg, borderRadius: "12px", textDecoration: "none",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    border: "1px solid transparent",
                  }} className="quick-action-card">
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                      <Icon size={18} color={color} />
                    </div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: color, textAlign: "center" }}>{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Overall Summary Card */}
            <div style={{ background: "linear-gradient(135deg, #1e293b, #334155)", borderRadius: "16px", padding: "1.5rem", color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: "-20px", bottom: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(238, 226, 226, 0.05)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
                <Award size={20} color="#f59e0b" />
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0, color: "#fff" }}>My Summary</h3>
              </div>
              {[
                { label: "Sessions Completed", value: "6" },
                { label: "Hours Learned", value: "12h" },
                { label: "Avg. Module Score", value: "87%" },
                { label: "Tutor Rating Given", value: "4.8 ★" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)" }}>{row.label}</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fff" }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* MCQ Banner */}
            <div style={{
              background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
              borderRadius: "16px", padding: "1.5rem",
              color: "#fff", position: "relative", overflow: "hidden",
              boxShadow: "0 8px 24px rgba(124,58,237,0.2)",
            }}>
              <div style={{ position: "absolute", right: "-20px", bottom: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={20} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: "0.88rem", fontWeight: 700, margin: 0 }}>AI MCQ Generator</p>
                  <p style={{ fontSize: "0.72rem", opacity: 0.8, margin: 0 }}>Practice smarter with AI</p>
                </div>
              </div>
              <p style={{ fontSize: "0.8rem", opacity: 0.85, margin: "0 0 1rem", lineHeight: 1.5 }}>
                Generate custom practice questions on any subject instantly.
              </p>
              <Link href="/dashboard/mcq" style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)",
                borderRadius: "8px", padding: "0.5rem 1rem", color: "#fff",
                textDecoration: "none", fontSize: "0.8rem", fontWeight: 700,
              }}>
                Start Quiz <ArrowRight size={14} />
              </Link>
            </div>

            {/* Notifications */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 8px rgba(11,64,133,0.04)" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a202c", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Bell size={15} color="#ef4444" /> Notifications
                </h2>
                <Link href="/dashboard/notifications" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ef4444", textDecoration: "none", background: "#fee2e2", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>2 new</Link>
              </div>
              {[
                { title: "Booking Confirmed", msg: "Session with Anish confirmed for Jul 18.", color: "#0B4085" },
                { title: "New Message", msg: "Priya: 'Please revise Chapter 5...'", color: "#8b5cf6" },
              ].map((n, i) => (
                <div key={i} style={{ padding: "0.9rem 1.25rem", display: "flex", gap: "0.75rem", alignItems: "flex-start", borderBottom: i === 0 ? "1px solid #f8fafc" : "none", background: "#fafbfd" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: n.color, marginTop: "0.35rem", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.1rem" }}>{n.title}</p>
                    <p style={{ fontSize: "0.74rem", color: "#64748b", margin: 0 }}>{n.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Tutor Dashboard ────────────────────────────────── */
function TutorDashboard({ name }: { name: string }) {
  const firstName = name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* ── Welcome Banner ── */}
        <div style={{
          background: "linear-gradient(135deg, #0B4085 0%, #1a56b3 60%, #0ea5e9 100%)",
          borderRadius: "24px", padding: "2.5rem 3rem", marginBottom: "2rem",
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between",
          overflow: "hidden", position: "relative", boxShadow: "0 12px 40px rgba(11,64,133,0.22)",
        }}>
          <div style={{ position: "absolute", right: "-40px", top: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "relative" }}>
            <p style={{ fontSize: "0.9rem", fontWeight: 500, opacity: 0.8, margin: "0 0 0.3rem" }}>{greeting} 👋</p>
            <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
              Welcome back, {firstName}!
            </h1>
            <p style={{ fontSize: "0.9rem", opacity: 0.8, margin: 0 }}>
              You have <strong>{TUTOR_UPCOMING.length} upcoming sessions</strong>. Keep inspiring!
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", position: "relative", flexShrink: 0 }}>
            <Link href="/dashboard/bookings" style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "#fff", color: "#0B4085", borderRadius: "12px", padding: "0.75rem 1.5rem",
              textDecoration: "none", fontSize: "0.875rem", fontWeight: 800, boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}>
              <Calendar size={16} /> My Sessions
            </Link>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          <StatCard icon={Calendar} value={2} label="Upcoming Sessions" sub="This week" color="#0B4085" bg="#e8eef7" />
          <StatCard icon={CheckCircle2} value={3} label="Completed Sessions" sub="Total" color="#22c55e" bg="#dcfce7" trend="+1" />
          <StatCard icon={Star} value="4.9" label="Avg. Rating" sub="From students" color="#f59e0b" bg="#fef3c7" />
          <StatCard icon={TrendingUp} value="Rs.2,000" label="Total Earned" sub="This month" color="#8b5cf6" bg="#f3e8ff" trend="+Rs.500" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 8px rgba(11,64,133,0.04)" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a202c", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Calendar size={17} color="#0B4085" /> Upcoming Sessions
                </h2>
                <Link href="/dashboard/bookings" style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0B4085", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  View all <ChevronRight size={14} />
                </Link>
              </div>
              <div>
                {TUTOR_UPCOMING.map((s, i) => (
                  <div key={s.id} style={{
                    padding: "1rem 1.5rem", display: "flex", gap: "1rem", alignItems: "center",
                    borderBottom: i < TUTOR_UPCOMING.length - 1 ? "1px solid #f8fafc" : "none",
                  }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0, boxShadow: `0 4px 10px ${s.color}44` }}>
                      {s.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.15rem" }}>{s.student}</p>
                      <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <BookOpen size={12} color="#0B4085" /> {s.subject}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.1rem" }}>{s.date}</p>
                      <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>{s.time} · {s.duration}</p>
                    </div>
                    <button style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "linear-gradient(135deg, #0B4085, #1a56b3)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.5rem 0.85rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(11,64,133,0.25)" }}>
                      <Video size={12} /> Start
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Students summary */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 8px rgba(11,64,133,0.04)" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a202c", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Users size={17} color="#0ea5e9" /> Active Students
                </h2>
              </div>
              {[{ name: "Rajan Thapa", initials: "RT", color: "#0B4085", subject: "Engineering Physics", sessions: 4 },
              { name: "Sima Karki", initials: "SK", color: "#22c55e", subject: "Engineering Physics", sessions: 2 }].map((s, i) => (
                <div key={i} style={{ padding: "1rem 1.5rem", display: "flex", gap: "0.85rem", alignItems: "center", borderBottom: i === 0 ? "1px solid #f8fafc" : "none" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>
                    {s.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.1rem" }}>{s.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>{s.subject} · {s.sessions} sessions done</p>
                  </div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, background: "#dcfce7", color: "#16a34a", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>Active</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.25rem", boxShadow: "0 1px 8px rgba(11,64,133,0.04)" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a202c", margin: "0 0 1rem" }}>Quick Actions</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
                {QUICK_ACTIONS_TUTOR.map(({ icon: Icon, label, href, color, bg }) => (
                  <Link key={href} href={href} style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: "0.5rem", padding: "0.9rem 0.5rem",
                    background: bg, borderRadius: "12px", textDecoration: "none",
                  }} className="quick-action-card">
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                      <Icon size={18} color={color} />
                    </div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: color, textAlign: "center" }}>{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tutor summary */}
            <div style={{ background: "linear-gradient(135deg, #1e293b, #334155)", borderRadius: "16px", padding: "1.5rem", color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
                <Award size={20} color="#f59e0b" />
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>My Summary</h3>
              </div>
              {[
                { label: "Total Sessions", value: "5" },
                { label: "Hours Taught", value: "9h" },
                { label: "Avg. Rating", value: "4.9 ★" },
                { label: "Total Earned", value: "Rs.2,000" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)" }}>{row.label}</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fff" }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Notifications */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a202c", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Bell size={15} color="#ef4444" /> Notifications
                </h2>
                <Link href="/dashboard/notifications" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ef4444", textDecoration: "none", background: "#fee2e2", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>2 new</Link>
              </div>
              {[
                { title: "New Booking Request", msg: "Rajan Thapa booked a 90-min session." },
                { title: "Profile Approved", msg: "Your tutor profile is now live." },
              ].map((n, i) => (
                <div key={i} style={{ padding: "0.9rem 1.25rem", display: "flex", gap: "0.75rem", alignItems: "flex-start", borderBottom: i === 0 ? "1px solid #f8fafc" : "none", background: "#fafbfd" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", marginTop: "0.35rem", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.1rem" }}>{n.title}</p>
                    <p style={{ fontSize: "0.74rem", color: "#64748b", margin: 0 }}>{n.msg}</p>
                  </div>
                </div>
              ))}
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
    if (!loading && user?.role === "admin") router.replace("/admin/dashboard");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      {user.role === "tutor"
        ? <TutorDashboard name={user.fullName} />
        : <StudentDashboard name={user.fullName} />
      }
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