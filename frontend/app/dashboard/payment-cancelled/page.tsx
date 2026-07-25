"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { XCircle, RefreshCw, Search } from "lucide-react";

export default function PaymentCancelledPage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fff7f7 0%, #fee2e2 50%, #fecaca 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "24px",
        width: "100%",
        maxWidth: "480px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.10)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #dc2626, #b91c1c)",
          padding: "2.5rem 2rem",
          textAlign: "center",
        }}>
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
          }}>
            <XCircle size={48} color="#fff" strokeWidth={2.5} />
          </div>
          <h1 style={{ color: "#fff", fontSize: "1.75rem", fontWeight: 900, margin: "0 0 0.4rem" }}>
            Payment Cancelled
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", margin: 0 }}>
            No charges were made to your card.
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "2rem" }}>
          <div style={{
            background: "#fef3c7",
            border: "1px solid #fde68a",
            borderRadius: "12px",
            padding: "1.1rem 1.25rem",
            marginBottom: "1.75rem",
          }}>
            <p style={{ color: "#92400e", fontSize: "0.875rem", margin: 0, fontWeight: 500, lineHeight: 1.6 }}>
              💡 You closed the payment page before completing checkout. Your booking was not created and <strong>no money was charged</strong>.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button
              onClick={() => router.back()}
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
              }}
            >
              <RefreshCw size={18} /> Try Again
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <Search size={16} /> Browse Tutors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
