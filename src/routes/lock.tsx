import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, LockKeyhole } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/lock")({
  component: LockPage,
  head: () => ({
    meta: [
      { title: "Token Lock — The Dog House" },
      { name: "description", content: "Lock tokens with confidence on Monad." },
    ],
  }),
});

const ACCENT = "#5B4FE8";
const ACCENT2 = "#9B7FD4";
const TABS = ["All Locks", "My Locks", "Unlocking Soon"] as const;
type Tab = typeof TABS[number];

function LockPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All Locks");
  const [search, setSearch] = useState("");

  return (
    <AppShell accent={ACCENT} accent2={ACCENT2}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 pt-8 pb-20">

        {/* header */}
        <div className="mb-7">
          <h1 className="font-grotesk uppercase text-cream text-[22px] sm:text-[28px] leading-none tracking-tight">
            Token Lock
          </h1>
          <p className="font-mono text-[10px] text-cream/30 mt-1 tracking-wide">
            Time-based locks · transparent on-chain unlock schedules
          </p>
        </div>

        {/* tabs + search */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-0.5 p-1 rounded-full" style={{ background: "rgba(91,79,232,0.07)", border: "1px solid rgba(91,79,232,0.14)" }}>
            {TABS.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className="px-4 py-1.5 rounded-full font-grotesk text-[11px] uppercase tracking-wider transition whitespace-nowrap"
                style={activeTab === t ? { background: ACCENT, color: "#F5F0FF", boxShadow: `0 0 12px ${ACCENT}55` } : { color: "rgba(245,240,255,0.35)" }}
              >{t}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: "rgba(91,79,232,0.05)", border: "1px solid rgba(91,79,232,0.12)" }}>
            <Search className="w-3.5 h-3.5 text-cream/25" strokeWidth={1.5} />
            <input type="text" placeholder="Search by token or address…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent font-mono text-[11px] text-cream/60 placeholder-cream/20 outline-none w-40 sm:w-56" />
          </div>
        </div>

        {/* table */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(91,79,232,0.12)" }}>
          {/* thead */}
          <div className="hidden sm:grid px-5 py-3 text-[9px] font-mono uppercase tracking-[0.2em] text-cream/20"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px", borderBottom: "1px solid rgba(91,79,232,0.08)", background: "rgba(91,79,232,0.03)" }}>
            <div>Token</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Value</div>
            <div className="text-right">Lock Date</div>
            <div className="text-right">Unlock Date</div>
            <div />
          </div>

          {/* empty */}
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}22` }}>
              <LockKeyhole className="w-4 h-4 text-cream/25" strokeWidth={1.5} />
            </div>
            <p className="font-grotesk uppercase text-cream/40 text-[13px] tracking-wider">
              {activeTab === "My Locks" ? "No locks found" : "No locks yet"}
            </p>
            <p className="font-mono text-[10px] text-cream/20 mt-1.5 max-w-[200px]">
              {activeTab === "My Locks" ? "Connect your wallet to see your locks." : "Locks will appear once the protocol launches."}
            </p>
          </div>
        </div>

        {/* create lock CTA — subtle, below table */}
        <div className="mt-6 flex items-center justify-between px-5 py-4 rounded-xl"
          style={{ border: "1px solid rgba(91,79,232,0.1)", background: "rgba(91,79,232,0.04)" }}>
          <div>
            <p className="font-grotesk uppercase text-cream/70 text-[12px] tracking-wider">Create a lock</p>
            <p className="font-mono text-[10px] text-cream/30 mt-0.5">Secure tokens with a time-based release schedule.</p>
          </div>
          <button className="rounded-full px-4 py-2 font-grotesk text-[10px] uppercase tracking-wider transition hover:opacity-85"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, color: "#F5F0FF" }}>
            New Lock
          </button>
        </div>
      </div>
    </AppShell>
  );
}
