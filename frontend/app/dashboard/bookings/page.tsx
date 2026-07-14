"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/lib/context/UserContext";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Star,
  Video,
  MessageSquare,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────── */
type BookingStatus = "upcoming" | "completed" | "cancelled";

interface Booking {
  id: number;
  tutorName: string;
  studentName: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  status: BookingStatus;
  price: string;
  initials: string;
  avatarColor: string;
  rating?: number;
}

/* ─── Dummy Data ─────────────────────────────────────── */
const STUDENT_BOOKINGS: Booking[] = [
  {
    id: 1, tutorName: "Anish Shrestha", studentName: "You",
    subject: "Engineering Physics", date: "2026-07-18", time: "10:00 AM",
    duration: "90 min", status: "upcoming", price: "Rs. 1,200",
    initials: "AS", avatarColor: "#0B4085",
  },
  {
    id: 2, tutorName: "Priya Sharma", studentName: "You",
    subject: "Biology", date: "2026-07-20", time: "2:00 PM",
    duration: "60 min", status: "upcoming", price: "Rs. 750",
    initials: "PS", avatarColor: "#0ea5e9",
  },
  {
    id: 3, tutorName: "Sohan Gurung", studentName: "You",
    subject: "Economics", date: "2026-07-10", time: "4:00 PM",
    duration: "60 min", status: "completed", price: "Rs. 600",
    initials: "SG", avatarColor: "#7c3aed", rating: 5,
  },
  {
    id: 4, tutorName: "Bikash Tamang", studentName: "You",
    subject: "Mathematics", date: "2026-07-05", time: "11:00 AM",
    duration: "90 min", status: "cancelled", price: "Rs. 900",
    initials: "BT", avatarColor: "#ec4899",
  },
];

const TUTOR_BOOKINGS: Booking[] = [
  {
    id: 1, tutorName: "You", studentName: "Rajan Thapa",
    subject: "Engineering Physics", date: "2026-07-18", time: "10:00 AM",
    duration: "90 min", status: "upcoming", price: "Rs. 1,200",
    initials: "RT", avatarColor: "#0B4085",
  },
  {
    id: 2, tutorName: "You", studentName: "Sima Karki",
    subject: "Engineering Physics", date: "2026-07-21", time: "3:00 PM",
    duration: "60 min", status: "upcoming", price: "Rs. 800",
    initials: "SK", avatarColor: "#22c55e",
  },
  {
    id: 3, tutorName: "You", studentName: "Rohan Shrestha",
    subject: "Mathematics", date: "2026-07-08", time: "9:00 AM",
    duration: "60 min", status: "completed", price: "Rs. 800",
    initials: "RS", avatarColor: "#f59e0b", rating: 5,
  },
];

/* ─── Status Config ──────────────────────────────────── */
const STATUS_CONFIG = {
  upcoming: { label: "Upcoming", color: "#0B4085", bg: "#e8eef7", Icon: AlertCircle },
  completed: { label: "Completed", color: "#16a34a", bg: "#dcfce7", Icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "#dc2626", bg: "#fee2e2", Icon: XCircle },
};

