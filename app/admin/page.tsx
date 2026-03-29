"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

// ─── Constants ────────────────────────────────────────────────────────────────

const DISPLAY = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif";
const SANS    = "var(--font-inter), system-ui, sans-serif";
const GOLD    = "#c9a84c";
const BG      = "#0a0a0a";
const TEXT    = "#F5F0E8";

// ─── Types ────────────────────────────────────────────────────────────────────

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

type Tab =
  | "profiles"
  | "whoop_data"
  | "dexa_scans"
  | "supplements"
  | "nutrition_plans"
  | "workout_plans"
  | "checkins";

type WhoopFields = {
  id: string | null;
  recovery_score: string;
  hrv: string;
  sleep_performance: string;
  strain: string;
  time_in_bed: string;
  time_asleep: string;
  rem: string;
  synced_at: string;
};

type DexaFields = {
  id: string | null;
  scan_date: string;
  body_fat_pct: string;
  lean_mass_lbs: string;
  bone_density: string;
  visceral_fat: string;
  next_scan_date: string;
};

type NutritionFields = {
  id: string | null;
  calories: string;
  protein_g: string;
  carbs_g: string;
  fat_g: string;
  notes: string;
};

type WorkoutMove = {
  name: string;
  sets: string;
  note: string;
};

type WorkoutDay = {
  day: string;
  label: string;
  moves: WorkoutMove[];
};

type WorkoutFields = {
  id: string | null;
  block_name: string;
  days: WorkoutDay[];
};

type CheckinFields = {
  id: string | null;
  checkin_date: string;
  checkin_time: string;
  duration: string;
  format: string;
  agenda: string;
};

type ProfileFields = {
  full_name: string;
  email: string;
  age: string;
  weight_lbs: string;
  height_in: string;
  notes: string;
};

type SupplementRow = {
  id: string | null;
  name: string;
  dose: string;
  timing: string;
  sort_order: string;
  active: boolean;
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultWhoop: WhoopFields = {
  id: null, recovery_score: "", hrv: "", sleep_performance: "",
  strain: "", time_in_bed: "", time_asleep: "", rem: "", synced_at: "",
};
const defaultDexa: DexaFields = {
  id: null, scan_date: "", body_fat_pct: "", lean_mass_lbs: "",
  bone_density: "", visceral_fat: "", next_scan_date: "",
};
const defaultNutrition: NutritionFields = {
  id: null, calories: "", protein_g: "", carbs_g: "", fat_g: "", notes: "",
};
const defaultWorkout: WorkoutFields = { id: null, block_name: "", days: [] };
const defaultCheckin: CheckinFields = {
  id: null, checkin_date: "", checkin_time: "", duration: "", format: "", agenda: "",
};
const defaultProfile: ProfileFields = {
  full_name: "", email: "", age: "", weight_lbs: "", height_in: "", notes: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function n(v: number | null | undefined): string {
  return v == null ? "" : String(v);
}
function s(v: string | null | undefined): string {
  return v ?? "";
}

// ─── Shared input styles ──────────────────────────────────────────────────────

const inputSt: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#0d0d0d",
  border: "1px solid #242424",
  color: TEXT,
  fontFamily: SANS,
  fontSize: "0.8125rem",
  fontWeight: 300,
  padding: "0.625rem 0.875rem",
  outline: "none",
  caretColor: GOLD,
  transition: "border-color 0.2s ease",
};

const textareaSt: React.CSSProperties = {
  ...inputSt,
  resize: "vertical",
  minHeight: "6rem",
  lineHeight: 1.6,
};

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label style={{
        fontFamily: SANS, fontSize: "0.5rem", fontWeight: 500,
        letterSpacing: "0.22em", textTransform: "uppercase" as const,
        color: "rgba(245,240,232,0.35)",
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Tab: Whoop ───────────────────────────────────────────────────────────────

function WhoopForm({ data, onChange }: { data: WhoopFields; onChange: (d: WhoopFields) => void }) {
  const set = (key: keyof WhoopFields) =>
    (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, [key]: e.target.value });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
      <Field label="Recovery Score">
        <input style={inputSt} type="number" step="0.1" value={data.recovery_score} onChange={set("recovery_score")} placeholder="—" />
      </Field>
      <Field label="HRV (ms)">
        <input style={inputSt} type="number" step="0.1" value={data.hrv} onChange={set("hrv")} placeholder="—" />
      </Field>
      <Field label="Sleep Performance">
        <input style={inputSt} type="number" step="0.1" value={data.sleep_performance} onChange={set("sleep_performance")} placeholder="—" />
      </Field>
      <Field label="Strain">
        <input style={inputSt} type="number" step="0.1" value={data.strain} onChange={set("strain")} placeholder="—" />
      </Field>
      <Field label="Time in Bed">
        <input style={inputSt} type="text" value={data.time_in_bed} onChange={set("time_in_bed")} placeholder="e.g. 7h 30m" />
      </Field>
      <Field label="Time Asleep">
        <input style={inputSt} type="text" value={data.time_asleep} onChange={set("time_asleep")} placeholder="e.g. 6h 45m" />
      </Field>
      <Field label="REM">
        <input style={inputSt} type="text" value={data.rem} onChange={set("rem")} placeholder="e.g. 1h 20m" />
      </Field>
      <Field label="Synced At">
        <input style={inputSt} type="datetime-local" value={data.synced_at} onChange={set("synced_at")} />
      </Field>
    </div>
  );
}

// ─── Tab: Profile ─────────────────────────────────────────────────────────────

function ProfileForm({ data, onChange }: { data: ProfileFields; onChange: (d: ProfileFields) => void }) {
  const set = (key: keyof ProfileFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...data, [key]: e.target.value });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Field label="Full Name">
          <input style={inputSt} type="text" value={data.full_name} onChange={set("full_name")} placeholder="John Smith" />
        </Field>
        <Field label="Email">
          <input style={inputSt} type="email" value={data.email} onChange={set("email")} placeholder="client@example.com" />
        </Field>
        <Field label="Age">
          <input style={inputSt} type="number" value={data.age} onChange={set("age")} placeholder="—" />
        </Field>
        <Field label="Weight (lbs)">
          <input style={inputSt} type="number" step="0.1" value={data.weight_lbs} onChange={set("weight_lbs")} placeholder="—" />
        </Field>
        <Field label="Height (inches)">
          <input style={inputSt} type="number" step="0.1" value={data.height_in} onChange={set("height_in")} placeholder="e.g. 70 for 5′10″" />
        </Field>
      </div>
      <Field label="Notes">
        <textarea style={textareaSt} value={data.notes} onChange={set("notes")} placeholder="Client notes…" />
      </Field>
    </div>
  );
}

