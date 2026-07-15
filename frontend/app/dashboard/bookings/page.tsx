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

const PENDING_REQUESTS: Booking[] = [
  {
    id: 10, tutorName: "You", studentName: "Priya Manandhar",
    subject: "Engineering Physics", date: "2026-07-22", time: "11:00 AM",
    duration: "90 min", status: "upcoming", price: "Rs. 1,200",
    initials: "PM", avatarColor: "#8b5cf6",
  },
  {
    id: 11, tutorName: "You", studentName: "Bikash Tamang",
    subject: "Mathematics", date: "2026-07-25", time: "3:00 PM",
    duration: "60 min", status: "upcoming", price: "Rs. 800",
    initials: "BT", avatarColor: "#f59e0b",
  },
];

/* ─── Status Config ──────────────────────────────────── */
const STATUS_CONFIG = {
  upcoming: { label: "Upcoming", color: "#0B4085", bg: "#e8eef7", Icon: AlertCircle },
  completed: { label: "Completed", color: "#16a34a", bg: "#dcfce7", Icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "#dc2626", bg: "#fee2e2", Icon: XCircle },
};

function BookingCard({ booking, role, isPending = false, onAccept, onDecline, onShowToast }: {
  booking: Booking; role: string; isPending?: boolean;
  onAccept?: () => void; onDecline?: () => void;
  onShowToast?: (msg: string, type?: "success" | "info" | "error") => void;
}) {
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
      border: isPending ? "2px solid #f59e0b" : "1px solid #e2e8f0",
      padding: "1.5rem",
      display: "flex",
      gap: "1.25rem",
      alignItems: "flex-start",
      transition: "box-shadow 0.2s ease, transform 0.2s ease",
      boxShadow: isPending ? "0 4px 12px rgba(245,158,11,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
      cursor: isPending ? "default" : "pointer",
    }}
    className={isPending ? "" : "booking-card"}
    onClick={() => !isPending && onShowToast?.(`Opening details for booking with ${personName}...`, "info")}
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
          {isPending ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.75rem", borderRadius: "999px", background: "#fef3c7", color: "#d97706" }}>
              ⏳ Pending
            </span>
          ) : (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.3rem",
              fontSize: "0.72rem", fontWeight: 600, padding: "0.25rem 0.75rem",
              borderRadius: "999px", background: status.bg, color: status.color,
            }}>
              <StatusIcon size={12} /> {status.label}
            </span>
          )}
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

        {/* Accept / Decline for pending */}
        {isPending && (
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
            <button
              onClick={(e) => { e.stopPropagation(); onAccept?.(); }}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "#22c55e", color: "#fff", border: "none", borderRadius: "8px", padding: "0.5rem 1.1rem", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}
            >
              <CheckCircle size={14} /> Accept
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDecline?.(); }}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", padding: "0.5rem 1.1rem", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}
            >
              <XCircle size={14} /> Decline
            </button>
          </div>
        )}

        {/* Actions for upcoming */}
        {isUpcoming && !isPending && (
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
            <button style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "#0B4085", color: "#fff", border: "none",
              borderRadius: "8px", padding: "0.45rem 1rem",
              fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onShowToast?.("Joining call...", "info");
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

      {!isPending && <ChevronRight size={18} color="#cbd5e0" style={{ marginTop: "0.25rem", flexShrink: 0 }} />}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────── */
export default function BookingsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookingStatus | "all" | "pending" | "earnings">("pending");
  const [pendingRequests, setPendingRequests] = useState(PENDING_REQUESTS);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ id: number; action: "accept" | "decline" } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "error" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
  const filtered = activeTab === "all" ? bookings : (activeTab === "pending" || activeTab === "earnings") ? [] : bookings.filter(b => b.status === activeTab);

  const handleAcceptClick = (id: number) => setConfirmDialog({ id, action: "accept" });
  const handleDeclineClick = (id: number) => setConfirmDialog({ id, action: "decline" });

  const executeConfirm = () => {
    if (!confirmDialog) return;
    if (confirmDialog.action === "accept") {
      showToast("Booking request accepted!", "success");
    } else {
      showToast("Booking request declined.", "error");
    }
    setPendingRequests(p => p.filter(r => r.id !== confirmDialog.id));
    setConfirmDialog(null);
  };

  const counts = {
    all: bookings.length,
    pending: pendingRequests.length,
    upcoming: bookings.filter(b => b.status === "upcoming").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  const totalEarned = TUTOR_BOOKINGS.filter(b => b.status === "completed")
    .reduce((sum, b) => sum + parseInt(b.price.replace(/\D/g, "")), 0);

  const TABS: { key: BookingStatus | "all" | "pending" | "earnings"; label: string }[] = role === "tutor"
    ? [
        { key: "pending", label: `Requests (${counts.pending})` },
        { key: "all", label: `All Sessions (${counts.all})` },
        { key: "upcoming", label: `Upcoming (${counts.upcoming})` },
        { key: "completed", label: `Completed (${counts.completed})` },
        { key: "earnings", label: "Earnings" },
      ]
    : [
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
        {activeTab === "pending" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {pendingRequests.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "14px", padding: "3rem", textAlign: "center", border: "1px solid #e2e8f0" }}>
                <CheckCircle size={48} color="#22c55e" style={{ margin: "0 auto 1rem" }} />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.5rem" }}>All caught up!</h3>
                <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>No pending booking requests.</p>
              </div>
            ) : pendingRequests.map(r => (
              <BookingCard key={r.id} booking={r} role={role} isPending onAccept={() => handleAcceptClick(r.id)} onDecline={() => handleDeclineClick(r.id)} onShowToast={showToast} />
            ))}
          </div>
        )}

        {activeTab === "earnings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Earnings Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              {[
                { label: "Total Earned", value: `Rs. ${totalEarned.toLocaleString()}`, color: "#16a34a", bg: "#dcfce7" },
                { label: "This Month", value: "Rs. 2,000", color: "#0B4085", bg: "#e8eef7" },
                { label: "Avg. per Session", value: `Rs. ${Math.round(totalEarned / Math.max(counts.completed, 1))}`, color: "#8b5cf6", bg: "#f3e8ff" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0" }}>
                  <p style={{ fontSize: "1.75rem", fontWeight: 900, color: s.color, margin: "0 0 0.3rem" }}>{s.value}</p>
                  <p style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600, margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>
            {/* Earnings per completed session */}
            <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a202c", margin: 0 }}>Session Earnings</h3>
              </div>
              {TUTOR_BOOKINGS.filter(b => b.status === "completed").map((b, i) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.5rem", borderBottom: i < counts.completed - 1 ? "1px solid #f8fafc" : "none" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: b.avatarColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>{b.initials}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.1rem" }}>{b.studentName}</p>
                    <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>{b.subject} · {new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  </div>
                  <span style={{ fontSize: "1rem", fontWeight: 800, color: "#16a34a" }}>{b.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab !== "pending" && activeTab !== "earnings" && (
          filtered.length === 0 ? (
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
                <BookingCard key={booking.id} booking={booking} role={role} onShowToast={showToast} />
              ))}
            </div>
          )
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "2rem", right: "2rem", zIndex: 1000,
          background: toast.type === "success" ? "#22c55e" : toast.type === "error" ? "#ef4444" : "#3b82f6",
          color: "#fff", padding: "1rem 1.5rem", borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          display: "flex", alignItems: "center", gap: "0.75rem",
          fontWeight: 600, fontSize: "0.95rem",
          animation: "toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          {toast.type === "success" ? <CheckCircle size={18} /> : toast.type === "error" ? <XCircle size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDialog && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", padding: "1rem"
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "2rem",
            width: "100%", maxWidth: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            textAlign: "center", animation: "modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem",
              background: confirmDialog.action === "accept" ? "#dcfce7" : "#fee2e2",
              color: confirmDialog.action === "accept" ? "#16a34a" : "#dc2626"
            }}>
              {confirmDialog.action === "accept" ? <CheckCircle size={28} /> : <XCircle size={28} />}
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.5rem" }}>
              {confirmDialog.action === "accept" ? "Accept Request?" : "Decline Request?"}
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#64748b", margin: "0 0 2rem" }}>
              Are you sure you want to {confirmDialog.action} this booking request?
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => setConfirmDialog(null)}
                style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s ease" }}
                className="modal-cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirm}
                style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "none", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s ease",
                  background: confirmDialog.action === "accept" ? "#22c55e" : "#ef4444", color: "#fff",
                  boxShadow: confirmDialog.action === "accept" ? "0 4px 12px rgba(34,197,94,0.2)" : "0 4px 12px rgba(239,68,68,0.2)"
                }}
                className={confirmDialog.action === "accept" ? "modal-accept-btn" : "modal-decline-btn"}
              >
                Yes, {confirmDialog.action}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .booking-card:hover {
          box-shadow: 0 6px 24px rgba(11,64,133,0.1) !important;
          transform: translateY(-2px);
        }
        .modal-cancel-btn:hover { background: #f1f5f9 !important; }
        .modal-accept-btn:hover { background: #16a34a !important; }
        .modal-decline-btn:hover { background: #dc2626 !important; }
      `}</style>
    </div>
  );
}
