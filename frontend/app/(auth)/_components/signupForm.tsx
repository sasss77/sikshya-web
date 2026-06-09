"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import signupImage from "@/app/assets/signupImage.jpg";
import { registerAction } from "@/lib/actions/auth-action";
import { SignupInput, signupSchema } from "./schema";

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);    
  const [serverStatus, setServerStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupInput) => {
    setServerStatus(null);
    const result = await registerAction(data);

    if (result.success) {
      setServerStatus({ type: "success", message: result.message || "Account created successfully!" });
      // Redirect after a brief moment so they see the success message, or skip straight to:
      router.push("/login");
    } else {
      setServerStatus({ type: "error", message: result.message });
    }
  };

  const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  return (
    <div style={styles.page}>
      <div style={styles.containerBox}>
        
        {/* ── Left Image Panel ── */}
        <div style={styles.leftPanel}>
          <div style={styles.leftContent}>
            <div style={styles.blobTopRight} />
            <div style={styles.blobBottomLeft} />
            
            <h2 style={styles.leftHeading}>
              Empower your<br />academic journey
            </h2>
            <p style={styles.leftSub}>
              Join our community of learners and educators today.
            </p>
          </div>
          <div style={styles.imageOverlay} />
          <Image
            src={signupImage}
            alt="Students collaborating"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {/* ── Right Form Panel ── */}
        <div style={styles.rightPanel}>
          <div style={styles.formWrapper}>
            <h1 style={styles.cardTitle}>Create your account</h1>
            <p style={styles.cardSub}>Join the Sikshya community today.</p>

            {/* Google Button */}
            <button type="button" style={styles.googleBtn}>
              <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 8, flexShrink: 0 }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>OR USE EMAIL</span>
              <div style={styles.dividerLine} />
            </div>

            {/* Action Feedback Messaging */}
            {serverStatus && (
              <div style={serverStatus.type === "success" ? styles.successAlert : styles.errorAlert}>
                {serverStatus.message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
              {/* Full Name */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Full Name</label>
                <div style={{...styles.inputRow, ...(errors.fullName ? styles.inputErrorRow : {})}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    {...register("fullName")}
                    style={styles.input}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.fullName && <p style={styles.errorText}>{errors.fullName.message}</p>}
              </div>

              {/* Email */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={{...styles.inputRow, ...(errors.email ? styles.inputErrorRow : {})}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    {...register("email")}
                    style={styles.input}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && <p style={styles.errorText}>{errors.email.message}</p>}
              </div>

              {/* Role */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>I am a...</label>
                <div style={{...styles.inputRow, ...(errors.role ? styles.inputErrorRow : {})}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <select
                    {...register("role")}
                    style={{ ...styles.input, cursor: "pointer", paddingRight: "8px" }}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>Select your role</option>
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                  </select>
                </div>
                {errors.role && <p style={styles.errorText}>{errors.role.message}</p>}
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Password</label>
                <div style={{...styles.inputRow, ...(errors.password ? styles.inputErrorRow : {})}}>
                  <LockIcon />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    style={styles.input}
                    disabled={isSubmitting}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && <p style={styles.errorText}>{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={{...styles.inputRow, ...(errors.confirmPassword ? styles.inputErrorRow : {})}}>
                  <LockIcon />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    style={styles.input}
                    disabled={isSubmitting}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.confirmPassword && <p style={styles.errorText}>{errors.confirmPassword.message}</p>}
              </div>

              <button 
                type="submit" 
                style={{...styles.submitBtn, ...(isSubmitting ? styles.submitBtnDisabled : {})}}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p style={styles.bottomText}>
              Already have an account?{" "}
              <Link href="/login" style={styles.linkHighlight}>Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Added error, banner & dynamic styling items seamlessly into your original object ──
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
    maxHeight: "780px", 
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
    overflow: "hidden",
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
  blobTopRight: {
    position: "absolute",
    top: -120,
    right: -120,
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    pointerEvents: "none",
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: -180,
    left: -100,
    width: 160,
    height: 160,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    pointerEvents: "none",
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
    padding: "32px 40px",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    overflowY: "auto",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "360px",
  },
  cardTitle: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#1B3C72",
    textAlign: "left",
    marginBottom: "4px",
    marginTop: 0,
    fontFamily: "Georgia, serif",
  },
  cardSub: {
    fontSize: "14px",
    color: "#666",
    textAlign: "left",
    marginBottom: "16px",
    marginTop: 0,
    fontFamily: "'Segoe UI', sans-serif",
  },
  googleBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "11px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    backgroundColor: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    color: "#334155",
    fontFamily: "'Segoe UI', sans-serif",
    marginBottom: "18px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
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
    gap: "12px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#334155",
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
    transition: "border-color 0.2s",
  },
  inputErrorRow: {
    borderColor: "#EA4335",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    fontSize: "14px",
    padding: "10px 0",
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
    padding: "13px",
    backgroundColor: "#1B3C72",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
    marginTop: "12px",
    transition: "opacity 0.2s",
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  bottomText: {
    textAlign: "center",
    fontSize: "13px",
    color: "#64748b",
    marginTop: "20px",
    marginBottom: 0,
    fontFamily: "'Segoe UI', sans-serif",
  },
  linkHighlight: {
    color: "#1B3C72",
    fontWeight: 700,
    textDecoration: "none",
  },
  errorText: {
    color: "#EA4335",
    fontSize: "12px",
    marginTop: "2px",
    marginLeft: 0,
    marginRight: 0,
    fontFamily: "'Segoe UI', sans-serif",
  },
  errorAlert: {
    backgroundColor: "#FDF2F2",
    border: "1px solid #F8B4B4",
    color: "#9B1C1C",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "12px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  successAlert: {
    backgroundColor: "#EBF5FF",
    border: "1px solid #93C5FD",
    color: "#1E429F",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "12px",
    fontFamily: "'Segoe UI', sans-serif",
  },
};