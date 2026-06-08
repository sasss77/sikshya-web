import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sikshya",
  description: "AI-Powered Peer Tutoring Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          backgroundColor: "#f0f2f5",
        }}
      >
        {children}
      </body>
    </html>
  );
}