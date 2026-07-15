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
  CreditCard,
  Lock,
  X,
  CheckCircle2,
} from "lucide-react";

/* ─── Mock data (same as find-tutors — replace with API) ──────── */
const ALL_TUTORS = [
  {
    id: 1, name: "Anish Shrestha", subjects: ["Physics", "Mathematics"], level: "+2 Science", rating: 5.0, reviews: 42, tags: ["SLC Topper", "IOE Scholar"], price: 800, initials: "AS", avatarColor: "#0B4085", location: "Kathmandu",
    bio: "IOE entrance ranker tutoring Physics and Mathematics for +2 and entrance prep. I scored in the top 50 of IOE entrance and have been tutoring students for 2 years. My sessions are focused on concept clarity and problem-solving techniques that help in board exams and entrance tests.",
    availability: ["Mon", "Wed", "Fri", "Sat"], experience: "2 years", institution: "Pulchowk Campus, IOE", languages: ["Nepali", "English"], sessionTypes: ["Online", "In-person"],
    achievements: ["IOE Entrance Rank 42", "SLC GPA 3.95", "2+ years tutoring experience"],
    courses: [
      { id: "c1", title: "Complete Mechanics for +2", modules: ["Kinematics", "Dynamics", "Work, Energy & Power", "Rotational Motion"] },
      { id: "c2", title: "IOE Math Entrance Prep", modules: ["Calculus", "Algebra", "Co-ordinate Geometry", "Trigonometry"] }
    ],
    reviews_data: [{ name: "Ram Thapa", rating: 5, text: "Excellent teacher! Made complex Physics topics very easy to understand.", date: "2 weeks ago" }, { name: "Sita KC", rating: 5, text: "Very patient and thorough. My grades improved significantly.", date: "1 month ago" }, { name: "Hari Pokhrel", rating: 5, text: "Best Physics tutor I've had. Highly recommended!", date: "2 months ago" }]
  },
  {
    id: 2, name: "Priya Sharma", subjects: ["Biology", "Chemistry"], level: "+2 Science", rating: 4.9, reviews: 38, tags: ["Medical Student", "IOM Ranker"], price: 750, initials: "PS", avatarColor: "#0ea5e9", location: "Lalitpur",
    bio: "IOM ranker helping students ace Biology and Chemistry for medical entrance. Currently studying MBBS and passionate about making science accessible to all students.",
    availability: ["Tue", "Thu", "Sat", "Sun"], experience: "1.5 years", institution: "IOM, Maharajgunj", languages: ["Nepali", "English"], sessionTypes: ["Online", "In-person"],
    achievements: ["IOM Entrance Rank 15", "SLC GPA 4.0", "Merit scholarship holder"],
    courses: [
      { id: "c3", title: "Botany & Zoology Crash Course", modules: ["Cell Biology", "Genetics", "Human Physiology", "Ecology"] },
      { id: "c4", title: "Organic Chemistry Fundamentals", modules: ["Alkanes & Alkenes", "Alcohols", "Aldehydes & Ketones"] }
    ],
    reviews_data: [{ name: "Nisha Gurung", rating: 5, text: "Priya explains Biology concepts brilliantly. Very helpful for entrance prep.", date: "1 week ago" }, { name: "Bikram Rai", rating: 5, text: "Clear explanations and great study materials. Highly recommend!", date: "3 weeks ago" }]
  },
  {
    id: 3, name: "Sohan Gurung", subjects: ["Economics", "Accounting"], level: "+2 Management", rating: 4.8, reviews: 29, tags: ["CA Aspirant", "Business Pro"], price: 600, initials: "SG", avatarColor: "#7c3aed", location: "Bhaktapur",
    bio: "CA aspirant teaching Economics and Accounts with focus on board exam strategies.",
    availability: ["Mon", "Tue", "Thu", "Sun"], experience: "2 years", institution: "TU, Faculty of Management", languages: ["Nepali", "English"], sessionTypes: ["Online", "In-person"],
    achievements: ["CA Foundation cleared", "TU Merit Scholarship", "District topper"],
    courses: [
      { id: "c5", title: "Class 12 Economics Core", modules: ["Microeconomics", "Macroeconomics", "Nepalese Economy"] },
      { id: "c6", title: "Accounting for Beginners", modules: ["Journal Entries", "Ledger", "Final Accounts"] }
    ],
    reviews_data: [{ name: "Pooja Maharjan", rating: 5, text: "Great at breaking down complex Accounting concepts.", date: "2 weeks ago" }]
  },
  { 
    id: 4, name: "Sita Rai", subjects: ["English", "Nepali"], level: "SEE", rating: 4.7, reviews: 56, tags: ["Literature Graduate"], price: 500, initials: "SR", avatarColor: "#ec4899", location: "Kathmandu", 
    bio: "Literature graduate helping SEE students improve writing and grammar skills.", 
    availability: ["Mon", "Wed", "Fri"], experience: "3 years", institution: "TU, Central Department of English", languages: ["Nepali", "English"], sessionTypes: ["Online", "In-person"], 
    achievements: ["English Literature Gold Medalist", "Published author"], 
    courses: [{ id: "c7", title: "SEE English Prep", modules: ["Grammar Rules", "Essay Writing", "Reading Comprehension"] }],
    reviews_data: [{ name: "Raju Thapa", rating: 5, text: "Best English tutor. My writing improved a lot!", date: "1 month ago" }] 
  },
  { 
    id: 5, name: "Bikash Tamang", subjects: ["Computer Science", "Mathematics"], level: "+2 Science", rating: 4.9, reviews: 33, tags: ["Software Engineer", "TU Ranker"], price: 900, initials: "BT", avatarColor: "#10b981", location: "Kathmandu", 
    bio: "Software engineer teaching CS fundamentals and Mathematics for entrance.", 
    availability: ["Sat", "Sun"], experience: "2.5 years", institution: "Tribhuvan University, IOST", languages: ["Nepali", "English"], sessionTypes: ["Online"], 
    achievements: ["Software Engineer at tech startup", "TU Computer Science Rank 1"], 
    courses: [{ id: "c8", title: "CS Basics (C Programming)", modules: ["Variables & Loops", "Functions", "Arrays & Pointers", "File Handling"] }],
    reviews_data: [{ name: "Deepa Lama", rating: 5, text: "Very knowledgeable. Explains CS concepts clearly.", date: "2 weeks ago" }] 
  },
  { 
    id: 6, name: "Maya Adhikari", subjects: ["Physics", "Chemistry"], level: "+2 Science", rating: 4.6, reviews: 21, tags: ["IOE Student"], price: 700, initials: "MA", avatarColor: "#f59e0b", location: "Pokhara", 
    bio: "IOE student with strong Physics and Chemistry background ready to tutor.", 
    availability: ["Mon", "Tue", "Wed"], experience: "1 year", institution: "Pulchowk Campus, IOE", languages: ["Nepali"], sessionTypes: ["In-person"], 
    achievements: ["IOE Entrance qualified", "District scholarship holder"], 
    courses: [{ id: "c9", title: "Physics Crash Course", modules: ["Optics", "Modern Physics", "Electricity & Magnetism"] }],
    reviews_data: [{ name: "Anita Pun", rating: 5, text: "Very helpful and patient tutor!", date: "3 weeks ago" }] 
  },
  { 
    id: 7, name: "Roshan KC", subjects: ["Mathematics", "Statistics"], level: "+2 Management", rating: 4.8, reviews: 44, tags: ["MBS Student", "TU Ranker"], price: 650, initials: "RK", avatarColor: "#ef4444", location: "Lalitpur", 
    bio: "MBS student specializing in Statistics and Business Mathematics.", 
    availability: ["Tue", "Thu", "Sat"], experience: "2 years", institution: "TU, Faculty of Management", languages: ["Nepali", "English"], sessionTypes: ["Online", "In-person"], 
    achievements: ["TU Management Topper", "Statistics Champion"], 
    courses: [{ id: "c10", title: "Business Math & Stats", modules: ["Probability", "Linear Programming", "Matrices"] }],
    reviews_data: [{ name: "Sunita Basnet", rating: 4, text: "Good explanations for Statistics. Recommended.", date: "1 month ago" }] 
  },
  { 
    id: 8, name: "Anjali Poudel", subjects: ["Biology", "English"], level: "SEE", rating: 4.7, reviews: 18, tags: ["Nursing Graduate"], price: 450, initials: "AP", avatarColor: "#6366f1", location: "Bhaktapur", 
    bio: "Nursing graduate helping SEE students with Science and English fundamentals.", 
    availability: ["Mon", "Wed", "Fri", "Sun"], experience: "1.5 years", institution: "BP Koirala Institute of Health Sciences", languages: ["Nepali"], sessionTypes: ["Online", "In-person"], 
    achievements: ["Nursing Gold Medalist"], 
    courses: [{ id: "c11", title: "SEE Science Mastery", modules: ["Human Body", "Environment", "Force & Motion"] }],
    reviews_data: [{ name: "Prabin Shrestha", rating: 5, text: "Very good at teaching Biology. My SEE prep improved.", date: "2 weeks ago" }] 
  },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
  const id = Number(params.id);
  const tutor = ALL_TUTORS.find((t) => t.id === id);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Payment modal state
  const [showPayment, setShowPayment] = useState(false);
  const [payStep, setPayStep] = useState<"form" | "processing" | "success">("form");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvc: "" });

  const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

  const handleBookSession = () => {
    if (!selectedDay || !selectedTime) {
      alert("Please select a day and time slot first.");
      return;
    }
    setPayStep("form");
    setCard({ name: "", number: "", expiry: "", cvc: "" });
    setShowPayment(true);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setPayStep("processing");
    setTimeout(() => setPayStep("success"), 2000);
  };

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

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
                      <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>{tutor.rating.toFixed(1)}</span>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>({tutor.reviews} reviews)</span>
                    {tutor.tags.map((tag) => (
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
                    {tutor.subjects.map((s) => (
                      <span key={s} style={{ fontSize: "0.8rem", fontWeight: 600, padding: "0.3rem 0.75rem", borderRadius: "var(--radius-full)", background: "var(--color-primary-light)", color: "var(--color-primary)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Session Type</p>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {tutor.sessionTypes.map((s) => (
                      <span key={s} style={{ fontSize: "0.8rem", fontWeight: 600, padding: "0.3rem 0.75rem", borderRadius: "var(--radius-full)", background: "var(--color-bg-secondary)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Languages</p>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {tutor.languages.map((l) => (
                      <span key={l} style={{ fontSize: "0.8rem", fontWeight: 600, padding: "0.3rem 0.75rem", borderRadius: "var(--radius-full)", background: "var(--color-bg-secondary)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Available Days</p>
                  <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                    {DAYS.map((day) => (
                      <span
                        key={day}
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "var(--radius-sm)",
                          background: tutor.availability.includes(day) ? "var(--color-primary)" : "var(--color-bg-secondary)",
                          color: tutor.availability.includes(day) ? "#fff" : "var(--color-text-light)",
                          border: `1px solid ${tutor.availability.includes(day) ? "var(--color-primary)" : "var(--color-border)"}`,
                        }}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Courses & Modules */}
            {tutor.courses && tutor.courses.length > 0 && (
              <div className="card" style={{ padding: "1.75rem" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <BookOpen size={16} color="var(--color-primary)" /> Syllabus & Modules
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {tutor.courses.map((course) => (
                    <div key={course.id} style={{ padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "var(--color-bg-secondary)" }}>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-text)", margin: "0 0 0.5rem" }}>
                        {course.title}
                      </h3>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {course.modules.map((mod: string, i: number) => (
                          <span key={i} style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "var(--radius-sm)", background: "#fff", border: "1px solid #cbd5e1", color: "var(--color-text-muted)" }}>
                            {i + 1}. {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            <div className="card" style={{ padding: "1.75rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Award size={16} color="var(--color-primary)" /> Achievements
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {tutor.achievements.map((ach) => (
                  <div key={ach} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.875rem" }}>
                    <CheckCircle size={15} color="#22c55e" />
                    <span style={{ color: "var(--color-text-muted)" }}>{ach}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="card" style={{ padding: "1.75rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MessageCircle size={16} color="var(--color-primary)" /> Student Reviews
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {tutor.reviews_data.map((rev, i) => (
                  <div key={i} style={{ padding: "1rem", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.72rem", fontWeight: 700 }}>
                          {rev.name.charAt(0)}
                        </div>
                        <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{rev.name}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <StarRow rating={rev.rating} />
                        <span style={{ fontSize: "0.72rem", color: "var(--color-text-light)" }}>{rev.date}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", lineHeight: 1.55 }}>{rev.text}</p>
                  </div>
                ))}
              </div>
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
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{tutor.rating.toFixed(1)} ({tutor.reviews})</span>
                </div>
              </div>

              {/* Select Day */}
              <div style={{ marginBottom: "1.1rem" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Calendar size={13} /> Select Day
                </p>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {tutor.availability.map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day === selectedDay ? null : day)}
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
                Book Session — Rs. {tutor.price}
              </button>

              <p style={{ fontSize: "0.72rem", color: "var(--color-text-light)", textAlign: "center", marginTop: "0.65rem" }}>
                Free cancellation up to 24 hours before
              </p>
            </div>

            {/* Message card */}
            <div className="card" style={{ padding: "1.25rem" }}>
              <button
                className="btn-outline"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => router.push("/dashboard/messages")}
              >
                <MessageCircle size={16} /> Send a Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Payment Modal ── */}
      {showPayment && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "460px", boxShadow: "0 30px 60px rgba(0,0,0,0.3)", overflow: "hidden" }}>

            {/* Modal Header */}
            <div style={{ background: "linear-gradient(135deg, #0B4085, #1e3a8a)", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", margin: "0 0 0.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Secure Checkout</p>
                <h2 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>Book with {tutor.name}</h2>
              </div>
              {payStep !== "processing" && (
                <button onClick={() => setShowPayment(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "8px", padding: "0.4rem", cursor: "pointer", display: "flex" }}>
                  <X size={18} color="#fff" />
                </button>
              )}
            </div>

            {/* Order summary strip */}
            {payStep !== "success" && (
              <div style={{ background: "#f8fafc", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>Session</p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem", color: "#1e293b" }}>{selectedDay} · {selectedTime}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>Total</p>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: "1.1rem", color: "#0B4085" }}>Rs. {tutor.price}</p>
                </div>
              </div>
            )}

            <div style={{ padding: "1.75rem 2rem" }}>
              {payStep === "form" && (
                <form onSubmit={handlePay} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "8px", padding: "0.6rem 1rem", marginBottom: "0.25rem" }}>
                    <Lock size={14} color="#0284c7" />
                    <span style={{ fontSize: "0.78rem", color: "#0369a1", fontWeight: 600 }}>256-bit SSL encrypted · Powered by Stripe</span>
                  </div>

                  {/* Name on card */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>Name on Card</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Ram Bahadur"
                      value={card.name}
                      onChange={e => setCard({ ...card, name: e.target.value })}
                      style={{ width: "100%", padding: "0.7rem 1rem", borderRadius: "9px", border: "1.5px solid #e2e8f0", fontSize: "0.9rem", outline: "none" }}
                      onFocus={e => e.target.style.borderColor = "#0B4085"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>

                  {/* Card number */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>Card Number</label>
                    <div style={{ position: "relative" }}>
                      <CreditCard size={16} color="#94a3b8" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        required
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={card.number}
                        onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                        maxLength={19}
                        style={{ width: "100%", padding: "0.7rem 1rem 0.7rem 2.5rem", borderRadius: "9px", border: "1.5px solid #e2e8f0", fontSize: "0.9rem", outline: "none", fontFamily: "monospace", letterSpacing: "0.08em" }}
                        onFocus={e => e.target.style.borderColor = "#0B4085"}
                        onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                      />
                    </div>
                  </div>

                  {/* Expiry + CVC */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>Expiry Date</label>
                      <input
                        required
                        type="text"
                        placeholder="MM/YY"
                        value={card.expiry}
                        onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                        maxLength={5}
                        style={{ width: "100%", padding: "0.7rem 1rem", borderRadius: "9px", border: "1.5px solid #e2e8f0", fontSize: "0.9rem", outline: "none" }}
                        onFocus={e => e.target.style.borderColor = "#0B4085"}
                        onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>CVC</label>
                      <input
                        required
                        type="text"
                        placeholder="123"
                        value={card.cvc}
                        onChange={e => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                        maxLength={3}
                        style={{ width: "100%", padding: "0.7rem 1rem", borderRadius: "9px", border: "1.5px solid #e2e8f0", fontSize: "0.9rem", outline: "none" }}
                        onFocus={e => e.target.style.borderColor = "#0B4085"}
                        onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                      />
                    </div>
                  </div>

                  <button type="submit" style={{ background: "linear-gradient(135deg, #0B4085, #1e3a8a)", color: "#fff", border: "none", padding: "0.9rem", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 800, cursor: "pointer", width: "100%", boxShadow: "0 4px 14px rgba(11,64,133,0.25)", marginTop: "0.25rem" }}>
                    Pay Rs. {tutor.price} →
                  </button>
                </form>
              )}

              {payStep === "processing" && (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <div style={{ width: "56px", height: "56px", border: "5px solid #e2e8f0", borderTopColor: "#0B4085", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1.25rem" }} />
                  <p style={{ fontWeight: 700, color: "#1e293b", fontSize: "1rem", margin: "0 0 0.4rem" }}>Processing Payment...</p>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>Please do not close this window.</p>
                </div>
              )}

              {payStep === "success" && (
                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                  <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", boxShadow: "0 0 0 10px rgba(22,163,74,0.1)" }}>
                    <CheckCircle2 size={36} color="#16a34a" />
                  </div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#166534", margin: "0 0 0.5rem" }}>Booking Confirmed!</h3>
                  <p style={{ color: "#475569", fontSize: "0.9rem", margin: "0 0 0.25rem" }}>{tutor.name} · {selectedDay} at {selectedTime}</p>
                  <p style={{ color: "#64748b", fontSize: "0.82rem", margin: "0 0 1.75rem" }}>A confirmation has been sent to your email.</p>
                  <button
                    onClick={() => { setShowPayment(false); router.push("/dashboard/bookings"); }}
                    style={{ background: "#16a34a", color: "#fff", border: "none", padding: "0.85rem 2rem", borderRadius: "10px", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", width: "100%" }}
                  >
                    View My Bookings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .back-link:hover { color: var(--color-primary) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
