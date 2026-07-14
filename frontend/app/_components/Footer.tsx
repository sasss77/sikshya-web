"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logoIcon from "@/app/assets/mortarboard.png";

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const PLATFORM_LINKS = [
  { label: "Find Tutors", href: "/find-tutors" },
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
];

export default function Footer() {
  const pathname = usePathname();
  const hideFooter = pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard/messages');

  if (hideFooter) return null;

  return (
    <footer style={{ background: "#0f172a", color: "#94a3b8", paddingTop: "3rem", paddingBottom: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>

        {/* Top Row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "2.5rem" }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.4rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", textDecoration: "none", marginBottom: "0.85rem" }}>
              <Image src={logoIcon} alt="Sikshya Logo" width={26} height={26} style={{ objectFit: "contain" }} />
              sikshya.
            </Link>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.7, maxWidth: "240px", margin: "0 0 1.25rem" }}>
              Nepal&apos;s peer-to-peer tutoring platform — connecting students with top tutors for academic excellence.
            </p>

          </div>

          {/* Company */}
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>Company</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {COMPANY_LINKS.map(link => (
                <Link key={link.href} href={link.href} style={{ fontSize: "0.875rem", color: "#94a3b8", textDecoration: "none" }} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>Legal</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {LEGAL_LINKS.map(link => (
                <Link key={link.href} href={link.href} style={{ fontSize: "0.875rem", color: "#94a3b8", textDecoration: "none" }} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>Platform</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {PLATFORM_LINKS.map(link => (
                <Link key={link.href} href={link.href} style={{ fontSize: "0.875rem", color: "#94a3b8", textDecoration: "none" }} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={{ fontSize: "0.8rem", margin: 0 }}>
            © {new Date().getFullYear()} Sikshya Peer Tutoring. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {LEGAL_LINKS.map(link => (
              <Link key={link.href} href={link.href} style={{ fontSize: "0.78rem", color: "#64748b", textDecoration: "none" }} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: #fff !important; }
      `}</style>
    </footer>
  );
}