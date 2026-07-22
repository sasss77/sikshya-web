"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, RotateCcw, Minimize2, BookOpen, Calendar, Search } from "lucide-react";

/* ─── Types ──────────────────────────────────────────── */
interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

/* ─── Canned Responses ───────────────────────────────── */
const AI_RESPONSES: Record<string, string> = {
  default: "I'm Sikshya AI, your personal learning assistant! I can help you find tutors, manage your bookings, explain concepts, or generate practice questions. What can I help you with today?",
  tutor: "Finding the right tutor is easy on Sikshya! 🎓 Head to **Find Tutors**, filter by subject and budget, and book a session instantly. Our tutors are verified peer-learners who understand your curriculum.",
  booking: "To book a session, go to **Find Tutors**, pick a tutor, and choose a time slot. You can manage all your bookings from **My Bookings** in the navigation bar.",
  mcq: "The **MCQ Generator** lets you create AI-powered practice questions on any subject — Physics, Biology, Math, Economics and more! Just choose your subject, difficulty, and click Generate. 🧠",
  physics: "Physics can be tricky! Key areas to focus on: Newton's Laws, Thermodynamics, Electrostatics, and Optics. I'd recommend booking a session with **Anish Shrestha** — he's an IOE ranker who specialises in Physics. ⚡",
  biology: "For Biology, focus on Cell Structure, Genetics, and Human Physiology for medical entrance. **Priya Sharma**, an IOM ranker, is an excellent match for you! 🧬",
  math: "Mathematics requires consistent practice. Break it into: Calculus, Algebra, Geometry, and Statistics. Try the MCQ Generator to test yourself after each chapter! 📐",
  hello: "Hello! 👋 Welcome to Sikshya! I'm your AI learning assistant. Ask me about finding tutors, your subjects, booking sessions, or anything learning-related!",
  help: "Here's what I can help with:\n• 🔍 Find the right tutor\n• 📅 Explain how bookings work\n• 📚 Give study tips by subject\n• 🤖 Tell you about the MCQ Generator\n• 💡 Answer general learning questions",
  economics: "Economics is all about understanding markets and behaviour. Focus on Demand & Supply, Market Structures, and Macroeconomics for board exams. **Sohan Gurung** is a CA aspirant who can mentor you brilliantly! 📊",
  price: "Tutor prices on Sikshya start from **Rs. 600/hour** and vary by tutor experience and subject. You can filter tutors by your budget on the Find Tutors page.",
  profile: "You can view and edit your profile from the **Profile** section — just click your avatar at the top right of the page. You can update your name, phone number, and profile photo.",
};

/* ─── API base URL (safe for browser) ───────────────── */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

async function getAIResponse(input: string, history?: Array<{role: string, parts: string}>): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, history })
    });
    const data = await res.json();
    if (data.success) {
      return data.reply;
    }
    return "I'm having a little trouble connecting right now. Please try again!";
  } catch (err) {
    console.error(err);
    return "Sorry, something went wrong on my end. Please try again.";
  }
}

/* ─── Typing Indicator ───────────────────────────────── */
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 14px", background: "#f1f5f9", borderRadius: "14px 14px 14px 4px", width: "fit-content" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: "7px", height: "7px", borderRadius: "50%",
          background: "#0B4085", opacity: 0.6,
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ─── Quick Prompts ──────────────────────────────────── */
const QUICK_PROMPTS = [
  { icon: Search, label: "Find a tutor", prompt: "How do I find a tutor?" },
  { icon: Calendar, label: "Book session", prompt: "How do I book a session?" },
  { icon: BookOpen, label: "Study tips", prompt: "Give me study tips for Physics" },
];

