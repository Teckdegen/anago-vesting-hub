import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/dlmm")({
  component: DLMMPage,
  head: () => ({
    meta: [
      { title: "DLMM — The Dog House" },
      { name: "description", content: "Dynamic Liquidity Market Maker on Monad. Provide concentrated liquidity and earn fees." },
    ],
  }),
});

const ACCENT = "#9B7FD4";
const ACCENT2 = "#5B4FE8";

// Mock pool data — replace with real data when available
const POOLS: {
  pair: string;
  tokenA: string;
  tokenB: string;
  fee: string;
  tvl: string;
  apr: string;
  vol24h: string;
  myLiquidity: string | null;
}[] = [];

const TABS = ["All Pools", "My Positions"] as const;
type Tab = typeof TABS[number];

function DLMMPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All Pools");
  const [search, setSearch] = useState("");

  return (
    <AppShell accent={ACCENT} accent2={ACCENT2}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 pt-8 pb-20">

        {/* ── PAGE HEADER ── */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-grotesk uppercase text-cream text-[28px] sm:text-[36px] leading-none tracking-tight">
              Liquidity Pools
            </h1>
            <p className="font-mono text-[11px] text-cream/35 mt-1.5 tracking-wide">
              Provide concentrated liquidity and earn trading fees.
            </p>
          </div>
          <button
            className="flex items-center gap-2 rounded-full px-5 py-2.5 font-grotesk text-[11px] uppercase tracking-wider transition hover:opacity-85"
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
              color: "#F5F0FF",
              boxShadow: `0 4px 20px ${ACCENT2}44`,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Position
          </button>
        </div>

        {/* ── TABS + SEARCH ── */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          {/* tabs */}
          <div
            className="flex items-center gap-0.5 p-1 rounded-full"
            style={{ background: "rgba(155,127,212,0.08)", border: "1px solid rgba(155,127,212,0.12)" }}
          >
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="px-4 py-1.5 rounded-full font-grotesk text-[11px] uppercase tracking-wider transition"
                style={
                  activeTab === t
                    ? { background: ACCENT, color: "#F5F0FF", boxShadow: `0 0 12px ${ACCENT}66` }
                    : { color: "rgba(245,240,255,0.4)" }
                }
              >
                {t}
              </button>
            ))}
          </div>

          {/* search */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-full"
            style={{ background: "rgba(155,127,212,0.06)", border: "1px solid rgba(155,127,212,0.12)" }}
          >
            <Search className="w-3.5 h-3.5 text-cream/30" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search pools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent font-mono text-[11px] text-cream/70 placeholder-cream/25 outline-none w-36 sm:w-48"
            />
          </div>
        </div>

        {/* ── POOLS TABLE ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(155,127,212,0.1)" }}
        >
          {/* table header */}
          <div
            className="grid px-5 py-3 text-[9px] font-mono uppercase tracking-[0.2em] text-cream/25"
            style={{
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
              borderBottom: "1px solid rgba(155,127,212,0.08)",
              background: "rgba(155,127,212,0.04)",
            }}
          >
            <div>Pool</div>
            <div className="text-right">TVL</div>
            <div className="text-right">APR</div>
            <div className="text-right">Vol 24h</div>
            <div className="text-right">Action</div>
          </div>

          {/* rows — empty state */}
          {POOLS.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}25` }}
              >
                <Plus className="w-5 h-5 text-cream/30" strokeWidth={1.5} />
              </div>
              <p className="font-grotesk uppercase text-cream/60 text-[14px] tracking-wider">
                {activeTab === "My Positions" ? "No open positions" : "No pools yet"}
              </p>
              <p className="font-mono text-[10px] text-cream/25 mt-1.5 max-w-[220px]">
                {activeTab === "My Positions"
                  ? "Add liquidity to a pool to open a position."
                  : "Pools will appear here once the protocol launches."}
              </p>
              {activeTab === "My Positions" && (
                <button
                  onClick={() => setActiveTab("All Pools")}
                  className="mt-5 px-4 py-2 rounded-full font-grotesk text-[10px] uppercase tracking-wider transition hover:opacity-85"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, color: "#F5F0FF" }}
                >
                  Browse Pools
                </button>
              )}
            </div>
          ) : (
            POOLS.map((pool, i) => (
              <div
                key={pool.pair}
                className="grid px-5 py-4 items-center hover:bg-white/[0.025] transition-colors"
                style={{
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                  borderBottom: i < POOLS.length - 1 ? "1px solid rgba(155,127,212,0.06)" : "none",
                }}
              >
                {/* pair */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1.5">
                    <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-grotesk text-[9px] text-cream/60">
                      {pool.tokenA[0]}
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-grotesk text-[9px] text-cream/60">
                      {pool.tokenB[0]}
                    </div>
                  </div>
                  <div>
                    <p className="font-grotesk uppercase text-cream text-[12px] tracking-wider">{pool.pair}</p>
                    <p className="font-mono text-[9px] text-cream/30">{pool.fee} fee</p>
                  </div>
                </div>
                <div className="font-grotesk text-cream/80 text-[12px] text-right">{pool.tvl}</div>
                <div className="font-mono text-[11px] text-right" style={{ color: ACCENT }}>{pool.apr}</div>
                <div className="font-mono text-cream/50 text-[11px] text-right">{pool.vol24h}</div>
                <div className="text-right">
                  <Link
                    to="/dlmm"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-grotesk text-[10px] uppercase tracking-wider transition hover:opacity-85"
                    style={{ background: `${ACCENT}22`, color: ACCENT, border: `1px solid ${ACCENT}33` }}
                  >
                    Add
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
