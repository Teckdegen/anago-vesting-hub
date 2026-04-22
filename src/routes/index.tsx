import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Timer, LockKeyhole, BarChart2, Sprout } from "lucide-react";
import { HlsVideo } from "@/components/HlsVideo";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "The Dog House — Every token needs a home" },
      {
        name: "description",
        content: "The Dog House on Monad: Vesting, Token Lock, DLMM and Yield Farm. Powered by ANAGO.",
      },
    ],
  }),
});

const HLS_SRC = "https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-6.99L4.6 22H1.34l8.04-9.19L1 2h7.02l4.84 6.39L18.244 2Zm-1.2 18h1.9L7.04 4H5.04l12.004 16Z" />
    </svg>
  );
}

const NAV = [
  { label: "Home", href: "/" },
  { label: "Vesting", href: "/vesting" },
  { label: "Token Lock", href: "/lock" },
  { label: "DLMM", href: "/dlmm" },
  { label: "Yield Farm", href: "/farm" },
] as const;

const UTILITIES = [
  {
    icon: BarChart2,
    title: "DLMM",
    desc: "Concentrated liquidity with custom bin strategies and real-time fee capture.",
    accent: "#9B7FD4",
    href: "/dlmm",
  },
  {
    icon: Timer,
    title: "Vesting",
    desc: "Linear and cliff vesting for teams, investors, and contributors.",
    accent: "#7C5CBF",
    href: "/vesting",
  },
  {
    icon: LockKeyhole,
    title: "Token Lock",
    desc: "Time-based locks with transparent on-chain unlock schedules.",
    accent: "#5B4FE8",
    href: "/lock",
  },
  {
    icon: Sprout,
    title: "Yield Farm",
    desc: "Stake LP tokens, earn boosted rewards, harvest yield on Monad.",
    accent: "#E8A0B0",
    href: "/farm",
  },
] as const;

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="text-cream min-h-screen overflow-x-hidden" style={{ background: "#06040F" }}>
      <div className="texture-overlay" aria-hidden="true" />

      {/* ══════════════════════════════════════
          HERO — full viewport height
      ══════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col overflow-hidden">

        {/* video background */}
        <div className="absolute inset-0">
          <HlsVideo
            src={HLS_SRC}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* left dark fade — keeps text readable */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(105deg, rgba(6,4,15,0.96) 0%, rgba(6,4,15,0.75) 40%, rgba(6,4,15,0.2) 70%, rgba(6,4,15,0.05) 100%)"
          }} />
          {/* bottom fade into utilities */}
          <div className="absolute bottom-0 left-0 right-0 h-48" style={{
            background: "linear-gradient(to bottom, transparent, #06040F)"
          }} />
          {/* purple tint */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(135deg, rgba(91,79,232,0.1) 0%, transparent 55%)",
            mixBlendMode: "screen"
          }} />
        </div>

        {/* ── NAV ── */}
        <header className="relative z-20 flex items-center justify-between px-5 sm:px-8 lg:px-14 pt-5 gap-3">
          {/* logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 py-3">
            <img src="/logo.png" alt="The Dog House" className="w-8 h-8 rounded-lg" />
            <span className="font-grotesk text-[12px] uppercase tracking-wider text-cream/70">
              The Dog House
            </span>
          </Link>

          {/* desktop pill nav */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex items-center gap-0.5 px-4 py-2.5 rounded-full" style={{
              background: "rgba(6,4,15,0.72)",
              border: "1px solid rgba(155,127,212,0.18)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}>
              {NAV.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="font-grotesk text-[11px] uppercase tracking-[0.1em] text-cream/50 hover:text-cream/90 px-4 py-1.5 rounded-full transition-colors duration-200 block whitespace-nowrap"
                    activeProps={{ style: { color: "#F5F0FF" } }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* right controls */}
          <div className="flex items-center gap-2 shrink-0 py-3">
            <a
              href="#"
              className="rounded-full px-4 py-2 font-grotesk text-[11px] uppercase tracking-wider transition hover:opacity-85 whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #9B7FD4, #5B4FE8)",
                color: "#F5F0FF",
                boxShadow: "0 4px 16px rgba(91,79,232,0.4)",
              }}
            >
              Launch App
            </a>
            {/* hamburger — mobile only */}
            <button
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-cream/60 hover:text-cream transition"
              style={{ border: "1px solid rgba(155,127,212,0.2)", background: "rgba(6,4,15,0.6)" }}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              {menuOpen
                ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </header>

        {/* mobile drawer */}
        {menuOpen && (
          <div className="lg:hidden relative z-20 mx-4 mt-1 rounded-2xl overflow-hidden" style={{
            background: "rgba(6,4,15,0.94)",
            border: "1px solid rgba(155,127,212,0.14)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}>
            {NAV.map((l, i) => (
              <Link
                key={l.label}
                to={l.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-5 py-4 font-grotesk text-[12px] uppercase tracking-[0.12em] text-cream/55 hover:text-cream hover:bg-white/[0.04] transition-all"
                style={{ borderBottom: i < NAV.length - 1 ? "1px solid rgba(155,127,212,0.07)" : "none" }}
                activeProps={{ style: { color: "#F5F0FF" } }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* ── HERO CONTENT ── */}
        {/* Desktop: left-aligned center | Mobile: left-aligned top */}
        <div className="relative z-10 flex-1 flex flex-col justify-start sm:justify-center px-5 sm:px-8 lg:px-14 pt-10 sm:pt-0 pb-24 sm:pb-32">

          {/* tag */}
          <p className="hero-tag font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] mb-4 sm:mb-5 flex items-center gap-2" style={{ color: "#9B7FD4" }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: "#9B7FD4" }} />
            Powered by $ANAGO · Live on Monad
          </p>

          {/* headline — big on both, left-aligned */}
          <div className="overflow-hidden">
            <h1
              className="font-grotesk uppercase leading-[0.88] tracking-tight hero-line-1"
              style={{ fontSize: "clamp(44px, 9vw, 110px)" }}
            >
              <span className="block shimmer-text">Every token</span>
              <span className="block shimmer-text">needs a home.</span>
            </h1>
          </div>

          {/* sub */}
          <p className="hero-sub font-mono text-[11px] sm:text-[12px] text-cream/45 tracking-wide mt-5 max-w-xs sm:max-w-sm">
            Vesting · Token Lock · DLMM · Yield Farm — one protocol, one roof.
          </p>

          {/* explore link */}
          <div className="hero-cta mt-6">
            <a href="#tools" className="font-mono text-[10px] uppercase tracking-widest text-cream/30 hover:text-cream/65 transition flex items-center gap-1.5">
              Explore tools
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* TVL — bottom-right on desktop, bottom-left on mobile */}
          <div
            className="absolute bottom-6 left-5 sm:left-auto sm:right-10 lg:right-14 flex flex-col items-start sm:items-end gap-0.5 pointer-events-none"
            aria-hidden="true"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-cream/40">Total Value Locked</span>
            <span
              className="font-grotesk leading-none text-cream"
              style={{ fontSize: "clamp(52px, 8vw, 108px)", opacity: 0.6, fontWeight: 900 }}
            >
              $0
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/28">across all products</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TOOLS GRID — directly below hero
      ══════════════════════════════════════ */}
      <section id="tools" style={{ background: "#06040F" }}>
        <div
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{ borderTop: "1px solid rgba(155,127,212,0.1)" }}
        >
          {UTILITIES.map((u, i) => {
            const Icon = u.icon;
            const isRightCol = i % 2 !== 0;
            const isBottomRow = i >= 2;
            return (
              <Link
                key={u.title}
                to={u.href}
                className="group flex flex-col gap-4 px-5 sm:px-7 lg:px-8 py-7 sm:py-9 transition-all duration-300 hover:bg-white/[0.025]"
                style={{
                  borderRight: !isRightCol ? "1px solid rgba(155,127,212,0.1)" : "none",
                  borderBottom: !isBottomRow ? "1px solid rgba(155,127,212,0.1)" : "none",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${u.accent}18`, border: `1px solid ${u.accent}28` }}>
                    <Icon className="w-3 h-3" style={{ color: u.accent }} strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-[8px] text-cream/12 group-hover:text-cream/25 transition">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="font-grotesk uppercase text-cream text-[12px] sm:text-[13px] tracking-wider mb-1.5">
                    {u.title}
                  </h3>
                  <p className="font-mono text-[10px] text-cream/28 leading-relaxed hidden sm:block">
                    {u.desc}
                  </p>
                </div>
                <span
                  className="mt-auto font-mono text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1"
                  style={{ color: u.accent }}
                >
                  Open
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-2.5 h-2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer style={{ background: "#06040F", borderTop: "1px solid rgba(155,127,212,0.08)" }}>
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 py-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="w-6 h-6 rounded-md opacity-50" />
            <div>
              <span className="font-grotesk uppercase text-[11px] tracking-wider text-cream/35 block">
                The Dog House
              </span>
              <span className="font-mono text-[9px] text-cream/18 uppercase tracking-widest">
                © 2026 · Powered by $ANAGO
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="#" aria-label="X (Twitter)"
              className="w-8 h-8 rounded-full flex items-center justify-center text-cream/30 hover:text-cream/70 transition"
              style={{ border: "1px solid rgba(155,127,212,0.14)", background: "rgba(155,127,212,0.04)" }}>
              <XIcon className="w-3 h-3" />
            </a>
            <a href="#" aria-label="Telegram"
              className="w-8 h-8 rounded-full flex items-center justify-center text-cream/30 hover:text-cream/70 transition"
              style={{ border: "1px solid rgba(155,127,212,0.14)", background: "rgba(155,127,212,0.04)" }}>
              <Send className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
