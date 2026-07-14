import Link from "next/link";
import Image from "next/image";
import logoIcon from "@/app/assets/mortarboard.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {/* Sikshya Logo floating at top left */}
      <div style={{ position: "absolute", top: "2rem", left: "2rem", zIndex: 10 }}>
        <Link
          href="/"
          className="hover:opacity-80 transition-opacity"
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
      </div>

      {children}
    </div>
  );
}