"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@/lib/context/UserContext";

// ─── Inline styles kept as a single const so there are zero external deps ───
const S: Record<string, React.CSSProperties> = {
  /* ── reset / base ── */
  root: {
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    color: "#1a202c",
    background: "#f7f8fa",
    minHeight: "100vh",
    margin: 0,
  },

  /* ── nav ── */
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    height: 64,
    background: "#fff",
    borderBottom: "1px solid #e8eaf0",
    position: "sticky" as const,
    top: 0,
    zIndex: 100,
  },
  navLogo: {
    fontWeight: 800,
    fontSize: 22,
    color: "#1a3c6e",
    letterSpacing: "-0.5px",
  },
  navLinks: {
    display: "flex",
    gap: 32,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navLink: {
    fontSize: 14,
    fontWeight: 500,
    color: "#4a5568",
    cursor: "pointer",
    textDecoration: "none",
  },
  navLinkActive: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1a3c6e",
    textDecoration: "underline",
    textUnderlineOffset: 4,
    cursor: "pointer",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#e2e8f0",
    border: "2px solid #cbd5e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden",
  },
  profileIcon: {
    width: 22,
    height: 22,
    color: "#718096",
  },

  /* ── hero section ── */
  hero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "72px 80px 64px",
    gap: 48,
    background: "#fff",
  },
  heroLeft: { flex: 1, maxWidth: 520 },
  badge: {
    display: "inline-block",
    background: "#e6f9f0",
    color: "#22863a",
    fontSize: 12,
    fontWeight: 600,
    padding: "4px 14px",
    borderRadius: 20,
    marginBottom: 20,
    letterSpacing: "0.02em",
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 800,
    lineHeight: 1.15,
    color: "#1a202c",
    margin: "0 0 18px",
    letterSpacing: "-0.5px",
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 1.65,
    color: "#4a5568",
    margin: "0 0 36px",
    maxWidth: 440,
  },
  heroButtons: { display: "flex", gap: 16, alignItems: "center" },
  btnPrimary: {
    background: "#1a3c6e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "14px 28px",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    letterSpacing: "0.01em",
  },
  btnOutline: {
    background: "transparent",
    color: "#1a3c6e",
    border: "2px solid #1a3c6e",
    borderRadius: 8,
    padding: "12px 28px",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
  },
  heroMeta: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginTop: 32,
  },
  avatarGroup: { display: "flex" },
  avatarBubble: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#cbd5e0",
    border: "2px solid #fff",
    marginLeft: -10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    color: "#4a5568",
    overflow: "hidden",
  },
  heroMetaText: { fontSize: 14, fontWeight: 600, color: "#2d3748" },

  /* ── hero image placeholder ── */
  heroRight: { flex: 1, maxWidth: 480, display: "flex", justifyContent: "flex-end" },
  heroImageWrap: {
    width: "100%",
    maxWidth: 460,
    aspectRatio: "4/3",
    background: "#e2e8f0",
    borderRadius: 20,
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    boxShadow: "0 8px 40px rgba(26,60,110,0.10)",
  },
  heroImagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    background: "#dde3ed",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    color: "#a0aec0",
  },
  ratingBadge: {
    position: "absolute" as const,
    bottom: -20,
    right: -16,
    background: "#fff",
    borderRadius: 14,
    padding: "12px 18px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
    minWidth: 150,
  },
  ratingIcon: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#e6f9f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ratingNum: { fontSize: 16, fontWeight: 800, color: "#1a202c", lineHeight: 1 },
  ratingLabel: { fontSize: 11, color: "#718096", marginTop: 2 },

  /* ── how it works ── */
  howSection: {
    background: "#f7f8fa",
    padding: "80px 80px",
    textAlign: "center" as const,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 800,
    color: "#1a202c",
    marginBottom: 10,
  },
  sectionSub: {
    fontSize: 15,
    color: "#4a5568",
    maxWidth: 520,
    margin: "0 auto 48px",
    lineHeight: 1.65,
  },
  cardsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 24,
    maxWidth: 1000,
    margin: "0 auto",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 32,
    textAlign: "left" as const,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    border: "1px solid #e8eaf0",
  },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  cardTitle: { fontSize: 18, fontWeight: 700, marginBottom: 10, color: "#1a202c" },
  cardText: { fontSize: 14, color: "#4a5568", lineHeight: 1.65, margin: 0 },
};

