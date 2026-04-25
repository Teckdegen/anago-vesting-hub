import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, LockKeyhole, Trophy } from "lucide-react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { AppShell } from "@/components/AppShell";
import { CreateLockDialog } from "@/components/CreateLockDialog";
import { NewActionCTA } from "@/components/NewActionCTA";
import {
  useUserLocks,
  useAllLocks,
  useLockLeaderboards,
  useContractAddresses,
} from "@/lib/web3/hooks";
import { TOKEN_LOCK_ABI } from "@/lib/web3/contracts";
import { getTokenList } from "@/lib/web3/tokens";
import { formatAmount, formatDate, shortAddr, timeUntil } from "@/lib/web3/format";
import { useChainId } from "wagmi";

export const Route = createFileRoute("/lock")({
  component: LockPage,
  head: () => ({
    meta: [
      { title: "Token Lock — The Dog House" },
      { name: "description", content: "Lock tokens with confidence on Monad." },
    ],
  }),
});

const ACCENT = "#9B7FD4";
const TABS = [
  "All Locks",
  "My Locks",
  "Unlocking Soon",
  "Token Leaderboard",
  "User Leaderboard",
] as const;
type Tab = (typeof TABS)[number];

const THREE_DAYS = 3 * 86400;

function RankBadge({ rank }: { rank: number }) {
  const styles: Record<number, { bg: string; color: string }> = {
    1: { bg: "rgba(255,215,0,0.15)", color: "#FFD700" },
    2: { bg: "rgba(192,192,192,0.15)", color: "#C0C0C0" },
    3: { bg: "rgba(205,127,50,0.15)", color: "#CD7F32" },
  };
  const s = styles[rank] ?? { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" };
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full font-grotesk text-[10px]"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}55` }}
    >
      {rank}
    </span>
  );
}

function useTokenMeta() {
  const chainId = useChainId();
  const list = getTokenList(chainId);
  return (addr: string) =>
    list.find((t) => t.address.toLowerCase() === addr.toLowerCase());
}

// Reads symbol + decimals on-chain for a token address (fallback when not in static list)
function useOnChainTokenInfo(address: `0x${string}` | undefined) {
  const reads = useReadContracts({
    allowFailure: true,
    contracts: address ? [
      { address, abi: ERC20_ABI, functionName: "symbol" as const },
      { address, abi: ERC20_ABI, functionName: "decimals" as const },
    ] : [],
    query: { enabled: !!address },
  });
  return {
    symbol: (reads.data?.[0]?.result as string | undefined),
    decimals: (reads.data?.[1]?.result as number | undefined),
  };
}

