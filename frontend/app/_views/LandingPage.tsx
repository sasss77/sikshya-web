import React from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  BookOpen,
  Star,
  ArrowRight,
  Users,
  CheckCircle,
} from "lucide-react";

/* ─── Static data ─────────────────────────────────────────────── */
const HOW_IT_WORKS = [
  {
    id: "find",
    icon: Search,
    title: "Find Your Match",
    desc: "Browse through our verified network of tutors specialising in SLC, SEE, and +2 curricula across Nepal.",
    color: "var(--color-primary)",
    bg: "var(--color-primary-light)",
  },
  {
    id: "book",
    icon: Calendar,
    title: "Book a Session",
    desc: "Select a time that fits your schedule. Our platform handles payments securely and reminds you of upcoming classes.",
    color: "#0ea5e9",
    bg: "#e0f2fe",
  },
  {
    id: "learn",
    icon: BookOpen,
    title: "Start Learning",
    desc: "Join the virtual classroom and start mastering your subjects with a peer who's been in your shoes.",
    color: "#8b5cf6",
    bg: "#ede9fe",
  },
];

const FEATURED_TUTORS = [
  {
    id: 1,
    name: "Anish Shrestha",
    subjects: "Engineering Physics · Mathematics",
    rating: 5.0,
    tags: ["SLC Topper", "IOE Scholar"],
    price: "Rs. 800",
    initials: "AS",
    avatarColor: "#0B4085",
  },
  {
    id: 2,
    name: "Priya Sharma",
    subjects: "Biology · Chemistry",
    rating: 4.9,
    tags: ["Medical Student", "IOM Ranker"],
    price: "Rs. 750",
    initials: "PS",
    avatarColor: "#0ea5e9",
  },
  {
    id: 3,
    name: "Sohan Gurung",
    subjects: "Economics · Accounting",
    rating: 4.8,
    tags: ["CA Aspirant", "Business Pro"],
    price: "Rs. 600",
    initials: "SG",
    avatarColor: "#7c3aed",
  },
];

