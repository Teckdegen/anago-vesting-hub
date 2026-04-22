import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
];

const STATS = [
  { label: "Total Locked", value: "$0", sub: "Token Locks" },
  { label: "Under Vesting", value: "$0", sub: "Vesting" },
  { label: "Liquidity", value: "$0", sub: "DLMM" },
  { label: "Staked TVL", value: "$0", sub: "Yield Farm" },
];

function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="text-cream min-h-screen overflow-x-hidden" style={{ background: "#06040F" }}>
      <div className="texture-overlay" aria-hidden="true" />

      {/* ─────────────────────────────────────────
          HERO
      ───────────────────────────────────────── */}
      <section className="relative w-full h-screen min-h-[580px] max-h-[860px] flex flex-col overflow-hidden">

        {/* HLS video — fills the right ~60% of the frame, dark on left */}
        <div className="absolute inset-0">
          <HlsVideo
            src={HLS_SRC}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* heavy left-side dark fade so text is always readable */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, #06040F 0%, #06040F 30%, rgba(6,4,15,0.82) 50%, rgba(6,4,15,0.3) 70%, rgba(6,4,15,0.15) 100%)",
            }}
          />
          {/* bottom fade into page */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40"
            style={{ background: "linear-gradient(to bottom, transparent, #06040F)" }}
          />
          {/* subtle purple tint over video */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(91,79,232,0.12) 0%, transparent 60%)",
              mixBlendMode: "screen",
            }}
          />
        </div>

        {/* ── NAV ── */}
        <header className="relative z-20 flex items-center justify-between px-5 sm:px-8 lg:px-14 pt-6 pb-4 gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.png" alt="The Dog House" className="w-8 h-8 rounded-lg" />
            <span className="font-grotesk text-[13px] uppercase tracking-wider text-cream/75">
              The Dog House
            </span>
          </div>

          {/* desktop pill nav — hidden on mobile */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul
              className="flex items-center gap-0.5 px-4 py-2.5 rounded-full"
              style={{
                background: "rgba(6,4,15,0.7)",
                border: "1px solid rgba(155,127,212,0.18)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              {(
                [
                  { label: "Home", href: "/" },
                  { label: "Vesting", href: "/vesting" },
                  { label: "Token Lock", href: "/lock" },
                  { label: "DLMM", href: "/dlmm" },
                  { label: "Yield Farm", href: "/farm" },
                ] as const
              ).map((l) => (
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

          {/* right: launch app + mobile menu */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="#"
              className="rounded-full px-4 sm:px-5 py-2.5 font-grotesk text-[11px] sm:text-[12px] uppercase tracking-wider transition-all duration-300 hover:opacity-85 hover:-translate-y-px whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #9B7FD4, #5B4FE8)",
                color: "#F5F0FF",
                boxShadow: "0 0 0 1px rgba(155,127,212,0.3), 0 4px 20px rgba(91,79,232,0.4)",
              }}
            >
              Launch App
            </a>
            {/* mobile hamburger */}
            <button
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-cream/60 hover:text-cream transition"
              style={{ border: "1px solid rgba(155,127,212,0.2)", background: "rgba(6,4,15,0.6)" }}
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen
                ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </header>

        {/* mobile nav drawer */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden relative z-20 mx-4 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(6,4,15,0.92)",
              border: "1px solid rgba(155,127,212,0.15)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            {([
              { label: "Home", href: "/" },
              { label: "Vesting", href: "/vesting" },
              { label: "Token Lock", href: "/lock" },
              { label: "DLMM", href: "/dlmm" },
              { label: "Yield Farm", href: "/farm" },
            ] as const).map((l, i) => (
              <Link
                key={l.label}
                to={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-5 py-3.5 font-grotesk text-[12px] uppercase tracking-[0.12em] text-cream/60 hover:text-cream hover:bg-white/[0.04] transition-all"
                style={{ borderBottom: i < 4 ? "1px solid rgba(155,127,212,0.08)" : "none" }}
                activeProps={{ style: { color: "#F5F0FF" } }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* ── HERO TEXT — bottom-left aligned ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-end px-6 sm:px-10 lg:px-14 pb-14 sm:pb-18">

          <p className="hero-tag font-mono text-[10px] uppercase tracking-[0.22em] mb-5 flex items-center gap-2.5" style={{ color: "#9B7FD4" }}>
            <span className="pulse-dot w-1.5 h-1.5 rounded-full inline-block flex-shrink-0" style={{ background: "#9B7FD4" }} />
            Powered by $ANAGO · Live on Monad
          </p>

          {/* headline — controlled size, not full-bleed */}
          <div className="overflow-hidden">
            <h1
              className="font-grotesk uppercase leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(32px, 5.5vw, 64px)" }}
            >
              <span className="hero-line-1 block shimmer-text">Every token</span>
              <span className="hero-line-2 block shimmer-text">needs a home.</span>
            </h1>
          </div>

          <p className="hero-sub font-mono text-[11px] text-cream/40 tracking-wide mt-5 max-w-xs">
            Vesting · Token Lock · DLMM · Yield Farm<br />— one protocol, one roof.
          </p>

          <div className="hero-cta mt-7 flex items-center gap-4">
            <a
              href="#"
              className="flex items-center gap-2 rounded-full px-6 py-3 font-grotesk text-[12px] uppercase tracking-wider transition-all duration-300 hover:opacity-85 hover:-translate-y-px"
              style={{
                background: "linear-gradient(135deg, #9B7FD4, #5B4FE8)",
                color: "#F5F0FF",
                boxShadow: "0 0 0 1px rgba(155,127,212,0.25), 0 4px 24px rgba(91,79,232,0.45)",
              }}
            >
              Launch App
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#utilities"
              className="font-mono text-[10px] uppercase tracking-widest text-cream/30 hover:text-cream/60 transition flex items-center gap-1.5"
            >
              Explore tools
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          UTILITIES
      ───────────────────────────────────────── */}
      <section id="utilities" className="relative reveal" style={{ background: "#06040F" }}>
        {/* faint glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] rounded-full opacity-12 blur-[100px]"
          style={{ background: "radial-gradient(ellipse, #5B4FE8 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-14 pt-20 pb-0">
          {/* section label */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-cream/25 mb-2">What we build</p>
              <h2 className="font-grotesk uppercase text-cream text-[20px] sm:text-[26px] leading-tight tracking-tight">
                One protocol. Four tools.
              </h2>
            </div>
            <span className="hidden sm:block font-mono text-[9px] uppercase tracking-widest text-cream/20">
              On Monad
            </span>
          </div>
        </div>

        {/* full-width grid — no max-width so lines go edge to edge */}
        <div
          className="relative z-10 grid grid-cols-2 lg:grid-cols-4"
          style={{ borderTop: "1px solid rgba(155,127,212,0.1)", borderBottom: "1px solid rgba(155,127,212,0.1)" }}
        >
          {UTILITIES.map((u, i) => {
            const Icon = u.icon;
            // right border: on desktop skip last; on 2-col skip every 2nd
            const borderRight = i % 2 === 0 ? "1px solid rgba(155,127,212,0.1)" : "none";
            return (
              <Link
                key={u.title}
                to={u.href as "/dlmm" | "/vesting" | "/lock" | "/farm"}
                className="group flex flex-col gap-5 px-5 sm:px-8 py-8 sm:py-10 transition-all duration-300 hover:bg-white/[0.025]"
                style={{
                  borderRight,
                  borderBottom: i < 2 ? "1px solid rgba(155,127,212,0.1)" : "none",
                }}
              >
                {/* icon + number */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${u.accent}18`, border: `1px solid ${u.accent}30` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: u.accent }} strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-[9px] text-cream/15 group-hover:text-cream/30 transition">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* text */}
                <div>
                  <h3 className="font-grotesk uppercase text-cream text-[13px] tracking-wider mb-2">
                    {u.title}
                  </h3>
                  <p className="font-mono text-[10px] text-cream/30 leading-relaxed">
                    {u.desc}
                  </p>
                </div>

                {/* hover arrow */}
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

      {/* ─────────────────────────────────────────
          STATS + FOOTER
      ───────────────────────────────────────── */}
      <section className="relative reveal" style={{ background: "#06040F" }}>
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full opacity-10 blur-[80px]"
          style={{ background: "radial-gradient(ellipse, #9B7FD4 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-14 pt-0 pb-10">

          {/* stats grid */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4"
            style={{
              borderTop: "1px solid rgba(155,127,212,0.08)",
              borderBottom: "1px solid rgba(155,127,212,0.08)",
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col gap-1.5 px-6 sm:px-8 py-8"
                style={{ borderRight: i < 3 ? "1px solid rgba(155,127,212,0.08)" : "none" }}
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/20">{s.sub}</span>
                <span className="font-grotesk text-cream text-[30px] sm:text-[38px] leading-none">{s.value}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/20">{s.label}</span>
              </div>
            ))}
          </div>

          {/* footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-8">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="" className="w-6 h-6 rounded-md opacity-50" />
              <span className="font-grotesk uppercase text-[11px] tracking-wider text-cream/30">
                The Dog House
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <a
                href="#"
                aria-label="X (Twitter)"
                className="w-8 h-8 rounded-full flex items-center justify-center text-cream/30 hover:text-cream/70 transition"
                style={{ border: "1px solid rgba(155,127,212,0.15)", background: "rgba(155,127,212,0.05)" }}
              >
                <XIcon className="w-3 h-3" />
              </a>
              <a
                href="#"
                aria-label="Telegram"
                className="w-8 h-8 rounded-full flex items-center justify-center text-cream/30 hover:text-cream/70 transition"
                style={{ border: "1px solid rgba(155,127,212,0.15)", background: "rgba(155,127,212,0.05)" }}
              >
                <Send className="w-3 h-3" />
              </a>
            </div>
          </div>

          <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-cream/15">
            © 2026 The Dog House · Powered by $ANAGO on Monad
          </p>
        </div>
      </section>
    </main>
  );
}
