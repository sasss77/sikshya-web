"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import logoIcon from "@/app/assets/mortarboard.png";
import {
  BookOpen,
  Calendar,
  ArrowLeft,
  GraduationCap,
  MessageCircle,
  User,
} from "lucide-react";
import Link from "next/link";
import { getStudentByIdAction } from "@/lib/actions/student-action";
import { useUser } from "@/lib/context/UserContext";

const getInitials = (name: string) => {
  if (!name) return "U";
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
};

const getAvatarColor = (name: string) => {
  const colors = ["#0B4085", "#0ea5e9", "#7c3aed", "#ec4899", "#f59e0b", "#22c55e"];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const id = String(params.id);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const loadStudent = async () => {
      const res = await getStudentByIdAction(id);
      if (res.success) {
        const s = res.data;
        setStudent({
          id: s.id,
          name: s.fullName,
          institution: s.institution,
          gradeLevel: s.gradeLevel,
          subjects: s.subjects || [],
          bio: s.bio,
          joinedAt: s.joinedAt,
          initials: getInitials(s.fullName),
          avatarColor: getAvatarColor(s.fullName),
          profileImage: s.profileImage,
        });
      } else {
        setError(res.message);
      }
      setLoading(false);
    };
    loadStudent();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0ea5e9", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#f8fafc", flexDirection: "column", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b" }}>Student Not Found</h2>
        <p style={{ color: "#64748b" }}>{error || "The requested student profile could not be found."}</p>
        <button onClick={() => router.back()} style={{ padding: "0.75rem 1.5rem", background: "#0ea5e9", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4f7fa", paddingBottom: "4rem", fontFamily: "var(--font-inter)" }}>
      {/* Dynamic Profile Cover */}
      <div style={{ 
        height: "280px", 
        background: `linear-gradient(135deg, ${student.avatarColor}88 0%, ${student.avatarColor} 100%)`, 
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Animated Background Elements */}
        <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "-100px", left: "10%", width: "300px", height: "300px", background: "rgba(255,255,255,0.15)", borderRadius: "50%", filter: "blur(60px)" }} />
        
        {/* Custom Header within banner */}
        <div style={{ position: "absolute", top: "1.5rem", left: "2rem", right: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/dashboard" style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(255,255,255,0.2)", padding: "0.5rem 1rem", borderRadius: "12px",
              backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.5px",
              textDecoration: "none", transition: "all 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
            >
              <Image src={logoIcon} alt="Sikshya" width={26} height={26} style={{ filter: "brightness(0) invert(1)" }} />
              Sikshya
            </Link>
          </div>

          <button
            onClick={() => router.back()}
            style={{
              background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff",
              width: "44px", height: "44px", borderRadius: "12px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", backdropFilter: "blur(10px)", transition: "all 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
            title="Go Back"
          >
            <ArrowLeft size={22} />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "850px", margin: "0 auto", padding: "0 1.5rem", position: "relative", top: "-90px" }}>
        
        {/* Glassmorphism Main Info Card */}
        <div style={{ 
          background: "rgba(255, 255, 255, 0.9)", 
          backdropFilter: "blur(16px)",
          borderRadius: "24px", 
          padding: "2.5rem", 
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)", 
          marginBottom: "2rem",
          border: "1px solid rgba(255,255,255,1)"
        }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            
            {/* Avatar */}
            <div style={{
              width: "140px", height: "140px", borderRadius: "28px",
              background: student.avatarColor, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "3rem", fontWeight: 800, color: "#fff",
              border: "6px solid #fff", boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
              flexShrink: 0, transform: "translateY(-10px)",
              position: "relative", overflow: "hidden"
            }}>
              {student.profileImage ? (
                <img src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${student.profileImage}`} alt={student.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                student.initials
              )}
            </div>

            {/* Title & Meta */}
            <div style={{ flex: 1, paddingBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
                  {student.name}
                </h1>
                <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 700 }}>
                  Student
                </span>
              </div>
              
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569", fontSize: "1rem", fontWeight: 500 }}>
                  <GraduationCap size={18} color={student.avatarColor} /> {student.gradeLevel}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569", fontSize: "1rem", fontWeight: 500 }}>
                  <BookOpen size={18} color={student.avatarColor} /> {student.institution}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569", fontSize: "1rem", fontWeight: 500 }}>
                  <Calendar size={18} color={student.avatarColor} /> Joined {new Date(student.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              onClick={() => router.push(`/dashboard/messages?userId=${student?.id}`)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                background: isHovered ? "#0B4085" : student.avatarColor, color: "#fff", border: "none", borderRadius: "14px",
                padding: "1rem", fontSize: "1.05rem", fontWeight: 700, cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isHovered ? "0 8px 20px rgba(11,64,133,0.3)" : `0 4px 12px ${student.avatarColor}40`,
                transform: isHovered ? "translateY(-2px)" : "translateY(0)"
              }}
            >
              <MessageCircle size={20} /> Direct Message
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          
          {/* About Section */}
          <div style={{ 
            background: "#fff", borderRadius: "20px", padding: "2rem", 
            boxShadow: "0 4px 15px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9",
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.03)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={18} color={student.avatarColor} />
              </div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>About {student.name.split(" ")[0]}</h2>
            </div>
            <p style={{ color: "#475569", lineHeight: 1.8, fontSize: "1.05rem", margin: 0 }}>
              {student.bio || "This student hasn't provided a biography yet."}
            </p>
          </div>

          {/* Subjects of Interest */}
          <div style={{ 
            background: "#fff", borderRadius: "20px", padding: "2rem", 
            boxShadow: "0 4px 15px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9",
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.03)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BookOpen size={18} color={student.avatarColor} />
              </div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>Learning Goals</h2>
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {student.subjects.length > 0 ? (
                student.subjects.map((subject: string, idx: number) => (
                  <span key={idx} style={{
                    padding: "0.6rem 1.25rem", background: `${student.avatarColor}15`, 
                    color: student.avatarColor, borderRadius: "12px", 
                    fontSize: "0.95rem", fontWeight: 600, border: `1px solid ${student.avatarColor}30`,
                    boxShadow: `0 2px 4px ${student.avatarColor}10`
                  }}>
                    {subject}
                  </span>
                ))
              ) : (
                <span style={{ color: "#94a3b8", fontSize: "1rem", fontStyle: "italic" }}>No specific subjects listed yet.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
