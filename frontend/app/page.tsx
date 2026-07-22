"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import LandingPage from "@/app/_views/LandingPage";
import { useUser } from "@/lib/context/UserContext";

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // If user is logged in, they'll be redirected above — show nothing while redirecting
  if (user) return null;

  return <LandingPage />;
}