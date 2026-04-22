import { createFileRoute, Link } from "@tanstack/react-router";
import { LockKeyhole, Timer, Sprout, BarChart2, ArrowRight, Wallet, TrendingUp, Clock, Zap, Copy } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — The Dog House" },
      { name: "description", content: "Your full DeFi portfolio — locks, vesting, farms and liquidity." },
    ],
  }),
});

const ACCENT = "#5B4FE8";
const ACCENT2 = "#9B7FD4";
const ACCENT3 = "#7C5CBF";

// ── swap to `true` once wallet adapter is wired ──
const walletConnected = false;
const walletAddress = "0x1a2b...9f0e";

// ── placeholder stat data ──
const STATS = [
  { label: "Portfolio Value", value: "$0.00", sub: "across all positions", icon: TrendingUp, color: ACCENT2 },
  { label: "Claimable", value: "$0.00", sub: "vesting + farm rewards", icon: Zap, color: "#FFD700" },
  { label: "Locked Value", value: "$0.00", sub: "in active token locks", icon: LockKeyhole, color: ACCENT },
  { label: "Unlocking Soon", value: "—", sub: "within 30 days", icon: Clock, color: "#CD7F32" },
];

// ── section definitions ──
const SECTIONS = [
  {
    id: "locks",
    label: "Token Locks",
    icon: LockKeyhole,
    href: "/lock",
    accent: ACCENT,
    accent2: ACCENT2,
    cols: ["Token", "Amount", "Value", "Lock Date", "Unlock Date", "Status"],
    colTemplate: "2fr 1fr 1fr 1fr 1fr 100px",
    emptyLabel: "No active locks",
    emptyHint: "Tokens you lock will appear here with unlock countdowns.",
  },
  {
    id: "vesting",
    label: "Vesting Schedules",
    icon: Timer,
    href: "/vesting",
    accent: ACCENT2,
    accent2: ACCENT3,
    cols: ["Token", "Total", "Vested", "Claimable", "End Date", ""],
    colTemplate: "2fr 1fr 1fr 1fr 1fr 80px",
    emptyLabel: "No vesting schedules",
    emptyHint: "Schedules assigned to your wallet will show here.",
  },
  {
    id: "farms",
    label: "Yield Farms",
    icon: Sprout,
    href: "/farm",
    accent: ACCENT2,
    accent2: ACCENT,
    cols: ["Farm", "Staked", "APR", "Pending Rewards", "Boost", ""],
    colTemplate: "2fr 1fr 1fr 1fr 1fr 80px",
    emptyLabel: "No active farms",
    emptyHint: "Stake LP tokens to start earning $ANAGO rewards.",
  },
  {
    id: "dlmm",
    label: "DLMM Positions",
    icon: BarChart2,
    href: "/dlmm",
    accent: ACCENT,
    accent2: ACCENT3,
    cols: ["Pool", "Liquidity", "Fees Earned", "Range", "APR", ""],
    colTemplate: "2fr 1fr 1fr 1fr 1fr 80px",
    emptyLabel: "No open positions",
    emptyHint: "Add liquidity to a DLMM pool to open a position.",
  },
] as const;

function StatCard({ label, value, sub, icon: Icon, color }: typeof STATS[number]) {
  return (
    <div
      className="rounded-xl px-5 py-4 flex flex-col gap-3"
      style={{ border: `1px solid ${color}28`, background: `${color}0d` }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/50">{label}</span>
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: `${color}22`, border: `1px solid ${color}44` }}
        >
          <Icon className="w-3 h-3" style={{ color }} strokeWidth={1.5} />
        </div>
      </div>
      <div>
        <p className="font-grotesk text-cream text-[22px] leading-none tracking-tight">{value}</p>
        <p className="font-mono text-[9px] text-cream/40 mt-1.5">{sub}</p>
      </div>
    </div>
  );
}

function SectionTable({
  label, icon: Icon, href, accent, accent2, cols, colTemplate, emptyLabel, emptyHint,
}: typeof SECTIONS[number]) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${accent}2a` }}>
      {/* section header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ background: `${accent}10`, borderBottom: `1px solid ${accent}20` }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}
          >
            <Icon className="w-3.5 h-3.5 text-cream/70" strokeWidth={1.5} />
          </div>
          <span className="font-grotesk uppercase text-cream text-[12px] tracking-wider">{label}</span>
        </div>
        <Link
          to={href}
          className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest transition hover:opacity-75"
          style={{ color: accent2 }}
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* column headers */}
      <div
        className="hidden sm:grid px-5 py-2.5 text-[9px] font-mono uppercase tracking-[0.18em] text-cream/45"
        style={{ gridTemplateColumns: colTemplate, borderBottom: `1px solid ${accent}18`, background: `${accent}08` }}
      >
        {cols.map((c, i) => (
          <div key={i} className={i > 0 ? "text-right" : ""}>{c}</div>
        ))}
      </div>

      {/* empty body */}
      <div className="flex flex-col items-center justify-center py-10 px-6 text-center gap-1.5">
        <p className="font-grotesk uppercase text-cream/35 text-[11px] tracking-wider">{emptyLabel}</p>
        <p className="font-mono text-[9px] text-cream/25 max-w-[240px]">{emptyHint}</p>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 pt-8 pb-20">

        {/* ── top bar: address + portfolio total ── */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/45 mb-1.5">Portfolio</p>
            <h1 className="font-grotesk uppercase text-cream text-[26px] sm:text-[34px] leading-none tracking-tight">
              $0.00
            </h1>
            <p className="font-mono text-[10px] text-cream/40 mt-1.5">Total value across all positions</p>
          </div>

          {walletConnected ? (
            <div
              className="flex items-center gap-2 px-3.5 py-2 rounded-full self-start mt-1"
              style={{ background: "rgba(155,127,212,0.1)", border: "1px solid rgba(155,127,212,0.22)" }}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px #34d399" }} />
              <span className="font-mono text-[10px] text-cream/80">{walletAddress}</span>
              <button className="text-cream/35 hover:text-cream/70 transition ml-0.5">
                <Copy className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              className="self-start mt-1 flex items-center gap-2 rounded-full px-4 py-2 font-grotesk text-[10px] uppercase tracking-wider transition hover:opacity-85"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, color: "#F5F0FF" }}
            >
              <Wallet className="w-3.5 h-3.5" strokeWidth={1.5} />
              Connect Wallet
            </button>
          )}
        </div>

        {/* ── connect prompt banner (not connected) ── */}
        {!walletConnected && (
          <div
            className="flex items-center gap-3 px-5 py-3.5 rounded-xl mb-8"
            style={{ background: `${ACCENT}0e`, border: `1px solid ${ACCENT}30` }}
          >
            <Wallet className="w-4 h-4 shrink-0 text-cream/50" strokeWidth={1.5} />
            <p className="font-mono text-[10px] text-cream/55 leading-relaxed">
              Connect your wallet to load your real positions. Showing $0.00 across all sections until connected.
            </p>
          </div>
        )}

        {/* ── stat strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* ── position tables ── */}
        <div className="flex flex-col gap-5">
          {SECTIONS.map((s) => <SectionTable key={s.id} {...s} />)}
        </div>
      </div>
    </AppShell>
  );
}
