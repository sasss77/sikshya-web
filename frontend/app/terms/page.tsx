import React from "react";

export const metadata = {
  title: "Terms of Service | Sikshya",
  description: "Terms and conditions governing your use of the Sikshya platform.",
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using Sikshya ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform. These terms apply to all users, including students, tutors, and visitors.`,
  },
  {
    title: "2. Account Registration",
    content: `You must be at least 13 years old to create an account. You agree to provide accurate and complete information during registration and to keep your account credentials confidential. You are responsible for all activity that occurs under your account. Sikshya reserves the right to suspend accounts that violate these terms.`,
  },
  {
    title: "3. Student Obligations",
    content: `Students agree to: attend booked sessions on time, provide at least 24 hours notice for cancellations, treat tutors respectfully, not share tutor contact details outside the platform, and use the platform for legitimate educational purposes only.`,
  },
  {
    title: "4. Tutor Obligations",
    content: `Tutors agree to: provide accurate qualification and availability information, deliver sessions as agreed, maintain professional conduct at all times, not solicit payments outside the Sikshya platform, and notify students of cancellations with adequate notice.`,
  },
  {
    title: "5. Payments & Refunds",
    content: `All payments are processed securely through our payment partner. Session fees are charged at the time of booking. Refunds are available for cancellations made at least 24 hours before the session. No-shows by tutors will result in a full refund. Platform service fees are non-refundable.`,
  },
  {
    title: "6. Prohibited Conduct",
    content: `Users may not: impersonate others, post false or misleading information, harass or abuse other users, attempt to circumvent the platform for direct payment arrangements, upload inappropriate or illegal content, or interfere with the platform's operation.`,
  },
  {
    title: "7. Intellectual Property",
    content: `All content on Sikshya — including the logo, design, and software — is the property of Sikshya and protected by applicable intellectual property laws. Users may not reproduce, distribute, or create derivative works without explicit written permission.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `Sikshya is a platform that connects students and tutors. We do not guarantee specific educational outcomes. To the maximum extent permitted by law, Sikshya shall not be liable for indirect, incidental, or consequential damages arising from the use of the platform.`,
  },
  {
    title: "9. Termination",
    content: `We reserve the right to suspend or terminate accounts that violate these terms, at our sole discretion. Users may close their accounts at any time through account settings. Upon termination, your right to use the platform ceases immediately.`,
  },
  {
    title: "10. Changes to Terms",
    content: `We may modify these terms at any time. We will provide at least 7 days notice for material changes. Continued use of the platform after changes constitutes acceptance of the new terms. It is your responsibility to review these terms periodically.`,
  },
];

export default function TermsPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#1e293b", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0B4085, #1a56b3)", color: "#fff", padding: "5rem 2rem 4rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, margin: "0 0 1rem", letterSpacing: "-0.02em" }}>Terms of Service</h1>
        <p style={{ opacity: 0.8, fontSize: "1rem", margin: 0 }}>Last updated: July 2025 · Effective immediately</p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 2rem" }}>
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "2.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.8, margin: 0, borderLeft: "4px solid #0B4085", paddingLeft: "1.25rem" }}>
            Please read these Terms of Service carefully before using Sikshya. These terms govern your access to and use of our peer tutoring platform.
          </p>

          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.75rem" }}>{section.title}</h2>
              <p style={{ fontSize: "0.95rem", color: "#475569", lineHeight: 1.8, margin: 0 }}>{section.content}</p>
            </div>
          ))}

          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1.5rem", fontSize: "0.875rem", color: "#94a3b8" }}>
            If you have questions about these Terms, please contact us at <strong style={{ color: "#0B4085" }}>legal@sikshya.com.np</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
