"use client";

import React, { useEffect, useState } from "react";
import { getAdminStatsAction } from "@/lib/actions/admin-actions";
import { Users, GraduationCap, Presentation, ShieldCheck, UserPlus, Loader2, AlertCircle } from "lucide-react";

const S: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  iconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statInfo: {
    display: "flex",
    flexDirection: "column",
  },
  statLabel: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: 500,
  },
  statValue: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    overflow: "hidden",
  },
  sectionHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    padding: "16px 24px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  },
  td: {
    padding: "16px 24px",
    fontSize: "14px",
    color: "#334155",
    borderBottom: "1px solid #e2e8f0",
  },
  badgeAdmin: { backgroundColor: "#fef08a", color: "#854d0e", padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: 500 },
  badgeStudent: { backgroundColor: "#dbeafe", color: "#1e40af", padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: 500 },
  badgeTutor: { backgroundColor: "#dcfce3", color: "#166534", padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: 500 },
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const res = await getAdminStatsAction();
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        setError(res.message);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const getRoleBadge = (role: string) => {
    if (role === "admin") return <span style={S.badgeAdmin}>Admin</span>;
    if (role === "tutor") return <span style={S.badgeTutor}>Tutor</span>;
    return <span style={S.badgeStudent}>Student</span>;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Loader2 size={40} className="animate-spin" style={{ color: "#3b82f6" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
        <AlertCircle size={24} />
        <span style={{ fontSize: "16px", fontWeight: 500 }}>{error}</span>
      </div>
    );
  }

  return (
    <div style={S.container}>
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <div style={{ ...S.iconBox, backgroundColor: "#eff6ff", color: "#3b82f6" }}>
            <Users size={24} />
          </div>
          <div style={S.statInfo}>
            <span style={S.statLabel}>Total Users</span>
            <h3 style={S.statValue}>{stats?.totalUsers || 0}</h3>
          </div>
        </div>

        <div style={S.statCard}>
          <div style={{ ...S.iconBox, backgroundColor: "#f0fdf4", color: "#22c55e" }}>
            <GraduationCap size={24} />
          </div>
          <div style={S.statInfo}>
            <span style={S.statLabel}>Students</span>
            <h3 style={S.statValue}>{stats?.totalStudents || 0}</h3>
          </div>
        </div>

        <div style={S.statCard}>
          <div style={{ ...S.iconBox, backgroundColor: "#fef2f2", color: "#ef4444" }}>
            <Presentation size={24} />
          </div>
          <div style={S.statInfo}>
            <span style={S.statLabel}>Tutors</span>
            <h3 style={S.statValue}>{stats?.totalTutors || 0}</h3>
          </div>
        </div>

        <div style={S.statCard}>
          <div style={{ ...S.iconBox, backgroundColor: "#fef3c7", color: "#f59e0b" }}>
            <ShieldCheck size={24} />
          </div>
          <div style={S.statInfo}>
            <span style={S.statLabel}>Admins</span>
            <h3 style={S.statValue}>{stats?.totalAdmins || 0}</h3>
          </div>
        </div>

        <div style={S.statCard}>
          <div style={{ ...S.iconBox, backgroundColor: "#f3e8ff", color: "#a855f7" }}>
            <UserPlus size={24} />
          </div>
          <div style={S.statInfo}>
            <span style={S.statLabel}>New Users (30d)</span>
            <h3 style={S.statValue}>{stats?.newUsersThisMonth || 0}</h3>
          </div>
        </div>
      </div>

      {/* Recent Users Section */}
      <div style={S.section}>
        <div style={S.sectionHeader}>
          <h2 style={S.sectionTitle}>Recent Registrations</h2>
        </div>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Name</th>
              <th style={S.th}>Email</th>
              <th style={S.th}>Role</th>
              <th style={S.th}>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentUsers?.map((u: any) => (
              <tr key={u.id}>
                <td style={S.td}>
                  <div style={{ fontWeight: 500 }}>{u.fullName}</div>
                </td>
                <td style={S.td}>{u.email}</td>
                <td style={S.td}>{getRoleBadge(u.role)}</td>
                <td style={S.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
              <tr>
                <td colSpan={4} style={{ padding: "48px", textAlign: "center", color: "#64748b" }}>
                  No recent registrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
