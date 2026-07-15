"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Star,
  ChevronDown,
  X,
  SlidersHorizontal,
  BookOpen,
  MapPin,
} from "lucide-react";

/* ─── Mock tutor data (replace with API call) ─────────────────── */
const ALL_TUTORS = [
  {
    id: 1, name: "Anish Shrestha", subjects: ["Physics", "Mathematics"], level: "+2 Science", rating: 5.0, reviews: 42, tags: ["SLC Topper", "IOE Scholar"], price: 800, initials: "AS", avatarColor: "#0B4085", location: "Kathmandu",
    bio: "IOE entrance ranker tutoring Physics and Mathematics for +2 and entrance prep.",
    courses: [
      { id: "c1", title: "Complete Mechanics for +2", modules: ["Kinematics", "Dynamics", "Work, Energy & Power", "Rotational Motion"] },
      { id: "c2", title: "IOE Math Entrance Prep", modules: ["Calculus", "Algebra", "Co-ordinate Geometry", "Trigonometry"] }
    ]
  },
  {
    id: 2, name: "Priya Sharma", subjects: ["Biology", "Chemistry"], level: "+2 Science", rating: 4.9, reviews: 38, tags: ["Medical Student", "IOM Ranker"], price: 750, initials: "PS", avatarColor: "#0ea5e9", location: "Lalitpur",
    bio: "IOM ranker helping students ace Biology and Chemistry for medical entrance.",
    courses: [
      { id: "c3", title: "Botany & Zoology Crash Course", modules: ["Cell Biology", "Genetics", "Human Physiology", "Ecology"] },
      { id: "c4", title: "Organic Chemistry Fundamentals", modules: ["Alkanes & Alkenes", "Alcohols", "Aldehydes & Ketones"] }
    ]
  },
  {
    id: 3, name: "Sohan Gurung", subjects: ["Economics", "Accounting"], level: "+2 Management", rating: 4.8, reviews: 29, tags: ["CA Aspirant", "Business Pro"], price: 600, initials: "SG", avatarColor: "#7c3aed", location: "Bhaktapur",
    bio: "CA aspirant teaching Economics and Accounts with focus on board exam strategies.",
    courses: [
      { id: "c5", title: "Class 12 Economics Core", modules: ["Microeconomics", "Macroeconomics", "Nepalese Economy"] },
      { id: "c6", title: "Accounting for Beginners", modules: ["Journal Entries", "Ledger", "Final Accounts"] }
    ]
  },
  { 
    id: 4, name: "Sita Rai", subjects: ["English", "Nepali"], level: "SEE", rating: 4.7, reviews: 56, tags: ["Literature Graduate", "SEE Expert"], price: 500, initials: "SR", avatarColor: "#ec4899", location: "Kathmandu", 
    bio: "Literature graduate helping SEE students improve writing and grammar skills.", 
    courses: [{ id: "c7", title: "SEE English Prep", modules: ["Grammar Rules", "Essay Writing", "Reading Comprehension"] }]
  },
  { 
    id: 5, name: "Bikash Tamang", subjects: ["Computer Science", "Mathematics"], level: "+2 Science", rating: 4.9, reviews: 33, tags: ["Software Engineer", "TU Ranker"], price: 900, initials: "BT", avatarColor: "#10b981", location: "Kathmandu", 
    bio: "Software engineer teaching CS fundamentals and Mathematics for entrance.", 
    courses: [{ id: "c8", title: "CS Basics (C Programming)", modules: ["Variables & Loops", "Functions", "Arrays & Pointers", "File Handling"] }]
  },
  { 
    id: 6, name: "Maya Adhikari", subjects: ["Physics", "Chemistry"], level: "+2 Science", rating: 4.6, reviews: 21, tags: ["IOE Student"], price: 700, initials: "MA", avatarColor: "#f59e0b", location: "Pokhara", 
    bio: "IOE student with strong Physics and Chemistry background ready to tutor.", 
    courses: [{ id: "c9", title: "Physics Crash Course", modules: ["Optics", "Modern Physics", "Electricity & Magnetism"] }]
  },
  { 
    id: 7, name: "Roshan KC", subjects: ["Mathematics", "Statistics"], level: "+2 Management", rating: 4.8, reviews: 44, tags: ["MBS Student", "TU Ranker"], price: 650, initials: "RK", avatarColor: "#ef4444", location: "Lalitpur", 
    bio: "MBS student specializing in Statistics and Business Mathematics.", 
    courses: [{ id: "c10", title: "Business Math & Stats", modules: ["Probability", "Linear Programming", "Matrices"] }]
  },
  { 
    id: 8, name: "Anjali Poudel", subjects: ["Biology", "English"], level: "SEE", rating: 4.7, reviews: 18, tags: ["Nursing Graduate"], price: 450, initials: "AP", avatarColor: "#6366f1", location: "Bhaktapur", 
    bio: "Nursing graduate helping SEE students with Science and English fundamentals.", 
    courses: [{ id: "c11", title: "SEE Science Mastery", modules: ["Human Body", "Environment", "Force & Motion"] }]
  },
];

