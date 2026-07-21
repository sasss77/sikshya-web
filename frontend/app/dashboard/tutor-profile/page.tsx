"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import {
  User, BookOpen, DollarSign, Calendar, CheckCircle2,
  Plus, X, ChevronLeft, Award, Clock, Globe, MapPin,
  Save
} from "lucide-react";
import { fetchMyTutorProfileAction, saveTutorProfileAction } from "@/lib/actions/tutor-action";

const SUBJECTS_LIST = [
  "Physics", "Chemistry", "Biology", "Mathematics", "Statistics",
  "Economics", "Accounting", "English", "Nepali", "Computer Science",
  "History", "Geography", "Social Studies", "Optional Maths"
];
const LEVELS_LIST = ["SEE", "+2 Science", "+2 Management", "Bachelor", "Entrance Prep"];
const DAYS_LIST = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SESSION_TYPES = ["Online", "In-person", "Both"];

const TABS = [
  { key: "basic", label: "Basic Info", icon: User },
  { key: "teaching", label: "Teaching", icon: BookOpen },
  { key: "availability", label: "Availability", icon: Calendar },
  { key: "courses", label: "My Courses", icon: Award },
];

interface Module { title: string }
interface Course { id: number; title: string; level: string; price: string; modules: Module[] }

export default function TutorProfileSetupPage() {
  const { user } = useUser();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("basic");
  const [saved, setSaved] = useState(false);

  // Basic info
  const [bio, setBio] = useState("");
  const [institution, setInstitution] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [languages, setLanguages] = useState<string[]>(["Nepali"]);
  const [langInput, setLangInput] = useState("");

  // Teaching
  const [subjects, setSubjects] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [sessionTypes, setSessionTypes] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState("");

  // Availability
  const [availDays, setAvailDays] = useState<string[]>([]);

  // Courses
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState<{ title: string; level: string; price: string; moduleInput: string; modules: Module[] }>({
    title: "", level: "", price: "", moduleInput: "", modules: []
  });

  const toggleArr = <T,>(arr: T[], val: T, set: (a: T[]) => void) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const addModule = () => {
    if (!newCourse.moduleInput.trim()) return;
    setNewCourse(c => ({ ...c, modules: [...c.modules, { title: c.moduleInput.trim() }], moduleInput: "" }));
  };

  const saveCourse = () => {
    if (!newCourse.title || !newCourse.level || !newCourse.price) return;
    setCourses(prev => [...prev, { ...newCourse, id: Date.now() }]);
    setNewCourse({ title: "", level: "", price: "", moduleInput: "", modules: [] });
    setShowCourseForm(false);
  };

  React.useEffect(() => {
    if (!user || user.role !== "tutor") return;
    const loadProfile = async () => {
      const res = await fetchMyTutorProfileAction();
      if (res.success && res.data) {
        const p = res.data;
        setBio(p.bio || "");
        setInstitution(p.institution || "");
        setExperience(p.experience || "");
        setLocation(p.location || "");
        setLanguages(p.languages?.length ? p.languages : ["Nepali"]);
        setSubjects(p.subjects || []);
        setLevels(p.levels || []);
        setSessionTypes(p.sessionTypes || []);
        setHourlyRate(p.hourlyRate ? String(p.hourlyRate) : "");
        setAvailDays(p.availDays || []);
        setCourses(p.courses?.map((c: any, i: number) => ({ ...c, id: i })) || []);
      }
    };
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    const data = {
      bio, institution, experience, location, languages,
      subjects, levels, sessionTypes, hourlyRate: Number(hourlyRate) || 0,
      availDays, courses: courses.map(c => ({
        title: c.title, level: c.level, price: Number(c.price), modules: c.modules
      }))
    };
    
    const res = await saveTutorProfileAction(data);
    if (res.success) {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.push("/dashboard");
      }, 1500);
    } else {
      alert(res.error || "Failed to save profile");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.7rem 1rem", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "0.9rem", outline: "none",
    fontFamily: "inherit", color: "#1e293b", background: "#fff", boxSizing: "border-box"
  };
  const labelStyle: React.CSSProperties = { fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem", display: "block" };

  return (
    <div style={{ background: "#f4f6fa", minHeight: "calc(100vh - 68px)" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <button onClick={() => router.push("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem", fontWeight: 500 }}>
            <ChevronLeft size={16} /> Dashboard
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#1a202c", margin: "0 0 0.2rem", letterSpacing: "-0.02em" }}>
              Tutor Profile Setup
            </h1>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
              Complete your profile to appear in search results and attract students.
            </p>
          </div>
          <button
            onClick={handleSave}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: saved ? "#22c55e" : "linear-gradient(135deg, #0B4085, #1a56b3)",
              color: "#fff", border: "none", borderRadius: "10px",
              padding: "0.65rem 1.5rem", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer",
              transition: "background 0.3s"
            }}
          >
            {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Profile</>}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem", background: "#fff", padding: "0.35rem", borderRadius: "14px", border: "1px solid #e2e8f0", width: "fit-content" }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.5rem 1.1rem", borderRadius: "10px", border: "none", cursor: "pointer",
                background: active ? "#0B4085" : "transparent",
                color: active ? "#fff" : "#64748b",
                fontSize: "0.82rem", fontWeight: 700, transition: "all 0.15s"
              }}>
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab: Basic Info ── */}
        {activeTab === "basic" && (
          <div style={{ background: "#fff", borderRadius: "18px", padding: "2rem", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a202c", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <User size={18} color="#0B4085" /> Basic Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Institution / College</label>
                <input style={inputStyle} value={institution} onChange={e => setInstitution(e.target.value)} placeholder="e.g. Pulchowk Campus, IOE" />
              </div>
              <div>
                <label style={labelStyle}>Teaching Experience</label>
                <input style={inputStyle} value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g. 2 years" />
              </div>
              <div>
                <label style={labelStyle}><MapPin size={12} style={{ display: "inline", marginRight: 4 }} />Location</label>
                <input style={inputStyle} value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Kathmandu" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Bio / About You</label>
              <textarea
                style={{ ...inputStyle, resize: "vertical", minHeight: "110px" }}
                value={bio} onChange={e => setBio(e.target.value)}
                placeholder="Tell students about yourself, your qualifications, and teaching style..."
              />
            </div>

            <div>
              <label style={labelStyle}><Globe size={12} style={{ display: "inline", marginRight: 4 }} />Languages</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                {languages.map(l => (
                  <span key={l} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "#e8eef7", color: "#0B4085", fontSize: "0.8rem", fontWeight: 700, padding: "0.25rem 0.65rem", borderRadius: "999px" }}>
                    {l}
                    <button onClick={() => setLanguages(prev => prev.filter(x => x !== l))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                      <X size={12} color="#0B4085" />
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input style={{ ...inputStyle, width: "auto", flex: 1 }} value={langInput} onChange={e => setLangInput(e.target.value)} placeholder="Add language..." />
                <button onClick={() => { if (langInput.trim()) { setLanguages(p => [...p, langInput.trim()]); setLangInput(""); } }}
                  style={{ background: "#0B4085", color: "#fff", border: "none", borderRadius: "10px", padding: "0 1.1rem", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}>
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Teaching ── */}
        {activeTab === "teaching" && (
          <div style={{ background: "#fff", borderRadius: "18px", padding: "2rem", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a202c", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BookOpen size={18} color="#0B4085" /> Teaching Details
            </h2>

            {/* Subjects */}
            <div>
              <label style={labelStyle}>Subjects You Teach</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {SUBJECTS_LIST.map(s => (
                  <button key={s} onClick={() => toggleArr(subjects, s, setSubjects)} style={{
                    padding: "0.35rem 0.85rem", borderRadius: "999px", border: "2px solid",
                    borderColor: subjects.includes(s) ? "#0B4085" : "#e2e8f0",
                    background: subjects.includes(s) ? "#0B4085" : "#fff",
                    color: subjects.includes(s) ? "#fff" : "#64748b",
                    fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
                  }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Levels */}
            <div>
              <label style={labelStyle}>Education Levels</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {LEVELS_LIST.map(l => (
                  <button key={l} onClick={() => toggleArr(levels, l, setLevels)} style={{
                    padding: "0.35rem 0.85rem", borderRadius: "999px", border: "2px solid",
                    borderColor: levels.includes(l) ? "#8b5cf6" : "#e2e8f0",
                    background: levels.includes(l) ? "#8b5cf6" : "#fff",
                    color: levels.includes(l) ? "#fff" : "#64748b",
                    fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
                  }}>{l}</button>
                ))}
              </div>
            </div>

            {/* Session Types */}
            <div>
              <label style={labelStyle}>Session Type</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {SESSION_TYPES.map(t => (
                  <button key={t} onClick={() => toggleArr(sessionTypes, t, setSessionTypes)} style={{
                    padding: "0.4rem 1rem", borderRadius: "10px", border: "2px solid",
                    borderColor: sessionTypes.includes(t) ? "#0ea5e9" : "#e2e8f0",
                    background: sessionTypes.includes(t) ? "#0ea5e9" : "#fff",
                    color: sessionTypes.includes(t) ? "#fff" : "#64748b",
                    fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
                  }}>{t}</button>
                ))}
              </div>
            </div>

            {/* Hourly Rate */}
            <div style={{ maxWidth: "220px" }}>
              <label style={labelStyle}><DollarSign size={12} style={{ display: "inline", marginRight: 4 }} />Session Rate (Rs.)</label>
              <input style={inputStyle} type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} placeholder="e.g. 800" />
            </div>
          </div>
        )}

        {/* ── Tab: Availability ── */}
        {activeTab === "availability" && (
          <div style={{ background: "#fff", borderRadius: "18px", padding: "2rem", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a202c", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Calendar size={18} color="#0B4085" /> Availability
            </h2>
            <div>
              <label style={labelStyle}>Available Days</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {DAYS_LIST.map(d => (
                  <button key={d} onClick={() => toggleArr(availDays, d, setAvailDays)} style={{
                    width: "52px", height: "52px", borderRadius: "12px", border: "2px solid",
                    borderColor: availDays.includes(d) ? "#0B4085" : "#e2e8f0",
                    background: availDays.includes(d) ? "#0B4085" : "#fff",
                    color: availDays.includes(d) ? "#fff" : "#64748b",
                    fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s"
                  }}>{d}</button>
                ))}
              </div>
            </div>
            <div style={{ padding: "1rem", background: "#f0f9ff", borderRadius: "10px", border: "1px solid #bae6fd" }}>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#0369a1", fontWeight: 500 }}>
                <Clock size={14} style={{ display: "inline", marginRight: 6 }} />
                Students can select specific time slots from your available days when booking a session.
              </p>
            </div>
          </div>
        )}

        {/* ── Tab: My Courses ── */}
        {activeTab === "courses" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a202c", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Award size={18} color="#0B4085" /> My Courses
              </h2>
              <button
                onClick={() => setShowCourseForm(true)}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#0B4085", color: "#fff", border: "none", borderRadius: "10px", padding: "0.55rem 1.1rem", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}
              >
                <Plus size={15} /> Add Course
              </button>
            </div>

            {/* Add Course Form */}
            {showCourseForm && (
              <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", border: "2px solid #0B4085" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 1.25rem", color: "#0B4085" }}>New Course</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Course Title</label>
                    <input style={inputStyle} value={newCourse.title} onChange={e => setNewCourse(c => ({ ...c, title: e.target.value }))} placeholder="e.g. Complete Mechanics for +2" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>Level</label>
                      <select style={{ ...inputStyle, cursor: "pointer" }} value={newCourse.level} onChange={e => setNewCourse(c => ({ ...c, level: e.target.value }))}>
                        <option value="">Select level</option>
                        {LEVELS_LIST.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Price (Rs.) per session</label>
                      <input style={inputStyle} type="number" value={newCourse.price} onChange={e => setNewCourse(c => ({ ...c, price: e.target.value }))} placeholder="e.g. 800" />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Modules / Topics</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem" }}>
                      {newCourse.modules.map((m, i) => (
                        <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "#f1f5f9", color: "#475569", fontSize: "0.78rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                          {m.title}
                          <button onClick={() => setNewCourse(c => ({ ...c, modules: c.modules.filter((_, j) => j !== i) }))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                            <X size={11} color="#94a3b8" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        style={{ ...inputStyle, flex: 1 }}
                        value={newCourse.moduleInput}
                        onChange={e => setNewCourse(c => ({ ...c, moduleInput: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addModule())}
                        placeholder="Add a module topic and press Enter..."
                      />
                      <button onClick={addModule} style={{ background: "#f1f5f9", color: "#475569", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "0 1rem", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}>
                        Add
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                    <button onClick={() => setShowCourseForm(false)} style={{ background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "10px", padding: "0.6rem 1.25rem", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>Cancel</button>
                    <button onClick={saveCourse} style={{ background: "#0B4085", color: "#fff", border: "none", borderRadius: "10px", padding: "0.6rem 1.5rem", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}>Save Course</button>
                  </div>
                </div>
              </div>
            )}

            {/* Existing courses */}
            {courses.length === 0 && !showCourseForm && (
              <div style={{ background: "#fff", borderRadius: "16px", padding: "3rem", textAlign: "center", border: "1px solid #e2e8f0" }}>
                <BookOpen size={40} color="#cbd5e0" style={{ margin: "0 auto 1rem" }} />
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a202c", margin: "0 0 0.4rem" }}>No courses yet</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>Create your first course to attract students.</p>
              </div>
            )}

            {courses.map(course => (
              <div key={course.id} style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#1a202c", margin: "0 0 0.3rem" }}>{course.title}</h3>
                    <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0 0 0.75rem" }}>
                      {course.level} · Rs. {course.price}/session · {course.modules.length} modules
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      {course.modules.map((m, i) => (
                        <span key={i} style={{ fontSize: "0.72rem", padding: "0.15rem 0.5rem", background: "#f1f5f9", color: "#64748b", borderRadius: "999px", border: "1px solid #e2e8f0" }}>
                          {i + 1}. {m.title}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setCourses(prev => prev.filter(c => c.id !== course.id))} style={{ background: "#fee2e2", border: "none", borderRadius: "8px", padding: "0.4rem", cursor: "pointer", flexShrink: 0 }}>
                    <X size={15} color="#ef4444" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
          {["basic", "teaching", "availability", "courses"].indexOf(activeTab) > 0 ? (
            <button onClick={() => setActiveTab(TABS[TABS.findIndex(t => t.key === activeTab) - 1].key)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "0.65rem 1.25rem", fontSize: "0.875rem", fontWeight: 600, color: "#64748b", cursor: "pointer" }}>
              <ChevronLeft size={16} /> Previous
            </button>
          ) : <div />}
          {["basic", "teaching", "availability", "courses"].indexOf(activeTab) < 3 ? (
            <button onClick={() => setActiveTab(TABS[TABS.findIndex(t => t.key === activeTab) + 1].key)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "linear-gradient(135deg, #0B4085, #1a56b3)", border: "none", borderRadius: "10px", padding: "0.65rem 1.5rem", fontSize: "0.875rem", fontWeight: 700, color: "#fff", cursor: "pointer" }}>
              Next Step <ChevronLeft size={16} style={{ transform: "rotate(180deg)" }} />
            </button>
          ) : (
            <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: saved ? "#22c55e" : "linear-gradient(135deg, #0B4085, #1a56b3)", color: "#fff", border: "none", borderRadius: "10px", padding: "0.65rem 1.5rem", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer" }}>
              {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save & Publish Profile</>}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
