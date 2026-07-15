"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import { 
  ChevronLeft, 
  PlayCircle, 
  CheckCircle2, 
  FileText,
  Plus,
  Trash2,
  Save,
  Link as LinkIcon
} from "lucide-react";
import { INITIAL_COURSES } from "../page";

export default function CourseEditorPage() {
  const { user, loading } = useUser();
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const course = INITIAL_COURSES.find(c => c.id === id);

  const [activeModule, setActiveModule] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [resources, setResources] = useState<{name: string}[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== "tutor")) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Course not found</h2>
        <button onClick={() => router.push("/dashboard/my-courses")} style={{ background: "#0B4085", color: "#fff", border: "none", borderRadius: "8px", padding: "0.6rem 1.25rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
          <ChevronLeft size={16} /> Back to Courses
        </button>
      </div>
    );
  }

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveModule = () => {
    showToast("Module contents saved successfully!");
  };

  const handleAddResource = () => {
    // This is handled in the file input onChange now
  };

  const handleRemoveResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
    showToast("Resource removed!");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "0.9rem", outline: "none",
    fontFamily: "inherit", color: "#1e293b", background: "#f8fafc", boxSizing: "border-box"
  };

  return (
    <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)", display: "flex", flexDirection: "column" }}>
      {/* ── Back link ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0.85rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => router.push("/dashboard/my-courses")}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", fontWeight: 500, color: "#64748b", textDecoration: "none", border: "none", background: "none", cursor: "pointer" }}
          >
            <ChevronLeft size={16} /> Back to Courses
          </button>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10b981", background: "#dcfce7", padding: "0.25rem 0.75rem", borderRadius: "999px" }}>
            Tutor Editor Mode
          </span>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem", width: "100%", flex: 1, display: "flex", gap: "2rem", flexDirection: "row", flexWrap: "wrap" }}>
        
        {/* Main Content Area (Editor) */}
        <div style={{ flex: "1 1 65%", minWidth: "300px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Header Info */}
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#1a202c", margin: "0 0 0.5rem" }}>
              {course.title}
            </h1>
            <p style={{ fontSize: "0.95rem", color: "#64748b", margin: 0 }}>
              Module Editor: <strong style={{ color: "#374151" }}>{course.modules[activeModule]?.title}</strong>
            </p>
          </div>

          {/* Video URL Editor */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a202c", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <PlayCircle size={18} color="#0B4085" /> Video Lesson URL
            </h3>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <LinkIcon size={16} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  style={{ ...inputStyle, paddingLeft: "2.5rem" }} 
                  placeholder="e.g. https://youtube.com/watch?v=..." 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Resources Editor */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a202c", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FileText size={18} color="#0B4085" /> Resources & Notes
            </h3>
            
            {/* Add Resource Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem", background: "#f8fafc", border: "1px dashed #cbd5e0", padding: "1.5rem", borderRadius: "12px", alignItems: "center" }}>
              <FileText size={32} color="#94a3b8" />
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "#334155", margin: "0 0 0.5rem" }}>Upload PDF or Document</p>
                <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>Drag and drop or click to browse</p>
              </div>
              <label style={{
                background: "linear-gradient(135deg, #0B4085, #1a56b3)", color: "#fff", 
                borderRadius: "10px", padding: "0.6rem 1.5rem", fontWeight: 600, 
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.4rem",
                fontSize: "0.875rem", boxShadow: "0 4px 12px rgba(11,64,133,0.15)", transition: "transform 0.15s"
              }} className="upload-btn">
                <Plus size={16} /> Select File
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  style={{ display: "none" }} 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setResources([...resources, { name: file.name }]);
                      showToast(`Added ${file.name} successfully!`);
                    }
                    e.target.value = ''; // Reset input
                  }}
                />
              </label>
            </div>

            {/* List of Resources */}
            {resources.length === 0 ? (
              <div style={{ padding: "1.5rem", background: "#f8fafc", borderRadius: "8px", textAlign: "center", color: "#64748b", fontSize: "0.85rem", border: "1px dashed #cbd5e0" }}>
                No resources added for this module yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {resources.map((res, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileText size={16} color="#4f46e5" />
                      </div>
                      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>{res.name}</span>
                    </div>
                    <button onClick={() => handleRemoveResource(i)} style={{ background: "#fee2e2", border: "none", color: "#ef4444", borderRadius: "6px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overall Save Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button 
              onClick={handleSaveModule}
              style={{ 
                background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", 
                border: "none", borderRadius: "10px", padding: "0.8rem 2rem", 
                fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", 
                gap: "0.5rem", fontSize: "1rem", boxShadow: "0 4px 15px rgba(34,197,94,0.3)",
                transition: "transform 0.2s"
              }}
              className="save-module-btn"
            >
              <Save size={20} /> Save Module Changes
            </button>
          </div>
        </div>

        {/* Sidebar (Syllabus Navigation) */}
        <div style={{ flex: "1 1 30%", minWidth: "280px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", position: "sticky", top: "2rem" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1a202c", margin: 0 }}>Course Syllabus</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {course.modules.map((mod, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveModule(i);
                    // Reset editor state when switching modules (in a real app, you'd fetch the module data)
                    setVideoUrl("");
                    setResources([]);
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem", width: "100%",
                    padding: "1rem 1.5rem", background: activeModule === i ? "#f0f9ff" : "#fff",
                    border: "none", borderBottom: "1px solid #f1f5f9", textAlign: "left",
                    cursor: "pointer", transition: "background 0.2s"
                  }}
                  className="module-btn"
                >
                  <div style={{ 
                    width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                    background: activeModule === i ? "#0ea5e9" : "#e2e8f0",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <PlayCircle size={12} color={activeModule === i ? "#fff" : "#64748b"} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: activeModule === i ? 700 : 500, color: activeModule === i ? "#0369a1" : "#475569", margin: 0 }}>
                      {mod.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed", top: "5.5rem", right: "2rem", zIndex: 1000,
          background: toast.type === "success" ? "#22c55e" : "#ef4444",
          color: "#fff", padding: "1rem 1.5rem", borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: "0.75rem",
          fontWeight: 600, fontSize: "0.95rem", animation: "toastSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : null}
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastSlideDown {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .module-btn:hover { background: #f8fafc !important; }
        .upload-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(11,64,133,0.2) !important; }
        .save-module-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(34,197,94,0.4) !important; }
      `}</style>
    </div>
  );
}
