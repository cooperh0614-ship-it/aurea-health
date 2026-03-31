"use client";

import { useState, useRef, useEffect } from "react";

// ─── Design Tokens ─────────────────────────────────────────────────────────────

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

const CONTAINER: React.CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  paddingLeft: "clamp(1.5rem, 5.5vw, 5rem)",
  paddingRight: "clamp(1.5rem, 5.5vw, 5rem)",
};

// ─── Hooks ─────────────────────────────────────────────────────────────────────

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
        if (e.isIntersecting) {
          setOn(true);
          obs.disconnect();
        }
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

// ─── Nav ───────────────────────────────────────────────────────────────────────

function Nav() {
  const scrolled = useScrolled();
  const loaded = useLoaded(80);
  const [hov, setHov] = useState(false);

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
        borderBottom: scrolled
          ? `1px solid ${T.border}`
          : "1px solid transparent",
        transition:
          "background 0.5s ease, backdrop-filter 0.5s ease, border-color 0.5s ease",
        ...rise(loaded, 0),
      }}
    >
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
        <a
          href="/"
          style={{
            fontFamily: T.display,
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: T.text,
            textDecoration: "none",
          }}
        >
          Aurea
        </a>

        <a
          href="/#apply"
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

// ─── Phase Data ────────────────────────────────────────────────────────────────

const PHASES = [
  {
    n: "01",
    title: "The Blood Panel",
    subtitle: "A comprehensive biological audit.",
    body: "Not a basic checkup. Hormones, inflammation markers, metabolic function, micronutrient status, cardiovascular risk. We read the full picture — the one that takes more than a fifteen-minute appointment to understand. This is the foundation. Every recommendation we make traces back to what we find here.",
    stat: { value: "80+", label: "Markers analyzed" },
  },
  {
    n: "02",
    title: "The Whoop",
    subtitle: "24/7 data capture from day one.",
    body: "HRV, sleep architecture, recovery scores, strain. A live window into how the body is responding in real time. Every night of sleep and every day of output becomes a data point we act on. Not eventually — continuously. The Whoop bridges the gap between what your blood tells us and what your life is actually doing to it.",
    stat: { value: "24/7", label: "Continuous monitoring" },
  },
  {
    n: "03",
    title: "The Protocol",
    subtitle: "Nothing generic. Everything exact.",
    body: "Based on your blood results and Whoop data, we build three things specific to you — a supplement stack, a nutrition plan, and a training protocol. Designed around your exact biology and your exact goals. This is where clients start feeling different. Not because of a generic program. Because of yours.",
    stat: { value: "3", label: "Pillars built for you" },
  },
  {
    n: "04",
    title: "Continuous Optimization",
    subtitle: "The protocol evolves as you do.",
    body: "Quarterly blood panels, ongoing sleep monitoring, diet tracking, training adjustments. We do not hand you a document and disappear. We stay in the data. The goal is not a quick result — it is making you feel the best you have ever felt and keeping you there.",
    stat: { value: "4×", label: "Blood panels per year" },
  },
] as const;

// ─── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  const loaded = useLoaded(100);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          background:
            "radial-gradient(ellipse at 20% 60%, rgba(201,168,76,0.04) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.03) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Horizontal rule top */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "1px",
          background: T.border,
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      <div
        style={{
          ...CONTAINER,
          position: "relative",
          zIndex: 1,
          paddingTop: "10rem",
          paddingBottom: "6rem",
        }}
      >
        {/* Eyebrow */}
        <div style={{ ...rise(loaded, 180), marginBottom: "3rem" }}>
          <span
            style={{
              fontFamily: T.sans,
              fontSize: "0.5rem",
              fontWeight: 500,
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: T.gold,
            }}
          >
            Aurea Health&ensp;&middot;&ensp;Our Mission
          </span>
        </div>

        {/* Headline */}
        <div style={{ ...rise(loaded, 320), maxWidth: "900px" }}>
          <h1
            style={{
              fontFamily: T.display,
              fontSize: "clamp(4rem, 10vw, 9.5rem)",
              fontWeight: 300,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              color: T.text,
            }}
          >
            Built to make
            <br />
            <em style={{ color: T.gold }}>you superhuman.</em>
          </h1>
        </div>

        {/* Divider line */}
        <div
          style={{
            ...rise(loaded, 480),
            marginTop: "3.5rem",
            marginBottom: "3rem",
          }}
        >
          <div
            style={{
              width: "3rem",
              height: "1px",
              background: `rgba(201,168,76,0.4)`,
            }}
          />
        </div>

        {/* Subtext */}
        <div
          style={{
            ...rise(loaded, 580),
            maxWidth: "520px",
          }}
        >
          <p
            style={{
              fontFamily: T.sans,
              fontSize: "clamp(0.9375rem, 1.3vw, 1.0625rem)",
              fontWeight: 300,
              lineHeight: 1.8,
              color: T.sub,
            }}
          >
            We take each client through a specific journey — from a
            comprehensive blood panel and continuous biometric data to a fully
            personalized protocol that evolves as your biology does. The result
            is not a better version of what you are now. It is something
            different entirely.
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            ...rise(loaded, 780),
            marginTop: "5rem",
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <div
            style={{
              width: "1px",
              height: "3.5rem",
              background: `linear-gradient(to bottom, transparent, rgba(201,168,76,0.35))`,
            }}
          />
          <span
            style={{
              fontFamily: T.sans,
              fontSize: "0.5rem",
              fontWeight: 500,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#2e2e2e",
            }}
          >
            Four phases
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── Phase Block ───────────────────────────────────────────────────────────────

