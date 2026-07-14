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

/* ─── Dummy Data ─────────────────────────────────────── */
const STUDENT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1, type: "booking", title: "Booking Confirmed",
    message: "Your session with Anish Shrestha for Engineering Physics has been confirmed for tomorrow at 10:00 AM.",
    time: "2 hours ago", read: false,
  },
  {
    id: 2, type: "message", title: "New Message from Priya",
    message: "Priya Sharma: 'Please revise Chapter 5 before the session.'",
    time: "4 hours ago", read: false,
  },
  {
    id: 3, type: "system", title: "Welcome to Sikshya!",
    message: "Your account has been fully verified. Start exploring tutors now.",
    time: "2 days ago", read: true,
  },
  {
    id: 4, type: "payment", title: "Payment Successful",
    message: "Your payment of Rs. 600 for the Economics session was successful.",
    time: "4 days ago", read: true,
  },
];

const TUTOR_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1, type: "booking", title: "New Booking Request",
    message: "Rajan Thapa has requested a 90-min session for Engineering Physics.",
    time: "1 hour ago", read: false,
  },
  {
    id: 2, type: "system", title: "Profile Approved",
    message: "Your tutor profile has been approved and is now visible to students.",
    time: "5 hours ago", read: false,
  },
  {
    id: 3, type: "message", title: "New Message from Sima",
    message: "Sima Karki: 'Could we go over this in our next session?'",
    time: "1 day ago", read: true,
  },
  {
    id: 4, type: "payment", title: "Payout Processed",
    message: "Your recent earnings of Rs. 1,600 have been transferred to your account.",
    time: "3 days ago", read: true,
  },
];

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

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    } else if (user) {
      setNotifications(user.role === "tutor" ? TUTOR_NOTIFICATIONS : STUDENT_NOTIFICATIONS);
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

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
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
          <div style={{ display: "flex", gap: "0.75rem" }}>
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
              onClick={clearAll}
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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .notif-item:hover { background: #f8fafc !important; }
      `}</style>
    </div>
  );
}
