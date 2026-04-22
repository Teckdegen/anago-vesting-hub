import { createFileRoute, Link } from "@tanstack/react-router";
import { LockKeyhole, Timer, Sprout, BarChart2, ArrowRight, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — The Dog House" },
      { name: "description", content: "Your positions across locks, vesting, farms and DLMM." },
    ],
  }),
});

const ACCENT = "#5B4FE8";
const ACCENT2 = "#9B7FD4";

const walletConnected = false;

const SECTIONS = [
  {
    label: "Token Locks",
    sub: "My Locks · Unlocking Soon",
    icon: LockKeyhole,
    href: "/lock",
    color: "#5B4FE8",
    color2: "#9B7FD4",
    emptyMsg: "No active locks",
  },
  {
    label: "Vesting",
    sub: "My Schedules · Claimable",
    icon: Timer,
    href: "/vesting",
    color: "#9B7FD4",
    color2: "#7C5CBF",
    emptyMsg: "No vesting schedules",
  },
  {
    label: "Yield Farms",
    sub: "My Farms · Rewards",
    icon: Sprout,
    href: "/farm",
    color: "#9B7FD4",
    color2: "#5B4FE8",
    emptyMsg: "No active farms",
  },
  {
    label: "DLMM Positions",
    sub: "My Liquidity Positions",
    icon: BarChart2,
    href: "/dlmm",
    color: "#5B4FE8",
    color2: "#7C5CBF",
    emptyMsg: "No open positions",
  },
] as const;

function DashboardPage() {
  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 pt-8 pb-20">

        {/* header */}
        <div className="mb-8">
          <h1 className="font-grotesk uppercase text-cream text-[22px] sm:text-[28px] leading-none tracking-tight">
            Dashboard
          </h1>
          <p className="font-mono text-[10px] text-cream/65 mt-1 tracking-wide">
            All your positions in one place
          </p>
        </div>

        {!walletConnected ? (
          /* ── not connected ── */
          <div
            className="flex flex-col items-center justify-center py-20 rounded-xl text-center"
            style={{ border: "1px solid rgba(91,79,232,0.22)", background: "rgba(91,79,232,0.07)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
              style={{ background: `${ACCENT}25`, border: `1px solid ${ACCENT}45` }}
            >
              <Wallet className="w-5 h-5 text-cream/60" strokeWidth={1.5} />
            </div>
            <p className="font-grotesk uppercase text-cream/80 text-[14px] tracking-wider mb-1">
              Connect your wallet
            </p>
            <p className="font-mono text-[10px] text-cream/50 max-w-[220px]">
              Connect to view your locks, vesting schedules, farms and liquidity positions.
            </p>
            <button
              className="mt-6 rounded-full px-5 py-2.5 font-grotesk text-[11px] uppercase tracking-wider transition hover:opacity-85"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, color: "#F5F0FF" }}
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          /* ── connected: position cards ── */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SECTIONS.map(({ label, sub, icon: Icon, href, color, color2, emptyMsg }) => (
              <div
                key={label}
                className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${color}33` }}
              >
                {/* card header */}
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ background: `${color}12`, borderBottom: `1px solid ${color}22` }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${color}22`, border: `1px solid ${color}44` }}
                    >
                      <Icon className="w-4 h-4 text-cream/70" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-grotesk uppercase text-cream text-[12px] tracking-wider">{label}</p>
                      <p className="font-mono text-[9px] text-cream/45 mt-0.5">{sub}</p>
                    </div>
                  </div>
                  <Link
                    to={href}
                    className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest transition hover:opacity-80"
                    style={{ color: color2 }}
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* card body — empty state (replace with real data rows when live) */}
                <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
                  <p className="font-grotesk uppercase text-cream/40 text-[11px] tracking-wider">{emptyMsg}</p>
                  <p className="font-mono text-[9px] text-cream/30 mt-1">
                    Data will appear once the protocol launches.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