/* ─── Message Bubble ─────────────────────────────────── */
function MessageBubble({ msg }: { msg: Message }) {
  const isAI = msg.sender === "ai";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ display: "flex", justifyContent: isAI ? "flex-start" : "flex-end", marginBottom: "0.75rem", alignItems: "flex-end", gap: "0.5rem" }}>
      {isAI && (
        <div style={{
          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #0B4085, #1a56b3)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Sparkles size={13} color="#fff" />
        </div>
      )}
      <div style={{
        maxWidth: "82%",
        padding: "10px 14px",
        background: isAI ? "#f1f5f9" : "linear-gradient(135deg, #0B4085, #1a56b3)",
        color: isAI ? "#1a202c" : "#fff",
        borderRadius: isAI ? "14px 14px 14px 4px" : "14px 14px 4px 14px",
        fontSize: "0.83rem",
        lineHeight: 1.6,
        boxShadow: isAI ? "none" : "0 2px 8px rgba(11,64,133,0.25)",
      }}>
        {msg.text.split("\n").map((line, i) => (
          <span key={i}>{line}{i < msg.text.split("\n").length - 1 && <br />}</span>
        ))}
        <div suppressHydrationWarning style={{ fontSize: "0.62rem", opacity: 0.5, marginTop: "4px", textAlign: isAI ? "left" : "right" }}>
          {mounted ? msg.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : ""}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Chatbot ───────────────────────────────────── */
export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! 👋 I'm Sikshya AI, your personal learning assistant. I can help you find tutors, study tips, bookings, and more. What's on your mind?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus();
  }, [open, minimized]);

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content) return;

    const userMsg: Message = { id: Date.now(), text: content, sender: "user", timestamp: new Date() };
    
    // Prepare history from existing messages
    // Gemini expects: { role: "user" | "model", parts: string }
    const history = messages
      .filter(m => m.id !== 1) // skip the initial greeting to save tokens/avoid duplication
      .map(m => ({
        role: m.sender === "user" ? "user" : "model",
        parts: m.text
      }));

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const reply = await getAIResponse(content, history);

    const aiMsg: Message = {
      id: Date.now() + 1,
      text: reply,
      sender: "ai",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiMsg]);
    setTyping(false);
  };

  const reset = () => {
    setMessages([{
      id: 1,
      text: "Hello! 👋 I'm Sikshya AI. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    }]);
  };

  return (
    <>
      {/* ── Chat Panel ── */}
      <div style={{
        position: "fixed",
        bottom: open ? "100px" : "110px",
        right: "24px",
        width: "360px",
        height: minimized ? "0px" : "520px",
        zIndex: 999,
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(11,64,133,0.18), 0 4px 20px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transform: open ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        border: "1px solid #e2e8f0",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #0B4085 0%, #1a56b3 100%)",
          padding: "1rem 1.25rem",
          display: "flex", alignItems: "center", gap: "0.75rem",
          flexShrink: 0,
        }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "pulseRing 2.5s ease-in-out infinite",
          }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff", margin: 0 }}>Sikshya AI</p>
            <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.75)", margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              Online · AI-powered assistant
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button onClick={reset} title="Reset" style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "8px", padding: "0.35rem", cursor: "pointer", display: "flex" }}>
              <RotateCcw size={14} color="#fff" />
            </button>
            <button onClick={() => setMinimized(v => !v)} title="Minimize" style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "8px", padding: "0.35rem", cursor: "pointer", display: "flex" }}>
              <Minimize2 size={14} color="#fff" />
            </button>
            <button onClick={() => setOpen(false)} title="Close" style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "8px", padding: "0.35rem", cursor: "pointer", display: "flex" }}>
              <X size={14} color="#fff" />
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem", background: "#fafbfd" }}>
              {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
              {typing && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #0B4085, #1a56b3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles size={13} color="#fff" />
                  </div>
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts (show only at start) */}
            {messages.length <= 1 && (
              <div style={{ padding: "0 1rem 0.75rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {QUICK_PROMPTS.map(({ icon: Icon, label, prompt }) => (
                  <button
                    key={label}
                    onClick={() => sendMessage(prompt)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.35rem",
                      background: "#f0f7ff", border: "1px solid #bfdbfe",
                      borderRadius: "999px", padding: "0.35rem 0.75rem",
                      fontSize: "0.72rem", fontWeight: 600, color: "#0B4085",
                      cursor: "pointer", transition: "all 0.15s ease",
                    }}
                    className="quick-prompt-btn"
                  >
                    <Icon size={12} /> {label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid #f1f5f9", background: "#fff", display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                style={{
                  flex: 1, padding: "0.6rem 0.9rem",
                  border: "1.5px solid #e2e8f0", borderRadius: "12px",
                  fontSize: "0.83rem", outline: "none", background: "#f8fafc",
                  color: "#1a202c", transition: "border-color 0.15s",
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                style={{
                  width: "38px", height: "38px", borderRadius: "12px",
                  background: input.trim() ? "linear-gradient(135deg, #0B4085, #1a56b3)" : "#e2e8f0",
                  border: "none", cursor: input.trim() ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.2s ease",
                  boxShadow: input.trim() ? "0 4px 12px rgba(11,64,133,0.3)" : "none",
                }}
              >
                <Send size={15} color={input.trim() ? "#fff" : "#94a3b8"} />
              </button>
            </div>

            {/* Footer */}
            <div style={{ padding: "0.4rem 1rem 0.6rem", textAlign: "center", background: "#fff" }}>
              <p style={{ fontSize: "0.62rem", color: "#cbd5e0", margin: 0 }}>
                Powered by Sikshya AI · Responses may be limited in demo mode
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Floating Button ── */}
      <button
        onClick={() => { setOpen(v => !v); setMinimized(false); }}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0B4085 0%, #1a56b3 50%, #0ea5e9 100%)",
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 28px rgba(11,64,133,0.35), 0 0 0 0 rgba(11,64,133,0.4)",
          animation: open ? "none" : "pulseGlow 2.5s ease-in-out infinite",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          transform: open ? "rotate(0deg) scale(1.05)" : "rotate(0deg) scale(1)",
        }}
        className="ai-fab"
        title="Chat with Sikshya AI"
      >
        {open
          ? <X size={24} color="#fff" />
          : <Sparkles size={26} color="#fff" />
        }

        {/* Unread badge */}
        {!open && (
          <span style={{
            position: "absolute", top: -2, right: -2,
            width: "16px", height: "16px",
            borderRadius: "50%", background: "#22c55e",
            border: "2px solid #fff",
            fontSize: "0.6rem", fontWeight: 700,
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          }}>1</span>
        )}
      </button>

      <style>{`
        @keyframes pulseGlow {
          0%   { box-shadow: 0 8px 28px rgba(11,64,133,0.35), 0 0 0 0   rgba(11,64,133,0.45); }
          60%  { box-shadow: 0 8px 28px rgba(11,64,133,0.35), 0 0 0 14px rgba(11,64,133,0); }
          100% { box-shadow: 0 8px 28px rgba(11,64,133,0.35), 0 0 0 0   rgba(11,64,133,0); }
        }
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }
        .ai-fab:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 12px 36px rgba(11,64,133,0.45) !important;
        }
        .quick-prompt-btn:hover {
          background: #dbeafe !important;
          border-color: #93c5fd !important;
        }
        input:focus { border-color: #0B4085 !important; box-shadow: 0 0 0 3px rgba(11,64,133,0.1); }
      `}</style>
    </>
  );
}