function LockRow({
  lockId,
  token,
  owner,
  amount,
  unlockAt,
  withdrawn,
  isLast,
}: {
  lockId: bigint;
  token: `0x${string}`;
  owner: `0x${string}`;
  amount: bigint;
  unlockAt: bigint;
  withdrawn: boolean;
  isLast: boolean;
}) {
  const tokenMeta = useTokenMeta()(token);
  const { tokenLock } = useContractAddresses();
  const { address } = useAccount();
  const symbol = tokenMeta?.symbol ?? `${token.slice(0, 6)}…`;
  const decimals = tokenMeta?.decimals ?? 18;
  const unlocked = Number(unlockAt) <= Math.floor(Date.now() / 1000);
  const isOwner = !!address && address.toLowerCase() === owner.toLowerCase();

  const tx = useWriteContract();
  const rcpt = useWaitForTransactionReceipt({ hash: tx.data });

  const onWithdraw = () => {
    tx.writeContract({
      address: tokenLock,
      abi: TOKEN_LOCK_ABI,
      functionName: "withdraw",
      args: [lockId],
    });
  };

  return (
    <div
      className="grid sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_100px] grid-cols-2 gap-2 px-5 py-3.5 items-center hover:bg-white/[0.03] transition-colors"
      style={{ borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center font-grotesk text-[10px]"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}
        >
          {symbol[0]}
        </div>
        <div className="min-w-0">
          <p className="font-grotesk uppercase text-[12px] tracking-wider truncate" style={{ color: "#fff" }}>{symbol}</p>
          <p className="font-mono text-[9px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
            #{lockId.toString()} · {shortAddr(owner)}{isOwner ? " (you)" : ""}
          </p>
        </div>
      </div>
      <div className="text-right font-grotesk text-[12px] tabular-nums" style={{ color: "rgba(255,255,255,0.9)" }}>
        {formatAmount(amount, decimals)}
      </div>
      <div className="hidden sm:block text-right font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>—</div>
      <div className="hidden sm:block text-right font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>
        {formatDate(unlockAt)}
      </div>
      <div className="hidden sm:block text-right font-mono text-[10px]" style={{ color: unlocked ? "#9be8a4" : "rgba(255,255,255,0.55)" }}>
        {timeUntil(unlockAt)}
      </div>
      <div className="text-right">
        {withdrawn ? (
          <span className="font-mono text-[9px] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>Withdrawn</span>
        ) : unlocked && isOwner ? (
          <button
            onClick={onWithdraw}
            disabled={tx.isPending || rcpt.isLoading}
            className="px-3 py-1 rounded-full font-grotesk text-[10px] uppercase tracking-wider disabled:opacity-50"
            style={{ background: "rgba(155,127,212,0.25)", color: "#EDE0FF", border: "1px solid rgba(155,127,212,0.6)" }}
          >
            {tx.isPending || rcpt.isLoading ? "…" : "Withdraw"}
          </button>
        ) : (
          <span className="font-mono text-[9px] uppercase" style={{ color: unlocked ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.35)" }}>
            {unlocked ? "Unlocked" : "Locked"}
          </span>
        )}
      </div>
    </div>
  );
}

function LockPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All Locks");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const { address } = useAccount();
  const { locks } = useUserLocks();
  const { locks: allLocks } = useAllLocks();
  const { tokens: tokenLb, users: userLb } = useLockLeaderboards();
  const tokenMeta = useTokenMeta();

  const filteredMyLocks = useMemo(() => {
    let l = locks;
    if (search) {
      const s = search.toLowerCase();
      l = l.filter(
        (x) =>
          x.token.toLowerCase().includes(s) ||
          (tokenMeta(x.token)?.symbol.toLowerCase() ?? "").includes(s),
      );
    }
    return l;
  }, [locks, search, tokenMeta]);

  const unlockingSoon = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    return locks.filter(
      (l) => !l.withdrawn && Number(l.unlockAt) - now <= THREE_DAYS && Number(l.unlockAt) > now,
    );
  }, [locks]);

  const totalLockedAcrossTokens =
    tokenLb.reduce((acc, t) => acc + t.amount, 0n) || 1n;

  const showSearch =
    activeTab !== "Token Leaderboard" && activeTab !== "User Leaderboard";

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 pt-8 pb-20">
        <div className="flex items-center justify-between gap-3 mb-7">
          <div>
            <h1 className="font-grotesk uppercase text-[22px] sm:text-[28px] leading-none tracking-tight" style={{ color: "#fff" }}>
              Token Lock
            </h1>
            <p className="font-mono text-[10px] mt-1 tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>
              Time-based locks · transparent on-chain unlock schedules
            </p>
          </div>
          {showSearch && <NewActionCTA label="New Lock" onClick={() => setShowCreate(true)} />}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div
            className="flex items-center gap-0.5 p-1 rounded-full overflow-x-auto max-w-full"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="px-4 py-1.5 rounded-full font-grotesk text-[11px] uppercase tracking-wider transition whitespace-nowrap"
                style={
                  activeTab === t
                    ? { background: "rgba(255,255,255,0.12)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.25)" }
                    : { color: "rgba(255,255,255,0.5)" }
                }
              >
                {t}
              </button>
            ))}
          </div>
          {showSearch && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Search className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search by token or address…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent font-mono text-[11px] outline-none w-40 sm:w-56"
                style={{ color: "#fff" }}
              />
            </div>
          )}
        </div>

        {/* TOKEN LEADERBOARD */}
        {activeTab === "Token Leaderboard" && (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <div
              className="hidden sm:grid px-5 py-3 text-[9px] font-mono uppercase tracking-[0.2em]"
              style={{
                gridTemplateColumns: "40px 2fr 1fr 1fr",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              <div>#</div>
              <div>Token</div>
              <div className="text-right">Total Locked</div>
              <div className="text-right">Share</div>
            </div>
            {tokenLb.length === 0 ? (
              <EmptyLeaderboard label="No tokens locked yet" />
            ) : (
              tokenLb.map((row, i) => {
                const meta = tokenMeta(row.address);
                const sym = meta?.symbol ?? `${row.address.slice(0, 6)}…`;
                const dec = meta?.decimals ?? 18;
                const pct = Number((row.amount * 10000n) / totalLockedAcrossTokens) / 100;
                return (
                  <div
                    key={row.address}
                    className="grid sm:grid-cols-[40px_2fr_1fr_1fr] grid-cols-[40px_1fr_1fr] px-5 py-3.5 items-center hover:bg-white/[0.03] transition-colors"
                    style={{ borderBottom: i < tokenLb.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                  >
                    <RankBadge rank={i + 1} />
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-grotesk text-[10px] shrink-0"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}
                      >
                        {sym[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-grotesk uppercase text-[12px] tracking-wider" style={{ color: "#fff" }}>{sym}</p>
                        <p className="font-mono text-[9px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{row.address}</p>
                      </div>
                    </div>
                    <div className="text-right font-grotesk text-[12px] tabular-nums" style={{ color: "rgba(255,255,255,0.9)" }}>
                      {formatAmount(row.amount, dec)}
                    </div>
                    <div className="hidden sm:flex items-center justify-end gap-2">
                      <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: ACCENT }} />
                      </div>
                      <span className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* USER LEADERBOARD */}
        {activeTab === "User Leaderboard" && (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <div
              className="hidden sm:grid px-5 py-3 text-[9px] font-mono uppercase tracking-[0.2em]"
              style={{
                gridTemplateColumns: "40px 2fr 1fr 1fr",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              <div>#</div>
              <div>Locker</div>
              <div className="text-right">Locks</div>
              <div className="text-right">Total Locked</div>
            </div>
            {userLb.length === 0 ? (
              <EmptyLeaderboard label="No lockers yet" />
            ) : (
              userLb.map((row, i) => {
                // Count how many locks this user has from allLocks
                const userLockCount = allLocks.filter(
                  (l) => l.owner.toLowerCase() === row.address.toLowerCase()
                ).length;
                const isMe = address?.toLowerCase() === row.address.toLowerCase();
                return (
                  <div
                    key={row.address}
                    className="grid sm:grid-cols-[40px_2fr_1fr_1fr] grid-cols-[40px_1fr_1fr] px-5 py-3.5 items-center hover:bg-white/[0.03] transition-colors"
                    style={{ borderBottom: i < userLb.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                  >
                    <RankBadge rank={i + 1} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-[11px] truncate" style={{ color: "#fff" }}>{shortAddr(row.address)}</p>
                        {isMe && (
                          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(155,127,212,0.2)", color: "#C4A8F0", border: "1px solid rgba(155,127,212,0.4)" }}>
                            you
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {row.address}
                      </p>
                    </div>
                    <div className="hidden sm:block text-right font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {userLockCount > 0 ? userLockCount : "—"}
                    </div>
                    <div className="text-right">
                      <p className="font-grotesk text-[12px] tabular-nums" style={{ color: "rgba(255,255,255,0.9)" }}>
                        {row.amount.toString()}
                      </p>
                      <p className="font-mono text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>raw units</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* MY LOCKS / UNLOCKING SOON / ALL */}
        {(activeTab === "All Locks" ||
          activeTab === "My Locks" ||
          activeTab === "Unlocking Soon") && (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <div
              className="hidden sm:grid px-5 py-3 text-[9px] font-mono uppercase tracking-[0.2em]"
              style={{
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              <div>Token</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Value</div>
              <div className="text-right">Unlock Date</div>
              <div className="text-right">Time Left</div>
              <div />
            </div>

            {(() => {
              const rows =
                activeTab === "Unlocking Soon"
                  ? unlockingSoon
                  : activeTab === "My Locks"
                    ? filteredMyLocks
                    : allLocks.filter((l) => {
                        if (!search) return true;
                        const s = search.toLowerCase();
                        return (
                          l.token.toLowerCase().includes(s) ||
                          l.owner.toLowerCase().includes(s) ||
                          (tokenMeta(l.token)?.symbol.toLowerCase() ?? "").includes(s)
                        );
                      });
              if (activeTab !== "All Locks" && !address) {
                return (
                  <Empty
                    title="Wallet not connected"
                    sub="Connect your wallet to see your locks."
                  />
                );
              }
              if (rows.length === 0) {
                return (
                  <Empty
                    title={
                      activeTab === "Unlocking Soon"
                        ? "Nothing unlocking in the next 3 days"
                        : "No locks yet"
                    }
                    sub={
                      activeTab === "Unlocking Soon"
                        ? "Locks unlocking within 72 hours show up here."
                        : "Hit + New to create your first lock."
                    }
                  />
                );
              }
              return rows.map((l, i) => (
                <LockRow
                  key={l.id.toString()}
                  lockId={l.id}
                  token={l.token}
                  owner={l.owner}
                  amount={l.amount}
                  unlockAt={l.unlockAt}
                  withdrawn={l.withdrawn}
                  isLast={i === rows.length - 1}
                />
              ));
            })()}
          </div>
        )}
      </div>

      <CreateLockDialog open={showCreate} onClose={() => setShowCreate(false)} />
    </AppShell>
  );
}

function Empty({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}
      >
        <LockKeyhole className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} strokeWidth={1.5} />
      </div>
      <p className="font-grotesk uppercase text-[13px] tracking-wider" style={{ color: "#fff" }}>{title}</p>
      <p className="font-mono text-[10px] mt-1.5 max-w-[260px]" style={{ color: "rgba(255,255,255,0.5)" }}>
        {sub}
      </p>
    </div>
  );
}

function EmptyLeaderboard({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <Trophy className="w-8 h-8 mb-3" style={{ color: "rgba(255,255,255,0.3)" }} strokeWidth={1} />
      <p className="font-grotesk uppercase text-[12px] tracking-wider" style={{ color: "#fff" }}>{label}</p>
      <p className="font-mono text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
        Leaderboard populates as tokens get locked.
      </p>
    </div>
  );
}
