import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, LockKeyhole, Trophy } from "lucide-react";
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

const ACCENT = "#7C5CBF";
const ACCENT2 = "#5A3F8F";
const TABS = ["All Locks", "My Locks", "Unlocking Soon", "Leaderboard"] as const;
type Tab = typeof TABS[number];

// Populated from on-chain data when available
const LEADERBOARD: {
  rank: number;
  token: string;
  symbol: string;
  totalLocked: string;
  lockers: number;
  pct: number;
}[] = [];

function RankBadge({ rank }: { rank: number }) {
  const styles: Record<number, { bg: string; color: string }> = {
    1: { bg: "rgba(255,215,0,0.15)", color: "#FFD700" },
    2: { bg: "rgba(192,192,192,0.15)", color: "#C0C0C0" },
    3: { bg: "rgba(205,127,50,0.15)", color: "#CD7F32" },
  };
  const s = styles[rank] ?? { bg: "rgba(124,92,191,0.1)", color: "rgba(245,240,255,0.4)" };
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full font-grotesk text-[10px]"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}44` }}
    >
      {rank}
    </span>
  );
}

function LockPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All Locks");
  const [search, setSearch] = useState("");

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 pt-8 pb-20">

        {/* page title */}
        <div className="mb-7">
          <h1 className="font-grotesk uppercase text-cream text-[22px] sm:text-[28px] leading-none tracking-tight">
            Token Lock
          </h1>
          <p className="font-mono text-[10px] text-cream/65 mt-1 tracking-wide">
            Time-based locks · transparent on-chain unlock schedules
          </p>
        </div>

        {/* ── LOCKS TABLE ── */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div
            className="flex items-center gap-0.5 p-1 rounded-full"
            style={{ background: "rgba(124,92,191,0.12)", border: "1px solid rgba(124,92,191,0.28)" }}
          >
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="px-4 py-1.5 rounded-full font-grotesk text-[11px] uppercase tracking-wider transition whitespace-nowrap"
                style={
                  activeTab === t
                    ? { background: "rgba(124,92,191,0.35)", color: "#F5F0FF", border: "1px solid rgba(124,92,191,0.6)" }
                    : { color: "rgba(245,240,255,0.5)" }
                }
              >
                {t}
              </button>
            ))}
          </div>
          {activeTab !== "Leaderboard" && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{ background: "rgba(124,92,191,0.1)", border: "1px solid rgba(124,92,191,0.25)" }}
            >
              <Search className="w-3.5 h-3.5 text-cream/60" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search by token or address…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent font-mono text-[11px] text-cream/80 placeholder-cream/40 outline-none w-40 sm:w-56"
              />
            </div>
          )}
        </div>

        {activeTab === "Leaderboard" ? (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(124,92,191,0.25)" }}>
            <div
              className="hidden sm:grid px-5 py-3 text-[9px] font-mono uppercase tracking-[0.2em] text-cream/55"
              style={{
                gridTemplateColumns: "40px 2fr 1fr 1fr 1fr",
                borderBottom: "1px solid rgba(124,92,191,0.15)",
                background: "rgba(124,92,191,0.1)",
              }}
            >
              <div>#</div>
              <div>Token</div>
              <div className="text-right">Total Locked</div>
              <div className="text-right">Lockers</div>
              <div className="text-right">Share</div>
            </div>

            {LEADERBOARD.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <Trophy className="w-8 h-8 text-cream/20 mb-3" strokeWidth={1} />
                <p className="font-grotesk uppercase text-cream/50 text-[12px] tracking-wider">No data yet</p>
                <p className="font-mono text-[10px] text-cream/35 mt-1">
                  Leaderboard populates as tokens get locked.
                </p>
              </div>
            ) : (
              LEADERBOARD.map((row, i) => (
                <div
                  key={row.token}
                  className="grid px-5 py-3.5 items-center hover:bg-white/[0.03] transition-colors"
                  style={{
                    gridTemplateColumns: "40px 2fr 1fr 1fr 1fr",
                    borderBottom: i < LEADERBOARD.length - 1 ? "1px solid rgba(124,92,191,0.1)" : "none",
                  }}
                >
                  <RankBadge rank={row.rank} />
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-grotesk text-[10px] text-cream/70"
                      style={{ background: "rgba(124,92,191,0.18)", border: "1px solid rgba(124,92,191,0.3)" }}
                    >
                      {row.symbol[0]}
                    </div>
                    <div>
                      <p className="font-grotesk uppercase text-cream text-[12px] tracking-wider">{row.symbol}</p>
                      <p className="font-mono text-[9px] text-cream/45 truncate max-w-[120px]">{row.token}</p>
                    </div>
                  </div>
                  <div className="text-right font-grotesk text-cream/90 text-[12px]">{row.totalLocked}</div>
                  <div className="text-right font-mono text-cream/65 text-[11px]">{row.lockers}</div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div
                        className="hidden sm:block w-16 h-1 rounded-full overflow-hidden"
                        style={{ background: "rgba(124,92,191,0.18)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${row.pct}%`, background: ACCENT }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-cream/55">{row.pct}%</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(124,92,191,0.25)" }}>
            <div
              className="hidden sm:grid px-5 py-3 text-[9px] font-mono uppercase tracking-[0.2em] text-cream/55"
              style={{
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px",
                borderBottom: "1px solid rgba(124,92,191,0.15)",
                background: "rgba(124,92,191,0.1)",
              }}
            >
              <div>Token</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Value</div>
              <div className="text-right">Lock Date</div>
              <div className="text-right">Unlock Date</div>
              <div />
            </div>

            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(124,92,191,0.15)", border: "1px solid rgba(124,92,191,0.3)" }}
              >
                <LockKeyhole className="w-4 h-4 text-cream/60" strokeWidth={1.5} />
              </div>
              <p className="font-grotesk uppercase text-cream/75 text-[13px] tracking-wider">
                {activeTab === "My Locks" ? "No locks found" : "No locks yet"}
              </p>
              <p className="font-mono text-[10px] text-cream/55 mt-1.5 max-w-[200px]">
                {activeTab === "My Locks"
                  ? "Connect your wallet to see your locks."
                  : "Locks will appear once the protocol launches."}
              </p>
            </div>
          </div>
        )}

        {/* create lock CTA */}
        {activeTab !== "Leaderboard" && (
          <div
            className="mt-6 flex items-center justify-between px-5 py-4 rounded-xl"
            style={{ border: "1px solid rgba(124,92,191,0.25)", background: "rgba(124,92,191,0.08)" }}
          >
            <div>
              <p className="font-grotesk uppercase text-cream/70 text-[12px] tracking-wider">Create a lock</p>
              <p className="font-mono text-[10px] text-cream/65 mt-0.5">
                Secure tokens with a time-based release schedule.
              </p>
            </div>
            <button
              className="rounded-md px-5 py-2 font-grotesk text-[10px] uppercase tracking-wider transition hover:bg-[rgba(124,92,191,0.35)] active:scale-[0.98]"
              style={{ background: "rgba(90,63,143,0.25)", color: "#C4A8F0", border: "1px solid rgba(124,92,191,0.45)" }}
            >
              New Lock
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
