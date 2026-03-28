"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const DISPLAY = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif";
const SANS    = "var(--font-inter), system-ui, sans-serif";
const GOLD    = "#c9a84c";

// ─── Types ────────────────────────────────────────────────────────────────────

type WhoopRow = {
  recovery_score: number | null;
  hrv: number | null;
  sleep_performance: number | null;
  strain: number | null;
  time_in_bed: string | null;
  time_asleep: string | null;
  rem: string | null;
  synced_at: string | null;
};

type DexaRow = {
  scan_date: string | null;
  body_fat_pct: number | null;
  lean_mass_lbs: number | null;
  bone_density: number | null;
  visceral_fat: number | null;
  next_scan_date: string | null;
};

type SupplementRow = {
  name: string;
  dose: string | null;
  timing: string | null;
  sort_order: number;
};

type NutritionRow = {
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  notes: string | null;
};

type WorkoutRow = {
  plan_content: string | null;
  block_name: string | null;
};

type CheckinRow = {
  checkin_date: string | null;
  checkin_time: string | null;
  duration: string | null;
  format: string | null;
  agenda: string[] | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(val: number | null, decimals = 0): string {
  if (val == null) return "—";
  return decimals > 0 ? val.toFixed(decimals) : String(val);
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// ─── Card shell ───────────────────────────────────────────────────────────────

function Card({
  label,
  title,
  children,
  style = {},
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      background: "#111111",
      borderRadius: "1rem",
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      ...style,
    }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{
          fontFamily: SANS, fontSize: "0.625rem", fontWeight: 500,
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(201,168,76,0.5)", margin: "0 0 0.2rem",
        }}>
          {label}
        </p>
        <p style={{
          fontFamily: SANS, fontSize: "0.875rem", fontWeight: 500,
          color: "rgba(245,240,232,0.5)", margin: "0 0 1rem",
        }}>
          {title}
        </p>
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

// ─── Pending placeholder ──────────────────────────────────────────────────────

function Pending({ label }: { label: string }) {
  return (
    <p style={{
      fontFamily: SANS, fontSize: "0.8125rem", fontWeight: 300,
      color: "rgba(245,240,232,0.25)", fontStyle: "italic", margin: 0, lineHeight: 1.6,
    }}>
      Your {label} is being prepared by your Aurea team.
    </p>
  );
}

// ─── 2×2 Stat quad ───────────────────────────────────────────────────────────

function StatQuad({ stats }: {
  stats: { label: string; value: string; unit?: string }[];
}) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr",
      gap: "1px", background: "rgba(255,255,255,0.04)",
      borderRadius: "0.75rem", overflow: "hidden",
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: "#111111", padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
            <span style={{
              fontFamily: DISPLAY, fontSize: "3rem", fontWeight: 300,
              color: "#F5F0E8", lineHeight: 1, letterSpacing: "-0.01em",
            }}>
              {s.value}
            </span>
            {s.unit && (
              <span style={{ fontFamily: SANS, fontSize: "1rem", fontWeight: 300, color: "rgba(245,240,232,0.25)" }}>
                {s.unit}
              </span>
            )}
          </div>
          <p style={{
            fontFamily: SANS, fontSize: "0.625rem", letterSpacing: "0.15em",
            textTransform: "uppercase", color: "rgba(245,240,232,0.3)", margin: "0.5rem 0 0",
          }}>
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Individual cards ─────────────────────────────────────────────────────────

function WhoopCard({ data }: { data: WhoopRow | null }) {
  const syncLabel = data?.synced_at
    ? `Synced ${new Date(data.synced_at).toLocaleDateString("en-US", { month: "long", day: "numeric" })}`
    : "Recovery";

  return (
    <Card label={syncLabel} title="Whoop">
      {data == null ? (
        <Pending label="recovery data" />
      ) : (
        <>
          <StatQuad stats={[
            { label: "Recovery Score", value: fmt(data.recovery_score), unit: data.recovery_score != null ? "%" : undefined },
            { label: "HRV",            value: fmt(data.hrv),            unit: data.hrv != null ? "ms" : undefined },
            { label: "Sleep",          value: fmt(data.sleep_performance), unit: data.sleep_performance != null ? "%" : undefined },
            { label: "Day Strain",     value: fmt(data.strain, 1) },
          ]} />
          {(data.time_in_bed || data.time_asleep || data.rem) && (
            <p style={{
              fontFamily: SANS, fontSize: "0.8125rem", fontWeight: 300,
              color: "rgba(245,240,232,0.5)", margin: "1rem 0 0", lineHeight: 1.6,
            }}>
              {[
                data.time_in_bed  && `${data.time_in_bed} in bed`,
                data.time_asleep  && `${data.time_asleep} asleep`,
                data.rem          && `${data.rem} REM`,
              ].filter(Boolean).join(" · ")}
            </p>
          )}
        </>
      )}
    </Card>
  );
}

function DexaCard({ data }: { data: DexaRow | null }) {
  const scanLabel = data?.scan_date
    ? `Body Composition · ${fmtDate(data.scan_date)}`
    : "Body Composition";

  return (
    <Card label={scanLabel} title="DEXA Scan">
      {data == null ? (
        <Pending label="DEXA scan data" />
      ) : (
        <>
          <StatQuad stats={[
            { label: "Body Fat",     value: fmt(data.body_fat_pct, 1),  unit: data.body_fat_pct != null ? "%" : undefined },
            { label: "Lean Mass",    value: fmt(data.lean_mass_lbs),    unit: data.lean_mass_lbs != null ? "lbs" : undefined },
            { label: "Bone Density", value: fmt(data.bone_density, 2),  unit: data.bone_density != null ? "g/cm²" : undefined },
            { label: "Visceral Fat", value: fmt(data.visceral_fat, 2),  unit: data.visceral_fat != null ? "lbs" : undefined },
          ]} />
          {data.next_scan_date && (
            <p style={{
              fontFamily: SANS, fontSize: "0.8125rem", fontWeight: 300,
              color: "rgba(245,240,232,0.5)", margin: "1rem 0 0", lineHeight: 1.6,
            }}>
              Next scan recommended in 90 days · {fmtDate(data.next_scan_date)}
            </p>
          )}
        </>
      )}
    </Card>
  );
}

function SupplementCard({ data }: { data: SupplementRow[] | null }) {
  return (
    <Card label="Daily Protocol" title="Supplements">
      {data == null || data.length === 0 ? (
        <Pending label="supplement protocol" />
      ) : (
        <div>
          {data.map((s, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}>
              <span style={{ fontFamily: SANS, fontSize: "0.875rem", color: "#F5F0E8" }}>
                {s.name}
              </span>
              <span style={{
                fontFamily: SANS, fontSize: "0.75rem",
                color: "rgba(201,168,76,0.5)", whiteSpace: "nowrap", marginLeft: "1rem",
              }}>
                {[s.dose, s.timing].filter(Boolean).join(" · ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function NutritionCard({ data }: { data: NutritionRow | null }) {
  return (
    <Card label="Daily Targets" title="Nutrition">
      {data == null ? (
        <Pending label="nutrition plan" />
      ) : (
        <>
          <StatQuad stats={[
            { label: "Calories", value: data.calories != null ? data.calories.toLocaleString() : "—", unit: data.calories != null ? "kcal" : undefined },
            { label: "Protein",  value: fmt(data.protein_g), unit: data.protein_g != null ? "g" : undefined },
            { label: "Carbs",    value: fmt(data.carbs_g),   unit: data.carbs_g != null ? "g" : undefined },
            { label: "Fat",      value: fmt(data.fat_g),     unit: data.fat_g != null ? "g" : undefined },
          ]} />
          {data.notes && (
            <div style={{ marginTop: "1rem" }}>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "0.75rem" }} />
              <p style={{
                fontFamily: SANS, fontSize: "0.625rem", fontWeight: 500,
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "rgba(201,168,76,0.5)", margin: "0 0 0.5rem",
              }}>
                Protocol Notes
              </p>
              <p style={{
                fontFamily: SANS, fontSize: "0.8125rem", fontWeight: 300,
                color: "rgba(245,240,232,0.5)", margin: 0, lineHeight: 1.65,
              }}>
                {data.notes}
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

function CheckInCard({ data }: { data: CheckinRow | null }) {
  return (
    <Card label="Scheduled Review" title="Next Check-In">
      {data == null ? (
        <Pending label="upcoming check-in" />
      ) : (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <span style={{
              fontFamily: DISPLAY, fontSize: "2.5rem", fontWeight: 300,
              color: "#F5F0E8", lineHeight: 1.1, display: "block",
            }}>
              {fmtDate(data.checkin_date)}
            </span>
            <span style={{
              fontFamily: SANS, fontSize: "0.75rem", color: "rgba(201,168,76,0.5)",
              letterSpacing: "0.08em", marginTop: "0.3rem", display: "block",
            }}>
              {[data.checkin_time, data.duration, data.format].filter(Boolean).join(" · ")}
            </span>
          </div>
          {data.agenda && data.agenda.length > 0 && (
            <>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "1rem" }} />
              <p style={{
                fontFamily: SANS, fontSize: "0.625rem", fontWeight: 500,
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "rgba(201,168,76,0.5)", margin: "0 0 0.75rem",
              }}>
                Agenda
              </p>
              <div>
                {data.agenda.map((item, i) => (
                  <div key={i} style={{
                    borderLeft: "2px solid rgba(201,168,76,0.3)",
                    paddingLeft: "0.75rem", paddingTop: "0.25rem",
                    paddingBottom: "0.25rem", marginBottom: "0.5rem",
                  }}>
                    <span style={{
                      fontFamily: SANS, fontSize: "0.8125rem", fontWeight: 300,
                      color: "rgba(245,240,232,0.6)", lineHeight: 1.55,
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </Card>
  );
}

function WorkoutCard({ data }: { data: WorkoutRow | null }) {
  // plan_content is stored as a JSON string of the structured workout days
  type Move = { name: string; sets: string; note?: string };
  type Day  = { day: string; label: string; moves: Move[] };
  let days: Day[] = [];
  if (data?.plan_content) {
    try { days = JSON.parse(data.plan_content); } catch { days = []; }
  }

  return (
    <div style={{
      background: "#111111", borderRadius: "1rem",
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.5)", padding: "1.5rem",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{
          fontFamily: SANS, fontSize: "0.625rem", fontWeight: 500,
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(201,168,76,0.5)", margin: "0 0 0.2rem",
        }}>
          {data?.block_name ?? "Training Plan"}
        </p>
        <p style={{
          fontFamily: SANS, fontSize: "0.875rem", fontWeight: 500,
          color: "rgba(245,240,232,0.5)", margin: "0 0 1rem",
        }}>
          Training Plan
        </p>
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
      </div>

      {/* Body */}
      {data == null || days.length === 0 ? (
        <Pending label="training plan" />
      ) : (
        <div style={{
          height: "16rem", overflowY: "auto",
          scrollbarWidth: "thin", scrollbarColor: "rgba(201,168,76,0.2) transparent",
        }}>
          {days.map((d, di) => (
            <div key={di}>
              <div style={{
                display: "flex", alignItems: "baseline", gap: "0.75rem",
                marginTop: di === 0 ? 0 : "1rem", marginBottom: "0.5rem",
              }}>
                <span style={{
                  fontFamily: SANS, fontSize: "0.75rem", letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "rgba(201,168,76,0.6)", fontWeight: 500,
                }}>
                  {d.day}
                </span>
                <span style={{
                  fontFamily: SANS, fontSize: "0.625rem", letterSpacing: "0.15em",
                  textTransform: "uppercase", color: "rgba(245,240,232,0.25)",
                }}>
                  {d.label}
                </span>
              </div>
              {d.moves.map((m, mi) => (
                <div key={mi} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.03)",
                }}>
                  <span style={{ fontFamily: SANS, fontSize: "0.875rem", color: "#F5F0E8", fontWeight: 300 }}>
                    {m.name}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                    <span style={{ fontFamily: SANS, fontSize: "0.75rem", color: "rgba(245,240,232,0.35)" }}>
                      {m.sets}
                    </span>
                    {m.note && (
                      <span style={{
                        fontFamily: SANS, fontSize: "0.625rem",
                        color: "rgba(201,168,76,0.5)", letterSpacing: "0.08em",
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
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [checking, setChecking]       = useState(true);
  const [signOutHov, setSignOutHov]   = useState(false);

  const [whoop,       setWhoop]       = useState<WhoopRow | null | undefined>(undefined);
  const [dexa,        setDexa]        = useState<DexaRow | null | undefined>(undefined);
  const [supplements, setSupplements] = useState<SupplementRow[] | null | undefined>(undefined);
  const [nutrition,   setNutrition]   = useState<NutritionRow | null | undefined>(undefined);
  const [workout,     setWorkout]     = useState<WorkoutRow | null | undefined>(undefined);
  const [checkin,     setCheckin]     = useState<CheckinRow | null | undefined>(undefined);

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      const uid = session.user.id;
      setChecking(false);

      // Fetch all tables in parallel
      const [
        whoopRes,
        dexaRes,
        suppRes,
        nutritionRes,
        workoutRes,
        checkinRes,
      ] = await Promise.all([
        supabase.from("whoop_data")     .select("*").eq("user_id", uid).order("synced_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("dexa_scans")     .select("*").eq("user_id", uid).order("scan_date",  { ascending: false }).limit(1).maybeSingle(),
        supabase.from("supplements")    .select("name, dose, timing, sort_order").eq("user_id", uid).eq("active", true).order("sort_order"),
        supabase.from("nutrition_plans").select("*").eq("user_id", uid).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("workout_plans")  .select("*").eq("user_id", uid).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("checkins")       .select("*").eq("user_id", uid).order("checkin_date", { ascending: true }).gte("checkin_date", new Date().toISOString().split("T")[0]).limit(1).maybeSingle(),
      ]);

      setWhoop(whoopRes.data ?? null);
      setDexa(dexaRes.data ?? null);
      setSupplements(suppRes.data && suppRes.data.length > 0 ? suppRes.data : null);
      setNutrition(nutritionRes.data ?? null);
      setWorkout(workoutRes.data ?? null);
      setCheckin(checkinRes.data ?? null);
    });
  }, [router]);

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.replace("/login");
  }

  if (checking) return null;

  // Show loading skeleton while fetches are in-flight (all undefined = still loading)
  const loading = [whoop, dexa, supplements, nutrition, workout, checkin].every(v => v === undefined);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "#0a0a0a", borderBottom: "1px solid rgba(201,168,76,0.15)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 2.5rem",
      }}>
        <span style={{
          fontFamily: DISPLAY, fontSize: "1rem", fontWeight: 500,
          letterSpacing: "0.18em", textTransform: "uppercase", color: "#F5F0E8",
        }}>
          Aurea
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{
            fontFamily: SANS, fontSize: "0.625rem", letterSpacing: "0.22em",
            textTransform: "uppercase", color: "rgba(201,168,76,0.6)",
          }}>
            Member Dashboard
          </span>
          <button
            onClick={handleSignOut}
            onMouseEnter={() => setSignOutHov(true)}
            onMouseLeave={() => setSignOutHov(false)}
            style={{
              fontFamily: SANS, fontSize: "0.5625rem", fontWeight: 500,
              letterSpacing: "0.22em", textTransform: "uppercase",
              padding: "0.625rem 1.25rem",
              border: `1px solid ${signOutHov ? GOLD : "rgba(201,168,76,0.3)"}`,
              color: signOutHov ? "#0a0a0a" : GOLD,
              background: signOutHov ? GOLD : "transparent",
              cursor: "pointer", transition: "all 0.25s ease",
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Content */}
      <div style={{
        maxWidth: "1280px", margin: "0 auto", padding: "2rem 2.5rem",
        opacity: loading ? 0.4 : 1, transition: "opacity 0.3s ease",
      }}>

        {/* Row 1: Whoop + DEXA */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
          <WhoopCard data={whoop ?? null} />
          <DexaCard  data={dexa  ?? null} />
        </div>

        {/* Row 2: Supplements + Nutrition + Check-in */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
          <SupplementCard data={supplements ?? null} />
          <NutritionCard  data={nutrition   ?? null} />
          <CheckInCard    data={checkin     ?? null} />
        </div>

        {/* Row 3: Workout — full width */}
        <WorkoutCard data={workout ?? null} />

      </div>
    </div>
  );
}
