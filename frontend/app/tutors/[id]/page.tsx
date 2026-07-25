"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Award,
  Lock,
  X,
} from "lucide-react";

import { fetchTutorByIdAction, fetchTutorBookedSlotsAction } from "@/lib/actions/tutor-action";
import { enrollInCourseAction } from "@/lib/actions/booking-action";
import { createCheckoutSessionAction } from "@/lib/actions/payment-action";
import { getTutorReviewsAction } from "@/lib/actions/review-action";
import { useUser } from "@/lib/context/UserContext";
import ReviewModal from "@/app/_components/ReviewModal";
import { PenLine } from "lucide-react";


const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

function StarRow({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "0.15rem" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={14} fill={n <= Math.round(rating) ? "#f59e0b" : "none"} stroke={n <= Math.round(rating) ? "#f59e0b" : "#cbd5e1"} />
      ))}
    </div>
  );
}

export default function TutorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const id = String(params.id);
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [bookedSlots, setBookedSlots] = useState<{ day: string; time: string }[]>([]);
  const [realReviews, setRealReviews] = useState<any[]>([]);
  const [reviewModal, setReviewModal] = useState<{ type: "tutor" | "course"; courseId?: string; name: string } | null>(null);

  React.useEffect(() => {
    const loadTutor = async () => {
      const res = await fetchTutorByIdAction(id);
      if (res.success) {
        const t = res.data;
        setTutor({
          id: t.userId,
          name: t.name,
          subjects: t.subjects || [],
          level: (t.levels && t.levels.length > 0) ? t.levels[0] : "All Levels",
          rating: t.averageRating || 0,
          reviews: t.reviewCount || 0,
          tags: [],
          price: t.hourlyRate || 500,
          initials: getInitials(t.name),
          avatarColor: getAvatarColor(t.name),
          location: t.location || "Kathmandu",
          bio: t.bio || "",
          availability: t.availDays || [],
          experience: t.experience || "",
          institution: t.institution || "",
          languages: t.languages || [],
          sessionTypes: t.sessionTypes || [],
          achievements: [],
          courses: t.courses || [],
          reviews_data: []
        });

        // Load real reviews
        const reviewsRes = await getTutorReviewsAction(t.userId || id);
        if (reviewsRes.success && reviewsRes.data) {
          setRealReviews(reviewsRes.data);
        }
      }
      
      const slotsRes = await fetchTutorBookedSlotsAction(id);
      if (slotsRes.success && slotsRes.data) {
        setBookedSlots(slotsRes.data);
      }
      
      setLoading(false);
    };
    loadTutor();
  }, [id]);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Stripe payment modal
  const [showPayment, setShowPayment] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const ALL_TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];
  
  const getAvailableTimeSlots = () => {
    if (!selectedDay) return ALL_TIME_SLOTS;
    const bookedTimesForDay = bookedSlots.filter(s => s.day === selectedDay).map(s => s.time);
    return ALL_TIME_SLOTS.filter(slot => !bookedTimesForDay.includes(slot));
  };
  
  const TIME_SLOTS = getAvailableTimeSlots();

  // NPR → USD conversion (same rate as backend)
  const NPR_TO_USD = 134;
  const priceUSD = tutor ? Math.round((tutor.price / NPR_TO_USD) * 100) / 100 : 0;

  const handleBookSession = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!selectedDay || !selectedTime) {
      showToast("Please select a day and time slot first.", "error");
      return;
    }
    setShowPayment(true);
  };

  /**
   * Calls the backend to create a Stripe Checkout Session,
   * then redirects the student to Stripe's hosted payment page.
   */
  const handleStripeCheckout = async () => {
    if (!user || !selectedDay || !selectedTime || !tutor) return;
    setPayLoading(true);

    const res = await createCheckoutSessionAction({
      tutorId: id,
      subject: tutor.subjects[0] || "General",
      day: selectedDay,
      time: selectedTime,
      duration: "60 min",
      notes: "Booked via platform",
    });

    if (res.success && res.data?.url) {
      // Redirect to Stripe hosted checkout
      window.location.href = res.data.url;
    } else {
      setPayLoading(false);
      setShowPayment(false);
      showToast(res.error || "Failed to initiate payment. Please try again.", "error");
    }
  };


  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Tutor not found</h2>
        <button onClick={() => router.push("/find-tutors")} className="btn-primary" style={{ cursor: "pointer" }}>
          <ArrowLeft size={16} /> Back to tutors
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--color-bg-secondary)", minHeight: "100vh" }}>
      {/* ── Back link ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container" style={{ padding: "0.85rem 1.5rem" }}>
          <button
            onClick={() => router.push("/dashboard/find-tutors")}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-muted)", textDecoration: "none", border: "none", background: "none", cursor: "pointer" }}
            className="back-link"
          >
            <ChevronLeft size={16} /> Back to Find Tutors
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.5rem", alignItems: "start" }} className="profile-grid">

          {/* ── Left: Profile details ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Profile card */}
            <div className="card" style={{ padding: "2rem", overflow: "hidden" }}>
              <div
                style={{
                  height: "6px",
                  background: `linear-gradient(90deg, ${tutor.avatarColor}, ${tutor.avatarColor}66)`,
                  marginTop: "-2rem",
                  marginLeft: "-2rem",
                  marginRight: "-2rem",
                  marginBottom: "2rem",
                }}
              />
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                {/* Avatar */}
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: tutor.avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: "#fff",
                    flexShrink: 0,
                    boxShadow: `0 6px 20px ${tutor.avatarColor}55`,
                  }}
                >
                  {tutor.initials}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.01em" }}>{tutor.name}</h1>
                    <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.65rem", borderRadius: "var(--radius-full)" }}>
                      ✓ Verified
                    </span>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>
                    {tutor.institution}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", fontSize: "0.82rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--color-text-muted)" }}>
                      <MapPin size={14} /> {tutor.location}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--color-text-muted)" }}>
                      <Clock size={14} /> {tutor.experience} experience
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--color-text-muted)" }}>
                      <BookOpen size={14} /> {tutor.level}
                    </span>
                  </div>

                  {/* Rating */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.85rem", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <StarRow rating={tutor.rating} />
                      <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>{tutor.rating ? tutor.rating.toFixed(1) : "N/A"}</span>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>({tutor.reviews || 0} reviews)</span>
                    {tutor.tags.map((tag: string) => (
                      <span key={tag} style={{ fontSize: "0.7rem", fontWeight: 600, padding: "0.18rem 0.55rem", borderRadius: "var(--radius-full)", background: "var(--color-primary-light)", color: "var(--color-primary)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="card" style={{ padding: "1.75rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.85rem" }}>About</h2>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.7 }}>{tutor.bio}</p>
            </div>

            {/* Subjects & Session info */}
            <div className="card" style={{ padding: "1.75rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Teaching Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Subjects</p>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {tutor.subjects.map((s: string) => (
                      <span key={s} style={{ fontSize: "0.8rem", fontWeight: 600, padding: "0.3rem 0.75rem", borderRadius: "var(--radius-full)", background: "var(--color-primary-light)", color: "var(--color-primary)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Session Type</p>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {tutor.sessionTypes.map((s: string) => (
                      <span key={s} style={{ fontSize: "0.8rem", fontWeight: 600, padding: "0.3rem 0.75rem", borderRadius: "var(--radius-full)", background: "var(--color-bg-secondary)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Languages</p>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {tutor.languages.map((l: string) => (
                      <span key={l} style={{ fontSize: "0.8rem", fontWeight: 600, padding: "0.3rem 0.75rem", borderRadius: "var(--radius-full)", background: "var(--color-bg-secondary)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Available Days</p>
                  <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                    {DAYS.map((day) => {
                      const isAvail = Array.isArray(tutor.availability) && tutor.availability.includes(day);
                      return (
                      <span
                        key={day}
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "var(--radius-sm)",
                          background: isAvail ? "var(--color-primary)" : "var(--color-bg-secondary)",
                          color: isAvail ? "#fff" : "var(--color-text-light)",
                          border: `1px solid ${isAvail ? "var(--color-primary)" : "var(--color-border)"}`,
                        }}
                      >
                        {day}
                      </span>
                    )})}
                  </div>
                </div>
              </div>
            </div>

            {/* Courses & Modules */}
            {tutor.courses && tutor.courses.length > 0 && (
              <div className="card" style={{ padding: "1.75rem" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <BookOpen size={16} color="var(--color-primary)" /> Syllabus &amp; Modules
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {tutor.courses.map((course: any) => {
                    const isEnrolled = enrolledIds.has(course._id || course.id);
                    const isEnrolling = enrollingId === (course._id || course.id);
                    return (
                      <div key={course._id || course.id} style={{ padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                          <div>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-text)", margin: "0 0 0.15rem" }}>
                              {course.title}
                            </h3>
                            {course.level && <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{course.level}</span>}
                            {course.price && <span style={{ fontSize: "0.75rem", color: "#64748b", marginLeft: "0.75rem" }}>NPR {course.price}</span>}
                          </div>
                          {user && user.role === "student" && (
                            <button
                              disabled={isEnrolled || isEnrolling}
                              onClick={async () => {
                                const cId = course._id || course.id;
                                if (!cId) { showToast("Course ID not available", "error"); return; }
                                setEnrollingId(cId);
                                const res = await enrollInCourseAction(id, cId);
                                setEnrollingId(null);
                                if (res.success) {
                                  setEnrolledIds(prev => new Set([...prev, cId]));
                                  showToast("Course added to your learnings! 🎉");
                                } else {
                                  showToast(res.error || "Failed to add course", "error");
                                }
                              }}
                              style={{
                                padding: "0.4rem 0.9rem",
                                borderRadius: "8px",
                                border: "none",
                                background: isEnrolled ? "#bbf7d0" : "linear-gradient(135deg, #0B4085, #1a56b3)",
                                color: isEnrolled ? "#16a34a" : "#fff",
                                fontWeight: 700,
                                fontSize: "0.8rem",
                                cursor: (isEnrolled || isEnrolling) ? "not-allowed" : "pointer",
                                whiteSpace: "nowrap",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                flexShrink: 0,
                                transition: "all 0.2s",
                              }}
                            >
                              {isEnrolling ? "Adding..." : isEnrolled ? "✓ Added" : "+ Add to Learnings"}
                            </button>
                          )}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                          {course.modules.map((mod: any, i: number) => (
                            <span key={i} style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "var(--radius-sm)", background: "#fff", border: "1px solid #cbd5e1", color: "var(--color-text-muted)" }}>
                              {i + 1}. {mod.title || mod}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {tutor.achievements && tutor.achievements.length > 0 && (
              <div className="card" style={{ padding: "1.75rem" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Award size={16} color="var(--color-primary)" /> Achievements
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {tutor.achievements.map((ach: string) => (
                    <div key={ach} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.875rem" }}>
                      <CheckCircle size={15} color="#22c55e" />
                      <span style={{ color: "var(--color-text-muted)" }}>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real Student Reviews */}
            <div className="card" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MessageCircle size={16} color="var(--color-primary)" /> Student Reviews
                  {realReviews.length > 0 && (
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#64748b" }}>({realReviews.length})</span>
                  )}
                </h2>
                {user && user.role === "student" && (
                  <button
                    onClick={() => setReviewModal({ type: "tutor", name: tutor.name })}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.4rem",
                      background: "none", color: "#0B4085", border: "1.5px solid #0B4085",
                      borderRadius: "8px", padding: "0.4rem 0.9rem",
                      fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
                    }}
                  >
                    <PenLine size={13} /> Review Tutor
                  </button>
                )}
              </div>
              {realReviews.length === 0 ? (
                <p style={{ fontSize: "0.875rem", color: "#94a3b8", textAlign: "center", padding: "2rem 0" }}>
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {realReviews.map((rev: any, i: number) => {
                    const name = rev.studentId?.fullName || "Anonymous";
                    return (
                      <div key={i} style={{ padding: "1rem", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.72rem", fontWeight: 700 }}>
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{name}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <StarRow rating={rev.rating} />
                            <span style={{ fontSize: "0.72rem", color: "var(--color-text-light)" }}>
                              {new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", lineHeight: 1.55, margin: 0 }}>{rev.reviewText}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>


          {/* ── Right: Booking card ── */}
          <div style={{ position: "sticky", top: "88px", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="card" style={{ padding: "1.5rem" }}>
              {/* Price */}
              <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--color-text)" }}>Rs. {tutor.price}</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>/session</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <StarRow rating={tutor.rating} />
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{tutor.rating ? tutor.rating.toFixed(1) : "N/A"} ({tutor.reviews || 0})</span>
                </div>
              </div>

              {/* Select Day */}
              <div style={{ marginBottom: "1.1rem" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Calendar size={13} /> Select Day
                </p>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {tutor.availability && Array.isArray(tutor.availability) && tutor.availability.map((day: string) => (
                    <button
                      key={day}
                      onClick={() => {
                        const newDay = day === selectedDay ? null : day;
                        setSelectedDay(newDay);
                        if (newDay && selectedTime) {
                          const bookedTimesForNewDay = bookedSlots.filter(s => s.day === newDay).map(s => s.time);
                          if (bookedTimesForNewDay.includes(selectedTime)) {
                            setSelectedTime(null);
                          }
                        }
                      }}
                      style={{
                        padding: "0.4rem 0.7rem",
                        borderRadius: "var(--radius-sm)",
                        border: `2px solid ${selectedDay === day ? "var(--color-primary)" : "var(--color-border)"}`,
                        background: selectedDay === day ? "var(--color-primary)" : "#fff",
                        color: selectedDay === day ? "#fff" : "var(--color-text-muted)",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Time */}
              <div style={{ marginBottom: "1.25rem" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Clock size={13} /> Select Time
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot === selectedTime ? null : slot)}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "var(--radius-sm)",
                        border: `2px solid ${selectedTime === slot ? "var(--color-primary)" : "var(--color-border)"}`,
                        background: selectedTime === slot ? "var(--color-primary)" : "#fff",
                        color: selectedTime === slot ? "#fff" : "var(--color-text-muted)",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "0.85rem", fontSize: "0.9rem" }}
                onClick={handleBookSession}
              >
                Book Session — ${priceUSD} USD
              </button>

              <p style={{ fontSize: "0.72rem", color: "var(--color-text-light)", textAlign: "center", marginTop: "0.4rem" }}>
                ≈ Rs. {tutor.price} NPR · Secure payment via Stripe
              </p>
            </div>

            {/* Message card */}
            <div className="card" style={{ padding: "1.25rem" }}>
              <button
                className="btn-outline"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => router.push(`/dashboard/messages?userId=${tutor?.id}`)}
              >
                <MessageCircle size={16} /> Send a Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Payment Modal (Stripe Checkout) ── */}
      {showPayment && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "440px", boxShadow: "0 30px 60px rgba(0,0,0,0.3)", overflow: "hidden" }}>

            {/* Modal Header */}
            <div style={{ background: "linear-gradient(135deg, #0B4085, #1e3a8a)", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", margin: "0 0 0.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Secure Checkout</p>
                <h2 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>Book with {tutor.name}</h2>
              </div>
              {!payLoading && (
                <button onClick={() => setShowPayment(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "8px", padding: "0.4rem", cursor: "pointer", display: "flex" }}>
                  <X size={18} color="#fff" />
                </button>
              )}
            </div>

            {/* Order Summary */}
            <div style={{ background: "#f8fafc", padding: "1.25rem 2rem", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 500 }}>Session</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1e293b" }}>{selectedDay} · {selectedTime}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 500 }}>Subject</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1e293b" }}>{tutor.subjects[0] || "General"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.6rem", borderTop: "1px dashed #e2e8f0" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#334155" }}>Total Charged</span>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontWeight: 900, fontSize: "1.25rem", color: "#0B4085" }}>${priceUSD} USD</p>
                  <p style={{ margin: 0, fontSize: "0.72rem", color: "#94a3b8" }}>≈ Rs. {tutor.price} NPR</p>
                </div>
              </div>
            </div>

            <div style={{ padding: "1.75rem 2rem" }}>
              {/* Security badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "0.6rem 1rem", marginBottom: "1.25rem" }}>
                <Lock size={14} color="#16a34a" />
                <span style={{ fontSize: "0.78rem", color: "#15803d", fontWeight: 600 }}>Payments are secured by Stripe · 256-bit SSL</span>
              </div>

              {/* Stripe Pay button */}
              <button
                onClick={handleStripeCheckout}
                disabled={payLoading}
                style={{
                  background: payLoading ? "#94a3b8" : "linear-gradient(135deg, #635BFF, #4f46e5)",
                  color: "#fff", border: "none",
                  padding: "1rem", borderRadius: "10px",
                  fontSize: "1rem", fontWeight: 800, cursor: payLoading ? "not-allowed" : "pointer",
                  width: "100%", boxShadow: payLoading ? "none" : "0 4px 14px rgba(99,91,255,0.35)",
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                }}
              >
                {payLoading ? (
                  <>
                    <div style={{ width: "18px", height: "18px", border: "3px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    {/* Stripe logo */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                    </svg>
                    Pay ${priceUSD} with Stripe →
                  </>
                )}
              </button>

              <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.75rem" }}>
                You will be redirected to Stripe's secure payment page.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed", top: "2rem", right: "2rem", zIndex: 9999,
          background: toast.type === "success" ? "#22c55e" : "#ef4444",
          color: "#fff", padding: "1rem 1.5rem", borderRadius: "12px",
          display: "flex", alignItems: "center", gap: "0.75rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          fontWeight: 600, fontSize: "0.95rem",
          animation: "toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          {toast.message}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && tutor && (
        <ReviewModal
          isOpen={!!reviewModal}
          onClose={() => setReviewModal(null)}
          targetType={reviewModal.type}
          tutorId={tutor.id}
          courseId={reviewModal.courseId}
          targetName={reviewModal.name}
          onSuccess={(_rating: number) => {
            showToast("Review submitted successfully!");
            setReviewModal(null);
            // Refresh reviews and re-fetch tutor to get updated average rating
            getTutorReviewsAction(tutor.id).then(res => {
              if (res.success && res.data) setRealReviews(res.data);
            });
            // Re-fetch the tutor profile to get updated averageRating & reviewCount
            fetchTutorByIdAction(tutor.id).then(res => {
              if (res.success && res.data) {
                setTutor((prev: any) => ({
                  ...prev,
                  rating: res.data.averageRating || 0,
                  reviews: res.data.reviewCount || 0,
                }));
              }
            });
          }}
        />
      )}

      <style>{`
        .back-link:hover { color: var(--color-primary) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastSlideIn { from { opacity: 0; transform: translateY(-20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (max-width: 900px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
