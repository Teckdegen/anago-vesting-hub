import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LockKeyhole, Plus, Clock, Unlock, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/lock")({
  component: LockPage,
  head: () => ({
    meta: [
      { title: "Token Lock — The Dog House" },
      { name: "description", content: "Lock tokens with confidence on Monad. Track your locked positions and unlock schedules." },
    ],
  }),
});

const ACCENT = "#5B4FE8";
const ACCENT2 = "#9B7FD4";

const TABS = ["All Locks", "Active", "Unlocking Soon", "Released"] as const;
type Tab = typeof TABS[number];

function LockPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All Locks");

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
                <LockKeyhole className="w-4 h-4" style={{ color: ACCENT }} strokeWidth={1.5} />
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-cream/40">Token Lock</span>
            </div>
            <h1 className="font-grotesk uppercase text-cream text-[32px] sm:text-[44px] leading-none tracking-tight">
              Lock Tokens
            </h1>
            <p className="font-mono text-[12px] text-cream/40 mt-2 tracking-wide">
              Time-based locks with transparent on-chain unlock schedules.
            </p>
          </div>
          <button
            className="flex items-center gap-2 rounded-full px-5 py-3 font-grotesk text-[12px] uppercase tracking-wider transition hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, color: "#F5F0FF", boxShadow: `0 4px 20px ${ACCENT}55` }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Lock
          </button>
        </div>

        {/* summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {[
            { icon: LockKeyhole, label: "Active Locks", value: "0", sub: "positions" },
            { icon: Clock, label: "Unlocking Soon", value: "0", sub: "next 7 days" },
            { icon: Unlock, label: "Released", value: "$0", sub: "total value" },
            { icon: LockKeyhole, label: "Total Locked", value: "$0", sub: "USD value" },
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
            <div className="col-span-3">Token</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Lock Date</div>
            <div className="col-span-2">Unlock Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {/* empty state */}
          <div className="py-20 flex flex-col items-center justify-center text-center px-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: `${ACCENT}22`, border: `1px solid ${ACCENT}33` }}
            >
              <LockKeyhole className="w-6 h-6" style={{ color: ACCENT }} strokeWidth={1.5} />
            </div>
            <p className="font-grotesk text-cream text-[15px]">No locked tokens yet</p>
            <p className="font-mono text-[11px] text-cream/40 mt-1.5 max-w-xs">
              Create your first lock to secure tokens with a time-based release schedule.
            </p>
            <button
              className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-grotesk uppercase tracking-wider transition hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, color: "#F5F0FF", boxShadow: `0 4px 20px ${ACCENT}44` }}
            >
              <Plus className="w-3.5 h-3.5" />
              Create Lock
            </button>
          </div>
        </div>

        {/* how it works */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { step: "01", title: "Choose Token", desc: "Select the token you want to lock and specify the amount." },
            { step: "02", title: "Set Duration", desc: "Pick an unlock date. Tokens are locked on-chain until that time." },
            { step: "03", title: "Confirm Lock", desc: "Sign the transaction. Your lock is visible on-chain immediately." },
          ].map((s) => (
            <div key={s.step} className="rounded-[16px] p-6 border border-white/[0.05] bg-white/[0.015] flex gap-4">
              <span className="font-grotesk text-[11px] tracking-widest mt-0.5" style={{ color: ACCENT }}>{s.step}</span>
              <div>
                <p className="font-grotesk uppercase text-cream text-[13px] tracking-wider mb-1">{s.title}</p>
                <p className="font-mono text-[11px] text-cream/40 leading-relaxed">{s.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-cream/20 ml-auto shrink-0 mt-0.5" />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
