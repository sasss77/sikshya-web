"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, Bell, Shield } from "lucide-react";
import { useUser } from "@/lib/context/UserContext";
import Image from "next/image";
import logoIcon from "@/app/assets/mortarboard.png";
import ProfileSidebar from "./ProfileSidebar";

const GUEST_LINKS = [
  { label: "Home", href: "/" },
  { label: "Find Tutors", href: "/find-tutors" },
  { label: "How it Works", href: "/#how-it-works" },
];

const STUDENT_AUTH_LINKS = [
  { label: "Home", href: "/" },
  { label: "Find Tutors", href: "/find-tutors" },
  { label: "My Bookings", href: "/dashboard/bookings" },
  { label: "My Learnings", href: "/dashboard/learnings" },
  { label: "MCQ Generator", href: "/dashboard/mcq" },
];

const TUTOR_AUTH_LINKS = [
  { label: "My Sessions", href: "/dashboard/bookings" },
  { label: "My Courses", href: "/dashboard/my-courses" },
  { label: "Profile Setup", href: "/dashboard/tutor-profile" },
  { label: "Messages", href: "/dashboard/messages" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();

  const hideHeader = pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (hideHeader) return null;

  const visibleAuthLinks = user?.role === "tutor" ? TUTOR_AUTH_LINKS : STUDENT_AUTH_LINKS;

  const imageUrl = user?.profileImage
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${user.profileImage}`
    : null;

  return (
    <>
      <ProfileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          width: "100%",
          background: "#fff",
          borderBottom: scrolled ? "1px solid #e2e8f0" : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 12px rgba(11,64,133,0.07)" : "none",
          transition: "box-shadow 0.25s ease, border-color 0.25s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "68px",
            width: "100%",
            padding: "0 2rem",
            maxWidth: "1600px",
            margin: "0 auto",
          }}
        >
          {/* ── Logo ── */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "var(--color-primary)",
              letterSpacing: "-0.02em",
              textDecoration: "none",
            }}
          >
            <Image src={logoIcon} alt="Sikshya Logo" width={28} height={28} style={{ objectFit: "contain" }} />
            Sikshya
          </Link>

          {/* ── Desktop Nav ── */}
          <nav
            style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}
            className="desktop-nav"
          >
            {(user ? visibleAuthLinks : GUEST_LINKS).map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href + "/") && link.href !== "/");
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                    textDecoration: "none",
                    position: "relative",
                    paddingBottom: "4px",
                    transition: "color 0.15s ease",
                  }}
                  className="nav-link"
                >
                  {link.label}
                  {isActive && (
                    <span
                      style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        height: "2px", background: "var(--color-primary)", borderRadius: "2px",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Auth / Profile ── */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            className="desktop-nav"
          >
            {user ? (
              <>
                {/* Notifications icon shortcut */}
                <Link href="/dashboard/notifications" title="Notifications" style={{ display: "flex", position: "relative" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#f4f6fa", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #e2e8f0", transition: "background 0.15s" }} className="icon-btn">
                    <Bell size={17} color="#64748b" />
                  </div>
                  {/* Notification dot */}
                  <span style={{ position: "absolute", top: -2, right: -2, width: 10, height: 10, background: "#ef4444", borderRadius: "50%", border: "2px solid #fff" }} />
                </Link>

                {/* Profile Avatar → triggers sidebar */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  title="My Account"
                  style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    background: "none", border: "none", cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "var(--color-primary-light)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", border: "2px solid var(--color-border)",
                    transition: "box-shadow 0.15s ease",
                  }}
                  className="avatar-btn"
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <User size={20} color="var(--color-primary)" />
                    )}
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    fontSize: "0.875rem", fontWeight: 600,
                    color: "var(--color-primary)", textDecoration: "none",
                    transition: "opacity 0.15s",
                  }}
                >
                  Login
                </Link>
                <Link href="/signup" className="btn-primary" style={{ padding: "0.5rem 1.25rem" }}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              display: "none", background: "none", border: "none",
              cursor: "pointer", color: "var(--color-text)", padding: "0.25rem",
            }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── Mobile Drawer ── */}
        {mobileOpen && (
          <div
            style={{
              background: "#fff", borderTop: "1px solid var(--color-border)",
              padding: "1rem 1.5rem 1.5rem",
              display: "flex", flexDirection: "column", gap: "1rem",
            }}
            className="mobile-nav"
          >
            {(user ? visibleAuthLinks : GUEST_LINKS).map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: "0.9rem", fontWeight: 500, color: "var(--color-text)",
                  textDecoration: "none", padding: "0.4rem 0",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => { setMobileOpen(false); setSidebarOpen(true); }}
                className="btn-primary"
                style={{ justifyContent: "center", border: "none", cursor: "pointer" }}
              >
                <User size={16} style={{ marginRight: "4px" }} /> My Account
              </button>
            ) : (
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <Link href="/login" className="btn-outline" style={{ flex: 1, justifyContent: "center" }}>Login</Link>
                <Link href="/signup" className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>Sign Up</Link>
              </div>
            )}
          </div>
        )}

        <style>{`
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .mobile-menu-btn { display: flex !important; }
          }
          @media (min-width: 769px) {
            .mobile-nav { display: none !important; }
          }
          .nav-link:hover { color: var(--color-primary) !important; }
          .avatar-btn:hover { box-shadow: 0 0 0 3px rgba(11,64,133,0.15) !important; }
          .icon-btn:hover { background: #e8eef7 !important; border-color: #0B4085 !important; }
        `}</style>
      </header>
    </>
  );
}