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

export function AppShell({ children, accent = "#9B7FD4", accent2 = "#5B4FE8" }: {
  children: ReactNode;
  accent?: string;
  accent2?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="min-h-screen text-cream overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #06040F 0%, #0E0A24 40%, #0A0718 100%)" }}
    >
      <div className="texture-overlay" aria-hidden="true" />

      {/* ambient top glow */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full opacity-20 blur-[140px] z-0"
        style={{ background: `radial-gradient(ellipse, ${accent} 0%, #5B4FE8 50%, transparent 70%)` }}
      />

      {/* ── HEADER ── */}
      <header className="relative z-20 flex items-center justify-between px-5 sm:px-8 lg:px-14 pt-5 pb-4 gap-3">

        {/* logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/logo.png" alt="The Dog House" className="w-8 h-8 rounded-md" />
          <span className="font-grotesk text-[13px] uppercase tracking-wider text-cream/75">
            The Dog House
          </span>
        </Link>

        {/* desktop pill nav */}
        <nav className="hidden lg:flex flex-1 justify-center">
          <ul
            className="flex items-center gap-0.5 px-4 py-2.5 rounded-full"
            style={{
              background: "rgba(6,4,15,0.7)",
              border: "1px solid rgba(155,127,212,0.2)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
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

        {/* right side */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            className="rounded-full px-4 py-2.5 font-grotesk text-[11px] uppercase tracking-wider transition-all hover:opacity-85"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent2})`,
              color: "#F5F0FF",
              boxShadow: `0 4px 16px ${accent2}55`,
            }}
          >
            Connect
          </button>

          {/* mobile hamburger */}
          <button
            className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-cream/60 hover:text-cream transition"
            style={{ border: "1px solid rgba(155,127,212,0.2)", background: "rgba(6,4,15,0.6)" }}
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
          className="lg:hidden relative z-20 mx-4 mb-2 rounded-2xl overflow-hidden"
          style={{
            background: "rgba(6,4,15,0.92)",
            border: "1px solid rgba(155,127,212,0.15)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {NAV.map((l, i) => (
            <Link
              key={l.label}
              to={l.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-5 py-3.5 font-grotesk text-[12px] uppercase tracking-[0.12em] text-cream/60 hover:text-cream hover:bg-white/[0.04] transition-all"
              style={{ borderBottom: i < NAV.length - 1 ? "1px solid rgba(155,127,212,0.08)" : "none" }}
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

      {/* footer */}
      <footer className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 py-8 mt-10 flex items-center justify-between border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="" className="w-6 h-6 rounded-md opacity-60" />
          <span className="font-grotesk uppercase text-[11px] tracking-wider text-cream/40">
            The Dog House
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <a href="#" aria-label="X" className="w-8 h-8 rounded-full flex items-center justify-center text-cream/40 hover:text-cream transition"
            style={{ border: "1px solid rgba(155,127,212,0.15)", background: "rgba(155,127,212,0.05)" }}>
            <XIcon className="w-3 h-3" />
          </a>
          <a href="#" aria-label="Telegram" className="w-8 h-8 rounded-full flex items-center justify-center text-cream/40 hover:text-cream transition"
            style={{ border: "1px solid rgba(155,127,212,0.15)", background: "rgba(155,127,212,0.05)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
