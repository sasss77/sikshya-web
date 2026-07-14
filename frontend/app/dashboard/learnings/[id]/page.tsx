"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/lib/context/UserContext";
import {
  ArrowLeft,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Lock,
  PlayCircle,
  FileText,
  Video,
  Award,
  Download,
  Star,
  BookOpen,
  ChevronRight,
  Undo2,
  Menu,
  X,
  Clock,
  BarChart2,
  Lightbulb,
  AlignLeft,
} from "lucide-react";
import { LEARNINGS, Course } from "../page";

/* ─── Enriched Module Content ────────────────────────── */
const MODULE_CONTENT: Record<string, Record<string, { overview: string; keyPoints: string[]; example: string; practiceQ: string[] }>> = {
  "Engineering Physics": {
    "Kinematics": {
      overview: "Kinematics is the branch of classical mechanics that describes the motion of points, bodies, and systems of bodies without considering the forces that cause motion. Key quantities include displacement, velocity, and acceleration.",
      keyPoints: [
        "Displacement is the change in position (vector quantity).",
        "Velocity = Displacement / Time (vector); Speed = Distance / Time (scalar).",
        "Acceleration = Change in velocity / Time.",
        "Equations of motion: v = u + at, s = ut + ½at², v² = u² + 2as.",
        "Projectile motion combines horizontal uniform motion and vertical free fall.",
      ],
      example: "A car accelerates from rest to 72 km/h in 10 seconds. Find its acceleration.\n\nSolution: u = 0, v = 72 km/h = 20 m/s, t = 10s\na = (v - u) / t = (20 - 0) / 10 = 2 m/s²",
      practiceQ: [
        "A ball is thrown vertically upward with 30 m/s. Find the max height and time of flight.",
        "A train travelling at 60 km/h brakes and stops in 200 m. Find the retardation.",
        "Derive the third equation of motion using a velocity-time graph.",
      ],
    },
    "Newton's Laws": {
      overview: "Newton's Three Laws of Motion form the foundation of classical mechanics. They describe the relationship between the motion of an object and the forces acting on it.",
      keyPoints: [
        "1st Law (Inertia): A body remains at rest or in uniform motion unless acted on by an external force.",
        "2nd Law (F = ma): Force = Mass × Acceleration. Net force causes acceleration.",
        "3rd Law (Action-Reaction): Every action has an equal and opposite reaction.",
        "Normal force, friction, tension, and gravity are common forces in problems.",
        "Free Body Diagrams (FBDs) are essential to solve force problems.",
      ],
      example: "A 5 kg block is pushed across a frictionless surface by a 20 N force. Find the acceleration.\n\nSolution: F = ma → a = F/m = 20/5 = 4 m/s²",
      practiceQ: [
        "A 10 kg box rests on a surface with μ = 0.3. Find the friction force and acceleration when a 40 N force is applied.",
        "Two blocks of 3 kg and 5 kg are connected by a string over a pulley. Find their acceleration.",
        "Explain why a rocket can move in a vacuum using Newton's 3rd law.",
      ],
    },
    "Work & Energy": {
      overview: "The Work-Energy theorem connects the work done by net forces to the change in kinetic energy of an object. Energy exists in many forms and can be converted but not created or destroyed.",
      keyPoints: [
        "Work W = F × d × cos(θ). Work is positive when force and displacement are in the same direction.",
        "Kinetic Energy KE = ½mv².",
        "Potential Energy PE = mgh (gravitational).",
        "Work-Energy Theorem: Net work = Change in KE.",
        "Conservation of Energy: Total mechanical energy is constant when no non-conservative forces act.",
      ],
      example: "A 2 kg ball rolls down a hill of height 10 m. Find its speed at the bottom (no friction).\n\nSolution: mgh = ½mv² → v = √(2gh) = √(2×10×10) = √200 ≈ 14.1 m/s",
      practiceQ: [
        "A 60 kg person climbs stairs of height 5 m in 20 s. Calculate power expended.",
        "A spring with k=500 N/m is compressed by 0.1 m. Find its potential energy.",
        "A bullet (10g) traveling at 900 m/s embeds in a 2 kg block. Find the common speed and energy lost.",
      ],
    },
    "Thermodynamics": {
      overview: "Thermodynamics studies heat, energy, and work and their interconversions. The four laws of thermodynamics govern all thermal processes in physics and engineering.",
      keyPoints: [
        "Zeroth Law: If A=B and B=C thermally, then A=C (defines temperature).",
        "First Law: ΔU = Q - W (Energy conservation for heat systems).",
        "Second Law: Heat flows spontaneously from hot to cold. Entropy increases.",
        "Third Law: Entropy approaches a constant as temperature approaches absolute zero.",
        "Carnot Efficiency: η = 1 - T_cold/T_hot (maximum efficiency of a heat engine).",
      ],
      example: "A gas absorbs 500 J of heat and does 200 J of work. Find the change in internal energy.\n\nSolution: ΔU = Q - W = 500 - 200 = 300 J",
      practiceQ: [
        "A Carnot engine operates between 800K and 300K. Find its efficiency.",
        "Explain why it is impossible to build a 100% efficient engine.",
        "1 mole of ideal gas is heated at constant pressure. Find Q, W, and ΔU.",
      ],
    },
    "Electrostatics": {
      overview: "Electrostatics studies electric charges at rest and the forces, fields, and potentials they create. Coulomb's Law and Gauss's Law are the fundamental tools of electrostatics.",
      keyPoints: [
        "Coulomb's Law: F = kq₁q₂/r² (force between two charges).",
        "Electric field E = F/q (force per unit charge).",
        "Electric potential V = kq/r (work done to bring unit charge from infinity).",
        "Gauss's Law: ΦE = Q_enclosed / ε₀",
        "Capacitors store charge: C = Q/V, Energy = ½CV²",
      ],
      example: "Two charges +4μC and -4μC are 0.2 m apart. Find the force between them.\n\nSolution: F = k|q₁||q₂|/r² = 9×10⁹ × 4×10⁻⁶ × 4×10⁻⁶ / (0.2)² = 3.6 N",
      practiceQ: [
        "An electric dipole has charges ±5μC separated by 0.01 m. Find the dipole moment.",
        "Derive the expression for the electric field due to an infinite plane of charge.",
        "Three capacitors (2μF, 3μF, 6μF) are connected in series to 120V. Find charge on each.",
      ],
    },
  },
  "Biology": {
    "Cell Biology": {
      overview: "Cell biology explores the structure, function, and behavior of cells — the fundamental unit of all living organisms. Cells are studied using microscopy and molecular techniques.",
      keyPoints: [
        "Prokaryotic cells: No membrane-bound nucleus (bacteria, archaea).",
        "Eukaryotic cells: Have a nucleus and membrane-bound organelles.",
        "Cell membrane: Phospholipid bilayer controlling what enters and exits.",
        "Mitochondria: 'Powerhouse' — site of aerobic respiration (ATP production).",
        "Cell division: Mitosis (growth/repair) and Meiosis (sexual reproduction).",
      ],
      example: "Compare the structure of an animal cell and a plant cell.\n\nAnimal Cell: Cell membrane, no cell wall, no chloroplasts, centrioles present.\nPlant Cell: Cell wall (cellulose), chloroplasts, large central vacuole, no centrioles.",
      practiceQ: [
        "Explain the role of the endoplasmic reticulum (rough vs smooth).",
        "Describe the stages of mitosis with diagrams.",
        "Why can't prokaryotes undergo meiosis?",
      ],
    },
    "Genetics": {
      overview: "Genetics is the study of heredity and variation. DNA contains the genetic code that is passed from parents to offspring, determining traits and characteristics.",
      keyPoints: [
        "DNA: Double helix of nucleotides (A-T, G-C base pairing).",
        "Genes are segments of DNA that code for specific proteins.",
        "Mendelian Genetics: Dominant and recessive alleles, Punnett squares.",
        "Mutations are changes in DNA sequence — can be beneficial, neutral, or harmful.",
        "Central Dogma: DNA → RNA → Protein (transcription & translation).",
      ],
      example: "A tall pea plant (Tt) is crossed with a short plant (tt). Predict the offspring phenotype ratio.\n\nPunnett Square:\nTt × tt → Tt, Tt, tt, tt\nRatio: 50% tall : 50% short",
      practiceQ: [
        "Explain the difference between genotype and phenotype.",
        "What is co-dominance? Give an example using blood groups.",
        "Describe the process of DNA replication.",
      ],
    },
    "Ecology": {
      overview: "Ecology studies the relationships between organisms and their environment, including the flow of energy and nutrients through ecosystems.",
      keyPoints: [
        "Ecosystem: Community of organisms interacting with their environment.",
        "Food Chain vs. Food Web: Linear vs. complex trophic interactions.",
        "Energy is lost (~90%) at each trophic level (10% rule).",
        "Biogeochemical cycles: Carbon, nitrogen, water cycles.",
        "Biodiversity: Variety of species — crucial for ecosystem stability.",
      ],
      example: "In a grassland: Grass → Grasshopper → Frog → Snake → Eagle\n\nIf 10,000J energy enters at the grass level, only ~10J reaches the eagle (10% rule at each level).",
      practiceQ: [
        "Explain the carbon cycle and its role in climate change.",
        "What is the difference between a food chain and a food web?",
        "Describe the effects of deforestation on an ecosystem.",
      ],
    },
    "Human Physiology": {
      overview: "Human physiology studies the function of each body system and how they coordinate to maintain homeostasis — the stable internal environment needed for life.",
      keyPoints: [
        "Circulatory system: Heart pumps blood; arteries (away) and veins (to heart).",
        "Respiratory system: Gas exchange in alveoli; O₂ in, CO₂ out.",
        "Nervous system: CNS (brain+spinal cord) and PNS (nerves).",
        "Digestive system: Breakdown of food and absorption of nutrients.",
        "Endocrine system: Hormones regulate metabolism, growth, and reproduction.",
      ],
      example: "Trace the path of a red blood cell from the right ventricle to the left atrium.\n\nRight Ventricle → Pulmonary Artery → Lungs (gas exchange) → Pulmonary Vein → Left Atrium",
      practiceQ: [
        "Explain the role of haemoglobin in oxygen transport.",
        "Describe the reflex arc with a diagram.",
        "What is the role of insulin in regulating blood sugar?",
      ],
    },
  },
  "Economics": {
    "Demand & Supply": {
      overview: "The law of demand and supply is the cornerstone of market economics. Price is determined by the intersection of consumer demand and producer supply.",
      keyPoints: [
        "Law of Demand: As price rises, quantity demanded falls (inverse relationship).",
        "Law of Supply: As price rises, quantity supplied increases (direct relationship).",
        "Equilibrium: Market price where Qd = Qs.",
        "Shifts in demand: Income, tastes, prices of substitutes/complements, expectations.",
        "Elasticity: % change in Qd / % change in Price.",
      ],
      example: "If the price of coffee rises from Rs.100 to Rs.120, and demand falls from 500 to 400 units.\n\nPED = (% ΔQd) / (% ΔP) = (-20%) / (20%) = -1 (Unit elastic)",
      practiceQ: [
        "Distinguish between a change in demand and a change in quantity demanded.",
        "What happens to the equilibrium price and quantity if both demand and supply increase?",
        "Calculate cross-price elasticity between tea and coffee given these figures.",
      ],
    },
    "Market Structures": {
      overview: "Market structures define how industries are organized, ranging from perfect competition to monopoly, with different implications for prices, profits, and efficiency.",
      keyPoints: [
        "Perfect Competition: Many buyers/sellers, identical products, no barriers.",
        "Monopoly: One seller controls the market, price-maker, high barriers.",
        "Oligopoly: Few dominant firms, interdependent decisions (game theory).",
        "Monopolistic Competition: Many firms, differentiated products, advertising.",
        "In the long run, perfect competition yields zero economic profit.",
      ],
      example: "Why does a monopolist produce where MR = MC, not where P = MC?\n\nA monopolist is a price-maker and faces a downward-sloping demand curve. To maximize profit, it equates Marginal Revenue (MR) with Marginal Cost (MC). The price charged is above MC, leading to deadweight loss.",
      practiceQ: [
        "Compare consumer surplus under perfect competition vs. monopoly.",
        "Why does oligopoly often lead to price rigidity? Explain using the kinked demand curve.",
        "What is the role of advertising in monopolistic competition?",
      ],
    },
    "Macroeconomics": {
      overview: "Macroeconomics studies the economy as a whole — looking at aggregate output (GDP), inflation, unemployment, and government policies to stabilize the economy.",
      keyPoints: [
        "GDP = C + I + G + (X - M) (Expenditure approach).",
        "Inflation: Persistent rise in general price level, measured by CPI.",
        "Unemployment types: Frictional, structural, cyclical, seasonal.",
        "Fiscal Policy: Government spending and taxation to influence the economy.",
        "Monetary Policy: Central bank controls money supply and interest rates.",
      ],
      example: "If a government increases spending by Rs.1 billion and the MPC is 0.8:\n\nMultiplier = 1/(1-MPC) = 1/0.2 = 5\nChange in GDP = 5 × Rs.1 billion = Rs.5 billion",
      practiceQ: [
        "Explain the difference between GDP and GNP.",
        "How does the central bank use the repo rate to control inflation?",
        "Describe the Phillips Curve and its short-run vs long-run implications.",
      ],
    },
  },
};

