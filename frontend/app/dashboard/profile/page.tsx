"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import { getTokenAction } from "@/lib/actions/user-actions";
import { logoutAction } from "@/lib/actions/auth-action";
import axios from "axios";

// ─── Component Styles ───
const S: Record<string, React.CSSProperties> = {
    root: {
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        color: "#1a202c",
        background: "#f7f8fa",
        minHeight: "100vh",
        margin: 0,
    },

    /* ── Nav Styles (From Provided Dashboard) ── */
    nav: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: 64,
        background: "#fff",
        borderBottom: "1px solid #e8eaf0",
        position: "sticky" as const,
        top: 0,
        zIndex: 100,
    },
    navLogo: {
        fontWeight: 800,
        fontSize: 22,
        color: "#1a3c6e",
        letterSpacing: "-0.5px",
    },
    navLinks: {
        display: "flex",
        gap: 32,
        listStyle: "none",
        margin: 0,
        padding: 0,
    },
    navLink: {
        fontSize: 14,
        fontWeight: 500,
        color: "#4a5568",
        cursor: "pointer",
        textDecoration: "none",
    },
    navLinkActive: {
        fontSize: 14,
        fontWeight: 600,
        color: "#1a3c6e",
        textDecoration: "underline",
        textUnderlineOffset: 4,
        cursor: "pointer",
    },
    navRight: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },
    profileAvatar: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "#e2e8f0",
        border: "2px solid #cbd5e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
    },

    /* ── View Profile Content Layout ── */
    container: {
        maxWidth: "1040px",
        margin: "0 auto",
        padding: "40px 20px",
    },
    profileHeaderRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
    },
    pageTitle: {
        fontSize: "32px",
        fontWeight: 800,
        color: "#0f172a",
        margin: 0,
    },
    editBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#fff",
        border: "1px solid #cbd5e0",
        borderRadius: "8px",
        padding: "10px 18px",
        fontSize: "14px",
        fontWeight: 600,
        color: "#1e293b",
        cursor: "pointer",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    },
    topGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: "24px",
        marginBottom: "24px",
    },
    cardBase: {
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        padding: "24px",
    },
    heroProfileCard: {
        display: "flex",
        alignItems: "center",
        gap: "24px",
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
    },
    avatarWrapper: {
        position: "relative" as const,
        width: "110px",
        height: "110px",
    },
    avatarPlaceholder: {
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: "#cbd5e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "36px",
        color: "#4a5568",
        fontWeight: 600,
        overflow: "hidden",
    },
    verifiedBadge: {
        position: "absolute" as const,
        bottom: "2px",
        right: "2px",
        background: "#22c55e",
        border: "2px solid #fff",
        borderRadius: "50%",
        width: "22px",
        height: "22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    profileName: {
        fontSize: "24px",
        fontWeight: 700,
        color: "#0f172a",
        margin: "0 0 6px 0",
    },
    roleBadge: {
        background: "#bbf7d0",
        color: "#166534",
        fontSize: "12px",
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: "6px",
        marginLeft: "8px",
        verticalAlign: "middle",
    },
    locationText: {
        fontSize: "14px",
        color: "#64748b",
        display: "flex",
        alignItems: "center",
        gap: "4px",
    },
    statCard: {
        textAlign: "center" as const,
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
    },
    statCount: {
        fontSize: "36px",
        fontWeight: 800,
        color: "#1e3a8a",
        lineHeight: 1,
        margin: "0 0 4px 0",
    },
    statLabel: {
        fontSize: "11px",
        fontWeight: 700,
        color: "#64748b",
        textTransform: "uppercase" as const,
        letterSpacing: "0.5px",
    },
    accountInfoTitle: {
        fontSize: "18px",
        fontWeight: 700,
        color: "#0f172a",
        margin: "0 0 24px 0",
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "24px",
        marginBottom: "24px",
    },
    infoField: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "6px",
    },
    fieldLabel: {
        fontSize: "12px",
        fontWeight: 500,
        color: "#64748b",
    },
    fieldValue: {
        fontSize: "14px",
        fontWeight: 600,
        color: "#1e293b",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    institutionRow: {
        borderTop: "1px solid #f1f5f9",
        paddingTop: "20px",
        marginTop: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    memberSince: {
        fontSize: "12px",
        color: "#64748b",
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    greenDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#22c55e",
    },
    bottomGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        marginTop: "24px",
    },
    interactiveBar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
    },
    barLeft: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
    },
    iconBox: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    barTitle: {
        fontSize: "12px",
        fontWeight: 500,
        color: "#64748b",
        margin: 0,
    },
    barSubtitle: {
        fontSize: "13px",
        fontWeight: 600,
        color: "#1e293b",
        margin: "2px 0 0 0",
    },

    /* ── Edit Profile Styles ── */
    backLink: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "13px",
        fontWeight: 600,
        color: "#475569",
        cursor: "pointer",
        marginBottom: "24px",
    },
    editCentralCard: {
        maxWidth: "600px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        padding: "40px",
        textAlign: "center" as const,
    },
    editTitle: {
        fontSize: "26px",
        fontWeight: 800,
        color: "#1e3a8a",
        margin: "0 0 6px 0",
    },
    editSubtitle: {
        fontSize: "14px",
        color: "#64748b",
        margin: "0 0 32px 0",
    },
    editAvatarWrapper: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        gap: "12px",
        marginBottom: "32px",
    },
    changePhotoBtn: {
        background: "#fff",
        border: "1.5px solid #22c55e",
        color: "#22c55e",
        borderRadius: "6px",
        padding: "6px 16px",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
    },
    photoRestrictions: {
        fontSize: "11px",
        color: "#94a3b8",
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        textAlign: "left" as const,
        marginBottom: "24px",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "6px",
    },
    inputLabel: {
        fontSize: "13px",
        fontWeight: 600,
        color: "#334155",
    },
    textInput: {
        width: "100%",
        padding: "10px 14px",
        fontSize: "14px",
        borderRadius: "8px",
        border: "1px solid #cbd5e0",
        color: "#1e293b",
        outline: "none",
        boxSizing: "border-box" as const,
    },
    disabledInputWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "10px 14px",
        fontSize: "14px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        background: "#f1f5f9",
        color: "#64748b",
        boxSizing: "border-box" as const,
    },
    passwordWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "10px 14px",
        fontSize: "14px",
        borderRadius: "8px",
        border: "1px solid #cbd5e0",
        boxSizing: "border-box" as const,
    },
    roleCaption: {
        fontSize: "11px",
        color: "#64748b",
        marginTop: "6px",
        textAlign: "left" as const,
    },
    actionRow: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "24px",
        marginTop: "40px",
    },
    cancelBtn: {
        background: "none",
        border: "none",
        fontSize: "14px",
        fontWeight: 600,
        color: "#475569",
        cursor: "pointer",
    },
    saveBtn: {
        background: "#0f172a",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "12px 32px",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
    },
    securityAlert: {
        maxWidth: "600px",
        margin: "24px auto 0",
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: "12px",
        padding: "16px 20px",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
    },
    securityText: {
        fontSize: "12px",
        color: "#1e40af",
        lineHeight: "1.5",
        margin: 0,
        textAlign: "left" as const,
    },
    securityTitle: {
        fontWeight: 700,
        marginBottom: "2px",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    modalHeader: {
        padding: "20px 24px",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: "18px",
        fontWeight: 600,
        color: "#0f172a",
        margin: 0,
    },
    modalBody: {
        padding: "24px",
        fontSize: "14px",
        color: "#475569",
    },
    modalFooter: {
        padding: "16px 24px",
        borderTop: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        backgroundColor: "#f8fafc",
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px",
    },
    btnDanger: {
        backgroundColor: "#ef4444",
        color: "#fff",
        border: "none",
        padding: "10px 16px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
    },
    btnGhost: {
        backgroundColor: "transparent",
        color: "#64748b",
        border: "1px solid #e2e8f0",
        padding: "10px 16px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
    },
};

