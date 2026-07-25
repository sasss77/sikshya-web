"use client";

import { useEffect } from "react";

export default function ErrorSuppressor() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Suppress MetaMask connection errors which spam the console
      if (
        event.reason &&
        typeof event.reason.message === "string" &&
        event.reason.message.includes("Failed to connect to MetaMask")
      ) {
        event.preventDefault(); // Prevents it from printing to the console
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return <div style={{ display: "none" }} aria-hidden="true" data-error-suppressor="true" />;
}
