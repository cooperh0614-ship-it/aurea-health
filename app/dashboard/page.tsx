"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const DISPLAY = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif";
const SANS    = "var(--font-inter), system-ui, sans-serif";
const GOLD    = "#c9a84c";

// ─── Card shell ───────────────────────────────────────────────────────────────

function Card({
  label,
  title,
  children,
  style = {},
  bodyStyle = {},
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "#111111",
        borderRadius: "1rem",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {/* Card header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{
          fontFamily: SANS,
          fontSize: "0.625rem",
          fontWeight: 500,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(201,168,76,0.5)",
          margin: "0 0 0.2rem",
        }}>
          {label}
        </p>
        <p style={{
          fontFamily: SANS,
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "rgba(245,240,232,0.5)",
          margin: "0 0 1rem",
        }}>
          {title}
        </p>
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
      </div>

      {/* Card body */}
      <div style={{ flex: 1, ...bodyStyle }}>
        {children}
      </div>
    </div>
  );
}

// ─── 2×2 Stat quad grid ───────────────────────────────────────────────────────

function StatQuad({ stats }: {
  stats: { label: string; value: string; unit?: string }[];
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1px",
      background: "rgba(255,255,255,0.04)",
      borderRadius: "0.75rem",
      overflow: "hidden",
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: "#111111", padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
            <span style={{
              fontFamily: DISPLAY,
              fontSize: "3rem",
              fontWeight: 300,
              color: "#F5F0E8",
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}>
              {s.value}
            </span>
            {s.unit && (
              <span style={{
                fontFamily: SANS,
                fontSize: "1rem",
                fontWeight: 300,
                color: "rgba(245,240,232,0.25)",
              }}>
                {s.unit}
              </span>
            )}
          </div>
          <p style={{
            fontFamily: SANS,
            fontSize: "0.625rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(245,240,232,0.3)",
            margin: "0.5rem 0 0",
          }}>
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Individual cards ─────────────────────────────────────────────────────────

function WhoopCard() {
  return (
    <Card label="Recovery · Synced today" title="Whoop">
      <StatQuad stats={[
        { label: "Recovery Score", value: "84",   unit: "%" },
        { label: "HRV",            value: "62",   unit: "ms" },
        { label: "Sleep",          value: "91",   unit: "%" },
        { label: "Day Strain",     value: "14.2" },
      ]} />
      <p style={{
        fontFamily: SANS,
        fontSize: "0.8125rem",
        fontWeight: 300,
        color: "rgba(245,240,232,0.5)",
        margin: "1rem 0 0",
        lineHeight: 1.6,
      }}>
        7h 22m in bed &nbsp;·&nbsp; 6h 51m asleep &nbsp;·&nbsp; 2h 14m REM
      </p>
    </Card>
  );
}

function DexaCard() {
  return (
    <Card label="Body Composition · March 4, 2026" title="DEXA Scan">
      <StatQuad stats={[
        { label: "Body Fat",     value: "12.4", unit: "%" },
        { label: "Lean Mass",    value: "172",  unit: "lbs" },
        { label: "Bone Density", value: "1.24", unit: "g/cm²" },
        { label: "Visceral Fat", value: "0.41", unit: "lbs" },
      ]} />
      <p style={{
        fontFamily: SANS,
        fontSize: "0.8125rem",
        fontWeight: 300,
        color: "rgba(245,240,232,0.5)",
        margin: "1rem 0 0",
        lineHeight: 1.6,
      }}>
        Next scan recommended in 90 days &nbsp;·&nbsp; June 2, 2026
      </p>
    </Card>
  );
}

function SupplementCard() {
  const stack = [
    { name: "Creatine Monohydrate", dose: "5 g",      timing: "Morning" },
    { name: "Magnesium Glycinate",  dose: "400 mg",   timing: "Evening" },
    { name: "Vitamin D3 + K2",      dose: "5,000 IU", timing: "With food" },
    { name: "Omega-3 (EPA/DHA)",    dose: "2 g",      timing: "With food" },
    { name: "Ashwagandha KSM-66",   dose: "600 mg",   timing: "Evening" },
    { name: "Tongkat Ali",          dose: "200 mg",   timing: "Morning" },
  ];
  return (
    <Card label="Daily Protocol" title="Supplements">
      <div>
        {stack.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.75rem 0",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <span style={{ fontFamily: SANS, fontSize: "0.875rem", color: "#F5F0E8" }}>
              {s.name}
            </span>
            <span style={{
              fontFamily: SANS,
              fontSize: "0.75rem",
              color: "rgba(201,168,76,0.5)",
              whiteSpace: "nowrap",
              marginLeft: "1rem",
            }}>
              {s.dose}&nbsp;·&nbsp;{s.timing}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function NutritionCard() {
  return (
    <Card label="Daily Targets" title="Nutrition">
      <StatQuad stats={[
        { label: "Calories", value: "2,840", unit: "kcal" },
        { label: "Protein",  value: "215",   unit: "g" },
        { label: "Carbs",    value: "310",   unit: "g" },
        { label: "Fat",      value: "88",    unit: "g" },
      ]} />
      <div style={{ marginTop: "1rem" }}>
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "0.75rem" }} />
        <p style={{
          fontFamily: SANS,
          fontSize: "0.625rem",
          fontWeight: 500,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(201,168,76,0.5)",
          margin: "0 0 0.5rem",
        }}>
          Protocol Notes
        </p>
        <p style={{
          fontFamily: SANS,
          fontSize: "0.8125rem",
          fontWeight: 300,
          color: "rgba(245,240,232,0.5)",
          margin: 0,
          lineHeight: 1.65,
        }}>
          High-protein recomp phase. Carb timing weighted toward pre- and post-training
          windows. Surplus on training days (+200 kcal). Avoid seed oils.
        </p>
      </div>
    </Card>
  );
}

function CheckInCard() {
  const agenda = [
    "Review Q1 bloodwork — testosterone, cortisol, CRP, lipids",
    "Adjust supplement protocol based on HRV trend data",
    "Assess hypertrophy block progress, consider deload timing",
    "Evaluate sleep quality improvements post-magnesium",
    "Set Q2 DEXA scan targets",
  ];
  return (
    <Card label="Scheduled Review" title="Next Check-In">
      <div style={{ marginBottom: "1rem" }}>
        <span style={{
          fontFamily: DISPLAY,
          fontSize: "2.5rem",
          fontWeight: 300,
          color: "#F5F0E8",
          lineHeight: 1.1,
          display: "block",
        }}>
          April 7, 2026
        </span>
        <span style={{
          fontFamily: SANS,
          fontSize: "0.75rem",
          color: "rgba(201,168,76,0.5)",
          letterSpacing: "0.08em",
          marginTop: "0.3rem",
          display: "block",
        }}>
          10:00 AM · 60 min · Video call
        </span>
      </div>
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "1rem" }} />
      <p style={{
        fontFamily: SANS,
        fontSize: "0.625rem",
        fontWeight: 500,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(201,168,76,0.5)",
        margin: "0 0 0.75rem",
      }}>
        Agenda
      </p>
      <div>
        {agenda.map((item, i) => (
          <div
            key={i}
            style={{
              borderLeft: "2px solid rgba(201,168,76,0.3)",
              paddingLeft: "0.75rem",
              paddingTop: "0.25rem",
              paddingBottom: "0.25rem",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{
              fontFamily: SANS,
              fontSize: "0.8125rem",
              fontWeight: 300,
              color: "rgba(245,240,232,0.6)",
              lineHeight: 1.55,
            }}>
              {item}
            </span>
          </div>
        ))}
      </div>
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "0.75rem 0" }} />
      <p style={{
        fontFamily: SANS,
        fontSize: "0.8125rem",
        fontWeight: 300,
        color: "rgba(245,240,232,0.35)",
        margin: 0,
      }}>
        Prep form sent 48 hours before the call.
      </p>
    </Card>
  );
}

function WorkoutCard() {
  const days = [
    {
      day: "Monday", label: "Upper A",
      moves: [
        { name: "Bench Press",      sets: "4 × 6–8",    note: "RPE 8" },
        { name: "Weighted Pull-Up", sets: "4 × 6–8",    note: "RPE 8" },
        { name: "Incline DB Press", sets: "3 × 10–12",  note: "" },
        { name: "Cable Row",        sets: "3 × 10–12",  note: "" },
        { name: "Lateral Raise",    sets: "3 × 15",     note: "" },
      ],
    },
    {
      day: "Wednesday", label: "Lower A",
      moves: [
        { name: "Back Squat",        sets: "4 × 5",      note: "RPE 8" },
        { name: "Romanian Deadlift", sets: "3 × 8–10",   note: "" },
        { name: "Leg Press",         sets: "3 × 12",     note: "" },
        { name: "Walking Lunge",     sets: "3 × 10/leg", note: "" },
        { name: "Calf Raise",        sets: "4 × 15",     note: "" },
      ],
    },
    {
      day: "Friday", label: "Upper B",
      moves: [
        { name: "Overhead Press", sets: "4 × 6–8",   note: "RPE 8" },
        { name: "Barbell Row",    sets: "4 × 6–8",   note: "" },
        { name: "Dip",            sets: "3 × 10–12", note: "" },
        { name: "Face Pull",      sets: "3 × 15",    note: "" },
        { name: "Hammer Curl",    sets: "3 × 12",    note: "" },
      ],
    },
    {
      day: "Saturday", label: "Lower B",
      moves: [
        { name: "Deadlift",    sets: "4 × 4",  note: "RPE 8" },
        { name: "Hack Squat",  sets: "3 × 10", note: "" },
        { name: "Leg Curl",    sets: "3 × 12", note: "" },
        { name: "Nordic Curl", sets: "3 × 6",  note: "" },
        { name: "Hip Thrust",  sets: "3 × 12", note: "" },
      ],
    },
  ];

  return (
    <div style={{
      background: "#111111",
      borderRadius: "1rem",
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      padding: "1.5rem",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{
          fontFamily: SANS,
          fontSize: "0.625rem",
          fontWeight: 500,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(201,168,76,0.5)",
          margin: "0 0 0.2rem",
        }}>
          Week 1–4 · Hypertrophy Block
        </p>
        <p style={{
          fontFamily: SANS,
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "rgba(245,240,232,0.5)",
          margin: "0 0 1rem",
        }}>
          Training Plan
        </p>
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
      </div>

      {/* Scrollable exercise list */}
      <div style={{
        height: "16rem",
        overflowY: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(201,168,76,0.2) transparent",
      }}>
        {days.map((d, di) => (
          <div key={di}>
            <div style={{
              display: "flex",
              alignItems: "baseline",
              gap: "0.75rem",
              marginTop: di === 0 ? 0 : "1rem",
              marginBottom: "0.5rem",
            }}>
              <span style={{
                fontFamily: SANS,
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(201,168,76,0.6)",
                fontWeight: 500,
              }}>
                {d.day}
              </span>
              <span style={{
                fontFamily: SANS,
                fontSize: "0.625rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(245,240,232,0.25)",
              }}>
                {d.label}
              </span>
            </div>
            {d.moves.map((m, mi) => (
              <div
                key={mi}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                <span style={{ fontFamily: SANS, fontSize: "0.875rem", color: "#F5F0E8", fontWeight: 300 }}>
                  {m.name}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                  <span style={{ fontFamily: SANS, fontSize: "0.75rem", color: "rgba(245,240,232,0.35)" }}>
                    {m.sets}
                  </span>
                  {m.note && (
                    <span style={{
                      fontFamily: SANS,
                      fontSize: "0.625rem",
                      color: "rgba(201,168,76,0.5)",
                      letterSpacing: "0.08em",
                    }}>
                      {m.note}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [signOutHov, setSignOutHov] = useState(false);

  useEffect(() => {
    createClient().auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/login");
      else setChecking(false);
    });
  }, [router]);

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.replace("/login");
  }

  if (checking) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>

      {/* Nav */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#0a0a0a",
        borderBottom: "1px solid rgba(201,168,76,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2.5rem",
      }}>
        <span style={{
          fontFamily: DISPLAY,
          fontSize: "1rem",
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#F5F0E8",
        }}>
          Aurea
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{
            fontFamily: SANS,
            fontSize: "0.625rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(201,168,76,0.6)",
          }}>
            Member Dashboard
          </span>
          <button
            onClick={handleSignOut}
            onMouseEnter={() => setSignOutHov(true)}
            onMouseLeave={() => setSignOutHov(false)}
            style={{
              fontFamily: SANS,
              fontSize: "0.5625rem",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "0.625rem 1.25rem",
              border: `1px solid ${signOutHov ? GOLD : "rgba(201,168,76,0.3)"}`,
              color: signOutHov ? "#0a0a0a" : GOLD,
              background: signOutHov ? GOLD : "transparent",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 2.5rem" }}>

        {/* Row 1: Whoop + DEXA */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
          <WhoopCard />
          <DexaCard />
        </div>

        {/* Row 2: Supplements + Nutrition + Check-in */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
          <SupplementCard />
          <NutritionCard />
          <CheckInCard />
        </div>

        {/* Row 3: Workout — full width */}
        <WorkoutCard />

      </div>
    </div>
  );
}
