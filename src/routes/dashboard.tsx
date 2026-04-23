import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LockKeyhole, Timer, Sprout, BarChart2, ArrowRight, Eye, EyeOff, Copy } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — The Dog House" },
      { name: "description", content: "Your portfolio value across all positions." },
    ],
  }),
});

const walletConnected = false;
const walletAddress = "0x1a2b...9f0e";

const POSITIONS = [
  { label: "Token Locks",  value: "$0.00", sub: "0 active locks",       color: "#7C5CBF", icon: LockKeyhole, href: "/lock"    },
  { label: "Vesting",      value: "$0.00", sub: "0 schedules",          color: "#9B7FD4", icon: Timer,       href: "/vesting" },
  { label: "Yield Farms",  value: "$0.00", sub: "$0.00 claimable",      color: "#CD7F32", icon: Sprout,      href: "/farm"    },
  { label: "DLMM",         value: "$0.00", sub: "0 open positions",     color: "#5A3F8F", icon: BarChart2,   href: "/dlmm"   },
] as const;

function DashboardPage() {
  const [hidden, setHidden] = useState(false);

  return (
    <AppShell>
      <div className="max-w-[900px] mx-auto px-5 sm:px-8 lg:px-14 pt-10 pb-24">

        {/* ── NET WORTH HEADER ── */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-cream/40 mb-2">Net Worth</p>
            <p className="font-grotesk text-cream leading-none tracking-tight text-[42px] sm:text-[54px]">
              {hidden ? "••••••" : "$0.00"}
            </p>
            <p className="font-mono text-[9px] text-cream/35 mt-2">
              {walletConnected ? "across all your positions" : "connect wallet to load balances"}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start mt-1">
            <button
              onClick={() => setHidden((v) => !v)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-cream/35 hover:text-cream/65 transition"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(155,127,212,0.14)" }}
            >
              {hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>

            {walletConnected && (
              <div
                className="flex items-center gap-2 px-3.5 py-2 rounded-full"
                style={{ background: "rgba(155,127,212,0.08)", border: "1px solid rgba(155,127,212,0.2)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 5px #34d399" }} />
                <span className="font-mono text-[10px] text-cream/70">{walletAddress}</span>
                <button className="text-cream/30 hover:text-cream/60 transition">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── BREAKDOWN BAR ── */}
        <div className="flex w-full h-1.5 rounded-full overflow-hidden gap-px mb-6">
          {POSITIONS.map((p) => (
            <div
              key={p.label}
              className="h-full flex-1"
              style={{ background: p.color, opacity: walletConnected ? 1 : 0.18 }}
            />
          ))}
        </div>

        {/* ── VALUE ROWS ── */}
        <div
          className="rounded-xl overflow-hidden mb-4"
          style={{ border: "1px solid rgba(155,127,212,0.14)" }}
        >
          {POSITIONS.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.label}
                className="flex items-center justify-between px-6 py-5 hover:bg-white/[0.02] transition-colors"
                style={{ borderBottom: i < POSITIONS.length - 1 ? "1px solid rgba(155,127,212,0.08)" : "none" }}
              >
                {/* left: color dot + label */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ background: p.color, opacity: walletConnected ? 1 : 0.4 }}
                  />
                  <div>
                    <p className="font-grotesk uppercase text-cream/80 text-[12px] tracking-wider">{p.label}</p>
                    <p className="font-mono text-[9px] text-cream/35 mt-0.5">{p.sub}</p>
                  </div>
                </div>

                {/* right: value + link */}
                <div className="flex items-center gap-5">
                  <p
                    className="font-grotesk text-cream text-[18px] leading-none tabular-nums"
                    style={{ opacity: walletConnected ? 1 : 0.4 }}
                  >
                    {hidden ? "••••" : p.value}
                  </p>
                  <Link
                    to={p.href}
                    className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest opacity-40 hover:opacity-75 transition"
                    style={{ color: p.color }}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── TOTAL ROW ── */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-xl"
          style={{ background: "rgba(124,92,191,0.08)", border: "1px solid rgba(124,92,191,0.2)" }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/45">Total Portfolio</p>
          <p className="font-grotesk text-cream text-[20px] leading-none tabular-nums">
            {hidden ? "••••••" : "$0.00"}
          </p>
        </div>

      </div>
    </AppShell>
  );
}
