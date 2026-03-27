"use client";

import { useState, useRef, useEffect } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────

const T = {
  gold: "#c9a84c",
  bg: "#0a0a0a",
  bg2: "#0d0d0d",
  text: "#f0ebe0",
  sub: "#5c5c5c",
  faint: "#1c1c1c",
  border: "#181818",
  display: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
  sans: "var(--font-inter), system-ui, sans-serif",
} as const;

// ─── Layout constants ─────────────────────────────────────────────────────────
// Inline styles only — no Tailwind for structural layout to guarantee reliability.

const CONTAINER: React.CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  paddingLeft: "clamp(1.5rem, 5.5vw, 5rem)",
  paddingRight: "clamp(1.5rem, 5.5vw, 5rem)",
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useScrolled(px = 56) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > px);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, [px]);
  return scrolled;
}

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setOn(true); obs.disconnect(); }
      },
      { threshold: 0.04, rootMargin: "0px 0px -52px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return {
    ref,
    style: {
      opacity: on ? 1 : 0,
      transform: on ? "none" : "translateY(30px)",
      transition: `opacity 1.05s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1.05s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    } as React.CSSProperties,
  };
}

function useLoaded(delay = 0) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return on;
}

function rise(on: boolean, delay: number): React.CSSProperties {
  return {
    opacity: on ? 1 : 0,
    transform: on ? "none" : "translateY(22px)",
    transition: `opacity 1.3s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1.3s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  };
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    n: "01",
    title: "Blood Work Interpretation",
    body: "Your labs contain more information than any appointment allows time to explain. We read your full panel — hormones, metabolic markers, inflammatory indicators — and build a clear, actionable picture of what your biology is actually doing.",
  },
  {
    n: "02",
    title: "Supplement Protocol",
    body: "No guessing. No generic stacks. Your protocol is built from your bloodwork, your goals, and your lifestyle. We specify what, when, and in what form — and adjust as your markers change.",
  },
  {
    n: "03",
    title: "Nutrition Architecture",
    body: "Not a meal plan. A framework — built around your biology, your schedule, and what your output demands. Specific enough to drive real change. Adaptable enough to survive your life.",
  },
  {
    n: "04",
    title: "Training Programming",
    body: "Your capacity for stress and recovery is measurable. We measure it, then build around it — training that accounts for your hormonal state, recovery status, and long-term trajectory.",
  },
] as const;

const STEPS = [
  {
    n: "01",
    title: "Onboard",
    body: "A focused intake covering your history, goals, and existing data. If you don't have recent labs, we'll tell you exactly what to order and where.",
  },
  {
    n: "02",
    title: "Analyze & Build",
    body: "We review everything and construct your complete protocol. Delivered within five business days. No template. No shortcuts.",
  },
  {
    n: "03",
    title: "Ongoing Optimization",
    body: "Monthly check-ins, quarterly lab reviews, direct advisor access. Your protocol evolves as your biology does.",
  },
] as const;

const HERO_STATS = [
  { value: "< 50", label: "Members per cohort" },
  { value: "5 days", label: "Protocol delivery" },
  { value: "Monthly", label: "Optimization reviews" },
] as const;

// ─── Biomarker Ring Visual ─────────────────────────────────────────────────────
// Pure SVG — no images. Four concentric progress arcs with tick ring and callouts.

