import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Send, Timer, LockKeyhole, BarChart2, Sprout } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "The Dog House — Every token needs a home" },
      {
        name: "description",
        content:
          "The Dog House on Monad: Vesting, Token Lock, DLMM and Yield Farm. Powered by ANAGO.",
      },
    ],
  }),
});

// X (Twitter) icon
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
    desc: "Dynamic concentrated liquidity with custom bin strategies and real-time fee capture.",
    accent: "#9B7FD4",
    href: "/dlmm",
  },
  {
    icon: Timer,
    title: "Vesting",
    desc: "Linear and cliff vesting schedules for teams, investors, and contributors.",
    accent: "#7C5CBF",
    href: "/vesting",
  },
  {
    icon: LockKeyhole,
    title: "Token Lock",
    desc: "Time-based token locks with transparent on-chain unlock schedules.",
    accent: "#5B4FE8",
    href: "/lock",
  },
  {
    icon: Sprout,
    title: "Yield Farm",
    desc: "Stake LP tokens, earn boosted rewards, and harvest yield on Monad.",
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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main
      className="text-cream min-h-screen overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #1A1245 0%, #2A1F6B 40%, #1E1650 100%)" }}
    >
      <div className="texture-overlay" aria-hidden="true" />

      {/* ── HERO ── */}
      <section className="relative w-full min-h-screen flex flex-col overflow-hidden" style={{ background: "#0A061E" }}>

        {/* fullscreen background video */}
        <video
          src="https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc/high.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          aria-hidden="true"
        />

        {/* vignette — darkens edges so text pops */}
        <div className="video-vignette absolute inset-0 pointer-events-none" />

        {/* bottom fade into page bg */}
        <div className="video-fade-bottom absolute bottom-0 left-0 right-0 h-48 pointer-events-none" />

        {/* subtle purple color grade over video */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(160deg, rgba(91,79,232,0.18) 0%, rgba(155,127,212,0.08) 50%, transparent 100%)", mixBlendMode: "screen" }}
        />

        {/* bottom shimmer line */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] opacity-50"
          style={{ background: "linear-gradient(90deg, transparent, #9B7FD4, #5B4FE8, #9B7FD4, transparent)" }}
        />

        {/* nav */}
        <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 lg:px-16 pt-7 pb-4 gap-4">
          {/* logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.png" alt="The Dog House" className="w-8 h-8 rounded-md" />
            <span className="hidden sm:block font-grotesk text-[13px] uppercase tracking-wider text-cream/80">
              The Dog House
            </span>
          </div>

          {/* center pill nav */}
          <nav className="flex-1 flex justify-center">
            <ul
              className="flex items-center gap-1 px-6 py-3 rounded-full"
              style={{
                background: "rgba(10,6,30,0.55)",
                border: "1px solid rgba(155,127,212,0.22)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "inset 0 1px 1px rgba(245,240,255,0.06), 0 4px 24px rgba(0,0,0,0.5)",
              }}
            >
              {[
                { label: "Home", href: "/" },
                { label: "Vesting", href: "/vesting" },
                { label: "Token Lock", href: "/lock" },
                { label: "DLMM", href: "/dlmm" },
                { label: "Yield Farm", href: "/farm" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href as "/" | "/vesting" | "/lock" | "/dlmm" | "/farm"}
                    className="font-grotesk text-[11px] sm:text-[12px] uppercase tracking-[0.12em] text-cream/60 hover:text-cream px-3 sm:px-5 py-1.5 rounded-full transition-colors duration-200"
                    activeProps={{ className: "font-grotesk text-[11px] sm:text-[12px] uppercase tracking-[0.12em] text-cream px-3 sm:px-5 py-1.5 rounded-full transition-colors duration-200" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* launch app */}
          <a
            href="#"
            className="cta-glow shrink-0 flex items-center gap-2 rounded-full px-5 py-2.5 font-grotesk text-[12px] uppercase tracking-wider transition hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #9B7FD4, #5B4FE8)",
              color: "#F5F0FF",
              boxShadow: "0 4px 20px rgba(91,79,232,0.4)",
            }}
          >
            Launch App
          </a>
        </header>

        {/* hero content — left-aligned, vertically centered */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-20 pb-28">

          {/* tag line */}
          <p className="hero-tag font-mono text-[11px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2.5" style={{ color: "#9B7FD4" }}>
            <span className="pulse-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#9B7FD4" }} />
            Powered by $ANAGO · Live on Monad
          </p>

          {/* headline */}
          <h1 className="font-grotesk uppercase text-[48px] sm:text-[68px] md:text-[84px] lg:text-[104px] leading-[0.95] tracking-tight max-w-4xl overflow-hidden">
            <span className="hero-line-1 shimmer-text">Every token</span>
            <span className="hero-line-2 shimmer-text">needs a home.</span>
          </h1>

          {/* sub */}
          <p className="hero-sub font-mono text-[12px] sm:text-[13px] text-cream/50 max-w-sm tracking-wide mt-7">
            Vesting · Token Lock · DLMM · Yield Farm<br />— one protocol, one roof.
          </p>

          {/* CTA row */}
          <div className="hero-cta mt-10 flex items-center gap-4 flex-wrap">
            <a
              href="#"
              className="cta-glow flex items-center gap-2 rounded-full px-7 py-3.5 font-grotesk text-[13px] uppercase tracking-wider transition hover:opacity-90 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #9B7FD4, #5B4FE8)",
                color: "#F5F0FF",
                boxShadow: "0 4px 28px rgba(91,79,232,0.5)",
              }}
            >
              Launch App
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#utilities"
              className="font-mono text-[11px] uppercase tracking-widest text-cream/40 hover:text-cream/70 transition flex items-center gap-1.5"
            >
              Explore tools
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── UTILITIES ── */}
      <section id="utilities" className="relative reveal px-6 sm:px-10 lg:px-20 py-24 sm:py-28">
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(ellipse, #7C5CBF 0%, transparent 70%)" }}
        />

        <div className="relative z-10 text-center mb-16">
          <h2 className="font-grotesk uppercase text-cream text-[28px] sm:text-[36px] lg:text-[44px] leading-tight tracking-tight">
            One protocol. Four tools.
          </h2>
          <p className="mt-3 font-mono text-[12px] text-cream/40 uppercase tracking-widest">
            Everything your token needs, on Monad.
          </p>
        </div>

        {/* thin divider line */}
        <div className="relative z-10 w-full h-px mb-12" style={{ background: "linear-gradient(90deg, transparent, rgba(155,127,212,0.3), transparent)" }} />

        {/* 4 utilities in a row */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "rgba(155,127,212,0.12)", borderRadius: "20px", overflow: "hidden" }}>
          {UTILITIES.map((u) => {
            const Icon = u.icon;
            return (
              <Link
                key={u.title}
                to={u.href as "/dlmm" | "/vesting" | "/lock" | "/farm"}
                className="group flex flex-col gap-5 px-8 py-10 transition-all duration-300 hover:bg-white/[0.04]"
                style={{ background: "rgba(26,18,69,0.6)" }}
              >
                <Icon
                  className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5"
                  style={{ color: u.accent }}
                  strokeWidth={1.5}
                />
                <div>
                  <h3 className="font-grotesk uppercase text-cream text-[15px] tracking-wider mb-2">
                    {u.title}
                  </h3>
                  <p className="font-mono text-[11px] text-cream/40 leading-relaxed tracking-wide">
                    {u.desc}
                  </p>
                </div>
                <span
                  className="mt-auto font-mono text-[10px] uppercase tracking-widest transition-colors duration-300 group-hover:opacity-100 opacity-50"
                  style={{ color: u.accent }}
                >
                  Open →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── PROTOCOL STATS + FOOTER ── */}
      <section
        className="relative reveal overflow-hidden"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(91,79,232,0.08) 100%)" }}
      >
        {/* top border line */}
        <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(155,127,212,0.4), transparent)" }} />

        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: "radial-gradient(ellipse, #5B4FE8 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-20 pt-20 pb-10">

          {/* stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-20" style={{ background: "rgba(155,127,212,0.1)", borderRadius: "16px", overflow: "hidden" }}>
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col gap-2 px-8 py-8"
                style={{ background: "rgba(26,18,69,0.5)" }}
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-cream/40">{s.sub}</span>
                <span className="font-grotesk text-cream text-[36px] sm:text-[44px] leading-none">{s.value}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-cream/40">{s.label}</span>
              </div>
            ))}
          </div>

          {/* footer row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-white/[0.06]">
            {/* left — logo + name */}
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="" className="w-7 h-7 rounded-md" />
              <span className="font-grotesk uppercase text-[12px] tracking-wider text-cream/70">
                The Dog House
              </span>
            </div>

            {/* right — socials */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="X (Twitter)"
                className="liquid-glass w-9 h-9 rounded-full flex items-center justify-center text-cream/60 hover:text-cream transition"
              >
                <XIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                aria-label="Telegram"
                className="liquid-glass w-9 h-9 rounded-full flex items-center justify-center text-cream/60 hover:text-cream transition"
              >
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-cream/25 text-center sm:text-left">
            © 2026 The Dog House · Powered by $ANAGO on Monad
          </p>
        </div>
      </section>
    </main>
  );
}
