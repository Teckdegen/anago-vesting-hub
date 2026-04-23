import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Timer } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/vesting")({
  component: VestingPage,
  head: () => ({
    meta: [
      { title: "Vesting — The Dog House" },
      { name: "description", content: "Manage vesting schedules on Monad." },
    ],
  }),
});

const ACCENT = "#7C5CBF";
const ACCENT2 = "#5A3F8F";
const TABS = ["All Schedules", "My Schedules", "Claimable"] as const;
type Tab = typeof TABS[number];

function VestingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All Schedules");
  const [search, setSearch] = useState("");

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 pt-8 pb-20">

        {/* header */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-7">
          <div>
            <h1 className="font-grotesk uppercase text-cream text-[22px] sm:text-[28px] leading-none tracking-tight">
              Vesting
            </h1>
            <p className="font-mono text-[10px] text-cream/65 mt-1 tracking-wide">
              Linear &amp; cliff vesting · teams, investors, contributors
            </p>
          </div>
          <button
            className="rounded-md px-5 py-2 font-grotesk text-[10px] uppercase tracking-wider transition hover:bg-[rgba(124,92,191,0.35)] active:scale-[0.98]"
            style={{ background: "rgba(90,63,143,0.25)", color: "#C4A8F0", border: "1px solid rgba(124,92,191,0.45)" }}
          >
            New Schedule
          </button>
        </div>

        {/* tabs + search */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-0.5 p-1 rounded-full" style={{ background: "rgba(124,92,191,0.12)", border: "1px solid rgba(124,92,191,0.28)" }}>
            {TABS.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className="px-4 py-1.5 rounded-full font-grotesk text-[11px] uppercase tracking-wider transition whitespace-nowrap"
                style={activeTab === t ? { background: "rgba(124,92,191,0.35)", color: "#F5F0FF", border: "1px solid rgba(124,92,191,0.6)" } : { color: "rgba(245,240,255,0.5)" }}
              >{t}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: "rgba(124,92,191,0.1)", border: "1px solid rgba(124,92,191,0.25)" }}>
            <Search className="w-3.5 h-3.5 text-cream/60" strokeWidth={1.5} />
            <input type="text" placeholder="Search by token or recipient…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent font-mono text-[11px] text-cream/80 placeholder-cream/40 outline-none w-40 sm:w-56" />
          </div>
        </div>

        {/* table */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(124,92,191,0.25)" }}>
          {/* thead */}
          <div className="hidden sm:grid px-5 py-3 text-[9px] font-mono uppercase tracking-[0.2em] text-cream/55"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px", borderBottom: "1px solid rgba(124,92,191,0.12)", background: "rgba(124,92,191,0.1)" }}>
            <div>Recipient</div>
            <div className="text-right">Token</div>
            <div className="text-right">Total</div>
            <div className="text-right">Vested</div>
            <div className="text-right">End Date</div>
            <div />
          </div>

          {/* empty */}
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "rgba(124,92,191,0.15)", border: "1px solid rgba(124,92,191,0.3)" }}>
              <Timer className="w-4 h-4 text-cream/60" strokeWidth={1.5} />
            </div>
            <p className="font-grotesk uppercase text-cream/75 text-[13px] tracking-wider">
              {activeTab === "My Schedules" ? "No schedules found" : activeTab === "Claimable" ? "Nothing to claim" : "No schedules yet"}
            </p>
            <p className="font-mono text-[10px] text-cream/55 mt-1.5 max-w-[200px]">
              {activeTab === "My Schedules" ? "Connect your wallet to see your schedules." : "Vesting schedules will appear once the protocol launches."}
            </p>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
