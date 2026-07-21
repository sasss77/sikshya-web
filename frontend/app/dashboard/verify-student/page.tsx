"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/lib/context/UserContext";
import { ArrowLeft, CheckCircle2, Building, BookOpen, GraduationCap, AlignLeft } from "lucide-react";
import { verifyStudentAction } from "@/lib/actions/student-action";

export default function VerifyStudentPage() {
  const router = useRouter();
  const { user, setUser, loading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    institution: "",
    gradeLevel: "",
    subjects: "",
    bio: "",
  });

  useEffect(() => {
    // If user is already verified or not a student, redirect to profile
    if (!loading && user) {
      if (user.role !== "student" || user.isVerifiedStudent) {
        router.replace("/dashboard/profile");
      }
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError(null);

    const result = await verifyStudentAction({
      institution: formData.institution,
      gradeLevel: formData.gradeLevel,
      subjects: formData.subjects,
      bio: formData.bio,
    });

    if (result.success) {
      // Sync the global user context so isVerifiedStudent becomes true everywhere locally
      setUser((prev: any) => prev ? { ...prev, isVerifiedStudent: true } : null);
      setSuccess(true);
      router.push("/dashboard/profile");
    } else {
      setServerError(result.message || "Verification failed. Please try again.");
    }

    setIsSubmitting(false);
  };

  if (loading || !user) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#64748b" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)", display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: "700px", width: "100%", margin: "3rem auto", padding: "0 1.5rem" }}>
        
        <Link href="/dashboard/profile" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#64748b", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600, marginBottom: "1.5rem" }}>
          <ArrowLeft size={16} /> Back to Profile
        </Link>

        <div style={{ background: "#fff", borderRadius: "16px", padding: "2.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#1e293b", margin: "0 0 0.5rem" }}>Student Verification</h1>
            <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>Complete your profile to unlock tutor booking and personalized recommendations.</p>
          </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Server Error */}
              {serverError && (
                <div style={{ background: "#FDF2F2", border: "1px solid #F8B4B4", color: "#9B1C1C", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.875rem" }}>
                  {serverError}
                </div>
              )}

              {/* Primary Institution */}
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>Primary Institution</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }}><Building size={18} color="#94a3b8" /></div>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Coventry University"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.75rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s" }}
                    onFocus={(e) => e.target.style.borderColor = "#0B4085"}
                    onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
              </div>

              {/* Current Grade Level */}
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>Current Grade / Level</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }}><GraduationCap size={18} color="#94a3b8" /></div>
                  <select
                    required
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.75rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s", background: "#fff", cursor: "pointer", appearance: "none" }}
                    onFocus={(e) => e.target.style.borderColor = "#0B4085"}
                    onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  >
                    <option value="" disabled>Select your grade/level</option>
                    <option value="High School">High School</option>
                    <option value="Undergraduate">Undergraduate / Bachelor's</option>
                    <option value="Postgraduate">Postgraduate / Master's</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Interested Subjects */}
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>Interested Subjects</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }}><BookOpen size={18} color="#94a3b8" /></div>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Physics, Mathematics, Biology"
                    value={formData.subjects}
                    onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.75rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s" }}
                    onFocus={(e) => e.target.style.borderColor = "#0B4085"}
                    onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
                <p style={{ margin: "0.4rem 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>Separate multiple subjects with commas.</p>
              </div>

              {/* Bio */}
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>Short Bio / Goals</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "1rem", top: "1rem" }}><AlignLeft size={18} color="#94a3b8" /></div>
                  <textarea
                    required
                    placeholder="Tell tutors a bit about yourself and what you want to achieve..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    style={{ width: "100%", minHeight: "120px", padding: "0.75rem 1rem 0.75rem 2.75rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s", resize: "vertical", fontFamily: "inherit" }}
                    onFocus={(e) => e.target.style.borderColor = "#0B4085"}
                    onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f1f5f9", marginTop: "0.5rem", paddingTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: "linear-gradient(135deg, #0B4085, #1e3a8a)",
                    color: "#fff", border: "none", padding: "0.85rem 2.5rem", borderRadius: "10px",
                    fontSize: "1rem", fontWeight: 800, cursor: isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 12px rgba(11, 64, 133, 0.2)", opacity: isSubmitting ? 0.7 : 1, transition: "opacity 0.2s"
                  }}
                >
                  {isSubmitting ? "Verifying..." : "Verify & Unlock Booking"}
                </button>
              </div>
            </form>
          </div>
      </div>
    </div>
  );
}
