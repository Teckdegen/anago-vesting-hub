import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

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
  return (
    <div
      className="min-h-screen text-cream overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #06040F 0%, #0E0A24 40%, #0A0718 100%)" }}
    >
      <div className="texture-overlay" aria-hidden="true" />

      {/* ambient top glow */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full opacity-25 blur-[140px] z-0"
        style={{ background: `radial-gradient(ellipse, ${accent} 0%, #5B4FE8 50%, transparent 70%)` }}
      />

      {/* header */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 lg:px-16 pt-7 pb-4 gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/logo.png" alt="The Dog House" className="w-8 h-8 rounded-md" />
          <span className="hidden sm:block font-grotesk text-[13px] uppercase tracking-wider text-cream/80">
            The Dog House
          </span>
        </Link>

        <nav className="flex-1 flex justify-center">
          <ul
            className="flex items-center gap-1 px-6 py-3 rounded-full"
            style={{
              background: "rgba(91,79,232,0.18)",
              border: "1px solid rgba(155,127,212,0.25)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "inset 0 1px 1px rgba(245,240,255,0.08), 0 4px 24px rgba(42,31,107,0.4)",
            }}
          >
            {NAV.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.href}
                  className="font-grotesk text-[11px] sm:text-[12px] uppercase tracking-[0.12em] text-cream/60 hover:text-cream px-3 sm:px-5 py-1.5 rounded-full transition-colors duration-200"
                  activeProps={{ className: "font-grotesk text-[11px] sm:text-[12px] uppercase tracking-[0.12em] text-cream px-3 sm:px-5 py-1.5 rounded-full transition-colors duration-200" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="shrink-0 rounded-full px-5 py-2.5 font-grotesk text-[12px] uppercase tracking-wider transition hover:opacity-90 hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(135deg, ${accent}, ${accent2})`,
            color: "#F5F0FF",
            boxShadow: `0 4px 20px ${accent2}66`,
          }}
        >
          Connect
        </button>
      </header>

      {/* page content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* footer */}
      <footer className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-8 mt-10 flex items-center justify-between border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="" className="w-6 h-6 rounded-md" />
          <span className="font-grotesk uppercase text-[11px] tracking-wider text-cream/50">
            The Dog House · Powered by $ANAGO
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#" aria-label="X" className="liquid-glass w-8 h-8 rounded-full flex items-center justify-center text-cream/50 hover:text-cream transition">
            <XIcon className="w-3 h-3" />
          </a>
          <a href="#" aria-label="Telegram" className="liquid-glass w-8 h-8 rounded-full flex items-center justify-center text-cream/50 hover:text-cream transition">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
