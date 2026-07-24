"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  getAdminUsersAction,
  createAdminUserAction,
  updateAdminUserAction,
  deleteAdminUserAction,
  getAdminUserByIdAction,
} from "@/lib/actions/admin-actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { useUser } from "@/lib/context/UserContext";
import { Star } from "lucide-react";

// --- Types ---
type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  profile?: {
    averageRating?: number;
    reviewCount?: number;
  };
};

type Meta = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

// --- Schema ---
const userSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
    role: z.enum(["student", "tutor", "admin"]),
  })
  .refine(
    (data) => {
      // Only validate match if a password was entered
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    { message: "Passwords do not match", path: ["confirmPassword"] }
  );

type UserFormData = z.infer<typeof userSchema>;

// --- Styles ---
const S: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    overflow: "hidden",
  },
  header: {
    padding: "24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
  },
  toolbar: {
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  searchContainer: {
    position: "relative",
    width: "300px",
  },
  searchInput: {
    width: "100%",
    padding: "10px 10px 10px 36px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  searchIcon: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
  },
  btnPrimary: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background-color 0.2s",
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
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    padding: "16px 24px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  },
  td: {
    padding: "16px 24px",
    fontSize: "14px",
    color: "#334155",
    borderBottom: "1px solid #e2e8f0",
  },
  actionBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    color: "#64748b",
    borderRadius: "4px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    marginRight: "8px",
  },
  badgeAdmin: { backgroundColor: "#fef08a", color: "#854d0e", padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: 500 },
  badgeStudent: { backgroundColor: "#dbeafe", color: "#1e40af", padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: 500 },
  badgeTutor: { backgroundColor: "#dcfce3", color: "#166534", padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: 500 },
  pagination: {
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #e2e8f0",
  },
  pageInfo: {
    fontSize: "14px",
    color: "#64748b",
  },
  pageControls: {
    display: "flex",
    gap: "8px",
  },
  pageBtn: {
    background: "#fff",
    border: "1px solid #cbd5e1",
    borderRadius: "4px",
    padding: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#334155",
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
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  modalHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    backgroundColor: "#fff",
    zIndex: 1,
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
  },
  modalBody: {
    padding: "24px",
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
    position: "sticky",
    bottom: 0,
  },
  inputGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: "#334155",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    width: "100%",
    padding: "10px 40px 10px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    padding: "0",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "12px",
    marginTop: "4px",
  },
  emptyState: {
    padding: "48px",
    textAlign: "center",
    color: "#64748b",
  },
};

