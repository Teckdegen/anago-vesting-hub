
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Timer } from "lucide-react";
import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { AppShell } from "@/components/AppShell";
import { CreateVestingDialog } from "@/components/CreateVestingDialog";
import { useUserVestings } from "@/lib/web3/hooks";
import { VESTING_WALLET_ABI } from "@/lib/web3/contracts";
import { ERC20_ABI } from "@/lib/web3/tokens";
import { formatAmount, shortAddr } from "@/lib/web3/format";

export const Route = createFileRoute("/vesting")({
  component: VestingPage,
  head: () => ({
    meta: [
      { title: "Vesting — The Dog House" },
      { name: "description", content: "Manage vesting schedules on Monad." },
    ],
  }),
});

const TABS = ["My Schedules", "Claimable"] as const;
type Tab = typeof TABS[number];
const ZERO = "0x0000000000000000000000000000000000000000" as `0x${string}`;

type WalletDetail = {
  address: `0x${string}`;
  owner: `0x${string}`;
  end: bigint;
  token: `0x${string}`;
  tokenSymbol: string;
  tokenDecimals: number;
  releasable: bigint;
};

function VestingRow({ wallet, isLast, onClaimed }: { wallet: WalletDetail; isLast: boolean; onClaimed: () => void }) {
  const tx = useWriteContract();
  const rcpt = useWaitForTransactionReceipt({ hash: tx.data });
  const isErc20 = wallet.token !== ZERO;

  if (rcpt.isSuccess) {
    onClaimed();
  }

  const release = () => {
    if (isErc20) {
      tx.writeContract({ address: wallet.address, abi: VESTING_WALLET_ABI, functionName: "release", args: [wallet.token] });
    } else {
      tx.writeContract({ address: wallet.address, abi: VESTING_WALLET_ABI, functionName: "release", args: [] });
    }
  };

  const now = Math.floor(Date.now() / 1000);
  const ended = Number(wallet.end) <= now;
  const endDate = wallet.end ? new Date(Number(wallet.end) * 1000).toLocaleDateString() : "—";

  return (
    <div className="grid sm:grid-cols-[2fr_1fr_1fr_1fr_100px] grid-cols-[2fr_1fr_100px] gap-2 px-5 py-3.5 items-center hover:bg-white/[0.03] transition-colors"
      style={{ borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
      <div className="min-w-0">
        <p className="font-grotesk uppercase text-[12px] tracking-wider truncate" style={{ color: "#fff" }}>{shortAddr(wallet.owner)}</p>
        <p className="font-mono text-[9px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{shortAddr(wallet.address)}</p>
      </div>
      <div className="hidden sm:block text-right font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>{wallet.tokenSymbol}</div>
      <div className="text-right font-grotesk text-[12px] tabular-nums" style={{ color: "rgba(255,255,255,0.9)" }}>
        {formatAmount(wallet.releasable, wallet.tokenDecimals)}
      </div>
      <div className="hidden sm:block text-right font-mono text-[10px]" style={{ color: ended ? "rgba(100,220,100,0.8)" : "rgba(255,255,255,0.5)" }}>{endDate}</div>
      <div className="text-right">
        {wallet.releasable > 0n ? (
          <button onClick={release} disabled={tx.isPending || rcpt.isLoading}
            className="px-3 py-1 rounded-full font-grotesk text-[10px] uppercase tracking-wider disabled:opacity-50 transition"
            style={{ background: "rgba(155,127,212,0.25)", color: "#EDE0FF", border: "1px solid rgba(155,127,212,0.6)" }}>
            {tx.isPending || rcpt.isLoading ? "…" : "Claim"}
          </button>
        ) : (
          <span className="font-mono text-[9px] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
            {ended ? "Done" : "Vesting"}
          </span>
        )}
      </div>
    </div>
  );
}

function VestingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("My Schedules");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const { address } = useAccount();
  const { wallets, walletTokens, isLoading } = useUserVestings();

  // Multicall: owner, end, releasable(token), token symbol, token decimals
  const reads = useReadContracts({
    allowFailure: true,
    contracts: wallets.flatMap((w) => {
      const tok = walletTokens[w] ?? ZERO;
      const isErc20 = tok !== ZERO;
      return [
        { address: w, abi: VESTING_WALLET_ABI, functionName: "owner" as const },
        { address: w, abi: VESTING_WALLET_ABI, functionName: "end" as const },
        // releasable: ERC-20 takes token arg, native takes no args
        isErc20
          ? { address: w, abi: VESTING_WALLET_ABI, functionName: "releasable" as const, args: [tok] as const }
          : { address: w, abi: VESTING_WALLET_ABI, functionName: "releasable" as const, args: [] as const },
        // symbol
        isErc20
          ? { address: tok, abi: ERC20_ABI, functionName: "symbol" as const }
          : { address: w, abi: VESTING_WALLET_ABI, functionName: "owner" as const }, // placeholder
        // decimals
        isErc20
          ? { address: tok, abi: ERC20_ABI, functionName: "decimals" as const }
          : { address: w, abi: VESTING_WALLET_ABI, functionName: "owner" as const }, // placeholder
      ];
    }),
    query: { enabled: wallets.length > 0 },
  });

  const details = useMemo<WalletDetail[]>(() => {
    if (!reads.data) return [];
    return wallets.map((w, i) => {
      const o = i * 5;
      const tok = walletTokens[w] ?? ZERO;
      const isErc20 = tok !== ZERO;
      return {
        address: w,
        owner: (reads.data[o]?.result as `0x${string}`) ?? ZERO,
        end: (reads.data[o + 1]?.result as bigint) ?? 0n,
        releasable: (reads.data[o + 2]?.result as bigint) ?? 0n,
        token: tok,
        tokenSymbol: isErc20 ? ((reads.data[o + 3]?.result as string) ?? tok.slice(0, 6)) : "MON",
        tokenDecimals: isErc20 ? ((reads.data[o + 4]?.result as number) ?? 18) : 18,
      };
    });
  }, [wallets, walletTokens, reads.data]);

  const filtered = useMemo(() => {
    let list = details;
    if (activeTab === "Claimable") list = list.filter((w) => w.releasable > 0n);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((w) => w.address.toLowerCase().includes(s) || w.owner.toLowerCase().includes(s) || w.tokenSymbol.toLowerCase().includes(s));
    }
    return list;
  }, [details, activeTab, search]);

  const loading = isLoading || reads.isLoading;

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 pt-8 pb-20">

        <div className="flex items-center justify-between gap-3 mb-7">
          <div>
            <h1 className="font-grotesk uppercase text-[22px] sm:text-[28px] leading-none tracking-tight" style={{ color: "#fff" }}>Vesting</h1>
            <p className="font-mono text-[10px] mt-1 tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>
              Linear &amp; cliff vesting · teams, investors, contributors
            </p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="shrink-0 rounded-full px-3 py-1.5 font-grotesk text-[10px] uppercase tracking-wider transition active:scale-[0.97]"
            style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
            + New
          </button>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-0.5 p-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {TABS.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className="px-4 py-1.5 rounded-full font-grotesk text-[11px] uppercase tracking-wider transition whitespace-nowrap"
                style={activeTab === t ? { background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" } : { color: "rgba(255,255,255,0.5)" }}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Search className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} strokeWidth={1.5} />
            <input type="text" placeholder="Search by address or token…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent font-mono text-[11px] outline-none w-40 sm:w-56" style={{ color: "#fff" }} />
          </div>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="hidden sm:grid px-5 py-3 text-[9px] font-mono uppercase tracking-[0.2em]"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 100px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.45)" }}>
            <div>Recipient</div>
            <div className="text-right">Token</div>
            <div className="text-right">Releasable</div>
            <div className="text-right">End Date</div>
            <div />
          </div>

          {!address ? (
            <Empty title="Wallet not connected" sub="Connect your wallet to see your schedules." />
          ) : loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/70 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <Empty
              title={activeTab === "Claimable" ? "Nothing to claim" : "No schedules yet"}
              sub={activeTab === "Claimable" ? "Nothing is releasable right now." : "Create a vesting schedule with + New."} />
          ) : (
            filtered.map((w, i) => <VestingRow key={w.address} wallet={w} isLast={i === filtered.length - 1} onClaimed={() => reads.refetch()} />)
          )}
        </div>

      </div>
      <CreateVestingDialog open={showCreate} onClose={() => setShowCreate(false)} />
    </AppShell>
  );
}

function Empty({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}>
        <Timer className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} strokeWidth={1.5} />
      </div>
      <p className="font-grotesk uppercase text-[13px] tracking-wider" style={{ color: "#fff" }}>{title}</p>
      <p className="font-mono text-[10px] mt-1.5 max-w-[220px]" style={{ color: "rgba(255,255,255,0.5)" }}>{sub}</p>
    </div>
  );
}
