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

const TABS = ["All Schedules", "My Schedules", "Claimable"] as const;
type Tab = typeof TABS[number];

function VestingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All Schedules");
  const [search, setSearch] = useState("");

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 pt-8 pb-20">

        {/* header */}
        <div className="flex items-center justify-between gap-3 mb-7">
          <div>
            <h1 className="font-grotesk uppercase text-[22px] sm:text-[28px] leading-none tracking-tight" style={{ color: "#fff" }}>
              Vesting
            </h1>
            <p className="font-mono text-[10px] mt-1 tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>
              Linear &amp; cliff vesting · teams, investors, contributors
            </p>
          </div>
          <button
            className="shrink-0 rounded-full px-3 py-1 font-grotesk text-[10px] uppercase tracking-wider transition active:scale-[0.97]"
            style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            + New
          </button>
        </div>

        {/* tabs + search */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div
            className="flex items-center gap-0.5 p-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="px-4 py-1.5 rounded-full font-grotesk text-[11px] uppercase tracking-wider transition whitespace-nowrap"
                style={
                  activeTab === t
                    ? { background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }
                    : { color: "rgba(255,255,255,0.5)" }
                }
              >
                {t}
              </button>
            ))}
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Search className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search by token or recipient…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent font-mono text-[11px] outline-none w-40 sm:w-56"
              style={{ color: "#fff" }}
            />
          </div>
        </div>

        {/* table */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          {/* thead */}
          <div
            className="hidden sm:grid px-5 py-3 text-[9px] font-mono uppercase tracking-[0.2em]"
            style={{
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            <div>Recipient</div>
            <div className="text-right">Token</div>
            <div className="text-right">Total</div>
            <div className="text-right">Vested</div>
            <div className="text-right">End Date</div>
            <div />
          </div>

          {/* empty */}
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <Timer className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} strokeWidth={1.5} />
            </div>
            <p className="font-grotesk uppercase text-[13px] tracking-wider" style={{ color: "#fff" }}>
              {activeTab === "My Schedules" ? "No schedules found" : activeTab === "Claimable" ? "Nothing to claim" : "No schedules yet"}
            </p>
            <p className="font-mono text-[10px] mt-1.5 max-w-[200px]" style={{ color: "rgba(255,255,255,0.5)" }}>
              {activeTab === "My Schedules" ? "Connect your wallet to see your schedules." : "Vesting schedules will appear once the protocol launches."}
            </p>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
