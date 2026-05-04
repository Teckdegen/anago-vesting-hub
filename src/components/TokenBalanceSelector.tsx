import { useState, useMemo } from "react";
import { Search, Coins, RefreshCw, Check } from "lucide-react";
import { useAllTokenBalances } from "@/lib/web3/hooks";
import type { TokenBalance } from "@/lib/web3/tokenBalances";

type TokenBalanceSelectorProps = {
  onSelect: (token: TokenBalance) => void;
  selectedAddress?: `0x${string}`;
  className?: string;
};

/**
 * Professional token balance selector.
 * Auto-discovers tokens from Monad Explorer — no manual entry needed.
 */
export function TokenBalanceSelector({
  onSelect,
  selectedAddress,
  className = "",
}: TokenBalanceSelectorProps) {
  const { balances, isLoading, error, refetch } = useAllTokenBalances();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return balances;
    const s = search.toLowerCase();
    return balances.filter(
      (token) =>
        token.symbol.toLowerCase().includes(s) ||
        token.name.toLowerCase().includes(s) ||
        token.address.toLowerCase().includes(s),
    );
  }, [balances, search]);

  if (error) {
    return (
      <div
        className={`rounded-2xl p-6 text-center ${className}`}
        style={{
          border: "1px solid rgba(255,100,100,0.25)",
          background: "rgba(255,100,100,0.04)",
        }}
      >
        <p className="font-grotesk font-bold uppercase tracking-wider text-[12px]" style={{ color: "rgba(255,140,140,0.95)" }}>
          Failed to load balances
        </p>
        <p className="mt-1 font-mono text-[10px]" style={{ color: "rgba(255,180,180,0.6)" }}>
          Check your network connection
        </p>
        <button
          onClick={refetch}
          className="mt-4 px-5 py-2 rounded-full font-grotesk font-bold text-[10px] uppercase tracking-widest transition-all hover:scale-105"
          style={{
            background: "rgba(255,100,100,0.15)",
            color: "#FFE5E5",
            border: "1px solid rgba(255,100,100,0.45)",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header row: title + count */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-grotesk font-black uppercase tracking-wider text-[13px]" style={{ color: "#EDE0FF" }}>
            Your Tokens
          </p>
          <p className="font-mono text-[10px] mt-0.5" style={{ color: "rgba(196,168,240,0.55)" }}>
            Auto-detected on Monad
          </p>
        </div>
        {!isLoading && balances.length > 0 && (
          <span
            className="font-grotesk font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(155,127,212,0.12)",
              color: "rgba(196,168,240,0.85)",
              border: "1px solid rgba(155,127,212,0.25)",
            }}
          >
            {balances.length}
          </span>
        )}
      </div>

      {/* Search & Refresh */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors focus-within:border-[rgba(155,127,212,0.55)]"
          style={{
            background: "rgba(155,127,212,0.06)",
            border: "1px solid rgba(155,127,212,0.2)",
          }}
        >
          <Search className="w-3.5 h-3.5" style={{ color: "rgba(196,168,240,0.55)" }} strokeWidth={2} />
          <input
            type="text"
            placeholder="Search by name, symbol or address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent font-mono text-[11px] outline-none placeholder:text-[rgba(196,168,240,0.35)]"
            style={{ color: "#EDE0FF" }}
          />
        </div>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="p-2.5 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          style={{
            background: "rgba(155,127,212,0.12)",
            border: "1px solid rgba(155,127,212,0.3)",
          }}
          title="Refresh balances"
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            style={{ color: "rgba(196,168,240,0.8)" }}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Token List */}
      <div
        className="rounded-2xl overflow-hidden max-h-[400px] overflow-y-auto"
        style={{
          border: "1px solid rgba(155,127,212,0.22)",
          background: "rgba(20,15,35,0.4)",
        }}
      >
        {isLoading && balances.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14">
            <div
              className="w-7 h-7 rounded-full border-2 animate-spin mb-3"
              style={{ borderColor: "rgba(155,127,212,0.18)", borderTopColor: "rgba(196,168,240,0.95)" }}
            />
            <p className="font-grotesk font-bold uppercase tracking-widest text-[10px]" style={{ color: "rgba(237,224,255,0.85)" }}>
              Discovering tokens
            </p>
            <p className="font-mono text-[10px] mt-1" style={{ color: "rgba(196,168,240,0.5)" }}>
              Scanning your wallet…
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
              style={{
                background: "rgba(155,127,212,0.1)",
                border: "1px solid rgba(155,127,212,0.25)",
              }}
            >
              <Coins className="w-5 h-5" style={{ color: "rgba(196,168,240,0.65)" }} strokeWidth={1.75} />
            </div>
            <p className="font-grotesk font-black uppercase tracking-wider text-[12px]" style={{ color: "#EDE0FF" }}>
              {search ? "No matches" : "No tokens yet"}
            </p>
            <p className="font-mono text-[10px] mt-1.5 max-w-[240px] text-center" style={{ color: "rgba(196,168,240,0.55)" }}>
              {search ? "Try a different search term" : "Bridge or receive tokens to get started"}
            </p>
          </div>
        ) : (
          filtered.map((token, i) => {
            const isSelected = selectedAddress?.toLowerCase() === token.address.toLowerCase();
            return (
              <button
                key={token.address}
                onClick={() => onSelect(token)}
                className="w-full flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-[rgba(155,127,212,0.08)] group"
                style={{
                  borderBottom: i < filtered.length - 1 ? "1px solid rgba(155,127,212,0.1)" : "none",
                  background: isSelected ? "rgba(155,127,212,0.14)" : "transparent",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-grotesk font-black text-[12px] shrink-0 relative"
                    style={{
                      background: isSelected
                        ? "linear-gradient(135deg, rgba(155,127,212,0.4), rgba(196,168,240,0.25))"
                        : "rgba(155,127,212,0.15)",
                      border: `1px solid ${isSelected ? "rgba(196,168,240,0.6)" : "rgba(155,127,212,0.3)"}`,
                      color: "#EDE0FF",
                    }}
                  >
                    {token.symbol[0]}
                    {isSelected && (
                      <div
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: "#9B7FD4", border: "2px solid #0a0a0c" }}
                      >
                        <Check className="w-2.5 h-2.5" style={{ color: "#fff" }} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="text-left min-w-0">
                    <p className="font-grotesk font-bold uppercase text-[12px] tracking-wider truncate" style={{ color: "#EDE0FF" }}>
                      {token.symbol}
                    </p>
                    <p className="font-mono text-[10px] truncate" style={{ color: "rgba(196,168,240,0.5)" }}>
                      {token.name}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-grotesk font-bold text-[14px] tabular-nums" style={{ color: "#EDE0FF" }}>
                    {token.balanceFormatted}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(196,168,240,0.45)" }}>
                    Balance
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
