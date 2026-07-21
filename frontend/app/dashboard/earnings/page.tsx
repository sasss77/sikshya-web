"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import {
  Wallet,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Download,
  Building,
} from "lucide-react";

/* ─── Dummy Data ─────────────────────────────────────── */
const EARNINGS_STATS = {
  totalEarned: 45000,
  availableBalance: 12500,
  pendingClearance: 3200,
  thisMonth: 8500,
  lastMonth: 7200,
};

const WITHDRAWAL_HISTORY = [
  { id: "W-8921", date: "Jul 10, 2026", amount: 15000, method: "Bank Transfer", status: "completed" },
  { id: "W-8810", date: "Jun 28, 2026", amount: 8000, method: "eSewa", status: "completed" },
  { id: "W-8705", date: "Jun 15, 2026", amount: 5500, method: "Bank Transfer", status: "completed" },
];

const RECENT_TRANSACTIONS = [
  { id: "TR-1029", student: "Rajan Thapa", subject: "Engineering Physics", amount: 800, date: "Today, 10:30 AM", status: "cleared" },
  { id: "TR-1028", student: "Sima Karki", subject: "Engineering Physics", amount: 800, date: "Yesterday", status: "cleared" },
  { id: "TR-1027", student: "Anish Shrestha", subject: "Mathematics", amount: 1200, date: "Jul 12, 2026", status: "cleared" },
  { id: "TR-1026", student: "Priya Sharma", subject: "Chemistry", amount: 600, date: "Jul 10, 2026", status: "pending" },
];

const CHART_DATA = [
  { month: "Feb", amount: 4200 },
  { month: "Mar", amount: 5800 },
  { month: "Apr", amount: 6500 },
  { month: "May", amount: 8200 },
  { month: "Jun", amount: 7200 },
  { month: "Jul", amount: 8500 }, // Current month
];