/* ─── Icons ─── */
const IconPin = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);
const IconEditPen = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const IconCheckCircle = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const IconCardId = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" /><line x1="7" y1="8" x2="17" y2="8" /><line x1="7" y1="12" x2="13" y2="12" /><line x1="7" y1="16" x2="9" y2="16" />
    </svg>
);
const IconBuilding = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="9" y1="22" x2="9" y2="16" /><path d="M9 16h6v6" /><line x1="8" y1="6" x2="8.01" y2="6" /><line x1="16" y1="6" x2="16.01" y2="6" /><line x1="8" y1="11" x2="8.01" y2="11" /><line x1="16" y1="11" x2="16.01" y2="11" />
    </svg>
);
const IconClock = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);
const IconArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);
const IconArrowLeft = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);
const IconLock = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);
const IconEye = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);
const IconShield = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);
const IconUser = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const IconLogOut = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);
const IconX = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);


export default function ProfilePage() {
    const { user, loading, refreshUser } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user?.role === "admin") {
            router.replace("/admin/users");
        }
    }, [user, loading, router]);

    // State handling active screen navigation view
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [saving, setSaving] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

    // Local profile data (populated from context)
    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        phone: "",
        role: "",
        location: "Kathmandu, Nepal",
        institution: "Tribhuvan University, Kathmandu",
        memberSince: "Jan 2024",
        activeCourses: 4,
        studyHours: 28,
        profileImage: "",
    });

    // Edit form state
    const [editForm, setEditForm] = useState({
        fullName: "",
        phone: "",
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // File upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Sync context user → local state
    useEffect(() => {
        if (user) {
            setProfileData((prev) => ({
                ...prev,
                fullName: user.fullName || prev.fullName,
                email: user.email || prev.email,
                phone: user.phoneNumber || prev.phone,
                role: user.role || prev.role,
                profileImage: user.profileImage || prev.profileImage,
            }));
            setEditForm({
                fullName: user.fullName || "",
                phone: user.phoneNumber || "",
            });
        }
    }, [user]);

    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
    const imageUrl = profileData.profileImage ? `${backendUrl}${profileData.profileImage}` : null;

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        setStatusMsg(null);
        // Reset form to current profile data
        setEditForm({
            fullName: profileData.fullName,
            phone: profileData.phone,
        });
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    };

    // Save profile changes via API (called directly from client to support File upload)
    const handleSave = async () => {
        // Validate passwords if user is trying to change them
        if (passwordForm.newPassword || passwordForm.confirmPassword || passwordForm.oldPassword) {
            if (!passwordForm.oldPassword) {
                setStatusMsg({ type: "error", text: "Please enter your current password" });
                return;
            }
            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                setStatusMsg({ type: "error", text: "New password and confirm password do not match" });
                return;
            }
            if (passwordForm.newPassword.length < 6) {
                setStatusMsg({ type: "error", text: "New password must be at least 6 characters" });
                return;
            }
        }

        setSaving(true);
        setStatusMsg(null);

        try {
            const token = await getTokenAction();
            if (!token) {
                setStatusMsg({ type: "error", text: "You are not logged in" });
                setSaving(false);
                return;
            }

            const formData = new FormData();
            formData.append("fullName", editForm.fullName);
            formData.append("phoneNumber", editForm.phone);
            if (selectedFile) {
                formData.append("profileImage", selectedFile);
            }
            if (passwordForm.oldPassword && passwordForm.newPassword) {
                formData.append("oldPassword", passwordForm.oldPassword);
                formData.append("password", passwordForm.newPassword);
                formData.append("confirmPassword", passwordForm.confirmPassword);
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
            const response = await axios.patch(`${apiUrl}/users/update-profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setStatusMsg({ type: "success", text: response.data.message || "Profile updated successfully!" });
            await refreshUser();
            setSelectedFile(null);
            setPreviewUrl(null);
            setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => {
                setIsEditing(false);
                setStatusMsg(null);
            }, 1200);
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Failed to update profile";
            setStatusMsg({ type: "error", text: msg });
        } finally {
            setSaving(false);
        }
    };

    // Determine which avatar to show in the edit form
    // Handle Logout
    const handleLogout = async () => {
        await logoutAction();
        router.push("/login");
    };

    const editAvatarSrc = previewUrl || imageUrl;

    if (loading) {
        return (
            <div style={{ ...S.root, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontSize: "16px", color: "#64748b" }}>Loading profile...</p>
            </div>
        );
    }

    return (
        <div style={S.root}>

            <div style={S.container}>
                {!isEditing ? (
                    /* ─── VIEW PROFILE SCREEN ─── */
                    <>
                        <div style={S.profileHeaderRow}>
                            <h1 style={S.pageTitle}>My Profile</h1>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <button style={S.editBtn} onClick={() => setIsEditing(true)}>
                                    <IconEditPen /> Edit Profile
                                </button>
                                <button style={{ ...S.editBtn, color: "#ef4444", borderColor: "#ef4444" }} onClick={() => setIsLogoutModalOpen(true)}>
                                    <IconLogOut /> Logout
                                </button>
                            </div>
                        </div>

                        {/* Student Verification Banner */}
                        {user?.role === "student" && !user?.isVerifiedStudent && (
                            <div style={{ background: "linear-gradient(135deg, #fef3c7, #fef08a)", border: "1px solid #fde047", borderRadius: "12px", padding: "16px 24px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h3 style={{ margin: "0 0 4px", fontSize: "16px", color: "#854d0e", fontWeight: 800 }}>Complete Your Student Verification</h3>
                                    <p style={{ margin: 0, fontSize: "14px", color: "#a16207" }}>You need to be a verified student to book classes with tutors.</p>
                                </div>
                                <Link href="/dashboard/verify-student" style={{ background: "#ca8a04", color: "#fff", textDecoration: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: 700, fontSize: "14px", whiteSpace: "nowrap", boxShadow: "0 4px 6px rgba(202, 138, 4, 0.2)" }}>
                                    Verify as Student
                                </Link>
                            </div>
                        )}

                        <div style={S.topGrid}>
                            {/* Profile Card Summary */}
                            <div style={{ ...S.cardBase, ...S.heroProfileCard }}>
                                <div style={S.avatarWrapper}>
                                    {imageUrl ? (
                                        <div style={{ ...S.avatarPlaceholder, background: "transparent" }}>
                                            <img src={imageUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                                        </div>
                                    ) : (
                                        <div style={S.avatarPlaceholder}>
                                            <span>{profileData.fullName.charAt(0).toUpperCase()}</span>
                                        </div>
                                    )}
                                    <div style={S.verifiedBadge}>
                                        <IconCheckCircle />
                                    </div>
                                </div>
                                <div>
                                    <h2 style={S.profileName}>
                                        {profileData.fullName}
                                        <span style={S.roleBadge}>{profileData.role || "Student"}</span>
                                    </h2>
                                    <div style={S.locationText}>
                                        <IconPin /> {profileData.location}
                                    </div>
                                </div>
                            </div>

                            {/* Active Courses Summary Counter */}
                            <div style={{ ...S.cardBase, ...S.statCard, background: "#1e3a8a" }}>
                                <span style={{ ...S.statCount, color: "#fff" }}>
                                    {profileData.activeCourses < 10 ? `0${profileData.activeCourses}` : profileData.activeCourses}
                                </span>
                                <span style={{ ...S.statLabel, color: "#93c5fd" }}>Active Courses</span>
                            </div>
                        </div>

                        {/* Account Information Details */}
                        <div style={S.cardBase}>
                            <div style={S.accountInfoTitle}>
                                <IconCardId /> Account Information
                            </div>

                            <div style={S.infoGrid}>
                                <div style={S.infoField}>
                                    <span style={S.fieldLabel}>Email Address</span>
                                    <span style={S.fieldValue}>{profileData.email}</span>
                                </div>
                                <div style={S.infoField}>
                                    <span style={S.fieldLabel}>Phone Number</span>
                                    <span style={S.fieldValue}>{profileData.phone}</span>
                                </div>
                                <div style={S.infoField}>
                                    <span style={S.fieldLabel}>Institutional Role</span>
                                    <span style={S.fieldValue}>{profileData.role}</span>
                                </div>
                            </div>

                            <div style={S.institutionRow}>
                                <div style={S.infoField}>
                                    <span style={S.fieldLabel}>Primary Institution</span>
                                    <span style={{ ...S.fieldValue, color: "#334155" }}>
                                        <IconBuilding /> {profileData.institution}
                                    </span>
                                </div>
                                <div style={S.memberSince}>
                                    <span>Member since {profileData.memberSince}</span>
                                    <div style={S.greenDot}></div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Stat Blocks */}
                        <div style={S.bottomGrid}>
                            <div style={{ ...S.cardBase, ...S.interactiveBar }}>
                                <div style={S.barLeft}>
                                    <div style={{ ...S.iconBox, background: "#eff6ff" }}>
                                        <IconClock />
                                    </div>
                                    <div>
                                        <h4 style={S.barSubtitle}>{profileData.studyHours}h</h4>
                                        <p style={S.barTitle}>Study Hours This Month</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ ...S.cardBase, ...S.interactiveBar }}>
                                <div style={S.barLeft}>
                                    <div style={{ ...S.iconBox, background: "#f0fdf4" }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p style={S.barTitle}>Upcoming Lesson</p>
                                        <h4 style={S.barSubtitle}>Advanced Calculus with Dr. Sharma</h4>
                                    </div>
                                </div>
                                <IconArrowRight />
                            </div>
                        </div>

                        <div style={{ ...S.bottomGrid, marginTop: "24px" }}>
                            <div style={{ ...S.cardBase, ...S.interactiveBar, gridColumn: "span 2" }}>
                                <div style={S.barLeft}>
                                    <div style={{ ...S.iconBox, background: "#fef3c7" }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p style={S.barTitle}>Latest Achievement</p>
                                        <h4 style={S.barSubtitle}>Quick Learner - 10 Hours Completed</h4>
                                    </div>
                                </div>
                                <IconArrowRight />
                            </div>
                        </div>
                    </>
                ) : (
                    /* ─── EDIT PROFILE SCREEN ─── */
                    <>
                        <div style={S.backLink} onClick={handleCancel}>
                            <IconArrowLeft /> Back to Profile
                        </div>

                        <div style={S.editCentralCard}>
                            <h2 style={S.editTitle}>Edit Profile Information</h2>
                            <p style={S.editSubtitle}>Update your personal details and academic credentials below.</p>

                            {/* Status Message */}
                            {statusMsg && (
                                <div style={{
                                    padding: "10px 16px",
                                    borderRadius: "8px",
                                    marginBottom: "20px",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    background: statusMsg.type === "success" ? "#dcfce7" : "#fee2e2",
                                    color: statusMsg.type === "success" ? "#166534" : "#991b1b",
                                    border: `1px solid ${statusMsg.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                                }}>
                                    {statusMsg.text}
                                </div>
                            )}

                            {/* Avatar Uploader Section */}
                            <div style={S.editAvatarWrapper}>
                                <div style={{ ...S.avatarPlaceholder, width: "100px", height: "100px", fontSize: "32px", background: editAvatarSrc ? "transparent" : "#cbd5e0" }}>
                                    {editAvatarSrc ? (
                                        <img src={editAvatarSrc} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                                    ) : (
                                        <span>{editForm.fullName.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/jpeg,image/png,image/gif"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                                <button
                                    style={S.changePhotoBtn}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Change Photo
                                </button>
                                <span style={S.photoRestrictions}>
                                    {selectedFile ? selectedFile.name : "JPG, GIF or PNG. Max size of 800K"}
                                </span>
                            </div>

                            {/* Input Form Fields */}
                            <div style={S.formGrid}>
                                <div style={S.inputGroup}>
                                    <label style={S.inputLabel}>Full Name</label>
                                    <input
                                        type="text"
                                        style={S.textInput}
                                        value={editForm.fullName}
                                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                    />
                                </div>

                                <div style={S.inputGroup}>
                                    <label style={S.inputLabel}>Email Address</label>
                                    <div style={S.disabledInputWrapper}>
                                        <span>{profileData.email}</span>
                                        <IconLock />
                                    </div>
                                </div>

                                <div style={S.inputGroup}>
                                    <label style={S.inputLabel}>Phone Number</label>
                                    <input
                                        type="tel"
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        title="Phone number must be 10 digits"
                                        style={S.textInput}
                                        value={editForm.phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setEditForm({ ...editForm, phone: val });
                                        }}
                                    />
                                </div>

                                <div style={{ ...S.inputGroup, gridColumn: "span 2" }}>
                                    <label style={S.inputLabel}>Institutional Role</label>
                                    <div style={S.disabledInputWrapper}>
                                        <span>{profileData.role}</span>
                                        <IconLock />
                                    </div>
                                    <span style={S.roleCaption}>Role managed by your institution. Contact admin to change.</span>
                                </div>
                            </div>

                            {/* Password Change Section */}
                            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "24px", marginTop: "8px", textAlign: "left" as const }}>
                                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <IconLock /> Change Password
                                </h3>
                                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>Leave blank if you don&apos;t want to change your password.</p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                                    <div style={S.inputGroup}>
                                        <label style={S.inputLabel}>Current Password</label>
                                        <div style={{ ...S.passwordWrapper, position: "relative" as const }}>
                                            <input
                                                type={showOldPassword ? "text" : "password"}
                                                style={{ ...S.textInput, border: "none", padding: 0, flex: 1 }}
                                                placeholder="Enter current password"
                                                value={passwordForm.oldPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                            />
                                            <span style={{ cursor: "pointer" }} onClick={() => setShowOldPassword(!showOldPassword)}><IconEye /></span>
                                        </div>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                        <div style={S.inputGroup}>
                                            <label style={S.inputLabel}>New Password</label>
                                            <div style={{ ...S.passwordWrapper, position: "relative" as const }}>
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    style={{ ...S.textInput, border: "none", padding: 0, flex: 1 }}
                                                    placeholder="Enter new password"
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                />
                                                <span style={{ cursor: "pointer" }} onClick={() => setShowNewPassword(!showNewPassword)}><IconEye /></span>
                                            </div>
                                        </div>
                                        <div style={S.inputGroup}>
                                            <label style={S.inputLabel}>Confirm Password</label>
                                            <div style={{ ...S.passwordWrapper, position: "relative" as const }}>
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    style={{ ...S.textInput, border: "none", padding: 0, flex: 1 }}
                                                    placeholder="Confirm new password"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                />
                                                <span style={{ cursor: "pointer" }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}><IconEye /></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div style={S.actionRow}>
                                <button style={S.cancelBtn} onClick={handleCancel}>
                                    Cancel
                                </button>
                                <button
                                    style={{ ...S.saveBtn, opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>

                        {/* Bottom Security Note */}
                        <div style={S.securityAlert}>
                            <IconShield />
                            <div style={S.securityText}>
                                <span style={S.securityTitle}>Security Note</span>
                                <br />
                                Your profile changes will be reflected across all your active courses and upcoming tutor matches immediately upon saving.
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div style={S.modalOverlay}>
                    <div style={S.modal}>
                        <div style={S.modalHeader}>
                            <h2 style={S.modalTitle}>Confirm Logout</h2>
                            <button onClick={() => setIsLogoutModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                                <IconX />
                            </button>
                        </div>
                        <div style={S.modalBody}>
                            <p style={{ margin: 0 }}>Are you sure you want to log out of your account?</p>
                        </div>
                        <div style={S.modalFooter}>
                            <button style={S.btnGhost} onClick={() => setIsLogoutModalOpen(false)}>Cancel</button>
                            <button style={S.btnDanger} onClick={handleLogout}>Yes, Log Out</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
