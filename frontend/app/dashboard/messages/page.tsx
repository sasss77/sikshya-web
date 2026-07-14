"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import { Send, Search, MoreVertical, Phone, Video, ChevronLeft, Circle, MessageSquare } from "lucide-react";

/* ─── Types ──────────────────────────────────────── */
interface Message {
  id: number;
  text: string;
  sender: "me" | "them";
  time: string;
  read: boolean;
}

interface Conversation {
  id: number;
  name: string;
  subject: string;
  initials: string;
  avatarColor: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

/* ─── Dummy Data ─────────────────────────────────── */
const CONVERSATIONS: Conversation[] = [
  {
    id: 1, name: "Anish Shrestha", subject: "Engineering Physics",
    initials: "AS", avatarColor: "#0B4085",
    lastMessage: "Sure! See you at 10 AM tomorrow 👍",
    lastTime: "2m ago", unread: 2, online: true,
    messages: [
      { id: 1, text: "Hi Anish! I have a question about thermodynamics.", sender: "me", time: "10:00 AM", read: true },
      { id: 2, text: "Of course! What's the concept you're confused about?", sender: "them", time: "10:02 AM", read: true },
      { id: 3, text: "The relationship between entropy and heat transfer. I can't visualise it.", sender: "me", time: "10:05 AM", read: true },
      { id: 4, text: "Great question! Think of entropy as a measure of disorder. When heat flows into a system, it increases the number of possible microstates — that's what increases entropy.", sender: "them", time: "10:08 AM", read: true },
      { id: 5, text: "Could we go over this in our next session? I'd love a visual explanation.", sender: "me", time: "10:10 AM", read: true },
      { id: 6, text: "Sure! See you at 10 AM tomorrow 👍", sender: "them", time: "10:11 AM", read: false },
    ],
  },
  {
    id: 2, name: "Priya Sharma", subject: "Biology",
    initials: "PS", avatarColor: "#0ea5e9",
    lastMessage: "Please revise Chapter 5 before the session.",
    lastTime: "1h ago", unread: 1, online: false,
    messages: [
      { id: 1, text: "Hello! Just confirming our Biology session for Saturday.", sender: "me", time: "9:00 AM", read: true },
      { id: 2, text: "Yes confirmed! Please revise Chapter 5 before the session.", sender: "them", time: "9:15 AM", read: false },
    ],
  },
  {
    id: 3, name: "Sohan Gurung", subject: "Economics",
    initials: "SG", avatarColor: "#7c3aed",
    lastMessage: "Thanks for the session! Very helpful.",
    lastTime: "3d ago", unread: 0, online: false,
    messages: [
      { id: 1, text: "Thanks for the session! Very helpful.", sender: "me", time: "4:30 PM", read: true },
      { id: 2, text: "My pleasure! Keep practising the demand-supply problems.", sender: "them", time: "4:35 PM", read: true },
    ],
  },
];

/* ─── Bubble component ───────────────────────────── */
function Bubble({ msg }: { msg: Message }) {
  const isMe = msg.sender === "me";
  return (
    <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: "0.6rem" }}>
      <div style={{
        maxWidth: "68%", padding: "0.65rem 1rem",
        background: isMe ? "#0B4085" : "#f1f5f9",
        color: isMe ? "#fff" : "#1a202c",
        borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        fontSize: "0.875rem", lineHeight: 1.5,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        {msg.text}
        <div style={{ fontSize: "0.65rem", color: isMe ? "rgba(255,255,255,0.6)" : "#94a3b8", marginTop: "0.25rem", textAlign: isMe ? "right" : "left" }}>
          {msg.time}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────── */
export default function MessagesPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, conversations]);

  if (loading || !user) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  const activeConv = conversations.find(c => c.id === activeId) || null;
  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = () => {
    if (!input.trim() || !activeId) return;
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setConversations(prev => prev.map(c =>
      c.id === activeId
        ? {
            ...c,
            lastMessage: input.trim(),
            lastTime: "now",
            unread: 0,
            messages: [...c.messages, { id: Date.now(), text: input.trim(), sender: "me", time: now, read: true }],
          }
        : c
    ));
    setInput("");
  };