const SUBJECTS = [
  "All Subjects",
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics",
  "Economics",
  "Accounting",
  "English",
  "Nepali",
  "Computer Science",
  "Statistics",
];

const LEVELS = ["All Levels", "SEE", "+2 Science", "+2 Management"];
const LOCATIONS = ["All Locations", "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara"];
const SORT_OPTIONS = [
  { value: "rating", label: "Top Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "reviews", label: "Most Reviewed" },
];

/* ─── Tutor Card ──────────────────────────────────────────────── */
function TutorCard({ tutor }: { tutor: (typeof ALL_TUTORS)[0] }) {
  return (
    <div className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Top colored band */}
      <div
        style={{
          height: "8px",
          background: `linear-gradient(90deg, ${tutor.avatarColor}, ${tutor.avatarColor}88)`,
        }}
      />

      <div style={{ padding: "1.25rem" }}>
        {/* Header row */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "0.85rem" }}>
          {/* Avatar */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: tutor.avatarColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
              boxShadow: `0 4px 12px ${tutor.avatarColor}44`,
            }}
          >
            {tutor.initials}
          </div>

          {/* Name + location */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.15rem" }}>
                {tutor.name}
              </h3>
              <span
                style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  padding: "0.15rem 0.5rem",
                  borderRadius: "var(--radius-full)",
                  whiteSpace: "nowrap",
                }}
              >
                ✓ Verified
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.2rem", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                <MapPin size={11} />
                {tutor.location}
              </span>
              <span style={{ color: "var(--color-border)", fontSize: "0.7rem" }}>·</span>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{tutor.level}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.55, marginBottom: "0.85rem" }}>
          {tutor.bio}
        </p>

        {/* Subjects */}
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
          {tutor.subjects.map((s) => (
            <span
              key={s}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.72rem",
                fontWeight: 600,
                padding: "0.2rem 0.55rem",
                borderRadius: "var(--radius-full)",
                background: "var(--color-primary-light)",
                color: "var(--color-primary)",
              }}
            >
              <BookOpen size={10} />
              {s}
            </span>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {tutor.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "0.68rem",
                fontWeight: 600,
                padding: "0.18rem 0.55rem",
                borderRadius: "var(--radius-full)",
                background: "var(--color-bg-secondary)",
                color: "var(--color-text-muted)",
                border: "1px solid var(--color-border)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--color-border)", paddingTop: "0.85rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.1rem" }}>
              <Star size={13} fill="#f59e0b" stroke="none" />
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-text)" }}>
                {tutor.rating.toFixed(1)}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>
                ({tutor.reviews} reviews)
              </span>
            </div>
            <div>
              <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--color-text)" }}>Rs. {tutor.price}</span>
              <span style={{ fontSize: "0.7rem", color: "var(--color-text-light)", marginLeft: "2px" }}>/hr</span>
            </div>
          </div>
          <Link href={`/tutors/${tutor.id}`} className="btn-primary" style={{ padding: "0.5rem 1.1rem", fontSize: "0.8rem" }}>
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function FindTutorsPage() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All Subjects");
  const [level, setLevel] = useState("All Levels");
  const [location, setLocation] = useState("All Locations");
  const [sortBy, setSortBy] = useState("rating");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = ALL_TUTORS.filter((t) => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
        t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchSubject = subject === "All Subjects" || t.subjects.includes(subject);
      const matchLevel = level === "All Levels" || t.level === level;
      const matchLocation = location === "All Locations" || t.location === location;
      const matchPrice = t.price <= maxPrice;
      return matchSearch && matchSubject && matchLevel && matchLocation && matchPrice;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      return 0;
    });

    return result;
  }, [search, subject, level, location, sortBy, maxPrice]);

  const clearFilters = () => {
    setSearch("");
    setSubject("All Subjects");
    setLevel("All Levels");
    setLocation("All Locations");
    setMaxPrice(1000);
    setSortBy("rating");
  };

  const hasActiveFilters =
    search || subject !== "All Subjects" || level !== "All Levels" ||
    location !== "All Locations" || maxPrice < 1000;

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* ── Hero bar ── */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--color-primary) 0%, #1a56b3 100%)",
          padding: "3rem 0 2rem",
        }}
      >
        <div className="container">
          <h1
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Find Your Perfect Tutor
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
            Browse {ALL_TUTORS.length} verified peer tutors across Nepal
          </p>

          {/* Search bar */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              maxWidth: "640px",
            }}
          >
            <div style={{ position: "relative", flex: 1 }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search by name, subject, or keyword…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem 0.8rem 2.75rem",
                  borderRadius: "var(--radius-sm)",
                  border: "2px solid transparent",
                  fontSize: "0.9rem",
                  background: "#fff",
                  color: "var(--color-text)",
                  outline: "none",
                  transition: "border-color 0.18s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                onBlur={(e) => (e.target.style.borderColor = "transparent")}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: showFilters ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.4)",
                color: "#fff",
                padding: "0.8rem 1.25rem",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 600,
                transition: "background 0.18s",
              }}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.5rem" }}>
        {/* ── Filter panel ── */}
        {showFilters && (
          <div
            className="card"
            style={{
              padding: "1.5rem",
              marginBottom: "1.5rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              alignItems: "end",
            }}
          >
            {/* Subject */}
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", display: "block", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Subject
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 2rem 0.65rem 0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", fontSize: "0.875rem", background: "#fff", appearance: "none", cursor: "pointer", color: "var(--color-text)" }}
                >
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-text-muted)" }} />
              </div>
            </div>

            {/* Level */}
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", display: "block", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Level
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 2rem 0.65rem 0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", fontSize: "0.875rem", background: "#fff", appearance: "none", cursor: "pointer", color: "var(--color-text)" }}
                >
                  {LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-text-muted)" }} />
              </div>
            </div>

            {/* Location */}
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", display: "block", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Location
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 2rem 0.65rem 0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", fontSize: "0.875rem", background: "#fff", appearance: "none", cursor: "pointer", color: "var(--color-text)" }}
                >
                  {LOCATIONS.map((loc) => <option key={loc}>{loc}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-text-muted)" }} />
              </div>
            </div>

            {/* Max price */}
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", display: "block", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Max Price: <span style={{ color: "var(--color-primary)" }}>Rs. {maxPrice}</span>/hr
              </label>
              <input
                type="range"
                min={400}
                max={1000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--color-primary)" }}
              />
            </div>

            {/* Sort */}
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", display: "block", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Sort By
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 2rem 0.65rem 0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", fontSize: "0.875rem", background: "#fff", appearance: "none", cursor: "pointer", color: "var(--color-text)" }}
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-text-muted)" }} />
              </div>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "none", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "0.65rem 1rem", fontSize: "0.8rem", color: "var(--color-text-muted)", cursor: "pointer", transition: "all 0.15s" }}
              >
                <X size={14} /> Clear Filters
              </button>
            )}
          </div>
        )}

        {/* ── Results bar ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            Showing <strong style={{ color: "var(--color-text)" }}>{filtered.length}</strong> tutor{filtered.length !== 1 ? "s" : ""}
            {hasActiveFilters && <span> — <button onClick={clearFilters} style={{ background: "none", border: "none", color: "var(--color-primary)", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>Clear filters</button></span>}
          </p>

          {/* Sort (mobile fallback when filters are hidden) */}
          {!showFilters && (
            <div style={{ position: "relative" }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: "0.5rem 2rem 0.5rem 0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", fontSize: "0.8rem", background: "#fff", appearance: "none", cursor: "pointer", color: "var(--color-text)" }}
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={12} style={{ position: "absolute", right: "0.6rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-text-muted)" }} />
            </div>
          )}
        </div>

        {/* ── Tutor grid ── */}
        {filtered.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {filtered.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
            <Search size={40} style={{ color: "var(--color-text-light)", margin: "0 auto 1rem" }} />
            <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>No tutors found</h3>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "1.25rem" }}>Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="btn-outline">
              <X size={16} /> Clear all filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 4px;
          background: var(--color-border);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