function getModuleContent(subject: string, topicLabel: string) {
  return MODULE_CONTENT[subject]?.[topicLabel] ?? {
    overview: `This module covers **${topicLabel}** as part of the ${subject} curriculum. Your tutor will guide you through the core concepts, examples, and practice questions in your upcoming sessions.`,
    keyPoints: ["Content will be added by your tutor.", "Check back after your next session.", "Use the messaging feature to ask your tutor for resources."],
    example: "No example provided yet for this module.",
    practiceQ: ["Practice questions will appear here after your session."],
  };
}

/* ─── Main Page ──────────────────────────────────────── */
export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTopicIdx, setActiveTopicIdx] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Record<number, { rating: number; text: string; submitted: boolean }>>({});

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (params.id) {
      const found = LEARNINGS.find(c => c.id === Number(params.id));
      if (found) {
        setCourse(JSON.parse(JSON.stringify(found)));
        // Default to first incomplete topic
        const firstIncomplete = found.topics.findIndex(t => !t.done);
        setActiveTopicIdx(firstIncomplete >= 0 ? firstIncomplete : 0);
      }
    }
  }, [params.id]);

  if (loading || !user || !course) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "4px solid #e2e8f0", borderTopColor: "#0B4085", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const completedTopicsCount = course.topics.filter(t => t.done).length;
  const isAllTopicsDone = completedTopicsCount === course.topics.length;
  const isCompleted = course.status === "completed";
  const currentProgress = Math.round((completedTopicsCount / course.topics.length) * 100);
  const activeTopic = course.topics[activeTopicIdx];
  const moduleContent = getModuleContent(course.subject, activeTopic?.label ?? "");

  const toggleTopic = (index: number) => {
    if (isCompleted) return;
    setCourse(prev => {
      if (!prev) return prev;
      const newTopics = [...prev.topics];
      newTopics[index] = { ...newTopics[index], done: !newTopics[index].done };
      return { ...prev, topics: newTopics };
    });
  };

  const markCourseComplete = () => {
    setCourse(prev => {
      if (!prev) return prev;
      return { ...prev, status: "completed", progress: 100 };
    });
  };

  return (
    <div style={{ background: "#f4f6fa", height: "calc(100vh - 68px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* ── Top Banner ── */}
      <div style={{ background: "linear-gradient(135deg, #0B4085, #1a56b3)", color: "#fff", padding: "1.5rem 2rem", display: "flex", alignItems: "center", gap: "1.5rem", flexShrink: 0 }}>
        <Link href="/dashboard/learnings" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600, whiteSpace: "nowrap" }}>
          <ArrowLeft size={16} /> My Learnings
        </Link>
        <div style={{ height: "20px", width: "1px", background: "rgba(255,255,255,0.25)" }} />
        <div style={{ flex: 1, minWidth: "300px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.01em" }}>{course.subject}</h1>
            {isCompleted ? (
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "#22c55e", color: "#fff", padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700 }}>
                <CheckCircle2 size={12} /> Completed
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "rgba(255,255,255,0.18)", color: "#fff", padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700 }}>
                <PlayCircle size={12} /> In Progress
              </span>
            )}
            
            {/* Upcoming Session Indicator */}
            {course.nextSession && !isCompleted && (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "linear-gradient(135deg, #10b981, #059669)", padding: "0.4rem 0.4rem 0.4rem 1rem", borderRadius: "999px", marginLeft: "auto", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)", border: "1px solid #34d399" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff", boxShadow: "0 0 10px #fff", animation: "pulse 2s infinite" }} />
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff", letterSpacing: "0.02em" }}>Next: {course.nextSession}</span>
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "#fff", color: "#059669", border: "none", padding: "0.4rem 1rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 900, cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }} className="hover-scale">
                  <Video size={14} /> Join Meet
                </button>
              </div>
            )}
          </div>
          <p style={{ fontSize: "0.8rem", opacity: 0.75, margin: "0.3rem 0 0" }}>with {course.tutorName}</p>
        </div>
        {/* Progress */}
        <div style={{ minWidth: "180px", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>{completedTopicsCount}/{course.topics.length} modules</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 800 }}>{currentProgress}%</span>
          </div>
          <div style={{ height: "6px", background: "rgba(255,255,255,0.2)", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${currentProgress}%`, background: isCompleted ? "#4ade80" : "#fff", transition: "width 0.4s ease" }} />
          </div>
        </div>
        <button onClick={() => setSidebarOpen(v => !v)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "8px", padding: "0.5rem", cursor: "pointer", display: "flex" }}>
          {sidebarOpen ? <X size={18} color="#fff" /> : <Menu size={18} color="#fff" />}
        </button>
      </div>

      {/* ── Main Learning Area ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* ─── Left Sidebar: Syllabus ─── */}
        <aside style={{
          width: sidebarOpen ? "280px" : "0px",
          minWidth: sidebarOpen ? "280px" : "0px",
          background: "#fff",
          borderRight: "1px solid #e2e8f0",
          overflowY: "auto",
          overflowX: "hidden",
          transition: "all 0.3s ease",
          flexShrink: 0,
        }}>
          {sidebarOpen && (
            <div style={{ padding: "1.25rem 0" }}>
              <p style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 1.25rem 0.75rem" }}>
                Syllabus — {course.topics.length} Modules
              </p>
              {course.topics.map((topic, idx) => {
                const isActive = idx === activeTopicIdx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveTopicIdx(idx)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.75rem 1.25rem",
                      background: isActive ? "#f0f7ff" : "transparent",
                      borderRight: isActive ? "3px solid #0B4085" : "3px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    className="syllabus-item"
                  >
                    {/* Check / Number indicator */}
                    <div onClick={(e) => { e.stopPropagation(); toggleTopic(idx); }}
                      title={topic.done ? "Click to undo" : "Click to mark done"}
                      style={{
                        width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
                        background: topic.done ? "#22c55e" : isActive ? "#0B4085" : "#f1f5f9",
                        border: topic.done ? "none" : isActive ? "none" : "2px solid #cbd5e0",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: isCompleted ? "default" : "pointer",
                        transition: "all 0.2s ease",
                      }}
                      className="topic-check"
                    >
                      {topic.done
                        ? <CheckCircle2 size={14} color="#fff" />
                        : <span style={{ fontSize: "0.7rem", fontWeight: 700, color: isActive ? "#fff" : "#64748b" }}>{idx + 1}</span>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: "0.85rem", fontWeight: isActive ? 700 : 500,
                        color: isActive ? "#0B4085" : topic.done ? "#64748b" : "#1a202c",
                        margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        textDecoration: topic.done ? "none" : "none",
                      }}>
                        {topic.label}
                      </p>
                      <p style={{ fontSize: "0.68rem", color: topic.done ? "#22c55e" : "#94a3b8", margin: "0.1rem 0 0", fontWeight: 600 }}>
                        {topic.done ? "✓ Completed" : isActive ? "Currently studying" : "Not started"}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Divider */}
              <div style={{ margin: "1rem 1.25rem", borderTop: "1px solid #f1f5f9" }} />

              {/* Tutor quick contact */}
              <div style={{ padding: "0 1.25rem" }}>
                <p style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Your Tutor</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: course.tutorColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                    {course.tutorInitials}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1a202c", margin: 0 }}>{course.tutorName}</p>
                    {course.nextSession && <p style={{ fontSize: "0.7rem", color: "#64748b", margin: 0 }}>Next: {course.nextSession}</p>}
                  </div>
                </div>
                <Link href="/dashboard/messages" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", background: "#f0f7ff", border: "1px solid #bfdbfe", color: "#0B4085", padding: "0.5rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none", marginBottom: "0.5rem" }}>
                  <MessageSquare size={14} /> Message Tutor
                </Link>
                <Link href="/find-tutors" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", background: "#0B4085", color: "#fff", padding: "0.5rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none" }}>
                  <Calendar size={14} /> Book Session
                </Link>
              </div>
            </div>
          )}
        </aside>

        {/* ─── Main Content Area ─── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {activeTopic && (
            <>
              {/* Module Header */}
              <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.5rem 2rem", boxShadow: "0 1px 8px rgba(11,64,133,0.04)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.4rem" }}>
                      Module {activeTopicIdx + 1} of {course.topics.length}
                    </p>
                    <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#1a202c", margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
                      {activeTopic.label}
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>{course.subject} · {course.tutorName}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
                    {/* Prev / Next */}
                    <button
                      disabled={activeTopicIdx === 0}
                      onClick={() => setActiveTopicIdx(i => i - 1)}
                      style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: activeTopicIdx === 0 ? "#f8fafc" : "#f0f7ff", border: "1px solid", borderColor: activeTopicIdx === 0 ? "#e2e8f0" : "#bfdbfe", color: activeTopicIdx === 0 ? "#94a3b8" : "#0B4085", padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, cursor: activeTopicIdx === 0 ? "not-allowed" : "pointer" }}
                    >
                      <ArrowLeft size={14} /> Prev
                    </button>
                    <button
                      disabled={activeTopicIdx === course.topics.length - 1}
                      onClick={() => setActiveTopicIdx(i => i + 1)}
                      style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: activeTopicIdx === course.topics.length - 1 ? "#f8fafc" : "#0B4085", border: "none", borderColor: "#bfdbfe", color: activeTopicIdx === course.topics.length - 1 ? "#94a3b8" : "#fff", padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, cursor: activeTopicIdx === course.topics.length - 1 ? "not-allowed" : "pointer", boxShadow: activeTopicIdx === course.topics.length - 1 ? "none" : "0 4px 10px rgba(11,64,133,0.25)" }}
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Mark Done / Undo row */}
                {!isCompleted && (
                  <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "1rem" }}>
                    {activeTopic.done ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#16a34a", fontWeight: 700, fontSize: "0.9rem" }}>
                          <CheckCircle2 size={18} color="#22c55e" /> Module Completed!
                        </span>
                        <button
                          onClick={() => toggleTopic(activeTopicIdx)}
                          style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "none", border: "1px solid #fca5a5", color: "#dc2626", padding: "0.4rem 0.85rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}
                        >
                          <Undo2 size={14} /> Undo
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleTopic(activeTopicIdx)}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "linear-gradient(135deg, #16a34a, #22c55e)", color: "#fff", border: "none", padding: "0.6rem 1.25rem", borderRadius: "10px", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(22,163,74,0.25)" }}
                      >
                        <CheckCircle2 size={16} /> Mark as Complete
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Overview */}
              <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.5rem 2rem", boxShadow: "0 1px 8px rgba(11,64,133,0.04)" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1a202c", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <AlignLeft size={18} color="#0B4085" /> Overview
                </h3>
                <p style={{ fontSize: "0.95rem", color: "#374151", lineHeight: 1.75, margin: 0 }}>{moduleContent.overview}</p>
              </div>

              {/* Key Points */}
              <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.5rem 2rem", boxShadow: "0 1px 8px rgba(11,64,133,0.04)" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1a202c", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Lightbulb size={18} color="#f59e0b" /> Key Concepts
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {moduleContent.keyPoints.map((pt, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#e8eef7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                        <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#0B4085" }}>{i + 1}</span>
                      </div>
                      <p style={{ fontSize: "0.9rem", color: "#374151", lineHeight: 1.6, margin: 0 }}>{pt}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Worked Example */}
              <div style={{ background: "linear-gradient(135deg, #f0f7ff, #e8eef7)", borderRadius: "16px", border: "1px solid #bfdbfe", padding: "1.5rem 2rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0B4085", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <BookOpen size={18} color="#0B4085" /> Worked Example
                </h3>
                <pre style={{ fontSize: "0.875rem", color: "#1e3a5f", lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                  {moduleContent.example}
                </pre>
              </div>

              {/* Practice Questions */}
              <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.5rem 2rem", boxShadow: "0 1px 8px rgba(11,64,133,0.04)" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1a202c", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <BarChart2 size={18} color="#8b5cf6" /> Practice Questions
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {moduleContent.practiceQ.map((q, i) => (
                    <div key={i} style={{ padding: "1rem 1.25rem", background: "#fafbfd", border: "1px solid #e2e8f0", borderRadius: "10px", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#8b5cf6", background: "#f3e8ff", padding: "0.2rem 0.5rem", borderRadius: "6px", flexShrink: 0, marginTop: "2px" }}>Q{i + 1}</span>
                      <p style={{ fontSize: "0.9rem", color: "#374151", margin: 0, lineHeight: 1.6 }}>{q}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.5rem 2rem", boxShadow: "0 1px 8px rgba(11,64,133,0.04)" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1a202c", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Download size={18} color="#f59e0b" /> Resources
                </h3>
                {[
                  { name: "Formula Cheat Sheet.pdf", size: "1.2 MB" },
                  { name: "Past Year Questions 2025.pdf", size: "3.4 MB" }
                ].map((res, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1rem", background: "#f8fafc", borderRadius: "10px", marginBottom: i === 0 ? "0.5rem" : 0, border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "32px", height: "32px", background: "#fee2e2", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileText size={15} color="#dc2626" />
                      </div>
                      <div>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1a202c", margin: 0 }}>{res.name}</p>
                        <p style={{ fontSize: "0.72rem", color: "#64748b", margin: 0 }}>PDF · {res.size}</p>
                      </div>
                    </div>
                    <button style={{ background: "none", border: "none", color: "#0B4085", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>Download</button>
                  </div>
                ))}
              </div>

              {/* Module Feedback */}
              <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "1.5rem 2rem", boxShadow: "0 1px 8px rgba(11,64,133,0.04)" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1a202c", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Star size={18} color="#f59e0b" /> Module Feedback
                </h3>
                
                {feedbacks[activeTopicIdx]?.submitted ? (
                  <div style={{ padding: "1rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.75rem", color: "#166534" }}>
                    <CheckCircle2 size={20} color="#22c55e" />
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem" }}>Thank you for your feedback!</p>
                      <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.8 }}>Your input helps your tutor improve future sessions.</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0 0 0.75rem" }}>How well did you understand this module?</p>
                    <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setFeedbacks(prev => ({ ...prev, [activeTopicIdx]: { ...(prev[activeTopicIdx] || { text: "", submitted: false }), rating: star } }))}
                          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", transition: "transform 0.1s" }}
                          className="hover-scale"
                        >
                          <Star 
                            size={28} 
                            color={star <= (feedbacks[activeTopicIdx]?.rating || 0) ? "#f59e0b" : "#cbd5e0"} 
                            fill={star <= (feedbacks[activeTopicIdx]?.rating || 0) ? "#f59e0b" : "none"} 
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Any specific topics you'd like the tutor to re-explain?"
                      value={feedbacks[activeTopicIdx]?.text || ""}
                      onChange={e => setFeedbacks(prev => ({ ...prev, [activeTopicIdx]: { ...(prev[activeTopicIdx] || { rating: 0, submitted: false }), text: e.target.value } }))}
                      style={{
                        width: "100%", minHeight: "80px", padding: "0.75rem",
                        borderRadius: "10px", border: "1px solid #e2e8f0",
                        fontSize: "0.875rem", outline: "none", fontFamily: "inherit",
                        resize: "vertical", marginBottom: "0.75rem"
                      }}
                    />
                    <button 
                      onClick={() => setFeedbacks(prev => ({ ...prev, [activeTopicIdx]: { ...prev[activeTopicIdx], submitted: true } }))}
                      disabled={!feedbacks[activeTopicIdx]?.rating}
                      style={{
                        background: feedbacks[activeTopicIdx]?.rating ? "#0B4085" : "#cbd5e0",
                        color: "#fff", border: "none", padding: "0.6rem 1.25rem", borderRadius: "8px",
                        fontSize: "0.85rem", fontWeight: 700, cursor: feedbacks[activeTopicIdx]?.rating ? "pointer" : "not-allowed",
                        transition: "background 0.2s"
                      }}
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}
              </div>

              {/* Course Complete banner */}
              {!isCompleted && isAllTopicsDone && (
                <div style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)", borderRadius: "16px", padding: "2rem", textAlign: "center", color: "#fff" }}>
                  <Award size={48} color="rgba(255,255,255,0.9)" style={{ marginBottom: "0.75rem" }} />
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 900, margin: "0 0 0.5rem" }}>All Modules Completed! 🎉</h3>
                  <p style={{ opacity: 0.9, margin: "0 0 1.25rem", fontSize: "0.9rem" }}>You have mastered every topic in {course.subject}. Ready to finalize?</p>
                  <button onClick={markCourseComplete} style={{ background: "#fff", color: "#16a34a", border: "none", borderRadius: "10px", padding: "0.7rem 2rem", fontSize: "0.95rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                    Mark Course Complete
                  </button>
                </div>
              )}

              {isCompleted && (
                <div style={{ background: "linear-gradient(135deg, #e0f2fe, #f0fdf4)", borderRadius: "16px", padding: "1.5rem", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <Award size={40} color="#16a34a" />
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#166534", margin: "0 0 0.25rem" }}>Course Completed! 🎓</h3>
                    <p style={{ fontSize: "0.85rem", color: "#15803d", margin: 0 }}>You have successfully completed {course.subject}. Great work!</p>
                  </div>
                  {course.rating && (
                    <div style={{ marginLeft: "auto", display: "flex", gap: "0.2rem" }}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={18} fill={s <= course.rating! ? "#f59e0b" : "none"} color="#f59e0b" />)}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <style>{`
        .syllabus-item:hover { background: #f8fafc !important; }
        .topic-check:hover { opacity: 0.85; transform: scale(1.05); }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