// ─── Tab: DEXA ────────────────────────────────────────────────────────────────

function DexaForm({ data, onChange }: { data: DexaFields; onChange: (d: DexaFields) => void }) {
  const set = (key: keyof DexaFields) =>
    (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, [key]: e.target.value });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
      <Field label="Scan Date">
        <input style={inputSt} type="date" value={data.scan_date} onChange={set("scan_date")} />
      </Field>
      <Field label="Next Scan Date">
        <input style={inputSt} type="date" value={data.next_scan_date} onChange={set("next_scan_date")} />
      </Field>
      <Field label="Body Fat %">
        <input style={inputSt} type="number" step="0.1" value={data.body_fat_pct} onChange={set("body_fat_pct")} placeholder="—" />
      </Field>
      <Field label="Lean Mass (lbs)">
        <input style={inputSt} type="number" step="0.1" value={data.lean_mass_lbs} onChange={set("lean_mass_lbs")} placeholder="—" />
      </Field>
      <Field label="Bone Density (g/cm²)">
        <input style={inputSt} type="number" step="0.001" value={data.bone_density} onChange={set("bone_density")} placeholder="—" />
      </Field>
      <Field label="Visceral Fat (lbs)">
        <input style={inputSt} type="number" step="0.01" value={data.visceral_fat} onChange={set("visceral_fat")} placeholder="—" />
      </Field>
    </div>
  );
}

// ─── Tab: Nutrition ───────────────────────────────────────────────────────────

function NutritionForm({ data, onChange }: { data: NutritionFields; onChange: (d: NutritionFields) => void }) {
  const set = (key: keyof NutritionFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...data, [key]: e.target.value });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Field label="Calories (kcal)">
          <input style={inputSt} type="number" value={data.calories} onChange={set("calories")} placeholder="—" />
        </Field>
        <Field label="Protein (g)">
          <input style={inputSt} type="number" value={data.protein_g} onChange={set("protein_g")} placeholder="—" />
        </Field>
        <Field label="Carbs (g)">
          <input style={inputSt} type="number" value={data.carbs_g} onChange={set("carbs_g")} placeholder="—" />
        </Field>
        <Field label="Fat (g)">
          <input style={inputSt} type="number" value={data.fat_g} onChange={set("fat_g")} placeholder="—" />
        </Field>
      </div>
      <Field label="Notes">
        <textarea style={textareaSt} value={data.notes} onChange={set("notes")} placeholder="Protocol notes…" />
      </Field>
    </div>
  );
}

// ─── Tab: Workouts ────────────────────────────────────────────────────────────

