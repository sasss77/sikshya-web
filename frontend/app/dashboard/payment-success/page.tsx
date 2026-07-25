"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Calendar, Clock, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { getCheckoutSessionAction } from "@/lib/actions/payment-action";

interface SessionDetails {
  tutorName: string;
  subject: string;
  day: string;
  time: string;
  priceUSD: string;
  priceNPR: string;
  bookingId: string | null;
  paymentStatus: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [details, setDetails] = useState<SessionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found. Please check your bookings.");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      // Wait a moment so the webhook has time to process
      await new Promise(r => setTimeout(r, 2000));

      const res = await getCheckoutSessionAction(sessionId);
      if (res.success && res.data) {
        setDetails(res.data);
      } else {
        setError("Your payment was received but we could not load your booking details. Check your bookings page.");
      }
      setLoading(false);
    };

    fetchDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
      }}>
        <div style={{
          width: "64px", height: "64px",
          borderRadius: "50%",
          background: "#dcfce7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 0 16px rgba(22,163,74,0.1)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}>
          <Loader2 size={32} color="#16a34a" style={{ animation: "spin 1s linear infinite" }} />
        </div>
        <p style={{ fontSize: "1rem", fontWeight: 700, color: "#15803d" }}>Confirming your payment...</p>
        <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Please wait while we set up your booking.</p>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "24px",
        padding: "0",
        width: "100%",
        maxWidth: "520px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}>
        {/* Green success header */}
        <div style={{
          background: "linear-gradient(135deg, #16a34a, #15803d)",
          padding: "2.5rem 2rem",
          textAlign: "center",
        }}>
          {/* Animated checkmark */}
          <div style={{
            width: "88px",
            height: "88px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
            boxShadow: "0 0 0 16px rgba(255,255,255,0.1)",
            animation: "popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            <CheckCircle2 size={48} color="#fff" strokeWidth={2.5} />
          </div>
          <h1 style={{ color: "#fff", fontSize: "1.75rem", fontWeight: 900, margin: "0 0 0.4rem" }}>
            Payment Successful!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", margin: 0 }}>
            Your booking is confirmed. The tutor will be notified shortly.
          </p>
        </div>

        {/* Booking details */}
        <div style={{ padding: "2rem" }}>
          {error ? (
            <div style={{
              background: "#fef3c7",
              border: "1px solid #fde68a",
              borderRadius: "10px",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
            }}>
              <p style={{ color: "#92400e", fontSize: "0.875rem", margin: 0, fontWeight: 500 }}>{error}</p>
            </div>
          ) : details ? (
            <div style={{
              background: "#f8fafc",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              marginBottom: "1.5rem",
            }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #e2e8f0" }}>
                <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Booking Summary
                </p>
              </div>
              {[
                { icon: <BookOpen size={16} color="#0B4085" />, label: "Tutor", value: details.tutorName },
                { icon: <BookOpen size={16} color="#8b5cf6" />, label: "Subject", value: details.subject },
                { icon: <Calendar size={16} color="#16a34a" />, label: "Day", value: details.day },
                { icon: <Clock size={16} color="#f59e0b" />, label: "Time", value: details.time },
                { icon: <span style={{ fontSize: "14px" }}>💰</span>, label: "Paid", value: `$${details.priceUSD} USD (≈ Rs. ${details.priceNPR})` },
              ].map((row, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.85rem 1.25rem",
                  borderBottom: i < 4 ? "1px solid #f1f5f9" : "none",
                }}>
                  <div style={{ flexShrink: 0 }}>{row.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "0.72rem", color: "#94a3b8", fontWeight: 500 }}>{row.label}</p>
                    <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#1e293b" }}>{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* Status message */}
          <div style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "10px",
            padding: "0.85rem 1.25rem",
            marginBottom: "1.5rem",
          }}>
            <p style={{ color: "#1d4ed8", fontSize: "0.82rem", margin: 0, fontWeight: 600 }}>
              📋 Your booking is <strong>pending tutor acceptance</strong>. You will receive a notification once the tutor confirms your session.
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button
              onClick={() => router.push("/dashboard/bookings")}
              style={{
                background: "linear-gradient(135deg, #0B4085, #1e3a8a)",
                color: "#fff",
                border: "none",
                padding: "0.95rem 1.5rem",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 12px rgba(11,64,133,0.25)",
                transition: "transform 0.15s ease",
              }}
            >
              View My Bookings <ArrowRight size={18} />
            </button>
            <button
              onClick={() => router.push("/find-tutors")}
              style={{
                background: "none",
                color: "#64748b",
                border: "1.5px solid #e2e8f0",
                padding: "0.85rem 1.5rem",
                borderRadius: "12px",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Browse More Tutors
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
