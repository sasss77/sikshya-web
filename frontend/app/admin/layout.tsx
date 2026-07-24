"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/lib/context/UserContext";
import { logoutAction } from "@/lib/actions/auth-action";
import { GraduationCap, Presentation, BookOpen } from "lucide-react";

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

const IconDashboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9"></rect>
    <rect x="14" y="3" width="7" height="5"></rect>
    <rect x="14" y="12" width="7" height="9"></rect>
    <rect x="3" y="16" width="7" height="5"></rect>
  </svg>
);

const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, refreshUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutAction();
    await refreshUser();
    router.push("/login");
  };

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

  // Admin pending approval screen
  if (!user.isVerifiedAdmin) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f8fafc", flexDirection: "column", gap: "24px", padding: "32px" }}>
        <div style={{ maxWidth: "480px", width: "100%", backgroundColor: "#fff", borderRadius: "20px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "48px 40px", textAlign: "center" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>Admin Approval Pending</h1>
          <p style={{ color: "#64748b", fontSize: "15px", lineHeight: 1.6, marginBottom: "32px" }}>
            Your admin request has been submitted. The default admin needs to approve your account before you can access the admin dashboard. You&apos;ll be notified once approved.
          </p>
          <button
            onClick={async () => { await logoutAction(); await refreshUser(); router.push("/login"); }}
            style={{ padding: "12px 28px", backgroundColor: "#1B3C72", color: "#fff", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" }}
          >
            Back to Login
          </button>
        </div>
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
        <Link href="/admin" style={S.logoContainer}>
          Sikshya Admin
        </Link>
        <nav style={S.nav}>
          <Link href="/admin" style={{ ...S.navItem, ...(pathname === "/admin" ? S.navItemActive : {}) }}>
            <IconDashboard />
            Dashboard
          </Link>
          <Link href="/admin/users" style={{ ...S.navItem, ...(pathname?.includes("/admin/users") ? S.navItemActive : {}) }}>
            <IconUsers />
            User Management
          </Link>
          <Link href="/admin/students" style={{ ...S.navItem, ...(pathname?.includes("/admin/students") ? S.navItemActive : {}) }}>
            <GraduationCap size={20} />
            Students
          </Link>
          <Link href="/admin/tutors" style={{ ...S.navItem, ...(pathname?.includes("/admin/tutors") ? S.navItemActive : {}) }}>
            <Presentation size={20} />
            Tutors
          </Link>
          <Link href="/admin/courses" style={{ ...S.navItem, ...(pathname?.includes("/admin/courses") ? S.navItemActive : {}) }}>
            <BookOpen size={20} />
            Courses
          </Link>
          <Link href="/admin/requests" style={{ ...S.navItem, ...(pathname?.includes("/admin/requests") ? S.navItemActive : {}) }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
            Requests
          </Link>
          <Link href="/admin/notifications" style={{ ...S.navItem, ...(pathname?.includes("/admin/notifications") ? S.navItemActive : {}) }}>
            <IconBell />
            Notices
          </Link>
        </nav>

        {/* Logout Section */}
        <div style={{ padding: "24px", borderTop: "1px solid #334155" }}>
          <button
            onClick={handleLogout}
            style={{
              ...S.navItem,
              width: "100%",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#ef4444",
              display: "flex",
              justifyContent: "flex-start",
              padding: "12px 16px",
              marginTop: "auto"
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
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
