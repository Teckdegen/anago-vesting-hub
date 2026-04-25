import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  LockKeyhole,
  Timer,
  Sprout,
  BarChart2,
  ArrowRight,
  Eye,
  EyeOff,
  Copy,
} from "lucide-react";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/AppShell";
import { WalletConnectCard } from "@/components/WalletConnectCard";
import { useUserLocks, useUserVestings } from "@/lib/web3/hooks";
import { shortAddr } from "@/lib/web3/format";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — The Dog House" },
      { name: "description", content: "Your portfolio value across all positions." },
    ],
  }),
});

function DashboardPage() {
  const [hidden, setHidden] = useState(false);
  const { address, isConnected } = useAccount();
  const { locks } = useUserLocks();
  const { wallets: vestingWallets } = useUserVestings();

  const activeLocks = locks.filter((l) => !l.withdrawn);
  const totalLocked = activeLocks.reduce((acc, l) => acc + l.amount, 0n);
  const claimableLocks = activeLocks.filter(
    (l) => Number(l.unlockAt) <= Math.floor(Date.now() / 1000),
  ).length;

  const POSITIONS = [
    {
      label: "Token Locks",
      value: hidden
        ? "••••"
        : `${activeLocks.length} active`,
      sub: claimableLocks
        ? `${claimableLocks} claimable now`
        : `${activeLocks.length} active locks`,
      color: "#C4A8F0",
      icon: LockKeyhole,
      href: "/lock",
    },
    {
      label: "Vesting",
      value: hidden ? "••••" : `${vestingWallets.length} schedules`,
      sub: `${vestingWallets.length} schedules`,
      color: "#9B7FD4",
      icon: Timer,
      href: "/vesting",
    },
    {
      label: "Yield Farms",
      value: "$0.00",
      sub: "$0.00 claimable",
      color: "#6B4FA8",
      icon: Sprout,
      href: "/farm",
    },
    {
      label: "CLMM",
      value: "$0.00",
      sub: "0 open positions",
      color: "#4A2D7A",
      icon: BarChart2,
      href: "/clmm",
    },
  ] as const;

  return (
    <AppShell>
      <div className="max-w-[900px] mx-auto px-5 sm:px-8 lg:px-14 pt-10 pb-24">
        {/* ── ONE PLACE TO CONNECT / DISCONNECT ── */}
        <WalletConnectCard />

        {/* ── NET WORTH HEADER ── */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <p
              className="font-mono text-[9px] uppercase tracking-[0.22em] mb-2"
              style={{ color: "rgba(196,168,240,0.7)" }}
            >
              Net Worth
            </p>
            <p className="font-grotesk text-cream leading-none tracking-tight text-[42px] sm:text-[54px]">
              {hidden ? "••••••" : "$0.00"}
            </p>
            <p className="font-mono text-[9px] mt-2" style={{ color: "rgba(196,168,240,0.65)" }}>
              {isConnected
                ? "across all your positions"
                : "connect wallet to load balances"}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start mt-1">
            <button
              onClick={() => setHidden((v) => !v)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition"
              style={{
                background: "rgba(155,127,212,0.12)",
                border: "1px solid rgba(155,127,212,0.4)",
                color: "rgba(196,168,240,0.8)",
              }}
            >
              {hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>

            {isConnected && address && (
              <div
                className="flex items-center gap-2 px-3.5 py-2 rounded-full"
                style={{
                  background: "rgba(155,127,212,0.12)",
                  border: "1px solid rgba(155,127,212,0.35)",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span
                  className="font-mono text-[10px]"
                  style={{ color: "rgba(245,240,255,0.85)" }}
                >
                  {shortAddr(address)}
                </span>
                <button
                  onClick={() => navigator.clipboard?.writeText(address)}
                  style={{ color: "rgba(196,168,240,0.6)" }}
                  className="hover:opacity-80 transition"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── BREAKDOWN BAR ── */}
        <div className="flex w-full h-2.5 rounded-full overflow-hidden gap-px mb-6">
          {POSITIONS.map((p) => (
            <div
              key={p.label}
              className="h-full flex-1"
              style={{ background: p.color, opacity: isConnected ? 1 : 0.75 }}
            />
          ))}
        </div>

        {/* ── VALUE ROWS ── */}
        <div
          className="rounded-xl overflow-hidden mb-4"
          style={{ border: "1px solid rgba(155,127,212,0.4)" }}
        >
          {POSITIONS.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.label}
                className="flex items-center justify-between px-6 py-5 hover:bg-white/[0.03] transition-colors"
                style={{
                  borderBottom:
                    i < POSITIONS.length - 1
                      ? "1px solid rgba(155,127,212,0.2)"
                      : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ background: p.color, opacity: isConnected ? 1 : 0.6 }}
                  />
                  <Icon className="w-4 h-4" style={{ color: p.color }} strokeWidth={1.5} />
                  <div>
                    <p className="font-grotesk uppercase text-cream text-[12px] tracking-wider">
                      {p.label}
                    </p>
                    <p
                      className="font-mono text-[9px] mt-0.5"
                      style={{ color: "rgba(196,168,240,0.65)" }}
                    >
                      {p.sub}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <p
                    className="font-grotesk text-cream text-[18px] leading-none tabular-nums"
                    style={{ opacity: isConnected ? 1 : 0.55 }}
                  >
                    {p.value}
                  </p>
                  <Link
                    to={p.href}
                    className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest hover:opacity-90 transition"
                    style={{ color: p.color, opacity: 0.65 }}
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
          style={{
            background: "rgba(155,127,212,0.14)",
            border: "1px solid rgba(155,127,212,0.45)",
          }}
        >
          <p
            className="font-mono text-[9px] uppercase tracking-[0.2em]"
            style={{ color: "rgba(196,168,240,0.8)" }}
          >
            Total Portfolio
          </p>
          <p className="font-grotesk text-cream text-[20px] leading-none tabular-nums">
            {hidden ? "••••••" : "$0.00"}
          </p>
        </div>

        {/* ── LOCK + VESTING DETAIL ── */}
        {isConnected && (
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <DetailCard
              icon={LockKeyhole}
              title="Locked Positions"
              empty="No locks yet"
              total={`${activeLocks.length} active`}
              href="/lock"
              accent="#C4A8F0"
            >
              {activeLocks.slice(0, 3).map((l) => (
                <div
                  key={l.id.toString()}
                  className="flex items-center justify-between text-[11px] font-mono py-1.5"
                  style={{ borderTop: "1px solid rgba(155,127,212,0.12)" }}
                >
                  <span className="text-cream/80">#{l.id.toString()}</span>
                  <span className="text-cream/55">
                    {Number(l.unlockAt) <= Math.floor(Date.now() / 1000)
                      ? "Claimable"
                      : `Unlocks ${new Date(Number(l.unlockAt) * 1000).toLocaleDateString()}`}
                  </span>
                </div>
              ))}
              {activeLocks.length > 3 && (
                <p className="font-mono text-[10px] text-cream/45 pt-2">
                  + {activeLocks.length - 3} more
                </p>
              )}
            </DetailCard>

            <DetailCard
              icon={Timer}
              title="Vesting Schedules"
              empty="No schedules yet"
              total={`${vestingWallets.length} schedules`}
              href="/vesting"
              accent="#9B7FD4"
            >
              {vestingWallets.slice(0, 3).map((w) => (
                <div
                  key={w}
                  className="flex items-center justify-between text-[11px] font-mono py-1.5"
                  style={{ borderTop: "1px solid rgba(155,127,212,0.12)" }}
                >
                  <span className="text-cream/80">{shortAddr(w)}</span>
                  <span className="text-cream/55">vesting</span>
                </div>
              ))}
              {vestingWallets.length > 3 && (
                <p className="font-mono text-[10px] text-cream/45 pt-2">
                  + {vestingWallets.length - 3} more
                </p>
              )}
            </DetailCard>
          </div>
        )}

        {/* hint about totalLocked sum */}
        {isConnected && totalLocked > 0n && (
          <p className="font-mono text-[10px] text-cream/45 mt-4">
            Showing on-chain counts only. USD values arrive once a price oracle is wired.
          </p>
        )}
      </div>
    </AppShell>
  );
}

function DetailCard({
  icon: Icon,
  title,
  total,
  empty,
  href,
  accent,
  children,
}: {
  icon: typeof LockKeyhole;
  title: string;
  total: string;
  empty: string;
  href: string;
  accent: string;
  children: React.ReactNode;
}) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : !!children;
  return (
    <div
      className="rounded-xl p-5"
      style={{ border: "1px solid rgba(155,127,212,0.3)", background: "rgba(155,127,212,0.05)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color: accent }} strokeWidth={1.5} />
          <p className="font-grotesk uppercase text-cream text-[12px] tracking-wider">{title}</p>
        </div>
        <Link
          to={href}
          className="font-mono text-[9px] uppercase tracking-wider"
          style={{ color: accent, opacity: 0.75 }}
        >
          View →
        </Link>
      </div>
      <p className="font-grotesk text-cream text-[18px] tabular-nums mb-2">{total}</p>
      {hasChildren ? (
        <div>{children}</div>
      ) : (
        <p className="font-mono text-[10px] text-cream/55">{empty}</p>
      )}
    </div>
  );
}
