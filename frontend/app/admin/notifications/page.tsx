"use client";

import React, { useState } from "react";
import { sendAdminNotificationAction } from "@/lib/actions/admin-actions";
import { Send, AlertCircle, CheckCircle2, Loader2, Users, GraduationCap, Presentation, BellRing } from "lucide-react";

const S: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "32px",
    textAlign: "center",
  },
  titleWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  titleIcon: {
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
    padding: "10px",
    borderRadius: "12px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748b",
    margin: 0,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    border: "1px solid #f1f5f9",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "32px",
  },
  label: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#334155",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    fontSize: "15px",
    color: "#0f172a",
    outline: "none",
    transition: "all 0.2s",
    width: "100%",
    backgroundColor: "#f8fafc",
  },
  textarea: {
    padding: "16px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    fontSize: "15px",
    color: "#0f172a",
    outline: "none",
    transition: "all 0.2s",
    width: "100%",
    minHeight: "180px",
    resize: "vertical",
    backgroundColor: "#f8fafc",
    lineHeight: "1.5",
  },
  audienceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  audienceCard: {
    padding: "20px",
    borderRadius: "12px",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "#e2e8f0",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.2s",
    backgroundColor: "#fff",
    position: "relative",
    overflow: "hidden",
  },
  audienceCardActive: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
  },
  audienceIcon: {
    color: "#94a3b8",
    transition: "color 0.2s",
  },
  audienceIconActive: {
    color: "#3b82f6",
  },
  audienceLabel: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#475569",
    transition: "color 0.2s",
  },
  audienceLabelActive: {
    color: "#1e40af",
  },
  submitBtn: {
    width: "100%",
    padding: "16px 24px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.2s",
    boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)",
  },
  submitBtnDisabled: {
    backgroundColor: "#93c5fd",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  alertSuccess: {
    padding: "16px 20px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "12px",
    color: "#166534",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
    boxShadow: "0 2px 4px rgba(22, 101, 52, 0.05)",
  },
  alertError: {
    padding: "16px 20px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    color: "#b91c1c",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
    boxShadow: "0 2px 4px rgba(185, 28, 28, 0.05)",
  },
};

export default function AdminNotificationsPage() {
  const [audience, setAudience] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setStatus(null);

    const res = await sendAdminNotificationAction({ audience, title, message });
    
    if (res.success) {
      setStatus({ type: "success", message: "Notice broadcasted successfully!" });
      setTitle("");
      setMessage("");
    } else {
      setStatus({ type: "error", message: res.message || "Failed to send notice." });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div style={S.container}>
      <div style={S.header}>
        <div style={S.titleWrapper}>
          <div style={S.titleIcon}>
            <BellRing size={28} />
          </div>
          <h1 style={S.title}>Broadcast Notices</h1>
        </div>
        <p style={S.subtitle}>Instantly send announcements or important alerts to users across the platform.</p>
      </div>

      {status?.type === "success" && (
        <div style={S.alertSuccess}>
          <CheckCircle2 size={22} />
          <span style={{ fontWeight: 500, fontSize: "15px" }}>{status.message}</span>
        </div>
      )}
      {status?.type === "error" && (
        <div style={S.alertError}>
          <AlertCircle size={22} />
          <span style={{ fontWeight: 500, fontSize: "15px" }}>{status.message}</span>
        </div>
      )}

      <div style={S.formCard}>
        <form onSubmit={handleSubmit}>
          
          <div style={S.fieldGroup}>
            <label style={S.label}>Select Target Audience</label>
            <div style={S.audienceGrid}>
              <div 
                style={{ ...S.audienceCard, ...(audience === "all" ? S.audienceCardActive : {}) }}
                onClick={() => setAudience("all")}
              >
                <Users size={28} style={audience === "all" ? S.audienceIconActive : S.audienceIcon} />
                <span style={{ ...S.audienceLabel, ...(audience === "all" ? S.audienceLabelActive : {}) }}>All Users</span>
              </div>
              <div 
                style={{ ...S.audienceCard, ...(audience === "students" ? S.audienceCardActive : {}) }}
                onClick={() => setAudience("students")}
              >
                <GraduationCap size={28} style={audience === "students" ? S.audienceIconActive : S.audienceIcon} />
                <span style={{ ...S.audienceLabel, ...(audience === "students" ? S.audienceLabelActive : {}) }}>Students Only</span>
              </div>
              <div 
                style={{ ...S.audienceCard, ...(audience === "tutors" ? S.audienceCardActive : {}) }}
                onClick={() => setAudience("tutors")}
              >
                <Presentation size={28} style={audience === "tutors" ? S.audienceIconActive : S.audienceIcon} />
                <span style={{ ...S.audienceLabel, ...(audience === "tutors" ? S.audienceLabelActive : {}) }}>Tutors Only</span>
              </div>
            </div>
          </div>

          <div style={S.fieldGroup}>
            <label style={S.label}>Notice Title</label>
            <input 
              style={S.input}
              type="text"
              placeholder="e.g. Scheduled Maintenance Update or System Upgrade"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <div style={S.fieldGroup}>
            <label style={S.label}>Message Details</label>
            <textarea 
              style={S.textarea}
              placeholder="Provide the full content of your notice here. Be clear and concise..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={isSubmitting}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <button 
            type="submit" 
            style={{ ...S.submitBtn, ...(isSubmitting || !title || !message ? S.submitBtnDisabled : {}) }}
            disabled={isSubmitting || !title || !message}
            onMouseOver={(e) => {
              if (!isSubmitting && title && message) e.currentTarget.style.backgroundColor = "#1d4ed8";
            }}
            onMouseOut={(e) => {
              if (!isSubmitting && title && message) e.currentTarget.style.backgroundColor = "#2563eb";
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Broadcasting...
              </>
            ) : (
              <>
                <Send size={20} />
                Broadcast Notice
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
