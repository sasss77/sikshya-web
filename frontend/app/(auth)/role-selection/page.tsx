"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/lib/context/UserContext";
import { setRoleAction } from "@/lib/actions/auth-action";
import loginImage from "@/app/assets/loginImage.jpg";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [selectedRole, setSelectedRole] = useState<"student" | "tutor" | "admin" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError("Please select a role to continue.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await setRoleAction(selectedRole);

    if (result.success) {
      await refreshUser();
      if (selectedRole === "admin" || result.requiresAdminApproval) {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.containerBox}>
        {/* ── Left Image Panel ── */}
        <div style={styles.leftPanel}>
          <div style={styles.leftContent}>
            <h2 style={styles.leftHeading}>
              Just one more<br />step
            </h2>
            <p style={styles.leftSub}>
              Tell us how you'll be using Sikshya to personalize your experience.
            </p>
          </div>
          <div style={styles.imageOverlay} />
          <Image
            src={loginImage}
            alt="Students learning"
            fill
            style={{ objectFit: "cover" }}
            priority
            sizes="50vw"
          />
        </div>

        {/* ── Right Form Panel ── */}
        <div style={styles.rightPanel}>
          <div style={styles.formWrapper}>
            <h1 style={styles.cardTitle}>Select Your Role</h1>
            <p style={styles.cardSub}>How do you want to use Sikshya?</p>

            {error && (
              <div style={styles.errorAlert}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.roleContainer}>
                {/* Student Option */}
                <div
                  style={{
                    ...styles.roleCard,
                    ...(selectedRole === "student" ? styles.roleCardActive : {}),
                  }}
                  onClick={() => setSelectedRole("student")}
                >
                  <div style={styles.roleIconBox}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={selectedRole === "student" ? "#1B3C72" : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                  </div>
                  <div style={styles.roleTextContainer}>
                    <h3 style={{...styles.roleTitle, color: selectedRole === "student" ? "#1B3C72" : "#334155"}}>I'm a Student</h3>
                    <p style={styles.roleDesc}>I want to find tutors and learn.</p>
                  </div>
                  <div style={{...styles.radioCircle, ...(selectedRole === "student" ? styles.radioCircleActive : {})}}>
                    {selectedRole === "student" && <div style={styles.radioInner} />}
                  </div>
                </div>

                {/* Tutor Option */}
                <div
                  style={{
                    ...styles.roleCard,
                    ...(selectedRole === "tutor" ? styles.roleCardActive : {}),
                  }}
                  onClick={() => setSelectedRole("tutor")}
                >
                  <div style={styles.roleIconBox}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={selectedRole === "tutor" ? "#1B3C72" : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <div style={styles.roleTextContainer}>
                    <h3 style={{...styles.roleTitle, color: selectedRole === "tutor" ? "#1B3C72" : "#334155"}}>I'm a Tutor</h3>
                    <p style={styles.roleDesc}>I want to teach and earn.</p>
                  </div>
                  <div style={{...styles.radioCircle, ...(selectedRole === "tutor" ? styles.radioCircleActive : {})}}>
                    {selectedRole === "tutor" && <div style={styles.radioInner} />}
                  </div>
                </div>

                {/* Admin Option */}
                <div
                  style={{
                    ...styles.roleCard,
                    ...(selectedRole === "admin" ? styles.roleCardActive : {}),
                  }}
                  onClick={() => setSelectedRole("admin")}
                >
                  <div style={styles.roleIconBox}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={selectedRole === "admin" ? "#1B3C72" : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div style={styles.roleTextContainer}>
                    <h3 style={{...styles.roleTitle, color: selectedRole === "admin" ? "#1B3C72" : "#334155"}}>I'm an Admin</h3>
                    <p style={styles.roleDesc}>I want to manage the platform (requires approval).</p>
                  </div>
                  <div style={{...styles.radioCircle, ...(selectedRole === "admin" ? styles.radioCircleActive : {})}}>
                    {selectedRole === "admin" && <div style={styles.radioInner} />}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{ ...styles.submitBtn, ...(isSubmitting || !selectedRole ? styles.submitBtnDisabled : {}) }}
                disabled={isSubmitting || !selectedRole}
              >
                {isSubmitting ? "Saving..." : "Continue to Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#EBF1FA",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    boxSizing: "border-box",
  },
  containerBox: {
    display: "flex",
    width: "100%",
    maxWidth: "1024px",
    height: "100%",
    maxHeight: "640px",
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 12px 40px rgba(27, 60, 114, 0.08)",
    overflow: "hidden",
  },
  leftPanel: {
    position: "relative",
    width: "50%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
    boxSizing: "border-box",
  },
  leftContent: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  leftHeading: {
    color: "#ffffff",
    fontSize: "clamp(24px, 2.5vw, 34px)",
    fontWeight: 800,
    textAlign: "center",
    lineHeight: 1.25,
    fontFamily: "Georgia, 'Times New Roman', serif",
    margin: "0 0 12px 0",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  leftSub: {
    color: "rgba(255,255,255,0.9)",
    fontSize: "15px",
    textAlign: "center",
    fontFamily: "'Segoe UI', sans-serif",
    margin: 0,
    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(27,60,114,0.85) 0%, rgba(27,60,114,0.4) 100%)",
    zIndex: 1,
  },
  rightPanel: {
    width: "50%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "380px",
  },
  cardTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1B3C72",
    textAlign: "left",
    marginBottom: "6px",
    marginTop: 0,
    fontFamily: "Georgia, serif",
  },
  cardSub: {
    fontSize: "14px",
    color: "#666",
    textAlign: "left",
    marginBottom: "28px",
    marginTop: 0,
    fontFamily: "'Segoe UI', sans-serif",
  },
  errorAlert: {
    backgroundColor: "#FDF2F2",
    border: "1px solid #F8B4B4",
    color: "#9B1C1C",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "16px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  roleContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  roleCard: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: "#fff",
  },
  roleCardActive: {
    borderColor: "#1B3C72",
    backgroundColor: "#f8fafc",
  },
  roleIconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    backgroundColor: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "16px",
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    margin: "0 0 4px 0",
    fontSize: "16px",
    fontWeight: 600,
    fontFamily: "'Segoe UI', sans-serif",
  },
  roleDesc: {
    margin: 0,
    fontSize: "13px",
    color: "#64748b",
    fontFamily: "'Segoe UI', sans-serif",
  },
  radioCircle: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "2px solid #cbd5e1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleActive: {
    borderColor: "#1B3C72",
  },
  radioInner: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#1B3C72",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#1B3C72",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
    transition: "opacity 0.2s",
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};
