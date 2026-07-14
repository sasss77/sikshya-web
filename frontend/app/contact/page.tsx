"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.8rem 1rem", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "0.95rem", outline: "none",
    fontFamily: "inherit", transition: "border-color 0.2s", background: "#fff",
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#1e293b", background: "#f8fafc", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0B4085, #1a56b3)", color: "#fff", padding: "5rem 2rem 4rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, margin: "0 0 1rem", letterSpacing: "-0.02em" }}>Get in Touch</h1>
        <p style={{ opacity: 0.85, fontSize: "1.05rem", maxWidth: "480px", margin: "0 auto" }}>
          Have a question, feedback, or want to partner with us? We would love to hear from you.
        </p>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "4rem 2rem", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "3rem", alignItems: "start" }}>

        {/* Contact Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 0.5rem" }}>Contact Details</h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0, lineHeight: 1.7 }}>Our team is available Monday to Friday, 10 AM – 6 PM (NPT).</p>
          </div>

          {[
            { icon: Mail, color: "#0B4085", bg: "#e8eef7", label: "Email", value: "hello@sikshya.com.np" },
            { icon: Phone, color: "#22c55e", bg: "#dcfce7", label: "Phone", value: "+977 98XXXXXXXX" },
            { icon: MapPin, color: "#ef4444", bg: "#fee2e2", label: "Location", value: "Kathmandu, Nepal" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <item.icon size={20} color={item.color} />
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.2rem" }}>{item.label}</p>
                <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "2.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                <CheckCircle2 size={36} color="#16a34a" />
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#166534", margin: "0 0 0.5rem" }}>Message Sent!</h3>
              <p style={{ color: "#475569", fontSize: "0.95rem" }}>We will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 0.5rem" }}>Send a Message</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>Your Name</label>
                  <input required type="text" placeholder="Ram Bahadur" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} onFocus={e => e.target.style.borderColor = "#0B4085"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>Email Address</label>
                  <input required type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} onFocus={e => e.target.style.borderColor = "#0B4085"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>Subject</label>
                <input required type="text" placeholder="How can we help?" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={inputStyle} onFocus={e => e.target.style.borderColor = "#0B4085"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>Message</label>
                <textarea required placeholder="Tell us more..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }} onFocus={e => e.target.style.borderColor = "#0B4085"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
              <button type="submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "linear-gradient(135deg, #0B4085, #1a56b3)", color: "#fff", border: "none", padding: "0.9rem", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(11,64,133,0.2)" }}>
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