export default function AdminTutorsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { user } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUserDetails, setViewingUserDetails] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchUsers = useCallback(async (p: number, search: string) => {
    setLoading(true);
    const res = await getAdminUsersAction({ page: p, limit: 10, search, role: "tutor" });
    if (res.success && res.data) {
      setUsers(res.data);
      setMeta(res.meta ?? null);
    } else {
      setApiError(res.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers(page, searchTerm);
  }, [page, fetchUsers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchUsers(1, val);
    }, 500);
  };

  const handleOpenViewModal = async (id: string) => {
    setLoading(true);
    const res = await getAdminUserByIdAction(id);
    if (res.success && res.data) {
      setViewingUserDetails(res.data);
      setRating(res.data.details?.profile?.averageRating || 0);
      setIsViewModalOpen(true);
    } else {
      alert(res.message || "Failed to load user details");
    }
    setLoading(false);
  };

  const handleOpenModal = (user?: User) => {
    setShowPassword(false);
    setShowConfirmPassword(false);
    if (user) {
      setEditingUser(user);
      setValue("fullName", user.fullName);
      setValue("email", user.email);
      setValue("role", user.role as any);
      setValue("password", "");
      setValue("confirmPassword", "");
      setValue("phoneNumber", "");
    } else {
      setEditingUser(null);
      reset({ fullName: "", email: "", role: "student", password: "", confirmPassword: "", phoneNumber: "" });
    }
    setApiError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const onSubmitForm = async (data: UserFormData) => {
    setApiError(null);
    let res;
    if (editingUser) {
      const submitData: any = {
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        ...(data.phoneNumber ? { phoneNumber: data.phoneNumber } : {}),
        ...(data.password ? { password: data.password } : {}),
      };
      res = await updateAdminUserAction(editingUser.id, submitData);
    } else {
      const submitData: any = {
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        password: data.password,
        ...(data.phoneNumber ? { phoneNumber: data.phoneNumber } : {}),
      };
      res = await createAdminUserAction(submitData);
    }

    if (res.success) {
      handleCloseModal();
      fetchUsers(page, searchTerm);
    } else {
      setApiError(res.message);
    }
  };

  const handleOpenDelete = (id: string) => {
    setDeletingUserId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingUserId) return;
    const res = await deleteAdminUserAction(deletingUserId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      fetchUsers(page, searchTerm);
    } else {
      alert(res.message);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === "admin") return <span style={S.badgeAdmin}>Admin</span>;
    if (role === "tutor") return <span style={S.badgeTutor}>Tutor</span>;
    return <span style={S.badgeStudent}>Student</span>;
  };

  return (
    <div style={S.container}>
      <div style={S.header}>
        <h1 style={S.title}>Tutor Management</h1>
      </div>

      <div style={S.toolbar}>
        <div style={S.searchContainer}>
          <Search size={18} style={S.searchIcon} />
          <input
            type="text"
            placeholder="Search tutors by name or email..."
            style={S.searchInput}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button style={S.btnPrimary} onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Add Tutor
          </button>
        </div>
      </div>

      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Name</th>
              <th style={S.th}>Email</th>
              <th style={S.th}>Role</th>
              <th style={S.th}>Rating</th>
              <th style={S.th}>Joined Date</th>
              <th style={{ ...S.th, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: "48px", textAlign: "center" }}>
                  <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto", color: "#3b82f6" }} />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} style={S.emptyState}>
                  <AlertCircle size={48} style={{ margin: "0 auto 16px", color: "#94a3b8" }} />
                  <p>No tutors found matching your criteria.</p>
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td style={S.td}>
                    <div style={{ fontWeight: 500 }}>{u.fullName}</div>
                  </td>
                  <td style={S.td}>{u.email}</td>
                  <td style={S.td}>{getRoleBadge(u.role)}</td>
                  <td style={S.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Star size={13} fill="#f59e0b" stroke="none" />
                      <span style={{ fontWeight: 600, color: "#0f172a" }}>
                        {u.profile?.averageRating ? u.profile.averageRating.toFixed(1) : "—"}
                      </span>
                      {u.profile?.reviewCount ? (
                        <span style={{ fontSize: "12px", color: "#64748b" }}>({u.profile.reviewCount})</span>
                      ) : null}
                    </div>
                  </td>
                  <td style={S.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ ...S.td, textAlign: "right" }}>
                    <button style={S.actionBtn} onClick={() => handleOpenViewModal(u.id)} title="View Details">
                      <Eye size={16} />
                    </button>
                    <button style={S.actionBtn} onClick={() => handleOpenModal(u)} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    {user?.id !== u.id && (
                      <button style={{ ...S.actionBtn, color: "#ef4444" }} onClick={() => handleOpenDelete(u.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.totalItems > 0 && (
        <div style={S.pagination}>
          <div style={S.pageInfo}>
            Showing{" "}
            <b>{(meta.currentPage - 1) * meta.itemsPerPage + 1}</b> to{" "}
            <b>{Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)}</b> of{" "}
            <b>{meta.totalItems}</b> tutors
          </div>
          <div style={S.pageControls}>
            <button
              style={{ ...S.pageBtn, opacity: meta.currentPage <= 1 ? 0.5 : 1 }}
              disabled={meta.currentPage <= 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ display: "flex", alignItems: "center", fontSize: "14px", color: "#64748b", padding: "0 8px" }}>
              Page {meta.currentPage} of {meta.totalPages}
            </span>
            <button
              style={{ ...S.pageBtn, opacity: meta.currentPage >= meta.totalPages ? 0.5 : 1 }}
              disabled={meta.currentPage >= meta.totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div style={S.modalOverlay}>
          <div style={S.modal}>
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>{editingUser ? "Edit Tutor" : "Create New Tutor"}</h2>
              <button onClick={handleCloseModal} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div style={S.modalBody}>
                {apiError && (
                  <div style={{ padding: "12px", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" }}>
                    {apiError}
                  </div>
                )}

                {/* Full Name */}
                <div style={S.inputGroup}>
                  <label style={S.label}>Full Name</label>
                  <input style={S.input} {...register("fullName")} placeholder="John Doe" />
                  {errors.fullName && <div style={S.errorText}>{errors.fullName.message}</div>}
                </div>

                {/* Email */}
                <div style={S.inputGroup}>
                  <label style={S.label}>Email</label>
                  <input style={S.input} type="email" {...register("email")} placeholder="john@example.com" />
                  {errors.email && <div style={S.errorText}>{errors.email.message}</div>}
                </div>

                {/* Phone Number */}
                <div style={S.inputGroup}>
                  <label style={S.label}>Phone Number <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optional)</span></label>
                  <input style={S.input} type="tel" {...register("phoneNumber")} placeholder="+977 98XXXXXXXX" />
                  {errors.phoneNumber && <div style={S.errorText}>{errors.phoneNumber.message}</div>}
                </div>

                {/* Password */}
                <div style={S.inputGroup}>
                  <label style={S.label}>
                    Password {editingUser && <span style={{ color: "#94a3b8", fontWeight: 400 }}>(Leave blank to keep current)</span>}
                  </label>
                  <div style={S.passwordWrapper}>
                    <input
                      style={S.passwordInput}
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      style={S.eyeBtn}
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <div style={S.errorText}>{errors.password.message}</div>}
                </div>

                {/* Confirm Password */}
                <div style={S.inputGroup}>
                  <label style={S.label}>
                    Confirm Password {editingUser && <span style={{ color: "#94a3b8", fontWeight: 400 }}>(Leave blank to keep current)</span>}
                  </label>
                  <div style={S.passwordWrapper}>
                    <input
                      style={S.passwordInput}
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      style={S.eyeBtn}
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <div style={S.errorText}>{errors.confirmPassword.message}</div>}
                </div>

                {/* Role */}
                <div style={S.inputGroup}>
                  <select style={S.input} {...register("role")} disabled>
                    <option value="tutor">Tutor</option>
                  </select>
                </div>
              </div>

              <div style={S.modalFooter}>
                <button type="button" style={S.btnGhost} onClick={handleCloseModal}>Cancel</button>
                <button type="submit" style={S.btnPrimary}>{editingUser ? "Save Changes" : "Create User"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div style={S.modalOverlay}>
          <div style={S.modal}>
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>Confirm Delete</h2>
              <button onClick={() => setIsDeleteModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>
            <div style={S.modalBody}>
              <p style={{ margin: 0, color: "#475569" }}>Are you sure you want to delete this tutor? This action cannot be undone.</p>
            </div>
            <div style={S.modalFooter}>
              <button style={S.btnGhost} onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button style={S.btnDanger} onClick={confirmDelete}>Yes, Delete Tutor</button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && viewingUserDetails && (
        <div style={S.modalOverlay}>
          <div style={S.modal}>
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>Tutor Details: {viewingUserDetails.fullName}</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={S.modalBody}>
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <strong>Email:</strong> {viewingUserDetails.email}
                </div>
                <div>
                  <strong>Phone Number:</strong> {viewingUserDetails.phoneNumber || "N/A"}
                </div>
                <div>
                  <strong>Joined:</strong> {new Date(viewingUserDetails.createdAt).toLocaleDateString()}
                </div>
                
                {viewingUserDetails.details ? (
                  <>
                    <hr style={{ border: "0", borderTop: "1px solid #e2e8f0", margin: "16px 0" }} />
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#0f172a" }}>Teaching Stats</h3>
                    <div>
                      <strong>Total Courses:</strong> {viewingUserDetails.details.totalCourses}
                    </div>
                    <div>
                      <strong>Total Students Taught:</strong> {viewingUserDetails.details.totalStudentsTaught}
                    </div>
                    <div>
                      <strong>Total Classes Attended (Taught):</strong> {viewingUserDetails.details.totalClassesAttended}
                    </div>

                    <hr style={{ border: "0", borderTop: "1px solid #e2e8f0", margin: "16px 0" }} />
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#0f172a" }}>Courses</h3>
                    {viewingUserDetails.details.profile?.courses?.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: "20px", color: "#475569" }}>
                        {viewingUserDetails.details.profile.courses.map((c: any, i: number) => (
                          <li key={i}>{c.title} ({c.modules?.length || 0} modules)</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: "#64748b", margin: 0 }}>No courses created yet.</p>
                    )}

                    <hr style={{ border: "0", borderTop: "1px solid #e2e8f0", margin: "16px 0" }} />
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#0f172a" }}>Override Rating</h3>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: rating >= star ? "#eab308" : "#cbd5e1",
                            padding: 0,
                          }}
                        >
                          <Star size={24} fill={rating >= star ? "#eab308" : "none"} />
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>
                      Note: Updating rating is frontend-only for now.
                    </p>
                  </>
                ) : (
                  <p style={{ color: "#64748b", marginTop: "16px" }}>No specific tutor profile details available.</p>
                )}
              </div>
            </div>
            <div style={S.modalFooter}>
              {viewingUserDetails.details && (
                <button 
                  style={S.btnPrimary} 
                  onClick={() => alert(`Rating ${rating} saved (frontend only)!`)}
                >
                  Save Rating
                </button>
              )}
              <button style={S.btnGhost} onClick={() => setIsViewModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
