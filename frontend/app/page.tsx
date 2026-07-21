"use client";

import React from "react";
import LandingPage from "@/app/_views/LandingPage";
import { useUser } from "@/lib/context/UserContext";

export default function Home() {
  const { loading } = useUser();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-black dark:border-zinc-700 dark:border-t-white" />
      </div>
    );
  }

  return <LandingPage />;
}