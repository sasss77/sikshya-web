"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAdminCourseByIdAction } from "@/lib/actions/admin-actions";
import { ArrowLeft, Loader2, BookOpen, Clock, FileText, Video, AlignLeft, Download } from "lucide-react";
import Link from "next/link";

const S: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    overflow: "hidden",
    padding: "24px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "16px",
    marginBottom: "24px",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    borderRadius: "8px",
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  meta: {
    display: "flex",
    gap: "24px",
    marginBottom: "24px",
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  metaItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  metaLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#334155",
  },
  moduleCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    marginBottom: "16px",
    overflow: "hidden",
  },
  moduleHeader: {
    backgroundColor: "#f8fafc",
    padding: "16px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  moduleTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
  },
  contentList: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  contentItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "12px",
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
  },
};

const contentTypeIcon = (type: string) => {
  if (type === "video") return <Video size={18} color="#8b5cf6" />;
  if (type === "pdf") return <FileText size={18} color="#ef4444" />;
  return <AlignLeft size={18} color="#3b82f6" />;
};

export default function AdminCourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      const res = await getAdminCourseByIdAction(id);
      if (res.success && res.data) {
        setCourse(res.data);
      } else {
        setError(res.message || "Failed to load course details");
      }
      setLoading(false);
    };
    loadCourse();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "48px", textAlign: "center" }}>
        <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto", color: "#3b82f6" }} />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div style={S.container}>
        <div style={{ textAlign: "center", padding: "48px", color: "#ef4444" }}>
          <p>{error || "Course not found"}</p>
          <button onClick={() => router.back()} style={{ ...S.backBtn, margin: "16px auto 0" }}>
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.container}>
      <div style={S.header}>
        <button onClick={() => router.back()} style={S.backBtn}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={S.title}>{course.title}</h1>
      </div>

      <div style={S.meta}>
        <div style={S.metaItem}>
          <span style={S.metaLabel}>Tutor</span>
          <span style={S.metaValue}>{course.tutorName}</span>
        </div>
        <div style={S.metaItem}>
          <span style={S.metaLabel}>Price</span>
          <span style={S.metaValue}>Rs. {course.price}</span>
        </div>
        <div style={S.metaItem}>
          <span style={S.metaLabel}>Level</span>
          <span style={S.metaValue}>{course.level}</span>
        </div>
        <div style={S.metaItem}>
          <span style={S.metaLabel}>Modules</span>
          <span style={S.metaValue}>{course.modules?.length || 0}</span>
        </div>
      </div>

      <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Course Curriculum</h2>
      
      {course.modules && course.modules.length > 0 ? (
        course.modules.map((module: any, idx: number) => (
          <div key={idx} style={S.moduleCard}>
            <div style={S.moduleHeader}>
              <BookOpen size={20} color="#64748b" />
              <h3 style={S.moduleTitle}>
                Module {idx + 1}: {module.title}
              </h3>
            </div>
            
            <div style={S.contentList}>
              {module.contents && module.contents.length > 0 ? (
                module.contents.map((content: any, cIdx: number) => (
                  <div key={cIdx} style={S.contentItem}>
                    {contentTypeIcon(content.type)}
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "14px", color: "#0f172a" }}>
                        {content.title}
                      </p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#64748b", textTransform: "capitalize" }}>
                        {content.type}
                      </p>
                      {content.type === "text" ? (
                        <div style={{ marginTop: "8px", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "6px", fontSize: "13px", color: "#334155", border: "1px solid #e2e8f0" }}>
                          {content.urlOrText}
                        </div>
                      ) : (
                        <a href={content.urlOrText} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "8px", fontSize: "13px", color: "#3b82f6", textDecoration: "none", fontWeight: 500 }}>
                          <Download size={14} /> View File
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8", fontStyle: "italic" }}>
                  No contents in this module.
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p style={{ color: "#64748b", fontStyle: "italic" }}>This course has no modules yet.</p>
      )}
    </div>
  );
}
