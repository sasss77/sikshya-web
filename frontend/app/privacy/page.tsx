import React from "react";

export const metadata = {
  title: "Privacy Policy | Sikshya",
  description: "How Sikshya collects, uses, and protects your personal information.",
};

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content: `When you create an account on Sikshya, we collect your full name, email address, phone number, and role (student or tutor). During verification, students may provide additional details such as their institution, grade level, and subjects of interest. Tutors may provide qualification details and availability. We also automatically collect usage data such as pages visited and session durations.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use your information to provide and improve our tutoring platform, match students with appropriate tutors, facilitate session bookings and payments, send you relevant notifications and communications, and comply with applicable legal obligations.`,
  },
  {
    title: "3. Information Sharing",
    content: `We do not sell your personal information to third parties. We may share limited profile information (such as your name and subjects) with other users as part of the tutoring experience — for example, a student's name is visible to a tutor they book. We share data with trusted payment processors (such as Stripe) solely to facilitate transactions.`,
  },
  {
    title: "4. Data Storage & Security",
    content: `All data is stored on secure servers with industry-standard encryption. We use SSL/TLS for all data in transit. Access to personal data is restricted to authorised team members only. We retain your data for as long as your account is active or as required by law.`,
  },
  {
    title: "5. Cookies",
    content: `Sikshya uses cookies and similar technologies to maintain your session, remember your preferences, and analyse platform usage. You can control cookie settings through your browser settings, though disabling cookies may affect platform functionality.`,
  },
  {
    title: "6. Your Rights",
    content: `You have the right to access, correct, or delete your personal information at any time. You can update your profile details through your account settings. To request account deletion or data export, please contact us at privacy@sikshya.com.np.`,
  },
  {
    title: "7. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify registered users of significant changes via email or a notice on the platform. Continued use of Sikshya after changes constitute acceptance of the updated policy.`,
  },
  {
    title: "8. Contact",
    content: `If you have any questions or concerns about this Privacy Policy, please contact our privacy team at privacy@sikshya.com.np or write to us at our Kathmandu office.`,
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#1e293b", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0B4085, #1a56b3)", color: "#fff", padding: "5rem 2rem 4rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, margin: "0 0 1rem", letterSpacing: "-0.02em" }}>Privacy Policy</h1>
        <p style={{ opacity: 0.8, fontSize: "1rem", margin: 0 }}>Last updated: July 2025</p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 2rem" }}>
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "2.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.8, margin: 0, borderLeft: "4px solid #0B4085", paddingLeft: "1.25rem" }}>
            At Sikshya, we take your privacy seriously. This policy explains what information we collect, how we use it, and your rights regarding your data.
          </p>

          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.75rem" }}>{section.title}</h2>
              <p style={{ fontSize: "0.95rem", color: "#475569", lineHeight: 1.8, margin: 0 }}>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
