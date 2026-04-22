import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Timer, Plus, TrendingUp, Users, ChevronRight, Coins } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/vesting")({
  component: VestingPage,
  head: () => ({
    meta: [
      { title: "Vesting — The Dog House" },
      { name: "description", content: "Manage vesting schedules for teams, investors and contributors on Monad." },
    ],
  }),
});

const ACCENT = "#9B7FD4";
const ACCENT2 = "#7C5CBF";

const TABS = ["All Schedules", "Active", "Claimable", "Completed"] as const;
type Tab = typeof TABS[number];

function VestingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All Schedules");

  return (
    <AppShell accent={ACCENT} accent2={ACCENT2}>
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 pt-10 pb-24">

        {/* page header */}
        <div className="flex items-start justify-between flex-wrap gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${ACCENT}33`, border: `1px solid ${ACCENT}55` }}
              >
                <Timer className="w-4 h-4" style={{ color: ACCENT }} strokeWidth={1.5} />
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-cream/40">Vesting</span>
            </div>
            <h1 className="font-grotesk uppercase text-cream text-[32px] sm:text-[44px] leading-none tracking-tight">
              Vesting Schedules
            </h1>
            <p className="font-mono text-[12px] text-cream/40 mt-2 tracking-wide">
              Linear and cliff vesting for teams, investors, and contributors.
            </p>
          </div>
          <button
            className="flex items-center gap-2 rounded-full px-5 py-3 font-grotesk text-[12px] uppercase tracking-wider transition hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, color: "#F5F0FF", boxShadow: `0 4px 20px ${ACCENT}55` }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Schedule
          </button>
        </div>

        {/* summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {[
            { icon: Timer, label: "Active Schedules", value: "0", sub: "running" },
            { icon: Coins, label: "Claimable Now", value: "$0", sub: "ready to claim" },
            { icon: TrendingUp, label: "Total Allocated", value: "$0", sub: "under vesting" },
            { icon: Users, label: "Recipients", value: "0", sub: "addresses" },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="rounded-[16px] p-5 border border-white/[0.06] bg-white/[0.02]"
              >
                <Icon className="w-4 h-4 mb-3 text-cream/30" strokeWidth={1.5} />
                <p className="font-grotesk text-cream text-[28px] leading-none">{c.value}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cream/40 mt-2">{c.label}</p>
                <p className="font-mono text-[10px] text-cream/25 mt-0.5">{c.sub}</p>
              </div>
            );
          })}
        </div>

        {/* tabs */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.06] w-fit mb-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="px-4 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition"
              style={
                activeTab === t
                  ? { background: ACCENT, color: "#F5F0FF", boxShadow: `0 0 14px ${ACCENT}88` }
                  : { color: "rgba(245,240,255,0.5)" }
              }
            >
              {t}
            </button>
          ))}
        </div>

        {/* table */}
        <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-cream/30 border-b border-white/[0.05]">
            <div className="col-span-3">Recipient</div>
            <div className="col-span-2">Token</div>
            <div className="col-span-2">Total Amount</div>
            <div className="col-span-2">Vested</div>
            <div className="col-span-2">Cliff / End</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {/* empty state */}
          <div className="py-20 flex flex-col items-center justify-center text-center px-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: `${ACCENT}22`, border: `1px solid ${ACCENT}33` }}
            >
              <Timer className="w-6 h-6" style={{ color: ACCENT }} strokeWidth={1.5} />
            </div>
            <p className="font-grotesk text-cream text-[15px]">No vesting schedules</p>
            <p className="font-mono text-[11px] text-cream/40 mt-1.5 max-w-xs">
              Create a schedule for your team, investors, or contributors.
            </p>
            <button
              className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-grotesk uppercase tracking-wider transition hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, color: "#F5F0FF", boxShadow: `0 4px 20px ${ACCENT}44` }}
            >
              <Plus className="w-3.5 h-3.5" />
              Create Schedule
            </button>
          </div>
        </div>

        {/* vesting types */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              title: "Linear Vesting",
              desc: "Tokens unlock continuously over the vesting period. Recipients can claim at any time as tokens become available.",
              tag: "Smooth release",
            },
            {
              title: "Cliff + Linear",
              desc: "A cliff period where nothing unlocks, followed by linear vesting. Common for team and investor allocations.",
              tag: "Standard for teams",
            },
          ].map((v) => (
            <div key={v.title} className="rounded-[16px] p-6 border border-white/[0.05] bg-white/[0.015] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="font-grotesk uppercase text-cream text-[13px] tracking-wider">{v.title}</p>
                <span
                  className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: `${ACCENT}22`, color: ACCENT, border: `1px solid ${ACCENT}44` }}
                >
                  {v.tag}
                </span>
              </div>
              <p className="font-mono text-[11px] text-cream/40 leading-relaxed">{v.desc}</p>
              <button className="mt-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest transition hover:opacity-80" style={{ color: ACCENT }}>
                Create <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
