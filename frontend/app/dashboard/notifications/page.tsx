"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import {
  Bell,
  CalendarCheck,
  MessageCircle,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  Trash2,
  Plus,
  X,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────── */
type NotificationType = "booking" | "message" | "system" | "payment";

interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

import {
  fetchNotificationsAction,
  markNotificationReadAction,
  markAllNotificationsReadAction,
  clearAllNotificationsAction,
} from "@/lib/actions/notification-action";

/* ─── Notification Config ───────────────────────────── */
const TYPE_CONFIG = {
  booking: { Icon: CalendarCheck, color: "#0B4085", bg: "#e8eef7" },
  message: { Icon: MessageCircle, color: "#8b5cf6", bg: "#f3e8ff" },
  system: { Icon: AlertCircle, color: "#f59e0b", bg: "#fef3c7" },
  payment: { Icon: CreditCard, color: "#10b981", bg: "#d1fae5" },
};

/* ─── Main Component ─────────────────────────────────── */
export default function NotificationsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [newNotif, setNewNotif] = useState({ title: "", message: "", type: "message" as NotificationType });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadNotifications = async () => {
    const res = await fetchNotificationsAction();
    if (res.success) {
      setNotifications(res.data.map((n: any) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        time: new Date(n.createdAt).toLocaleString(),
      })));
    } else {
      showToast(res.error || "Failed to load notifications", "error");
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    } else if (user) {
      loadNotifications();
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    const res = await markAllNotificationsReadAction();
    if (res.success) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } else {
      showToast(res.error || "Failed to mark all as read", "error");
    }
  };

  const clearAll = async () => {
    const res = await clearAllNotificationsAction();
    if (res.success) {
      setNotifications([]);
      setShowClearConfirm(false);
      showToast("All notifications cleared!");
    } else {
      showToast(res.error || "Failed to clear notifications", "error");
    }
  };

  const markAsRead = async (id: number | string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await markNotificationReadAction(String(id));
  };

  const handleSend = () => {
    if (!newNotif.title.trim() || !newNotif.message.trim()) {
      showToast("Please fill all fields", "error");
      return;
    }
    // We can't actually trigger notifications to others from frontend directly, this is a mock for demo
    // The backend handles auto notifications.
    setNotifications(prev => [
      { id: Date.now() as any, type: newNotif.type, title: newNotif.title, message: newNotif.message, time: "Just now", read: false },
      ...prev
    ]);
    setShowCompose(false);
    setNewNotif({ title: "", message: "", type: "message" });
    showToast("Notification sent successfully! (Mock)");
  };

  return (
    <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 900, color: "#1a202c", margin: "0 0 0.4rem 0", letterSpacing: "-0.02em" }}>
              Notifications
            </h1>
            <p style={{ fontSize: "0.95rem", color: "#64748b", margin: 0 }}>
              You have <strong style={{ color: "#0B4085" }}>{unreadCount} unread</strong> notifications.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {user.role === "tutor" && (
              <button
                onClick={() => setShowCompose(true)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  background: "linear-gradient(135deg, #0B4085, #1a56b3)", border: "none", borderRadius: "8px",
                  padding: "0.5rem 1rem", fontSize: "0.825rem", fontWeight: 700,
                  color: "#fff", cursor: "pointer", transition: "all 0.15s ease",
                  boxShadow: "0 2px 8px rgba(11,64,133,0.25)"
                }}
              >
                <Plus size={15} /> Send Notification
              </button>
            )}
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                background: "none", border: "1px solid #e2e8f0", borderRadius: "8px",
                padding: "0.5rem 1rem", fontSize: "0.825rem", fontWeight: 600,
                color: unreadCount === 0 ? "#cbd5e0" : "#64748b",
                cursor: unreadCount === 0 ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <CheckCircle2 size={15} /> Mark all read
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={notifications.length === 0}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                background: "none", border: "1px solid #fee2e2", borderRadius: "8px",
                padding: "0.5rem 1rem", fontSize: "0.825rem", fontWeight: 600,
                color: notifications.length === 0 ? "#fca5a5" : "#ef4444",
                cursor: notifications.length === 0 ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <Trash2 size={15} /> Clear all
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 20px rgba(11,64,133,0.04)" }}>
          {notifications.length === 0 ? (
            <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <Bell size={28} color="#94a3b8" />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.5rem" }}>You're all caught up!</h3>
              <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0 }}>There are no new notifications right now.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {notifications.map((notif, idx) => {
                const config = TYPE_CONFIG[notif.type];
                const Icon = config.Icon;
                return (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    style={{
                      padding: "1.25rem 1.5rem",
                      display: "flex", gap: "1rem", alignItems: "flex-start",
                      borderBottom: idx === notifications.length - 1 ? "none" : "1px solid #f1f5f9",
                      background: notif.read ? "#fff" : "#f8fafc",
                      cursor: "pointer",
                      transition: "background 0.2s ease",
                    }}
                    className="notif-item"
                  >
                    <div style={{
                      width: "42px", height: "42px", borderRadius: "50%",
                      background: config.bg, color: config.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" }}>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: notif.read ? 600 : 700, color: "#1a202c", margin: 0 }}>
                          {notif.title}
                        </h4>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", whiteSpace: "nowrap", marginLeft: "1rem" }}>
                          {notif.time}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                        {notif.message}
                      </p>
                    </div>
                    {!notif.read && (
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444", flexShrink: 0, marginTop: "0.4rem" }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "2rem", right: "2rem", zIndex: 1000,
          background: toast.type === "success" ? "#22c55e" : "#ef4444",
          color: "#fff", padding: "1rem 1.5rem", borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          display: "flex", alignItems: "center", gap: "0.75rem",
          fontWeight: 600, fontSize: "0.95rem",
          animation: "toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          {toast.message}
        </div>
      )}

      {/* Compose Modal */}
      {showCompose && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", padding: "1rem"
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "2rem",
            width: "100%", maxWidth: "480px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            animation: "modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a202c", margin: 0 }}>New Notification</h3>
              <button onClick={() => setShowCompose(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", padding: "0.4rem", cursor: "pointer" }}>
                <X size={18} color="#64748b" />
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem", display: "block" }}>Notification Type</label>
                <select 
                  value={newNotif.type} onChange={e => setNewNotif({...newNotif, type: e.target.value as NotificationType})}
                  style={{ width: "100%", padding: "0.7rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.9rem", outline: "none", fontFamily: "inherit", color: "#1e293b", background: "#fff", cursor: "pointer", boxSizing: "border-box" }}
                >
                  <option value="message">Message</option>
                  <option value="system">System Alert</option>
                  <option value="booking">Booking Update</option>
                  <option value="payment">Payment Notice</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem", display: "block" }}>Title</label>
                <input 
                  value={newNotif.title} onChange={e => setNewNotif({...newNotif, title: e.target.value})}
                  placeholder="e.g. Session Rescheduled"
                  style={{ width: "100%", padding: "0.7rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.9rem", outline: "none", fontFamily: "inherit", color: "#1e293b", background: "#fff", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem", display: "block" }}>Message</label>
                <textarea 
                  value={newNotif.message} onChange={e => setNewNotif({...newNotif, message: e.target.value})}
                  placeholder="Type your notification message here..." rows={4}
                  style={{ width: "100%", padding: "0.7rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.9rem", outline: "none", fontFamily: "inherit", color: "#1e293b", background: "#fff", resize: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button onClick={() => setShowCompose(false)} style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s ease" }} className="modal-cancel-btn">Cancel</button>
                <button onClick={handleSend} style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #0B4085, #1a56b3)", color: "#fff", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s ease", boxShadow: "0 4px 12px rgba(11,64,133,0.2)" }} className="modal-send-btn">Send</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", padding: "1rem"
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "2rem",
            width: "100%", maxWidth: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            textAlign: "center", animation: "modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
              <Trash2 size={28} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.5rem" }}>Clear All Notifications?</h3>
            <p style={{ fontSize: "0.95rem", color: "#64748b", margin: "0 0 2rem" }}>
              Are you sure you want to clear all notifications? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => setShowClearConfirm(false)}
                style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s ease" }}
                className="modal-cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={clearAll}
                style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "none", background: "#ef4444", color: "#fff", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s ease", boxShadow: "0 4px 12px rgba(239,68,68,0.2)" }}
                className="modal-delete-btn"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastSlideIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .notif-item:hover { background: #f8fafc !important; }
        .modal-cancel-btn:hover { background: #f1f5f9 !important; }
        .modal-send-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(11,64,133,0.3) !important; }
        .modal-delete-btn:hover { background: #dc2626 !important; }
      `}</style>
    </div>
  );
}
