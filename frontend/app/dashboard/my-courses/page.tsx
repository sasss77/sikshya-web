"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import {
  BookOpen, Plus, X, ChevronRight, Edit3, Users,
  DollarSign, Award, Search
} from "lucide-react";
import {
  fetchMyCoursesAction,
  createCourseAction,
  editCourseAction,
  deleteCourseAction,
} from "@/lib/actions/course-action";

const LEVELS_LIST = ["SEE", "+2 Science", "+2 Management", "Bachelor", "Entrance Prep"];

export interface Module { title: string }
export interface Course {
  id: number; title: string; subject: string; level: string;
  price: string; modules: Module[]; students: number; color: string;
}

export const INITIAL_COURSES: Course[] = [];

const COLORS = ["#0B4085", "#0ea5e9", "#8b5cf6", "#22c55e", "#f59e0b", "#ec4899"];

function CourseFormModal({
  existing, onSave, onClose
}: {
  existing?: Course | null;
  onSave: (c: Omit<Course, "id" | "students">) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(existing?.title || "");
  const [subject, setSubject] = useState(existing?.subject || "");
  const [level, setLevel] = useState(existing?.level || "");
  const [price, setPrice] = useState(existing?.price || "");
  const [color, setColor] = useState(existing?.color || COLORS[0]);
  const [modules, setModules] = useState<Module[]>(existing?.modules || []);
  const [moduleInput, setModuleInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const addModule = () => {
    if (!moduleInput.trim()) return;
    setModules(m => [...m, { title: moduleInput.trim() }]);
    setModuleInput("");
  };

  const handleSave = () => {
    if (!title || !subject || !level || !price) {
      setErrorMsg("Please fill all required fields before saving.");
      return;
    }
    setErrorMsg("");
    onSave({ title, subject, level, price, modules, color });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.7rem 1rem", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "0.9rem", outline: "none",
    fontFamily: "inherit", color: "#1e293b", background: "#fff", boxSizing: "border-box"
  };
  const labelStyle: React.CSSProperties = { fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem", display: "block" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflow: "auto", padding: "2rem", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#1a202c", margin: 0 }}>
            {existing ? "Edit Course" : "New Course"}
          </h2>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", padding: "0.4rem", cursor: "pointer" }}>
            <X size={18} color="#64748b" />
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <X size={16} /> {errorMsg}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Course Title *</label>
            <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Complete Mechanics for +2" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Subject *</label>
              <input style={inputStyle} value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Physics" />
            </div>
            <div>
              <label style={labelStyle}>Level *</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={level} onChange={e => setLevel(e.target.value)}>
                <option value="">Select level</option>
                {LEVELS_LIST.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div style={{ maxWidth: "200px" }}>
            <label style={labelStyle}><DollarSign size={12} style={{ display: "inline", marginRight: 4 }} />Session Price (Rs.) *</label>
            <input style={inputStyle} type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 800" />
          </div>

          {/* Card Color */}
          <div>
            <label style={labelStyle}>Card Color</label>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)} style={{
                  width: "28px", height: "28px", borderRadius: "50%", background: c, border: "none", cursor: "pointer",
                  outline: color === c ? `3px solid ${c}` : "none", outlineOffset: "2px"
                }} />
              ))}
            </div>
          </div>

          {/* Modules */}
          <div>
            <label style={labelStyle}>Modules / Topics</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem" }}>
              {modules.map((m, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: color + "18", color: color, fontSize: "0.78rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                  {m.title}
                  <button onClick={() => setModules(ms => ms.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                    <X size={11} color={color} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={moduleInput}
                onChange={e => setModuleInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addModule())}
                placeholder="Type a module and press Enter..."
              />
              <button onClick={addModule} style={{ background: "#f1f5f9", color: "#475569", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "0 1rem", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                Add
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
            <button onClick={onClose} style={{ background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "10px", padding: "0.65rem 1.25rem", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>Cancel</button>
            <button onClick={handleSave} style={{ background: "linear-gradient(135deg, #0B4085, #1a56b3)", color: "#fff", border: "none", borderRadius: "10px", padding: "0.65rem 1.5rem", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem" }}>
              {existing ? "Save Changes" : "Create Course"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyCoursesPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!user || user.role !== "tutor") return;
    fetchMyCoursesAction().then(res => {
      if (res.success && res.data) {
        // Map backend _id to id for UI compatibility
        const mapped = res.data.map((c: any, i: number) => ({
          ...c,
          id: c._id || i,
          price: String(c.price ?? 0),
          students: c.students ?? 0,
          color: c.color || COLORS[i % COLORS.length],
        }));
        setCourses(mapped);
      }
      setPageLoading(false);
    });
  }, [user]);

  if (loading || pageLoading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Omit<Course, "id" | "students">) => {
    if (editingCourse) {
      const res = await editCourseAction(String(editingCourse.id), {
        ...data,
        price: Number(data.price),
      });
      if (res.success) {
        setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, ...data } : c));
        showToast("Course updated successfully!");
      } else {
        showToast(res.error || "Failed to update course", "error");
      }
    } else {
      const res = await createCourseAction({ ...data, price: Number(data.price) });
      if (res.success && res.data) {
        const newCourse = {
          ...res.data,
          id: res.data._id || Date.now(),
          price: String(res.data.price ?? data.price),
          students: 0,
          color: data.color || COLORS[courses.length % COLORS.length],
        };
        setCourses(prev => [...prev, newCourse]);
        showToast("Course created successfully!");
      } else {
        showToast(res.error || "Failed to create course", "error");
      }
    }
    setShowModal(false);
    setEditingCourse(null);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const executeDelete = async () => {
    if (confirmDelete !== null) {
      const res = await deleteCourseAction(confirmDelete);
      if (res.success) {
        setCourses(prev => prev.filter(c => String(c.id) !== confirmDelete));
        showToast("Course deleted successfully.", "error");
      } else {
        showToast(res.error || "Failed to delete course", "error");
      }
      setConfirmDelete(null);
    }
  };

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    setShowModal(true);
  };

  return (
    <>
      {showModal && (
        <CourseFormModal
          existing={editingCourse}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingCourse(null); }}
        />
      )}

      <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

          {/* Page Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #0B4085, #1a56b3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={20} color="#fff" />
                </div>
                <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 900, color: "#1a202c", margin: 0, letterSpacing: "-0.02em" }}>
                  My Courses
                </h1>
              </div>
              <p style={{ fontSize: "0.95rem", color: "#64748b", margin: 0 }}>
                Create and manage the courses you offer to students.
              </p>
            </div>
            <button
              onClick={() => { setEditingCourse(null); setShowModal(true); }}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "linear-gradient(135deg, #0B4085, #1a56b3)", color: "#fff", border: "none", borderRadius: "12px", padding: "0.75rem 1.5rem", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(11,64,133,0.22)" }}
            >
              <Plus size={18} /> Add Course
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
            {[
              { label: "Total Courses", value: courses.length, icon: BookOpen, color: "#0B4085", bg: "#e8eef7" },
              { label: "Total Students", value: courses.reduce((a, c) => a + c.students, 0), icon: Users, color: "#0ea5e9", bg: "#e0f2fe" },
              { label: "Avg. Price", value: `Rs. ${Math.round(courses.reduce((a, c) => a + parseInt(c.price), 0) / Math.max(courses.length, 1))}`, icon: DollarSign, color: "#22c55e", bg: "#dcfce7" },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} style={{ background: "#fff", borderRadius: "14px", padding: "1.25rem 1.5rem", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={21} color={s.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a202c", margin: 0 }}>{s.value}</p>
                    <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0, fontWeight: 500 }}>{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <Search size={16} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search courses..."
              style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.75rem", borderRadius: "12px", border: "1.5px solid #e2e8f0", fontSize: "0.9rem", outline: "none", background: "#fff", boxSizing: "border-box" }}
            />
          </div>

          {/* Course Cards */}
          {filteredCourses.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: "16px", padding: "4rem 2rem", textAlign: "center", border: "1px solid #e2e8f0" }}>
              <BookOpen size={48} color="#cbd5e0" style={{ margin: "0 auto 1rem" }} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.5rem" }}>No courses yet</h3>
              <p style={{ fontSize: "0.875rem", color: "#64748b", margin: "0 0 1.5rem" }}>Create your first course to attract students.</p>
              <button onClick={() => setShowModal(true)} style={{ background: "#0B4085", color: "#fff", border: "none", borderRadius: "10px", padding: "0.65rem 1.5rem", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>
                Create Course
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {filteredCourses.map(course => (
                <div key={course.id} style={{
                  background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden",
                  boxShadow: "0 2px 10px rgba(11,64,133,0.04)", transition: "box-shadow 0.2s ease, transform 0.2s ease",
                }} className="course-card">
                  {/* Color bar */}
                  <div style={{ height: "5px", background: course.color }} />

                  <div style={{ padding: "1.5rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: course.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Award size={24} color={course.color} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                        <div>
                          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.2rem" }}>{course.title}</h3>
                          <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0 0 0.75rem" }}>
                            {course.subject} · {course.level} · Rs. {course.price}/session
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => router.push(`/dashboard/my-courses/${String(course.id)}`)}
                            style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "linear-gradient(135deg, #0ea5e9, #2563eb)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.4rem 0.8rem", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(37,99,235,0.2)" }}
                          >
                            <BookOpen size={13} /> Manage Contents
                          </button>
                          <button
                            onClick={() => openEdit(course)}
                            style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "8px", padding: "0.4rem 0.75rem", fontSize: "0.78rem", fontWeight: 600, color: "#475569", cursor: "pointer" }}
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(String(course.id))}
                            style={{ display: "flex", alignItems: "center", background: "#fee2e2", border: "none", borderRadius: "8px", padding: "0.4rem 0.6rem", cursor: "pointer" }}
                          >
                            <X size={14} color="#ef4444" />
                          </button>
                        </div>
                      </div>

                      {/* Modules */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
                        {course.modules.map((m, i) => (
                          <span key={i} style={{ fontSize: "0.72rem", padding: "0.2rem 0.55rem", background: course.color + "12", color: course.color, borderRadius: "999px", fontWeight: 600 }}>
                            {i + 1}. {m.title}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <Users size={14} color="#94a3b8" /> {course.students} student{course.students !== 1 ? "s" : ""} enrolled
                        </span>
                        <button
                          onClick={() => router.push(`/dashboard/tutor-profile`)}
                          style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", fontWeight: 700, color: course.color, background: "none", border: "none", cursor: "pointer" }}
                        >
                          View in Profile <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed", top: "5rem", right: "2rem", zIndex: 1000,
          background: toast.type === "success" ? "#22c55e" : "#ef4444",
          color: "#fff", padding: "1rem 1.5rem", borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          display: "flex", alignItems: "center", gap: "0.75rem",
          fontWeight: 600, fontSize: "0.95rem",
          animation: "toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          {toast.message}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDelete !== null && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", padding: "1rem"
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "2rem",
            width: "100%", maxWidth: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            textAlign: "center", animation: "modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", background: "#fee2e2", color: "#dc2626" }}>
              <X size={28} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.5rem" }}>Delete Course?</h3>
            <p style={{ fontSize: "0.95rem", color: "#64748b", margin: "0 0 2rem" }}>
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s ease" }}
                className="modal-cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "none", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s ease", background: "#ef4444", color: "#fff", boxShadow: "0 4px 12px rgba(239,68,68,0.2)" }}
                className="modal-delete-btn"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .course-card:hover {
          box-shadow: 0 8px 28px rgba(11,64,133,0.1) !important;
          transform: translateY(-2px);
        }
        .modal-cancel-btn:hover { background: #f1f5f9 !important; }
        .modal-delete-btn:hover { background: #dc2626 !important; }
      `}</style>
    </>
  );
}