/* ─── Main Component ─────────────────────────────────── */
export default function EarningsPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== "tutor")) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    if (!amount || amount <= 0) {
      showToast("Enter a valid amount", "error");
      return;
    }
    if (amount > EARNINGS_STATS.availableBalance) {
      showToast("Insufficient balance", "error");
      return;
    }
    showToast("Withdrawal requested successfully!");
    setShowWithdrawModal(false);
    setWithdrawAmount("");
  };

  const maxChartValue = Math.max(...CHART_DATA.map(d => d.amount));

  return (
    <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)", paddingBottom: "3rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Page Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Wallet size={20} color="#fff" />
              </div>
              <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 900, color: "#1a202c", margin: 0, letterSpacing: "-0.02em" }}>
                Earnings
              </h1>
            </div>
            <p style={{ fontSize: "0.95rem", color: "#64748b", margin: 0 }}>
              Track your revenue, request payouts, and view transaction history.
            </p>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: "12px", padding: "0.75rem 1.5rem", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(16,185,129,0.25)", transition: "transform 0.15s, box-shadow 0.15s" }}
            className="withdraw-btn"
          >
            Withdraw Funds
          </button>
        </div>

        {/* Top Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
          {/* Available Balance */}
          <div style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)", borderRadius: "20px", padding: "1.75rem", color: "#fff", boxShadow: "0 10px 25px rgba(15,23,42,0.15)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)", borderRadius: "50%" }} />
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <CheckCircle2 size={16} color="#10b981" /> Available Balance
            </p>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900, margin: "0 0 0.25rem", letterSpacing: "-0.03em", color: "#fff" }}>
              Rs. {EARNINGS_STATS.availableBalance.toLocaleString()}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>
              Ready to withdraw
            </p>
          </div>

          {/* Pending Clearance */}
          <div style={{ background: "#fff", borderRadius: "20px", padding: "1.75rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Clock size={16} color="#f59e0b" /> Pending Clearance
            </p>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.25rem", letterSpacing: "-0.03em" }}>
              Rs. {EARNINGS_STATS.pendingClearance.toLocaleString()}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: 0 }}>
              Clears in 3-5 business days
            </p>
          </div>

          {/* This Month */}
          <div style={{ background: "#fff", borderRadius: "20px", padding: "1.75rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <TrendingUp size={16} color="#0ea5e9" /> Earned This Month
            </p>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.25rem", letterSpacing: "-0.03em" }}>
              Rs. {EARNINGS_STATS.thisMonth.toLocaleString()}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, background: "#dcfce7", color: "#16a34a", padding: "0.2rem 0.5rem", borderRadius: "999px", display: "flex", alignItems: "center", gap: "0.15rem" }}>
                <ArrowUpRight size={12} /> 18%
              </span>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>vs last month</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.5rem" }}>

          {/* Main Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Earnings Chart (CSS based for simplicity & aesthetics) */}
            <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "1.5rem 1.75rem", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a202c", margin: 0 }}>Earnings Overview</h3>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, margin: "0 0 0.2rem" }}>Total Earned</p>
                  <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "#10b981", margin: 0 }}>Rs. {EARNINGS_STATS.totalEarned.toLocaleString()}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "180px", gap: "1rem" }}>
                {CHART_DATA.map((data, i) => {
                  const heightPercent = (data.amount / maxChartValue) * 100;
                  const isCurrentMonth = i === CHART_DATA.length - 1;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", flex: 1 }} className="group chart-bar-group">
                      <div style={{
                        position: "relative", width: "100%", maxWidth: "48px", height: "140px",
                        background: "#f8fafc", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "flex-end"
                      }}>
                        <div style={{
                          width: "100%", height: `${heightPercent}%`,
                          background: isCurrentMonth ? "linear-gradient(to top, #0ea5e9, #38bdf8)" : "linear-gradient(to top, #cbd5e0, #e2e8f0)",
                          borderRadius: "8px", transition: "height 1s cubic-bezier(0.16, 1, 0.3, 1)"
                        }} className="chart-fill" />

                        {/* Tooltip removed */}
                      </div>
                      <span style={{ fontSize: "0.8rem", fontWeight: isCurrentMonth ? 700 : 600, color: isCurrentMonth ? "#0ea5e9" : "#64748b" }}>
                        {data.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Transactions */}
            <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
              <div style={{ padding: "1.5rem 1.75rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a202c", margin: 0 }}>Recent Transactions</h3>
                <button style={{ background: "none", border: "none", color: "#0B4085", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Download size={14} /> Export CSV
                </button>
              </div>
              <div>
                {RECENT_TRANSACTIONS.map((tr, i) => (
                  <div key={tr.id} style={{ padding: "1.25rem 1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: i < RECENT_TRANSACTIONS.length - 1 ? "1px solid #f8fafc" : "none", transition: "background 0.2s" }} className="transaction-row">
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ArrowDownRight size={20} />
                      </div>
                      <div>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.1rem" }}>{tr.student}</p>
                        <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>{tr.subject} · {tr.date}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.2rem" }}>+ Rs. {tr.amount}</p>
                      {tr.status === "cleared" ? (
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, background: "#dcfce7", color: "#16a34a", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>Cleared</span>
                      ) : (
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, background: "#fef3c7", color: "#d97706", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Withdrawal History */}
            <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "1.5rem 1.75rem", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1a202c", margin: "0 0 1.25rem" }}>Withdrawal History</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {WITHDRAWAL_HISTORY.map((w) => (
                  <div key={w.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", background: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                    <div>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.1rem" }}>Rs. {w.amount}</p>
                      <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>{w.method} · {w.date}</p>
                    </div>
                    <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CheckCircle2 size={14} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Box */}
            {/* <div style={{ background: "linear-gradient(135deg, #0ea5e9, #2563eb)", borderRadius: "20px", padding: "1.5rem", color: "#fff", boxShadow: "0 10px 25px rgba(37,99,235,0.2)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.5rem" }}>Need Help?</h3>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.9)", margin: "0 0 1.25rem", lineHeight: 1.5 }}>
                Having issues with your payouts or missing transactions? Contact our support team.
              </p>
              <button style={{ width: "100%", background: "#fff", color: "#2563eb", border: "none", borderRadius: "10px", padding: "0.75rem", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                Contact Support
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", padding: "1rem"
        }}>
          <div style={{
            background: "#fff", borderRadius: "20px", padding: "2rem",
            width: "100%", maxWidth: "440px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            animation: "modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.5rem" }}>Withdraw Funds</h3>
            <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0 0 1.5rem" }}>
              Available balance: <strong style={{ color: "#10b981" }}>Rs. {EARNINGS_STATS.availableBalance.toLocaleString()}</strong>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", marginBottom: "0.4rem", display: "block" }}>Amount (Rs.)</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#64748b", fontWeight: 600 }}>Rs.</span>
                  <input
                    type="number"
                    value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "12px", border: "2px solid #e2e8f0", fontSize: "1rem", fontWeight: 600, outline: "none", color: "#1a202c", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", marginBottom: "0.4rem", display: "block" }}>Withdrawal Method</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div
                    onClick={() => setWithdrawMethod("bank")}
                    style={{ border: withdrawMethod === "bank" ? "2px solid #10b981" : "2px solid #e2e8f0", background: withdrawMethod === "bank" ? "#ecfdf5" : "#fff", padding: "1rem", borderRadius: "12px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "0.5rem", transition: "all 0.2s" }}
                  >
                    <Building size={20} color={withdrawMethod === "bank" ? "#10b981" : "#94a3b8"} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: withdrawMethod === "bank" ? "#10b981" : "#475569" }}>Bank Transfer</span>
                  </div>
                  <div
                    onClick={() => setWithdrawMethod("wallet")}
                    style={{ border: withdrawMethod === "wallet" ? "2px solid #10b981" : "2px solid #e2e8f0", background: withdrawMethod === "wallet" ? "#ecfdf5" : "#fff", padding: "1rem", borderRadius: "12px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "0.5rem", transition: "all 0.2s" }}
                  >
                    <Wallet size={20} color={withdrawMethod === "wallet" ? "#10b981" : "#94a3b8"} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: withdrawMethod === "wallet" ? "#10b981" : "#475569" }}>Digital Wallet</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button onClick={() => setShowWithdrawModal(false)} style={{ flex: 1, padding: "0.85rem", borderRadius: "12px", border: "2px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s ease" }} className="modal-cancel-btn">Cancel</button>
                <button onClick={handleWithdraw} style={{ flex: 1, padding: "0.85rem", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s ease", boxShadow: "0 4px 15px rgba(16,185,129,0.25)" }} className="modal-action-btn">Request Payout</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: "5rem", right: "2rem", zIndex: 1000,
          background: toast.type === "success" ? "#22c55e" : "#ef4444",
          color: "#fff", padding: "1rem 1.5rem", borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          display: "flex", alignItems: "center", gap: "0.75rem",
          fontWeight: 600, fontSize: "0.95rem",
          animation: "toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastSlideIn { from { opacity: 0; transform: translateY(-20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .withdraw-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16,185,129,0.35) !important; }

        .transaction-row:hover { background: #f8fafc !important; }
        .modal-cancel-btn:hover { background: #f1f5f9 !important; }
        .modal-action-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(16,185,129,0.35) !important; }
        /* Hide number input arrows */
        input[type="number"]::-webkit-inner-spin-button, 
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}