function BiomarkerRing() {
  const C = 200; // center

  // 60 tick marks, every 6°, starting from top (-90°)
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angleRad = ((i * 6 - 90) * Math.PI) / 180;
    const isMajor = i % 5 === 0;
    const outerR = 186;
    const innerR = isMajor ? 177 : 182;
    return {
      x1: C + outerR * Math.cos(angleRad),
      y1: C + outerR * Math.sin(angleRad),
      x2: C + innerR * Math.cos(angleRad),
      y2: C + innerR * Math.sin(angleRad),
      isMajor,
    };
  });

  // Rings: [radius, dasharray (pct × circumference, circumference)]
  // pct 82%, 91%, 69%, 53%
  // circumferences: 986.7, 766.5, 546.6, 326.7
  const rings = [
    { r: 157, dash: "809 987",  opacity: 0.75, sw: 1.5 },
    { r: 122, dash: "698 767",  opacity: 0.6,  sw: 1.5 },
    { r: 87,  dash: "377 547",  opacity: 0.42, sw: 1   },
    { r: 52,  dash: "173 327",  opacity: 0.25, sw: 1   },
  ];

  // Arc-end dots computed from: angle = -90 + pct*360
  // Ring 1 (82%): angle=205.2° → (58, 133)
  // Ring 2 (91%): angle=237.6° → (135, 97)
  // Ring 3 (69%): angle=158.4° → (119, 232)
  const arcDots = [
    { cx: 58,  cy: 133 },
    { cx: 135, cy: 97  },
    { cx: 119, cy: 232 },
  ];

  // Callout lines + labels from arc-end dots
  const callouts = [
    { dot: { cx: 58,  cy: 133 }, lx: 34,  ly: 112, label: "HRV", val: "82", anchor: "end"   },
    { dot: { cx: 135, cy: 97  }, lx: 118, ly: 76,  label: "TSTR", val: "91", anchor: "end"  },
    { dot: { cx: 119, cy: 232 }, lx: 95,  ly: 252, label: "VO2", val: "69", anchor: "end"   },
  ];

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", display: "block" }}
      aria-hidden="true"
    >
      {/* Outermost boundary circle */}
      <circle cx={C} cy={C} r={192} stroke="#141414" strokeWidth="0.5" />

      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={t.isMajor ? "#222" : "#181818"}
          strokeWidth={t.isMajor ? "1.5" : "0.75"}
        />
      ))}

      {/* Radial guide lines — cardinal directions, center outward */}
      {[0, 90, 180, 270].map((deg) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={C + 30 * Math.cos(rad)} y1={C + 30 * Math.sin(rad)}
            x2={C + 157 * Math.cos(rad)} y2={C + 157 * Math.sin(rad)}
            stroke="#181818" strokeWidth="0.5"
          />
        );
      })}

      {/* Track circles (faint) */}
      {rings.map((ring) => (
        <circle
          key={`track-${ring.r}`}
          cx={C} cy={C} r={ring.r}
          stroke="#181818" strokeWidth="0.75"
        />
      ))}

      {/* Progress arcs — gold, rotated to start from top */}
      {rings.map((ring, i) => (
        <circle
          key={`arc-${ring.r}`}
          cx={C} cy={C} r={ring.r}
          stroke={T.gold}
          strokeWidth={ring.sw}
          strokeDasharray={ring.dash}
          strokeLinecap="butt"
          transform={`rotate(-90 ${C} ${C})`}
          opacity={ring.opacity}
        />
      ))}

      {/* Arc-end callout lines + dots */}
      {callouts.map((c, i) => (
        <g key={i}>
          <line
            x1={c.dot.cx} y1={c.dot.cy} x2={c.lx + (c.anchor === "end" ? 18 : -18)} y2={c.ly + 4}
            stroke={T.gold} strokeWidth="0.5" opacity="0.35"
          />
          <circle cx={c.dot.cx} cy={c.dot.cy} r={2.5} fill={T.gold} opacity={[0.85, 0.7, 0.5][i]} />
          <text
            x={c.lx} y={c.ly}
            textAnchor={c.anchor}
            fontFamily="var(--font-inter), system-ui, sans-serif"
            fontSize="6.5"
            letterSpacing="1.8"
            fill="#2e2e2e"
          >
            {c.label}
          </text>
          <text
            x={c.lx} y={c.ly + 9}
            textAnchor={c.anchor}
            fontFamily="var(--font-inter), system-ui, sans-serif"
            fontSize="7.5"
            letterSpacing="0.5"
            fill="#3a3a3a"
          >
            {c.val}
          </text>
        </g>
      ))}

      {/* Center ring and dot */}
      <circle cx={C} cy={C} r={30} stroke="#181818" strokeWidth="0.75" />
      <circle cx={C} cy={C} r={16} stroke="#141414" strokeWidth="0.5" />
      <circle cx={C} cy={C} r={3}  fill={T.gold} opacity="0.5" />

      {/* Subtle center crosshair */}
      <line x1={C} y1={C - 13} x2={C} y2={C + 13} stroke="#1e1e1e" strokeWidth="0.5" />
      <line x1={C - 13} y1={C} x2={C + 13} y2={C} stroke="#1e1e1e" strokeWidth="0.5" />

      {/* Subtle ambient glow ring around outermost arc */}
      <circle
        cx={C} cy={C} r={158}
        stroke={T.gold}
        strokeWidth="24"
        opacity="0.018"
      />
    </svg>
  );
}

