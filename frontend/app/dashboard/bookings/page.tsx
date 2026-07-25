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
  PenLine,
  Flag,
} from "lucide-react";
import ReviewModal from "@/app/_components/ReviewModal";
import ReportModal from "@/app/_components/ReportModal";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

/* ─── Types ─────────────────────────────────────────── */
type BookingStatus = "upcoming" | "completed" | "cancelled" | "pending" | "expired";

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
  profileImage?: string;
  rating?: number;
  studentId?: string;
  tutorId?: string;
  meetLink?: string;
}

import { fetchBookingsAction, updateBookingStatusAction } from "@/lib/actions/booking-action";

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

/* ─── Status Config ──────────────────────────────────── */
const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string; Icon: any }> = {
  upcoming: { label: "Upcoming", color: "#0B4085", bg: "#e8eef7", Icon: AlertCircle },
  completed: { label: "Completed", color: "#16a34a", bg: "#dcfce7", Icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "#dc2626", bg: "#fee2e2", Icon: XCircle },
  pending: { label: "Pending", color: "#f59e0b", bg: "#fef3c7", Icon: AlertCircle },
  expired: { label: "Expired", color: "#64748b", bg: "#f1f5f9", Icon: Clock },
};

function BookingCard({ booking, role, isPending = false, onAccept, onDecline, onMarkComplete, onShowToast, onReview, onReport }: {
  booking: Booking; role: string; isPending?: boolean;
  onAccept?: () => void; onDecline?: () => void;
  onMarkComplete?: () => void;
  onShowToast?: (msg: string, type?: "success" | "info" | "error") => void;
  onReview?: (booking: Booking) => void;
  onReport?: (booking: Booking) => void;
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
      {/* Avatar & Main Info Wrapper for Clickable Profile Navigation */}
      <div 
        style={{ display: "flex", gap: "1.25rem", cursor: "pointer", alignItems: "flex-start" }}
        onClick={(e) => {
          if (isPending) return;
          e.stopPropagation();
          const targetPath = role === "tutor" ? `/students/${booking.studentId}` : `/tutors/${booking.tutorId}`;
          onShowToast?.(`Opening profile...`, "info");
          router.push(targetPath);
        }}
      >
        {/* Avatar */}
        <div style={{
          width: "52px", height: "52px", borderRadius: "50%",
          background: booking.profileImage ? "transparent" : booking.avatarColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.1rem", fontWeight: 700, color: "#fff",
          flexShrink: 0, overflow: "hidden",
        }}>
          {booking.profileImage ? (
            <img
              src={booking.profileImage}
              alt={personName}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            booking.initials
          )}
        </div>

        {/* Name Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a202c", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              {personName}
            </h3>
            <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>{personLabel}</span>
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: "0.4rem", flexWrap: "wrap", gap: "0.5rem" }}>

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

          {/* Report Button */}
          {!isPending && (
            <button
              onClick={(e) => { e.stopPropagation(); onReport?.(booking); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.3rem",
                background: "none", color: "#64748b", border: "1px solid #e2e8f0",
                borderRadius: "999px", padding: "0.2rem 0.6rem",
                fontSize: "0.7rem", fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.backgroundColor = "#fef2f2"; }}
              onMouseOut={(e) => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <Flag size={12} /> Report
            </button>
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

        {/* Write Review button for completed bookings (student only) */}
        {booking.status === "completed" && role === "student" && !booking.rating && (
          <button
            onClick={(e) => { e.stopPropagation(); onReview?.(booking); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              background: "none", color: "#0B4085", border: "1.5px solid #0B4085",
              borderRadius: "8px", padding: "0.4rem 0.9rem",
              fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
              marginTop: "0.5rem", transition: "all 0.15s",
            }}
          >
            <PenLine size={13} /> Write a Review
          </button>
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

        {/* Actions for upcoming or pending */}
        {(booking.status === "upcoming" || booking.status === "pending") && !isPending && (
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>

            {/* Google Meet CTA — prominent if link exists */}
            {booking.meetLink ? (
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <a
                  href={booking.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => { e.stopPropagation(); onShowToast?.("Opening Google Meet...", "info"); }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.45rem",
                    background: "linear-gradient(135deg, #1a73e8, #0d5bcc)",
                    color: "#fff", border: "none", borderRadius: "8px",
                    padding: "0.5rem 1.1rem", fontSize: "0.82rem", fontWeight: 700,
                    textDecoration: "none", cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(26,115,232,0.3)",
                  }}
                >
                  {/* Google Meet icon (simplified SVG) */}
                  <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M29 24a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" fill="white"/>
                    <path d="M40 15l-8 6v6l8 6V15Z" fill="white" fillOpacity="0.8"/>
                    <path d="M8 15h24v18H8a2 2 0 0 1-2-2V17a2 2 0 0 1 2-2Z" fill="white" fillOpacity="0.3"/>
                  </svg>
                  Join Google Meet
                </a>
                <button
                  title="Copy Meet link"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(booking.meetLink!);
                    onShowToast?.("Meet link copied to clipboard!", "success");
                  }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.3rem",
                    background: "none", color: "#1a73e8", border: "1.5px solid #1a73e8",
                    borderRadius: "8px", padding: "0.5rem 0.75rem",
                    fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copy Link
                </button>
              </div>
            ) : (
              <button
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  background: "#94a3b8", color: "#fff", border: "none",
                  borderRadius: "8px", padding: "0.45rem 1rem",
                  fontSize: "0.8rem", fontWeight: 600, cursor: "not-allowed",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onShowToast?.("Meet link will be generated once the tutor accepts your request.", "info");
                }}
              >
                <Video size={14} /> Meet link pending...
              </button>
            )}

            <button style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "none", color: "#64748b", border: "1px solid #e2e8f0",
              borderRadius: "8px", padding: "0.45rem 1rem",
              fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              const targetUserId = role === "tutor" ? booking.studentId : booking.tutorId;
              router.push(`/dashboard/messages?userId=${targetUserId}`);
            }}
            >
              <MessageSquare size={14} /> Message
            </button>
            {role === "tutor" && onMarkComplete && (
              <button
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0",
                  borderRadius: "8px", padding: "0.45rem 1rem",
                  fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
                }}
                onClick={(e) => { e.stopPropagation(); onMarkComplete(); }}
              >
                <CheckCircle size={14} /> Mark as Complete
              </button>
            )}
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
  const [activeTab, setActiveTab] = useState<BookingStatus | "all" | "pending" | "earnings">("all");
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ id: string | number; action: "accept" | "decline" } | null>(null);
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [reportTarget, setReportTarget] = useState<Booking | null>(null);

  const showToast = (message: string, type: "success" | "info" | "error" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadBookings = async () => {
    const res = await fetchBookingsAction();
    if (res.success) {
      setAllBookings(res.data.map((b: any) => {
        const isUserTutor = user?.role === "tutor";
        const personName = isUserTutor ? b.studentName : b.tutorName;
        const personImage = isUserTutor ? b.studentImage : b.tutorImage;
        return {
          id: b.id,
          studentId: b.studentId,
          tutorId: b.tutorId,
          tutorName: b.tutorName,
          studentName: b.studentName,
          subject: b.subject,
          date: b.sessionDate || b.createdAt,
          time: b.time,
          duration: b.duration,
          status: b.status,
          price: b.priceUSD ? `$${b.priceUSD}` : `Rs. ${b.price}`,
          initials: getInitials(personName),
          avatarColor: getAvatarColor(personName),
          profileImage: personImage ? `${BACKEND_URL}${personImage}` : undefined,
          meetLink: b.meetLink,
          rating: b.rating || undefined,
        };
      }));
    } else {
      showToast(res.error || "Failed to load bookings", "error");
    }
  };

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    else if (user) {
      // Set the correct default tab based on role
      setActiveTab(user.role === "tutor" ? "pending" : "all");
      loadBookings();
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  const role = user.role as "student" | "tutor";
  
  // For tutors, separate pending requests. For students, keep them in the main list.
  const pendingRequests = role === "tutor" ? allBookings.filter(b => b.status === "pending") : allBookings.filter(b => b.status === "pending");
  // For students: exclude both pending and expired from the general non-pending pool (they have their own tab).
  // For tutors: exclude pending (handled separately), keep expired visible in its own tab.
  // For students: include pending in the main list ("All" shows everything except expired).
  const nonPendingBookings = role === "tutor"
    ? allBookings.filter(b => b.status !== "pending")
    : allBookings.filter(b => b.status !== "expired");

  // "all" tab shows non-pending (and for students: non-expired) bookings.
  // "upcoming" tab should never include expired bookings.
  const filtered =
    activeTab === "all" ? nonPendingBookings :
    activeTab === "pending" ? (role === "tutor" ? [] : allBookings.filter(b => b.status === "pending")) :
    activeTab === "earnings" ? [] :
    activeTab === "expired"
      ? allBookings.filter(b => b.status === "expired")
      : nonPendingBookings.filter(b => b.status === activeTab);

  const handleAcceptClick = (id: string | number) => setConfirmDialog({ id, action: "accept" });
  const handleDeclineClick = (id: string | number) => setConfirmDialog({ id, action: "decline" });

  const handleMarkComplete = async (id: string | number) => {
    const res = await updateBookingStatusAction(String(id), "completed");
    if (res.success) {
      showToast("Session marked as completed!", "success");
      loadBookings();
    } else {
      showToast(res.error || "Failed to mark session as complete", "error");
    }
  };

  const executeConfirm = async () => {
    if (!confirmDialog) return;
    const status = confirmDialog.action === "accept" ? "upcoming" : "cancelled";
    
    const res = await updateBookingStatusAction(String(confirmDialog.id), status);
    
    if (res.success) {
      showToast(`Booking request ${confirmDialog.action}ed!`, confirmDialog.action === "accept" ? "success" : "info");
      loadBookings();
    } else {
      showToast(res.error || "Failed to update booking status", "error");
    }
    
    setConfirmDialog(null);
  };

  const counts = {
    all: nonPendingBookings.length,
    pending: pendingRequests.length,
    upcoming: nonPendingBookings.filter(b => b.status === "upcoming").length,
    completed: nonPendingBookings.filter(b => b.status === "completed").length,
    cancelled: nonPendingBookings.filter(b => b.status === "cancelled").length,
    expired: allBookings.filter(b => b.status === "expired").length,
  };

  const totalEarned = nonPendingBookings.filter(b => b.status === "completed")
    .reduce((sum, b) => {
      // Parse $ (USD) or Rs. (NPR) amounts
      const raw = b.price.replace(/[^0-9.]/g, "");
      return sum + parseFloat(raw || "0");
    }, 0);
  const isUSD = nonPendingBookings.some(b => b.price.startsWith("$"));
  const currencySymbol = isUSD ? "$" : "Rs.";

  const TABS: { key: BookingStatus | "all" | "pending" | "earnings"; label: string }[] = role === "tutor"
    ? [
        { key: "pending", label: `Requests (${counts.pending})` },
        { key: "all", label: `All Sessions (${counts.all})` },
        { key: "upcoming", label: `Upcoming (${counts.upcoming})` },
        { key: "completed", label: `Completed (${counts.completed})` },
        { key: "expired", label: `Expired (${counts.expired})` },
        { key: "earnings", label: "Earnings" },
      ]
    : [
        { key: "all", label: `All (${counts.all})` },
        { key: "upcoming", label: `Upcoming (${counts.upcoming})` },
        { key: "pending", label: `Pending (${allBookings.filter(b => b.status === "pending").length})` },
        { key: "completed", label: `Completed (${counts.completed})` },
        { key: "cancelled", label: `Cancelled (${counts.cancelled})` },
        { key: "expired", label: `Expired (${counts.expired})` },
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
            ) : role === "tutor" ? (
              pendingRequests.map(r => (
                <BookingCard key={r.id} booking={r} role={role} isPending onAccept={() => handleAcceptClick(r.id)} onDecline={() => handleDeclineClick(r.id)} onShowToast={showToast} onReport={(b) => setReportTarget(b)} />
              ))
            ) : (
              pendingRequests.map(r => (
                <BookingCard key={r.id} booking={r} role={role} onShowToast={showToast} onReport={(b) => setReportTarget(b)} />
              ))
            )}
          </div>
        )}

        {activeTab === "earnings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Earnings Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              {[
                { label: "Total Earned", value: `${currencySymbol} ${totalEarned.toLocaleString()}`, color: "#16a34a", bg: "#dcfce7" },
                { label: "Completed Sessions", value: `${counts.completed}`, color: "#0B4085", bg: "#e8eef7" },
                { label: "Avg. per Session", value: `${currencySymbol} ${(totalEarned / Math.max(counts.completed, 1)).toFixed(2)}`, color: "#8b5cf6", bg: "#f3e8ff" },
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
              {nonPendingBookings.filter(b => b.status === "completed").map((b, i) => (
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
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  role={role}
                  onShowToast={showToast}
                  onMarkComplete={role === "tutor" && booking.status === "upcoming" ? () => handleMarkComplete(booking.id) : undefined}
                  onReview={role === "student" ? (b) => setReviewTarget(b) : undefined}
                  onReport={(b) => setReportTarget(b)}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed", top: "5rem", right: "2rem", zIndex: 1000,
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

      {/* Review Modal */}
      {reviewTarget && (
        <ReviewModal
          isOpen={!!reviewTarget}
          onClose={() => setReviewTarget(null)}
          targetType="tutor"
          tutorId={reviewTarget.tutorId || ""}
          bookingId={String(reviewTarget.id)}
          targetName={reviewTarget.tutorName}
          onSuccess={(rating: number) => {
            showToast("Review submitted! Thank you.", "success");
            setReviewTarget(null);
            // Mark this booking locally as rated
            setAllBookings(prev => prev.map(b => b.id === reviewTarget.id ? { ...b, rating } : b));
          }}
        />
      )}

      {/* Report Modal */}
      {reportTarget && (
        <ReportModal
          reportedUserId={(user?.role === "tutor" ? reportTarget.studentId : reportTarget.tutorId) || ""}
          reportedUserName={user?.role === "tutor" ? reportTarget.studentName : reportTarget.tutorName}
          onClose={() => setReportTarget(null)}
          onSuccess={() => showToast("Report submitted successfully!", "success")}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(-20px); }
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

