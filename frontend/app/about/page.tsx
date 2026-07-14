import React from "react";
import Link from "next/link";
import { GraduationCap, Users, Target, Heart, Mail, Github } from "lucide-react";

export const metadata = {
  title: "About Us | Sikshya",
  description: "Learn about Sikshya — Nepal's peer-to-peer tutoring platform connecting students with top tutors.",
};

const TEAM = [
  { name: "Anish Shrestha", role: "Co-Founder & Tech Lead", initials: "AS", color: "#0B4085" },
  { name: "Priya Sharma", role: "Co-Founder & Design Lead", initials: "PS", color: "#0ea5e9" },
  { name: "Sohan Gurung", role: "Community Manager", initials: "SG", color: "#7c3aed" },
];

const VALUES = [
  { icon: Users, color: "#0B4085", bg: "#e8eef7", title: "Community First", desc: "We believe the best learning happens when students teach students — building confidence on both sides." },
  { icon: Target, color: "#22c55e", bg: "#dcfce7", title: "Accessible Education", desc: "Quality tutoring should not be a luxury. We keep pricing fair and transparent for everyone." },
  { icon: Heart, color: "#ef4444", bg: "#fee2e2", title: "Passion for Learning", desc: "From SEE to entrance exams, we are with you every step of the way with tutors who genuinely care." },
  { icon: GraduationCap, color: "#8b5cf6", bg: "#f3e8ff", title: "Verified Excellence", desc: "Every tutor on Sikshya is vetted — so you know you are learning from someone who truly knows their stuff." },
];

export default function AboutPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#1e293b", background: "#fff" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0B4085 0%, #1a56b3 60%, #0ea5e9 100%)", color: "#fff", padding: "6rem 2rem 5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "10%", top: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", right: "5%", bottom: "-80px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "999px", padding: "0.3rem 1rem", fontSize: "0.8rem", fontWeight: 700, marginBottom: "1.5rem", letterSpacing: "0.06em" }}>OUR STORY</span>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 900, margin: "0 0 1.25rem", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Learning is better <br />when we do it together
          </h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.85, margin: "0 auto", maxWidth: "520px", lineHeight: 1.7 }}>
            Sikshya connects ambitious students across Nepal with peer tutors who have recently aced the same exams — creating a cycle of knowledge and community.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "5rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "1.25rem", letterSpacing: "-0.01em" }}>Our Mission</h2>
        <p style={{ fontSize: "1.05rem", color: "#475569", lineHeight: 1.8, margin: 0 }}>
          We started Sikshya with a simple belief: <strong>the best person to help you pass an exam is someone who just passed it</strong>.
          Our platform makes it easy for students to find, book, and learn from verified peer tutors — affordably, flexibly, and effectively.
        </p>
      </div>

      {/* Values */}
      <div style={{ background: "#f8fafc", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, textAlign: "center", marginBottom: "3rem", letterSpacing: "-0.01em" }}>What We Stand For</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {VALUES.map((v) => (
              <div key={v.title} style={{ background: "#fff", borderRadius: "16px", padding: "2rem", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: v.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                  <v.icon size={24} color={v.color} />
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.6rem" }}>{v.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* CTA */}
      <div style={{ background: "linear-gradient(135deg, #0B4085, #1a56b3)", color: "#fff", textAlign: "center", padding: "5rem 2rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 1rem", letterSpacing: "-0.02em" }}>Ready to join Sikshya?</h2>
        <p style={{ opacity: 0.8, marginBottom: "2rem", fontSize: "1rem" }}>Start learning or start teaching — either way, you are helping build a smarter Nepal.</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" style={{ background: "#fff", color: "#0B4085", padding: "0.85rem 2rem", borderRadius: "10px", fontWeight: 800, textDecoration: "none", fontSize: "0.95rem" }}>Get Started Free</Link>
          <Link href="/contact" style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.35)", color: "#fff", padding: "0.85rem 2rem", borderRadius: "10px", fontWeight: 700, textDecoration: "none", fontSize: "0.95rem" }}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
