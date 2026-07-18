"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import {
  BookOpen, Plus, X, ChevronLeft, GripVertical, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Video, FileText, AlignLeft, File, Trash2, UploadCloud
} from "lucide-react";
import {
  fetchMyCoursesAction,
  addModuleAction,
  deleteModuleAction,
  addModuleContentAction,
  deleteModuleContentAction,
  uploadCourseFileAction,
} from "@/lib/actions/course-action";

export default function CourseContentsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [moduleInput, setModuleInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!user || !courseId) return;
    fetchMyCoursesAction().then(res => {
      if (res.success && res.data) {
        const found = res.data.find((c: any) => c._id === courseId || c.id === courseId);
        setCourse(found || null);
      }
      setPageLoading(false);
    });
  }, [user, courseId]);

  const handleAddModule = async () => {
    if (!moduleInput.trim()) return;
    setAdding(true);
    const res = await addModuleAction(courseId, moduleInput.trim());
    if (res.success) {
      setCourse((prev: any) => ({ ...prev, modules: res.data }));
      setModuleInput("");
      showToast("Module added!");
    } else {
      showToast(res.error || "Failed to add module", "error");
    }
    setAdding(false);
  };

  const handleDeleteModule = async (index: number) => {
    const res = await deleteModuleAction(courseId, index);
    if (res.success) {
      setCourse((prev: any) => ({ ...prev, modules: res.data }));
      showToast("Module removed.", "error");
    } else {
      showToast(res.error || "Failed to remove module", "error");
    }
    setConfirmDeleteIdx(null);
  };

  const handleUpdateModules = (newModules: any[]) => {
    setCourse((prev: any) => ({ ...prev, modules: newModules }));
  };

  if (loading || pageLoading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <AlertCircle size={48} color="#ef4444" />
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1a202c" }}>Course not found</h2>
        <button onClick={() => router.push("/dashboard/my-courses")} style={{ background: "#0B4085", color: "#fff", border: "none", borderRadius: "10px", padding: "0.65rem 1.5rem", fontWeight: 700, cursor: "pointer" }}>
          Back to My Courses
        </button>
      </div>
    );
  }

  const modules: any[] = course.modules || [];

  return (
    <>
      <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            <button
              onClick={() => router.push("/dashboard/my-courses")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem", fontWeight: 500 }}
            >
              <ChevronLeft size={16} /> My Courses
            </button>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#1a202c", margin: "0 0 0.1rem", letterSpacing: "-0.02em" }}>
                {course.title}
              </h1>
              <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                {course.level}{course.subject ? ` · ${course.subject}` : ""} · Rs. {course.price}/session
              </p>
            </div>
          </div>

          {/* Add Module */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0", marginBottom: "1.5rem", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a202c", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Plus size={17} color="#0B4085" /> Add New Module
            </h2>
            <div style={{ display: "flex", gap: "0.65rem" }}>
              <input
                value={moduleInput}
                onChange={e => setModuleInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddModule())}
                placeholder="e.g. Introduction to Kinematics"
                style={{ flex: 1, padding: "0.7rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
              />
              <button
                onClick={handleAddModule}
                disabled={adding || !moduleInput.trim()}
                style={{
                  background: adding || !moduleInput.trim() ? "#94a3b8" : "linear-gradient(135deg, #0B4085, #1a56b3)",
                  color: "#fff", border: "none", borderRadius: "10px", padding: "0.7rem 1.5rem",
                  fontWeight: 700, cursor: adding ? "not-allowed" : "pointer", fontSize: "0.875rem",
                  transition: "background 0.2s"
                }}
              >
                {adding ? "Adding…" : "Add"}
              </button>
            </div>
          </div>

          {/* Module List */}
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a202c", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BookOpen size={17} color="#8b5cf6" /> Course Modules
              </h2>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "0.2rem 0.65rem", borderRadius: "999px" }}>
                {modules.length} module{modules.length !== 1 ? "s" : ""}
              </span>
            </div>

            {modules.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center" }}>
                <BookOpen size={40} color="#cbd5e0" style={{ margin: "0 auto 0.75rem" }} />
                <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0 }}>No modules yet. Add your first module above.</p>
              </div>
            ) : (
              <div>
                {modules.map((m, i) => (
                  <ModuleItem 
                    key={i} 
                    module={m} 
                    index={i} 
                    courseId={courseId} 
                    onDelete={() => setConfirmDeleteIdx(i)} 
                    onUpdateModules={handleUpdateModules}
                    showToast={showToast}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Toast */}
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

      {/* Confirm Delete Module */}
      {confirmDeleteIdx !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "380px", textAlign: "center" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <X size={24} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.4rem" }}>Remove Module?</h3>
            <p style={{ fontSize: "0.875rem", color: "#64748b", margin: "0 0 1.5rem" }}>
              &quot;{modules[confirmDeleteIdx]?.title}&quot; will be permanently removed.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setConfirmDeleteIdx(null)} style={{ flex: 1, padding: "0.7rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontWeight: 700, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={() => handleDeleteModule(confirmDeleteIdx!)} style={{ flex: 1, padding: "0.7rem", borderRadius: "10px", border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                Remove
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
        }.module-row:hover { background: #f8fafc; }
        .content-row:hover { background: #f1f5f9; }
      `}</style>
    </>
  );
}

function ModuleItem({ module, index, courseId, onDelete, onUpdateModules, showToast }: any) {
  const [expanded, setExpanded] = useState(false);
  
  const [contentType, setContentType] = useState("video");
  const [contentTitle, setContentTitle] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);
  const [addingContent, setAddingContent] = useState(false);

  const contents = module.contents || [];

  const handleAddContent = async () => {
    if (!contentTitle.trim()) return;
    const isFileUpload = contentType === "pdf" || contentType === "file";
    if (isFileUpload && !selectedFile) return;
    if (!isFileUpload && !contentUrl.trim()) return;

    setAddingContent(true);
    let finalUrl = contentUrl.trim();

    if (isFileUpload && selectedFile) {
      const formData = new FormData();
      formData.append("courseFile", selectedFile);
      const uploadRes = await uploadCourseFileAction(formData);
      if (!uploadRes.success) {
        showToast(uploadRes.error || "Failed to upload file", "error");
        setAddingContent(false);
        return;
      }
      finalUrl = uploadRes.url;
    }

    const res = await addModuleContentAction(courseId, index, {
      type: contentType,
      title: contentTitle.trim(),
      urlOrText: finalUrl
    });

    if (res.success) {
      onUpdateModules(res.data);
      setContentTitle("");
      setContentUrl("");
      setSelectedFile(null);
      showToast("Content added!");
    } else {
      showToast(res.error || "Failed to add content", "error");
    }
    setAddingContent(false);
  };

  const handleDeleteContent = async (contentIndex: number) => {
    const res = await deleteModuleContentAction(courseId, index, contentIndex);
    if (res.success) {
      onUpdateModules(res.data);
      showToast("Content deleted.");
    } else {
      showToast(res.error || "Failed to delete content", "error");
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video": return <Video size={16} color="#ef4444" />;
      case "pdf": return <FileText size={16} color="#f59e0b" />;
      case "text": return <AlignLeft size={16} color="#8b5cf6" />;
      default: return <File size={16} color="#3b82f6" />;
    }
  };

  return (
    <div style={{ borderBottom: "1px solid #e2e8f0" }}>
      <div
        className="module-row"
        style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}
      >
        <GripVertical size={16} color="#cbd5e0" style={{ flexShrink: 0 }} />
        <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#e8eef7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0B4085" }}>{index + 1}</span>
        </div>
        <p style={{ flex: 1, fontSize: "0.95rem", fontWeight: 600, color: "#334155", margin: 0 }}>{module.title}</p>
        
        <span style={{ fontSize: "0.75rem", color: "#64748b", background: "#f1f5f9", padding: "0.2rem 0.5rem", borderRadius: "6px" }}>
          {contents.length} item{contents.length !== 1 ? "s" : ""}
        </span>
        
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{ background: "none", border: "none", padding: "0.3rem", cursor: "pointer", display: "flex" }}
          title="Delete Module"
        >
          <X size={16} color="#ef4444" />
        </button>
        {expanded ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
      </div>

      {expanded && (
        <div style={{ padding: "0 1.5rem 1.5rem 4rem", background: "#f8fafc" }}>
          
          {/* Content List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem", paddingTop: "0.5rem" }}>
            {contents.map((c: any, i: number) => (
              <div key={i} className="content-row" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
                {getContentIcon(c.type)}
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b", margin: "0 0 0.1rem" }}>{c.title}</p>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {c.urlOrText}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteContent(i)}
                  style={{ background: "#fee2e2", border: "none", borderRadius: "6px", padding: "0.3rem", cursor: "pointer", display: "flex", alignItems: "center" }}
                >
                  <Trash2 size={14} color="#ef4444" />
                </button>
              </div>
            ))}
            {contents.length === 0 && (
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic", margin: "0.5rem 0" }}>No content in this module yet.</p>
            )}
          </div>

          {/* Add Content Form */}
          <div style={{ background: "#fff", padding: "1rem", borderRadius: "10px", border: "1px dashed #cbd5e0" }}>
            <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569", margin: "0 0 0.75rem" }}>Add Content</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <select
                  value={contentType}
                  onChange={e => setContentType(e.target.value)}
                  style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.85rem", outline: "none", background: "#f8fafc", minWidth: "100px" }}
                >
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                  <option value="text">Text</option>
                  <option value="file">File</option>
                </select>
                <input
                  placeholder="Content Title"
                  value={contentTitle}
                  onChange={e => setContentTitle(e.target.value)}
                  style={{ flex: 1, padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.85rem", outline: "none" }}
                />
              </div>
              
              {/* Conditional Input: File Dropzone or Text/URL input */}
              {contentType === "pdf" || contentType === "file" ? (
                <div 
                  style={{
                    border: "2px dashed #cbd5e0", borderRadius: "8px", padding: "1.5rem",
                    textAlign: "center", background: "#f8fafc", cursor: "pointer", transition: "all 0.2s"
                  }}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = contentType === "pdf" ? ".pdf" : "*/*";
                    input.onchange = (e: any) => {
                      if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                    };
                    input.click();
                  }}
                >
                  <UploadCloud size={28} color="#94a3b8" style={{ margin: "0 auto 0.5rem" }} />
                  {selectedFile ? (
                    <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#0B4085" }}>{selectedFile.name}</p>
                  ) : (
                    <>
                      <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>
                        Click to upload or drag and drop
                      </p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>
                        {contentType === "pdf" ? "PDF files up to 10MB" : "Any file up to 50MB"}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    placeholder={contentType === "text" ? "Enter text content..." : "Enter URL or Drive link..."}
                    value={contentUrl}
                    onChange={e => setContentUrl(e.target.value)}
                    style={{ flex: 1, padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.85rem", outline: "none" }}
                  />
                </div>
              )}

              {/* Action Button */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={handleAddContent}
                  disabled={addingContent || !contentTitle.trim() || ((contentType === "pdf" || contentType === "file") ? !selectedFile : !contentUrl.trim())}
                  style={{
                    background: addingContent || !contentTitle.trim() || ((contentType === "pdf" || contentType === "file") ? !selectedFile : !contentUrl.trim()) ? "#cbd5e0" : "#0B4085",
                    color: "#fff", border: "none", borderRadius: "8px", padding: "0.5rem 1.25rem",
                    fontWeight: 600, cursor: addingContent ? "not-allowed" : "pointer", fontSize: "0.85rem",
                  }}
                >
                  {addingContent ? "Adding..." : "Add Content"}
                </button>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
