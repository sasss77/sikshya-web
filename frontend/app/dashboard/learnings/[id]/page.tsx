"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import { 
  ChevronLeft, 
  PlayCircle, 
  CheckCircle2, 
  Lock, 
  FileText,
  Download,
  MessageCircle,
  Calendar
} from "lucide-react";
import { fetchLearningsAction, toggleTopicAction } from "@/lib/actions/enrollment-action";

export default function CourseDetailsPage() {
  const { user, loading } = useUser();
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : String(params.id);

  const [activeModule, setActiveModule] = useState(0);

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<{ title: string; done: boolean }[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }

    if (user && user.role === "student") {
      const loadCourse = async () => {
        const res = await fetchLearningsAction();
        if (res.success) {
          const enrolled = res.data.find((c: any) => String(c.id) === id);
          if (enrolled) {
            setCourse({
              ...enrolled,
              subject: enrolled.courseName,
            });
            setModules(enrolled.topics.map((t: any) => ({ title: t.label, done: t.done })));
          }
        }
      };
      
      loadCourse();
    }
  }, [user, loading, router, id]);

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
        <button onClick={() => router.push("/dashboard/learnings")} className="btn-primary" style={{ cursor: "pointer" }}>
          <ChevronLeft size={16} /> Back to Learnings
        </button>
      </div>
    );
  }

  const handleToggleTopic = async (index: number) => {
    // Optimistic UI update
    const updatedModules = [...modules];
    const newDoneState = !updatedModules[index].done;
    updatedModules[index].done = newDoneState;
    setModules(updatedModules);

    // Backend update
    const res = await toggleTopicAction(id, index, newDoneState);
    if (!res.success) {
      // Revert if failed
      updatedModules[index].done = !newDoneState;
      setModules([...updatedModules]);
      alert("Failed to update progress: " + res.error);
    }
  };

  return (
    <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)", display: "flex", flexDirection: "column" }}>
      {/* ── Back link ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0.85rem 1.5rem" }}>
          <button
            onClick={() => router.push("/dashboard/learnings")}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", fontWeight: 500, color: "#64748b", textDecoration: "none", border: "none", background: "none", cursor: "pointer" }}
          >
            <ChevronLeft size={16} /> Back to Learnings
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem", width: "100%", flex: 1, display: "flex", gap: "2rem", flexDirection: "row", flexWrap: "wrap" }}>
        
        {/* Main Content Area */}
        <div style={{ flex: "1 1 65%", minWidth: "300px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Header Info */}
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#1a202c", margin: "0 0 0.5rem" }}>
              {course.subject}
            </h1>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <p style={{ fontSize: "0.95rem", color: "#64748b", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                By <strong style={{ color: "#374151" }}>{course.tutorName}</strong>
              </p>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button 
                  onClick={() => router.push("/dashboard/bookings")}
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.85rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, color: "#475569", cursor: "pointer" }}
                >
                  <Calendar size={14} /> View Booking
                </button>
                <button 
                  onClick={() => router.push("/dashboard/messages")}
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.85rem", background: "var(--color-primary)", border: "none", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, color: "#fff", cursor: "pointer" }}
                >
                  <MessageCircle size={14} /> Message Tutor
                </button>
              </div>
            </div>
          </div>

          {/* Video Player Placeholder */}
          <div style={{ 
            width: "100%", aspectRatio: "16/9", background: "#0f172a", borderRadius: "16px", 
            overflow: "hidden", position: "relative", boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #1e293b"
          }}>
            <div style={{ textAlign: "center", color: "#fff", cursor: "pointer", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "url('https://images.unsplash.com/photo-1610484826917-0f101a7bf7f4?auto=format&fit=crop&q=80&w=1200') center/cover" }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.6)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", transition: "transform 0.2s" }} className="play-btn">
                  <PlayCircle size={32} color="#fff" />
                </div>
                <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{modules[activeModule]?.title || "Topic"}</p>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a202c", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FileText size={18} color="#0B4085" /> Resources & Notes
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[1, 2].map(n => (
                <div key={n} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FileText size={16} color="#4f46e5" />
                    </div>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>Lecture Notes - Module {activeModule + 1}.pdf</span>
                  </div>
                  <button style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div style={{ flex: "1 1 30%", minWidth: "280px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", position: "sticky", top: "2rem" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1a202c", margin: 0 }}>Course Syllabus</h3>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16a34a", background: "#dcfce7", padding: "0.2rem 0.5rem", borderRadius: "999px" }}>{course.progress}%</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {modules.map((mod, i) => (
                <button
                  key={i}
                  onClick={() => setActiveModule(i)}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem", width: "100%",
                    padding: "1rem 1.5rem", background: activeModule === i ? "#f0f9ff" : "#fff",
                    border: "none", borderBottom: "1px solid #f1f5f9", textAlign: "left",
                    cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                  className="module-btn"
                >
                  <div style={{ 
                    width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                    background: mod.done ? "#22c55e" : (activeModule === i ? "#0ea5e9" : "#e2e8f0"),
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {mod.done ? <CheckCircle2 size={14} color="#fff" onClick={(e) => { e.stopPropagation(); handleToggleTopic(i); }} style={{ cursor: "pointer" }} /> : <PlayCircle size={12} color={activeModule === i ? "#fff" : "#64748b"} onClick={(e) => { e.stopPropagation(); handleToggleTopic(i); }} style={{ cursor: "pointer" }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: activeModule === i ? 700 : 500, color: activeModule === i ? "#0369a1" : "#475569", margin: 0 }}>
                      {mod.title}
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "#94a3b8", margin: "0.15rem 0 0" }}>15 mins</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .play-btn:hover { transform: scale(1.1); background: rgba(255,255,255,0.3) !important; }
        .module-btn:hover { background: #f8fafc !important; }
      `}</style>
    </div>
  );
}
