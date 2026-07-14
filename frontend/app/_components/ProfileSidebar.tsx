"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, User, PieChart, BookOpen, GraduationCap, LogOut, Settings, ChevronRight, MessageSquare, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";

interface ProfileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { icon: PieChart, label: "My Summary", href: "/dashboard", color: "#0ea5e9" },
  { icon: User, label: "My Profile", href: "/dashboard/profile", color: "#0B4085" },
  { icon: GraduationCap, label: "My Learnings", href: "/dashboard/learnings", color: "#8b5cf6" },
  { icon: BookOpen, label: "MCQ Generator", href: "/dashboard/mcq", color: "#f59e0b", studentOnly: true },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", color: "#22c55e" },
];

export default function ProfileSidebar({ open, onClose }: ProfileSidebarProps) {
  const { user, setUser } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (overlayRef.current && e.target === overlayRef.current) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    onClose();
    router.replace("/login");
  };

  const imageUrl = user?.profileImage
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${user.profileImage}`
    : null;

  const initials = user?.fullName
    ? user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const visibleItems = NAV_ITEMS.filter(item =>
    !item.studentOnly || user?.role === "student"
  );

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Sidebar Panel */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "320px", zIndex: 201,
          background: "#fff",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex", flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "linear-gradient(135deg, #0B4085 0%, #1a56b3 100%)",
        }}>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>My Account</span>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.15)", border: "none",
              borderRadius: "8px", padding: "0.35rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={18} color="#fff" />
          </button>
        </div>

        {/* Profile Card */}
        <div style={{
          padding: "1.5rem",
          background: "linear-gradient(135deg, #e8eef7 0%, #f4f6fa 100%)",
          borderBottom: "1px solid #e2e8f0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Avatar */}
            <div style={{
              width: "60px", height: "60px", borderRadius: "50%",
              background: imageUrl ? "transparent" : "#0B4085",
              border: "3px solid #fff",
              boxShadow: "0 4px 12px rgba(11,64,133,0.2)",
              overflow: "hidden", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {imageUrl ? (
                <img src={imageUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ color: "#fff", fontWeight: 800, fontSize: "1.25rem" }}>{initials}</span>
              )}
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.2rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.fullName || "User"}
              </p>
              <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0 0 0.4rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.email}
              </p>
              <span style={{
                display: "inline-block", padding: "0.15rem 0.6rem",
                borderRadius: "999px", fontSize: "0.68rem", fontWeight: 700,
                background: user?.role === "tutor" ? "#dcfce7" : user?.role === "admin" ? "#fee2e2" : "#e8eef7",
                color: user?.role === "tutor" ? "#166534" : user?.role === "admin" ? "#991b1b" : "#0B4085",
                textTransform: "capitalize",
              }}>
                {user?.role || "student"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{ padding: "0.75rem 0", flex: 1 }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.5rem 1.5rem 0.25rem" }}>
            Navigation
          </p>
          {visibleItems.map(({ icon: Icon, label, href, color }) => {
            const isActive = href === "/dashboard" ? pathname === href : (pathname === href || pathname.startsWith(href + "/"));
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                style={{
                  display: "flex", alignItems: "center", gap: "0.875rem",
                  padding: "0.8rem 1.5rem",
                  background: isActive ? "#f0f7ff" : "transparent",
                  borderRight: isActive ? `3px solid ${color}` : "3px solid transparent",
                  textDecoration: "none",
                  transition: "background 0.15s ease",
                }}
                className="sidebar-nav-item"
              >
                <div style={{
                  width: "34px", height: "34px", borderRadius: "9px",
                  background: isActive ? color + "18" : "#f4f6fa",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={17} color={isActive ? color : "#64748b"} />
                </div>
                <span style={{
                  fontSize: "0.875rem", fontWeight: isActive ? 700 : 500,
                  color: isActive ? color : "#374151", flex: 1,
                }}>
                  {label}
                </span>
                <ChevronRight size={15} color="#cbd5e0" />
              </Link>
            );
          })}

          {/* Divider */}
          <div style={{ margin: "0.75rem 1.5rem", borderTop: "1px solid #f1f5f9" }} />

          {/* Settings */}
          <Link
            href="/dashboard/profile"
            onClick={onClose}
            style={{
              display: "flex", alignItems: "center", gap: "0.875rem",
              padding: "0.8rem 1.5rem", textDecoration: "none",
              transition: "background 0.15s ease",
            }}
            className="sidebar-nav-item"
          >
            <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "#f4f6fa", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Settings size={17} color="#64748b" />
            </div>
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151", flex: 1 }}>Account Settings</span>
            <ChevronRight size={15} color="#cbd5e0" />
          </Link>
        </div>

        {/* Footer — Logout */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <Shield size={13} color="#94a3b8" />
            <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Your session is secure and encrypted</span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              gap: "0.6rem", padding: "0.75rem",
              background: "#fff5f5", border: "1.5px solid #fecaca",
              borderRadius: "10px", color: "#dc2626",
              fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
              transition: "background 0.15s ease",
            }}
            className="logout-btn"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>

      <style>{`
        .sidebar-nav-item:hover {
          background: #f8fafc !important;
        }
        .logout-btn:hover {
          background: #fee2e2 !important;
        }
      `}</style>
    </>
  );
}
