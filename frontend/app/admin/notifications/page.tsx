"use client";

import React, { useState } from "react";
import { sendAdminNotificationAction } from "@/lib/actions/admin-actions";
import { Send, AlertCircle, CheckCircle2, Loader2, Users, GraduationCap, Presentation } from "lucide-react";

const S: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "800px",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    margin: 0,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "24px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#334155",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    color: "#0f172a",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
  },
  textarea: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    color: "#0f172a",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    minHeight: "160px",
    resize: "vertical",
  },
  audienceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  audienceCard: {
    padding: "16px",
    borderRadius: "8px",
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
  },
  audienceCardActive: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  audienceIcon: {
    color: "#64748b",
  },
  audienceIconActive: {
    color: "#3b82f6",
  },
  audienceLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#334155",
  },
  submitBtn: {
    width: "100%",
    padding: "14px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background-color 0.2s",
  },
  submitBtnDisabled: {
    backgroundColor: "#93c5fd",
    cursor: "not-allowed",
  },
  alertSuccess: {
    padding: "16px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    color: "#166534",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  alertError: {
    padding: "16px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#b91c1c",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
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
      setStatus({ type: "success", message: "Notice sent successfully!" });
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
        <h1 style={S.title}>Send Notices</h1>
        <p style={S.subtitle}>Broadcast announcements or alerts to users across the platform.</p>
      </div>

      {status?.type === "success" && (
        <div style={S.alertSuccess}>
          <CheckCircle2 size={20} />
          <span style={{ fontWeight: 500 }}>{status.message}</span>
        </div>
      )}
      {status?.type === "error" && (
        <div style={S.alertError}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: 500 }}>{status.message}</span>
        </div>
      )}

      <div style={S.formCard}>
        <form onSubmit={handleSubmit}>
          
          <div style={S.fieldGroup}>
            <label style={S.label}>Target Audience</label>
            <div style={S.audienceGrid}>
              <div 
                style={{ ...S.audienceCard, ...(audience === "all" ? S.audienceCardActive : {}) }}
                onClick={() => setAudience("all")}
              >
                <Users size={24} style={audience === "all" ? S.audienceIconActive : S.audienceIcon} />
                <span style={S.audienceLabel}>All Users</span>
              </div>
              <div 
                style={{ ...S.audienceCard, ...(audience === "students" ? S.audienceCardActive : {}) }}
                onClick={() => setAudience("students")}
              >
                <GraduationCap size={24} style={audience === "students" ? S.audienceIconActive : S.audienceIcon} />
                <span style={S.audienceLabel}>All Students</span>
              </div>
              <div 
                style={{ ...S.audienceCard, ...(audience === "tutors" ? S.audienceCardActive : {}) }}
                onClick={() => setAudience("tutors")}
              >
                <Presentation size={24} style={audience === "tutors" ? S.audienceIconActive : S.audienceIcon} />
                <span style={S.audienceLabel}>All Tutors</span>
              </div>
            </div>
          </div>

          <div style={S.fieldGroup}>
            <label style={S.label}>Notice Title</label>
            <input 
              style={S.input}
              type="text"
              placeholder="e.g. Scheduled Maintenance Update"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div style={S.fieldGroup}>
            <label style={S.label}>Message</label>
            <textarea 
              style={S.textarea}
              placeholder="Write the full content of your notice here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <button 
            type="submit" 
            style={{ ...S.submitBtn, ...(isSubmitting || !title || !message ? S.submitBtnDisabled : {}) }}
            disabled={isSubmitting || !title || !message}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Notice
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