  const openConv = (id: number) => {
    setActiveId(id);
    setMobileShowChat(true);
    // Mark as read
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  return (
    <div style={{ background: "#f4f6fa", height: "calc(100vh - 68px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{
        maxWidth: "1100px", width: "100%", margin: "0 auto",
        padding: "1.5rem 1.5rem", flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden",
      }}>
        {/* Page Title */}
        <div style={{ marginBottom: "1rem", flexShrink: 0, display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #0B4085, #1a56b3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(11,64,133,0.2)" }}>
            <MessageSquare size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.2rem", letterSpacing: "-0.01em" }}>
              Messages
            </h1>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
              Chat directly with your {user.role === "tutor" ? "students" : "tutors"} and keep track of your sessions.
            </p>
          </div>
        </div>

        {/* Chat Container */}
        <div style={{
          display: "flex", background: "#fff", borderRadius: "16px",
          border: "1px solid #e2e8f0", overflow: "hidden",
          flex: 1, minHeight: 0,
          boxShadow: "0 4px 24px rgba(11,64,133,0.06)",
        }}>
          {/* ── Sidebar / Conversation List ── */}
          <div style={{
            width: "300px", flexShrink: 0,
            borderRight: "1px solid #f1f5f9",
            display: "flex", flexDirection: "column",
            minHeight: 0, overflow: "hidden",
          }}
          className={`conv-list ${mobileShowChat ? "hidden-mobile" : ""}`}
          >
            {/* Search */}
            <div style={{ padding: "1rem 1rem 0.75rem", flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <Search size={15} color="#94a3b8" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: "100%", padding: "0.55rem 0.75rem 0.55rem 2.25rem",
                    border: "1.5px solid #e2e8f0", borderRadius: "10px",
                    fontSize: "0.825rem", outline: "none", boxSizing: "border-box",
                    background: "#f8fafc", color: "#1a202c",
                  }}
                />
              </div>
            </div>

            {/* List — scrollable */}
            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", minHeight: 0 }}>
              {filtered.length === 0 && (
                <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" }}>
                  No conversations found
                </div>
              )}
              {filtered.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => openConv(conv.id)}
                  style={{
                    padding: "0.9rem 1rem",
                    background: activeId === conv.id ? "#f0f7ff" : "transparent",
                    borderLeft: activeId === conv.id ? "3px solid #0B4085" : "3px solid transparent",
                    cursor: "pointer",
                    display: "flex", gap: "0.75rem", alignItems: "flex-start",
                    transition: "background 0.12s ease",
                    borderBottom: "1px solid #f8fafc",
                  }}
                  className="conv-item"
                >
                  {/* Avatar */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "50%",
                      background: conv.avatarColor, color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: "0.9rem",
                    }}>
                      {conv.initials}
                    </div>
                    {conv.online && (
                      <div style={{
                        position: "absolute", bottom: 1, right: 1,
                        width: "11px", height: "11px", borderRadius: "50%",
                        background: "#22c55e", border: "2px solid #fff",
                      }} />
                    )}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.15rem" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: conv.unread ? 700 : 600, color: "#1a202c" }}>{conv.name}</span>
                      <span style={{ fontSize: "0.68rem", color: "#94a3b8", whiteSpace: "nowrap" }}>{conv.lastTime}</span>
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "#64748b", margin: "0 0 0.1rem", fontWeight: 500 }}>{conv.subject}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "160px" }}>
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <span style={{
                          width: "18px", height: "18px", borderRadius: "50%",
                          background: "#0B4085", color: "#fff",
                          fontSize: "0.65rem", fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Chat Panel ── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}
            className={mobileShowChat ? "show-mobile" : ""}
          >
            {!activeConv ? (
              /* Empty state */
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8", gap: "0.75rem" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#64748b", margin: 0 }}>Select a conversation to start messaging</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div style={{
                  padding: "0.875rem 1.25rem",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex", alignItems: "center", gap: "0.875rem",
                  background: "#fff",
                }}>
                  <button
                    onClick={() => { setMobileShowChat(false); setActiveId(null); }}
                    style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}
                    className="back-btn"
                  >
                    <ChevronLeft size={20} color="#0B4085" />
                  </button>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: activeConv.avatarColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem" }}>
                      {activeConv.initials}
                    </div>
                    {activeConv.online && (
                      <div style={{ position: "absolute", bottom: 0, right: 0, width: "11px", height: "11px", borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.1rem" }}>{activeConv.name}</p>
                    <p style={{ fontSize: "0.72rem", color: activeConv.online ? "#22c55e" : "#94a3b8", margin: 0, fontWeight: 600 }}>
                      {activeConv.online ? (
                        <><Circle size={8} fill="#22c55e" color="#22c55e" style={{ display: "inline", marginRight: "3px" }} /> Online</>
                      ) : "Last seen recently"}
                      <span style={{ color: "#cbd5e0", margin: "0 6px" }}>·</span>
                      <span style={{ color: "#94a3b8" }}>{activeConv.subject}</span>
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button style={{ background: "#f4f6fa", border: "none", borderRadius: "8px", padding: "0.5rem", cursor: "pointer", display: "flex" }}>
                      <Phone size={16} color="#64748b" />
                    </button>
                    <button style={{ background: "#f4f6fa", border: "none", borderRadius: "8px", padding: "0.5rem", cursor: "pointer", display: "flex" }}>
                      <Video size={16} color="#64748b" />
                    </button>
                    <button style={{ background: "#f4f6fa", border: "none", borderRadius: "8px", padding: "0.5rem", cursor: "pointer", display: "flex" }}>
                      <MoreVertical size={16} color="#64748b" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem", background: "#fafbfd" }}>
                  {activeConv.messages.map(msg => (
                    <Bubble key={msg.id} msg={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid #f1f5f9", background: "#fff" }}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
                    <input
                      type="text"
                      placeholder={`Message ${activeConv.name}...`}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                      style={{
                        flex: 1, padding: "0.75rem 1rem",
                        border: "1.5px solid #e2e8f0", borderRadius: "12px",
                        fontSize: "0.875rem", outline: "none",
                        background: "#f8fafc", color: "#1a202c",
                        transition: "border-color 0.15s ease",
                      }}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      style={{
                        width: "42px", height: "42px", borderRadius: "12px",
                        background: input.trim() ? "#0B4085" : "#e2e8f0",
                        border: "none", cursor: input.trim() ? "pointer" : "not-allowed",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, transition: "background 0.15s ease",
                      }}
                    >
                      <Send size={16} color={input.trim() ? "#fff" : "#94a3b8"} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .conv-item:hover { background: #f8fafc !important; }
        input:focus { border-color: #0B4085 !important; box-shadow: 0 0 0 3px rgba(11,64,133,0.08); }
        @media (max-width: 640px) {
          .conv-list { width: 100% !important; border-right: none !important; }
          .hidden-mobile { display: none !important; }
          .back-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
