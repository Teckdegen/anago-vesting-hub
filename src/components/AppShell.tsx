import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, Timer, LockKeyhole, BarChart2, Sprout } from "lucide-react";

const NAV = [
  { label: "Home",       href: "/"          },
  { label: "Dashboard",  href: "/dashboard" },
  { label: "Vesting",    href: "/vesting"   },
  { label: "Token Lock", href: "/lock"      },
  { label: "CLMM",       href: "/clmm"      },
  { label: "Yield Farm", href: "/farm"      },
] as const;

const BOTTOM_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Vest",      href: "/vesting",   icon: Timer           },
  { label: "Locks",     href: "/lock",      icon: LockKeyhole     },
  { label: "CLMM",      href: "/clmm",      icon: BarChart2       },
  { label: "Farm",      href: "/farm",      icon: Sprout          },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen text-cream overflow-x-hidden relative"
      style={{ background: "#06040F" }}
    >
      <div className="texture-overlay" aria-hidden="true" />

      {/* ── BACKGROUND DECORATION ── */}
      <div
        className="pointer-events-none fixed top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[100px] z-0"
        style={{ background: "radial-gradient(circle, #9B7FD4 0%, #5B4FE8 60%, transparent 100%)" }}
      />
      <div
        className="pointer-events-none fixed top-[60px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-[0.05] blur-[80px] z-0"
        style={{ background: "radial-gradient(circle, #5B4FE8 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none fixed bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-[0.06] blur-[80px] z-0"
        style={{ background: "radial-gradient(ellipse, #7C5CBF 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none fixed top-0 left-0 w-px h-full opacity-[0.06] z-0"
        style={{ background: "linear-gradient(to bottom, transparent, #9B7FD4 30%, #5B4FE8 70%, transparent)" }}
      />
      <div
        className="pointer-events-none fixed top-0 right-0 w-px h-full opacity-[0.06] z-0"
        style={{ background: "linear-gradient(to bottom, transparent, #9B7FD4 30%, #5B4FE8 70%, transparent)" }}
      />

      {/* ── HEADER ── */}
      <header
        className="relative z-20 flex items-center justify-between px-5 sm:px-8 lg:px-14 pt-5 pb-4 gap-3"
        style={{ borderBottom: "1px solid rgba(155,127,212,0.07)" }}
      >
        {/* logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/logo.png" alt="The Dog House" className="w-8 h-8 rounded-md" />
          <span className="hidden sm:block font-grotesk text-[12px] uppercase tracking-wider text-cream/85">
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
                  className="font-grotesk text-[11px] uppercase tracking-[0.1em] text-cream/75 hover:text-cream/80 px-4 py-1.5 rounded-full transition-colors duration-200 block whitespace-nowrap"
                  activeProps={{ style: { color: "#F5F0FF", background: "rgba(155,127,212,0.12)" } }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* connect wallet */}
        <button
          className="rounded-full px-4 py-2 font-grotesk text-[11px] uppercase tracking-wider transition hover:bg-white/[0.06]"
          style={{
            background: "rgba(155,127,212,0.1)",
            color: "#F5F0FF",
            border: "1px solid rgba(155,127,212,0.35)",
          }}
        >
          Connect
        </button>
      </header>

      {/* page content — extra bottom padding on mobile for the tab bar */}
      <main className="relative z-10 pb-24 lg:pb-0">
        {children}
      </main>

      {/* ── BOTTOM TAB BAR (mobile only) ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-stretch"
        style={{
          background: "rgba(6,4,15,0.95)",
          borderTop: "1px solid rgba(155,127,212,0.3)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {BOTTOM_NAV.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            to={href}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-colors"
            style={{ color: "rgba(245,240,255,0.45)" }}
            activeProps={{ style: { color: "#C4A8F0" } }}
          >
            <Icon className="w-5 h-5" strokeWidth={1.5} />
            <span className="font-grotesk text-[9px] uppercase tracking-wider">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
