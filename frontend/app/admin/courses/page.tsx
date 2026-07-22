"use client";

import React, { useState, useEffect } from "react";
import { getAdminCoursesAction } from "@/lib/actions/admin-actions";
import { Search, Loader2, AlertCircle, BookOpen, Trash2, Eye } from "lucide-react";
import Link from "next/link";

const S: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    overflow: "hidden",
  },
  header: {
    padding: "24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
  },
  toolbar: {
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  searchContainer: {
    position: "relative",
    width: "300px",
  },
  searchInput: {
    width: "100%",
    padding: "10px 10px 10px 36px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  searchIcon: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
  },
  tableWrapper: {
    overflowX: "auto",
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
  actionBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    color: "#64748b",
    borderRadius: "4px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    marginRight: "8px",
  },
  badgeSuccess: { backgroundColor: "#dcfce3", color: "#166534", padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: 500 },
  badgePending: { backgroundColor: "#fef08a", color: "#854d0e", padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: 500 },
  emptyState: {
    padding: "48px",
    textAlign: "center",
    color: "#64748b",
  },
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    // Fetch all courses across all tutors for admin view
    const res = await getAdminCoursesAction();
    if (res.success && res.data) {
      setCourses(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={S.container}>
      <div style={S.header}>
        <h1 style={S.title}>Course Management</h1>
      </div>

      <div style={S.toolbar}>
        <div style={S.searchContainer}>
          <Search size={18} style={S.searchIcon} />
          <input
            type="text"
            placeholder="Search courses..."
            style={S.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Course Title</th>
              <th style={S.th}>Price</th>
              <th style={S.th}>Duration</th>
              <th style={S.th}>Status</th>
              <th style={{ ...S.th, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: "48px", textAlign: "center" }}>
                  <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto", color: "#3b82f6" }} />
                </td>
              </tr>
            ) : filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={5} style={S.emptyState}>
                  <BookOpen size={48} style={{ margin: "0 auto 16px", color: "#94a3b8" }} />
                  <p>No courses found.</p>
                </td>
              </tr>
            ) : (
              filteredCourses.map((c) => (
                <tr key={c.id}>
                  <td style={S.td}>
                    <div style={{ fontWeight: 500 }}>{c.title}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{c.category}</div>
                  </td>
                  <td style={S.td}>${c.price}</td>
                  <td style={S.td}>{c.duration} {c.durationUnit}</td>
                  <td style={S.td}>
                    {c.isPublished ? (
                      <span style={S.badgeSuccess}>Published</span>
                    ) : (
                      <span style={S.badgePending}>Draft</span>
                    )}
                  </td>
                  <td style={{ ...S.td, textAlign: "right" }}>
                    <Link href={`/admin/courses/${c.id}`} style={S.actionBtn} title="View Course">
                      <Eye size={16} />
                    </Link>
                    <button style={{ ...S.actionBtn, color: "#ef4444" }} title="Delete Course">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
