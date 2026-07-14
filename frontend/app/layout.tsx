import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/lib/context/UserContext";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import AIChatbot from "@/app/_components/AIChatbot";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sikshya – Peer-to-Peer Tutoring Marketplace",
  description:
    "Connect with high-achieving peers who understand your curriculum. Find your perfect tutor for SLC, SEE, and +2 courses across Nepal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body
        style={{
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <UserProvider>
          <Header />
          <div style={{ flex: 1 }}>{children}</div>
          <Footer />
          <AIChatbot />
        </UserProvider>
      </body>
    </html>
  );
}