/* ─── Booking Card ───────────────────────────────────── */
function BookingCard({ booking, role }: { booking: Booking; role: string }) {
  const router = useRouter();
  const status = STATUS_CONFIG[booking.status];
  const StatusIcon = status.Icon;
  const isUpcoming = booking.status === "upcoming";
  const personName = role === "tutor" ? booking.studentName : booking.tutorName;
  const personLabel = role === "tutor" ? "Student" : "Tutor";

  return (
    <div style={{
      background: "#fff",
      borderRadius: "14px",
      border: "1px solid #e2e8f0",
      padding: "1.5rem",
      display: "flex",
      gap: "1.25rem",
      alignItems: "flex-start",
      transition: "box-shadow 0.2s ease, transform 0.2s ease",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      cursor: "pointer",
    }}
    className="booking-card"
    onClick={() => alert(`Opening details for booking with ${personName}...`)}
    >
      {/* Avatar */}
      <div style={{
        width: "52px", height: "52px", borderRadius: "50%",
        background: booking.avatarColor, display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: "1.1rem", fontWeight: 700, color: "#fff",
        flexShrink: 0,
      }}>
        {booking.initials}
      </div>

      {/* Main Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a202c", margin: 0 }}>{personName}</h3>
            <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>{personLabel}</span>
          </div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.3rem",
            fontSize: "0.72rem", fontWeight: 600, padding: "0.25rem 0.75rem",
            borderRadius: "999px", background: status.bg, color: status.color,
          }}>
            <StatusIcon size={12} /> {status.label}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
          <BookOpen size={14} color="#0B4085" />
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0B4085" }}>{booking.subject}</span>
        </div>

        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.78rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Calendar size={13} /> {new Date(booking.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <span style={{ fontSize: "0.78rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Clock size={13} /> {booking.time} · {booking.duration}
          </span>
          <span style={{ fontSize: "0.78rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <User size={13} /> {booking.price}
          </span>
        </div>

        {/* Rating for completed (student view) */}
        {booking.status === "completed" && booking.rating && role === "student" && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={14} fill={s <= booking.rating! ? "#f59e0b" : "none"} color="#f59e0b" />
            ))}
            <span style={{ fontSize: "0.72rem", color: "#64748b", marginLeft: "0.25rem" }}>Your rating</span>
          </div>
        )}

        {/* Actions for upcoming */}
        {isUpcoming && (
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
            <button style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "#0B4085", color: "#fff", border: "none",
              borderRadius: "8px", padding: "0.45rem 1rem",
              fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              alert("Joining call...");
            }}
            >
              <Video size={14} /> Join Call
            </button>
            <button style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "none", color: "#64748b", border: "1px solid #e2e8f0",
              borderRadius: "8px", padding: "0.45rem 1rem",
              fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              router.push("/dashboard/messages");
            }}
            >
              <MessageSquare size={14} /> Message
            </button>
          </div>
        )}
      </div>

      <ChevronRight size={18} color="#cbd5e0" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────── */
export default function BookingsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookingStatus | "all">("all");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  const role = user.role as "student" | "tutor";
  const bookings = role === "tutor" ? TUTOR_BOOKINGS : STUDENT_BOOKINGS;
  const filtered = activeTab === "all" ? bookings : bookings.filter(b => b.status === activeTab);

  const counts = {
    all: bookings.length,
    upcoming: bookings.filter(b => b.status === "upcoming").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  const TABS: { key: BookingStatus | "all"; label: string }[] = [
    { key: "all", label: `All (${counts.all})` },
    { key: "upcoming", label: `Upcoming (${counts.upcoming})` },
    { key: "completed", label: `Completed (${counts.completed})` },
    { key: "cancelled", label: `Cancelled (${counts.cancelled})` },
  ];

  return (
    <div style={{ background: "#f4f6fa", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 900, color: "#1a202c", margin: "0 0 0.4rem 0", letterSpacing: "-0.02em" }}>
            {role === "tutor" ? "My Teaching Sessions" : "My Bookings"}
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#64748b", margin: 0 }}>
            {role === "tutor"
              ? "View and manage all your tutoring sessions."
              : "Track all your upcoming and past tutoring sessions."}
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Upcoming", count: counts.upcoming, color: "#0B4085", bg: "#e8eef7" },
            { label: "Completed", count: counts.completed, color: "#16a34a", bg: "#dcfce7" },
            { label: "Cancelled", count: counts.cancelled, color: "#dc2626", bg: "#fee2e2" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "#fff", borderRadius: "12px", padding: "1.25rem", border: "1px solid #e2e8f0", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: stat.color }}>{stat.count}</div>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0" }}>
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

        {/* Booking List */}
        {filtered.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "14px", padding: "3rem", textAlign: "center", border: "1px solid #e2e8f0" }}>
            <Calendar size={48} color="#cbd5e0" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.5rem" }}>No bookings found</h3>
            <p style={{ fontSize: "0.875rem", color: "#64748b", margin: "0 0 1.5rem" }}>
              {activeTab === "upcoming" ? "You have no upcoming sessions." : `No ${activeTab} sessions yet.`}
            </p>
            {role === "student" && (
              <Link href="/find-tutors" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "#0B4085", color: "#fff", textDecoration: "none",
                borderRadius: "8px", padding: "0.65rem 1.5rem", fontSize: "0.875rem", fontWeight: 600,
              }}>
                Find a Tutor
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtered.map(booking => (
              <BookingCard key={booking.id} booking={booking} role={role} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .booking-card:hover {
          box-shadow: 0 6px 24px rgba(11,64,133,0.1) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