// ─── Micro-components ─────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: T.sans,
        fontSize: "0.5625rem",
        fontWeight: 500,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        color: T.gold,
        marginBottom: "1.75rem",
      }}
    >
      {children}
    </div>
  );
}

function FormField({
  id, label, type, placeholder, autoComplete,
}: {
  id: string; label: string; type: string; placeholder: string; autoComplete: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontFamily: T.sans,
          fontSize: "0.5rem",
          fontWeight: 500,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: focused ? T.gold : "#3a3a3a",
          marginBottom: "0.625rem",
          transition: "color 0.25s ease",
        }}
      >
        {label}
      </label>
      <input
        id={id} name={id} type={type} required placeholder={placeholder}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: "transparent",
          border: `1px solid ${focused ? T.gold : "#1c1c1c"}`,
          padding: "1rem 1.25rem",
          fontFamily: T.sans,
          fontSize: "0.9375rem",
          fontWeight: 300,
          color: T.text,
          caretColor: T.gold,
          transition: "border-color 0.25s ease",
        }}
      />
    </div>
  );
}

function SubmitButton({ loading }: { loading: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        padding: "1.125rem",
        background: T.gold,
        color: T.bg,
        border: "none",
        fontFamily: T.sans,
        fontSize: "0.5625rem",
        fontWeight: 600,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        cursor: loading ? "default" : "pointer",
        opacity: loading ? 0.55 : 1,
        transform: hov && !loading ? "translateY(-2px)" : "none",
        boxShadow: hov && !loading ? "0 8px 32px rgba(201,168,76,0.2)" : "none",
        transition: "opacity 0.2s ease, transform 0.2s ease, box-shadow 0.3s ease",
        marginTop: "0.75rem",
      }}
    >
      {loading ? "Submitting…" : "Submit Application"}
    </button>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav({ scrolled }: { scrolled: boolean }) {
  const [hov, setHov] = useState(false);
  const loaded = useLoaded(300);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "rgba(10,10,10,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(160%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px) saturate(160%)" : "none",
        borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
        transition: "background 0.5s ease, backdrop-filter 0.5s ease, border-color 0.5s ease",
        ...rise(loaded, 0),
      }}
    >
      {/* Container: same horizontal padding as every other section */}
      <div
        style={{
          ...CONTAINER,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "1.375rem",
          paddingBottom: "1.375rem",
        }}
      >
        <span
          style={{
            fontFamily: T.display,
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: T.text,
          }}
        >
          Aurea
        </span>

        <a
          href="#apply"
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            fontFamily: T.sans,
            fontSize: "0.5625rem",
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            textDecoration: "none",
            padding: "0.625rem 1.25rem",
            border: `1px solid ${hov ? T.gold : "rgba(201,168,76,0.3)"}`,
            color: hov ? T.bg : T.gold,
            background: hov ? T.gold : "transparent",
            transition: "all 0.25s ease",
          }}
        >
          Apply
        </a>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const loaded = useLoaded(100);
  const [hov, setHov] = useState(false);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Ambient glow — right side */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "0",
          width: "50vw",
          height: "80vh",
          background: "radial-gradient(ellipse at center right, rgba(201,168,76,0.05) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div
        style={{
          ...CONTAINER,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingTop: "7rem",
          paddingBottom: "5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Two-column grid: headline left, visual right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">

          {/* ── Left: content ── */}
          <div>
            {/* Label */}
            <div style={{ ...rise(loaded, 180), marginBottom: "2.75rem" }}>
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: "0.5rem",
                  fontWeight: 500,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: T.gold,
                }}
              >
                Private Membership&ensp;&middot;&ensp;By Application&ensp;&middot;&ensp;$1,000&thinsp;/&thinsp;mo
              </div>
            </div>

            {/* Headline */}
            <div style={{ ...rise(loaded, 340), marginBottom: "2.5rem" }}>
              <h1
                style={{
                  fontFamily: T.display,
                  fontSize: "clamp(4.5rem, 11vw, 10rem)",
                  fontWeight: 300,
                  lineHeight: 0.9,
                  letterSpacing: "-0.03em",
                  color: T.text,
                }}
              >
                Health,
                <br />
                <em style={{ color: T.gold }}>handled.</em>
              </h1>
            </div>

            {/* Subtext */}
            <div style={{ ...rise(loaded, 560), marginBottom: "3rem", maxWidth: "380px" }}>
              <p
                style={{
                  fontFamily: T.sans,
                  fontSize: "clamp(0.9375rem, 1.3vw, 1.0625rem)",
                  fontWeight: 300,
                  lineHeight: 1.75,
                  color: T.sub,
                }}
              >
                You bring precision to everything that matters.
                Your biology deserves the same.
              </p>
            </div>

            {/* CTA */}
            <div style={{ ...rise(loaded, 740), marginBottom: "3rem" }}>
              <a
                href="#apply"
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                  display: "inline-block",
                  fontFamily: T.sans,
                  fontSize: "0.5625rem",
                  fontWeight: 600,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: T.bg,
                  background: T.gold,
                  padding: "1.25rem 2.75rem",
                  transform: hov ? "translateY(-2px)" : "none",
                  boxShadow: hov ? "0 10px 40px rgba(201,168,76,0.22)" : "none",
                  transition: "transform 0.22s ease, box-shadow 0.3s ease",
                }}
              >
                Apply for Early Access
              </a>
            </div>

            {/* Stats — anchored below CTA */}
            <div
              style={{
                ...rise(loaded, 900),
                display: "flex",
                gap: "0",
                borderTop: `1px solid ${T.border}`,
                paddingTop: "1.5rem",
              }}
            >
              {HERO_STATS.map((stat, i) => (
                <div
                  key={i}
                  style={{
                    paddingRight: i < HERO_STATS.length - 1 ? "2.5rem" : 0,
                    marginRight: i < HERO_STATS.length - 1 ? "2.5rem" : 0,
                    borderRight: i < HERO_STATS.length - 1 ? `1px solid ${T.border}` : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: T.display,
                      fontSize: "clamp(1.5rem, 3vw, 2.375rem)",
                      fontWeight: 300,
                      lineHeight: 1,
                      letterSpacing: "-0.025em",
                      color: T.text,
                      marginBottom: "0.375rem",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontSize: "0.475rem",
                      fontWeight: 500,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: T.sub,
                      lineHeight: 1.5,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: biomarker visual ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...rise(loaded, 500),
            }}
          >
            <div style={{ width: "100%", maxWidth: "480px" }}>
              <BiomarkerRing />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Manifesto ────────────────────────────────────────────────────────────────

function Manifesto() {
  const a = useReveal(0);
  return (
    <section
      style={{
        borderTop: `1px solid ${T.border}`,
        padding: "8rem 0",
      }}
    >
      <div style={CONTAINER}>
        <div ref={a.ref} style={{ ...a.style, maxWidth: "820px" }}>
          <p
            style={{
              fontFamily: T.display,
              fontSize: "clamp(1.875rem, 4.5vw, 3.25rem)",
              fontWeight: 300,
              lineHeight: 1.3,
              letterSpacing: "-0.015em",
              color: T.text,
            }}
          >
            High performers optimize every variable that drives results.
          </p>
          <p
            style={{
              fontFamily: T.display,
              fontSize: "clamp(1.875rem, 4.5vw, 3.25rem)",
              fontWeight: 300,
              lineHeight: 1.3,
              letterSpacing: "-0.015em",
              color: T.sub,
              marginTop: "0.5rem",
            }}
          >
            Their own biology gets a multivitamin and a yearly physical.
          </p>
          <p
            style={{
              fontFamily: T.display,
              fontSize: "clamp(1.875rem, 4.5vw, 3.25rem)",
              fontWeight: 300,
              lineHeight: 1.3,
              letterSpacing: "-0.015em",
              color: T.sub,
              marginTop: "0.5rem",
            }}
          >
            Aurea exists for those who have decided that&apos;s no longer enough.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

function ServiceRow({
  service,
  delay,
}: {
  service: (typeof SERVICES)[number];
  delay: number;
}) {
  const a = useReveal(delay);
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={a.ref}
      style={a.style}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ borderTop: `1px solid ${T.border}`, padding: "2.75rem 0" }}>
        {/* Desktop 3-col */}
        <div className="hidden md:grid md:grid-cols-[3.5rem_22rem_1fr] md:gap-x-10 md:items-start">
          <span
            style={{
              fontFamily: T.sans,
              fontSize: "0.5625rem",
              fontWeight: 500,
              letterSpacing: "0.2em",
              color: hov ? T.gold : "#282828",
              paddingTop: "0.5rem",
              transition: "color 0.4s ease",
            }}
          >
            {service.n}
          </span>
          <h3
            style={{
              fontFamily: T.display,
              fontSize: "clamp(1.5rem, 2vw, 1.875rem)",
              fontWeight: 400,
              lineHeight: 1.15,
              color: T.text,
              letterSpacing: "-0.01em",
            }}
          >
            {service.title}
          </h3>
          <p style={{ fontFamily: T.sans, fontSize: "0.9rem", fontWeight: 300, lineHeight: 1.85, color: T.sub }}>
            {service.body}
          </p>
        </div>

        {/* Mobile stacked */}
        <div className="md:hidden">
          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1rem" }}>
            <span style={{ fontFamily: T.sans, fontSize: "0.5625rem", fontWeight: 500, letterSpacing: "0.2em", color: "#282828", flexShrink: 0 }}>
              {service.n}
            </span>
            <h3 style={{ fontFamily: T.display, fontSize: "1.5rem", fontWeight: 400, lineHeight: 1.2, color: T.text, letterSpacing: "-0.01em" }}>
              {service.title}
            </h3>
          </div>
          <p style={{ fontFamily: T.sans, fontSize: "0.9rem", fontWeight: 300, lineHeight: 1.85, color: T.sub }}>
            {service.body}
          </p>
        </div>
      </div>
    </div>
  );
}

function ServicesSection() {
  const header = useReveal(0);
  return (
    <section style={{ borderTop: `1px solid ${T.border}`, padding: "7rem 0 5rem" }}>
      <div style={CONTAINER}>
        <div ref={header.ref} style={{ ...header.style, marginBottom: "4rem" }}>
          <Label>Services</Label>
          <h2
            style={{
              fontFamily: T.display,
              fontSize: "clamp(2.75rem, 6vw, 5rem)",
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              color: T.text,
            }}
          >
            Four pillars.
            <br />
            <em style={{ color: T.sub }}>One protocol.</em>
          </h2>
        </div>
        {SERVICES.map((s, i) => (
          <ServiceRow key={s.n} service={s} delay={i * 70} />
        ))}
        <div style={{ borderTop: `1px solid ${T.border}` }} />
      </div>
    </section>
  );
}

// ─── Process ──────────────────────────────────────────────────────────────────

function StepCard({ step, delay }: { step: (typeof STEPS)[number]; delay: number }) {
  const a = useReveal(delay);
  return (
    <div ref={a.ref} style={a.style}>
      <div
        style={{
          fontFamily: T.display,
          fontSize: "4.5rem",
          fontWeight: 200,
          lineHeight: 1,
          color: "#181818",
          marginBottom: "2.5rem",
          letterSpacing: "-0.03em",
          userSelect: "none",
        }}
      >
        {step.n}
      </div>
      <h3 style={{ fontFamily: T.display, fontSize: "1.75rem", fontWeight: 400, lineHeight: 1.15, color: T.text, letterSpacing: "-0.01em", marginBottom: "1.25rem" }}>
        {step.title}
      </h3>
      <p style={{ fontFamily: T.sans, fontSize: "0.9rem", fontWeight: 300, lineHeight: 1.85, color: T.sub }}>
        {step.body}
      </p>
    </div>
  );
}

function ProcessSection() {
  const header = useReveal(0);
  return (
    <section style={{ borderTop: `1px solid ${T.border}`, background: T.bg2, padding: "7rem 0" }}>
      <div style={CONTAINER}>
        <div ref={header.ref} style={{ ...header.style, marginBottom: "5rem" }}>
          <Label>Process</Label>
          <h2
            style={{
              fontFamily: T.display,
              fontSize: "clamp(2.75rem, 6vw, 5rem)",
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              color: T.text,
            }}
          >
            Straightforward
            <br />
            <em style={{ color: T.sub }}>by design.</em>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {STEPS.map((step, i) => (
            <StepCard key={step.n} step={step} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Membership ───────────────────────────────────────────────────────────────

function MembershipSection() {
  const left = useReveal(0);
  const right = useReveal(120);
  return (
    <section style={{ borderTop: `1px solid ${T.border}`, padding: "7rem 0" }}>
      <div style={CONTAINER}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          <div ref={left.ref} style={left.style}>
            <Label>Membership</Label>
            <h2
              style={{
                fontFamily: T.display,
                fontSize: "clamp(2.75rem, 6vw, 5rem)",
                fontWeight: 300,
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
                color: T.text,
                marginBottom: "2.5rem",
              }}
            >
              Not for
              <br />
              <em style={{ color: T.sub }}>everyone.</em>
            </h2>
            <p
              style={{
                fontFamily: T.sans,
                fontSize: "1rem",
                fontWeight: 300,
                lineHeight: 1.9,
                color: T.sub,
                maxWidth: "440px",
              }}
            >
              You track your inputs, protect your output, and optimize every
              system under your control. Aurea applies that same rigor to the
              one system everything runs on — your body.
              <br />
              <br />
              We handle the complexity. Your only job is to show up and perform.
            </p>
          </div>

          <div ref={right.ref} style={right.style}>
            {[
              {
                q: "Who this is for",
                a: "High performers who optimize everything that matters — and are ready to bring that same precision to their biology.",
              },
              {
                q: "What you bring",
                a: "Recent bloodwork, or the willingness to get it. A baseline of discipline. An honest intake.",
              },
              {
                q: "What we deliver",
                a: "A complete, personalized protocol. A dedicated advisor. Continuous optimization as your data shifts.",
              },
              {
                q: "What this is not",
                a: "A wellness app. A meal service. A motivational coach. We deal in data, precision, and results.",
              },
            ].map((item, i) => (
              <div key={i} style={{ borderTop: `1px solid ${T.border}`, padding: "1.75rem 0" }}>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: "0.5rem",
                    fontWeight: 500,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: T.gold,
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.q}
                </div>
                <p style={{ fontFamily: T.sans, fontSize: "0.9rem", fontWeight: 300, lineHeight: 1.8, color: "#7a7a7a" }}>
                  {item.a}
                </p>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${T.border}` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Application ──────────────────────────────────────────────────────────────

function ApplicationSection({
  formRef, formState, errorMsg, onSubmit,
}: {
  formRef: React.RefObject<HTMLFormElement | null>;
  formState: "idle" | "loading" | "success" | "error";
  errorMsg: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const a = useReveal(0);
  return (
    <section
      id="apply"
      style={{ borderTop: `1px solid ${T.border}`, background: T.bg2, padding: "9rem 0" }}
    >
      <div style={CONTAINER}>
        <div
          ref={a.ref}
          style={{
            ...a.style,
            maxWidth: "480px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <Label>Early Access</Label>
          <h2
            style={{
              fontFamily: T.display,
              fontSize: "clamp(3rem, 7vw, 4.5rem)",
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              color: T.text,
              marginBottom: "1.5rem",
            }}
          >
            Apply for
            <br />
            <em style={{ color: T.sub }}>membership.</em>
          </h2>

          <p
            style={{
              fontFamily: T.sans,
              fontSize: "0.9375rem",
              fontWeight: 300,
              lineHeight: 1.85,
              color: T.sub,
              marginBottom: "3.5rem",
            }}
          >
            We onboard a small number of members each quarter. Every protocol
            is built personally. We don&apos;t scale at the cost of quality.
          </p>

          {formState === "success" ? (
            <div style={{ border: `1px solid ${T.border}`, padding: "4.5rem 2.5rem" }}>
              <div style={{ width: "1.75rem", height: "1px", background: T.gold, margin: "0 auto 2.25rem" }} />
              <p style={{ fontFamily: T.display, fontSize: "2rem", fontWeight: 400, color: T.text, marginBottom: "0.875rem", letterSpacing: "-0.01em" }}>
                Application received.
              </p>
              <p style={{ fontFamily: T.sans, fontSize: "0.875rem", fontWeight: 300, color: T.sub }}>
                We&apos;ll review it and reach out personally if there&apos;s a fit.
              </p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} style={{ textAlign: "left" }}>
              <FormField id="firstName" label="First Name" type="text" placeholder="James" autoComplete="given-name" />
              <FormField id="email" label="Email Address" type="email" placeholder="james@example.com" autoComplete="email" />

              {formState === "error" && (
                <p style={{ fontFamily: T.sans, fontSize: "0.8rem", color: "#9b3a2e", marginBottom: "0.75rem", paddingTop: "0.25rem" }}>
                  {errorMsg}
                </p>
              )}

              <SubmitButton loading={formState === "loading"} />

              <p
                style={{
                  fontFamily: T.sans,
                  fontSize: "0.625rem",
                  fontWeight: 300,
                  letterSpacing: "0.06em",
                  color: "#2e2e2e",
                  textAlign: "center",
                  marginTop: "1.5rem",
                  lineHeight: 1.7,
                }}
              >
                No marketing. No spam. A personal reply if there&apos;s a fit.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${T.border}` }}>
      <div
        style={{
          ...CONTAINER,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "2.25rem",
          paddingBottom: "2.25rem",
        }}
      >
        <span style={{ fontFamily: T.display, fontSize: "0.875rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#202020" }}>
          Aurea Health
        </span>
        <p style={{ fontFamily: T.sans, fontSize: "0.625rem", letterSpacing: "0.08em", color: "#202020" }}>
          &copy; {new Date().getFullYear()} Aurea Health
        </p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const scrolled = useScrolled(56);
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("loading");
    setErrorMsg("");
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.get("firstName") as string,
          email: data.get("email") as string,
        }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || "Something went wrong.");
      }
      setFormState("success");
      formRef.current?.reset();
    } catch (err) {
      setFormState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      <Nav scrolled={scrolled} />
      <Hero />
      <Manifesto />
      <ServicesSection />
      <ProcessSection />
      <MembershipSection />
      <ApplicationSection
        formRef={formRef}
        formState={formState}
        errorMsg={errorMsg}
        onSubmit={handleSubmit}
      />
      <Footer />
    </div>
  );
}
