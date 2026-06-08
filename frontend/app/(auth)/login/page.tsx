"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import loginImage from "@/app/assets/loginImage.jpg";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div style={styles.page}>
      {/* ── Centered Layout Box Container ── */}
      <div style={styles.containerBox}>
        
        {/* ── Left Image Panel ── */}
        <div style={styles.leftPanel}>
          <div style={styles.leftContent}>
            <h2 style={styles.leftHeading}>
              Empower your<br />academic journey
            </h2>
            <p style={styles.leftSub}>
              Join our community of learners and educators today.
            </p>
          </div>
          <div style={styles.imageOverlay} />
          <Image
            src={loginImage}
            alt="Students learning"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {/* ── Right Form Panel ── */}
        <div style={styles.rightPanel}>
          <div style={styles.formWrapper}>
            <h1 style={styles.cardTitle}>Welcome Back</h1>
            <p style={styles.cardSub}>Access your academic portal</p>

            {/* Google Button */}
            <button type="button" style={styles.googleBtn}>
              <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 8, flexShrink: 0 }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Google
            </button>

            {/* Divider */}
            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>OR EMAIL LOGIN</span>
              <div style={styles.dividerLine} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Email */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputRow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <div style={styles.labelRow}>
                  <label style={styles.label}>Password</label>
                  <Link href="/forgot-password" style={styles.forgotLink}>Forgot Password?</Link>
                </div>
                <div style={styles.inputRow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" style={styles.submitBtn}>Log In</button>
            </form>

            <p style={styles.bottomText}>
              New to Sikshya?{" "}
              <Link href="/signup" style={styles.linkHighlight}>Create an account</Link>
            </p>
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
    /* 💡 To swap with an image instead, remove the line above and uncomment these lines:
    backgroundImage: "url('/assets/bg.jpg')", 
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat", */
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    boxSizing: "border-box",
  },

  /* ── Unified Layout Box Container ── */
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

  /* ── Left Side Image Card Panel (Text Centered Perfectly) ── */
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

  /* ── Right Side Clean Form Panel ── */
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
    maxWidth: "360px",
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
    marginBottom: "32px",
    marginTop: 0,
    fontFamily: "'Segoe UI', sans-serif",
  },

  /* ── Interactive Form Components ── */
  googleBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    backgroundColor: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    color: "#334155",
    fontFamily: "'Segoe UI', sans-serif",
    marginBottom: "24px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    fontSize: "11px",
    color: "#94a3b8",
    whiteSpace: "nowrap",
    letterSpacing: "0.05em",
    fontWeight: 600,
    fontFamily: "'Segoe UI', sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#334155",
    fontFamily: "'Segoe UI', sans-serif",
  },
  forgotLink: {
    fontSize: "12px",
    color: "#1B3C72",
    fontWeight: 600,
    textDecoration: "none",
    fontFamily: "'Segoe UI', sans-serif",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    padding: "0 14px",
    backgroundColor: "#fff",
    gap: "10px",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    fontSize: "14px",
    padding: "12px 0",
    color: "#1e293b",
    fontFamily: "'Segoe UI', sans-serif",
    minWidth: 0,
  },
  eyeBtn: {
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
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
    marginTop: "8px",
  },
  bottomText: {
    textAlign: "center",
    fontSize: "13px",
    color: "#64748b",
    marginTop: "28px",
    marginBottom: 0,
    fontFamily: "'Segoe UI', sans-serif",
  },
  linkHighlight: {
    color: "#1B3C72",
    fontWeight: 700,
    textDecoration: "none",
  },
};