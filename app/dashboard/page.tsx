"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const DISPLAY  = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif";
const SANS     = "var(--font-inter), system-ui, sans-serif";
const GOLD     = "#c9a84c";
const TEXT     = "#F5F0E8";
const TEXT_DIM = "rgba(245,240,232,0.4)";
const GOLD_60  = "rgba(201,168,76,0.6)";
const GOLD_50  = "rgba(201,168,76,0.5)";
const CARD_BG  = "#111111";
const CARD_SHADOW = "0 0 0 1px rgba(201,168,76,0.08), 0 4px 24px rgba(0,0,0,0.4)";

// ─── Primitives ───────────────────────────────────────────────────────────────

/** Thin horizontal rule — very faint white, not gold */
function Row() {
  return <div style={{ height: "1px", background: "rgba(255,255,255,0.04)", width: "100%" }} />;
}

/** Gold-tinted section divider within a card */
function GoldRow() {
  return <div style={{ height: "1px", background: "rgba(201,168,76,0.08)", width: "100%" }} />;
}

/** Uppercase gold label — the only "heading" inside a card */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: SANS,
      fontSize: "0.5rem",
      fontWeight: 500,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: GOLD_60,
      margin: 0,
    }}>
      {children}
    </p>
  );
}

// ─── Card shell ───────────────────────────────────────────────────────────────
function Card({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl p-8 gap-6 ${className}`}
      style={{
        background: CARD_BG,
        border: "1px solid rgba(201,168,76,0.15)",
        boxShadow: CARD_SHADOW,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── 2×2 Stat grid with cross-dividers ───────────────────────────────────────
function StatGrid({ stats }: {
  stats: { label: string; value: string; unit?: string }[];
}) {
  return (
    <div
      className="grid grid-cols-2"
      style={{ border: "1px solid rgba(201,168,76,0.08)", borderRadius: "0.75rem", overflow: "hidden" }}
    >
      {stats.map((s, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 p-5"
          style={{
            borderRight:  i % 2 === 0 ? "1px solid rgba(201,168,76,0.08)" : undefined,
            borderBottom: i < 2       ? "1px solid rgba(201,168,76,0.08)" : undefined,
          }}
        >
          <span style={{ fontFamily: SANS, fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD_60 }}>
            {s.label}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span style={{ fontFamily: DISPLAY, fontSize: "2.25rem", fontWeight: 300, color: TEXT, lineHeight: 1 }}>
              {s.value}
            </span>
            {s.unit && (
              <span style={{ fontFamily: SANS, fontSize: "0.75rem", fontWeight: 300, color: TEXT_DIM }}>
                {s.unit}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Individual cards ─────────────────────────────────────────────────────────

function WhoopCard() {
  return (
    <Card>
      <Label>Recovery · Synced today</Label>
      <StatGrid stats={[
        { label: "Recovery Score", value: "84",   unit: "%" },
        { label: "HRV",            value: "62",   unit: "ms" },
        { label: "Sleep",          value: "91",   unit: "%" },
        { label: "Day Strain",     value: "14.2" },
      ]} />
      <GoldRow />
      <p style={{ fontFamily: SANS, fontSize: "0.6875rem", fontWeight: 300, color: TEXT_DIM, margin: 0, lineHeight: 1.7 }}>
        7h 22m in bed &nbsp;·&nbsp; 6h 51m asleep &nbsp;·&nbsp; 2h 14m REM
      </p>
    </Card>
  );
}

function DexaCard() {
  return (
    <Card>
      <Label>Body Composition · March 4, 2026</Label>
      <StatGrid stats={[
        { label: "Body Fat",     value: "12.4", unit: "%" },
        { label: "Lean Mass",    value: "172",  unit: "lbs" },
        { label: "Bone Density", value: "1.24", unit: "g/cm²" },
        { label: "Visceral Fat", value: "0.41", unit: "lbs" },
      ]} />
      <GoldRow />
      <p style={{ fontFamily: SANS, fontSize: "0.6875rem", fontWeight: 300, color: TEXT_DIM, margin: 0, lineHeight: 1.7 }}>
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
    <Card>
      <Label>Daily Protocol</Label>
      <div className="flex flex-col">
        {stack.map((s, i) => (
          <div key={i}>
            {i > 0 && <Row />}
            <div className="flex items-center justify-between gap-6 py-3.5">
              <span style={{ fontFamily: SANS, fontSize: "0.8125rem", fontWeight: 400, color: TEXT }}>
                {s.name}
              </span>
              <span style={{ fontFamily: SANS, fontSize: "0.6875rem", fontWeight: 300, color: GOLD_50, whiteSpace: "nowrap" }}>
                {s.dose}&nbsp;·&nbsp;{s.timing}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function NutritionCard() {
  return (
    <Card>
      <Label>Daily Targets</Label>
      <StatGrid stats={[
        { label: "Calories", value: "2,840", unit: "kcal" },
        { label: "Protein",  value: "215",   unit: "g" },
        { label: "Carbs",    value: "310",   unit: "g" },
        { label: "Fat",      value: "88",    unit: "g" },
      ]} />
      <GoldRow />
      <div className="flex flex-col gap-2">
        <Label>Protocol Notes</Label>
        <p style={{ fontFamily: SANS, fontSize: "0.6875rem", fontWeight: 300, color: TEXT, margin: 0, lineHeight: 1.8 }}>
          High-protein recomp phase. Carb timing weighted toward pre- and
          post-training windows. Surplus on training days (+200 kcal). Avoid seed oils.
        </p>
      </div>
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
        { name: "Back Squat",         sets: "4 × 5",      note: "RPE 8" },
        { name: "Romanian Deadlift",  sets: "3 × 8–10",   note: "" },
        { name: "Leg Press",          sets: "3 × 12",     note: "" },
        { name: "Walking Lunge",      sets: "3 × 10/leg", note: "" },
        { name: "Calf Raise",         sets: "4 × 15",     note: "" },
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
    <Card style={{ gap: 0, padding: 0, overflow: "hidden" }}>
      {/* Fixed header outside scroll */}
      <div className="flex flex-col gap-1 p-8 pb-5">
        <Label>Week 1–4 · Hypertrophy Block</Label>
      </div>
      <GoldRow />
      {/* Scrollable body — exactly 320 px */}
      <div
        className="overflow-y-auto flex flex-col gap-6 px-8 py-5"
        style={{
          height: "320px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(201,168,76,0.2) transparent",
        }}
      >
        {days.map((d, di) => (
          <div key={di} className="flex flex-col gap-2">
            <div className="flex items-baseline gap-3">
              <span style={{ fontFamily: SANS, fontSize: "0.6875rem", fontWeight: 500, color: TEXT, letterSpacing: "0.04em" }}>
                {d.day}
              </span>
              <span style={{ fontFamily: SANS, fontSize: "0.5rem", letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD_60 }}>
                {d.label}
              </span>
            </div>
            <div className="flex flex-col">
              {d.moves.map((m, mi) => (
                <div key={mi}>
                  {mi > 0 && <Row />}
                  <div className="flex items-center justify-between py-2.5 gap-6">
                    <span style={{ fontFamily: SANS, fontSize: "0.75rem", fontWeight: 300, color: TEXT }}>
                      {m.name}
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span style={{ fontFamily: SANS, fontSize: "0.6875rem", fontWeight: 300, color: GOLD_50 }}>
                        {m.sets}
                      </span>
                      {m.note && (
                        <span style={{ fontFamily: SANS, fontSize: "0.5625rem", color: GOLD_60, letterSpacing: "0.08em" }}>
                          {m.note}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
    <Card>
      <Label>Scheduled Review</Label>
      <div className="flex flex-col gap-1">
        <span style={{ fontFamily: DISPLAY, fontSize: "2.5rem", fontWeight: 300, color: TEXT, lineHeight: 1.1 }}>
          April 7, 2026
        </span>
        <span style={{ fontFamily: SANS, fontSize: "0.625rem", fontWeight: 300, color: TEXT_DIM }}>
          10:00 AM · 60 min · Video call
        </span>
      </div>
      <GoldRow />
      <div className="flex flex-col gap-3">
        <Label>Agenda</Label>
        <div className="flex flex-col">
          {agenda.map((item, i) => (
            <div key={i}>
              {i > 0 && <Row />}
              <div className="flex gap-3 py-2.5">
                <span style={{ color: GOLD, opacity: 0.45, flexShrink: 0, fontFamily: SANS, fontSize: "0.625rem", lineHeight: "1.7" }}>
                  —
                </span>
                <span style={{ fontFamily: SANS, fontSize: "0.6875rem", fontWeight: 300, color: TEXT, lineHeight: 1.7 }}>
                  {item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <GoldRow />
      <p style={{ fontFamily: SANS, fontSize: "0.625rem", fontWeight: 300, color: TEXT_DIM, margin: 0, lineHeight: 1.6 }}>
        Prep form sent 48 hours before the call.
      </p>
    </Card>
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
    <div className="min-h-screen flex flex-col" style={{ background: "#0a0a0a" }}>

      {/* Nav */}
      <nav
        className="flex items-center justify-between px-8 py-5"
        style={{ borderBottom: "1px solid rgba(201,168,76,0.12)" }}
      >
        <span style={{ fontFamily: DISPLAY, fontSize: "1rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: TEXT }}>
          Aurea
        </span>
        <div className="flex items-center gap-6">
          <span style={{ fontFamily: SANS, fontSize: "0.5rem", letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD_60 }}>
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

      {/* Content container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WhoopCard />
          <DexaCard />
          <SupplementCard />
          <NutritionCard />
          <WorkoutCard />
          <CheckInCard />
        </div>
      </main>

    </div>
  );
}