function WorkoutForm({ data, onChange }: { data: WorkoutFields; onChange: (d: WorkoutFields) => void }) {
  function setDay(di: number, key: "day" | "label", val: string) {
    onChange({
      ...data,
      days: data.days.map((d, i) => i === di ? { ...d, [key]: val } : d),
    });
  }

  function setMove(di: number, mi: number, key: keyof WorkoutMove, val: string) {
    onChange({
      ...data,
      days: data.days.map((d, i) => {
        if (i !== di) return d;
        return { ...d, moves: d.moves.map((m, j) => j === mi ? { ...m, [key]: val } : m) };
      }),
    });
  }

  function addDay() {
    onChange({ ...data, days: [...data.days, { day: "", label: "", moves: [] }] });
  }

  function removeDay(di: number) {
    onChange({ ...data, days: data.days.filter((_, i) => i !== di) });
  }

  function addMove(di: number) {
    onChange({
      ...data,
      days: data.days.map((d, i) =>
        i === di ? { ...d, moves: [...d.moves, { name: "", sets: "", note: "" }] } : d
      ),
    });
  }

  function removeMove(di: number, mi: number) {
    onChange({
      ...data,
      days: data.days.map((d, i) =>
        i === di ? { ...d, moves: d.moves.filter((_, j) => j !== mi) } : d
      ),
    });
  }

  const colLabel: React.CSSProperties = {
    fontFamily: SANS, fontSize: "0.5rem", fontWeight: 500,
    letterSpacing: "0.22em", textTransform: "uppercase",
    color: "rgba(245,240,232,0.35)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Block name */}
      <Field label="Block Name">
        <input
          style={inputSt}
          type="text"
          value={data.block_name}
          onChange={e => onChange({ ...data, block_name: e.target.value })}
          placeholder="e.g. Hypertrophy Block 1"
        />
      </Field>

      {/* Days */}
      {data.days.length === 0 && (
        <p style={{
          fontFamily: SANS, fontSize: "0.8125rem", fontWeight: 300,
          color: "rgba(245,240,232,0.2)", fontStyle: "italic", margin: 0,
        }}>
          No training days yet. Add one below.
        </p>
      )}

      {data.days.map((day, di) => (
        <div
          key={di}
          style={{
            background: "#0d0d0d",
            border: "1px solid #1c1c1c",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.875rem",
          }}
        >
          {/* Day header row */}
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
            <div style={{ width: "90px", flexShrink: 0 }}>
              <Field label="Day">
                <input
                  style={inputSt}
                  type="text"
                  value={day.day}
                  onChange={e => setDay(di, "day", e.target.value)}
                  placeholder="Mon"
                />
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="Label">
                <input
                  style={inputSt}
                  type="text"
                  value={day.label}
                  onChange={e => setDay(di, "label", e.target.value)}
                  placeholder="Upper Push"
                />
              </Field>
            </div>
            <button
              onClick={() => removeDay(di)}
              style={{
                fontFamily: SANS, fontSize: "0.5rem", fontWeight: 500,
                letterSpacing: "0.15em", textTransform: "uppercase",
                color: "rgba(255,80,80,0.5)",
                background: "none",
                border: "1px solid rgba(255,80,80,0.2)",
                padding: "0.625rem 0.75rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Remove Day
            </button>
          </div>

          {/* Exercise column headers */}
          {day.moves.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 28px",
              gap: "0.5rem",
              paddingLeft: "0.125rem",
            }}>
              <span style={colLabel}>Exercise</span>
              <span style={colLabel}>Sets</span>
              <span style={colLabel}>Note</span>
              <span />
            </div>
          )}

          {/* Exercise rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {day.moves.map((move, mi) => (
              <div
                key={mi}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 28px",
                  gap: "0.5rem",
                  alignItems: "center",
                }}
              >
                <input
                  style={inputSt}
                  type="text"
                  value={move.name}
                  onChange={e => setMove(di, mi, "name", e.target.value)}
                  placeholder="Exercise name"
                />
                <input
                  style={inputSt}
                  type="text"
                  value={move.sets}
                  onChange={e => setMove(di, mi, "sets", e.target.value)}
                  placeholder="4×8"
                />
                <input
                  style={inputSt}
                  type="text"
                  value={move.note}
                  onChange={e => setMove(di, mi, "note", e.target.value)}
                  placeholder="Optional"
                />
                <button
                  onClick={() => removeMove(di, mi)}
                  style={{
                    fontFamily: SANS, fontSize: "0.75rem",
                    color: "rgba(255,80,80,0.45)",
                    background: "none",
                    border: "1px solid rgba(255,80,80,0.15)",
                    width: "28px", height: "28px",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Add exercise */}
          <button
            onClick={() => addMove(di)}
            style={{
              fontFamily: SANS, fontSize: "0.5rem", fontWeight: 500,
              letterSpacing: "0.18em", textTransform: "uppercase",
              padding: "0.5rem 0.75rem",
              border: "1px solid rgba(201,168,76,0.2)",
              color: "rgba(201,168,76,0.6)",
              background: "transparent", cursor: "pointer",
              alignSelf: "flex-start",
            }}
          >
            + Add Exercise
          </button>
        </div>
      ))}

      {/* Add day */}
      <button
        onClick={addDay}
        style={{
          fontFamily: SANS, fontSize: "0.5625rem", fontWeight: 500,
          letterSpacing: "0.18em", textTransform: "uppercase",
          padding: "0.625rem",
          border: "1px solid rgba(201,168,76,0.25)",
          color: GOLD, background: "transparent", cursor: "pointer",
        }}
      >
        + Add Training Day
      </button>
    </div>
  );
}

// ─── Tab: Check-Ins ───────────────────────────────────────────────────────────

function CheckinForm({ data, onChange }: { data: CheckinFields; onChange: (d: CheckinFields) => void }) {
  const set = (key: keyof CheckinFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...data, [key]: e.target.value });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Field label="Check-In Date">
          <input style={inputSt} type="date" value={data.checkin_date} onChange={set("checkin_date")} />
        </Field>
        <Field label="Time">
          <input style={inputSt} type="text" value={data.checkin_time} onChange={set("checkin_time")} placeholder="e.g. 10:00 AM" />
        </Field>
        <Field label="Duration">
          <input style={inputSt} type="text" value={data.duration} onChange={set("duration")} placeholder="e.g. 45 minutes" />
        </Field>
        <Field label="Format">
          <input style={inputSt} type="text" value={data.format} onChange={set("format")} placeholder="e.g. Video call" />
        </Field>
      </div>
      <Field label="Agenda (one item per line)">
        <textarea
          style={textareaSt}
          value={data.agenda}
          onChange={set("agenda")}
          placeholder={"Review progress\nAdjust nutrition targets\nQ&A"}
        />
      </Field>
    </div>
  );
}

