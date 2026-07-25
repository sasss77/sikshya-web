"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import {
  Wallet,
  TrendingUp,
  Clock,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { fetchTutorBookingsAction } from "@/lib/actions/booking-action";

// 1 USD → NPR conversion rate (same as backend)
const USD_TO_NPR = 134;

const toNPR = (usd: number) => Math.round(usd * USD_TO_NPR);

const formatNPR = (npr: number) =>
  "Rs. " + npr.toLocaleString("en-NP");

/* ─── Main Component ─────────────────────────────────── */
export default function EarningsPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [stats, setStats] = useState({
    totalEarnedNPR: 0,
    totalEarnedUSD: 0,
    pendingClearanceNPR: 0,
    completedCount: 0,
    pendingCount: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "tutor")) {
      router.replace("/login");
      return;
    }

    if (user?.role === "tutor") {
      fetchTutorBookingsAction().then((res) => {
        if (res.success && res.data) {
          const completed = res.data.filter(
            (b: any) => b.status === "completed" && b.paymentStatus === "paid"
          );
          const pending = res.data.filter(
            (b: any) => b.status === "upcoming" && b.paymentStatus === "paid"
          );

          // Use priceUSD (Stripe-charged amount) to derive NPR equivalent
          const totalEarnedUSD = completed.reduce(
            (sum: number, b: any) => sum + (b.priceUSD || 0),
            0
          );
          const pendingUSD = pending.reduce(
            (sum: number, b: any) => sum + (b.priceUSD || 0),
            0
          );

          setStats({
            totalEarnedNPR: toNPR(totalEarnedUSD),
            totalEarnedUSD,
            pendingClearanceNPR: toNPR(pendingUSD),
            completedCount: completed.length,
            pendingCount: pending.length,
          });

          // Build recent transactions from ALL completed bookings (newest first)
          const mapped = [...completed]
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((b: any) => ({
              id: b.id,
              student: b.studentName || "Student",
              subject: b.subject,
              amountUSD: b.priceUSD || 0,
              amountNPR: toNPR(b.priceUSD || 0),
              date: new Date(b.createdAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              }),
              status: "cleared",
            }));

          setTransactions(mapped);
        }
        setFetchingData(false);
      });
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  const avgPerSession =
    stats.completedCount > 0
      ? Math.round(stats.totalEarnedNPR / stats.completedCount)
      : 0;

  return (
    <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)", paddingBottom: "3rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Page Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wallet size={20} color="#fff" />
            </div>
            <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 900, color: "#1a202c", margin: 0, letterSpacing: "-0.02em" }}>
              Earnings
            </h1>
          </div>
          <p style={{ fontSize: "0.95rem", color: "#64748b", margin: 0 }}>
            Track your revenue and session history.
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>

          {/* Total Earned */}
          <div style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)", borderRadius: "20px", padding: "1.75rem", color: "#fff", boxShadow: "0 10px 25px rgba(15,23,42,0.15)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)", borderRadius: "50%" }} />
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <CheckCircle2 size={16} color="#10b981" /> Total Earned
            </p>
            {fetchingData ? (
              <div style={{ width: "120px", height: "36px", background: "rgba(255,255,255,0.1)", borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
            ) : (
              <>
                <h2 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 0.2rem", letterSpacing: "-0.03em", color: "#fff" }}>
                  {formatNPR(stats.totalEarnedNPR)}
                </h2>
                <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <DollarSign size={12} /> ${stats.totalEarnedUSD.toFixed(2)} USD received via Stripe
                </p>
              </>
            )}
          </div>

          {/* Pending Clearance */}
          <div style={{ background: "#fff", borderRadius: "20px", padding: "1.75rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Clock size={16} color="#f59e0b" /> Pending Clearance
            </p>
            {fetchingData ? (
              <div style={{ width: "100px", height: "36px", background: "#f1f5f9", borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
            ) : (
              <>
                <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.2rem", letterSpacing: "-0.03em" }}>
                  {formatNPR(stats.pendingClearanceNPR)}
                </h2>
                <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: 0 }}>
                  {stats.pendingCount} session{stats.pendingCount !== 1 ? "s" : ""} in progress
                </p>
              </>
            )}
          </div>

          {/* Avg per Session */}
          <div style={{ background: "#fff", borderRadius: "20px", padding: "1.75rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <TrendingUp size={16} color="#0ea5e9" /> Avg. per Session
            </p>
            {fetchingData ? (
              <div style={{ width: "100px", height: "36px", background: "#f1f5f9", borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
            ) : (
              <>
                <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.2rem", letterSpacing: "-0.03em" }}>
                  {formatNPR(avgPerSession)}
                </h2>
                <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: 0 }}>
                  Over {stats.completedCount} completed session{stats.completedCount !== 1 ? "s" : ""}
                </p>
              </>
            )}
          </div>

        </div>

        {/* Recent Transactions */}
        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
          <div style={{ padding: "1.5rem 1.75rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a202c", margin: 0 }}>Session Earnings</h3>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 500 }}>
              Amounts shown in NPR (1 USD = Rs. {USD_TO_NPR})
            </span>
          </div>

          {fetchingData ? (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#10b981", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
            </div>
          ) : transactions.length === 0 ? (
            <div style={{ padding: "4rem", textAlign: "center" }}>
              <Wallet size={48} color="#e2e8f0" style={{ margin: "0 auto 1rem" }} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.5rem" }}>No earnings yet</h3>
              <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>
                Your completed and paid sessions will appear here.
              </p>
            </div>
          ) : (
            <div>
              {transactions.map((tr, i) => (
                <div
                  key={tr.id}
                  className="transaction-row"
                  style={{
                    padding: "1.25rem 1.75rem",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    borderBottom: i < transactions.length - 1 ? "1px solid #f8fafc" : "none",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <ArrowDownRight size={20} />
                    </div>
                    <div>
                      <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.1rem" }}>{tr.student}</p>
                      <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>{tr.subject} · {tr.date}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "1.05rem", fontWeight: 800, color: "#16a34a", margin: "0 0 0.15rem" }}>
                      + {formatNPR(tr.amountNPR)}
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "#94a3b8", margin: "0 0 0.2rem" }}>
                      ${tr.amountUSD.toFixed(2)} USD
                    </p>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, background: "#dcfce7", color: "#16a34a", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                      Cleared
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

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
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes toastSlideIn { from { opacity: 0; transform: translateY(-20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .transaction-row:hover { background: #f8fafc !important; }
      `}</style>
    </div>
  );
}
