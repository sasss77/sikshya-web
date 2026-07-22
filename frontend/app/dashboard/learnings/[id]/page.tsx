"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import {
  ChevronLeft,
  CheckCircle2,
  Circle,
  BookOpen,
  FileText,
  Video,
  AlignLeft,
  Download,
  Calendar,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Clock,
  UserCircle,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Star,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { getEnrollmentDetailAction, markModuleReadAction } from "@/lib/actions/booking-action";
import { createBookingAction } from "@/lib/actions/booking-action";
import { fetchTutorBookedSlotsAction } from "@/lib/actions/tutor-action";

const getFileUrl = (url: string) => {
  if (url.startsWith("/uploads/")) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
    return `${baseUrl}${url}`;
  }
  return url;
};

/* ─── Progress Bar ─────────────────────── */
function ProgressBar({ value }: { value: number }) {
  return (
    <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${value}%`,
        background: value === 100 ? "#22c55e" : "linear-gradient(90deg, #0B4085, #1a56b3)",
        borderRadius: "999px", transition: "width 0.6s ease",
      }} />
    </div>
  );
}

const contentTypeIcon = (type: string) => {
  if (type === "video") return <Video size={15} color="#8b5cf6" />;
  if (type === "pdf") return <FileText size={15} color="#ef4444" />;
  return <AlignLeft size={15} color="#0B4085" />;
};

export default function CourseDetailsPage() {
  const { user, loading } = useUser();
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : String(params.id);

  const [enrollment, setEnrollment] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [markingModule, setMarkingModule] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Booking modal
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<{ day: string; time: string }[]>([]);

  const ALL_TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];
  
  const getAvailableTimeSlots = () => {
    if (!selectedDay) return ALL_TIME_SLOTS;
    const bookedTimesForDay = bookedSlots.filter(s => s.day === selectedDay).map(s => s.time);
    return ALL_TIME_SLOTS.filter(slot => !bookedTimesForDay.includes(slot));
  };
  
  const TIME_SLOTS = getAvailableTimeSlots();
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!loading && !user) { router.replace("/login"); return; }
    if (user && user.role === "student") {
      const load = async () => {
        const res = await getEnrollmentDetailAction(id);
        if (res.success) {
          setEnrollment(res.data);
          
          if (res.data?.tutorId) {
            const slotsRes = await fetchTutorBookedSlotsAction(res.data.tutorId);
            if (slotsRes.success && slotsRes.data) {
              setBookedSlots(slotsRes.data);
            }
          }
        } else {
          showToast(res.error || "Failed to load course", "error");
        }
        setLoadingData(false);
      };
      load();
    }
  }, [user, loading, id]);

  const handleMarkModule = async (moduleTitle: string) => {
    if (!enrollment) return;
    const totalModules = enrollment.courseModules?.length || enrollment.topics?.length || 0;
    setMarkingModule(moduleTitle);
    const res = await markModuleReadAction(id, moduleTitle, totalModules);
    setMarkingModule(null);
    if (res.success) {
      setEnrollment((prev: any) => ({
        ...prev,
        completedModules: res.data.completedModules,
        progress: res.data.progress,
        status: res.data.status,
      }));
    } else {
      showToast(res.error || "Failed to update module", "error");
    }
  };

  const handleBookSession = async () => {
    if (!selectedDay || !selectedTime) {
      showToast("Please select a day and time", "error");
      return;
    }
    setBookingLoading(true);
    const res = await createBookingAction({
      tutorId: enrollment.tutorId,
      subject: enrollment.subject,
      day: selectedDay,
      time: selectedTime,
      duration: "60 min",
      notes: `Session for ${enrollment.courseTitle || enrollment.subject}`,
      courseId: enrollment.courseId,
    });
    setBookingLoading(false);
    if (res.success) {
      setShowBooking(false);
      showToast("Session booked successfully! 🎉");
    } else {
      showToast(res.error || "Failed to book session", "error");
    }
  };

  if (loading || loadingData) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "3rem", textAlign: "center", border: "1px solid #e2e8f0" }}>
          <GraduationCap size={48} color="#cbd5e0" style={{ margin: "0 auto 1rem" }} />
          <h2 style={{ fontWeight: 800, color: "#1a202c", margin: "0 0 0.5rem" }}>Course not found</h2>
          <button onClick={() => router.push("/dashboard/learnings")} style={{ marginTop: "1rem", background: "#0B4085", color: "#fff", border: "none", borderRadius: "8px", padding: "0.65rem 1.5rem", fontWeight: 600, cursor: "pointer" }}>
            Back to My Learnings
          </button>
        </div>
      </div>
    );
  }

  const modules = enrollment.courseModules ?? [];
  const completedModules: string[] = enrollment.completedModules ?? [];
  const progress = enrollment.progress ?? 0;
  const totalModules = modules.length;

  return (
    <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Back Button */}
        <button onClick={() => router.push("/dashboard/learnings")} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "0.875rem", fontWeight: 500, marginBottom: "1.5rem" }}>
          <ChevronLeft size={16} /> Back to My Learnings
        </button>

        {/* Header Card */}
        <div style={{ background: "linear-gradient(135deg, #0B4085 0%, #1a56b3 100%)", borderRadius: "20px", padding: "2rem", color: "#fff", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.8rem", opacity: 0.7, margin: "0 0 0.3rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {enrollment.courseLevel || "Course"}
              </p>
              <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
                {enrollment.courseTitle || enrollment.subject}
              </h1>
              <p style={{ opacity: 0.8, fontSize: "0.9rem", margin: 0 }}>
                Your learning journey with <strong>{enrollment.tutorName}</strong>
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignSelf: "flex-start" }}>
              {enrollment.nextSession && (
                <button
                  onClick={() => {
                    showToast("Redirecting to Google Meet...", "info");
                    window.open("https://meet.google.com/new", "_blank");
                  }}
                  style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: "10px", padding: "0.6rem 1.2rem", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(34,197,94,0.3)" }}
                >
                  <Video size={15} /> Join on Meet
                </button>
              )}
              <button
                onClick={() => setShowBooking(true)}
                style={{ background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", color: "#fff", borderRadius: "10px", padding: "0.6rem 1.2rem", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", backdropFilter: "blur(4px)", whiteSpace: "nowrap" }}
              >
                <Calendar size={15} /> Book Session
              </button>
            </div>
          </div>

          {/* Progress */}
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", opacity: 0.8, fontWeight: 600 }}>Course Progress</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 800 }}>{progress}% ({completedModules.length}/{totalModules} modules)</span>
            </div>
            <div style={{ height: "10px", background: "rgba(255,255,255,0.2)", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "#fff", borderRadius: "999px", transition: "width 0.6s ease" }} />
            </div>
          </div>
        </div>

        {/* ── Tutor Info Card ── */}
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          boxShadow: "0 1px 8px rgba(11,64,133,0.05)",
          display: "flex",
          gap: "1.25rem",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}>
          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            {enrollment.tutorImage ? (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${enrollment.tutorImage}`}
                alt={enrollment.tutorName}
                style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", border: "3px solid #e8eef7" }}
              />
            ) : (
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "linear-gradient(135deg, #0B4085, #1a56b3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem", fontWeight: 800, color: "#fff",
                border: "3px solid #e8eef7",
              }}>
                {enrollment.tutorName?.charAt(0).toUpperCase() || "T"}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1a202c", margin: 0 }}>
                {enrollment.tutorName}
              </h3>
              {enrollment.tutorRating > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "#fef3c7", color: "#d97706", fontSize: "0.75rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
                  <Star size={11} fill="#f59e0b" color="#f59e0b" />
                  {enrollment.tutorRating.toFixed(1)}
                  {enrollment.tutorReviewCount > 0 && ` (${enrollment.tutorReviewCount})`}
                </span>
              )}
            </div>

            {enrollment.tutorBio && (
              <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0 0 0.75rem", lineHeight: 1.5 }}>
                {enrollment.tutorBio.length > 120 ? enrollment.tutorBio.slice(0, 120) + "..." : enrollment.tutorBio}
              </p>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", marginBottom: "1rem" }}>
              {enrollment.tutorEmail && (
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "#64748b" }}>
                  <Mail size={13} color="#0B4085" /> {enrollment.tutorEmail}
                </span>
              )}
              {enrollment.tutorPhone && (
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "#64748b" }}>
                  <Phone size={13} color="#22c55e" /> {enrollment.tutorPhone}
                </span>
              )}
              {enrollment.tutorLocation && (
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "#64748b" }}>
                  <MapPin size={13} color="#ef4444" /> {enrollment.tutorLocation}
                </span>
              )}
            </div>

            {enrollment.tutorSubjects?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
                {enrollment.tutorSubjects.slice(0, 4).map((s: string) => (
                  <span key={s} style={{ background: "#e8eef7", color: "#0B4085", fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.65rem", borderRadius: "999px" }}>{s}</span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {enrollment.tutorId && (
                <Link
                  href={`/tutors/${enrollment.tutorId}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    background: "#0B4085", color: "#fff", borderRadius: "9px",
                    padding: "0.5rem 1.1rem", fontSize: "0.82rem", fontWeight: 700,
                    textDecoration: "none", boxShadow: "0 2px 8px rgba(11,64,133,0.2)",
                  }}
                >
                  <UserCircle size={15} /> View Full Profile
                </Link>
              )}
              <Link
                href={`/dashboard/messages?userId=${enrollment?.tutorId || ""}`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  background: "#fff", color: "#0B4085", border: "1.5px solid #0B4085",
                  borderRadius: "9px", padding: "0.5rem 1.1rem",
                  fontSize: "0.82rem", fontWeight: 700, textDecoration: "none",
                }}
              >
                <MessageSquare size={15} /> Message Tutor
              </Link>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: "1.5rem" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BookOpen size={18} color="#0B4085" />
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#1a202c", margin: 0 }}>Course Modules</h2>
            <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>
              {completedModules.length}/{totalModules} completed
            </span>
          </div>

          {modules.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
              <BookOpen size={40} color="#cbd5e0" style={{ margin: "0 auto 1rem" }} />
              <p style={{ margin: 0 }}>No modules added to this course yet.</p>
            </div>
          ) : (
            modules.map((mod: any, idx: number) => {
              const title = typeof mod === "string" ? mod : mod.title;
              const contents: any[] = mod.contents ?? [];
              const isDone = completedModules.includes(title);
              const isExpanded = expandedModule === idx;
              const isMarking = markingModule === title;

              return (
                <div key={idx} style={{ borderBottom: idx < modules.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  {/* Module Header */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem 1.5rem", cursor: "pointer", background: isDone ? "#f0fdf4" : "#fff", transition: "background 0.15s" }}
                    onClick={() => setExpandedModule(isExpanded ? null : idx)}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMarkModule(title); }}
                      disabled={isMarking}
                      style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: 0 }}
                    >
                      {isMarking ? (
                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.6s linear infinite" }} />
                      ) : isDone ? (
                        <CheckCircle2 size={20} color="#22c55e" />
                      ) : (
                        <Circle size={20} color="#cbd5e1" />
                      )}
                    </button>

                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem", color: isDone ? "#16a34a" : "#1a202c" }}>
                        {idx + 1}. {title}
                      </p>
                      {contents.length > 0 && (
                        <p style={{ margin: "0.1rem 0 0", fontSize: "0.75rem", color: "#64748b" }}>
                          {contents.length} resource{contents.length > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>

                    {contents.length > 0 && (
                      isExpanded ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />
                    )}
                  </div>

                  {/* Module Contents */}
                  {isExpanded && contents.length > 0 && (
                    <div style={{ background: "#f8fafc", borderTop: "1px solid #f1f5f9", padding: "0.75rem 1.5rem 1rem 3.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {contents.map((c: any, ci: number) => (
                        <div key={ci} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.75rem", background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                          {contentTypeIcon(c.type)}
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>{c.title}</p>
                            <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", textTransform: "capitalize" }}>{c.type}</p>
                          </div>
                          {c.type !== "text" && c.urlOrText && (
                            <a href={getFileUrl(c.urlOrText)} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#0B4085", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none" }}>
                              <Download size={13} /> Open
                            </a>
                          )}
                          {c.type === "text" && c.urlOrText && (
                            <div style={{ marginTop: "0.5rem", padding: "0.5rem", background: "#f8fafc", borderRadius: "6px", fontSize: "0.82rem", color: "#374151", lineHeight: 1.6 }}>
                              {c.urlOrText}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Topics (fallback if no courseModules) */}
        {modules.length === 0 && enrollment.topics && enrollment.topics.length > 0 && (
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#1a202c", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BookOpen size={18} color="#0B4085" /> Topics
            </h2>
            {enrollment.topics.map((t: any, i: number) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0", borderBottom: i < enrollment.topics.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                {t.done ? <CheckCircle2 size={18} color="#22c55e" /> : <Circle size={18} color="#cbd5e1" />}
                <span style={{ fontSize: "0.875rem", color: t.done ? "#16a34a" : "#374151", fontWeight: t.done ? 600 : 400 }}>{t.label}</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ─── Book Session Modal ─── */}
      {showBooking && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "2rem", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontWeight: 800, fontSize: "1.25rem", color: "#1a202c", margin: "0 0 1.5rem" }}>Book a Session</h2>
            <p style={{ fontSize: "0.875rem", color: "#64748b", margin: "0 0 1.25rem" }}>
              Course: <strong>{enrollment.courseTitle || enrollment.subject}</strong> with <strong>{enrollment.tutorName}</strong>
            </p>

            {/* Select Day */}
            <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#374151", margin: "0 0 0.5rem" }}>Select Day</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {DAYS.map(day => (
                <button key={day} onClick={() => {
                  const newDay = day;
                  setSelectedDay(newDay);
                  if (newDay && selectedTime) {
                    const bookedTimesForNewDay = bookedSlots.filter(s => s.day === newDay).map(s => s.time);
                    if (bookedTimesForNewDay.includes(selectedTime)) {
                      setSelectedTime(null);
                    }
                  }
                }} style={{ padding: "0.4rem 0.85rem", borderRadius: "8px", border: "1.5px solid", borderColor: selectedDay === day ? "#0B4085" : "#e2e8f0", background: selectedDay === day ? "#0B4085" : "#fff", color: selectedDay === day ? "#fff" : "#374151", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}>
                  {day}
                </button>
              ))}
            </div>

            {/* Select Time */}
            <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#374151", margin: "0 0 0.5rem" }}>Select Time</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {TIME_SLOTS.map(slot => (
                <button key={slot} onClick={() => setSelectedTime(slot)} style={{ padding: "0.4rem 0.85rem", borderRadius: "8px", border: "1.5px solid", borderColor: selectedTime === slot ? "#0B4085" : "#e2e8f0", background: selectedTime === slot ? "#0B4085" : "#fff", color: selectedTime === slot ? "#fff" : "#374151", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}>
                  {slot}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setShowBooking(false)} style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontWeight: 700, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleBookSession} disabled={bookingLoading} style={{ flex: 2, padding: "0.75rem", borderRadius: "10px", border: "none", background: bookingLoading ? "#94a3b8" : "linear-gradient(135deg, #0B4085, #1a56b3)", color: "#fff", fontWeight: 700, cursor: bookingLoading ? "not-allowed" : "pointer" }}>
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: "2rem", right: "2rem", zIndex: 9999, background: toast.type === "success" ? "#22c55e" : "#ef4444", color: "#fff", padding: "1rem 1.5rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.75rem", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", fontWeight: 600, fontSize: "0.95rem", animation: "toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastSlideIn { from { opacity: 0; transform: translateY(-20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}
