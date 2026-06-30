"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/lib/context/UserContext";

const S: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    backgroundColor: "#f8fafc",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#1e293b",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  logoContainer: {
    padding: "24px",
    fontSize: "24px",
    fontWeight: 800,
    borderBottom: "1px solid #334155",
    letterSpacing: "-0.5px",
    color: "#f8fafc",
    textDecoration: "none",
  },
  nav: {
    flex: 1,
    padding: "24px 0",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  navItem: {
    padding: "12px 24px",
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.2s",
  },
  navItemActive: {
    backgroundColor: "#334155",
    color: "#fff",
    borderRight: "4px solid #3b82f6",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    height: "72px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
  },
  headerTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#0f172a",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userName: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#475569",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontWeight: 600,
  },
  main: {
    flex: 1,
    padding: "32px",
    overflowY: "auto",
  },
  loaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#f8fafc",
  },
};

const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div style={S.loaderContainer}>
        <div style={{ color: "#64748b", fontSize: "16px", fontWeight: 500 }}>Checking authorization...</div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div style={S.root}>
      {/* Sidebar */}
      <aside style={S.sidebar}>
        <Link href="/admin/users" style={S.logoContainer}>
          Sikshya Admin
        </Link>
        <nav style={S.nav}>
          <Link href="/admin/users" style={{ ...S.navItem, ...S.navItemActive }}>
            <IconUsers />
            User Management
          </Link>
          {/* Add more nav items here in the future */}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={S.content}>
        {/* Header */}
        <header style={S.header}>
          <div style={S.headerTitle}>Dashboard</div>
          <div style={S.userInfo}>
            <span style={S.userName}>{user.fullName}</span>
            <div style={S.avatar}>{getInitials(user.fullName)}</div>
          </div>
        </header>

        {/* Page Content */}
        <main style={S.main}>{children}</main>
      </div>
    </div>
  );
}
