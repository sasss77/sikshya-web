"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import {
  Send, Search, X, MessageSquare, Loader2,
  CheckCheck, Check, ArrowLeft, UserCircle, Users,
} from "lucide-react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import type { Socket } from "socket.io-client";
import {
  fetchChatRoomsAction,
  createOrGetChatRoomAction,
  fetchChatMessagesAction,
  searchChatUsersAction,
  getTokenAction,
} from "@/lib/actions/chat-actions";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

/* ─── Types ───────────────────────────────────────────── */
interface ChatUser {
  id: string;
  fullName: string;
  profileImage: string | null;
  role: string;
}

interface Room {
  id: string;
  otherUser: ChatUser;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageIsMe: boolean;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
  isMe: boolean;
}

/* ─── Helpers ──────────────────────────────────────────── */
const getInitials = (name: string) =>
  name?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "?";

const AVATAR_COLORS = ["#0B4085", "#0ea5e9", "#7c3aed", "#ec4899", "#f59e0b", "#22c55e", "#ef4444"];
const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < (name?.length || 0); i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const formatTime = (iso: string, mounted: boolean = true) => {
  if (!iso || !mounted) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString("en-US", { weekday: "short" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const ROLE_LABEL: Record<string, string> = { tutor: "Tutor", student: "Student", admin: "Admin" };
const ROLE_COLOR: Record<string, string> = { tutor: "#7c3aed", student: "#0B4085", admin: "#dc2626" };

/* ─── Avatar Component ─────────────────────────────────── */
function Avatar({ user, size = 40, showOnline = false, isOnline = false }: {
  user: ChatUser; size?: number; showOnline?: boolean; isOnline?: boolean;
}) {
  const color = getAvatarColor(user.fullName);
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {user.profileImage ? (
        <img src={user.profileImage.startsWith('http') ? user.profileImage : `${BACKEND_URL}${user.profileImage}`} alt={user.fullName}
          style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />
      ) : (
        <div style={{
          width: size, height: size, borderRadius: "50%", background: color,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 700, fontSize: size * 0.36, userSelect: "none",
        }}>
          {getInitials(user.fullName)}
        </div>
      )}
      {showOnline && (
        <div style={{
          position: "absolute", bottom: 1, right: 1,
          width: 10, height: 10, borderRadius: "50%",
          background: isOnline ? "#22c55e" : "#cbd5e0",
          border: "2px solid #fff",
        }} />
      )}
    </div>
  );
}

/* ─── Message Bubble ───────────────────────────────────── */
function Bubble({ msg }: { msg: Message }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{
      display: "flex", justifyContent: msg.isMe ? "flex-end" : "flex-start",
      marginBottom: "0.3rem", animation: "bubblePop 0.15s ease",
    }}>
      <div style={{
        maxWidth: "70%", padding: "0.55rem 0.95rem",
        background: msg.isMe ? "linear-gradient(135deg,#0B4085,#1a5fc8)" : "#f1f5f9",
        color: msg.isMe ? "#fff" : "#1a202c",
        borderRadius: msg.isMe ? "16px 16px 3px 16px" : "16px 16px 16px 3px",
        fontSize: "0.875rem", lineHeight: 1.55,
        boxShadow: msg.isMe ? "0 2px 10px rgba(11,64,133,0.2)" : "0 1px 3px rgba(0,0,0,0.05)",
      }}>
        <p style={{ margin: 0, wordBreak: "break-word" }}>{msg.content}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.25rem", marginTop: "0.2rem" }}>
          <span suppressHydrationWarning style={{ fontSize: "0.65rem", opacity: 0.7 }}>{formatTime(msg.createdAt, mounted)}</span>
          {msg.isMe && (
            msg.readAt
              ? <CheckCheck size={12} style={{ opacity: 0.8 }} />
              : <Check size={12} style={{ opacity: 0.55 }} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────── */
function MessagesContent() {
  const { user, loading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const newChatSearchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  /* ── Track activeRoom in a ref so socket listeners always see latest ── */
  const activeRoomRef = useRef<Room | null>(null);
  useEffect(() => { activeRoomRef.current = activeRoom; }, [activeRoom]);

  /* ── Socket Setup ───────────────────────────────────── */
  useEffect(() => {
    if (!user) return;
    let mounted = true;

    (async () => {
      const { token } = await getTokenAction();
      if (!token || !mounted) return;

      const s = getSocket(token);
      socketRef.current = s;

      // Always remove existing listeners first to prevent stacking
      const EVENTS = ["connect", "disconnect", "online_users", "user_online", "user_offline",
        "receive_message", "new_message_notification", "typing_update", "messages_read"] as const;
      EVENTS.forEach(e => s.off(e));

      s.on("connect", () => { if (mounted) setSocketReady(true); });
      s.on("disconnect", () => { if (mounted) setSocketReady(false); });
      s.on("online_users", (ids: string[]) => { if (mounted) setOnlineUsers(new Set(ids)); });
      s.on("user_online", ({ userId }: { userId: string }) => {
        if (mounted) setOnlineUsers(prev => new Set([...prev, userId]));
      });
      s.on("user_offline", ({ userId }: { userId: string }) => {
        if (mounted) setOnlineUsers(prev => { const n = new Set(prev); n.delete(userId); return n; });
      });

      s.on("receive_message", (msg: any) => {
        if (!mounted) return;
        const incoming: Message = {
          id: String(msg.id),
          senderId: msg.senderId,
          content: msg.content,
          createdAt: msg.createdAt,
          readAt: msg.readAt,
          isMe: msg.senderId === user.id,
        };

        // Use ref (always current) to decide if this is the open chat
        const curRoom = activeRoomRef.current;
        if (curRoom?.id === msg.roomId) {
          setMessages(prev => {
            if (prev.some(m => m.id === incoming.id)) return prev;
            return [...prev, incoming];
          });
        }

        // Always update sidebar preview
        setRooms(prev =>
          prev.map(r => r.id === msg.roomId
            ? {
                ...r,
                lastMessage: msg.content,
                lastMessageAt: msg.createdAt,
                lastMessageIsMe: incoming.isMe,
                // Only bump unread if this is NOT the currently open chat AND we are the receiver
                unreadCount: (curRoom?.id === msg.roomId) ? 0
                  : incoming.isMe ? r.unreadCount
                  : r.unreadCount + 1,
              }
            : r
          ).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
        );
      });

      // Receiver is NOT in the room socket yet — backend sends this directly
      s.on("new_message_notification", (msg: { roomId: string; senderId: string; content: string; createdAt: string }) => {
        if (!mounted) return;
        const curRoom = activeRoomRef.current;
        // If the room IS currently open, receive_message already handled it
        if (curRoom?.id === msg.roomId) return;

        setRooms(prev =>
          prev.map(r => r.id === msg.roomId
            ? {
                ...r,
                lastMessage: msg.content,
                lastMessageAt: msg.createdAt,
                lastMessageIsMe: false,
                unreadCount: r.unreadCount + 1,
              }
            : r
          ).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
        );
      });

      s.on("typing_update", ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
        if (!mounted) return;
        setTypingUsers(prev => { const n = new Set(prev); isTyping ? n.add(userId) : n.delete(userId); return n; });
      });

      s.on("messages_read", () => {
        if (!mounted) return;
        setMessages(prev => prev.map(m => m.isMe && !m.readAt ? { ...m, readAt: new Date().toISOString() } : m));
      });

      if (!s.connected) s.connect();
    })();

    return () => {
      mounted = false;
      const EVENTS = ["connect", "disconnect", "online_users", "user_online", "user_offline",
        "receive_message", "new_message_notification", "typing_update", "messages_read"] as const;
      EVENTS.forEach(e => socketRef.current?.off(e));
    };
  }, [user]);

  /* ── Load Rooms ─────────────────────────────────────── */
  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoadingRooms(true);
      const res = await fetchChatRoomsAction();
      if (res.success) setRooms(res.data || []);
      setLoadingRooms(false);
    })();
  }, [user]);

  /* ── Auto-open from ?userId= query param ────────────── */
  useEffect(() => {
    if (!user || initialized.current || loadingRooms) return;
    const targetUserId = searchParams.get("userId");
    if (!targetUserId) return;
    initialized.current = true;

    (async () => {
      const res = await createOrGetChatRoomAction(targetUserId);
      if (res.success) {
        const room: Room = res.data;
        setRooms(prev => {
          const exists = prev.find(r => r.id === room.id);
          return exists ? prev : [room, ...prev];
        });
        openRoom(room);
      }
    })();
  }, [user, loadingRooms, searchParams]);

  /* ── Scroll to bottom ───────────────────────────────── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  /* ── Redirect if no auth ────────────────────────────── */
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  /* ── Open Room ──────────────────────────────────────── */
  const openRoom = useCallback(async (room: Room) => {
    // Use ref to avoid stale closure; immediately update ref before async work
    if (activeRoomRef.current?.id === room.id) return;
    activeRoomRef.current = room;
    setActiveRoom(room);
    setMessages([]);
    setLoadingMsgs(true);
    setMobileShowChat(true);

    socketRef.current?.emit("join_room", { roomId: room.id });

    const res = await fetchChatMessagesAction(room.id);
    if (res.success) setMessages(res.data || []);
    setLoadingMsgs(false);
    setRooms(prev => prev.map(r => r.id === room.id ? { ...r, unreadCount: 0 } : r));
    inputRef.current?.focus();
  }, []);

  /* ── Start new chat ─────────────────────────────────── */
  const startChat = useCallback(async (chatUser: ChatUser) => {
    setShowNewChat(false);
    setSearchQuery("");
    setSearchResults([]);

    const res = await createOrGetChatRoomAction(chatUser.id);
    if (!res.success) return;
    const newRoom: Room = res.data;
    setRooms(prev => {
      const exists = prev.find(r => r.id === newRoom.id);
      return exists ? prev : [newRoom, ...prev];
    });
    await openRoom(newRoom);
  }, [openRoom]);

  /* ── Send Message ───────────────────────────────────── */
  const sendMessage = useCallback(() => {
    const text = inputText.trim();
    if (!text || !activeRoom || !socketRef.current) return;
    socketRef.current.emit("send_message", {
      roomId: activeRoom.id, receiverId: activeRoom.otherUser.id, content: text,
    });
    setInputText("");
    socketRef.current.emit("typing", { roomId: activeRoom.id, isTyping: false });
  }, [inputText, activeRoom]);

  /* ── Typing indicator ───────────────────────────────── */
  const handleTyping = (val: string) => {
    setInputText(val);
    if (!activeRoom || !socketRef.current) return;
    socketRef.current.emit("typing", { roomId: activeRoom.id, isTyping: true });
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socketRef.current?.emit("typing", { roomId: activeRoom.id, isTyping: false });
    }, 1500);
  };

  /* ── User search (new chat) ─────────────────────────── */
  const handleNewChatSearch = (val: string) => {
    setSearchQuery(val);
    if (newChatSearchTimerRef.current) clearTimeout(newChatSearchTimerRef.current);
    if (!val.trim()) { setSearchResults([]); return; }
    setIsSearching(true);
    newChatSearchTimerRef.current = setTimeout(async () => {
      const res = await searchChatUsersAction(val);
      if (res.success) setSearchResults(res.data || []);
      setIsSearching(false);
    }, 300);
  };

  const filteredRooms = sidebarSearch
    ? rooms.filter(r => r.otherUser.fullName.toLowerCase().includes(sidebarSearch.toLowerCase()))
    : rooms;

  if (loading || !user) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={32} color="#0B4085" style={{ animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  const isOtherOnline = activeRoom ? onlineUsers.has(activeRoom.otherUser.id) : false;
  const isOtherTyping = activeRoom ? typingUsers.has(activeRoom.otherUser.id) : false;

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "calc(100vh - 64px)", background: "#f1f5f9", padding: "2rem",
    }}
      className="messages-wrapper"
    >
      <div style={{
        display: "grid", gridTemplateColumns: "320px 1fr",
        width: "100%", maxWidth: "1150px", height: "82vh", minHeight: "550px",
        background: "#fff", borderRadius: "20px",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)", overflow: "hidden",
        fontFamily: "inherit", border: "1px solid #e2e8f0"
      }}
        className="messages-grid"
      >
      {/* ── Left Panel ─────────────────────────────────── */}
      <div style={{
        display: "flex", flexDirection: "column", borderRight: "1px solid #e2e8f0",
        background: "#fff", overflow: "hidden",
      }}
        className={`sidebar-panel ${mobileShowChat ? "mobile-hidden" : ""}`}
      >
        {/* Sidebar Header */}
        <div style={{ padding: "1rem 1rem 0.75rem", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#1a202c", margin: 0 }}>Chats</h2>
              {socketReady && (
                <span style={{
                  width: 8, height: 8, borderRadius: "50%", background: "#22c55e",
                  display: "inline-block", boxShadow: "0 0 6px #22c55e88",
                }} title="Connected" />
              )}
            </div>
            <button
              onClick={() => { setShowNewChat(true); setSearchQuery(""); setSearchResults([]); }}
              style={{
                background: "#eff6ff", color: "#0B4085", border: "none", borderRadius: "8px",
                padding: "0.4rem 0.75rem", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: "0.35rem", transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#dbeafe")}
              onMouseLeave={e => (e.currentTarget.style.background = "#eff6ff")}
            >
              <Users size={13} /> New Chat
            </button>
          </div>

          {/* Sidebar Search */}
          <div style={{ position: "relative" }}>
            <Search size={14} color="#94a3b8" style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={sidebarSearch}
              onChange={e => setSidebarSearch(e.target.value)}
              placeholder="Search conversations…"
              style={{
                width: "100%", padding: "0.5rem 0.65rem 0.5rem 2.1rem",
                border: "1.5px solid #f1f5f9", borderRadius: "8px",
                fontSize: "0.82rem", outline: "none", background: "#f8fafc",
                boxSizing: "border-box", color: "#1a202c",
              }}
              onFocus={e => { e.target.style.borderColor = "#0B4085"; e.target.style.background = "#fff"; }}
              onBlur={e => { e.target.style.borderColor = "#f1f5f9"; e.target.style.background = "#f8fafc"; }}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loadingRooms ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "2.5rem" }}>
              <Loader2 size={24} color="#0B4085" style={{ animation: "spin 0.8s linear infinite" }} />
            </div>
          ) : filteredRooms.length === 0 ? (
            <div style={{ padding: "2.5rem 1.25rem", textAlign: "center" }}>
              <MessageSquare size={36} color="#e2e8f0" style={{ margin: "0 auto 0.6rem" }} />
              <p style={{ fontWeight: 600, color: "#94a3b8", fontSize: "0.85rem", margin: "0 0 0.25rem" }}>
                {sidebarSearch ? "No matches found" : "No conversations yet"}
              </p>
              {!sidebarSearch && (
                <p style={{ fontSize: "0.75rem", color: "#cbd5e0", margin: 0 }}>
                  Click "New Chat" to get started
                </p>
              )}
            </div>
          ) : filteredRooms.map(room => {
            const isActive = activeRoom?.id === room.id;
            const isOnline = onlineUsers.has(room.otherUser.id);
            return (
              <button
                key={room.id}
                onClick={() => openRoom(room)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  background: isActive ? "#eff6ff" : (room.unreadCount > 0 ? "#f8faff" : "transparent"),
                  border: "none",
                  borderLeft: `3px solid ${isActive ? "#0B4085" : (room.unreadCount > 0 ? "#0B4085" : "transparent")}`,
                  cursor: "pointer", textAlign: "left",
                  transition: "all 0.15s",
                  animation: room.unreadCount > 0 && !isActive ? "roomSlide 0.25s ease" : undefined,
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = room.unreadCount > 0 ? "#eff6ff" : "#f8fafc"; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = room.unreadCount > 0 ? "#f8faff" : "transparent"; }}
              >
                <Avatar user={room.otherUser} size={44} showOnline isOnline={isOnline} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{
                      fontWeight: 700, fontSize: "0.875rem", color: "#1a202c",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{room.otherUser.fullName}</span>
                    <span suppressHydrationWarning style={{ fontSize: "0.65rem", color: "#94a3b8", flexShrink: 0, marginLeft: "0.25rem" }}>
                      {formatTime(room.lastMessageAt, isClient)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.1rem" }}>
                    <p style={{
                      margin: 0, fontSize: "0.75rem",
                      color: room.unreadCount > 0 ? "#1a202c" : "#94a3b8",
                      fontWeight: room.unreadCount > 0 ? 700 : 400,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "165px",
                    }}>
                      {room.lastMessage ? (room.lastMessageIsMe ? "You: " : "") + room.lastMessage : "Start a conversation"}
                    </p>
                    {room.unreadCount > 0 && (
                      <span style={{
                        background: "#0B4085", color: "#fff", borderRadius: "999px",
                        fontSize: "0.62rem", fontWeight: 700, padding: "0.1rem 0.42rem",
                        flexShrink: 0, marginLeft: "0.25rem",
                        animation: "unreadPulse 1.5s ease-in-out infinite",
                        display: "inline-block",
                      }}>
                        {room.unreadCount > 99 ? "99+" : room.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right Panel ──────────────────────────────────── */}
      <div style={{ 
        display: "flex", flexDirection: "column", overflow: "hidden", background: "#fafbff",
      }}
        className={`chat-panel ${!mobileShowChat ? "mobile-hidden" : ""}`}
      >
        {!activeRoom ? (
          /* Empty State */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg,#e8eef7,#dbeafe)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <MessageSquare size={34} color="#0B4085" />
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.35rem" }}>
                Your Messages
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                {user.role === "tutor"
                  ? "Select a conversation or search for a student to message"
                  : "Select a conversation or search for a tutor to message"}
              </p>
            </div>
            <button
              onClick={() => setShowNewChat(true)}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                background: "#0B4085", color: "#fff", border: "none", borderRadius: "9px",
                padding: "0.6rem 1.25rem", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
                boxShadow: "0 4px 12px rgba(11,64,133,0.22)",
              }}
            >
              <Users size={14} /> Start New Chat
            </button>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div style={{
              background: "#fff", borderBottom: "1px solid #e2e8f0",
              padding: "0.75rem 1.25rem", display: "flex", alignItems: "center",
              gap: "0.85rem", flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}>
              <button
                className="mobile-back-btn"
                onClick={() => setMobileShowChat(false)}
                style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#475569", padding: "0.25rem" }}
              >
                <ArrowLeft size={19} />
              </button>
              <Avatar user={activeRoom.otherUser} size={40} showOnline isOnline={isOtherOnline} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <h3 style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem", color: "#1a202c", whiteSpace: "nowrap" }}>
                    {activeRoom.otherUser.fullName}
                  </h3>
                  <span style={{
                    fontSize: "0.65rem", fontWeight: 700, padding: "0.1rem 0.5rem", borderRadius: "999px",
                    background: `${ROLE_COLOR[activeRoom.otherUser.role] || "#64748b"}18`,
                    color: ROLE_COLOR[activeRoom.otherUser.role] || "#64748b",
                    textTransform: "capitalize",
                  }}>
                    {ROLE_LABEL[activeRoom.otherUser.role] || activeRoom.otherUser.role}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "0.7rem", fontWeight: 500, color: isOtherOnline ? "#22c55e" : "#94a3b8" }}>
                  {isOtherTyping
                    ? <span style={{ color: "#0B4085", fontStyle: "italic" }}>typing…</span>
                    : isOtherOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column" }}>
              {loadingMsgs ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Loader2 size={26} color="#0B4085" style={{ animation: "spin 0.8s linear infinite" }} />
                </div>
              ) : messages.length === 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <UserCircle size={44} color="#e2e8f0" />
                  <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: 0, fontWeight: 500 }}>
                    Say hi to {activeRoom.otherUser.fullName}! 👋
                  </p>
                </div>
              ) : (
                <>
                  {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
                  {isOtherTyping && (
                    <div style={{ display: "flex", marginBottom: "0.3rem" }}>
                      <div style={{
                        background: "#f1f5f9", borderRadius: "16px 16px 16px 3px",
                        padding: "0.55rem 0.95rem", display: "flex", gap: "4px", alignItems: "center",
                      }}>
                        {[0, 0.18, 0.36].map((d, i) => (
                          <div key={i} style={{
                            width: 6, height: 6, borderRadius: "50%", background: "#94a3b8",
                            animation: `typingDot 1s ${d}s infinite ease-in-out`,
                          }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Bar */}
            <div style={{
              background: "#fff", borderTop: "1px solid #e2e8f0",
              padding: "0.75rem 1.25rem", display: "flex", gap: "0.6rem", alignItems: "center", flexShrink: 0,
            }}>
              <div style={{
                flex: 1, background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px",
                display: "flex", alignItems: "center", padding: "0.55rem 0.9rem",
                transition: "border-color 0.15s",
              }}>
                <input
                  ref={inputRef}
                  value={inputText}
                  onChange={e => handleTyping(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type a message…"
                  style={{
                    flex: 1, border: "none", background: "none", outline: "none",
                    fontSize: "0.875rem", color: "#1a202c",
                  }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputText.trim()}
                style={{
                  width: 42, height: 42, borderRadius: "11px", border: "none", flexShrink: 0,
                  background: inputText.trim() ? "linear-gradient(135deg,#0B4085,#1a5fc8)" : "#e2e8f0",
                  color: inputText.trim() ? "#fff" : "#94a3b8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: inputText.trim() ? "pointer" : "default",
                  transition: "all 0.15s",
                  boxShadow: inputText.trim() ? "0 3px 10px rgba(11,64,133,0.28)" : "none",
                }}
              >
                <Send size={17} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── New Chat Modal ────────────────────────────────── */}
      {showNewChat && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)",
        }}
          onClick={e => { if (e.target === e.currentTarget) { setShowNewChat(false); setSearchQuery(""); setSearchResults([]); } }}
        >
          <div style={{
            background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "420px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden",
            animation: "modalIn 0.18s ease",
          }}>
            <div style={{
              padding: "1.1rem 1.25rem", borderBottom: "1px solid #f1f5f9",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#1a202c" }}>New Message</h3>
                <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748b" }}>
                  {user.role === "tutor" ? "Search for students" : "Search for tutors"}
                </p>
              </div>
              <button
                onClick={() => { setShowNewChat(false); setSearchQuery(""); setSearchResults([]); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "0.25rem" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "0.75rem 1.25rem 0.5rem" }}>
              <div style={{ position: "relative" }}>
                <Search size={15} color="#94a3b8" style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => handleNewChatSearch(e.target.value)}
                  placeholder={user.role === "tutor" ? "Search students by name…" : "Search tutors by name…"}
                  style={{
                    width: "100%", padding: "0.6rem 0.75rem 0.6rem 2.2rem",
                    border: "1.5px solid #e2e8f0", borderRadius: "9px",
                    fontSize: "0.875rem", outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#0B4085")}
                  onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
                />
                {isSearching && (
                  <Loader2 size={14} color="#0B4085"
                    style={{ position: "absolute", right: "0.7rem", top: "50%", transform: "translateY(-50%)", animation: "spin 0.8s linear infinite" }} />
                )}
              </div>
            </div>

            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {searchResults.length > 0 ? (
                searchResults.map(u => (
                  <button
                    key={u.id}
                    onClick={() => startChat(u)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.75rem 1.25rem", background: "none", border: "none",
                      cursor: "pointer", textAlign: "left", transition: "background 0.1s",
                      borderTop: "1px solid #f8fafc",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}
                  >
                    <Avatar user={u} size={40} showOnline isOnline={onlineUsers.has(u.id)} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.875rem", color: "#1a202c" }}>{u.fullName}</p>
                      <span style={{
                        display: "inline-block", fontSize: "0.68rem", fontWeight: 700,
                        padding: "0.1rem 0.5rem", borderRadius: "999px", marginTop: "0.15rem",
                        background: `${ROLE_COLOR[u.role] || "#64748b"}15`,
                        color: ROLE_COLOR[u.role] || "#64748b",
                        textTransform: "capitalize",
                      }}>
                        {ROLE_LABEL[u.role] || u.role}
                      </span>
                    </div>
                    <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                      {onlineUsers.has(u.id) && (
                        <span style={{ fontSize: "0.65rem", color: "#22c55e", fontWeight: 600 }}>Online</span>
                      )}
                    </div>
                  </button>
                ))
              ) : searchQuery && !isSearching ? (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: 0 }}>
                    No {user.role === "tutor" ? "students" : "tutors"} found for "{searchQuery}"
                  </p>
                </div>
              ) : !searchQuery ? (
                <div style={{ padding: "1.5rem", textAlign: "center" }}>
                  <p style={{ fontSize: "0.8rem", color: "#cbd5e0", margin: 0 }}>
                    Start typing to search…
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bubblePop {
          from { opacity: 0; transform: scale(0.94) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes typingDot {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes unreadPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(11,64,133,0.4); }
          50%       { transform: scale(1.12); box-shadow: 0 0 0 4px rgba(11,64,133,0); }
        }
        @keyframes roomSlide {
          from { opacity: 0.6; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 800px) {
          .messages-wrapper { padding: 1.5rem !important; height: calc(100vh - 64px) !important; align-items: stretch !important; }
          .messages-grid { height: 100% !important; max-height: 100% !important; border-radius: 16px !important; }
        }
        @media (max-width: 680px) {
          .messages-wrapper { padding: 0 !important; }
          .messages-grid { grid-template-columns: 1fr !important; border-radius: 0 !important; border: none !important; }
          .sidebar-panel { display: flex !important; width: 100%; }
          .chat-panel { position: fixed; inset: 0; z-index: 50; }
          .mobile-hidden { display: none !important; }
          .mobile-back-btn { display: flex !important; }
        }
      `}</style>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>Loading messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