function PhaseBlock({
  phase,
  index,
}: {
  phase: (typeof PHASES)[number];
  index: number;
}) {
  const label = useReveal(0);
  const headline = useReveal(80);
  const body = useReveal(160);
  const stat = useReveal(240);
  const isEven = index % 2 === 0;

  return (
    <section
      style={{
        borderTop: `1px solid ${T.border}`,
        padding: "clamp(5rem, 10vw, 9rem) 0",
        background: isEven ? T.bg : T.bg2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Phase number watermark */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: isEven ? "-0.5rem" : "auto",
          bottom: isEven ? "auto" : "-0.5rem",
          right: "clamp(1.5rem, 5.5vw, 5rem)",
          fontFamily: T.display,
          fontSize: "clamp(8rem, 22vw, 22rem)",
          fontWeight: 200,
          lineHeight: 1,
          color: "#111",
          letterSpacing: "-0.04em",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        {phase.n}
      </div>

      <div style={{ ...CONTAINER, position: "relative", zIndex: 1 }}>
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start`}
        >
          {/* Left column */}
          <div>
            {/* Phase label */}
            <div ref={label.ref} style={{ ...label.style, marginBottom: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span
                  style={{
                    fontFamily: T.sans,
                    fontSize: "0.5rem",
                    fontWeight: 500,
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: T.gold,
                  }}
                >
                  Phase {phase.n}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: `rgba(201,168,76,0.2)`,
                    maxWidth: "3rem",
                  }}
                />
              </div>
            </div>

            {/* Title */}
            <div ref={headline.ref} style={{ ...headline.style, marginBottom: "1.5rem" }}>
              <h2
                style={{
                  fontFamily: T.display,
                  fontSize: "clamp(2.75rem, 6vw, 5.5rem)",
                  fontWeight: 300,
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: T.text,
                }}
              >
                {phase.title}
              </h2>
            </div>

            {/* Subtitle */}
            <div style={{ marginBottom: "2rem" }}>
              <p
                style={{
                  fontFamily: T.display,
                  fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  lineHeight: 1.4,
                  color: `rgba(240,235,224,0.45)`,
                }}
              >
                {phase.subtitle}
              </p>
            </div>
          </div>

          {/* Right column */}
          <div
            style={{
              paddingTop: "clamp(0px, 2vw, 3rem)",
            }}
          >
            {/* Body */}
            <div ref={body.ref} style={{ ...body.style, marginBottom: "3rem" }}>
              <p
                style={{
                  fontFamily: T.sans,
                  fontSize: "clamp(0.9375rem, 1.2vw, 1.0625rem)",
                  fontWeight: 300,
                  lineHeight: 1.9,
                  color: T.sub,
                }}
              >
                {phase.body}
              </p>
            </div>

            {/* Stat */}
            <div
              ref={stat.ref}
              style={{
                ...stat.style,
                display: "inline-flex",
                flexDirection: "column",
                gap: "0.375rem",
                paddingTop: "1.75rem",
                borderTop: `1px solid ${T.border}`,
              }}
            >
              <span
                style={{
                  fontFamily: T.display,
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: T.gold,
                }}
              >
                {phase.stat.value}
              </span>
              <span
                style={{
                  fontFamily: T.sans,
                  fontSize: "0.5625rem",
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#2e2e2e",
                }}
              >
                {phase.stat.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Divider Statement ─────────────────────────────────────────────────────────

function MidStatement() {
  const a = useReveal(0);

  return (
    <section
      style={{
        borderTop: `1px solid ${T.border}`,
        padding: "clamp(5rem, 9vw, 8rem) 0",
        background: T.bg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ ...CONTAINER, position: "relative", zIndex: 1 }}>
        <div ref={a.ref} style={a.style}>
          <p
            style={{
              fontFamily: T.display,
              fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
              fontWeight: 300,
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              color: T.text,
              maxWidth: "820px",
            }}
          >
            Most health advice is built for the average.
          </p>
          <p
            style={{
              fontFamily: T.display,
              fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
              fontWeight: 300,
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              color: T.sub,
              maxWidth: "820px",
              marginTop: "0.5rem",
            }}
          >
            Aurea is built for you.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Closing CTA ───────────────────────────────────────────────────────────────

function Closing() {
  const header = useReveal(0);
  const sub = useReveal(120);
  const cta = useReveal(240);
  const [hov, setHov] = useState(false);

  return (
    <section
      style={{
        borderTop: `1px solid ${T.border}`,
        background: T.bg2,
        padding: "clamp(6rem, 12vw, 11rem) 0 clamp(5rem, 10vw, 9rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80vw",
          height: "60vh",
          background:
            "radial-gradient(ellipse at center bottom, rgba(201,168,76,0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ ...CONTAINER, position: "relative", zIndex: 1 }}>
        {/* Eyebrow */}
        <div ref={header.ref} style={{ ...header.style, marginBottom: "2.5rem" }}>
          <span
            style={{
              fontFamily: T.sans,
              fontSize: "0.5rem",
              fontWeight: 500,
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: T.gold,
            }}
          >
            Private Membership&ensp;&middot;&ensp;By Application
          </span>
        </div>

        {/* Headline */}
        <div ref={sub.ref} style={{ ...sub.style, marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: T.display,
              fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
              fontWeight: 300,
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              color: T.text,
              maxWidth: "800px",
            }}
          >
            Ready to feel
            <br />
            <em style={{ color: T.gold }}>different?</em>
          </h2>

          <p
            style={{
              fontFamily: T.sans,
              fontSize: "clamp(0.9375rem, 1.2vw, 1.0625rem)",
              fontWeight: 300,
              lineHeight: 1.8,
              color: T.sub,
              maxWidth: "460px",
              marginTop: "2.5rem",
            }}
          >
            Aurea Health Club is currently in development. Join the waitlist
            now and receive priority access when we open for full operation —
            along with a personal reach-out before we onboard anyone else.
          </p>
        </div>

        {/* CTA */}
        <div
          ref={cta.ref}
          style={{ ...cta.style, display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}
        >
          <a
            href="/#apply"
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
              display: "inline-block",
              fontFamily: T.sans,
              fontSize: "0.5625rem",
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "1rem 2.25rem",
              background: hov ? T.text : T.gold,
              color: T.bg,
              transition: "background 0.3s ease",
            }}
          >
            Join the Waitlist
          </a>

          <a
            href="/"
            style={{
              fontFamily: T.sans,
              fontSize: "0.5625rem",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textDecoration: "none",
              color: "#2e2e2e",
              transition: "color 0.25s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = T.sub)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "#2e2e2e")
            }
          >
            Back to home &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${T.border}`,
        background: T.bg,
        padding: "2.25rem 0",
      }}
    >
      <div
        style={{
          ...CONTAINER,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: T.display,
            fontSize: "0.875rem",
            fontWeight: 400,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#222",
          }}
        >
          Aurea Health
        </span>
        <span
          style={{
            fontFamily: T.sans,
            fontSize: "0.5rem",
            fontWeight: 400,
            letterSpacing: "0.2em",
            color: "#1e1e1e",
          }}
        >
          &copy; {new Date().getFullYear()} Aurea Health. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function OurStory() {
  return (
    <main style={{ background: T.bg, minHeight: "100vh" }}>
      <Nav />
      <Hero />
      {PHASES.map((phase, i) => (
        <PhaseBlock key={phase.n} phase={phase} index={i} />
      ))}
      <MidStatement />
      <Closing />
      <Footer />
    </main>
  );
}
