"use client";

import React, { useEffect, useState } from "react";
import { getAdminRequestsAction, verifyAdminAction, deleteAdminUserAction } from "@/lib/actions/admin-actions";
import { Check, X, Loader2, AlertCircle, ShieldAlert } from "lucide-react";

const S: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "1000px",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    margin: 0,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "16px",
    borderBottom: "1px solid #e2e8f0",
    color: "#64748b",
    fontWeight: 600,
    fontSize: "14px",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "15px",
  },
  actionCell: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  approveBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  declineBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "64px 0",
    color: "#94a3b8",
  },
  alertSuccess: {
    padding: "16px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    color: "#166534",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  alertError: {
    padding: "16px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#b91c1c",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "48px 0",
  },
};

type AdminRequest = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    const res = await getAdminRequestsAction();
    if (res.success) {
      setRequests(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    setStatus(null);
    const res = await verifyAdminAction(id);
    if (res.success) {
      setStatus({ type: "success", message: "Admin verified successfully." });
      setRequests(requests.filter(req => req.id !== id));
    } else {
      setStatus({ type: "error", message: res.message || "Failed to verify admin." });
    }
    setActionLoading(null);
  };

  const handleDecline = async (id: string) => {
    if (!confirm("Are you sure you want to decline and delete this request?")) return;
    
    setActionLoading(id);
    setStatus(null);
    const res = await deleteAdminUserAction(id);
    if (res.success) {
      setStatus({ type: "success", message: "Admin request declined and user removed." });
      setRequests(requests.filter(req => req.id !== id));
    } else {
      setStatus({ type: "error", message: res.message || "Failed to decline request." });
    }
    setActionLoading(null);
  };

  return (
    <div style={S.container}>
      <div style={S.header}>
        <h1 style={S.title}>Admin Requests</h1>
        <p style={S.subtitle}>Review and approve new administrator registrations.</p>
      </div>

      {status?.type === "success" && (
        <div style={S.alertSuccess}>
          <Check size={20} />
          <span style={{ fontWeight: 500 }}>{status.message}</span>
        </div>
      )}
      {status?.type === "error" && (
        <div style={S.alertError}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: 500 }}>{status.message}</span>
        </div>
      )}

      <div style={S.card}>
        {loading ? (
          <div style={S.loaderContainer}>
            <Loader2 size={32} color="#3b82f6" className="animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div style={S.emptyState}>
            <ShieldAlert size={48} style={{ marginBottom: "16px", color: "#cbd5e1" }} />
            <h3 style={{ margin: "0 0 8px 0", color: "#64748b" }}>No pending requests</h3>
            <p style={{ margin: 0, fontSize: "14px" }}>There are currently no new administrator registrations awaiting approval.</p>
          </div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Name</th>
                <th style={S.th}>Email</th>
                <th style={S.th}>Requested On</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td style={{ ...S.td, fontWeight: 500 }}>{req.fullName}</td>
                  <td style={S.td}>{req.email}</td>
                  <td style={S.td}>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td style={S.td}>
                    <div style={S.actionCell}>
                      <button 
                        onClick={() => handleApprove(req.id)}
                        style={{ ...S.approveBtn, opacity: actionLoading === req.id ? 0.7 : 1 }}
                        disabled={actionLoading === req.id}
                      >
                        {actionLoading === req.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        Approve
                      </button>
                      <button 
                        onClick={() => handleDecline(req.id)}
                        style={{ ...S.declineBtn, opacity: actionLoading === req.id ? 0.7 : 1 }}
                        disabled={actionLoading === req.id}
                      >
                        {actionLoading === req.id ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                        Decline
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