/* ─── Helpers ─────────────────────────────────────────────────── */
const getAvatarColor = (name: string) => {
  const colors = ["#0B4085", "#0ea5e9", "#7c3aed", "#ec4899", "#f59e0b", "#22c55e"];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

/* ─── Sub-components ──────────────────────────────────────────── */
function TutorCard({
  tutor,
}: {
  tutor: any;
}) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const tutorName = tutor.name || tutor.userId?.fullName || "Tutor";
  const initials = tutorName.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2);
  const avatarColor = getAvatarColor(tutorName);
  const profileImage = tutor.profileImage;
  const rating = tutor.averageRating || 0;
  const reviewCount = tutor.reviewCount || 0;
  const price = tutor.hourlyRate ? `Rs. ${tutor.hourlyRate}` : "Free";
  const tutorId = tutor.userId?._id || tutor.userId || tutor.id;

  return (
    <div className="card tutor-card" style={{ overflow: "hidden" }}>
      {/* Avatar area */}
      <div
        style={{
          height: "180px",
          background: `linear-gradient(135deg, ${avatarColor}22, ${avatarColor}44)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Verified badge */}
        <span
          className="badge badge-verified"
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
          }}
        >
          ✓ Verified
        </span>

        {/* Avatar circle — real image or initials fallback */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: avatarColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#fff",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.8)",
          }}
        >
          {profileImage ? (
            <img
              src={`${backendUrl}${profileImage}`}
              alt={tutorName}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            initials
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1.1rem 1.25rem 1.25rem" }}>
        {/* Name + rating */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "0.25rem",
          }}
        >
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "var(--color-text)",
            }}
          >
            {tutorName}
          </h3>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.2rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: rating > 0 ? "#f59e0b" : "#94a3b8",
            }}
          >
            <Star size={13} fill={rating > 0 ? "#f59e0b" : "none"} stroke={rating > 0 ? "#f59e0b" : "#94a3b8"} />
            {rating > 0 ? rating.toFixed(1) : "New"}
          </span>
        </div>

        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--color-text-muted)",
            marginBottom: "0.5rem",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
          }}
        >
          {tutor.subjects?.join(" · ") || "General"}
        </p>
        {reviewCount > 0 && (
          <p style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Star size={11} fill="#f59e0b" stroke="none" />
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
          </p>
        )}

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
            minHeight: "22px"
          }}
        >
          {(tutor.tags && tutor.tags.length > 0 ? tutor.tags.slice(0,2) : [tutor.educationLevel || "Expert"]).map((tag: string) => (
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

        {/* Price + CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--color-text)",
              }}
            >
              {price}
            </span>
            <span
              style={{
                fontSize: "0.72rem",
                color: "var(--color-text-light)",
                marginLeft: "2px",
              }}
            >
              /hr
            </span>
          </div>
          <Link href={tutorId ? `/tutors/${tutorId}` : "/find-tutors"} className="btn-primary" style={{ padding: "0.45rem 1rem", fontSize: "0.78rem" }}>
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────── */
import { useUser } from "@/lib/context/UserContext";
import { fetchTutorsAction } from "@/lib/actions/tutor-action";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { user } = useUser();
  const [featuredTutors, setFeaturedTutors] = useState<any[]>([]);
  const [loadingTutors, setLoadingTutors] = useState(true);

  useEffect(() => {
    async function loadTutors() {
      const res = await fetchTutorsAction({ limit: 3 });
      if (res.success && res.data) {
        setFeaturedTutors(res.data.slice(0, 3));
      }
      setLoadingTutors(false);
    }
    loadTutors();
  }, []);
  
  return (
    <main>
      {/* ════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--color-bg)",
          padding: "5rem 0 4rem",
          overflow: "hidden",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          {/* Left: Copy */}
          <div>
            {/* Badge */}
            <span className="badge badge-green" style={{ marginBottom: "1.25rem" }}>
              <CheckCircle size={12} />
              Empowering Nepali Students
            </span>

            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                fontWeight: 900,
                lineHeight: 1.15,
                color: "var(--color-text)",
                marginBottom: "1.1rem",
                letterSpacing: "-0.02em",
              }}
            >
              Master Any Subject with
              <br />
              <span style={{ color: "var(--color-primary)" }}>
                Peer-to-Peer Tutoring
              </span>
            </h1>

            <p
              style={{
                fontSize: "1rem",
                color: "var(--color-text-muted)",
                lineHeight: 1.7,
                marginBottom: "2rem",
                maxWidth: "440px",
              }}
            >
              Experience collaborative excellence. Connect with high-achieving
              peers who understand your curriculum and can guide you toward
              academic mastery with personalized sessions.
            </p>

            {/* CTA Buttons */}
            <div
              style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}
            >
              {user ? (
                <>
                  {user.role === "student" ? (
                    <>
                      <Link href="/find-tutors" className="btn-primary">
                        Browse Tutors
                      </Link>
                      <Link href="/dashboard" className="btn-outline">
                        Go to Dashboard
                      </Link>
                    </>
                  ) : (
                    <Link href="/dashboard" className="btn-primary">
                      Go to Dashboard
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link href="/signup" className="btn-primary">
                    Start Learning Today
                  </Link>
                  <Link href="#how-it-works" className="btn-outline">
                    How it Works
                  </Link>
                </>
              )}
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* Avatar stack */}
              <div style={{ display: "flex" }}>
                {["#0B4085", "#0ea5e9", "#7c3aed"].map((color, i) => (
                  <div
                    key={i}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: color,
                      border: "2px solid #fff",
                      marginLeft: i === 0 ? 0 : "-10px",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {["A", "P", "S"][i]}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", fontWeight: 500 }}>
                <strong style={{ color: "var(--color-text)" }}>500+</strong> Students already learning
              </p>
            </div>
          </div>

          {/* Right: Visual card */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                background: "linear-gradient(135deg, var(--color-primary-light) 0%, #dbeafe 100%)",
                borderRadius: "var(--radius-xl)",
                padding: "2.5rem",
                minHeight: "320px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative circles */}
              <div
                style={{
                  position: "absolute",
                  top: "-30px",
                  right: "-30px",
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  background: "rgba(11,64,133,0.08)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  left: "-20px",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "rgba(11,64,133,0.06)",
                }}
              />

              {/* Icon grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                {[
                  { icon: BookOpen, label: "Interactive Sessions", color: "var(--color-primary)" },
                  { icon: Users, label: "Peer Learning", color: "#0ea5e9" },
                  { icon: Star, label: "Top Tutors", color: "#f59e0b" },
                  { icon: CheckCircle, label: "Verified Students", color: "#22c55e" },
                ].map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    style={{
                      background: "#fff",
                      borderRadius: "var(--radius-md)",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "var(--color-text-muted)",
                      textAlign: "center",
                    }}
                  >
                    <Icon size={22} color={color} />
                    {label}
                  </div>
                ))}
              </div>

              {/* Rating pill */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "var(--radius-full)",
                  padding: "0.6rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
              >
                <Star size={16} fill="#f59e0b" stroke="none" />
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, lineHeight: 1.1 }}>4.9/5</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--color-text-muted)" }}>Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        style={{
          background: "var(--color-bg-secondary)",
          padding: "5rem 0",
        }}
      >
        <div className="container">
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 800,
                marginBottom: "0.75rem",
                letterSpacing: "-0.02em",
              }}
            >
              How it Works
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--color-text-muted)",
                maxWidth: "500px",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Start your learning journey in three simple steps designed for
              efficiency and academic growth.
            </p>
          </div>

          {/* Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
            className="hiw-grid"
          >
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="card"
                  style={{ padding: "2rem 1.75rem" }}
                >
                  {/* Step number */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "var(--radius-md)",
                      background: step.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <Icon size={22} color={step.color} />
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: step.color,
                      marginBottom: "0.4rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Step {i + 1}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      marginBottom: "0.6rem",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-text-muted)",
                      lineHeight: 1.65,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURED TUTORS
      ════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--color-bg)",
          padding: "5rem 0",
        }}
      >
        <div className="container">
          {/* Heading + View All */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2.5rem",
            }}
            className="tutors-header"
          >
            <div>
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  fontWeight: 800,
                  marginBottom: "0.5rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Featured Tutors
              </h2>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--color-text-muted)",
                  maxWidth: "400px",
                  lineHeight: 1.6,
                }}
              >
                Learn from the best. Our top-rated tutors are high achievers
                from prestigious institutions.
              </p>
            </div>
            <Link
              href="/find-tutors"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--color-primary)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
              className="view-all-link"
            >
              View All Tutors <ArrowRight size={15} />
            </Link>
          </div>

          {/* Tutor grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
            className="tutors-grid"
          >
            {loadingTutors ? (
              <p style={{ color: "#64748b", textAlign: "center", gridColumn: "1 / -1" }}>Loading amazing tutors...</p>
            ) : featuredTutors.length > 0 ? (
              featuredTutors.map((tutor) => (
                <TutorCard key={tutor.id || tutor._id} tutor={tutor} />
              ))
            ) : (
              <p style={{ color: "#64748b", textAlign: "center", gridColumn: "1 / -1", padding: "2rem", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                Tutors are currently signing up. Check back soon for featured tutors!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════════ */}
      {!user && (
        <section
          style={{
            background: "linear-gradient(135deg, var(--color-primary) 0%, #1a56b3 50%, #0B4085 100%)",
            padding: "5rem 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background decoration */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              left: "-40px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
              pointerEvents: "none",
            }}
          />

          <div className="container" style={{ textAlign: "center", position: "relative" }}>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight: 900,
                color: "#fff",
                marginBottom: "1rem",
                letterSpacing: "-0.02em",
              }}
            >
              Ready to Elevate Your Academic Journey?
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(255,255,255,0.8)",
                maxWidth: "520px",
                margin: "0 auto 2.25rem",
                lineHeight: 1.7,
              }}
            >
              Join the Sikshya community today and find the perfect mentor to
              help you reach your academic goals.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/signup" className="btn-white">
                Get Started for Free
              </Link>
              <Link href="/signup?role=tutor" className="btn-outline-white">
                Become a Tutor
              </Link>
            </div>
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 900px) {
          .hiw-grid,
          .tutors-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          section > .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
          .tutors-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }
        }
        .tutor-card:hover {
          transform: translateY(-4px);
        }
        .view-all-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </main>
  );
}