// ─── Tab: Supplements (multi-row) ─────────────────────────────────────────────

function SupplementsForm({
  rows,
  onChange,
  onAdd,
  onRemove,
}: {
  rows: SupplementRow[];
  onChange: (idx: number, row: SupplementRow) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {rows.length === 0 && (
        <p style={{
          fontFamily: SANS, fontSize: "0.8125rem", fontWeight: 300,
          color: "rgba(245,240,232,0.25)", fontStyle: "italic",
          margin: "0 0 0.5rem",
        }}>
          No supplements yet. Add one below.
        </p>
      )}
      {rows.map((row, i) => (
        <div
          key={row.id ?? `new-${i}`}
          style={{
            background: "#0d0d0d",
            border: "1px solid #1c1c1c",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{
              fontFamily: SANS, fontSize: "0.5rem", fontWeight: 500,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(201,168,76,0.4)",
            }}>
              Supplement {i + 1}
            </span>
            <button
              onClick={() => onRemove(i)}
              style={{
                fontFamily: SANS, fontSize: "0.5rem", fontWeight: 500,
                letterSpacing: "0.15em", textTransform: "uppercase",
                color: "rgba(255,80,80,0.5)",
                background: "none",
                border: "1px solid rgba(255,80,80,0.2)",
                padding: "0.25rem 0.625rem",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 0.6fr", gap: "0.75rem", alignItems: "end" }}>
            <Field label="Name">
              <input
                style={inputSt}
                type="text"
                value={row.name}
                onChange={e => onChange(i, { ...row, name: e.target.value })}
                placeholder="Supplement name"
              />
            </Field>
            <Field label="Dose">
              <input
                style={inputSt}
                type="text"
                value={row.dose}
                onChange={e => onChange(i, { ...row, dose: e.target.value })}
                placeholder="e.g. 500mg"
              />
            </Field>
            <Field label="Timing">
              <input
                style={inputSt}
                type="text"
                value={row.timing}
                onChange={e => onChange(i, { ...row, timing: e.target.value })}
                placeholder="e.g. AM"
              />
            </Field>
            <Field label="Order">
              <input
                style={inputSt}
                type="number"
                value={row.sort_order}
                onChange={e => onChange(i, { ...row, sort_order: e.target.value })}
                placeholder="0"
              />
            </Field>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={row.active}
              onChange={e => onChange(i, { ...row, active: e.target.checked })}
              style={{ accentColor: GOLD, width: "14px", height: "14px" }}
            />
            <span style={{
              fontFamily: SANS, fontSize: "0.6875rem", fontWeight: 300,
              color: "rgba(245,240,232,0.45)",
            }}>
              Active
            </span>
          </label>
        </div>
      ))}
      <button
        onClick={onAdd}
        style={{
          fontFamily: SANS, fontSize: "0.5625rem", fontWeight: 500,
          letterSpacing: "0.18em", textTransform: "uppercase",
          padding: "0.625rem",
          border: "1px solid rgba(201,168,76,0.25)",
          color: GOLD, background: "transparent", cursor: "pointer",
          transition: "all 0.2s ease",
          marginTop: rows.length > 0 ? "0.25rem" : 0,
        }}
      >
        + Add Supplement
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS: Tab[] = [
  "profiles",
  "whoop_data",
  "dexa_scans",
  "supplements",
  "nutrition_plans",
  "workout_plans",
  "checkins",
];

const TAB_LABELS: Record<Tab, string> = {
  profiles: "Profile",
  whoop_data: "Whoop",
  dexa_scans: "DEXA",
  supplements: "Supplements",
  nutrition_plans: "Nutrition",
  workout_plans: "Workouts",
  checkins: "Check-Ins",
};

export default function AdminPage() {
  const router = useRouter();

  // ── Auth ──────────────────────────────────────────────────────────────────
  const [checking, setChecking]   = useState(true);
  const [token, setToken]         = useState("");
  const [signOutHov, setSignOutHov] = useState(false);

  // ── Clients sidebar ───────────────────────────────────────────────────────
  const [profiles, setProfiles]         = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [selectedId, setSelectedId]     = useState<string | null>(null);

  // ── Active tab + loading ──────────────────────────────────────────────────
  const [activeTab, setActiveTab]   = useState<Tab>("whoop_data");
  const [loadingData, setLoadingData] = useState(false);

  // ── Tab form states ───────────────────────────────────────────────────────
  const [profile,     setProfile]     = useState<ProfileFields>(defaultProfile);
  const [whoop,       setWhoop]       = useState<WhoopFields>(defaultWhoop);
  const [dexa,        setDexa]        = useState<DexaFields>(defaultDexa);
  const [nutrition,   setNutrition]   = useState<NutritionFields>(defaultNutrition);
  const [workout,     setWorkout]     = useState<WorkoutFields>(defaultWorkout);
  const [checkin,     setCheckin]     = useState<CheckinFields>(defaultCheckin);
  const [supplements, setSupplements] = useState<SupplementRow[]>([]);
  const [deletedSupIds, setDeletedSupIds] = useState<string[]>([]);

  // ── Save feedback ─────────────────────────────────────────────────────────
  const [saving,  setSaving]  = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // ── Add client modal ──────────────────────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail,    setNewEmail]    = useState("");
  const [newName,     setNewName]     = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating,    setCreating]    = useState(false);
  const [createError, setCreateError] = useState("");

  // ── Auth gate ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }

      // Check admin email directly from the session — no API round-trip needed.
      // NEXT_PUBLIC_ADMIN_EMAIL must match ADMIN_EMAIL in your env.
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase().trim();
      const userEmail  = (session.user.email ?? "").toLowerCase().trim();
      if (!adminEmail || userEmail !== adminEmail) {
        router.replace("/dashboard");
        return;
      }

      const tok = session.access_token;
      setToken(tok);
      setLoadingProfiles(true);

      const res = await fetch("/api/admin/profiles", {
        headers: { Authorization: `Bearer ${tok}` },
      });

      if (!res.ok) {
        // Profiles table may not exist yet — still show the panel so the
        // admin can use Add New Client to get started.
        setLoadingProfiles(false);
        setChecking(false);
        return;
      }

      const { data } = await res.json();
      setProfiles(data ?? []);
      setLoadingProfiles(false);
      setChecking(false);
    });
  }, [router]);

  // ── Load all table data for a selected client ─────────────────────────────
  const loadClientData = useCallback(async (userId: string, tok: string) => {
    setLoadingData(true);
    setDeletedSupIds([]);

    const hdrs = { Authorization: `Bearer ${tok}` };
    const get = (table: string) =>
      fetch(`/api/admin/user-data?userId=${userId}&table=${table}`, { headers: hdrs })
        .then(r => r.json());

    const [profileRes, whoopRes, dexaRes, suppRes, nutritionRes, workoutRes, checkinRes] =
      await Promise.all([
        get("profiles"),
        get("whoop_data"),
        get("dexa_scans"),
        get("supplements"),
        get("nutrition_plans"),
        get("workout_plans"),
        get("checkins"),
      ]);

    const pr = profileRes.data;
    setProfile(pr ? {
      full_name: s(pr.full_name),
      email: s(pr.email),
      age: n(pr.age),
      weight_lbs: n(pr.weight_lbs),
      height_in: n(pr.height_in),
      notes: s(pr.notes),
    } : defaultProfile);

    const w = whoopRes.data;
    setWhoop(w ? {
      id: w.id,
      recovery_score: n(w.recovery_score),
      hrv: n(w.hrv),
      sleep_performance: n(w.sleep_performance),
      strain: n(w.strain),
      time_in_bed: s(w.time_in_bed),
      time_asleep: s(w.time_asleep),
      rem: s(w.rem),
      synced_at: w.synced_at ? String(w.synced_at).slice(0, 16) : "",
    } : defaultWhoop);

    const dx = dexaRes.data;
    setDexa(dx ? {
      id: dx.id,
      scan_date: s(dx.scan_date),
      body_fat_pct: n(dx.body_fat_pct),
      lean_mass_lbs: n(dx.lean_mass_lbs),
      bone_density: n(dx.bone_density),
      visceral_fat: n(dx.visceral_fat),
      next_scan_date: s(dx.next_scan_date),
    } : defaultDexa);

    const nu = nutritionRes.data;
    setNutrition(nu ? {
      id: nu.id,
      calories: n(nu.calories),
      protein_g: n(nu.protein_g),
      carbs_g: n(nu.carbs_g),
      fat_g: n(nu.fat_g),
      notes: s(nu.notes),
    } : defaultNutrition);

    const wo = workoutRes.data;
    let parsedDays: WorkoutDay[] = [];
    if (wo?.plan_content) {
      try { parsedDays = JSON.parse(wo.plan_content); } catch { parsedDays = []; }
    }
    setWorkout(wo ? {
      id: wo.id,
      block_name: s(wo.block_name),
      days: parsedDays,
    } : defaultWorkout);

    const ci = checkinRes.data;
    setCheckin(ci ? {
      id: ci.id,
      checkin_date: s(ci.checkin_date),
      checkin_time: s(ci.checkin_time),
      duration: s(ci.duration),
      format: s(ci.format),
      agenda: Array.isArray(ci.agenda) ? ci.agenda.join("\n") : "",
    } : defaultCheckin);

    const sups: SupplementRow[] = (suppRes.data ?? []).map(
      (row: Record<string, unknown>) => ({
        id: row.id as string,
        name: s(row.name as string | null),
        dose: s(row.dose as string | null),
        timing: s(row.timing as string | null),
        sort_order: n(row.sort_order as number | null),
        active: row.active !== false,
      })
    );
    setSupplements(sups);

    setLoadingData(false);
  }, []);

  async function selectClient(id: string) {
    setSelectedId(id);
    setActiveTab("profiles");
    setSaveMsg("");
    await loadClientData(id, token);
  }

  // ── Save current tab ──────────────────────────────────────────────────────
  async function handleSave() {
    if (!selectedId) return;
    setSaving(true);
    setSaveMsg("");

    const hdrs = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any;

    if (activeTab === "supplements") {
      body = {
        table: "supplements",
        userId: selectedId,
        rows: supplements.map(row => ({
          id: row.id,
          name: row.name,
          dose: row.dose || null,
          timing: row.timing || null,
          sort_order: Number(row.sort_order) || 0,
          active: row.active,
        })),
        deletedIds: deletedSupIds,
      };
    } else if (activeTab === "profiles") {
      body = {
        table: "profiles",
        userId: selectedId,
        data: {
          full_name: profile.full_name || null,
          email: profile.email || null,
          age: profile.age !== "" ? Number(profile.age) : null,
          weight_lbs: profile.weight_lbs !== "" ? Number(profile.weight_lbs) : null,
          height_in: profile.height_in !== "" ? Number(profile.height_in) : null,
          notes: profile.notes || null,
        },
      };
    } else if (activeTab === "whoop_data") {
      body = {
        table: "whoop_data",
        userId: selectedId,
        id: whoop.id,
        data: {
          recovery_score: whoop.recovery_score !== "" ? Number(whoop.recovery_score) : null,
          hrv: whoop.hrv !== "" ? Number(whoop.hrv) : null,
          sleep_performance: whoop.sleep_performance !== "" ? Number(whoop.sleep_performance) : null,
          strain: whoop.strain !== "" ? Number(whoop.strain) : null,
          time_in_bed: whoop.time_in_bed || null,
          time_asleep: whoop.time_asleep || null,
          rem: whoop.rem || null,
          synced_at: whoop.synced_at || new Date().toISOString(),
        },
      };
    } else if (activeTab === "dexa_scans") {
      body = {
        table: "dexa_scans",
        userId: selectedId,
        id: dexa.id,
        data: {
          scan_date: dexa.scan_date || null,
          body_fat_pct: dexa.body_fat_pct !== "" ? Number(dexa.body_fat_pct) : null,
          lean_mass_lbs: dexa.lean_mass_lbs !== "" ? Number(dexa.lean_mass_lbs) : null,
          bone_density: dexa.bone_density !== "" ? Number(dexa.bone_density) : null,
          visceral_fat: dexa.visceral_fat !== "" ? Number(dexa.visceral_fat) : null,
          next_scan_date: dexa.next_scan_date || null,
        },
      };
    } else if (activeTab === "nutrition_plans") {
      body = {
        table: "nutrition_plans",
        userId: selectedId,
        id: nutrition.id,
        data: {
          calories: nutrition.calories !== "" ? Number(nutrition.calories) : null,
          protein_g: nutrition.protein_g !== "" ? Number(nutrition.protein_g) : null,
          carbs_g: nutrition.carbs_g !== "" ? Number(nutrition.carbs_g) : null,
          fat_g: nutrition.fat_g !== "" ? Number(nutrition.fat_g) : null,
          notes: nutrition.notes || null,
        },
      };
    } else if (activeTab === "workout_plans") {
      body = {
        table: "workout_plans",
        userId: selectedId,
        id: workout.id,
        data: {
          block_name: workout.block_name || null,
          plan_content: workout.days.length > 0
            ? JSON.stringify(workout.days.map(d => ({
                day: d.day,
                label: d.label,
                moves: d.moves.map(m => ({
                  name: m.name,
                  sets: m.sets,
                  ...(m.note ? { note: m.note } : {}),
                })),
              })))
            : null,
        },
      };
    } else {
      body = {
        table: "checkins",
        userId: selectedId,
        id: checkin.id,
        data: {
          checkin_date: checkin.checkin_date || null,
          checkin_time: checkin.checkin_time || null,
          duration: checkin.duration || null,
          format: checkin.format || null,
          agenda: checkin.agenda
            ? checkin.agenda.split("\n").map(l => l.trim()).filter(Boolean)
            : null,
        },
      };
    }

    const res = await fetch("/api/admin/save", {
      method: "POST",
      headers: hdrs,
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (!res.ok) {
      setSaveMsg(`Error: ${result.error}`);
    } else {
      setSaveMsg("Saved.");
      await loadClientData(selectedId, token);
      // Refresh sidebar names when profile is edited
      if (activeTab === "profiles") {
        const profilesRes = await fetch("/api/admin/profiles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profilesRes.ok) {
          const { data: updatedProfiles } = await profilesRes.json();
          setProfiles(updatedProfiles ?? []);
        }
      }
    }

    setSaving(false);
    setTimeout(() => setSaveMsg(""), 4000);
  }

  // ── Create new client ─────────────────────────────────────────────────────
  async function handleCreateUser() {
    if (!newEmail || !newPassword) {
      setCreateError("Email and password are required.");
      return;
    }
    setCreating(true);
    setCreateError("");

    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: newEmail, password: newPassword, full_name: newName }),
    });

    const data = await res.json();

    if (!res.ok) {
      setCreateError(data.error ?? "Failed to create client.");
      setCreating(false);
      return;
    }

    // Refresh profile list
    const profilesRes = await fetch("/api/admin/profiles", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { data: updatedProfiles } = await profilesRes.json();
    setProfiles(updatedProfiles ?? []);

    setShowAddModal(false);
    setNewEmail("");
    setNewName("");
    setNewPassword("");
    setCreating(false);

    // Auto-select new client
    selectClient(data.user.id);
  }

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.replace("/login");
  }

  if (checking) return null;

  const selectedProfile = profiles.find(p => p.id === selectedId);

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column" }}>

      {/* ── Nav ───────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 20,
        background: BG, borderBottom: "1px solid rgba(201,168,76,0.15)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 2.5rem", flexShrink: 0,
      }}>
        <span style={{
          fontFamily: DISPLAY, fontSize: "1rem", fontWeight: 500,
          letterSpacing: "0.18em", textTransform: "uppercase", color: TEXT,
        }}>
          Aurea
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{
            fontFamily: SANS, fontSize: "0.625rem", letterSpacing: "0.22em",
            textTransform: "uppercase", color: "rgba(201,168,76,0.6)",
          }}>
            Admin Panel
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
              color: signOutHov ? BG : GOLD,
              background: signOutHov ? GOLD : "transparent",
              cursor: "pointer", transition: "all 0.25s ease",
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div style={{
        display: "flex", flex: 1,
        height: "calc(100vh - 57px)", overflow: "hidden",
      }}>

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <div style={{
          width: "260px", flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.05)",
          background: "#090909",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Sidebar label */}
          <div style={{
            padding: "1.25rem 1.25rem 1rem",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>
            <p style={{
              fontFamily: SANS, fontSize: "0.5rem", fontWeight: 500,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "rgba(201,168,76,0.5)", margin: 0,
            }}>
              Clients
            </p>
          </div>

          {/* Client list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0" }}>
            {loadingProfiles ? (
              <p style={{
                fontFamily: SANS, fontSize: "0.75rem",
                color: "rgba(245,240,232,0.2)",
                padding: "1rem 1.25rem", margin: 0,
              }}>
                Loading…
              </p>
            ) : profiles.length === 0 ? (
              <p style={{
                fontFamily: SANS, fontSize: "0.75rem", fontStyle: "italic",
                color: "rgba(245,240,232,0.2)",
                padding: "1rem 1.25rem", margin: 0,
              }}>
                No clients yet.
              </p>
            ) : (
              profiles.map(p => (
                <button
                  key={p.id}
                  onClick={() => selectClient(p.id)}
                  style={{
                    width: "100%", textAlign: "left",
                    background: selectedId === p.id ? "rgba(201,168,76,0.07)" : "transparent",
                    border: "none",
                    borderLeft: `2px solid ${selectedId === p.id ? GOLD : "transparent"}`,
                    padding: "0.75rem 1.25rem",
                    cursor: "pointer", transition: "all 0.15s ease",
                  }}
                >
                  <div style={{
                    fontFamily: SANS, fontSize: "0.8125rem", fontWeight: selectedId === p.id ? 500 : 300,
                    color: selectedId === p.id ? TEXT : "rgba(245,240,232,0.5)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {p.full_name || p.email}
                  </div>
                  {p.full_name && (
                    <div style={{
                      fontFamily: SANS, fontSize: "0.625rem",
                      color: "rgba(245,240,232,0.25)", marginTop: "0.125rem",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {p.email}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Add client button */}
          <div style={{ padding: "1rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <button
              onClick={() => { setShowAddModal(true); setCreateError(""); }}
              style={{
                width: "100%",
                fontFamily: SANS, fontSize: "0.5625rem", fontWeight: 500,
                letterSpacing: "0.18em", textTransform: "uppercase",
                padding: "0.625rem",
                border: "1px solid rgba(201,168,76,0.25)",
                color: GOLD, background: "transparent", cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              + Add New Client
            </button>
          </div>
        </div>

        {/* ── Main panel ────────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "2rem 2.5rem" }}>
          {!selectedId ? (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: "100%",
            }}>
              <p style={{
                fontFamily: SANS, fontSize: "0.8125rem", fontWeight: 300,
                color: "rgba(245,240,232,0.2)", fontStyle: "italic",
              }}>
                Select a client to view and edit their data.
              </p>
            </div>
          ) : (
            <div>
              {/* Client name header */}
              <div style={{ marginBottom: "1.75rem" }}>
                <h1 style={{
                  fontFamily: DISPLAY, fontSize: "1.75rem", fontWeight: 400,
                  color: TEXT, margin: "0 0 0.25rem", letterSpacing: "0.02em",
                }}>
                  {selectedProfile?.full_name || selectedProfile?.email}
                </h1>
                {selectedProfile?.full_name && (
                  <p style={{
                    fontFamily: SANS, fontSize: "0.75rem",
                    color: "rgba(245,240,232,0.3)", margin: 0,
                  }}>
                    {selectedProfile.email}
                  </p>
                )}
              </div>

              {/* Tab bar */}
              <div style={{
                display: "flex",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                marginBottom: "1.75rem",
                overflowX: "auto",
              }}>
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      fontFamily: SANS, fontSize: "0.5625rem", fontWeight: 500,
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      padding: "0.625rem 1.125rem",
                      border: "none",
                      borderBottom: `2px solid ${activeTab === tab ? GOLD : "transparent"}`,
                      color: activeTab === tab ? GOLD : "rgba(245,240,232,0.3)",
                      background: "transparent", cursor: "pointer",
                      transition: "all 0.2s ease", whiteSpace: "nowrap",
                      marginBottom: "-1px",
                    }}
                  >
                    {TAB_LABELS[tab]}
                  </button>
                ))}
              </div>

              {/* Tab form panel */}
              <div style={{
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "0.75rem",
                padding: "1.75rem",
                opacity: loadingData ? 0.45 : 1,
                transition: "opacity 0.2s ease",
                pointerEvents: loadingData ? "none" : "auto",
              }}>
                {activeTab === "profiles"          && <ProfileForm data={profile} onChange={setProfile} />}
                {activeTab === "whoop_data"      && <WhoopForm data={whoop} onChange={setWhoop} />}
                {activeTab === "dexa_scans"       && <DexaForm data={dexa} onChange={setDexa} />}
                {activeTab === "nutrition_plans"  && <NutritionForm data={nutrition} onChange={setNutrition} />}
                {activeTab === "workout_plans"    && <WorkoutForm data={workout} onChange={setWorkout} />}
                {activeTab === "checkins"         && <CheckinForm data={checkin} onChange={setCheckin} />}
                {activeTab === "supplements" && (
                  <SupplementsForm
                    rows={supplements}
                    onChange={(idx, row) =>
                      setSupplements(prev => prev.map((r, i) => i === idx ? row : r))
                    }
                    onAdd={() =>
                      setSupplements(prev => [
                        ...prev,
                        { id: null, name: "", dose: "", timing: "", sort_order: String(prev.length), active: true },
                      ])
                    }
                    onRemove={(idx) => {
                      const row = supplements[idx];
                      if (row.id) setDeletedSupIds(prev => [...prev, row.id!]);
                      setSupplements(prev => prev.filter((_, i) => i !== idx));
                    }}
                  />
                )}
              </div>

              {/* Save footer */}
              <div style={{
                display: "flex", alignItems: "center", gap: "1rem",
                marginTop: "1.25rem",
              }}>
                <button
                  onClick={handleSave}
                  disabled={saving || loadingData}
                  style={{
                    fontFamily: SANS, fontSize: "0.5625rem", fontWeight: 500,
                    letterSpacing: "0.22em", textTransform: "uppercase",
                    padding: "0.75rem 2.25rem",
                    border: `1px solid ${saving ? "rgba(201,168,76,0.2)" : GOLD}`,
                    color: saving ? "rgba(201,168,76,0.4)" : BG,
                    background: saving ? "transparent" : GOLD,
                    cursor: saving || loadingData ? "default" : "pointer",
                    opacity: saving || loadingData ? 0.6 : 1,
                    transition: "all 0.25s ease",
                  }}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                {saveMsg && (
                  <span style={{
                    fontFamily: SANS, fontSize: "0.6875rem",
                    color: saveMsg.startsWith("Error") ? "#c97a4c" : "rgba(201,168,76,0.8)",
                  }}>
                    {saveMsg}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Client Modal ───────────────────────────────────────────────── */}
      {showAddModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "2rem",
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}
        >
          <div style={{
            width: "100%", maxWidth: "420px",
            background: "#0d0d0d",
            border: "1px solid rgba(201,168,76,0.25)",
            padding: "2.5rem",
            display: "flex", flexDirection: "column", gap: "1.5rem",
          }}>
            <div>
              <p style={{
                fontFamily: SANS, fontSize: "0.5rem", fontWeight: 500,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "rgba(201,168,76,0.5)", margin: "0 0 0.5rem",
              }}>
                New Client
              </p>
              <p style={{
                fontFamily: DISPLAY, fontSize: "1.5rem", fontWeight: 400,
                color: TEXT, margin: 0, letterSpacing: "0.02em",
              }}>
                Add Client
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Field label="Full Name">
                <input
                  style={inputSt}
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="John Smith"
                />
              </Field>
              <Field label="Email">
                <input
                  style={inputSt}
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="client@example.com"
                />
              </Field>
              <Field label="Temporary Password">
                <input
                  style={inputSt}
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </Field>
            </div>

            {createError && (
              <p style={{ fontFamily: SANS, fontSize: "0.6875rem", color: "#c97a4c", margin: 0 }}>
                {createError}
              </p>
            )}

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={handleCreateUser}
                disabled={creating}
                style={{
                  flex: 1,
                  fontFamily: SANS, fontSize: "0.5625rem", fontWeight: 500,
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  padding: "0.875rem",
                  border: `1px solid ${creating ? "rgba(201,168,76,0.2)" : GOLD}`,
                  color: creating ? "rgba(201,168,76,0.4)" : BG,
                  background: creating ? "transparent" : GOLD,
                  cursor: creating ? "default" : "pointer",
                  opacity: creating ? 0.6 : 1,
                  transition: "all 0.25s ease",
                }}
              >
                {creating ? "Creating…" : "Create Client"}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  fontFamily: SANS, fontSize: "0.5625rem", fontWeight: 500,
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  padding: "0.875rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(245,240,232,0.4)",
                  background: "transparent", cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