/* ─── SVG Icons (inline, no dependency) ─── */
const IconSearch = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconCalendar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconGradCap = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
  </svg>
);
const IconStar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#22863a" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconImage = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
  </svg>
);

/* ─── Avatar placeholders for "500+ Students" ─── */
const AVATAR_INITIALS = ["A", "B", "C"];

export default function DashboardPage() {
  const { user } = useUser();
  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
  const imageUrl = user?.profileImage ? `${backendUrl}${user.profileImage}` : null;
  return (
    <div style={S.root}>

      {/* ── Navigation ── */}
      <nav style={S.nav}>
        <span style={S.navLogo}>Sikshya</span>

        <ul style={S.navLinks}>
          <li><Link style={S.navLinkActive} href="/dashboard">Home</Link></li>
          <li><a style={S.navLink} href="#">Find Tutors</a></li>
          <li><a style={S.navLink} href="#">How it Works</a></li>
        </ul>

        <div style={S.navRight}>
          {/* Profile icon placeholder – replaces Login / Sign Up */}
          <Link href="/dashboard/profile" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ ...S.profileAvatar, overflow: "hidden" }} title="Profile">
              {imageUrl ? (
                <img src={imageUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              ) : (
                <IconUser />
              )}
            </div>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={S.hero}>
        <div style={S.heroLeft}>
          <span style={S.badge}>Empowering Nepali Students</span>
          <h1 style={S.heroTitle}>
            Master Any Subject with<br />Peer-to-Peer Tutoring
          </h1>
          <p style={S.heroSubtitle}>
            Experience collaborative excellence. Connect with high-achieving peers who understand your
            curriculum and can guide you toward academic mastery with personalized sessions.
          </p>
          <div style={S.heroButtons}>
            <button style={S.btnPrimary}>Find Your Tutor</button>
            <button style={S.btnOutline}>How it Works</button>
          </div>
          <div style={S.heroMeta}>
            <div style={S.avatarGroup}>
              {AVATAR_INITIALS.map((init, i) => (
                <div
                  key={i}
                  style={{
                    ...S.avatarBubble,
                    marginLeft: i === 0 ? 0 : -10,
                    background: ["#c3dafe", "#fde68a", "#fed7e2"][i],
                  }}
                >
                  {init}
                </div>
              ))}
            </div>
            <span style={S.heroMetaText}>500+ Students already learning</span>
          </div>
        </div>

        <div style={S.heroRight}>
          <div style={S.heroImageWrap}>
            {/* Image placeholder */}
            <div style={S.heroImagePlaceholder}>
              <IconImage />
              <span style={{ fontSize: 13, color: "#a0aec0" }}>Tutoring session image</span>
            </div>

            {/* Floating rating badge */}
            <div style={S.ratingBadge}>
              <div style={S.ratingIcon}><IconStar /></div>
              <div>
                <div style={S.ratingNum}>4.9/5</div>
                <div style={S.ratingLabel}>Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section style={S.howSection}>
        <h2 style={S.sectionTitle}>How it Works</h2>
        <p style={S.sectionSub}>
          Start your learning journey in three simple steps designed for efficiency and academic growth.
        </p>

        <div style={S.cardsRow}>
          {/* Card 1 */}
          <div style={S.card}>
            <div style={{ ...S.cardIconWrap, background: "#1a3c6e" }}>
              <IconSearch />
            </div>
            <h3 style={S.cardTitle}>Find Your Match</h3>
            <p style={S.cardText}>
              Browse through our verified network of tutors specializing in SLC, SEE, and +2 curricula
              across Nepal.
            </p>
          </div>

          {/* Card 2 */}
          <div style={S.card}>
            <div style={{ ...S.cardIconWrap, background: "#22543d" }}>
              <IconCalendar />
            </div>
            <h3 style={S.cardTitle}>Book a Session</h3>
            <p style={S.cardText}>
              Select a time that fits your schedule. Our platform handles payments securely and reminds
              you of upcoming classes.
            </p>
          </div>

          {/* Card 3 */}
          <div style={S.card}>
            <div style={{ ...S.cardIconWrap, background: "#2d3748" }}>
              <IconGradCap />
            </div>
            <h3 style={S.cardTitle}>Start Learning</h3>
            <p style={S.cardText}>
              Join the virtual classroom and start mastering your subjects with a peer who&apos;s been in
              your shoes.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}