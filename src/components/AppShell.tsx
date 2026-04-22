import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

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

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="min-h-screen text-cream overflow-x-hidden relative"
      style={{ background: "#06040F" }}
    >
      <div className="texture-overlay" aria-hidden="true" />

      {/* ── BACKGROUND DECORATION ── */}
      {/* top-left purple blob */}
      <div
        className="pointer-events-none fixed top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[100px] z-0"
        style={{ background: "radial-gradient(circle, #9B7FD4 0%, #5B4FE8 60%, transparent 100%)" }}
      />
      {/* top-right smaller blob */}
      <div
        className="pointer-events-none fixed top-[60px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-[0.05] blur-[80px] z-0"
        style={{ background: "radial-gradient(circle, #5B4FE8 0%, transparent 70%)" }}
      />
      {/* bottom-center faint glow */}
      <div
        className="pointer-events-none fixed bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-[0.06] blur-[80px] z-0"
        style={{ background: "radial-gradient(ellipse, #7C5CBF 0%, transparent 70%)" }}
      />
      {/* subtle vertical purple line left */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-px h-full opacity-[0.06] z-0"
        style={{ background: "linear-gradient(to bottom, transparent, #9B7FD4 30%, #5B4FE8 70%, transparent)" }}
      />
      {/* subtle vertical purple line right */}
      <div
        className="pointer-events-none fixed top-0 right-0 w-px h-full opacity-[0.06] z-0"
        style={{ background: "linear-gradient(to bottom, transparent, #9B7FD4 30%, #5B4FE8 70%, transparent)" }}
      />

      {/* ── HEADER ── */}
      <header className="relative z-20 flex items-center justify-between px-5 sm:px-8 lg:px-14 pt-5 pb-4 gap-3"
        style={{ borderBottom: "1px solid rgba(155,127,212,0.07)" }}>

        {/* logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/logo.png" alt="The Dog House" className="w-8 h-8 rounded-md" />
          <span className="hidden sm:block font-grotesk text-[12px] uppercase tracking-wider text-cream/60">
            The Dog House
          </span>
        </Link>

        {/* desktop pill nav */}
        <nav className="hidden lg:flex flex-1 justify-center">
          <ul
            className="flex items-center gap-0.5 px-4 py-2.5 rounded-full"
            style={{
              background: "rgba(6,4,15,0.8)",
              border: "1px solid rgba(155,127,212,0.14)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {NAV.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.href}
                  className="font-grotesk text-[11px] uppercase tracking-[0.1em] text-cream/45 hover:text-cream/80 px-4 py-1.5 rounded-full transition-colors duration-200 block whitespace-nowrap"
                  activeProps={{ style: { color: "#F5F0FF", background: "rgba(155,127,212,0.12)" } }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* right side */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Connect wallet — flat, no glow */}
          <button
            className="rounded-full px-4 py-2 font-grotesk text-[11px] uppercase tracking-wider transition hover:bg-white/[0.06]"
            style={{
              background: "rgba(155,127,212,0.1)",
              color: "rgba(245,240,255,0.7)",
              border: "1px solid rgba(155,127,212,0.2)",
            }}
          >
            Connect
          </button>

          {/* mobile hamburger */}
          <button
            className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-cream/50 hover:text-cream transition"
            style={{ border: "1px solid rgba(155,127,212,0.15)", background: "rgba(6,4,15,0.7)" }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* mobile nav drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden relative z-20 mx-4 mb-2 rounded-xl overflow-hidden"
          style={{
            background: "rgba(6,4,15,0.96)",
            border: "1px solid rgba(155,127,212,0.1)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {NAV.map((l, i) => (
            <Link
              key={l.label}
              to={l.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-5 py-3.5 font-grotesk text-[11px] uppercase tracking-[0.12em] text-cream/50 hover:text-cream hover:bg-white/[0.03] transition-all"
              style={{ borderBottom: i < NAV.length - 1 ? "1px solid rgba(155,127,212,0.06)" : "none" }}
              activeProps={{ style: { color: "#F5F0FF" } }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      {/* page content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* ── FOOTER ── */}
      <footer
        className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 py-7 mt-8 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(155,127,212,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="" className="w-5 h-5 rounded opacity-40" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/20">
            © 2026 The Dog House
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a href="#" aria-label="X"
            className="w-7 h-7 rounded-full flex items-center justify-center text-cream/25 hover:text-cream/60 transition"
            style={{ border: "1px solid rgba(155,127,212,0.1)" }}>
            <XIcon className="w-2.5 h-2.5" />
          </a>
          <a href="#" aria-label="Telegram"
            className="w-7 h-7 rounded-full flex items-center justify-center text-cream/25 hover:text-cream/60 transition"
            style={{ border: "1px solid rgba(155,127,212,0.1)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-2.5 h-2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
