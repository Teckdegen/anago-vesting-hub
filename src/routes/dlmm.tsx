import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/dlmm")({
  component: DLMMPage,
  head: () => ({
    meta: [
      { title: "DLMM — The Dog House" },
      { name: "description", content: "Dynamic Liquidity Market Maker on Monad." },
    ],
  }),
});

const ACCENT = "#9B7FD4";
const ACCENT2 = "#5B4FE8";
const TABS = ["All Pools", "My Positions"] as const;
type Tab = typeof TABS[number];

function DLMMPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All Pools");
  const [search, setSearch] = useState("");

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 pt-8 pb-20">

        {/* header */}
        <div className="mb-7">
          <h1 className="font-grotesk uppercase text-cream text-[22px] sm:text-[28px] leading-none tracking-tight">
            Liquidity Pools
          </h1>
          <p className="font-mono text-[10px] text-cream/30 mt-1 tracking-wide">
            Concentrated liquidity · earn fees on every swap
          </p>
        </div>

        {/* tabs + search */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-0.5 p-1 rounded-full" style={{ background: "rgba(155,127,212,0.07)", border: "1px solid rgba(155,127,212,0.12)" }}>
            {TABS.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className="px-4 py-1.5 rounded-full font-grotesk text-[11px] uppercase tracking-wider transition whitespace-nowrap"
                style={activeTab === t ? { background: ACCENT, color: "#F5F0FF", boxShadow: `0 0 12px ${ACCENT}55` } : { color: "rgba(245,240,255,0.35)" }}
              >{t}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: "rgba(155,127,212,0.05)", border: "1px solid rgba(155,127,212,0.1)" }}>
            <Search className="w-3.5 h-3.5 text-cream/25" strokeWidth={1.5} />
            <input type="text" placeholder="Search pools…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent font-mono text-[11px] text-cream/60 placeholder-cream/20 outline-none w-32 sm:w-44" />
          </div>
        </div>

        {/* table */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(155,127,212,0.1)" }}>
          {/* thead */}
          <div className="hidden sm:grid px-5 py-3 text-[9px] font-mono uppercase tracking-[0.2em] text-cream/20"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 80px", borderBottom: "1px solid rgba(155,127,212,0.07)", background: "rgba(155,127,212,0.03)" }}>
            <div>Pool</div>
            <div className="text-right">TVL</div>
            <div className="text-right">APR</div>
            <div className="text-right">Vol 24h</div>
            <div />
          </div>

          {/* empty */}
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <p className="font-grotesk uppercase text-cream/40 text-[13px] tracking-wider">
              {activeTab === "My Positions" ? "No open positions" : "No pools yet"}
            </p>
            <p className="font-mono text-[10px] text-cream/20 mt-1.5 max-w-[200px]">
              {activeTab === "My Positions" ? "Add liquidity to open a position." : "Pools will appear once the protocol launches."}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
