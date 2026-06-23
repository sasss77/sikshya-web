"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 1. Check your auth status here (e.g., check localStorage, cookies, or an auth state)
    const isLoggedIn = localStorage.getItem("token"); // Example check

    if (isLoggedIn) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  // Return a clean loading state while the redirect resolves
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-black dark:border-zinc-700 dark:border-t-white" />
    </div>
  );
}