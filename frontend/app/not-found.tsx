"use client";

import React from "react";
import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "120px",
          height: "120px",
          background: "var(--color-primary-light)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <Search size={56} color="var(--color-primary)" />
      </div>

      <h1
        style={{
          fontSize: "clamp(2rem, 5vw, 4rem)",
          fontWeight: 900,
          color: "var(--color-text)",
          lineHeight: 1,
          marginBottom: "1rem",
          letterSpacing: "-0.02em",
        }}
      >
        404
      </h1>
      
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "var(--color-text)",
          marginBottom: "1rem",
        }}
      >
        Page not found
      </h2>

      <p
        style={{
          fontSize: "1rem",
          color: "var(--color-text-muted)",
          maxWidth: "400px",
          margin: "0 auto 2.5rem",
          lineHeight: 1.6,
        }}
      >
        Oops! The page you are looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
          <Home size={18} />
          Back to Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="btn-outline"
          style={{ padding: "0.75rem 1.5rem" }}
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    </div>
  );
}
