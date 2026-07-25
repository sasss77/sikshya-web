"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getAdminReportsAction, updateReportStatusAction } from "@/lib/actions/report-actions";
import { Search, Loader2, AlertCircle, Eye, X, ChevronLeft, ChevronRight, Filter } from "lucide-react";

type Report = {
  _id: string;
  reporterId: { _id: string; fullName: string; email: string; role: string };
  reportedUserId: { _id: string; fullName: string; email: string; role: string };
  reason: string;
  details?: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: string;
};

type Meta = {
  page: number;
  total: number;
  totalPages: number;
};

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
  },
  badgePending: { backgroundColor: "#fef08a", color: "#854d0e", padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: 500 },
  badgeReviewed: { backgroundColor: "#e0e7ff", color: "#4338ca", padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: 500 },
  badgeResolved: { backgroundColor: "#dcfce3", color: "#166534", padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: 500 },
  pagination: {
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #e2e8f0",
  },
  pageControls: { display: "flex", gap: "8px" },
  pageBtn: { background: "#fff", border: "1px solid #cbd5e1", borderRadius: "4px", padding: "6px", cursor: "pointer", display: "flex", alignItems: "center", color: "#334155" },
  emptyState: { padding: "48px", textAlign: "center", color: "#64748b" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
  modal: { backgroundColor: "#fff", borderRadius: "12px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" },
  modalHeader: { padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { fontSize: "18px", fontWeight: 600, color: "#0f172a", margin: 0 },
  modalBody: { padding: "24px" },
  modalFooter: { padding: "16px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "12px", backgroundColor: "#f8fafc", borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px" },
  btnGhost: { backgroundColor: "transparent", color: "#64748b", border: "1px solid #e2e8f0", padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: 500, cursor: "pointer" },
  select: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", backgroundColor: "#fff" },
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchReports = useCallback(async (p: number) => {
    setLoading(true);
    const res = await getAdminReportsAction({ page: p, limit: 10 });
    if (res.success && res.data) {
      setReports(res.data);
      setMeta(res.meta ?? null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReports(page);
  }, [page, fetchReports]);

  const handleStatusChange = async (reportId: string, newStatus: "pending" | "reviewed" | "resolved") => {
    setUpdatingStatus(true);
    const res = await updateReportStatusAction(reportId, newStatus);
    if (res.success) {
      setReports((prev) => prev.map((r) => r._id === reportId ? { ...r, status: newStatus } : r));
      if (viewingReport?._id === reportId) {
        setViewingReport({ ...viewingReport, status: newStatus });
      }
    } else {
      alert(res.message || "Failed to update status");
    }
    setUpdatingStatus(false);
  };

  const getStatusBadge = (status: string) => {
    if (status === "resolved") return <span style={S.badgeResolved}>Resolved</span>;
    if (status === "reviewed") return <span style={S.badgeReviewed}>Reviewed</span>;
    return <span style={S.badgePending}>Pending</span>;
  };

  return (
    <div style={S.container}>
      <div style={S.header}>
        <h1 style={S.title}>User Reports</h1>
      </div>

      <div style={S.toolbar}>
        <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>Manage and review reports submitted by users.</p>
      </div>

      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Reporter</th>
              <th style={S.th}>Reported User</th>
              <th style={S.th}>Reason</th>
              <th style={S.th}>Date</th>
              <th style={S.th}>Status</th>
              <th style={{ ...S.th, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: "48px", textAlign: "center" }}>
                  <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto", color: "#3b82f6" }} />
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={6} style={S.emptyState}>
                  <AlertCircle size={48} style={{ margin: "0 auto 16px", color: "#94a3b8" }} />
                  <p>No reports found.</p>
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r._id}>
                  <td style={S.td}>
                    <div style={{ fontWeight: 500 }}>{r.reporterId?.fullName}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{r.reporterId?.role}</div>
                  </td>
                  <td style={S.td}>
                    <div style={{ fontWeight: 500 }}>{r.reportedUserId?.fullName}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{r.reportedUserId?.role}</div>
                  </td>
                  <td style={S.td}>{r.reason}</td>
                  <td style={S.td}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td style={S.td}>{getStatusBadge(r.status)}</td>
                  <td style={{ ...S.td, textAlign: "right" }}>
                    <button style={S.actionBtn} onClick={() => setViewingReport(r)} title="View Details">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.total > 0 && (
        <div style={S.pagination}>
          <div style={{ fontSize: "14px", color: "#64748b" }}>
            Showing page {meta.page} of {meta.totalPages} ({meta.total} total reports)
          </div>
          <div style={S.pageControls}>
            <button style={{ ...S.pageBtn, opacity: page <= 1 ? 0.5 : 1 }} disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft size={16} />
            </button>
            <button style={{ ...S.pageBtn, opacity: page >= meta.totalPages ? 0.5 : 1 }} disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {viewingReport && (
        <div style={S.modalOverlay}>
          <div style={S.modal}>
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>Report Details</h2>
              <button onClick={() => setViewingReport(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>
            <div style={S.modalBody}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                <div>
                  <h4 style={{ margin: "0 0 8px", fontSize: "12px", textTransform: "uppercase", color: "#64748b" }}>Reporter</h4>
                  <p style={{ margin: 0, fontWeight: 500, color: "#0f172a" }}>{viewingReport.reporterId?.fullName}</p>
                  <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#64748b" }}>{viewingReport.reporterId?.email}</p>
                </div>
                <div>
                  <h4 style={{ margin: "0 0 8px", fontSize: "12px", textTransform: "uppercase", color: "#64748b" }}>Reported User</h4>
                  <p style={{ margin: 0, fontWeight: 500, color: "#0f172a" }}>{viewingReport.reportedUserId?.fullName}</p>
                  <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#64748b" }}>{viewingReport.reportedUserId?.email}</p>
                </div>
              </div>
              
              <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Reason: {viewingReport.reason}</h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {viewingReport.details || "No additional details provided."}
                </p>
              </div>

              <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
                <label style={{ fontSize: "14px", fontWeight: 500, color: "#334155" }}>Status:</label>
                <select 
                  style={S.select} 
                  value={viewingReport.status} 
                  onChange={(e) => handleStatusChange(viewingReport._id, e.target.value as any)}
                  disabled={updatingStatus}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
                {updatingStatus && <Loader2 size={16} className="animate-spin" color="#3b82f6" />}
              </div>
            </div>
            <div style={S.modalFooter}>
              <button style={S.btnGhost} onClick={() => setViewingReport(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
